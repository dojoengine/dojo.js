import { Account } from "starknet";
import { Direction } from "./utils";

export interface SystemSigner {
    signer: Account;
}

export interface MoveSystemProps extends SystemSigner {
    direction: Direction;
}
