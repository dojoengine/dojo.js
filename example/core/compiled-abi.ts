// This file is auto-generated from compiled-abi.json
// Do not edit manually

export const compiledAbi = {
    abi: [
        {
            type: "impl",
            name: "World",
            interface_name: "dojo::world::iworld::IWorld",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::world::resource::Resource",
            variants: [
                {
                    name: "Model",
                    type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
                },
                {
                    name: "Event",
                    type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
                },
                {
                    name: "Contract",
                    type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
                },
                {
                    name: "Namespace",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "World",
                    type: "()",
                },
                {
                    name: "Unregistered",
                    type: "()",
                },
                {
                    name: "Library",
                    type: "(core::starknet::class_hash::ClassHash, core::felt252)",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::model::metadata::ResourceMetadata",
            members: [
                {
                    name: "resource_id",
                    type: "core::felt252",
                },
                {
                    name: "metadata_uri",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "metadata_hash",
                    type: "core::felt252",
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
            type: "enum",
            name: "dojo::model::definition::ModelIndex",
            variants: [
                {
                    name: "Keys",
                    type: "core::array::Span::<core::felt252>",
                },
                {
                    name: "Id",
                    type: "core::felt252",
                },
                {
                    name: "MemberId",
                    type: "(core::felt252, core::felt252)",
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
            type: "struct",
            name: "dojo::meta::layout::FieldLayout",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::FieldLayout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::Layout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::Layout>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::layout::Layout",
            variants: [
                {
                    name: "Fixed",
                    type: "core::array::Span::<core::integer::u8>",
                },
                {
                    name: "Struct",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
                {
                    name: "Enum",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::model::definition::ModelIndex>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::model::definition::ModelIndex>",
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
            name: "dojo::world::iworld::IWorld",
            items: [
                {
                    type: "function",
                    name: "resource",
                    inputs: [
                        {
                            name: "selector",
                            type: "core::felt252",
                        },
                    ],
                    outputs: [
                        {
                            type: "dojo::world::resource::Resource",
                        },
                    ],
                    state_mutability: "view",
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
                    name: "metadata",
                    inputs: [
                        {
                            name: "resource_selector",
                            type: "core::felt252",
                        },
                    ],
                    outputs: [
                        {
                            type: "dojo::model::metadata::ResourceMetadata",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "set_metadata",
                    inputs: [
                        {
                            name: "metadata",
                            type: "dojo::model::metadata::ResourceMetadata",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "register_namespace",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "register_event",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
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
                    name: "register_model",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
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
                    name: "register_contract",
                    inputs: [
                        {
                            name: "salt",
                            type: "core::felt252",
                        },
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
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
                    name: "register_library",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
                        {
                            name: "class_hash",
                            type: "core::starknet::class_hash::ClassHash",
                        },
                        {
                            name: "name",
                            type: "core::byte_array::ByteArray",
                        },
                        {
                            name: "version",
                            type: "core::byte_array::ByteArray",
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
                    name: "init_contract",
                    inputs: [
                        {
                            name: "selector",
                            type: "core::felt252",
                        },
                        {
                            name: "init_calldata",
                            type: "core::array::Span::<core::felt252>",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "upgrade_event",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
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
                    name: "upgrade_model",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
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
                    name: "upgrade_contract",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
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
                    name: "emit_event",
                    inputs: [
                        {
                            name: "event_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "keys",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::felt252>",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "emit_events",
                    inputs: [
                        {
                            name: "event_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "keys",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "entity",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "index",
                            type: "dojo::model::definition::ModelIndex",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
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
                    name: "entities",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "indexes",
                            type: "core::array::Span::<dojo::model::definition::ModelIndex>",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
                        },
                    ],
                    outputs: [
                        {
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "set_entity",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "index",
                            type: "dojo::model::definition::ModelIndex",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "set_entities",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "indexes",
                            type: "core::array::Span::<dojo::model::definition::ModelIndex>",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "delete_entity",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "index",
                            type: "dojo::model::definition::ModelIndex",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "delete_entities",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "indexes",
                            type: "core::array::Span::<dojo::model::definition::ModelIndex>",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
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
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "address",
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
                    name: "grant_owner",
                    inputs: [
                        {
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
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
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "owners_count",
                    inputs: [
                        {
                            name: "resource",
                            type: "core::felt252",
                        },
                    ],
                    outputs: [
                        {
                            type: "core::integer::u64",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "is_writer",
                    inputs: [
                        {
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "contract",
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
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "contract",
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
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "contract",
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
            interface_name: "dojo::world::iworld::IUpgradeableWorld",
        },
        {
            type: "interface",
            name: "dojo::world::iworld::IUpgradeableWorld",
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
                    name: "world_class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::WorldSpawned",
            kind: "struct",
            members: [
                {
                    name: "creator",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "data",
                },
                {
                    name: "class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::WorldUpgraded",
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
            name: "dojo::world::world_contract::world::NamespaceRegistered",
            kind: "struct",
            members: [
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "hash",
                    type: "core::felt252",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::ModelRegistered",
            kind: "struct",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::EventRegistered",
            kind: "struct",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::ContractRegistered",
            kind: "struct",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "address",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "data",
                },
                {
                    name: "class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                    kind: "data",
                },
                {
                    name: "salt",
                    type: "core::felt252",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::ModelUpgraded",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
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
                {
                    name: "prev_address",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::EventUpgraded",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
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
                {
                    name: "prev_address",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::ContractUpgraded",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::ContractInitialized",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "init_calldata",
                    type: "core::array::Span::<core::felt252>",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::LibraryRegistered",
            kind: "struct",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::EventEmitted",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "system_address",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "key",
                },
                {
                    name: "keys",
                    type: "core::array::Span::<core::felt252>",
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
            name: "dojo::world::world_contract::world::MetadataUpdate",
            kind: "struct",
            members: [
                {
                    name: "resource",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "uri",
                    type: "core::byte_array::ByteArray",
                    kind: "data",
                },
                {
                    name: "hash",
                    type: "core::felt252",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::StoreSetRecord",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "entity_id",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "keys",
                    type: "core::array::Span::<core::felt252>",
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
            name: "dojo::world::world_contract::world::StoreUpdateRecord",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "entity_id",
                    type: "core::felt252",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::StoreUpdateMember",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "entity_id",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "member_selector",
                    type: "core::felt252",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::StoreDelRecord",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "entity_id",
                    type: "core::felt252",
                    kind: "key",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::WriterUpdated",
            kind: "struct",
            members: [
                {
                    name: "resource",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "contract",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::OwnerUpdated",
            kind: "struct",
            members: [
                {
                    name: "resource",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "contract",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::Event",
            kind: "enum",
            variants: [
                {
                    name: "WorldSpawned",
                    type: "dojo::world::world_contract::world::WorldSpawned",
                    kind: "nested",
                },
                {
                    name: "WorldUpgraded",
                    type: "dojo::world::world_contract::world::WorldUpgraded",
                    kind: "nested",
                },
                {
                    name: "NamespaceRegistered",
                    type: "dojo::world::world_contract::world::NamespaceRegistered",
                    kind: "nested",
                },
                {
                    name: "ModelRegistered",
                    type: "dojo::world::world_contract::world::ModelRegistered",
                    kind: "nested",
                },
                {
                    name: "EventRegistered",
                    type: "dojo::world::world_contract::world::EventRegistered",
                    kind: "nested",
                },
                {
                    name: "ContractRegistered",
                    type: "dojo::world::world_contract::world::ContractRegistered",
                    kind: "nested",
                },
                {
                    name: "ModelUpgraded",
                    type: "dojo::world::world_contract::world::ModelUpgraded",
                    kind: "nested",
                },
                {
                    name: "EventUpgraded",
                    type: "dojo::world::world_contract::world::EventUpgraded",
                    kind: "nested",
                },
                {
                    name: "ContractUpgraded",
                    type: "dojo::world::world_contract::world::ContractUpgraded",
                    kind: "nested",
                },
                {
                    name: "ContractInitialized",
                    type: "dojo::world::world_contract::world::ContractInitialized",
                    kind: "nested",
                },
                {
                    name: "LibraryRegistered",
                    type: "dojo::world::world_contract::world::LibraryRegistered",
                    kind: "nested",
                },
                {
                    name: "EventEmitted",
                    type: "dojo::world::world_contract::world::EventEmitted",
                    kind: "nested",
                },
                {
                    name: "MetadataUpdate",
                    type: "dojo::world::world_contract::world::MetadataUpdate",
                    kind: "nested",
                },
                {
                    name: "StoreSetRecord",
                    type: "dojo::world::world_contract::world::StoreSetRecord",
                    kind: "nested",
                },
                {
                    name: "StoreUpdateRecord",
                    type: "dojo::world::world_contract::world::StoreUpdateRecord",
                    kind: "nested",
                },
                {
                    name: "StoreUpdateMember",
                    type: "dojo::world::world_contract::world::StoreUpdateMember",
                    kind: "nested",
                },
                {
                    name: "StoreDelRecord",
                    type: "dojo::world::world_contract::world::StoreDelRecord",
                    kind: "nested",
                },
                {
                    name: "WriterUpdated",
                    type: "dojo::world::world_contract::world::WriterUpdated",
                    kind: "nested",
                },
                {
                    name: "OwnerUpdated",
                    type: "dojo::world::world_contract::world::OwnerUpdated",
                    kind: "nested",
                },
            ],
        },
        {
            type: "impl",
            name: "actions__ContractImpl",
            interface_name: "dojo::contract::interface::IContract",
        },
        {
            type: "interface",
            name: "dojo::contract::interface::IContract",
            items: [],
        },
        {
            type: "impl",
            name: "actions__DeployedContractImpl",
            interface_name: "dojo::meta::interface::IDeployedResource",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IDeployedResource",
            items: [
                {
                    type: "function",
                    name: "dojo_name",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::byte_array::ByteArray",
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
            name: "dojo_starter::models::Direction",
            variants: [
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
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "move",
                    inputs: [
                        {
                            name: "direction",
                            type: "dojo_starter::models::Direction",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
            ],
        },
        {
            type: "function",
            name: "dojo_init",
            inputs: [],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "impl",
            name: "WorldProviderImpl",
            interface_name:
                "dojo::contract::components::world_provider::IWorldProvider",
        },
        {
            type: "struct",
            name: "dojo::world::iworld::IWorldDispatcher",
            members: [
                {
                    name: "contract_address",
                    type: "core::starknet::contract_address::ContractAddress",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::contract::components::world_provider::IWorldProvider",
            items: [
                {
                    type: "function",
                    name: "world_dispatcher",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::world::iworld::IWorldDispatcher",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "UpgradeableImpl",
            interface_name:
                "dojo::contract::components::upgradeable::IUpgradeable",
        },
        {
            type: "interface",
            name: "dojo::contract::components::upgradeable::IUpgradeable",
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
            name: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
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
            name: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
            kind: "enum",
            variants: [
                {
                    name: "Upgraded",
                    type: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
                    kind: "nested",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::contract::components::world_provider::world_provider_cpt::Event",
            kind: "enum",
            variants: [],
        },
        {
            type: "event",
            name: "dojo_starter::systems::actions::actions::Event",
            kind: "enum",
            variants: [
                {
                    name: "UpgradeableEvent",
                    type: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
                    kind: "nested",
                },
                {
                    name: "WorldProviderEvent",
                    type: "dojo::contract::components::world_provider::world_provider_cpt::Event",
                    kind: "nested",
                },
            ],
        },
        {
            type: "impl",
            name: "actions__ContractImpl",
            interface_name: "dojo::contract::interface::IContract",
        },
        {
            type: "interface",
            name: "dojo::contract::interface::IContract",
            items: [],
        },
        {
            type: "impl",
            name: "actions__DeployedContractImpl",
            interface_name: "dojo::meta::interface::IDeployedResource",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IDeployedResource",
            items: [
                {
                    type: "function",
                    name: "dojo_name",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::byte_array::ByteArray",
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
            name: "dojo_starter::models::Direction",
            variants: [
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
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "move",
                    inputs: [
                        {
                            name: "direction",
                            type: "dojo_starter::models::Direction",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
            ],
        },
        {
            type: "function",
            name: "dojo_init",
            inputs: [],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "impl",
            name: "WorldProviderImpl",
            interface_name:
                "dojo::contract::components::world_provider::IWorldProvider",
        },
        {
            type: "struct",
            name: "dojo::world::iworld::IWorldDispatcher",
            members: [
                {
                    name: "contract_address",
                    type: "core::starknet::contract_address::ContractAddress",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::contract::components::world_provider::IWorldProvider",
            items: [
                {
                    type: "function",
                    name: "world_dispatcher",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::world::iworld::IWorldDispatcher",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "UpgradeableImpl",
            interface_name:
                "dojo::contract::components::upgradeable::IUpgradeable",
        },
        {
            type: "interface",
            name: "dojo::contract::components::upgradeable::IUpgradeable",
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
            name: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
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
            name: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
            kind: "enum",
            variants: [
                {
                    name: "Upgraded",
                    type: "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
                    kind: "nested",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::contract::components::world_provider::world_provider_cpt::Event",
            kind: "enum",
            variants: [],
        },
        {
            type: "event",
            name: "dojo_starter::systems::actions::actions::Event",
            kind: "enum",
            variants: [
                {
                    name: "UpgradeableEvent",
                    type: "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
                    kind: "nested",
                },
                {
                    name: "WorldProviderEvent",
                    type: "dojo::contract::components::world_provider::world_provider_cpt::Event",
                    kind: "nested",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo_starter::models::Direction",
            variants: [
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
            name: "dojo_starter::systems::actions::actions::Moved",
            members: [
                {
                    name: "player",
                    type: "core::starknet::contract_address::ContractAddress",
                },
                {
                    name: "direction",
                    type: "dojo_starter::models::Direction",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_abi",
            inputs: [
                {
                    name: "event",
                    type: "dojo_starter::systems::actions::actions::Moved",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "struct",
            name: "dojo_starter::systems::actions::actions::MovedValue",
            members: [
                {
                    name: "direction",
                    type: "dojo_starter::models::Direction",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_values",
            inputs: [
                {
                    name: "value",
                    type: "dojo_starter::systems::actions::actions::MovedValue",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "function",
            name: "ensure_unique",
            inputs: [],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "impl",
            name: "Moved__DeployedEventImpl",
            interface_name: "dojo::meta::interface::IDeployedResource",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IDeployedResource",
            items: [
                {
                    type: "function",
                    name: "dojo_name",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::byte_array::ByteArray",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "Moved__StoredEventImpl",
            interface_name: "dojo::meta::interface::IStoredResource",
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
            name: "dojo::meta::layout::FieldLayout",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::FieldLayout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::Layout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::Layout>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::layout::Layout",
            variants: [
                {
                    name: "Fixed",
                    type: "core::array::Span::<core::integer::u8>",
                },
                {
                    name: "Struct",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
                {
                    name: "Enum",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
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
            name: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Enum",
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
                    type: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Ty>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Ty>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::introspect::Ty",
            variants: [
                {
                    name: "Primitive",
                    type: "core::felt252",
                },
                {
                    name: "Struct",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "Enum",
                    type: "dojo::meta::introspect::Enum",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Member",
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
                    name: "ty",
                    type: "dojo::meta::introspect::Ty",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Member>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Struct",
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
                    type: "core::array::Span::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IStoredResource",
            items: [
                {
                    type: "function",
                    name: "layout",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::meta::layout::Layout",
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
                            type: "dojo::meta::introspect::Struct",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "Moved__EventImpl",
            interface_name: "dojo::event::interface::IEvent",
        },
        {
            type: "struct",
            name: "dojo::event::event::EventDef",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
                {
                    name: "schema",
                    type: "dojo::meta::introspect::Struct",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::event::interface::IEvent",
            items: [
                {
                    type: "function",
                    name: "definition",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::event::event::EventDef",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "event",
            name: "dojo_starter::systems::actions::actions::e_Moved::Event",
            kind: "enum",
            variants: [],
        },
        {
            type: "enum",
            name: "dojo_starter::models::Direction",
            variants: [
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
            name: "dojo_starter::models::DirectionsAvailable",
            members: [
                {
                    name: "player",
                    type: "core::starknet::contract_address::ContractAddress",
                },
                {
                    name: "directions",
                    type: "core::array::Array::<dojo_starter::models::Direction>",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_abi",
            inputs: [
                {
                    name: "model",
                    type: "dojo_starter::models::DirectionsAvailable",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "struct",
            name: "dojo_starter::models::DirectionsAvailableValue",
            members: [
                {
                    name: "directions",
                    type: "core::array::Array::<dojo_starter::models::Direction>",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_values",
            inputs: [
                {
                    name: "value",
                    type: "dojo_starter::models::DirectionsAvailableValue",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "function",
            name: "ensure_unique",
            inputs: [],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "impl",
            name: "DirectionsAvailable__DojoDeployedModelImpl",
            interface_name: "dojo::meta::interface::IDeployedResource",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IDeployedResource",
            items: [
                {
                    type: "function",
                    name: "dojo_name",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::byte_array::ByteArray",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "DirectionsAvailable__DojoStoredModelImpl",
            interface_name: "dojo::meta::interface::IStoredResource",
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
            name: "dojo::meta::layout::FieldLayout",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::FieldLayout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::Layout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::Layout>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::layout::Layout",
            variants: [
                {
                    name: "Fixed",
                    type: "core::array::Span::<core::integer::u8>",
                },
                {
                    name: "Struct",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
                {
                    name: "Enum",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
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
            name: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Enum",
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
                    type: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Ty>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Ty>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::introspect::Ty",
            variants: [
                {
                    name: "Primitive",
                    type: "core::felt252",
                },
                {
                    name: "Struct",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "Enum",
                    type: "dojo::meta::introspect::Enum",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Member",
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
                    name: "ty",
                    type: "dojo::meta::introspect::Ty",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Member>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Struct",
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
                    type: "core::array::Span::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IStoredResource",
            items: [
                {
                    type: "function",
                    name: "layout",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::meta::layout::Layout",
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
                            type: "dojo::meta::introspect::Struct",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "DirectionsAvailable__DojoModelImpl",
            interface_name: "dojo::model::interface::IModel",
        },
        {
            type: "enum",
            name: "core::option::Option::<core::integer::u32>",
            variants: [
                {
                    name: "Some",
                    type: "core::integer::u32",
                },
                {
                    name: "None",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::model::definition::ModelDef",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
                {
                    name: "schema",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "packed_size",
                    type: "core::option::Option::<core::integer::u32>",
                },
                {
                    name: "unpacked_size",
                    type: "core::option::Option::<core::integer::u32>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::model::interface::IModel",
            items: [
                {
                    type: "function",
                    name: "unpacked_size",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::option::Option::<core::integer::u32>",
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
                            type: "core::option::Option::<core::integer::u32>",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "definition",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::model::definition::ModelDef",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "event",
            name: "dojo_starter::models::m_DirectionsAvailable::Event",
            kind: "enum",
            variants: [],
        },
        {
            type: "enum",
            name: "dojo_starter::models::Direction",
            variants: [
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
            type: "enum",
            name: "core::option::Option::<dojo_starter::models::Direction>",
            variants: [
                {
                    name: "Some",
                    type: "dojo_starter::models::Direction",
                },
                {
                    name: "None",
                    type: "()",
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
            type: "struct",
            name: "dojo_starter::models::Moves",
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
                    type: "core::option::Option::<dojo_starter::models::Direction>",
                },
                {
                    name: "can_move",
                    type: "core::bool",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_abi",
            inputs: [
                {
                    name: "model",
                    type: "dojo_starter::models::Moves",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "struct",
            name: "dojo_starter::models::MovesValue",
            members: [
                {
                    name: "remaining",
                    type: "core::integer::u8",
                },
                {
                    name: "last_direction",
                    type: "core::option::Option::<dojo_starter::models::Direction>",
                },
                {
                    name: "can_move",
                    type: "core::bool",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_values",
            inputs: [
                {
                    name: "value",
                    type: "dojo_starter::models::MovesValue",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "function",
            name: "ensure_unique",
            inputs: [],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "impl",
            name: "Moves__DojoDeployedModelImpl",
            interface_name: "dojo::meta::interface::IDeployedResource",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IDeployedResource",
            items: [
                {
                    type: "function",
                    name: "dojo_name",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::byte_array::ByteArray",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "Moves__DojoStoredModelImpl",
            interface_name: "dojo::meta::interface::IStoredResource",
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
            name: "dojo::meta::layout::FieldLayout",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::FieldLayout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::Layout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::Layout>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::layout::Layout",
            variants: [
                {
                    name: "Fixed",
                    type: "core::array::Span::<core::integer::u8>",
                },
                {
                    name: "Struct",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
                {
                    name: "Enum",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
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
            name: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Enum",
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
                    type: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Ty>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Ty>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::introspect::Ty",
            variants: [
                {
                    name: "Primitive",
                    type: "core::felt252",
                },
                {
                    name: "Struct",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "Enum",
                    type: "dojo::meta::introspect::Enum",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Member",
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
                    name: "ty",
                    type: "dojo::meta::introspect::Ty",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Member>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Struct",
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
                    type: "core::array::Span::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IStoredResource",
            items: [
                {
                    type: "function",
                    name: "layout",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::meta::layout::Layout",
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
                            type: "dojo::meta::introspect::Struct",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "Moves__DojoModelImpl",
            interface_name: "dojo::model::interface::IModel",
        },
        {
            type: "enum",
            name: "core::option::Option::<core::integer::u32>",
            variants: [
                {
                    name: "Some",
                    type: "core::integer::u32",
                },
                {
                    name: "None",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::model::definition::ModelDef",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
                {
                    name: "schema",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "packed_size",
                    type: "core::option::Option::<core::integer::u32>",
                },
                {
                    name: "unpacked_size",
                    type: "core::option::Option::<core::integer::u32>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::model::interface::IModel",
            items: [
                {
                    type: "function",
                    name: "unpacked_size",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::option::Option::<core::integer::u32>",
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
                            type: "core::option::Option::<core::integer::u32>",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "definition",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::model::definition::ModelDef",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "event",
            name: "dojo_starter::models::m_Moves::Event",
            kind: "enum",
            variants: [],
        },
        {
            type: "struct",
            name: "dojo_starter::models::Vec2",
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
            name: "dojo_starter::models::Position",
            members: [
                {
                    name: "player",
                    type: "core::starknet::contract_address::ContractAddress",
                },
                {
                    name: "vec",
                    type: "dojo_starter::models::Vec2",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_abi",
            inputs: [
                {
                    name: "model",
                    type: "dojo_starter::models::Position",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "struct",
            name: "dojo_starter::models::PositionValue",
            members: [
                {
                    name: "vec",
                    type: "dojo_starter::models::Vec2",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_values",
            inputs: [
                {
                    name: "value",
                    type: "dojo_starter::models::PositionValue",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "function",
            name: "ensure_unique",
            inputs: [],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "impl",
            name: "Position__DojoDeployedModelImpl",
            interface_name: "dojo::meta::interface::IDeployedResource",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IDeployedResource",
            items: [
                {
                    type: "function",
                    name: "dojo_name",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::byte_array::ByteArray",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "Position__DojoStoredModelImpl",
            interface_name: "dojo::meta::interface::IStoredResource",
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
            name: "dojo::meta::layout::FieldLayout",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::FieldLayout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::Layout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::Layout>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::layout::Layout",
            variants: [
                {
                    name: "Fixed",
                    type: "core::array::Span::<core::integer::u8>",
                },
                {
                    name: "Struct",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
                {
                    name: "Enum",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
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
            name: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Enum",
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
                    type: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Ty>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Ty>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::introspect::Ty",
            variants: [
                {
                    name: "Primitive",
                    type: "core::felt252",
                },
                {
                    name: "Struct",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "Enum",
                    type: "dojo::meta::introspect::Enum",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Member",
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
                    name: "ty",
                    type: "dojo::meta::introspect::Ty",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Member>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Struct",
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
                    type: "core::array::Span::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IStoredResource",
            items: [
                {
                    type: "function",
                    name: "layout",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::meta::layout::Layout",
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
                            type: "dojo::meta::introspect::Struct",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "Position__DojoModelImpl",
            interface_name: "dojo::model::interface::IModel",
        },
        {
            type: "enum",
            name: "core::option::Option::<core::integer::u32>",
            variants: [
                {
                    name: "Some",
                    type: "core::integer::u32",
                },
                {
                    name: "None",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::model::definition::ModelDef",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
                {
                    name: "schema",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "packed_size",
                    type: "core::option::Option::<core::integer::u32>",
                },
                {
                    name: "unpacked_size",
                    type: "core::option::Option::<core::integer::u32>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::model::interface::IModel",
            items: [
                {
                    type: "function",
                    name: "unpacked_size",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::option::Option::<core::integer::u32>",
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
                            type: "core::option::Option::<core::integer::u32>",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "definition",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::model::definition::ModelDef",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "event",
            name: "dojo_starter::models::m_Position::Event",
            kind: "enum",
            variants: [],
        },
        {
            type: "struct",
            name: "core::array::Span::<(core::integer::u8, core::integer::u128)>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<(core::integer::u8, core::integer::u128)>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo_starter::models::PositionCount",
            members: [
                {
                    name: "identity",
                    type: "core::starknet::contract_address::ContractAddress",
                },
                {
                    name: "position",
                    type: "core::array::Span::<(core::integer::u8, core::integer::u128)>",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_abi",
            inputs: [
                {
                    name: "model",
                    type: "dojo_starter::models::PositionCount",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "struct",
            name: "dojo_starter::models::PositionCountValue",
            members: [
                {
                    name: "position",
                    type: "core::array::Span::<(core::integer::u8, core::integer::u128)>",
                },
            ],
        },
        {
            type: "function",
            name: "ensure_values",
            inputs: [
                {
                    name: "value",
                    type: "dojo_starter::models::PositionCountValue",
                },
            ],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "function",
            name: "ensure_unique",
            inputs: [],
            outputs: [],
            state_mutability: "view",
        },
        {
            type: "impl",
            name: "PositionCount__DojoDeployedModelImpl",
            interface_name: "dojo::meta::interface::IDeployedResource",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IDeployedResource",
            items: [
                {
                    type: "function",
                    name: "dojo_name",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::byte_array::ByteArray",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "PositionCount__DojoStoredModelImpl",
            interface_name: "dojo::meta::interface::IStoredResource",
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
            name: "dojo::meta::layout::FieldLayout",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::FieldLayout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::Layout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::Layout>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::layout::Layout",
            variants: [
                {
                    name: "Fixed",
                    type: "core::array::Span::<core::integer::u8>",
                },
                {
                    name: "Struct",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
                {
                    name: "Enum",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
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
            name: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Enum",
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
                    type: "core::array::Span::<(core::felt252, dojo::meta::introspect::Ty)>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Ty>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Ty>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::introspect::Ty",
            variants: [
                {
                    name: "Primitive",
                    type: "core::felt252",
                },
                {
                    name: "Struct",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "Enum",
                    type: "dojo::meta::introspect::Enum",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::introspect::Ty>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Member",
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
                    name: "ty",
                    type: "dojo::meta::introspect::Ty",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::introspect::Member>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::meta::introspect::Struct",
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
                    type: "core::array::Span::<dojo::meta::introspect::Member>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::meta::interface::IStoredResource",
            items: [
                {
                    type: "function",
                    name: "layout",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::meta::layout::Layout",
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
                            type: "dojo::meta::introspect::Struct",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "impl",
            name: "PositionCount__DojoModelImpl",
            interface_name: "dojo::model::interface::IModel",
        },
        {
            type: "enum",
            name: "core::option::Option::<core::integer::u32>",
            variants: [
                {
                    name: "Some",
                    type: "core::integer::u32",
                },
                {
                    name: "None",
                    type: "()",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::model::definition::ModelDef",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
                {
                    name: "schema",
                    type: "dojo::meta::introspect::Struct",
                },
                {
                    name: "packed_size",
                    type: "core::option::Option::<core::integer::u32>",
                },
                {
                    name: "unpacked_size",
                    type: "core::option::Option::<core::integer::u32>",
                },
            ],
        },
        {
            type: "interface",
            name: "dojo::model::interface::IModel",
            items: [
                {
                    type: "function",
                    name: "unpacked_size",
                    inputs: [],
                    outputs: [
                        {
                            type: "core::option::Option::<core::integer::u32>",
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
                            type: "core::option::Option::<core::integer::u32>",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "definition",
                    inputs: [],
                    outputs: [
                        {
                            type: "dojo::model::definition::ModelDef",
                        },
                    ],
                    state_mutability: "view",
                },
            ],
        },
        {
            type: "event",
            name: "dojo_starter::models::m_PositionCount::Event",
            kind: "enum",
            variants: [],
        },
        {
            type: "impl",
            name: "World",
            interface_name: "dojo::world::iworld::IWorld",
        },
        {
            type: "struct",
            name: "core::byte_array::ByteArray",
            members: [
                {
                    name: "data",
                    type: "core::array::Array::<core::bytes_31::bytes31>",
                },
                {
                    name: "pending_word",
                    type: "core::felt252",
                },
                {
                    name: "pending_word_len",
                    type: "core::integer::u32",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::world::resource::Resource",
            variants: [
                {
                    name: "Model",
                    type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
                },
                {
                    name: "Event",
                    type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
                },
                {
                    name: "Contract",
                    type: "(core::starknet::contract_address::ContractAddress, core::felt252)",
                },
                {
                    name: "Namespace",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "World",
                    type: "()",
                },
                {
                    name: "Unregistered",
                    type: "()",
                },
                {
                    name: "Library",
                    type: "(core::starknet::class_hash::ClassHash, core::felt252)",
                },
            ],
        },
        {
            type: "struct",
            name: "dojo::model::metadata::ResourceMetadata",
            members: [
                {
                    name: "resource_id",
                    type: "core::felt252",
                },
                {
                    name: "metadata_uri",
                    type: "core::byte_array::ByteArray",
                },
                {
                    name: "metadata_hash",
                    type: "core::felt252",
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
            type: "enum",
            name: "dojo::model::definition::ModelIndex",
            variants: [
                {
                    name: "Keys",
                    type: "core::array::Span::<core::felt252>",
                },
                {
                    name: "Id",
                    type: "core::felt252",
                },
                {
                    name: "MemberId",
                    type: "(core::felt252, core::felt252)",
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
            type: "struct",
            name: "dojo::meta::layout::FieldLayout",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                },
                {
                    name: "layout",
                    type: "dojo::meta::layout::Layout",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::FieldLayout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::meta::layout::Layout>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::meta::layout::Layout>",
                },
            ],
        },
        {
            type: "enum",
            name: "dojo::meta::layout::Layout",
            variants: [
                {
                    name: "Fixed",
                    type: "core::array::Span::<core::integer::u8>",
                },
                {
                    name: "Struct",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
                {
                    name: "Tuple",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "Array",
                    type: "core::array::Span::<dojo::meta::layout::Layout>",
                },
                {
                    name: "ByteArray",
                    type: "()",
                },
                {
                    name: "Enum",
                    type: "core::array::Span::<dojo::meta::layout::FieldLayout>",
                },
            ],
        },
        {
            type: "struct",
            name: "core::array::Span::<dojo::model::definition::ModelIndex>",
            members: [
                {
                    name: "snapshot",
                    type: "@core::array::Array::<dojo::model::definition::ModelIndex>",
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
            name: "dojo::world::iworld::IWorld",
            items: [
                {
                    type: "function",
                    name: "resource",
                    inputs: [
                        {
                            name: "selector",
                            type: "core::felt252",
                        },
                    ],
                    outputs: [
                        {
                            type: "dojo::world::resource::Resource",
                        },
                    ],
                    state_mutability: "view",
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
                    name: "metadata",
                    inputs: [
                        {
                            name: "resource_selector",
                            type: "core::felt252",
                        },
                    ],
                    outputs: [
                        {
                            type: "dojo::model::metadata::ResourceMetadata",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "set_metadata",
                    inputs: [
                        {
                            name: "metadata",
                            type: "dojo::model::metadata::ResourceMetadata",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "register_namespace",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "register_event",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
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
                    name: "register_model",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
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
                    name: "register_contract",
                    inputs: [
                        {
                            name: "salt",
                            type: "core::felt252",
                        },
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
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
                    name: "register_library",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
                        {
                            name: "class_hash",
                            type: "core::starknet::class_hash::ClassHash",
                        },
                        {
                            name: "name",
                            type: "core::byte_array::ByteArray",
                        },
                        {
                            name: "version",
                            type: "core::byte_array::ByteArray",
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
                    name: "init_contract",
                    inputs: [
                        {
                            name: "selector",
                            type: "core::felt252",
                        },
                        {
                            name: "init_calldata",
                            type: "core::array::Span::<core::felt252>",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "upgrade_event",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
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
                    name: "upgrade_model",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                        },
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
                    name: "upgrade_contract",
                    inputs: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
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
                    name: "emit_event",
                    inputs: [
                        {
                            name: "event_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "keys",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::felt252>",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "emit_events",
                    inputs: [
                        {
                            name: "event_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "keys",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "entity",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "index",
                            type: "dojo::model::definition::ModelIndex",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
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
                    name: "entities",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "indexes",
                            type: "core::array::Span::<dojo::model::definition::ModelIndex>",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
                        },
                    ],
                    outputs: [
                        {
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "set_entity",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "index",
                            type: "dojo::model::definition::ModelIndex",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "set_entities",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "indexes",
                            type: "core::array::Span::<dojo::model::definition::ModelIndex>",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::array::Span::<core::felt252>>",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "delete_entity",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "index",
                            type: "dojo::model::definition::ModelIndex",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "delete_entities",
                    inputs: [
                        {
                            name: "model_selector",
                            type: "core::felt252",
                        },
                        {
                            name: "indexes",
                            type: "core::array::Span::<dojo::model::definition::ModelIndex>",
                        },
                        {
                            name: "layout",
                            type: "dojo::meta::layout::Layout",
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
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "address",
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
                    name: "grant_owner",
                    inputs: [
                        {
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
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
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
                        },
                    ],
                    outputs: [],
                    state_mutability: "external",
                },
                {
                    type: "function",
                    name: "owners_count",
                    inputs: [
                        {
                            name: "resource",
                            type: "core::felt252",
                        },
                    ],
                    outputs: [
                        {
                            type: "core::integer::u64",
                        },
                    ],
                    state_mutability: "view",
                },
                {
                    type: "function",
                    name: "is_writer",
                    inputs: [
                        {
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "contract",
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
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "contract",
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
                            name: "resource",
                            type: "core::felt252",
                        },
                        {
                            name: "contract",
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
            interface_name: "dojo::world::iworld::IUpgradeableWorld",
        },
        {
            type: "interface",
            name: "dojo::world::iworld::IUpgradeableWorld",
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
                    name: "world_class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::WorldSpawned",
            kind: "struct",
            members: [
                {
                    name: "creator",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "data",
                },
                {
                    name: "class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::WorldUpgraded",
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
            name: "dojo::world::world_contract::world::NamespaceRegistered",
            kind: "struct",
            members: [
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "hash",
                    type: "core::felt252",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::ModelRegistered",
            kind: "struct",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::EventRegistered",
            kind: "struct",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::ContractRegistered",
            kind: "struct",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "address",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "data",
                },
                {
                    name: "class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                    kind: "data",
                },
                {
                    name: "salt",
                    type: "core::felt252",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::ModelUpgraded",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
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
                {
                    name: "prev_address",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::EventUpgraded",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
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
                {
                    name: "prev_address",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::ContractUpgraded",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::ContractInitialized",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "init_calldata",
                    type: "core::array::Span::<core::felt252>",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::LibraryRegistered",
            kind: "struct",
            members: [
                {
                    name: "name",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "namespace",
                    type: "core::byte_array::ByteArray",
                    kind: "key",
                },
                {
                    name: "class_hash",
                    type: "core::starknet::class_hash::ClassHash",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::EventEmitted",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "system_address",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "key",
                },
                {
                    name: "keys",
                    type: "core::array::Span::<core::felt252>",
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
            name: "dojo::world::world_contract::world::MetadataUpdate",
            kind: "struct",
            members: [
                {
                    name: "resource",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "uri",
                    type: "core::byte_array::ByteArray",
                    kind: "data",
                },
                {
                    name: "hash",
                    type: "core::felt252",
                    kind: "data",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::StoreSetRecord",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "entity_id",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "keys",
                    type: "core::array::Span::<core::felt252>",
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
            name: "dojo::world::world_contract::world::StoreUpdateRecord",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "entity_id",
                    type: "core::felt252",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::StoreUpdateMember",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "entity_id",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "member_selector",
                    type: "core::felt252",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::StoreDelRecord",
            kind: "struct",
            members: [
                {
                    name: "selector",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "entity_id",
                    type: "core::felt252",
                    kind: "key",
                },
            ],
        },
        {
            type: "event",
            name: "dojo::world::world_contract::world::WriterUpdated",
            kind: "struct",
            members: [
                {
                    name: "resource",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "contract",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::OwnerUpdated",
            kind: "struct",
            members: [
                {
                    name: "resource",
                    type: "core::felt252",
                    kind: "key",
                },
                {
                    name: "contract",
                    type: "core::starknet::contract_address::ContractAddress",
                    kind: "key",
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
            name: "dojo::world::world_contract::world::Event",
            kind: "enum",
            variants: [
                {
                    name: "WorldSpawned",
                    type: "dojo::world::world_contract::world::WorldSpawned",
                    kind: "nested",
                },
                {
                    name: "WorldUpgraded",
                    type: "dojo::world::world_contract::world::WorldUpgraded",
                    kind: "nested",
                },
                {
                    name: "NamespaceRegistered",
                    type: "dojo::world::world_contract::world::NamespaceRegistered",
                    kind: "nested",
                },
                {
                    name: "ModelRegistered",
                    type: "dojo::world::world_contract::world::ModelRegistered",
                    kind: "nested",
                },
                {
                    name: "EventRegistered",
                    type: "dojo::world::world_contract::world::EventRegistered",
                    kind: "nested",
                },
                {
                    name: "ContractRegistered",
                    type: "dojo::world::world_contract::world::ContractRegistered",
                    kind: "nested",
                },
                {
                    name: "ModelUpgraded",
                    type: "dojo::world::world_contract::world::ModelUpgraded",
                    kind: "nested",
                },
                {
                    name: "EventUpgraded",
                    type: "dojo::world::world_contract::world::EventUpgraded",
                    kind: "nested",
                },
                {
                    name: "ContractUpgraded",
                    type: "dojo::world::world_contract::world::ContractUpgraded",
                    kind: "nested",
                },
                {
                    name: "ContractInitialized",
                    type: "dojo::world::world_contract::world::ContractInitialized",
                    kind: "nested",
                },
                {
                    name: "LibraryRegistered",
                    type: "dojo::world::world_contract::world::LibraryRegistered",
                    kind: "nested",
                },
                {
                    name: "EventEmitted",
                    type: "dojo::world::world_contract::world::EventEmitted",
                    kind: "nested",
                },
                {
                    name: "MetadataUpdate",
                    type: "dojo::world::world_contract::world::MetadataUpdate",
                    kind: "nested",
                },
                {
                    name: "StoreSetRecord",
                    type: "dojo::world::world_contract::world::StoreSetRecord",
                    kind: "nested",
                },
                {
                    name: "StoreUpdateRecord",
                    type: "dojo::world::world_contract::world::StoreUpdateRecord",
                    kind: "nested",
                },
                {
                    name: "StoreUpdateMember",
                    type: "dojo::world::world_contract::world::StoreUpdateMember",
                    kind: "nested",
                },
                {
                    name: "StoreDelRecord",
                    type: "dojo::world::world_contract::world::StoreDelRecord",
                    kind: "nested",
                },
                {
                    name: "WriterUpdated",
                    type: "dojo::world::world_contract::world::WriterUpdated",
                    kind: "nested",
                },
                {
                    name: "OwnerUpdated",
                    type: "dojo::world::world_contract::world::OwnerUpdated",
                    kind: "nested",
                },
            ],
        },
    ],
} as const;

export type CompiledAbi = typeof compiledAbi;
