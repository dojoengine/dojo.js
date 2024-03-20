const manifest = {
    world: {
        name: "dojo::world::world",
        address:
            "0x28f5999ae62fec17c09c52a800e244961dba05251f5aaf923afabd9c9804d1a",
        class_hash:
            "0x5ac623f0c96059936bd2d0904bdd31799e430fe08a0caff7a5f497260b16497",
        abi: [
            {
                type: "impl",
                name: "World",
                interface_name: "dojo::world::IWorld",
            },
            {
                type: "struct",
                name: "core::array::Span::<core::felt252>",
                members: [
                    {
                        name: "snapshot",
                        type: "@core::array::Array::<core::felt252>",
                    },
                ],
            },
            {
                type: "struct",
                name: "core::array::Span::<core::integer::u8>",
                members: [
                    {
                        name: "snapshot",
                        type: "@core::array::Array::<core::integer::u8>",
                    },
                ],
            },
            {
                type: "enum",
                name: "core::option::Option::<core::felt252>",
                variants: [
                    {
                        name: "Some",
                        type: "core::felt252",
                    },
                    {
                        name: "None",
                        type: "()",
                    },
                ],
            },
            {
                type: "struct",
                name: "core::array::Span::<core::array::Span::<core::felt252>>",
                members: [
                    {
                        name: "snapshot",
                        type: "@core::array::Array::<core::array::Span::<core::felt252>>",
                    },
                ],
            },
            {
                type: "enum",
                name: "core::bool",
                variants: [
                    {
                        name: "False",
                        type: "()",
                    },
                    {
                        name: "True",
                        type: "()",
                    },
                ],
            },
            {
                type: "interface",
                name: "dojo::world::IWorld",
                items: [
                    {
                        type: "function",
                        name: "metadata_uri",
                        inputs: [
                            {
                                name: "resource",
                                type: "core::felt252",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::array::Span::<core::felt252>",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "set_metadata_uri",
                        inputs: [
                            {
                                name: "resource",
                                type: "core::felt252",
                            },
                            {
                                name: "uri",
                                type: "core::array::Span::<core::felt252>",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "model",
                        inputs: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::starknet::class_hash::ClassHash",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "register_model",
                        inputs: [
                            {
                                name: "class_hash",
                                type: "core::starknet::class_hash::ClassHash",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "deploy_contract",
                        inputs: [
                            {
                                name: "salt",
                                type: "core::felt252",
                            },
                            {
                                name: "class_hash",
                                type: "core::starknet::class_hash::ClassHash",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "upgrade_contract",
                        inputs: [
                            {
                                name: "address",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "class_hash",
                                type: "core::starknet::class_hash::ClassHash",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::starknet::class_hash::ClassHash",
                            },
                        ],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "uuid",
                        inputs: [],
                        outputs: [
                            {
                                type: "core::integer::u32",
                            },
                        ],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "emit",
                        inputs: [
                            {
                                name: "keys",
                                type: "core::array::Array::<core::felt252>",
                            },
                            {
                                name: "values",
                                type: "core::array::Span::<core::felt252>",
                            },
                        ],
                        outputs: [],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "entity",
                        inputs: [
                            {
                                name: "model",
                                type: "core::felt252",
                            },
                            {
                                name: "keys",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "offset",
                                type: "core::integer::u8",
                            },
                            {
                                name: "length",
                                type: "core::integer::u32",
                            },
                            {
                                name: "layout",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::array::Span::<core::felt252>",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "set_entity",
                        inputs: [
                            {
                                name: "model",
                                type: "core::felt252",
                            },
                            {
                                name: "keys",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "offset",
                                type: "core::integer::u8",
                            },
                            {
                                name: "values",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "layout",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "entities",
                        inputs: [
                            {
                                name: "model",
                                type: "core::felt252",
                            },
                            {
                                name: "index",
                                type: "core::option::Option::<core::felt252>",
                            },
                            {
                                name: "values",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "values_length",
                                type: "core::integer::u32",
                            },
                            {
                                name: "values_layout",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                        ],
                        outputs: [
                            {
                                type: "(core::array::Span::<core::felt252>, core::array::Span::<core::array::Span::<core::felt252>>)",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "entity_ids",
                        inputs: [
                            {
                                name: "model",
                                type: "core::felt252",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::array::Span::<core::felt252>",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "set_executor",
                        inputs: [
                            {
                                name: "contract_address",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "executor",
                        inputs: [],
                        outputs: [
                            {
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "base",
                        inputs: [],
                        outputs: [
                            {
                                type: "core::starknet::class_hash::ClassHash",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "delete_entity",
                        inputs: [
                            {
                                name: "model",
                                type: "core::felt252",
                            },
                            {
                                name: "keys",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "layout",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "is_owner",
                        inputs: [
                            {
                                name: "address",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "resource",
                                type: "core::felt252",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::bool",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "grant_owner",
                        inputs: [
                            {
                                name: "address",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "resource",
                                type: "core::felt252",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "revoke_owner",
                        inputs: [
                            {
                                name: "address",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "resource",
                                type: "core::felt252",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "is_writer",
                        inputs: [
                            {
                                name: "model",
                                type: "core::felt252",
                            },
                            {
                                name: "system",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::bool",
                            },
                        ],
                        state_mutability: "view",
                    },
                    {
                        type: "function",
                        name: "grant_writer",
                        inputs: [
                            {
                                name: "model",
                                type: "core::felt252",
                            },
                            {
                                name: "system",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                    {
                        type: "function",
                        name: "revoke_writer",
                        inputs: [
                            {
                                name: "model",
                                type: "core::felt252",
                            },
                            {
                                name: "system",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                ],
            },
            {
                type: "impl",
                name: "UpgradeableWorld",
                interface_name: "dojo::world::IUpgradeableWorld",
            },
            {
                type: "interface",
                name: "dojo::world::IUpgradeableWorld",
                items: [
                    {
                        type: "function",
                        name: "upgrade",
                        inputs: [
                            {
                                name: "new_class_hash",
                                type: "core::starknet::class_hash::ClassHash",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                ],
            },
            {
                type: "constructor",
                name: "constructor",
                inputs: [
                    {
                        name: "executor",
                        type: "core::starknet::contract_address::ContractAddress",
                    },
                    {
                        name: "contract_base",
                        type: "core::starknet::class_hash::ClassHash",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::WorldSpawned",
                kind: "struct",
                members: [
                    {
                        name: "address",
                        type: "core::starknet::contract_address::ContractAddress",
                        kind: "data",
                    },
                    {
                        name: "creator",
                        type: "core::starknet::contract_address::ContractAddress",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::ContractDeployed",
                kind: "struct",
                members: [
                    {
                        name: "salt",
                        type: "core::felt252",
                        kind: "data",
                    },
                    {
                        name: "class_hash",
                        type: "core::starknet::class_hash::ClassHash",
                        kind: "data",
                    },
                    {
                        name: "address",
                        type: "core::starknet::contract_address::ContractAddress",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::ContractUpgraded",
                kind: "struct",
                members: [
                    {
                        name: "class_hash",
                        type: "core::starknet::class_hash::ClassHash",
                        kind: "data",
                    },
                    {
                        name: "address",
                        type: "core::starknet::contract_address::ContractAddress",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::WorldUpgraded",
                kind: "struct",
                members: [
                    {
                        name: "class_hash",
                        type: "core::starknet::class_hash::ClassHash",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::MetadataUpdate",
                kind: "struct",
                members: [
                    {
                        name: "resource",
                        type: "core::felt252",
                        kind: "data",
                    },
                    {
                        name: "uri",
                        type: "core::array::Span::<core::felt252>",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::ModelRegistered",
                kind: "struct",
                members: [
                    {
                        name: "name",
                        type: "core::felt252",
                        kind: "data",
                    },
                    {
                        name: "class_hash",
                        type: "core::starknet::class_hash::ClassHash",
                        kind: "data",
                    },
                    {
                        name: "prev_class_hash",
                        type: "core::starknet::class_hash::ClassHash",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::StoreSetRecord",
                kind: "struct",
                members: [
                    {
                        name: "table",
                        type: "core::felt252",
                        kind: "data",
                    },
                    {
                        name: "keys",
                        type: "core::array::Span::<core::felt252>",
                        kind: "data",
                    },
                    {
                        name: "offset",
                        type: "core::integer::u8",
                        kind: "data",
                    },
                    {
                        name: "values",
                        type: "core::array::Span::<core::felt252>",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::StoreDelRecord",
                kind: "struct",
                members: [
                    {
                        name: "table",
                        type: "core::felt252",
                        kind: "data",
                    },
                    {
                        name: "keys",
                        type: "core::array::Span::<core::felt252>",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::WriterUpdated",
                kind: "struct",
                members: [
                    {
                        name: "model",
                        type: "core::felt252",
                        kind: "data",
                    },
                    {
                        name: "system",
                        type: "core::starknet::contract_address::ContractAddress",
                        kind: "data",
                    },
                    {
                        name: "value",
                        type: "core::bool",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::OwnerUpdated",
                kind: "struct",
                members: [
                    {
                        name: "address",
                        type: "core::starknet::contract_address::ContractAddress",
                        kind: "data",
                    },
                    {
                        name: "resource",
                        type: "core::felt252",
                        kind: "data",
                    },
                    {
                        name: "value",
                        type: "core::bool",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::ExecutorUpdated",
                kind: "struct",
                members: [
                    {
                        name: "address",
                        type: "core::starknet::contract_address::ContractAddress",
                        kind: "data",
                    },
                    {
                        name: "prev_address",
                        type: "core::starknet::contract_address::ContractAddress",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::world::world::Event",
                kind: "enum",
                variants: [
                    {
                        name: "WorldSpawned",
                        type: "dojo::world::world::WorldSpawned",
                        kind: "nested",
                    },
                    {
                        name: "ContractDeployed",
                        type: "dojo::world::world::ContractDeployed",
                        kind: "nested",
                    },
                    {
                        name: "ContractUpgraded",
                        type: "dojo::world::world::ContractUpgraded",
                        kind: "nested",
                    },
                    {
                        name: "WorldUpgraded",
                        type: "dojo::world::world::WorldUpgraded",
                        kind: "nested",
                    },
                    {
                        name: "MetadataUpdate",
                        type: "dojo::world::world::MetadataUpdate",
                        kind: "nested",
                    },
                    {
                        name: "ModelRegistered",
                        type: "dojo::world::world::ModelRegistered",
                        kind: "nested",
                    },
                    {
                        name: "StoreSetRecord",
                        type: "dojo::world::world::StoreSetRecord",
                        kind: "nested",
                    },
                    {
                        name: "StoreDelRecord",
                        type: "dojo::world::world::StoreDelRecord",
                        kind: "nested",
                    },
                    {
                        name: "WriterUpdated",
                        type: "dojo::world::world::WriterUpdated",
                        kind: "nested",
                    },
                    {
                        name: "OwnerUpdated",
                        type: "dojo::world::world::OwnerUpdated",
                        kind: "nested",
                    },
                    {
                        name: "ExecutorUpdated",
                        type: "dojo::world::world::ExecutorUpdated",
                        kind: "nested",
                    },
                ],
            },
        ],
        reads: [],
        writes: [],
        computed: [],
    },
    executor: {
        name: "dojo::executor::executor",
        address: null,
        class_hash:
            "0x585507fa2818fe78e66da6ea4c5915376739f4abf509d41153f60a16cb1f68d",
        abi: [
            {
                type: "impl",
                name: "Executor",
                interface_name: "dojo::executor::IExecutor",
            },
            {
                type: "struct",
                name: "core::array::Span::<core::felt252>",
                members: [
                    {
                        name: "snapshot",
                        type: "@core::array::Array::<core::felt252>",
                    },
                ],
            },
            {
                type: "interface",
                name: "dojo::executor::IExecutor",
                items: [
                    {
                        type: "function",
                        name: "call",
                        inputs: [
                            {
                                name: "class_hash",
                                type: "core::starknet::class_hash::ClassHash",
                            },
                            {
                                name: "entrypoint",
                                type: "core::felt252",
                            },
                            {
                                name: "calldata",
                                type: "core::array::Span::<core::felt252>",
                            },
                        ],
                        outputs: [
                            {
                                type: "core::array::Span::<core::felt252>",
                            },
                        ],
                        state_mutability: "view",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::executor::executor::Event",
                kind: "enum",
                variants: [],
            },
        ],
        reads: [],
        writes: [],
        computed: [],
    },
    base: {
        name: "dojo::base::base",
        class_hash:
            "0x6c458453d35753703ad25632deec20a29faf8531942ec109e6eb0650316a2bc",
        abi: [
            {
                type: "impl",
                name: "WorldProviderImpl",
                interface_name: "dojo::world::IWorldProvider",
            },
            {
                type: "struct",
                name: "dojo::world::IWorldDispatcher",
                members: [
                    {
                        name: "contract_address",
                        type: "core::starknet::contract_address::ContractAddress",
                    },
                ],
            },
            {
                type: "interface",
                name: "dojo::world::IWorldProvider",
                items: [
                    {
                        type: "function",
                        name: "world",
                        inputs: [],
                        outputs: [
                            {
                                type: "dojo::world::IWorldDispatcher",
                            },
                        ],
                        state_mutability: "view",
                    },
                ],
            },
            {
                type: "impl",
                name: "UpgradableImpl",
                interface_name: "dojo::components::upgradeable::IUpgradeable",
            },
            {
                type: "interface",
                name: "dojo::components::upgradeable::IUpgradeable",
                items: [
                    {
                        type: "function",
                        name: "upgrade",
                        inputs: [
                            {
                                name: "new_class_hash",
                                type: "core::starknet::class_hash::ClassHash",
                            },
                        ],
                        outputs: [],
                        state_mutability: "external",
                    },
                ],
            },
            {
                type: "constructor",
                name: "constructor",
                inputs: [],
            },
            {
                type: "event",
                name: "dojo::components::upgradeable::upgradeable::Upgraded",
                kind: "struct",
                members: [
                    {
                        name: "class_hash",
                        type: "core::starknet::class_hash::ClassHash",
                        kind: "data",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::components::upgradeable::upgradeable::Event",
                kind: "enum",
                variants: [
                    {
                        name: "Upgraded",
                        type: "dojo::components::upgradeable::upgradeable::Upgraded",
                        kind: "nested",
                    },
                ],
            },
            {
                type: "event",
                name: "dojo::base::base::Event",
                kind: "enum",
                variants: [
                    {
                        name: "UpgradeableEvent",
                        type: "dojo::components::upgradeable::upgradeable::Event",
                        kind: "nested",
                    },
                ],
            },
        ],
    },
    contracts: [
        {
            name: "dojo_starter::systems::actions::actions",
            address:
                "0x297bde19ca499fd8a39dd9bedbcd881a47f7b8f66c19478ce97d7de89e6112e",
            class_hash:
                "0x3d014d582c7bdd5dc57aa70a7869acce341180d97c498ba7f6528be956cf12e",
            abi: [
                {
                    type: "impl",
                    name: "DojoResourceProviderImpl",
                    interface_name: "dojo::world::IDojoResourceProvider",
                },
                {
                    type: "interface",
                    name: "dojo::world::IDojoResourceProvider",
                    items: [
                        {
                            type: "function",
                            name: "dojo_resource",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::felt252",
                                },
                            ],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "impl",
                    name: "WorldProviderImpl",
                    interface_name: "dojo::world::IWorldProvider",
                },
                {
                    type: "struct",
                    name: "dojo::world::IWorldDispatcher",
                    members: [
                        {
                            name: "contract_address",
                            type: "core::starknet::contract_address::ContractAddress",
                        },
                    ],
                },
                {
                    type: "interface",
                    name: "dojo::world::IWorldProvider",
                    items: [
                        {
                            type: "function",
                            name: "world",
                            inputs: [],
                            outputs: [
                                {
                                    type: "dojo::world::IWorldDispatcher",
                                },
                            ],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "impl",
                    name: "ActionsImpl",
                    interface_name: "dojo_starter::systems::actions::IActions",
                },
                {
                    type: "enum",
                    name: "dojo_starter::models::moves::Direction",
                    variants: [
                        {
                            name: "None",
                            type: "()",
                        },
                        {
                            name: "Left",
                            type: "()",
                        },
                        {
                            name: "Right",
                            type: "()",
                        },
                        {
                            name: "Up",
                            type: "()",
                        },
                        {
                            name: "Down",
                            type: "()",
                        },
                    ],
                },
                {
                    type: "interface",
                    name: "dojo_starter::systems::actions::IActions",
                    items: [
                        {
                            type: "function",
                            name: "spawn",
                            inputs: [],
                            outputs: [],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "move",
                            inputs: [
                                {
                                    name: "direction",
                                    type: "dojo_starter::models::moves::Direction",
                                },
                            ],
                            outputs: [],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "impl",
                    name: "UpgradableImpl",
                    interface_name:
                        "dojo::components::upgradeable::IUpgradeable",
                },
                {
                    type: "interface",
                    name: "dojo::components::upgradeable::IUpgradeable",
                    items: [
                        {
                            type: "function",
                            name: "upgrade",
                            inputs: [
                                {
                                    name: "new_class_hash",
                                    type: "core::starknet::class_hash::ClassHash",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::components::upgradeable::upgradeable::Upgraded",
                    kind: "struct",
                    members: [
                        {
                            name: "class_hash",
                            type: "core::starknet::class_hash::ClassHash",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::components::upgradeable::upgradeable::Event",
                    kind: "enum",
                    variants: [
                        {
                            name: "Upgraded",
                            type: "dojo::components::upgradeable::upgradeable::Upgraded",
                            kind: "nested",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo_starter::systems::actions::actions::Moved",
                    kind: "struct",
                    members: [
                        {
                            name: "player",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                        {
                            name: "direction",
                            type: "dojo_starter::models::moves::Direction",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo_starter::systems::actions::actions::Event",
                    kind: "enum",
                    variants: [
                        {
                            name: "UpgradeableEvent",
                            type: "dojo::components::upgradeable::upgradeable::Event",
                            kind: "nested",
                        },
                        {
                            name: "Moved",
                            type: "dojo_starter::systems::actions::actions::Moved",
                            kind: "nested",
                        },
                    ],
                },
            ],
            reads: [],
            writes: [],
            computed: [],
        },
    ],
    models: [
        {
            name: "dojo_starter::models::moves::moves",
            members: [
                {
                    name: "player",
                    type: "ContractAddress",
                    key: true,
                },
                {
                    name: "remaining",
                    type: "u8",
                    key: false,
                },
                {
                    name: "last_direction",
                    type: "Direction",
                    key: false,
                },
            ],
            class_hash:
                "0x38308a6d9168f73156321cdef0561f799e553665e8e27d8ae87ea3b7b2374af",
            abi: [
                {
                    type: "impl",
                    name: "DojoModelImpl",
                    interface_name: "dojo::model::IDojoModel",
                },
                {
                    type: "struct",
                    name: "core::array::Span::<core::integer::u8>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<core::integer::u8>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<core::felt252>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<core::felt252>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<core::array::Span::<core::felt252>>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<core::array::Span::<core::felt252>>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo::database::introspect::Struct",
                    members: [
                        {
                            name: "name",
                            type: "core::felt252",
                        },
                        {
                            name: "attrs",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "children",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<(core::felt252, core::array::Span::<core::felt252>)>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<(core::felt252, core::array::Span::<core::felt252>)>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo::database::introspect::Enum",
                    members: [
                        {
                            name: "name",
                            type: "core::felt252",
                        },
                        {
                            name: "attrs",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "children",
                            type: "core::array::Span::<(core::felt252, core::array::Span::<core::felt252>)>",
                        },
                    ],
                },
                {
                    type: "enum",
                    name: "dojo::database::introspect::Ty",
                    variants: [
                        {
                            name: "Primitive",
                            type: "core::felt252",
                        },
                        {
                            name: "Struct",
                            type: "dojo::database::introspect::Struct",
                        },
                        {
                            name: "Enum",
                            type: "dojo::database::introspect::Enum",
                        },
                        {
                            name: "Tuple",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                    ],
                },
                {
                    type: "interface",
                    name: "dojo::model::IDojoModel",
                    items: [
                        {
                            type: "function",
                            name: "name",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::felt252",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "unpacked_size",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::integer::u32",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "packed_size",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::integer::u32",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "layout",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::array::Span::<core::integer::u8>",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "schema",
                            inputs: [],
                            outputs: [
                                {
                                    type: "dojo::database::introspect::Ty",
                                },
                            ],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "impl",
                    name: "movesImpl",
                    interface_name: "dojo_starter::models::moves::Imoves",
                },
                {
                    type: "enum",
                    name: "dojo_starter::models::moves::Direction",
                    variants: [
                        {
                            name: "None",
                            type: "()",
                        },
                        {
                            name: "Left",
                            type: "()",
                        },
                        {
                            name: "Right",
                            type: "()",
                        },
                        {
                            name: "Up",
                            type: "()",
                        },
                        {
                            name: "Down",
                            type: "()",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo_starter::models::moves::Moves",
                    members: [
                        {
                            name: "player",
                            type: "core::starknet::contract_address::ContractAddress",
                        },
                        {
                            name: "remaining",
                            type: "core::integer::u8",
                        },
                        {
                            name: "last_direction",
                            type: "dojo_starter::models::moves::Direction",
                        },
                    ],
                },
                {
                    type: "interface",
                    name: "dojo_starter::models::moves::Imoves",
                    items: [
                        {
                            type: "function",
                            name: "ensure_abi",
                            inputs: [
                                {
                                    name: "model",
                                    type: "dojo_starter::models::moves::Moves",
                                },
                            ],
                            outputs: [],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo_starter::models::moves::moves::Event",
                    kind: "enum",
                    variants: [],
                },
            ],
        },
        {
            name: "dojo_starter::models::position::position",
            members: [
                {
                    name: "player",
                    type: "ContractAddress",
                    key: true,
                },
                {
                    name: "vec",
                    type: "Vec2",
                    key: false,
                },
            ],
            class_hash:
                "0x79b86730d738b929b2aa0f9c2a8dc0ff016413332eaca188cb41af39550152e",
            abi: [
                {
                    type: "impl",
                    name: "DojoModelImpl",
                    interface_name: "dojo::model::IDojoModel",
                },
                {
                    type: "struct",
                    name: "core::array::Span::<core::integer::u8>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<core::integer::u8>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<core::felt252>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<core::felt252>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<core::array::Span::<core::felt252>>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<core::array::Span::<core::felt252>>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo::database::introspect::Struct",
                    members: [
                        {
                            name: "name",
                            type: "core::felt252",
                        },
                        {
                            name: "attrs",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "children",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<(core::felt252, core::array::Span::<core::felt252>)>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<(core::felt252, core::array::Span::<core::felt252>)>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo::database::introspect::Enum",
                    members: [
                        {
                            name: "name",
                            type: "core::felt252",
                        },
                        {
                            name: "attrs",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "children",
                            type: "core::array::Span::<(core::felt252, core::array::Span::<core::felt252>)>",
                        },
                    ],
                },
                {
                    type: "enum",
                    name: "dojo::database::introspect::Ty",
                    variants: [
                        {
                            name: "Primitive",
                            type: "core::felt252",
                        },
                        {
                            name: "Struct",
                            type: "dojo::database::introspect::Struct",
                        },
                        {
                            name: "Enum",
                            type: "dojo::database::introspect::Enum",
                        },
                        {
                            name: "Tuple",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                    ],
                },
                {
                    type: "interface",
                    name: "dojo::model::IDojoModel",
                    items: [
                        {
                            type: "function",
                            name: "name",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::felt252",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "unpacked_size",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::integer::u32",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "packed_size",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::integer::u32",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "layout",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::array::Span::<core::integer::u8>",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "schema",
                            inputs: [],
                            outputs: [
                                {
                                    type: "dojo::database::introspect::Ty",
                                },
                            ],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "impl",
                    name: "positionImpl",
                    interface_name: "dojo_starter::models::position::Iposition",
                },
                {
                    type: "struct",
                    name: "dojo_starter::models::position::Vec2",
                    members: [
                        {
                            name: "x",
                            type: "core::integer::u32",
                        },
                        {
                            name: "y",
                            type: "core::integer::u32",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo_starter::models::position::Position",
                    members: [
                        {
                            name: "player",
                            type: "core::starknet::contract_address::ContractAddress",
                        },
                        {
                            name: "vec",
                            type: "dojo_starter::models::position::Vec2",
                        },
                    ],
                },
                {
                    type: "interface",
                    name: "dojo_starter::models::position::Iposition",
                    items: [
                        {
                            type: "function",
                            name: "ensure_abi",
                            inputs: [
                                {
                                    name: "model",
                                    type: "dojo_starter::models::position::Position",
                                },
                            ],
                            outputs: [],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo_starter::models::position::position::Event",
                    kind: "enum",
                    variants: [],
                },
            ],
        },
    ],
} as const;

export default manifest;
