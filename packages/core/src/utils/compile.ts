import {
    type Abi,
    type AbiEntry,
    type Calldata,
    type FunctionAbi,
    type InterfaceAbi,
    type RawArgs,
    CallData,
    createAbiParser,
    parseCalldataField,
    isNoConstructorValid,
} from "starknet";

function isLen(name: string): boolean {
    return /_len$/.test(name);
}

function isCairo1Type(type: string): boolean {
    return type.includes("::");
}

export function findFunctionAbiByNamespace(
    abi: Abi,
    namespace: string,
    contractName: string,
    functionName: string
): FunctionAbi | undefined {
    const contractPattern = `::${contractName}::`;

    const exactMatch = abi.find((item): item is InterfaceAbi => {
        if (item?.type !== "interface") return false;
        const name = item.name || "";
        if (!name.startsWith(`${namespace}::`)) return false;
        if (!name.includes(contractPattern)) return false;
        return (
            Array.isArray(item.items) &&
            item.items.some(
                (fn: any) =>
                    fn?.type === "function" && fn?.name === functionName
            )
        );
    });

    if (exactMatch) {
        return exactMatch.items.find(
            (fn: any) => fn?.type === "function" && fn?.name === functionName
        ) as FunctionAbi | undefined;
    }

    const namespaceMatch = abi.find((item): item is InterfaceAbi => {
        if (item?.type !== "interface") return false;
        const name = item.name || "";
        if (!name.startsWith(`${namespace}::`)) return false;
        return (
            Array.isArray(item.items) &&
            item.items.some(
                (fn: any) =>
                    fn?.type === "function" && fn?.name === functionName
            )
        );
    });

    if (namespaceMatch) {
        return namespaceMatch.items.find(
            (fn: any) => fn?.type === "function" && fn?.name === functionName
        ) as FunctionAbi | undefined;
    }

    for (const item of abi) {
        if (item?.type === "interface" && Array.isArray(item.items)) {
            const func = item.items.find(
                (fn: any) =>
                    fn?.type === "function" && fn?.name === functionName
            );
            if (func) return func as FunctionAbi;
        }
    }

    return abi.find(
        (item) => item?.type === "function" && item?.name === functionName
    ) as FunctionAbi | undefined;
}

export function compileDojoCalldata(
    abi: Abi,
    namespace: string,
    contractName: string,
    method: string,
    argsCalldata: RawArgs
): Calldata {
    const structs = CallData.getAbiStruct(abi);
    const enums = CallData.getAbiEnum(abi);
    const parser = createAbiParser(abi);

    const abiMethod = findFunctionAbiByNamespace(
        abi,
        namespace,
        contractName,
        method
    );

    if (isNoConstructorValid(method, argsCalldata, abiMethod)) {
        return [];
    }

    if (!abiMethod) {
        throw new Error(
            `Method "${method}" not found in ABI for namespace "${namespace}", contract "${contractName}"`
        );
    }

    let args: any[];
    if (Array.isArray(argsCalldata)) {
        const expectedCount = abiMethod.inputs.filter(
            (input) => !isLen(input.name)
        ).length;
        if (argsCalldata.length !== expectedCount) {
            throw new Error(
                `Expected ${expectedCount} arguments for method "${method}", got ${argsCalldata.length}`
            );
        }
        args = argsCalldata;
    } else {
        args = abiMethod.inputs
            .filter((input) => !isLen(input.name))
            .map((input) => {
                const value = (argsCalldata as Record<string, unknown>)[
                    input.name
                ];
                if (value === undefined) {
                    throw new Error(
                        `Missing argument "${input.name}" for method "${method}"`
                    );
                }
                return value;
            });
    }

    const argsIterator = args[Symbol.iterator]();
    const callArray: string[] = abiMethod.inputs.reduce(
        (acc: string[], input: AbiEntry) => {
            if (isLen(input.name) && !isCairo1Type(input.type)) {
                return acc;
            }
            return acc.concat(
                parseCalldataField({
                    argsIterator,
                    input,
                    structs,
                    enums,
                    parser,
                })
            );
        },
        []
    );

    Object.defineProperty(callArray, "__compiled__", {
        enumerable: false,
        writable: false,
        value: true,
    });

    return callArray as Calldata;
}
