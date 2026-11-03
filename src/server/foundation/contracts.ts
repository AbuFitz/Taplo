import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import inputs from "../../../../docs/taplo-blueprint/release-3.0/contracts/inputs.schema.json";
import records from "../../../../docs/taplo-blueprint/release-3.0/contracts/records.schema.json";
import { CommandError } from "./errors";

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema({ ...inputs, $id: "urn:taplo:inputs:3" });
ajv.addSchema({ ...records, $id: "urn:taplo:records:3" });
/** Server-only validation against the adopted contracts; no duplicate writable schema. */
export function validateInput<T>(command: keyof typeof inputs.$defs, value: unknown): T {
  const valid = ajv.getSchema(`urn:taplo:inputs:3#/$defs/${command}`)!;
  if (!valid(value)) throw new CommandError("INVALID_INPUT", 400, "Check the highlighted details.", false, (valid.errors ?? []).map((e) => ({ field: e.instancePath || "/", code: e.keyword })));
  return value as T;
}
export function validateRecord<T>(record: keyof typeof records.$defs, value: T): T {
  const valid = ajv.getSchema(`urn:taplo:records:3#/$defs/${record}`)!;
  if (!valid(value)) throw new Error(`Invalid ${record} projection: ${ajv.errorsText(valid.errors)}`);
  return value;
}
