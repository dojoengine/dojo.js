import { Schema } from "effect";

export const HexString = Schema.String.pipe(
    Schema.pattern(/^0x[0-9a-fA-F]*$/, {
        message: () => "Invalid hex string format",
    })
);

export const BufferToHex = Schema.transform(
    Schema.Uint8ArrayFromSelf,
    HexString,
    {
        decode: (buffer) => {
            return (
                "0x" +
                Array.from(buffer)
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("")
            );
        },
        encode: (hex) => {
            const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
            const bytes = new Uint8Array(cleanHex.length / 2);
            for (let i = 0; i < cleanHex.length; i += 2) {
                bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
            }
            return bytes;
        },
    }
);

export const OptionalBufferToHex = Schema.optional(BufferToHex);

export const BufferArrayToHexArray = Schema.transform(
    Schema.Array(Schema.Uint8ArrayFromSelf),
    Schema.Array(HexString),
    {
        decode: (buffers) =>
            buffers.map(
                (buffer) =>
                    "0x" +
                    Array.from(buffer)
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("")
            ),
        encode: (hexStrings) =>
            hexStrings.map((hex) => {
                const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
                const bytes = new Uint8Array(cleanHex.length / 2);
                for (let i = 0; i < cleanHex.length; i += 2) {
                    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
                }
                return bytes;
            }),
    }
);

export const BigIntToNumber = Schema.transform(
    Schema.BigIntFromSelf,
    Schema.Number,
    {
        decode: (bigint) => Number(bigint),
        encode: (number) => BigInt(number),
    }
);

export const OptionalString = Schema.optional(Schema.String);
export const OptionalNumber = Schema.optional(Schema.Number);

let textDecoder: TextDecoder | undefined = undefined;

export const Uint8ArrayToString = Schema.transform(
    Schema.Uint8ArrayFromSelf,
    Schema.String,
    {
        decode: (input) => {
            if (!textDecoder) {
                textDecoder = new TextDecoder();
            }
            return textDecoder.decode(input);
        },
        encode: (str) => new TextEncoder().encode(str),
    }
);

export const JsonMetadata = Schema.transform(
    Schema.Uint8ArrayFromSelf,
    Schema.Unknown,
    {
        decode: (input) => {
            if (!textDecoder) {
                textDecoder = new TextDecoder();
            }
            const str = textDecoder.decode(input);
            try {
                return JSON.parse(str);
            } catch (_err) {
                return str;
            }
        },
        encode: (value) => {
            const str =
                typeof value === "string" ? value : JSON.stringify(value);
            return new TextEncoder().encode(str);
        },
    }
);
