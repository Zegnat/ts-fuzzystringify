import { describe, expect, test } from "vitest";
import { stringify } from "../src";

function equalOutputs(
	value,
	space: Parameters<typeof stringify>[2] = undefined,
) {
	return expect(stringify(value, {}, space)).toStrictEqual(
		JSON.stringify(value, undefined, space),
	);
}

describe("Passthrough non-objects directly", () => {
	test("string", () => {
		equalOutputs("a");
	});
	test("number", () => {
		equalOutputs(2);
		equalOutputs(3.456);
	});
	test("null", () => {
		equalOutputs(null);
	});
	test("undefined", () => {
		equalOutputs(undefined);
	});
	test("array", () => {
		equalOutputs(["a", 2, 3.456, null, undefined]);
	});
});

describe("Space settings are passed through", () => {
	test("for an array", () => {
		equalOutputs(["a", { b: "c" }, "d"], 7);
	});
	test("for an object", () => {
		equalOutputs({ a: "a", b: ["c"], d: "e" }, 7);
	});
});

test("Can encode null values", () => {
	equalOutputs({ top: null, nested: { value: null } });
});
