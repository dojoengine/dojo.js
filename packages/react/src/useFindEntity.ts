// import { Client } from "@dojoengine/torii-client";
// import { findAndSyncEntities, store } from "@dojoengine/state";
// import { useEffect, useState } from "react";
// import { useStore } from "zustand";

// export const useFindEntities = <
//     T extends {
//         torii: Client;
//         findEntities: () => Promise<Record<string, any>>;
//     },
// >(
//     input: Promise<T>,
//     dependencies: any[] = []
// ) => {
//     const [entityIds, setEntityIds] = useState<string[]>([]);

//     const useBoundStore = useStore(store, (state) =>
//         entityIds.map((id) => state[id])
//     ) as T extends { findEntities: () => Promise<infer R> }
//         ? R[keyof R][]
//         : any[];

//     useEffect(() => {
//         const fetchEntity = async () => {
//             const foundEntities = await findAndSyncEntities(input);

//             setEntityIds(Object.keys(foundEntities));
//         };

//         fetchEntity();
//     }, dependencies);

//     return useBoundStore;
// };

// export const useFindEntity = <
//     T extends {
//         torii: Client;
//         findEntities: () => Promise<Record<string, any>>;
//     },
// >(
//     input: Promise<T>,
//     dependencies: any[] = []
// ) => {
//     const [entityId, setEntityId] = useState<string>("");

//     const useBoundStore = useStore(
//         store,
//         (state) => state[entityId]
//     ) as T extends { findEntities: () => Promise<infer R> } ? R[keyof R] : any;

//     useEffect(() => {
//         const fetchEntity = async () => {
//             const foundEntities = await findAndSyncEntities(input);

//             setEntityId(Object.keys(foundEntities)[0]);
//         };

//         fetchEntity();
//     }, dependencies);

//     return useBoundStore;
// };
