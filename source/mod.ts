import { NUMERIC_DIGITS, isValidNumber, isValidBool, parseToBool, parseToNumber } from "./utils.ts";
import { TokenType, Block, Ast } from "./ast.ts";
import { Symbols } from "./syntax.ts";
import { Token } from "./token.ts";
import { Lex } from "./lex.ts";

export const compile = (source: string) => new Ast(new Lex(source).getTokensCreated()).getBlocksCreated();

export type {
    NUMERIC_DIGITS,
    isValidNumber,
    parseToNumber,
    isValidBool,
    parseToBool,
    TokenType,
    Symbols,
    Block,
    Token,
    Ast,
    Lex,
};
