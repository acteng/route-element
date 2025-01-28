// These types describe ATIP's bespoke JSON format for defining schemas.

// A Field is one property collected by form about an intervention
export type Field =
  | Struct
  | ObjectEnum
  | BarewordEnum
  | NumberInput
  | OneLineTextInput
  | TextboxInput
  | CheckboxInput;

// A Struct has multiple sub-fields
export interface Struct {
  name: string;
  description?: string;
  members: Field[];
}

// An ObjectEnum expresses exactly one case (each an object or another enum) must be set
export interface ObjectEnum {
  name: string;
  description?: string;
  oneOf: (Struct | ObjectEnum)[];
}

// A BarewordEnum expresses exactly one case (each just a string) must be set
export interface BarewordEnum {
  name: string;
  description?: string;
  cases: string[];
}

// NumberInput specifies a numeric property
export interface NumberInput {
  name: string;
  description?: string;
  type: "number" | string; // TODO The | string isn't true; TS inference is failing for some reason
}

// OneLineTextInput specifies a text property that should appear as a one-line text box
export interface OneLineTextInput {
  name: string;
  description?: string;
  type: "one-liner";
}

// TextboxInput specifies a text property that should appear as a multi-line text box
export interface TextboxInput {
  name: string;
  description?: string;
  type: "textbox";
}

// CheckboxInput specifies a boolean property
export interface CheckboxInput {
  name: string;
  description?: string;
  type: "checkbox";
}

export function isStruct(x: Field): x is Struct {
  return "members" in x;
}
export function isObjectEnum(x: Field): x is ObjectEnum {
  return "oneOf" in x;
}
export function isBarewordEnum(x: Field): x is BarewordEnum {
  return "cases" in x;
}
export function isNumber(x: Field): x is NumberInput {
  return "type" in x && x.type == "number";
}
export function isOneLiner(x: Field): x is OneLineTextInput {
  return "type" in x && x.type == "one-liner";
}
export function isTextbox(x: Field): x is TextboxInput {
  return "type" in x && x.type == "textbox";
}
export function isCheckbox(x: Field): x is CheckboxInput {
  return "type" in x && x.type == "checkbox";
}
export function isEmptyStruct(x: Field): boolean {
  return "members" in x && x.members.length == 0;
}

export function bool(name: string): CheckboxInput {
  return { name, type: "checkbox" };
}
export function emptyStruct(name: string): Struct {
  return { name, members: [] };
}
