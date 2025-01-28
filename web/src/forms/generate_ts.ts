import { infraSchema } from "./infra_schema";
import {
  isBarewordEnumCase,
  isCheckbox,
  isEnum,
  isNumber,
  isOneLiner,
  isStruct,
  isTextbox,
  type Field,
} from "./types";

// This script transforms a schema expressed in JSON into TypeScript types

//let schema = JSON.parse(fs.readFileSync(argv[2], { encoding: "utf8" }));
let schema = infraSchema();
// Queue contains all of the types to generate
let queue: Field[] = [schema];
let seen: Set<string> = new Set();

console.log(`// This file is auto-generated; do not manually edit\n`);
while (queue.length > 0) {
  generate(queue.pop()!);
}

function generate(field: Field) {
  if (seen.has(field.name)) {
    // We could also generate more detailed type names based on the nesting,
    // but this seems confusing
    console.warn(`The schema uses ${field.name} as a type name twice`);
    return;
  }
  seen.add(field.name);

  if (isStruct(field)) {
    console.log(`export interface ${field.name} {`);
    for (let member of field.members) {
      if (isNumber(member)) {
        console.log(`  ${member.name}?: number;`);
      } else if (isOneLiner(member) || isTextbox(member)) {
        console.log(`  ${member.name}?: string;`);
      } else if (isCheckbox(member)) {
        console.log(`  ${member.name}?: boolean;`);
      } else if (isStruct(member) || isEnum(member)) {
        // TODO If it's an enum with all string cases, do we want another
        // explicitly named type or not?
        queue.push(member);
        console.log(`  ${member.name}?: ${member.name};`);
      } else {
        throw new Error(`Unknown field type ${member}`);
      }
    }
    console.log(`}\n`);
  } else if (isEnum(field)) {
    let cases = [];
    for (let x of field.oneOf) {
      if (isBarewordEnumCase(x)) {
        cases.push(`"${x}"`);
      } else {
        cases.push(x.name);
        queue.push(x);
      }
    }
    console.log(`export type ${field.name} = ${cases.join(" | ")};\n`);
  } else {
    throw new Error(`Unknown field ${JSON.stringify(field)}`);
  }
}
