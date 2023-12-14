import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";
import { MoveSystemProps, SystemSigner } from "./types";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute }: SetupNetworkResult,
    { Position }: ClientComponents
) {
    const spawn = async (props: SystemSigner) => {
        console.log(props.signer);
        try {
            await execute(
                props.signer,
                "dojo_examples::actions::actions",
                "spawn",
                []
            );
        } catch (e) {
            console.error(e);
        }
    };

    const move = async (props: MoveSystemProps) => {
        const { signer, direction } = props;

        try {
            await execute(signer, "dojo_examples::actions::actions", "move", [
                direction,
            ]);
        } catch (e) {
            console.log(e);
        }
    };

    return {
        spawn,
        move,
    };
}
