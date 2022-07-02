export const NUMERIC_DIGITS = /(\.|_|0|1|2|3|4|5|6|7|8|9)/;

export function parseToNumber(source: string): number {
    let number: string = "";
    let zeros: number = 0;

    for (const digit of source) {
        if (!NUMERIC_DIGITS.test(digit)) {
            throw new SyntaxError(`Invalid numeric digit ${digit}`);
        }

        if (digit === "_") {
            continue;
        }

        if (digit === ".") {
            zeros++;
        }

        number += digit;
    }

    if (zeros > 1) {
        throw new SyntaxError(`Invalid number ${number}`);
    }

    return parseFloat(number);
}

export function isValidNumber(source: string): boolean {
    try {
        parseToNumber(source);
        return !!1;
    } catch {
        return !!0;
    }
}

export function parseToBool(source: string): boolean {
    let boolean: string = "";

    for (const letter of source) {
        if (
            letter === "t" ||
            letter === "r" ||
            letter === "u" ||
            letter === "e" ||
            letter === "f" ||
            letter === "a" ||
            letter === "l" ||
            letter === "s"
        ) {
            boolean += letter;
        } else {
            throw new SyntaxError(`Invalid boolean letter ${letter}`);
        }
    }

    if (boolean.trim() === "false") {
        return false;
    }

    if (boolean.trim() === "true") {
        return true;
    }

    throw new SyntaxError(`Invalid boolean ${boolean}`);
}

export function isValidBool(source: string): boolean {
    try {
        parseToBool(source);
        return !!1;
    } catch {
        return !!0;
    }
}

/* 
    ? Testing
*/
Deno.test({
    name: "Testing Function: parseToNumber",
    fn: () => {
        const numbers: string[] = ["10", "25.5", "1_000", "10_000.50", "3_000_000.12"];

        numbers.map(parseToNumber).forEach((n) => console.log(n));
    },
});

Deno.test({
    name: "Testing Function: IsValidNumber",
    fn: () => {
        const numbers: string[] = ["20", "40.10", "10_100.30", "1_120..109"];

        numbers.map(isValidNumber).forEach((n, i) => console.log(numbers[i], n));
    },
});

Deno.test({
    name: "Testing Function: parseToBool",
    fn: () => {
        const booleans: string[] = ["true", "false", "true", "false"];

        booleans.map(parseToBool).forEach((b) => console.log(b));
    },
});

Deno.test({
    name: "Testing Function: isValidBool",
    fn: () => {
        const booleans: string[] = ["true", "false", "truth", "falsy"];

        booleans.map(isValidBool).forEach((b, i) => console.log(booleans[i], b));
    },
});
