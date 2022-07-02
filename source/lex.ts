import { isValidNumber, isValidBool } from "./utils.ts";
import { Symbols } from "./syntax.ts";
import { Token } from "./token.ts";

export class Lex {
    protected tokens: Token[] = [];
    protected chars: string[] = [];
    protected i: number = 0;

    constructor(protected source: string) {
        for (; this.i < source.length; this.i++) {
            const current = source[this.i];

            if (current === "`" || current === '"' || current === "'") {
                this.createLiteral();
                this.tokens.push(this.createString());
                continue;
            }

            if (current === "=") {
                this.createLiteral();
                this.tokens.push(new Token(Symbols.Assign, current));
                continue;
            }

            if (current === "&") {
                this.createLiteral();
                this.tokens.push(new Token(Symbols.Break, current));
                continue;
            }

            if (current === "!") {
                this.createLiteral();
                this.tokens.push(new Token(Symbols.Not, current));
                continue;
            }

            if (current === " ") {
                this.createLiteral();
                continue;
            }

            this.chars.push(current);
        }

        this.createLiteral();
    }

    protected createLiteral() {
        const literal = this.chars.join("").trim();

        if (literal.length) {
            this.chars.length = 0;

            if (isValidNumber(literal)) {
                return this.tokens.push(new Token(Symbols.Number, literal));
            }

            if (isValidBool(literal)) {
                return this.tokens.push(new Token(Symbols.Boolean, literal));
            }

            return this.tokens.push(new Token(Symbols.Literal, literal));
        }
    }

    protected createString() {
        const initializer = this.source[this.i];
        const letters: string[] = [];

        this.i++;

        for (; this.i < this.source.length; this.i++) {
            const current = this.source[this.i];

            if (current === initializer) {
                break;
            }

            if (current === "\\") {
                this.i++;
                continue;
            }

            letters.push(current);
        }

        return new Token(Symbols.String, letters.join(""));
    }

    public getTokensCreated() {
        return this.tokens;
    }
}

/* 
    ? Testing
*/

if (import.meta.main) {
    Deno.test({
        name: "Testing Class: Lex",
        fn: () => {
            const sources: string[] = [
                'package uninstall "path/to/package.ts"',
                'package install "path/to/package.ts"',
                "package list",
            ];

            sources.map((source) => new Lex(source)).forEach((lex) => console.log(lex.getTokensCreated()));
        },
    });
}
