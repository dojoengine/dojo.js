import { useContractRead } from "@starknet-react/core";
import { erc20ABI } from "./erc20";

interface BalanceProps {
    address: string;
    token_address: string;
}

const Balance = ({ address, token_address }: BalanceProps) => {
    // useBalance doesn't work on Katana, don't know why
    const { data, isError, isLoading, error } = useContractRead({
        functionName: "balanceOf",
        args: [address as string],
        abi: erc20ABI,
        address: token_address,
        watch: true,
        refetchInterval: 1000,
    });

    if (isLoading) return <div>Loading ...</div>;
    if (isError || !data) return <div>{error?.message}</div>;
    return (
        <div>
            {`${parseFloat(formatUnits(data.balance.low, 18)).toFixed(7)} ETH`}
        </div>
    );
};

export default Balance;

/*
MIT License

Copyright (c) 2023-present weth, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/wevm/viem/blob/main/src/utils/unit/formatUnits.ts
*/

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://viem.sh/docs/utilities/formatUnits
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
function formatUnits(value: bigint, decimals: number) {
    let display = value.toString();

    const negative = display.startsWith("-");
    if (negative) display = display.slice(1);

    display = display.padStart(decimals, "0");

    let [integer, fraction] = [
        display.slice(0, display.length - decimals),
        display.slice(display.length - decimals),
    ];
    fraction = fraction.replace(/(0+)$/, "");
    return `${negative ? "-" : ""}${integer || "0"}${
        fraction ? `.${fraction}` : ""
    }`;
}
