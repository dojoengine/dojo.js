import { Account } from "starknet";
import { ClientComponents } from "./createClientComponents";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";
import { Direction } from "@/utils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { client }: { client: IWorld },
  contractComponents: ContractComponents,
  {
    Moves,
    Position,
  }: ClientComponents
) {

  const spawn = async (account: Account) => {
    await client.actions.spawn({ account })
  }

  const move = async (account: Account, direction: Direction) => {
    await client.actions.move({ account, direction })
  }

  return {
    spawn,
    move,
  };
}
