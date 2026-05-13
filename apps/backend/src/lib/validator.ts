import { type Static, type TObject } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { validator } from "hono/validator";

export function tbValidator<S extends TObject>(
  target: "query" | "param",
  schema: S
) {
  return validator(target, (value, c) => {
    const converted = Value.Convert(schema, value);
    const withDefaults = Value.Default(schema, converted);
    if (!Value.Check(schema, withDefaults)) {
      const errors = [...Value.Errors(schema, withDefaults)].map(e => ({
        path: e.path,
        message: e.message,
      }));
      return c.json({ error: "Validation failed", details: errors }, 400);
    }
    return withDefaults as Static<S>;
  });
}
