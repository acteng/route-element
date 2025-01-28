import * as fs from "fs";
import { infraSchema } from "./infra_schema";
import { rcSchema } from "./rc_schema";
import {
  isBarewordEnum,
  isCheckbox,
  isNumber,
  isObjectEnum,
  isOneLiner,
  isStruct,
  isTextbox,
  type Field,
} from "./types";

// TODO Don't mind the global state...
let out = "";

//let schema = JSON.parse(fs.readFileSync(argv[2], { encoding: "utf8" }));
writeSchema(infraSchema(), "src/forms/infra_types.ts");
writeSchema(rcSchema(), "src/forms/rc_types.ts");

function writeSchema(schema: Field, outPath: string) {
  // Queue contains all of the types to generate
  let queue: Field[] = [schema];
  let seen: Set<string> = new Set();

  // Reset
  out = `// This file is auto-generated; do not manually edit\n\n`;
  while (queue.length > 0) {
    generate(queue.pop()!, queue, seen);
  }

  fs.writeFileSync(outPath, out);
}

function generate(field: Field, queue: Field[], seen: Set<string>) {
  if (seen.has(field.name)) {
    // We could also generate more detailed type names based on the nesting,
    // but this seems confusing
    console.warn(`The schema uses ${field.name} as a type name twice`);
    return;
  }
  seen.add(field.name);

  if (isStruct(field)) {
    out += `export interface ${field.name} {\n`;
    for (let member of field.members) {
      if (isNumber(member)) {
        out += `  ${member.name}?: number;\n`;
      } else if (isOneLiner(member) || isTextbox(member)) {
        out += `  ${member.name}?: string;\n`;
      } else if (isCheckbox(member)) {
        out += `  ${member.name}?: boolean;\n`;
      } else if (isStruct(member) || isObjectEnum(member)) {
        queue.push(member);
        out += `  ${member.name}?: ${member.name};\n`;
      } else if (isBarewordEnum(member)) {
        // Don't make a new named type for this
        let cases = member.cases.map((c) => `"${c}"`);
        out += `  ${member.name}?: ${cases.join(" | ")};\n`;
      } else {
        throw new Error(`Unknown field type ${member}`);
      }
    }
    out += `}\n\n`;
  } else if (isObjectEnum(field)) {
    let cases = [];
    for (let x of field.oneOf) {
      cases.push(x.name);
      queue.push(x);
    }
    out += `export type ${field.name} = ${cases.join(" | ")};\n\n`;
  } else {
    throw new Error(`Unknown field ${JSON.stringify(field)}`);
  }
}
