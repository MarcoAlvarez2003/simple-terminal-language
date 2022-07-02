import { parseToNumber, parseToBool } from "./utils.ts";
import { Symbols } from "./syntax.ts";

export class Token {
    constructor(public readonly type: Symbols, public readonly body: unknown) {}

    public getAsString(): string {
        return typeof this.body === "string" ? this.body : `${this.body}`;
    }

    public getAsNumber(): number {
        return parseToNumber(this.getAsString());
    }

    public getAsBool() {
        return parseToBool(this.getAsString());
    }
}
