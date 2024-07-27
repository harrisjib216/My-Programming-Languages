import { compile } from "./compiler";
import { lex } from "./lexer";
import { parse } from "./parser";

function getProgramName(): string {
    return (
        Bun.argv[2]
    );
}

async function getSourceCode(): string {
    return (
        await Bun.file(getProgramName()).text()
    );
}


try {
    const programName = getProgramName();
    const tokens = lex(await getSourceCode());
    const ast = parse(tokens);

    await compile(programName, ast);
} catch (e) {
    console.error(e.message);
}
