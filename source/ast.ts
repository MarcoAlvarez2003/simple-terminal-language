import { Symbols } from "./syntax.ts";
import { Token } from "./token.ts";
import { Lex } from "./lex.ts";

export type TokenType = boolean | string | number;

export class Block {
    constructor(
        public readonly properties: Record<string, TokenType>,
        public readonly entries: TokenType[],
        public readonly command: string
    ) {}
}

export class Ast {
    protected readonly blocks: Block[] = [];
    protected i: number = 0;

    constructor(protected readonly tokens: Token[]) {
        for (; this.i < this.tokens.length; this.i++) {
            const token = this.tokens[this.i];

            if (token.type === Symbols.Literal) {
                this.blocks.push(this.createBlock());
                continue;
            }
        }
    }

    protected createBlock() {
        const block = new Block({}, [], this.tokens[this.i].getAsString());

        this.i++;

        for (; this.i < this.tokens.length; this.i++) {
            const token = this.tokens[this.i];

            /* 
                Breaks define the end of a command
            */
            if (token.type === Symbols.Break) {
                break;
            }

            /* 
                Booleans, string and numbers are for entries
            */

            if (token.type === Symbols.Boolean || token.type === Symbols.String || token.type === Symbols.Number) {
                block.entries.push(this.parseTokenValue(token));
                continue;
            }

            /* 
                Literals define properties
            */

            if (token.type === Symbols.Literal) {
                const { name, body } = this.createProperty();

                block.properties[name] = body;
            }

            /* 
                Not create negative properties
            */

            if (token.type === Symbols.Not) {
                this.i++;

                const { name, body } = this.createProperty();

                if (typeof body === "boolean") {
                    block.properties[name] = !body;
                    continue;
                }

                block.properties[name] = body;
            }
        }

        return block;
    }

    protected parseTokenValue(token: Token) {
        if (token.type === Symbols.Boolean) {
            return token.getAsBool();
        }

        if (token.type === Symbols.Number) {
            return token.getAsNumber();
        }

        return token.getAsString();
    }

    protected createProperty() {
        const property = {
            name: this.tokens[this.i].getAsString(),
            body: true as TokenType,
        };

        if (this.i + 1 in this.tokens) {
            const next = this.tokens[this.i + 1];

            if (next.type === Symbols.Assign) {
                this.i++;

                if (this.i + 1 in this.tokens) {
                    const next = this.tokens[this.i + 1];

                    if (
                        next.type === Symbols.Literal ||
                        next.type === Symbols.Boolean ||
                        next.type === Symbols.String ||
                        next.type === Symbols.Number
                    ) {
                        property.body = this.parseTokenValue(next);
                        this.i++;
                    }
                }
            }
        }

        return property;
    }

    public getBlocksCreated() {
        return this.blocks;
    }
}

/* 
    ? Testing
*/

Deno.test({
    name: "Testing Class: Ast",
    fn: () => {
        const sources: string[] = [
            `package uninstall "path/to/package.ts" & package install "path/to/package.ts" & log "installation ended"`,
        ];

        sources
            .map((source) => new Lex(source).getTokensCreated())
            .map((tokens) => new Ast(tokens).getBlocksCreated())
            .forEach((blocks) => blocks.forEach((block) => console.log(block)));
    },
});
