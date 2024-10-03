import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function ensureStarkFelt(value: string) {
    if (!value.startsWith("0x")) {
        return value;
    }
    if (value.length < 66) {
        return "0x" + value.replace("0x", "").padStart(64, "0");
    }
    return value;
}

function transliterate(str: string, charMap: Record<string, string> = {}) {
    return str
        .split("")
        .map((char) => charMap[char] || char)
        .join("");
}
const charMap: Record<string, string> = {
    á: "a",
    ú: "u",
    é: "e",
    ä: "a",
    Š: "S",
    Ï: "I",
    š: "s",
    Í: "I",
    í: "i",
    ó: "o",
    ï: "i",
    ë: "e",
    ê: "e",
    â: "a",
    Ó: "O",
    ü: "u",
    Á: "A",
    Ü: "U",
    ô: "o",
    ž: "z",
    Ê: "E",
    ö: "o",
    č: "c",
    Â: "A",
    Ä: "A",
    Ë: "E",
    É: "E",
    Č: "C",
    Ž: "Z",
    Ö: "O",
    Ú: "U",
    Ô: "O",
    "‘": "'",
};

function accentsToAscii(str: string): string {
    // Character map for transliteration to ASCII
    return transliterate(str, charMap);
}

export function toValidAscii(str: string): string {
    const intermediateString = str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    return accentsToAscii(intermediateString);
}

export function shortAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
