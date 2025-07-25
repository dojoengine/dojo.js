// src/client.ts
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

// src/generated/google/protobuf/empty.ts
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
var Empty$Type = class extends MessageType {
  constructor() {
    super("google.protobuf.Empty", []);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Empty = new Empty$Type();

// src/generated/world.ts
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { WireType as WireType3 } from "@protobuf-ts/runtime";
import { UnknownFieldHandler as UnknownFieldHandler4 } from "@protobuf-ts/runtime";
import { reflectionMergePartial as reflectionMergePartial4 } from "@protobuf-ts/runtime";
import { MessageType as MessageType4 } from "@protobuf-ts/runtime";

// src/generated/types.ts
import { WireType as WireType2 } from "@protobuf-ts/runtime";
import { UnknownFieldHandler as UnknownFieldHandler3 } from "@protobuf-ts/runtime";
import { reflectionMergePartial as reflectionMergePartial3 } from "@protobuf-ts/runtime";
import { MessageType as MessageType3 } from "@protobuf-ts/runtime";

// src/generated/schema.ts
import { WireType } from "@protobuf-ts/runtime";
import { UnknownFieldHandler as UnknownFieldHandler2 } from "@protobuf-ts/runtime";
import { reflectionMergePartial as reflectionMergePartial2 } from "@protobuf-ts/runtime";
import { MessageType as MessageType2 } from "@protobuf-ts/runtime";
var EnumOption$Type = class extends MessageType2 {
  constructor() {
    super("types.EnumOption", [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "ty", kind: "message", T: () => Ty }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.name = "";
    if (value !== void 0)
      reflectionMergePartial2(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string name */
        1:
          message.name = reader.string();
          break;
        case /* types.Ty ty */
        2:
          message.ty = Ty.internalBinaryRead(reader, reader.uint32(), options, message.ty);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler2.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.name !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.name);
    if (message.ty)
      Ty.internalBinaryWrite(message.ty, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler2.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var EnumOption = new EnumOption$Type();
var Enum$Type = class extends MessageType2 {
  constructor() {
    super("types.Enum", [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "option",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      { no: 3, name: "options", kind: "message", repeat: 2, T: () => EnumOption }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.name = "";
    message.option = 0;
    message.options = [];
    if (value !== void 0)
      reflectionMergePartial2(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string name */
        1:
          message.name = reader.string();
          break;
        case /* uint32 option */
        2:
          message.option = reader.uint32();
          break;
        case /* repeated types.EnumOption options */
        3:
          message.options.push(EnumOption.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler2.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.name !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.name);
    if (message.option !== 0)
      writer.tag(2, WireType.Varint).uint32(message.option);
    for (let i = 0; i < message.options.length; i++)
      EnumOption.internalBinaryWrite(message.options[i], writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler2.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Enum = new Enum$Type();
var Primitive$Type = class extends MessageType2 {
  constructor() {
    super("types.Primitive", [
      {
        no: 1,
        name: "i8",
        kind: "scalar",
        oneof: "primitiveType",
        T: 5
        /*ScalarType.INT32*/
      },
      {
        no: 2,
        name: "i16",
        kind: "scalar",
        oneof: "primitiveType",
        T: 5
        /*ScalarType.INT32*/
      },
      {
        no: 3,
        name: "i32",
        kind: "scalar",
        oneof: "primitiveType",
        T: 5
        /*ScalarType.INT32*/
      },
      {
        no: 4,
        name: "i64",
        kind: "scalar",
        oneof: "primitiveType",
        T: 3,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 5,
        name: "i128",
        kind: "scalar",
        oneof: "primitiveType",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 6,
        name: "u8",
        kind: "scalar",
        oneof: "primitiveType",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 7,
        name: "u16",
        kind: "scalar",
        oneof: "primitiveType",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 8,
        name: "u32",
        kind: "scalar",
        oneof: "primitiveType",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 9,
        name: "u64",
        kind: "scalar",
        oneof: "primitiveType",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 10,
        name: "u128",
        kind: "scalar",
        oneof: "primitiveType",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 11,
        name: "u256",
        kind: "scalar",
        oneof: "primitiveType",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 12,
        name: "bool",
        kind: "scalar",
        oneof: "primitiveType",
        T: 8
        /*ScalarType.BOOL*/
      },
      {
        no: 13,
        name: "felt252",
        kind: "scalar",
        oneof: "primitiveType",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 14,
        name: "class_hash",
        kind: "scalar",
        oneof: "primitiveType",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 15,
        name: "contract_address",
        kind: "scalar",
        oneof: "primitiveType",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 16,
        name: "eth_address",
        kind: "scalar",
        oneof: "primitiveType",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.primitiveType = { oneofKind: void 0 };
    if (value !== void 0)
      reflectionMergePartial2(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* int32 i8 */
        1:
          message.primitiveType = {
            oneofKind: "i8",
            i8: reader.int32()
          };
          break;
        case /* int32 i16 */
        2:
          message.primitiveType = {
            oneofKind: "i16",
            i16: reader.int32()
          };
          break;
        case /* int32 i32 */
        3:
          message.primitiveType = {
            oneofKind: "i32",
            i32: reader.int32()
          };
          break;
        case /* int64 i64 */
        4:
          message.primitiveType = {
            oneofKind: "i64",
            i64: reader.int64().toBigInt()
          };
          break;
        case /* bytes i128 */
        5:
          message.primitiveType = {
            oneofKind: "i128",
            i128: reader.bytes()
          };
          break;
        case /* uint32 u8 */
        6:
          message.primitiveType = {
            oneofKind: "u8",
            u8: reader.uint32()
          };
          break;
        case /* uint32 u16 */
        7:
          message.primitiveType = {
            oneofKind: "u16",
            u16: reader.uint32()
          };
          break;
        case /* uint32 u32 */
        8:
          message.primitiveType = {
            oneofKind: "u32",
            u32: reader.uint32()
          };
          break;
        case /* uint64 u64 */
        9:
          message.primitiveType = {
            oneofKind: "u64",
            u64: reader.uint64().toBigInt()
          };
          break;
        case /* bytes u128 */
        10:
          message.primitiveType = {
            oneofKind: "u128",
            u128: reader.bytes()
          };
          break;
        case /* bytes u256 */
        11:
          message.primitiveType = {
            oneofKind: "u256",
            u256: reader.bytes()
          };
          break;
        case /* bool bool */
        12:
          message.primitiveType = {
            oneofKind: "bool",
            bool: reader.bool()
          };
          break;
        case /* bytes felt252 */
        13:
          message.primitiveType = {
            oneofKind: "felt252",
            felt252: reader.bytes()
          };
          break;
        case /* bytes class_hash */
        14:
          message.primitiveType = {
            oneofKind: "classHash",
            classHash: reader.bytes()
          };
          break;
        case /* bytes contract_address */
        15:
          message.primitiveType = {
            oneofKind: "contractAddress",
            contractAddress: reader.bytes()
          };
          break;
        case /* bytes eth_address */
        16:
          message.primitiveType = {
            oneofKind: "ethAddress",
            ethAddress: reader.bytes()
          };
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler2.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.primitiveType.oneofKind === "i8")
      writer.tag(1, WireType.Varint).int32(message.primitiveType.i8);
    if (message.primitiveType.oneofKind === "i16")
      writer.tag(2, WireType.Varint).int32(message.primitiveType.i16);
    if (message.primitiveType.oneofKind === "i32")
      writer.tag(3, WireType.Varint).int32(message.primitiveType.i32);
    if (message.primitiveType.oneofKind === "i64")
      writer.tag(4, WireType.Varint).int64(message.primitiveType.i64);
    if (message.primitiveType.oneofKind === "i128")
      writer.tag(5, WireType.LengthDelimited).bytes(message.primitiveType.i128);
    if (message.primitiveType.oneofKind === "u8")
      writer.tag(6, WireType.Varint).uint32(message.primitiveType.u8);
    if (message.primitiveType.oneofKind === "u16")
      writer.tag(7, WireType.Varint).uint32(message.primitiveType.u16);
    if (message.primitiveType.oneofKind === "u32")
      writer.tag(8, WireType.Varint).uint32(message.primitiveType.u32);
    if (message.primitiveType.oneofKind === "u64")
      writer.tag(9, WireType.Varint).uint64(message.primitiveType.u64);
    if (message.primitiveType.oneofKind === "u128")
      writer.tag(10, WireType.LengthDelimited).bytes(message.primitiveType.u128);
    if (message.primitiveType.oneofKind === "u256")
      writer.tag(11, WireType.LengthDelimited).bytes(message.primitiveType.u256);
    if (message.primitiveType.oneofKind === "bool")
      writer.tag(12, WireType.Varint).bool(message.primitiveType.bool);
    if (message.primitiveType.oneofKind === "felt252")
      writer.tag(13, WireType.LengthDelimited).bytes(message.primitiveType.felt252);
    if (message.primitiveType.oneofKind === "classHash")
      writer.tag(14, WireType.LengthDelimited).bytes(message.primitiveType.classHash);
    if (message.primitiveType.oneofKind === "contractAddress")
      writer.tag(15, WireType.LengthDelimited).bytes(message.primitiveType.contractAddress);
    if (message.primitiveType.oneofKind === "ethAddress")
      writer.tag(16, WireType.LengthDelimited).bytes(message.primitiveType.ethAddress);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler2.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Primitive = new Primitive$Type();
var Struct$Type = class extends MessageType2 {
  constructor() {
    super("types.Struct", [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "children", kind: "message", repeat: 2, T: () => Member }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.name = "";
    message.children = [];
    if (value !== void 0)
      reflectionMergePartial2(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string name */
        1:
          message.name = reader.string();
          break;
        case /* repeated types.Member children */
        2:
          message.children.push(Member.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler2.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.name !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.name);
    for (let i = 0; i < message.children.length; i++)
      Member.internalBinaryWrite(message.children[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler2.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Struct = new Struct$Type();
var Array$$Type = class extends MessageType2 {
  constructor() {
    super("types.Array", [
      { no: 1, name: "children", kind: "message", repeat: 2, T: () => Ty }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.children = [];
    if (value !== void 0)
      reflectionMergePartial2(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated types.Ty children */
        1:
          message.children.push(Ty.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler2.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.children.length; i++)
      Ty.internalBinaryWrite(message.children[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler2.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Array$ = new Array$$Type();
var Ty$Type = class extends MessageType2 {
  constructor() {
    super("types.Ty", [
      { no: 2, name: "primitive", kind: "message", oneof: "tyType", T: () => Primitive },
      { no: 3, name: "enum", kind: "message", oneof: "tyType", T: () => Enum },
      { no: 4, name: "struct", kind: "message", oneof: "tyType", T: () => Struct },
      { no: 5, name: "tuple", kind: "message", oneof: "tyType", T: () => Array$ },
      { no: 6, name: "array", kind: "message", oneof: "tyType", T: () => Array$ },
      {
        no: 7,
        name: "bytearray",
        kind: "scalar",
        oneof: "tyType",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.tyType = { oneofKind: void 0 };
    if (value !== void 0)
      reflectionMergePartial2(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Primitive primitive */
        2:
          message.tyType = {
            oneofKind: "primitive",
            primitive: Primitive.internalBinaryRead(reader, reader.uint32(), options, message.tyType.primitive)
          };
          break;
        case /* types.Enum enum */
        3:
          message.tyType = {
            oneofKind: "enum",
            enum: Enum.internalBinaryRead(reader, reader.uint32(), options, message.tyType.enum)
          };
          break;
        case /* types.Struct struct */
        4:
          message.tyType = {
            oneofKind: "struct",
            struct: Struct.internalBinaryRead(reader, reader.uint32(), options, message.tyType.struct)
          };
          break;
        case /* types.Array tuple */
        5:
          message.tyType = {
            oneofKind: "tuple",
            tuple: Array$.internalBinaryRead(reader, reader.uint32(), options, message.tyType.tuple)
          };
          break;
        case /* types.Array array */
        6:
          message.tyType = {
            oneofKind: "array",
            array: Array$.internalBinaryRead(reader, reader.uint32(), options, message.tyType.array)
          };
          break;
        case /* string bytearray */
        7:
          message.tyType = {
            oneofKind: "bytearray",
            bytearray: reader.string()
          };
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler2.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.tyType.oneofKind === "primitive")
      Primitive.internalBinaryWrite(message.tyType.primitive, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.tyType.oneofKind === "enum")
      Enum.internalBinaryWrite(message.tyType.enum, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.tyType.oneofKind === "struct")
      Struct.internalBinaryWrite(message.tyType.struct, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    if (message.tyType.oneofKind === "tuple")
      Array$.internalBinaryWrite(message.tyType.tuple, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
    if (message.tyType.oneofKind === "array")
      Array$.internalBinaryWrite(message.tyType.array, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
    if (message.tyType.oneofKind === "bytearray")
      writer.tag(7, WireType.LengthDelimited).string(message.tyType.bytearray);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler2.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Ty = new Ty$Type();
var Member$Type = class extends MessageType2 {
  constructor() {
    super("types.Member", [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "ty", kind: "message", T: () => Ty },
      {
        no: 3,
        name: "key",
        kind: "scalar",
        T: 8
        /*ScalarType.BOOL*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.name = "";
    message.key = false;
    if (value !== void 0)
      reflectionMergePartial2(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string name */
        1:
          message.name = reader.string();
          break;
        case /* types.Ty ty */
        2:
          message.ty = Ty.internalBinaryRead(reader, reader.uint32(), options, message.ty);
          break;
        case /* bool key */
        3:
          message.key = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler2.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.name !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.name);
    if (message.ty)
      Ty.internalBinaryWrite(message.ty, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.key !== false)
      writer.tag(3, WireType.Varint).bool(message.key);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler2.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Member = new Member$Type();

// src/generated/types.ts
var PatternMatching = /* @__PURE__ */ ((PatternMatching2) => {
  PatternMatching2[PatternMatching2["FixedLen"] = 0] = "FixedLen";
  PatternMatching2[PatternMatching2["VariableLen"] = 1] = "VariableLen";
  return PatternMatching2;
})(PatternMatching || {});
var LogicalOperator = /* @__PURE__ */ ((LogicalOperator2) => {
  LogicalOperator2[LogicalOperator2["AND"] = 0] = "AND";
  LogicalOperator2[LogicalOperator2["OR"] = 1] = "OR";
  return LogicalOperator2;
})(LogicalOperator || {});
var ComparisonOperator = /* @__PURE__ */ ((ComparisonOperator2) => {
  ComparisonOperator2[ComparisonOperator2["EQ"] = 0] = "EQ";
  ComparisonOperator2[ComparisonOperator2["NEQ"] = 1] = "NEQ";
  ComparisonOperator2[ComparisonOperator2["GT"] = 2] = "GT";
  ComparisonOperator2[ComparisonOperator2["GTE"] = 3] = "GTE";
  ComparisonOperator2[ComparisonOperator2["LT"] = 4] = "LT";
  ComparisonOperator2[ComparisonOperator2["LTE"] = 5] = "LTE";
  ComparisonOperator2[ComparisonOperator2["IN"] = 6] = "IN";
  ComparisonOperator2[ComparisonOperator2["NOT_IN"] = 7] = "NOT_IN";
  return ComparisonOperator2;
})(ComparisonOperator || {});
var OrderDirection = /* @__PURE__ */ ((OrderDirection2) => {
  OrderDirection2[OrderDirection2["ASC"] = 0] = "ASC";
  OrderDirection2[OrderDirection2["DESC"] = 1] = "DESC";
  return OrderDirection2;
})(OrderDirection || {});
var PaginationDirection = /* @__PURE__ */ ((PaginationDirection2) => {
  PaginationDirection2[PaginationDirection2["FORWARD"] = 0] = "FORWARD";
  PaginationDirection2[PaginationDirection2["BACKWARD"] = 1] = "BACKWARD";
  return PaginationDirection2;
})(PaginationDirection || {});
var CallType = /* @__PURE__ */ ((CallType2) => {
  CallType2[CallType2["EXECUTE"] = 0] = "EXECUTE";
  CallType2[CallType2["EXECUTE_FROM_OUTSIDE"] = 1] = "EXECUTE_FROM_OUTSIDE";
  return CallType2;
})(CallType || {});
var World$Type = class extends MessageType3 {
  constructor() {
    super("types.World", [
      {
        no: 1,
        name: "world_address",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "models", kind: "message", repeat: 2, T: () => Model }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.worldAddress = "";
    message.models = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string world_address */
        1:
          message.worldAddress = reader.string();
          break;
        case /* repeated types.Model models */
        2:
          message.models.push(Model.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.worldAddress !== "")
      writer.tag(1, WireType2.LengthDelimited).string(message.worldAddress);
    for (let i = 0; i < message.models.length; i++)
      Model.internalBinaryWrite(message.models[i], writer.tag(2, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var World = new World$Type();
var Model$Type = class extends MessageType3 {
  constructor() {
    super("types.Model", [
      {
        no: 1,
        name: "selector",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "namespace",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 3,
        name: "name",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 4,
        name: "packed_size",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 5,
        name: "unpacked_size",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 6,
        name: "class_hash",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 7,
        name: "layout",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 8,
        name: "schema",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 9,
        name: "contract_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.selector = new Uint8Array(0);
    message.namespace = "";
    message.name = "";
    message.packedSize = 0;
    message.unpackedSize = 0;
    message.classHash = new Uint8Array(0);
    message.layout = new Uint8Array(0);
    message.schema = new Uint8Array(0);
    message.contractAddress = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes selector */
        1:
          message.selector = reader.bytes();
          break;
        case /* string namespace */
        2:
          message.namespace = reader.string();
          break;
        case /* string name */
        3:
          message.name = reader.string();
          break;
        case /* uint32 packed_size */
        4:
          message.packedSize = reader.uint32();
          break;
        case /* uint32 unpacked_size */
        5:
          message.unpackedSize = reader.uint32();
          break;
        case /* bytes class_hash */
        6:
          message.classHash = reader.bytes();
          break;
        case /* bytes layout */
        7:
          message.layout = reader.bytes();
          break;
        case /* bytes schema */
        8:
          message.schema = reader.bytes();
          break;
        case /* bytes contract_address */
        9:
          message.contractAddress = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.selector.length)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.selector);
    if (message.namespace !== "")
      writer.tag(2, WireType2.LengthDelimited).string(message.namespace);
    if (message.name !== "")
      writer.tag(3, WireType2.LengthDelimited).string(message.name);
    if (message.packedSize !== 0)
      writer.tag(4, WireType2.Varint).uint32(message.packedSize);
    if (message.unpackedSize !== 0)
      writer.tag(5, WireType2.Varint).uint32(message.unpackedSize);
    if (message.classHash.length)
      writer.tag(6, WireType2.LengthDelimited).bytes(message.classHash);
    if (message.layout.length)
      writer.tag(7, WireType2.LengthDelimited).bytes(message.layout);
    if (message.schema.length)
      writer.tag(8, WireType2.LengthDelimited).bytes(message.schema);
    if (message.contractAddress.length)
      writer.tag(9, WireType2.LengthDelimited).bytes(message.contractAddress);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Model = new Model$Type();
var Entity$Type = class extends MessageType3 {
  constructor() {
    super("types.Entity", [
      {
        no: 1,
        name: "hashed_keys",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      { no: 2, name: "models", kind: "message", repeat: 2, T: () => Struct }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.hashedKeys = new Uint8Array(0);
    message.models = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes hashed_keys */
        1:
          message.hashedKeys = reader.bytes();
          break;
        case /* repeated types.Struct models */
        2:
          message.models.push(Struct.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.hashedKeys.length)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.hashedKeys);
    for (let i = 0; i < message.models.length; i++)
      Struct.internalBinaryWrite(message.models[i], writer.tag(2, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Entity = new Entity$Type();
var Event$Type = class extends MessageType3 {
  constructor() {
    super("types.Event", [
      {
        no: 1,
        name: "keys",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "data",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "transaction_hash",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.keys = [];
    message.data = [];
    message.transactionHash = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes keys */
        1:
          message.keys.push(reader.bytes());
          break;
        case /* repeated bytes data */
        2:
          message.data.push(reader.bytes());
          break;
        case /* bytes transaction_hash */
        3:
          message.transactionHash = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.keys.length; i++)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.keys[i]);
    for (let i = 0; i < message.data.length; i++)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.data[i]);
    if (message.transactionHash.length)
      writer.tag(3, WireType2.LengthDelimited).bytes(message.transactionHash);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Event = new Event$Type();
var Query$Type = class extends MessageType3 {
  constructor() {
    super("types.Query", [
      { no: 1, name: "clause", kind: "message", T: () => Clause },
      {
        no: 2,
        name: "no_hashed_keys",
        kind: "scalar",
        T: 8
        /*ScalarType.BOOL*/
      },
      {
        no: 3,
        name: "models",
        kind: "scalar",
        repeat: 2,
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 4, name: "pagination", kind: "message", T: () => Pagination },
      {
        no: 5,
        name: "historical",
        kind: "scalar",
        T: 8
        /*ScalarType.BOOL*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.noHashedKeys = false;
    message.models = [];
    message.historical = false;
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Clause clause */
        1:
          message.clause = Clause.internalBinaryRead(reader, reader.uint32(), options, message.clause);
          break;
        case /* bool no_hashed_keys */
        2:
          message.noHashedKeys = reader.bool();
          break;
        case /* repeated string models */
        3:
          message.models.push(reader.string());
          break;
        case /* types.Pagination pagination */
        4:
          message.pagination = Pagination.internalBinaryRead(reader, reader.uint32(), options, message.pagination);
          break;
        case /* bool historical */
        5:
          message.historical = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.clause)
      Clause.internalBinaryWrite(message.clause, writer.tag(1, WireType2.LengthDelimited).fork(), options).join();
    if (message.noHashedKeys !== false)
      writer.tag(2, WireType2.Varint).bool(message.noHashedKeys);
    for (let i = 0; i < message.models.length; i++)
      writer.tag(3, WireType2.LengthDelimited).string(message.models[i]);
    if (message.pagination)
      Pagination.internalBinaryWrite(message.pagination, writer.tag(4, WireType2.LengthDelimited).fork(), options).join();
    if (message.historical !== false)
      writer.tag(5, WireType2.Varint).bool(message.historical);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Query = new Query$Type();
var EventQuery$Type = class extends MessageType3 {
  constructor() {
    super("types.EventQuery", [
      { no: 1, name: "keys", kind: "message", T: () => KeysClause },
      { no: 2, name: "pagination", kind: "message", T: () => Pagination }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.KeysClause keys */
        1:
          message.keys = KeysClause.internalBinaryRead(reader, reader.uint32(), options, message.keys);
          break;
        case /* types.Pagination pagination */
        2:
          message.pagination = Pagination.internalBinaryRead(reader, reader.uint32(), options, message.pagination);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.keys)
      KeysClause.internalBinaryWrite(message.keys, writer.tag(1, WireType2.LengthDelimited).fork(), options).join();
    if (message.pagination)
      Pagination.internalBinaryWrite(message.pagination, writer.tag(2, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var EventQuery = new EventQuery$Type();
var Clause$Type = class extends MessageType3 {
  constructor() {
    super("types.Clause", [
      { no: 1, name: "hashed_keys", kind: "message", oneof: "clauseType", T: () => HashedKeysClause },
      { no: 2, name: "keys", kind: "message", oneof: "clauseType", T: () => KeysClause },
      { no: 3, name: "member", kind: "message", oneof: "clauseType", T: () => MemberClause },
      { no: 4, name: "composite", kind: "message", oneof: "clauseType", T: () => CompositeClause }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.clauseType = { oneofKind: void 0 };
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.HashedKeysClause hashed_keys */
        1:
          message.clauseType = {
            oneofKind: "hashedKeys",
            hashedKeys: HashedKeysClause.internalBinaryRead(reader, reader.uint32(), options, message.clauseType.hashedKeys)
          };
          break;
        case /* types.KeysClause keys */
        2:
          message.clauseType = {
            oneofKind: "keys",
            keys: KeysClause.internalBinaryRead(reader, reader.uint32(), options, message.clauseType.keys)
          };
          break;
        case /* types.MemberClause member */
        3:
          message.clauseType = {
            oneofKind: "member",
            member: MemberClause.internalBinaryRead(reader, reader.uint32(), options, message.clauseType.member)
          };
          break;
        case /* types.CompositeClause composite */
        4:
          message.clauseType = {
            oneofKind: "composite",
            composite: CompositeClause.internalBinaryRead(reader, reader.uint32(), options, message.clauseType.composite)
          };
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.clauseType.oneofKind === "hashedKeys")
      HashedKeysClause.internalBinaryWrite(message.clauseType.hashedKeys, writer.tag(1, WireType2.LengthDelimited).fork(), options).join();
    if (message.clauseType.oneofKind === "keys")
      KeysClause.internalBinaryWrite(message.clauseType.keys, writer.tag(2, WireType2.LengthDelimited).fork(), options).join();
    if (message.clauseType.oneofKind === "member")
      MemberClause.internalBinaryWrite(message.clauseType.member, writer.tag(3, WireType2.LengthDelimited).fork(), options).join();
    if (message.clauseType.oneofKind === "composite")
      CompositeClause.internalBinaryWrite(message.clauseType.composite, writer.tag(4, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Clause = new Clause$Type();
var KeysClause$Type = class extends MessageType3 {
  constructor() {
    super("types.KeysClause", [
      {
        no: 2,
        name: "keys",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      { no: 3, name: "pattern_matching", kind: "enum", T: () => ["types.PatternMatching", PatternMatching] },
      {
        no: 4,
        name: "models",
        kind: "scalar",
        repeat: 2,
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.keys = [];
    message.patternMatching = 0;
    message.models = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes keys */
        2:
          message.keys.push(reader.bytes());
          break;
        case /* types.PatternMatching pattern_matching */
        3:
          message.patternMatching = reader.int32();
          break;
        case /* repeated string models */
        4:
          message.models.push(reader.string());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.keys.length; i++)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.keys[i]);
    if (message.patternMatching !== 0)
      writer.tag(3, WireType2.Varint).int32(message.patternMatching);
    for (let i = 0; i < message.models.length; i++)
      writer.tag(4, WireType2.LengthDelimited).string(message.models[i]);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var KeysClause = new KeysClause$Type();
var HashedKeysClause$Type = class extends MessageType3 {
  constructor() {
    super("types.HashedKeysClause", [
      {
        no: 1,
        name: "hashed_keys",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.hashedKeys = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes hashed_keys */
        1:
          message.hashedKeys.push(reader.bytes());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.hashedKeys.length; i++)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.hashedKeys[i]);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var HashedKeysClause = new HashedKeysClause$Type();
var MemberValue$Type = class extends MessageType3 {
  constructor() {
    super("types.MemberValue", [
      { no: 1, name: "primitive", kind: "message", oneof: "valueType", T: () => Primitive },
      {
        no: 2,
        name: "string",
        kind: "scalar",
        oneof: "valueType",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 3, name: "list", kind: "message", oneof: "valueType", T: () => MemberValueList }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.valueType = { oneofKind: void 0 };
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Primitive primitive */
        1:
          message.valueType = {
            oneofKind: "primitive",
            primitive: Primitive.internalBinaryRead(reader, reader.uint32(), options, message.valueType.primitive)
          };
          break;
        case /* string string */
        2:
          message.valueType = {
            oneofKind: "string",
            string: reader.string()
          };
          break;
        case /* types.MemberValueList list */
        3:
          message.valueType = {
            oneofKind: "list",
            list: MemberValueList.internalBinaryRead(reader, reader.uint32(), options, message.valueType.list)
          };
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.valueType.oneofKind === "primitive")
      Primitive.internalBinaryWrite(message.valueType.primitive, writer.tag(1, WireType2.LengthDelimited).fork(), options).join();
    if (message.valueType.oneofKind === "string")
      writer.tag(2, WireType2.LengthDelimited).string(message.valueType.string);
    if (message.valueType.oneofKind === "list")
      MemberValueList.internalBinaryWrite(message.valueType.list, writer.tag(3, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var MemberValue = new MemberValue$Type();
var MemberValueList$Type = class extends MessageType3 {
  constructor() {
    super("types.MemberValueList", [
      { no: 1, name: "values", kind: "message", repeat: 2, T: () => MemberValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.values = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated types.MemberValue values */
        1:
          message.values.push(MemberValue.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.values.length; i++)
      MemberValue.internalBinaryWrite(message.values[i], writer.tag(1, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var MemberValueList = new MemberValueList$Type();
var MemberClause$Type = class extends MessageType3 {
  constructor() {
    super("types.MemberClause", [
      {
        no: 2,
        name: "model",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 3,
        name: "member",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 4, name: "operator", kind: "enum", T: () => ["types.ComparisonOperator", ComparisonOperator] },
      { no: 5, name: "value", kind: "message", T: () => MemberValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.model = "";
    message.member = "";
    message.operator = 0;
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string model */
        2:
          message.model = reader.string();
          break;
        case /* string member */
        3:
          message.member = reader.string();
          break;
        case /* types.ComparisonOperator operator */
        4:
          message.operator = reader.int32();
          break;
        case /* types.MemberValue value */
        5:
          message.value = MemberValue.internalBinaryRead(reader, reader.uint32(), options, message.value);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.model !== "")
      writer.tag(2, WireType2.LengthDelimited).string(message.model);
    if (message.member !== "")
      writer.tag(3, WireType2.LengthDelimited).string(message.member);
    if (message.operator !== 0)
      writer.tag(4, WireType2.Varint).int32(message.operator);
    if (message.value)
      MemberValue.internalBinaryWrite(message.value, writer.tag(5, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var MemberClause = new MemberClause$Type();
var CompositeClause$Type = class extends MessageType3 {
  constructor() {
    super("types.CompositeClause", [
      { no: 3, name: "operator", kind: "enum", T: () => ["types.LogicalOperator", LogicalOperator] },
      { no: 4, name: "clauses", kind: "message", repeat: 2, T: () => Clause }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.operator = 0;
    message.clauses = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.LogicalOperator operator */
        3:
          message.operator = reader.int32();
          break;
        case /* repeated types.Clause clauses */
        4:
          message.clauses.push(Clause.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.operator !== 0)
      writer.tag(3, WireType2.Varint).int32(message.operator);
    for (let i = 0; i < message.clauses.length; i++)
      Clause.internalBinaryWrite(message.clauses[i], writer.tag(4, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var CompositeClause = new CompositeClause$Type();
var Token$Type = class extends MessageType3 {
  constructor() {
    super("types.Token", [
      {
        no: 1,
        name: "token_id",
        kind: "scalar",
        opt: true,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "contract_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "name",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 4,
        name: "symbol",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 5,
        name: "decimals",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 6,
        name: "metadata",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.contractAddress = new Uint8Array(0);
    message.name = "";
    message.symbol = "";
    message.decimals = 0;
    message.metadata = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* optional bytes token_id */
        1:
          message.tokenId = reader.bytes();
          break;
        case /* bytes contract_address */
        2:
          message.contractAddress = reader.bytes();
          break;
        case /* string name */
        3:
          message.name = reader.string();
          break;
        case /* string symbol */
        4:
          message.symbol = reader.string();
          break;
        case /* uint32 decimals */
        5:
          message.decimals = reader.uint32();
          break;
        case /* bytes metadata */
        6:
          message.metadata = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.tokenId !== void 0)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.tokenId);
    if (message.contractAddress.length)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.contractAddress);
    if (message.name !== "")
      writer.tag(3, WireType2.LengthDelimited).string(message.name);
    if (message.symbol !== "")
      writer.tag(4, WireType2.LengthDelimited).string(message.symbol);
    if (message.decimals !== 0)
      writer.tag(5, WireType2.Varint).uint32(message.decimals);
    if (message.metadata.length)
      writer.tag(6, WireType2.LengthDelimited).bytes(message.metadata);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Token = new Token$Type();
var TokenCollection$Type = class extends MessageType3 {
  constructor() {
    super("types.TokenCollection", [
      {
        no: 2,
        name: "contract_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "name",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 4,
        name: "symbol",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 5,
        name: "decimals",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 6,
        name: "count",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 7,
        name: "metadata",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.contractAddress = new Uint8Array(0);
    message.name = "";
    message.symbol = "";
    message.decimals = 0;
    message.count = 0;
    message.metadata = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes contract_address */
        2:
          message.contractAddress = reader.bytes();
          break;
        case /* string name */
        3:
          message.name = reader.string();
          break;
        case /* string symbol */
        4:
          message.symbol = reader.string();
          break;
        case /* uint32 decimals */
        5:
          message.decimals = reader.uint32();
          break;
        case /* uint32 count */
        6:
          message.count = reader.uint32();
          break;
        case /* bytes metadata */
        7:
          message.metadata = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.contractAddress.length)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.contractAddress);
    if (message.name !== "")
      writer.tag(3, WireType2.LengthDelimited).string(message.name);
    if (message.symbol !== "")
      writer.tag(4, WireType2.LengthDelimited).string(message.symbol);
    if (message.decimals !== 0)
      writer.tag(5, WireType2.Varint).uint32(message.decimals);
    if (message.count !== 0)
      writer.tag(6, WireType2.Varint).uint32(message.count);
    if (message.metadata.length)
      writer.tag(7, WireType2.LengthDelimited).bytes(message.metadata);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var TokenCollection = new TokenCollection$Type();
var TokenBalance$Type = class extends MessageType3 {
  constructor() {
    super("types.TokenBalance", [
      {
        no: 1,
        name: "balance",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "account_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "contract_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 4,
        name: "token_id",
        kind: "scalar",
        opt: true,
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.balance = new Uint8Array(0);
    message.accountAddress = new Uint8Array(0);
    message.contractAddress = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes balance */
        1:
          message.balance = reader.bytes();
          break;
        case /* bytes account_address */
        2:
          message.accountAddress = reader.bytes();
          break;
        case /* bytes contract_address */
        3:
          message.contractAddress = reader.bytes();
          break;
        case /* optional bytes token_id */
        4:
          message.tokenId = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.balance.length)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.balance);
    if (message.accountAddress.length)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.accountAddress);
    if (message.contractAddress.length)
      writer.tag(3, WireType2.LengthDelimited).bytes(message.contractAddress);
    if (message.tokenId !== void 0)
      writer.tag(4, WireType2.LengthDelimited).bytes(message.tokenId);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var TokenBalance = new TokenBalance$Type();
var OrderBy$Type = class extends MessageType3 {
  constructor() {
    super("types.OrderBy", [
      {
        no: 1,
        name: "field",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "direction", kind: "enum", T: () => ["types.OrderDirection", OrderDirection] }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.field = "";
    message.direction = 0;
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string field */
        1:
          message.field = reader.string();
          break;
        case /* types.OrderDirection direction */
        2:
          message.direction = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.field !== "")
      writer.tag(1, WireType2.LengthDelimited).string(message.field);
    if (message.direction !== 0)
      writer.tag(2, WireType2.Varint).int32(message.direction);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var OrderBy = new OrderBy$Type();
var Controller$Type = class extends MessageType3 {
  constructor() {
    super("types.Controller", [
      {
        no: 1,
        name: "address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "username",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 3,
        name: "deployed_at_timestamp",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.address = new Uint8Array(0);
    message.username = "";
    message.deployedAtTimestamp = 0n;
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes address */
        1:
          message.address = reader.bytes();
          break;
        case /* string username */
        2:
          message.username = reader.string();
          break;
        case /* uint64 deployed_at_timestamp */
        3:
          message.deployedAtTimestamp = reader.uint64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.address.length)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.address);
    if (message.username !== "")
      writer.tag(2, WireType2.LengthDelimited).string(message.username);
    if (message.deployedAtTimestamp !== 0n)
      writer.tag(3, WireType2.Varint).uint64(message.deployedAtTimestamp);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Controller = new Controller$Type();
var Pagination$Type = class extends MessageType3 {
  constructor() {
    super("types.Pagination", [
      {
        no: 1,
        name: "cursor",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "limit",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      { no: 3, name: "direction", kind: "enum", T: () => ["types.PaginationDirection", PaginationDirection] },
      { no: 4, name: "order_by", kind: "message", repeat: 2, T: () => OrderBy }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.cursor = "";
    message.limit = 0;
    message.direction = 0;
    message.orderBy = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string cursor */
        1:
          message.cursor = reader.string();
          break;
        case /* uint32 limit */
        2:
          message.limit = reader.uint32();
          break;
        case /* types.PaginationDirection direction */
        3:
          message.direction = reader.int32();
          break;
        case /* repeated types.OrderBy order_by */
        4:
          message.orderBy.push(OrderBy.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.cursor !== "")
      writer.tag(1, WireType2.LengthDelimited).string(message.cursor);
    if (message.limit !== 0)
      writer.tag(2, WireType2.Varint).uint32(message.limit);
    if (message.direction !== 0)
      writer.tag(3, WireType2.Varint).int32(message.direction);
    for (let i = 0; i < message.orderBy.length; i++)
      OrderBy.internalBinaryWrite(message.orderBy[i], writer.tag(4, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Pagination = new Pagination$Type();
var ControllerQuery$Type = class extends MessageType3 {
  constructor() {
    super("types.ControllerQuery", [
      {
        no: 1,
        name: "contract_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "usernames",
        kind: "scalar",
        repeat: 2,
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 3, name: "pagination", kind: "message", T: () => Pagination }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.contractAddresses = [];
    message.usernames = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes contract_addresses */
        1:
          message.contractAddresses.push(reader.bytes());
          break;
        case /* repeated string usernames */
        2:
          message.usernames.push(reader.string());
          break;
        case /* types.Pagination pagination */
        3:
          message.pagination = Pagination.internalBinaryRead(reader, reader.uint32(), options, message.pagination);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.contractAddresses.length; i++)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.contractAddresses[i]);
    for (let i = 0; i < message.usernames.length; i++)
      writer.tag(2, WireType2.LengthDelimited).string(message.usernames[i]);
    if (message.pagination)
      Pagination.internalBinaryWrite(message.pagination, writer.tag(3, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var ControllerQuery = new ControllerQuery$Type();
var TokenQuery$Type = class extends MessageType3 {
  constructor() {
    super("types.TokenQuery", [
      {
        no: 1,
        name: "contract_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "token_ids",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      { no: 3, name: "pagination", kind: "message", T: () => Pagination }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.contractAddresses = [];
    message.tokenIds = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes contract_addresses */
        1:
          message.contractAddresses.push(reader.bytes());
          break;
        case /* repeated bytes token_ids */
        2:
          message.tokenIds.push(reader.bytes());
          break;
        case /* types.Pagination pagination */
        3:
          message.pagination = Pagination.internalBinaryRead(reader, reader.uint32(), options, message.pagination);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.contractAddresses.length; i++)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.contractAddresses[i]);
    for (let i = 0; i < message.tokenIds.length; i++)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.tokenIds[i]);
    if (message.pagination)
      Pagination.internalBinaryWrite(message.pagination, writer.tag(3, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var TokenQuery = new TokenQuery$Type();
var TokenBalanceQuery$Type = class extends MessageType3 {
  constructor() {
    super("types.TokenBalanceQuery", [
      {
        no: 1,
        name: "account_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "contract_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "token_ids",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      { no: 4, name: "pagination", kind: "message", T: () => Pagination }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.accountAddresses = [];
    message.contractAddresses = [];
    message.tokenIds = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes account_addresses */
        1:
          message.accountAddresses.push(reader.bytes());
          break;
        case /* repeated bytes contract_addresses */
        2:
          message.contractAddresses.push(reader.bytes());
          break;
        case /* repeated bytes token_ids */
        3:
          message.tokenIds.push(reader.bytes());
          break;
        case /* types.Pagination pagination */
        4:
          message.pagination = Pagination.internalBinaryRead(reader, reader.uint32(), options, message.pagination);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.accountAddresses.length; i++)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.accountAddresses[i]);
    for (let i = 0; i < message.contractAddresses.length; i++)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.contractAddresses[i]);
    for (let i = 0; i < message.tokenIds.length; i++)
      writer.tag(3, WireType2.LengthDelimited).bytes(message.tokenIds[i]);
    if (message.pagination)
      Pagination.internalBinaryWrite(message.pagination, writer.tag(4, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var TokenBalanceQuery = new TokenBalanceQuery$Type();
var TransactionCall$Type = class extends MessageType3 {
  constructor() {
    super("types.TransactionCall", [
      {
        no: 1,
        name: "contract_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "entrypoint",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 3,
        name: "calldata",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      { no: 4, name: "call_type", kind: "enum", T: () => ["types.CallType", CallType] },
      {
        no: 5,
        name: "caller_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.contractAddress = new Uint8Array(0);
    message.entrypoint = "";
    message.calldata = [];
    message.callType = 0;
    message.callerAddress = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes contract_address */
        1:
          message.contractAddress = reader.bytes();
          break;
        case /* string entrypoint */
        2:
          message.entrypoint = reader.string();
          break;
        case /* repeated bytes calldata */
        3:
          message.calldata.push(reader.bytes());
          break;
        case /* types.CallType call_type */
        4:
          message.callType = reader.int32();
          break;
        case /* bytes caller_address */
        5:
          message.callerAddress = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.contractAddress.length)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.contractAddress);
    if (message.entrypoint !== "")
      writer.tag(2, WireType2.LengthDelimited).string(message.entrypoint);
    for (let i = 0; i < message.calldata.length; i++)
      writer.tag(3, WireType2.LengthDelimited).bytes(message.calldata[i]);
    if (message.callType !== 0)
      writer.tag(4, WireType2.Varint).int32(message.callType);
    if (message.callerAddress.length)
      writer.tag(5, WireType2.LengthDelimited).bytes(message.callerAddress);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var TransactionCall = new TransactionCall$Type();
var Transaction$Type = class extends MessageType3 {
  constructor() {
    super("types.Transaction", [
      {
        no: 1,
        name: "transaction_hash",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "sender_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "calldata",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 4,
        name: "max_fee",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 5,
        name: "signature",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 6,
        name: "nonce",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 7,
        name: "block_number",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 8,
        name: "transaction_type",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 9,
        name: "block_timestamp",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      { no: 10, name: "calls", kind: "message", repeat: 2, T: () => TransactionCall },
      {
        no: 11,
        name: "unique_models",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.transactionHash = new Uint8Array(0);
    message.senderAddress = new Uint8Array(0);
    message.calldata = [];
    message.maxFee = new Uint8Array(0);
    message.signature = [];
    message.nonce = new Uint8Array(0);
    message.blockNumber = 0n;
    message.transactionType = "";
    message.blockTimestamp = 0n;
    message.calls = [];
    message.uniqueModels = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes transaction_hash */
        1:
          message.transactionHash = reader.bytes();
          break;
        case /* bytes sender_address */
        2:
          message.senderAddress = reader.bytes();
          break;
        case /* repeated bytes calldata */
        3:
          message.calldata.push(reader.bytes());
          break;
        case /* bytes max_fee */
        4:
          message.maxFee = reader.bytes();
          break;
        case /* repeated bytes signature */
        5:
          message.signature.push(reader.bytes());
          break;
        case /* bytes nonce */
        6:
          message.nonce = reader.bytes();
          break;
        case /* uint64 block_number */
        7:
          message.blockNumber = reader.uint64().toBigInt();
          break;
        case /* string transaction_type */
        8:
          message.transactionType = reader.string();
          break;
        case /* uint64 block_timestamp */
        9:
          message.blockTimestamp = reader.uint64().toBigInt();
          break;
        case /* repeated types.TransactionCall calls */
        10:
          message.calls.push(TransactionCall.internalBinaryRead(reader, reader.uint32(), options));
          break;
        case /* repeated bytes unique_models */
        11:
          message.uniqueModels.push(reader.bytes());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.transactionHash.length)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.transactionHash);
    if (message.senderAddress.length)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.senderAddress);
    for (let i = 0; i < message.calldata.length; i++)
      writer.tag(3, WireType2.LengthDelimited).bytes(message.calldata[i]);
    if (message.maxFee.length)
      writer.tag(4, WireType2.LengthDelimited).bytes(message.maxFee);
    for (let i = 0; i < message.signature.length; i++)
      writer.tag(5, WireType2.LengthDelimited).bytes(message.signature[i]);
    if (message.nonce.length)
      writer.tag(6, WireType2.LengthDelimited).bytes(message.nonce);
    if (message.blockNumber !== 0n)
      writer.tag(7, WireType2.Varint).uint64(message.blockNumber);
    if (message.transactionType !== "")
      writer.tag(8, WireType2.LengthDelimited).string(message.transactionType);
    if (message.blockTimestamp !== 0n)
      writer.tag(9, WireType2.Varint).uint64(message.blockTimestamp);
    for (let i = 0; i < message.calls.length; i++)
      TransactionCall.internalBinaryWrite(message.calls[i], writer.tag(10, WireType2.LengthDelimited).fork(), options).join();
    for (let i = 0; i < message.uniqueModels.length; i++)
      writer.tag(11, WireType2.LengthDelimited).bytes(message.uniqueModels[i]);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Transaction = new Transaction$Type();
var TransactionFilter$Type = class extends MessageType3 {
  constructor() {
    super("types.TransactionFilter", [
      {
        no: 1,
        name: "transaction_hashes",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "caller_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "contract_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 4,
        name: "entrypoints",
        kind: "scalar",
        repeat: 2,
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 5,
        name: "model_selectors",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 6,
        name: "from_block",
        kind: "scalar",
        opt: true,
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 7,
        name: "to_block",
        kind: "scalar",
        opt: true,
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.transactionHashes = [];
    message.callerAddresses = [];
    message.contractAddresses = [];
    message.entrypoints = [];
    message.modelSelectors = [];
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes transaction_hashes */
        1:
          message.transactionHashes.push(reader.bytes());
          break;
        case /* repeated bytes caller_addresses */
        2:
          message.callerAddresses.push(reader.bytes());
          break;
        case /* repeated bytes contract_addresses */
        3:
          message.contractAddresses.push(reader.bytes());
          break;
        case /* repeated string entrypoints */
        4:
          message.entrypoints.push(reader.string());
          break;
        case /* repeated bytes model_selectors */
        5:
          message.modelSelectors.push(reader.bytes());
          break;
        case /* optional uint64 from_block */
        6:
          message.fromBlock = reader.uint64().toBigInt();
          break;
        case /* optional uint64 to_block */
        7:
          message.toBlock = reader.uint64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.transactionHashes.length; i++)
      writer.tag(1, WireType2.LengthDelimited).bytes(message.transactionHashes[i]);
    for (let i = 0; i < message.callerAddresses.length; i++)
      writer.tag(2, WireType2.LengthDelimited).bytes(message.callerAddresses[i]);
    for (let i = 0; i < message.contractAddresses.length; i++)
      writer.tag(3, WireType2.LengthDelimited).bytes(message.contractAddresses[i]);
    for (let i = 0; i < message.entrypoints.length; i++)
      writer.tag(4, WireType2.LengthDelimited).string(message.entrypoints[i]);
    for (let i = 0; i < message.modelSelectors.length; i++)
      writer.tag(5, WireType2.LengthDelimited).bytes(message.modelSelectors[i]);
    if (message.fromBlock !== void 0)
      writer.tag(6, WireType2.Varint).uint64(message.fromBlock);
    if (message.toBlock !== void 0)
      writer.tag(7, WireType2.Varint).uint64(message.toBlock);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var TransactionFilter = new TransactionFilter$Type();
var TransactionQuery$Type = class extends MessageType3 {
  constructor() {
    super("types.TransactionQuery", [
      { no: 1, name: "filter", kind: "message", T: () => TransactionFilter },
      { no: 2, name: "pagination", kind: "message", T: () => Pagination }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial3(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.TransactionFilter filter */
        1:
          message.filter = TransactionFilter.internalBinaryRead(reader, reader.uint32(), options, message.filter);
          break;
        case /* types.Pagination pagination */
        2:
          message.pagination = Pagination.internalBinaryRead(reader, reader.uint32(), options, message.pagination);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler3.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.filter)
      TransactionFilter.internalBinaryWrite(message.filter, writer.tag(1, WireType2.LengthDelimited).fork(), options).join();
    if (message.pagination)
      Pagination.internalBinaryWrite(message.pagination, writer.tag(2, WireType2.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler3.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var TransactionQuery = new TransactionQuery$Type();

// src/generated/world.ts
var SubscribeTransactionsRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeTransactionsRequest", [
      { no: 1, name: "filter", kind: "message", T: () => TransactionFilter }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.TransactionFilter filter */
        1:
          message.filter = TransactionFilter.internalBinaryRead(reader, reader.uint32(), options, message.filter);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.filter)
      TransactionFilter.internalBinaryWrite(message.filter, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeTransactionsRequest = new SubscribeTransactionsRequest$Type();
var SubscribeTransactionsResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeTransactionsResponse", [
      { no: 1, name: "transaction", kind: "message", T: () => Transaction }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Transaction transaction */
        1:
          message.transaction = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.transaction);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.transaction)
      Transaction.internalBinaryWrite(message.transaction, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeTransactionsResponse = new SubscribeTransactionsResponse$Type();
var RetrieveControllersRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveControllersRequest", [
      { no: 1, name: "query", kind: "message", T: () => ControllerQuery }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.ControllerQuery query */
        1:
          message.query = ControllerQuery.internalBinaryRead(reader, reader.uint32(), options, message.query);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.query)
      ControllerQuery.internalBinaryWrite(message.query, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveControllersRequest = new RetrieveControllersRequest$Type();
var RetrieveControllersResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveControllersResponse", [
      {
        no: 1,
        name: "next_cursor",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "controllers", kind: "message", repeat: 2, T: () => Controller }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.nextCursor = "";
    message.controllers = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string next_cursor */
        1:
          message.nextCursor = reader.string();
          break;
        case /* repeated types.Controller controllers */
        2:
          message.controllers.push(Controller.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.nextCursor !== "")
      writer.tag(1, WireType3.LengthDelimited).string(message.nextCursor);
    for (let i = 0; i < message.controllers.length; i++)
      Controller.internalBinaryWrite(message.controllers[i], writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveControllersResponse = new RetrieveControllersResponse$Type();
var UpdateTokenBalancesSubscriptionRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.UpdateTokenBalancesSubscriptionRequest", [
      {
        no: 1,
        name: "subscription_id",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 2,
        name: "contract_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "account_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 4,
        name: "token_ids",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.subscriptionId = 0n;
    message.contractAddresses = [];
    message.accountAddresses = [];
    message.tokenIds = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* uint64 subscription_id */
        1:
          message.subscriptionId = reader.uint64().toBigInt();
          break;
        case /* repeated bytes contract_addresses */
        2:
          message.contractAddresses.push(reader.bytes());
          break;
        case /* repeated bytes account_addresses */
        3:
          message.accountAddresses.push(reader.bytes());
          break;
        case /* repeated bytes token_ids */
        4:
          message.tokenIds.push(reader.bytes());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.subscriptionId !== 0n)
      writer.tag(1, WireType3.Varint).uint64(message.subscriptionId);
    for (let i = 0; i < message.contractAddresses.length; i++)
      writer.tag(2, WireType3.LengthDelimited).bytes(message.contractAddresses[i]);
    for (let i = 0; i < message.accountAddresses.length; i++)
      writer.tag(3, WireType3.LengthDelimited).bytes(message.accountAddresses[i]);
    for (let i = 0; i < message.tokenIds.length; i++)
      writer.tag(4, WireType3.LengthDelimited).bytes(message.tokenIds[i]);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var UpdateTokenBalancesSubscriptionRequest = new UpdateTokenBalancesSubscriptionRequest$Type();
var SubscribeTokenBalancesResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeTokenBalancesResponse", [
      {
        no: 1,
        name: "subscription_id",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      { no: 2, name: "balance", kind: "message", T: () => TokenBalance }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.subscriptionId = 0n;
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* uint64 subscription_id */
        1:
          message.subscriptionId = reader.uint64().toBigInt();
          break;
        case /* types.TokenBalance balance */
        2:
          message.balance = TokenBalance.internalBinaryRead(reader, reader.uint32(), options, message.balance);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.subscriptionId !== 0n)
      writer.tag(1, WireType3.Varint).uint64(message.subscriptionId);
    if (message.balance)
      TokenBalance.internalBinaryWrite(message.balance, writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeTokenBalancesResponse = new SubscribeTokenBalancesResponse$Type();
var RetrieveTokensRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveTokensRequest", [
      { no: 1, name: "query", kind: "message", T: () => TokenQuery }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.TokenQuery query */
        1:
          message.query = TokenQuery.internalBinaryRead(reader, reader.uint32(), options, message.query);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.query)
      TokenQuery.internalBinaryWrite(message.query, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveTokensRequest = new RetrieveTokensRequest$Type();
var SubscribeTokensRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeTokensRequest", [
      {
        no: 1,
        name: "contract_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "token_ids",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.contractAddresses = [];
    message.tokenIds = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes contract_addresses */
        1:
          message.contractAddresses.push(reader.bytes());
          break;
        case /* repeated bytes token_ids */
        2:
          message.tokenIds.push(reader.bytes());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.contractAddresses.length; i++)
      writer.tag(1, WireType3.LengthDelimited).bytes(message.contractAddresses[i]);
    for (let i = 0; i < message.tokenIds.length; i++)
      writer.tag(2, WireType3.LengthDelimited).bytes(message.tokenIds[i]);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeTokensRequest = new SubscribeTokensRequest$Type();
var RetrieveTokensResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveTokensResponse", [
      {
        no: 1,
        name: "next_cursor",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "tokens", kind: "message", repeat: 2, T: () => Token }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.nextCursor = "";
    message.tokens = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string next_cursor */
        1:
          message.nextCursor = reader.string();
          break;
        case /* repeated types.Token tokens */
        2:
          message.tokens.push(Token.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.nextCursor !== "")
      writer.tag(1, WireType3.LengthDelimited).string(message.nextCursor);
    for (let i = 0; i < message.tokens.length; i++)
      Token.internalBinaryWrite(message.tokens[i], writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveTokensResponse = new RetrieveTokensResponse$Type();
var SubscribeTokensResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeTokensResponse", [
      {
        no: 1,
        name: "subscription_id",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      { no: 2, name: "token", kind: "message", T: () => Token }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.subscriptionId = 0n;
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* uint64 subscription_id */
        1:
          message.subscriptionId = reader.uint64().toBigInt();
          break;
        case /* types.Token token */
        2:
          message.token = Token.internalBinaryRead(reader, reader.uint32(), options, message.token);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.subscriptionId !== 0n)
      writer.tag(1, WireType3.Varint).uint64(message.subscriptionId);
    if (message.token)
      Token.internalBinaryWrite(message.token, writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeTokensResponse = new SubscribeTokensResponse$Type();
var UpdateTokenSubscriptionRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.UpdateTokenSubscriptionRequest", [
      {
        no: 1,
        name: "subscription_id",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 2,
        name: "contract_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "token_ids",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.subscriptionId = 0n;
    message.contractAddresses = [];
    message.tokenIds = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* uint64 subscription_id */
        1:
          message.subscriptionId = reader.uint64().toBigInt();
          break;
        case /* repeated bytes contract_addresses */
        2:
          message.contractAddresses.push(reader.bytes());
          break;
        case /* repeated bytes token_ids */
        3:
          message.tokenIds.push(reader.bytes());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.subscriptionId !== 0n)
      writer.tag(1, WireType3.Varint).uint64(message.subscriptionId);
    for (let i = 0; i < message.contractAddresses.length; i++)
      writer.tag(2, WireType3.LengthDelimited).bytes(message.contractAddresses[i]);
    for (let i = 0; i < message.tokenIds.length; i++)
      writer.tag(3, WireType3.LengthDelimited).bytes(message.tokenIds[i]);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var UpdateTokenSubscriptionRequest = new UpdateTokenSubscriptionRequest$Type();
var RetrieveTokenBalancesRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveTokenBalancesRequest", [
      { no: 1, name: "query", kind: "message", T: () => TokenBalanceQuery }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.TokenBalanceQuery query */
        1:
          message.query = TokenBalanceQuery.internalBinaryRead(reader, reader.uint32(), options, message.query);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.query)
      TokenBalanceQuery.internalBinaryWrite(message.query, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveTokenBalancesRequest = new RetrieveTokenBalancesRequest$Type();
var SubscribeTokenBalancesRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeTokenBalancesRequest", [
      {
        no: 1,
        name: "account_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "contract_addresses",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "token_ids",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.accountAddresses = [];
    message.contractAddresses = [];
    message.tokenIds = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes account_addresses */
        1:
          message.accountAddresses.push(reader.bytes());
          break;
        case /* repeated bytes contract_addresses */
        2:
          message.contractAddresses.push(reader.bytes());
          break;
        case /* repeated bytes token_ids */
        3:
          message.tokenIds.push(reader.bytes());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.accountAddresses.length; i++)
      writer.tag(1, WireType3.LengthDelimited).bytes(message.accountAddresses[i]);
    for (let i = 0; i < message.contractAddresses.length; i++)
      writer.tag(2, WireType3.LengthDelimited).bytes(message.contractAddresses[i]);
    for (let i = 0; i < message.tokenIds.length; i++)
      writer.tag(3, WireType3.LengthDelimited).bytes(message.tokenIds[i]);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeTokenBalancesRequest = new SubscribeTokenBalancesRequest$Type();
var RetrieveTokenBalancesResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveTokenBalancesResponse", [
      {
        no: 1,
        name: "next_cursor",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "balances", kind: "message", repeat: 2, T: () => TokenBalance }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.nextCursor = "";
    message.balances = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string next_cursor */
        1:
          message.nextCursor = reader.string();
          break;
        case /* repeated types.TokenBalance balances */
        2:
          message.balances.push(TokenBalance.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.nextCursor !== "")
      writer.tag(1, WireType3.LengthDelimited).string(message.nextCursor);
    for (let i = 0; i < message.balances.length; i++)
      TokenBalance.internalBinaryWrite(message.balances[i], writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveTokenBalancesResponse = new RetrieveTokenBalancesResponse$Type();
var RetrieveTransactionsRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveTransactionsRequest", [
      { no: 1, name: "query", kind: "message", T: () => TransactionQuery }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.TransactionQuery query */
        1:
          message.query = TransactionQuery.internalBinaryRead(reader, reader.uint32(), options, message.query);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.query)
      TransactionQuery.internalBinaryWrite(message.query, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveTransactionsRequest = new RetrieveTransactionsRequest$Type();
var RetrieveTransactionsResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveTransactionsResponse", [
      {
        no: 1,
        name: "next_cursor",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "transactions", kind: "message", repeat: 2, T: () => Transaction }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.nextCursor = "";
    message.transactions = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string next_cursor */
        1:
          message.nextCursor = reader.string();
          break;
        case /* repeated types.Transaction transactions */
        2:
          message.transactions.push(Transaction.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.nextCursor !== "")
      writer.tag(1, WireType3.LengthDelimited).string(message.nextCursor);
    for (let i = 0; i < message.transactions.length; i++)
      Transaction.internalBinaryWrite(message.transactions[i], writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveTransactionsResponse = new RetrieveTransactionsResponse$Type();
var RetrieveTokenCollectionsRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveTokenCollectionsRequest", [
      { no: 1, name: "query", kind: "message", T: () => TokenBalanceQuery }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.TokenBalanceQuery query */
        1:
          message.query = TokenBalanceQuery.internalBinaryRead(reader, reader.uint32(), options, message.query);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.query)
      TokenBalanceQuery.internalBinaryWrite(message.query, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveTokenCollectionsRequest = new RetrieveTokenCollectionsRequest$Type();
var RetrieveTokenCollectionsResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveTokenCollectionsResponse", [
      {
        no: 1,
        name: "next_cursor",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "tokens", kind: "message", repeat: 2, T: () => TokenCollection }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.nextCursor = "";
    message.tokens = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string next_cursor */
        1:
          message.nextCursor = reader.string();
          break;
        case /* repeated types.TokenCollection tokens */
        2:
          message.tokens.push(TokenCollection.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.nextCursor !== "")
      writer.tag(1, WireType3.LengthDelimited).string(message.nextCursor);
    for (let i = 0; i < message.tokens.length; i++)
      TokenCollection.internalBinaryWrite(message.tokens[i], writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveTokenCollectionsResponse = new RetrieveTokenCollectionsResponse$Type();
var SubscribeIndexerRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeIndexerRequest", [
      {
        no: 1,
        name: "contract_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.contractAddress = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes contract_address */
        1:
          message.contractAddress = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.contractAddress.length)
      writer.tag(1, WireType3.LengthDelimited).bytes(message.contractAddress);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeIndexerRequest = new SubscribeIndexerRequest$Type();
var SubscribeIndexerResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeIndexerResponse", [
      {
        no: 1,
        name: "head",
        kind: "scalar",
        T: 3,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 2,
        name: "tps",
        kind: "scalar",
        T: 3,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 3,
        name: "last_block_timestamp",
        kind: "scalar",
        T: 3,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 4,
        name: "contract_address",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.head = 0n;
    message.tps = 0n;
    message.lastBlockTimestamp = 0n;
    message.contractAddress = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* int64 head */
        1:
          message.head = reader.int64().toBigInt();
          break;
        case /* int64 tps */
        2:
          message.tps = reader.int64().toBigInt();
          break;
        case /* int64 last_block_timestamp */
        3:
          message.lastBlockTimestamp = reader.int64().toBigInt();
          break;
        case /* bytes contract_address */
        4:
          message.contractAddress = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.head !== 0n)
      writer.tag(1, WireType3.Varint).int64(message.head);
    if (message.tps !== 0n)
      writer.tag(2, WireType3.Varint).int64(message.tps);
    if (message.lastBlockTimestamp !== 0n)
      writer.tag(3, WireType3.Varint).int64(message.lastBlockTimestamp);
    if (message.contractAddress.length)
      writer.tag(4, WireType3.LengthDelimited).bytes(message.contractAddress);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeIndexerResponse = new SubscribeIndexerResponse$Type();
var WorldMetadataRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.WorldMetadataRequest", []);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var WorldMetadataRequest = new WorldMetadataRequest$Type();
var WorldMetadataResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.WorldMetadataResponse", [
      { no: 1, name: "world", kind: "message", T: () => World }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.World world */
        1:
          message.world = World.internalBinaryRead(reader, reader.uint32(), options, message.world);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.world)
      World.internalBinaryWrite(message.world, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var WorldMetadataResponse = new WorldMetadataResponse$Type();
var SubscribeEntitiesRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeEntitiesRequest", [
      { no: 1, name: "clause", kind: "message", T: () => Clause }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Clause clause */
        1:
          message.clause = Clause.internalBinaryRead(reader, reader.uint32(), options, message.clause);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.clause)
      Clause.internalBinaryWrite(message.clause, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeEntitiesRequest = new SubscribeEntitiesRequest$Type();
var SubscribeEventMessagesRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeEventMessagesRequest", [
      { no: 1, name: "clause", kind: "message", T: () => Clause }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Clause clause */
        1:
          message.clause = Clause.internalBinaryRead(reader, reader.uint32(), options, message.clause);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.clause)
      Clause.internalBinaryWrite(message.clause, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeEventMessagesRequest = new SubscribeEventMessagesRequest$Type();
var UpdateEntitiesSubscriptionRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.UpdateEntitiesSubscriptionRequest", [
      {
        no: 1,
        name: "subscription_id",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      { no: 2, name: "clause", kind: "message", T: () => Clause }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.subscriptionId = 0n;
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* uint64 subscription_id */
        1:
          message.subscriptionId = reader.uint64().toBigInt();
          break;
        case /* types.Clause clause */
        2:
          message.clause = Clause.internalBinaryRead(reader, reader.uint32(), options, message.clause);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.subscriptionId !== 0n)
      writer.tag(1, WireType3.Varint).uint64(message.subscriptionId);
    if (message.clause)
      Clause.internalBinaryWrite(message.clause, writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var UpdateEntitiesSubscriptionRequest = new UpdateEntitiesSubscriptionRequest$Type();
var UpdateEventMessagesSubscriptionRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.UpdateEventMessagesSubscriptionRequest", [
      {
        no: 1,
        name: "subscription_id",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      { no: 2, name: "clause", kind: "message", T: () => Clause }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.subscriptionId = 0n;
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* uint64 subscription_id */
        1:
          message.subscriptionId = reader.uint64().toBigInt();
          break;
        case /* types.Clause clause */
        2:
          message.clause = Clause.internalBinaryRead(reader, reader.uint32(), options, message.clause);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.subscriptionId !== 0n)
      writer.tag(1, WireType3.Varint).uint64(message.subscriptionId);
    if (message.clause)
      Clause.internalBinaryWrite(message.clause, writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var UpdateEventMessagesSubscriptionRequest = new UpdateEventMessagesSubscriptionRequest$Type();
var SubscribeEntityResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeEntityResponse", [
      { no: 1, name: "entity", kind: "message", T: () => Entity },
      {
        no: 2,
        name: "subscription_id",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.subscriptionId = 0n;
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Entity entity */
        1:
          message.entity = Entity.internalBinaryRead(reader, reader.uint32(), options, message.entity);
          break;
        case /* uint64 subscription_id */
        2:
          message.subscriptionId = reader.uint64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.entity)
      Entity.internalBinaryWrite(message.entity, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    if (message.subscriptionId !== 0n)
      writer.tag(2, WireType3.Varint).uint64(message.subscriptionId);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeEntityResponse = new SubscribeEntityResponse$Type();
var RetrieveEntitiesRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveEntitiesRequest", [
      { no: 1, name: "query", kind: "message", T: () => Query }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Query query */
        1:
          message.query = Query.internalBinaryRead(reader, reader.uint32(), options, message.query);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.query)
      Query.internalBinaryWrite(message.query, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveEntitiesRequest = new RetrieveEntitiesRequest$Type();
var RetrieveEventMessagesRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveEventMessagesRequest", [
      { no: 1, name: "query", kind: "message", T: () => Query }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Query query */
        1:
          message.query = Query.internalBinaryRead(reader, reader.uint32(), options, message.query);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.query)
      Query.internalBinaryWrite(message.query, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveEventMessagesRequest = new RetrieveEventMessagesRequest$Type();
var RetrieveEntitiesResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveEntitiesResponse", [
      {
        no: 1,
        name: "next_cursor",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "entities", kind: "message", repeat: 2, T: () => Entity }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.nextCursor = "";
    message.entities = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string next_cursor */
        1:
          message.nextCursor = reader.string();
          break;
        case /* repeated types.Entity entities */
        2:
          message.entities.push(Entity.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.nextCursor !== "")
      writer.tag(1, WireType3.LengthDelimited).string(message.nextCursor);
    for (let i = 0; i < message.entities.length; i++)
      Entity.internalBinaryWrite(message.entities[i], writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveEntitiesResponse = new RetrieveEntitiesResponse$Type();
var RetrieveEventsRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveEventsRequest", [
      { no: 1, name: "query", kind: "message", T: () => EventQuery }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.EventQuery query */
        1:
          message.query = EventQuery.internalBinaryRead(reader, reader.uint32(), options, message.query);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.query)
      EventQuery.internalBinaryWrite(message.query, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveEventsRequest = new RetrieveEventsRequest$Type();
var RetrieveEventsResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.RetrieveEventsResponse", [
      {
        no: 1,
        name: "next_cursor",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "events", kind: "message", repeat: 2, T: () => Event }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.nextCursor = "";
    message.events = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string next_cursor */
        1:
          message.nextCursor = reader.string();
          break;
        case /* repeated types.Event events */
        2:
          message.events.push(Event.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.nextCursor !== "")
      writer.tag(1, WireType3.LengthDelimited).string(message.nextCursor);
    for (let i = 0; i < message.events.length; i++)
      Event.internalBinaryWrite(message.events[i], writer.tag(2, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var RetrieveEventsResponse = new RetrieveEventsResponse$Type();
var SubscribeEventsRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeEventsRequest", [
      { no: 1, name: "keys", kind: "message", repeat: 2, T: () => KeysClause }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.keys = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated types.KeysClause keys */
        1:
          message.keys.push(KeysClause.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.keys.length; i++)
      KeysClause.internalBinaryWrite(message.keys[i], writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeEventsRequest = new SubscribeEventsRequest$Type();
var SubscribeEventsResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.SubscribeEventsResponse", [
      { no: 1, name: "event", kind: "message", T: () => Event }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* types.Event event */
        1:
          message.event = Event.internalBinaryRead(reader, reader.uint32(), options, message.event);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.event)
      Event.internalBinaryWrite(message.event, writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SubscribeEventsResponse = new SubscribeEventsResponse$Type();
var PublishMessageRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.PublishMessageRequest", [
      {
        no: 1,
        name: "signature",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "message",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.signature = [];
    message.message = "";
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated bytes signature */
        1:
          message.signature.push(reader.bytes());
          break;
        case /* string message */
        2:
          message.message = reader.string();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.signature.length; i++)
      writer.tag(1, WireType3.LengthDelimited).bytes(message.signature[i]);
    if (message.message !== "")
      writer.tag(2, WireType3.LengthDelimited).string(message.message);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var PublishMessageRequest = new PublishMessageRequest$Type();
var PublishMessageResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.PublishMessageResponse", [
      {
        no: 1,
        name: "entity_id",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.entityId = new Uint8Array(0);
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes entity_id */
        1:
          message.entityId = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.entityId.length)
      writer.tag(1, WireType3.LengthDelimited).bytes(message.entityId);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var PublishMessageResponse = new PublishMessageResponse$Type();
var PublishMessageBatchRequest$Type = class extends MessageType4 {
  constructor() {
    super("world.PublishMessageBatchRequest", [
      { no: 1, name: "messages", kind: "message", repeat: 2, T: () => PublishMessageRequest }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.messages = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated world.PublishMessageRequest messages */
        1:
          message.messages.push(PublishMessageRequest.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.messages.length; i++)
      PublishMessageRequest.internalBinaryWrite(message.messages[i], writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var PublishMessageBatchRequest = new PublishMessageBatchRequest$Type();
var PublishMessageBatchResponse$Type = class extends MessageType4 {
  constructor() {
    super("world.PublishMessageBatchResponse", [
      { no: 1, name: "responses", kind: "message", repeat: 2, T: () => PublishMessageResponse }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.responses = [];
    if (value !== void 0)
      reflectionMergePartial4(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated world.PublishMessageResponse responses */
        1:
          message.responses.push(PublishMessageResponse.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler4.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.responses.length; i++)
      PublishMessageResponse.internalBinaryWrite(message.responses[i], writer.tag(1, WireType3.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler4.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var PublishMessageBatchResponse = new PublishMessageBatchResponse$Type();
var World2 = new ServiceType("world.World", [
  { name: "SubscribeIndexer", serverStreaming: true, options: {}, I: SubscribeIndexerRequest, O: SubscribeIndexerResponse },
  { name: "WorldMetadata", options: {}, I: WorldMetadataRequest, O: WorldMetadataResponse },
  { name: "SubscribeEntities", serverStreaming: true, options: {}, I: SubscribeEntitiesRequest, O: SubscribeEntityResponse },
  { name: "UpdateEntitiesSubscription", options: {}, I: UpdateEntitiesSubscriptionRequest, O: Empty },
  { name: "RetrieveEntities", options: {}, I: RetrieveEntitiesRequest, O: RetrieveEntitiesResponse },
  { name: "SubscribeEventMessages", serverStreaming: true, options: {}, I: SubscribeEventMessagesRequest, O: SubscribeEntityResponse },
  { name: "UpdateEventMessagesSubscription", options: {}, I: UpdateEventMessagesSubscriptionRequest, O: Empty },
  { name: "SubscribeTokenBalances", serverStreaming: true, options: {}, I: SubscribeTokenBalancesRequest, O: SubscribeTokenBalancesResponse },
  { name: "UpdateTokenBalancesSubscription", options: {}, I: UpdateTokenBalancesSubscriptionRequest, O: Empty },
  { name: "SubscribeTokens", serverStreaming: true, options: {}, I: SubscribeTokensRequest, O: SubscribeTokensResponse },
  { name: "UpdateTokensSubscription", options: {}, I: UpdateTokenSubscriptionRequest, O: Empty },
  { name: "RetrieveEventMessages", options: {}, I: RetrieveEventMessagesRequest, O: RetrieveEntitiesResponse },
  { name: "RetrieveEvents", options: {}, I: RetrieveEventsRequest, O: RetrieveEventsResponse },
  { name: "SubscribeEvents", serverStreaming: true, options: {}, I: SubscribeEventsRequest, O: SubscribeEventsResponse },
  { name: "RetrieveTokens", options: {}, I: RetrieveTokensRequest, O: RetrieveTokensResponse },
  { name: "RetrieveTokenBalances", options: {}, I: RetrieveTokenBalancesRequest, O: RetrieveTokenBalancesResponse },
  { name: "RetrieveTransactions", options: {}, I: RetrieveTransactionsRequest, O: RetrieveTransactionsResponse },
  { name: "SubscribeTransactions", serverStreaming: true, options: {}, I: SubscribeTransactionsRequest, O: SubscribeTransactionsResponse },
  { name: "RetrieveControllers", options: {}, I: RetrieveControllersRequest, O: RetrieveControllersResponse },
  { name: "RetrieveTokenCollections", options: {}, I: RetrieveTokenCollectionsRequest, O: RetrieveTokenCollectionsResponse },
  { name: "PublishMessage", options: {}, I: PublishMessageRequest, O: PublishMessageResponse },
  { name: "PublishMessageBatch", options: {}, I: PublishMessageBatchRequest, O: PublishMessageBatchResponse }
]);

// src/generated/world.client.ts
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
var WorldClient = class {
  constructor(_transport) {
    this._transport = _transport;
  }
  typeName = World2.typeName;
  methods = World2.methods;
  options = World2.options;
  /**
   * Subscribes to updates about the indexer. Like the head block number, tps, etc.
   *
   * @generated from protobuf rpc: SubscribeIndexer
   */
  subscribeIndexer(input, options) {
    const method = this.methods[0], opt = this._transport.mergeOptions(options);
    return stackIntercept("serverStreaming", this._transport, method, opt, input);
  }
  /**
   * Retrieves metadata about the World including all the registered components and systems.
   *
   * @generated from protobuf rpc: WorldMetadata
   */
  worldMetadata(input, options) {
    const method = this.methods[1], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Subscribe to entity updates.
   *
   * @generated from protobuf rpc: SubscribeEntities
   */
  subscribeEntities(input, options) {
    const method = this.methods[2], opt = this._transport.mergeOptions(options);
    return stackIntercept("serverStreaming", this._transport, method, opt, input);
  }
  /**
   * Update entity subscription
   *
   * @generated from protobuf rpc: UpdateEntitiesSubscription
   */
  updateEntitiesSubscription(input, options) {
    const method = this.methods[3], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Retrieve entities
   *
   * @generated from protobuf rpc: RetrieveEntities
   */
  retrieveEntities(input, options) {
    const method = this.methods[4], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Subscribe to entity updates.
   *
   * @generated from protobuf rpc: SubscribeEventMessages
   */
  subscribeEventMessages(input, options) {
    const method = this.methods[5], opt = this._transport.mergeOptions(options);
    return stackIntercept("serverStreaming", this._transport, method, opt, input);
  }
  /**
   * Update entity subscription
   *
   * @generated from protobuf rpc: UpdateEventMessagesSubscription
   */
  updateEventMessagesSubscription(input, options) {
    const method = this.methods[6], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Subscribe to token balance updates.
   *
   * @generated from protobuf rpc: SubscribeTokenBalances
   */
  subscribeTokenBalances(input, options) {
    const method = this.methods[7], opt = this._transport.mergeOptions(options);
    return stackIntercept("serverStreaming", this._transport, method, opt, input);
  }
  /**
   * Update token balance subscription
   *
   * @generated from protobuf rpc: UpdateTokenBalancesSubscription
   */
  updateTokenBalancesSubscription(input, options) {
    const method = this.methods[8], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Subscribe to token updates.
   *
   * @generated from protobuf rpc: SubscribeTokens
   */
  subscribeTokens(input, options) {
    const method = this.methods[9], opt = this._transport.mergeOptions(options);
    return stackIntercept("serverStreaming", this._transport, method, opt, input);
  }
  /**
   * Update token subscription
   *
   * @generated from protobuf rpc: UpdateTokensSubscription
   */
  updateTokensSubscription(input, options) {
    const method = this.methods[10], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Retrieve entities
   *
   * @generated from protobuf rpc: RetrieveEventMessages
   */
  retrieveEventMessages(input, options) {
    const method = this.methods[11], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Retrieve events
   *
   * @generated from protobuf rpc: RetrieveEvents
   */
  retrieveEvents(input, options) {
    const method = this.methods[12], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Subscribe to events
   *
   * @generated from protobuf rpc: SubscribeEvents
   */
  subscribeEvents(input, options) {
    const method = this.methods[13], opt = this._transport.mergeOptions(options);
    return stackIntercept("serverStreaming", this._transport, method, opt, input);
  }
  /**
   * Retrieve tokens
   *
   * @generated from protobuf rpc: RetrieveTokens
   */
  retrieveTokens(input, options) {
    const method = this.methods[14], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Retrieve token balances
   *
   * @generated from protobuf rpc: RetrieveTokenBalances
   */
  retrieveTokenBalances(input, options) {
    const method = this.methods[15], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Retrieve transactions
   *
   * @generated from protobuf rpc: RetrieveTransactions
   */
  retrieveTransactions(input, options) {
    const method = this.methods[16], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Subscribe to transactions
   *
   * @generated from protobuf rpc: SubscribeTransactions
   */
  subscribeTransactions(input, options) {
    const method = this.methods[17], opt = this._transport.mergeOptions(options);
    return stackIntercept("serverStreaming", this._transport, method, opt, input);
  }
  /**
   * Retrieve controllers
   *
   * @generated from protobuf rpc: RetrieveControllers
   */
  retrieveControllers(input, options) {
    const method = this.methods[18], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Retrieve tokens collections
   *
   * @generated from protobuf rpc: RetrieveTokenCollections
   */
  retrieveTokenCollections(input, options) {
    const method = this.methods[19], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Publish a torii offchain message
   *
   * @generated from protobuf rpc: PublishMessage
   */
  publishMessage(input, options) {
    const method = this.methods[20], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
  /**
   * Publish a set of torii offchain messages
   *
   * @generated from protobuf rpc: PublishMessageBatch
   */
  publishMessageBatch(input, options) {
    const method = this.methods[21], opt = this._transport.mergeOptions(options);
    return stackIntercept("unary", this._transport, method, opt, input);
  }
};

// src/client.ts
var DojoGrpcClient = class {
  transport;
  worldClient;
  constructor(config) {
    this.transport = new GrpcWebFetchTransport({
      baseUrl: config.url,
      format: "text"
    });
    this.worldClient = new WorldClient(this.transport);
  }
  destroy() {
  }
};
function createDojoGrpcClient(config) {
  return new DojoGrpcClient(config);
}
export {
  Array$,
  CallType,
  ComparisonOperator,
  DojoGrpcClient,
  Enum,
  EnumOption,
  LogicalOperator,
  Member,
  OrderDirection,
  PaginationDirection,
  PatternMatching,
  Primitive,
  Struct,
  Ty,
  WorldClient,
  World as WorldMessage,
  World2 as WorldService,
  createDojoGrpcClient
};
//# sourceMappingURL=index.js.map