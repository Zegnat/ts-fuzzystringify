/**
 * This file is based on PageUp.FuzzySerializer.Tests to try and get feature
 * parity. That original test suite does not seem to ever have been licensed
 * under an open-source licence, even though the source has always
 * been available.
 *
 * The following copyright statement is the closest thing that could be
 * discovered in the original code repository and is kept here.
 *
 * Copyright © 2017, PageUp & Abhaya Chauhan - original C# test suite
 */

import { validate } from "uuid";
import { assert, expect, test } from "vitest";
import { type FuzzyStringifySettings, stringify } from "../src/index";

const person = { Name: "Alice", Age: 21 };
const knownProperties = Object.keys(person);
function findNewPropertyKey(deserialisedPerson: object): string | undefined {
	return Object.keys(deserialisedPerson).find(
		(key) => !knownProperties.includes(key),
	);
}
function findIndexOfNewPropertyKey(deserialisedPerson: object): number {
	return Object.keys(deserialisedPerson).findIndex(
		(key) => !knownProperties.includes(key),
	);
}
function findIndexOfPropertyKey(
	deserialisedPerson: object,
	key: string,
): number {
	return Object.keys(deserialisedPerson).indexOf(key);
}

test("Add random property to objects is on. Adds new property of type GUID.", () => {
	const serialisedObject = stringify(person, {
		addRandomPropertyToObjects: true,
	});
	assert(serialisedObject !== undefined);
	const deserialisedObj = JSON.parse(serialisedObject);
	expect(Object.keys(deserialisedObj)).toHaveLength(3);
	const key = findNewPropertyKey(deserialisedObj);
	assert(key !== undefined);
	expect(validate(key)).toEqual(true);
});

test("Add random property to objects is off. Does not add new property.", () => {
	const serialisedObject = stringify(person, {
		addRandomPropertyToObjects: false,
	});
	assert(serialisedObject !== undefined);
	const deserialisedObj = JSON.parse(serialisedObject);
	expect(Object.keys(deserialisedObj)).toHaveLength(2);
});

test("Add random property to objects is on. New property is different every serialize.", () => {
	const jsonSerializeSettings = {
		addRandomPropertyToObjects: true,
	} satisfies FuzzyStringifySettings;
	const firstSerialisedObject = stringify(person, jsonSerializeSettings);
	assert(firstSerialisedObject !== undefined);
	const secondSerialisedObject = stringify(person, jsonSerializeSettings);
	assert(secondSerialisedObject !== undefined);
	const firstDeserialisedObj = JSON.parse(firstSerialisedObject);
	const secondDeserialisedObj = JSON.parse(secondSerialisedObject);
	const firstKey = findNewPropertyKey(firstDeserialisedObj);
	const secondKey = findNewPropertyKey(secondDeserialisedObj);
	expect(firstKey).not.toEqual(secondKey);
});

test("Add property in random position is on. New property is in different position every serialize.", () => {
	const jsonSerializeSettings = {
		addRandomPropertyToObjects: true,
		addPropertyInRandomPosition: true,
		shuffleResponse: false,
	} satisfies FuzzyStringifySettings;
	const differentPositionInSerialise = [] as Array<boolean>;
	for (let i = 0; i < 5; i++) {
		const firstSerialisedObject = stringify(person, jsonSerializeSettings);
		assert(firstSerialisedObject !== undefined);
		const secondSerialisedObject = stringify(person, jsonSerializeSettings);
		assert(secondSerialisedObject !== undefined);
		const firstDeserialisedObj = JSON.parse(firstSerialisedObject);
		const secondDeserialisedObj = JSON.parse(secondSerialisedObject);
		const firstIndex = findIndexOfNewPropertyKey(firstDeserialisedObj);
		const secondIndex = findIndexOfNewPropertyKey(secondDeserialisedObj);
		differentPositionInSerialise.push(firstIndex !== secondIndex);
	}
	expect(differentPositionInSerialise).toContain(true);
});

test("Add property into random position is off. New property in the last position every serialize.", () => {
	const jsonSerializeSettings = {
		addRandomPropertyToObjects: true,
		addPropertyInRandomPosition: false,
		shuffleResponse: false,
	} satisfies FuzzyStringifySettings;
	const serialisedObject = stringify(person, jsonSerializeSettings);
	assert(serialisedObject !== undefined);
	const deserialisedObj = JSON.parse(serialisedObject);
	const index = findIndexOfNewPropertyKey(deserialisedObj);
	expect(index + 1).toBe(Object.keys(deserialisedObj).length);
});

test("Shuffle response is on. Entire response is shuffled.", () => {
	const jsonSerializeSettings = {
		shuffleResponse: true,
	} satisfies FuzzyStringifySettings;
	const differentPositionInSerialise = [] as Array<boolean>;
	/** Note: the original test looped 3 times, but this made the test flaky. */
	for (let i = 0; i < 5; i++) {
		const firstSerialisedObject = stringify(person, jsonSerializeSettings);
		assert(firstSerialisedObject !== undefined);
		const secondSerialisedObject = stringify(person, jsonSerializeSettings);
		assert(secondSerialisedObject !== undefined);
		const firstDeserialisedObj = JSON.parse(firstSerialisedObject);
		const secondDeserialisedObj = JSON.parse(secondSerialisedObject);
		const firstIndex = findIndexOfPropertyKey(firstDeserialisedObj, "Name");
		const secondIndex = findIndexOfPropertyKey(secondDeserialisedObj, "Name");
		differentPositionInSerialise.push(firstIndex !== secondIndex);
	}
	expect(differentPositionInSerialise).toContain(true);
});

test("Shuffle response is off. Entire response is shuffled.", () => {
	const jsonSerializeSettings = {
		shuffleResponse: false,
	} satisfies FuzzyStringifySettings;
	for (let i = 0; i < 3; i++) {
		const firstSerialisedObject = stringify(person, jsonSerializeSettings);
		assert(firstSerialisedObject !== undefined);
		const secondSerialisedObject = stringify(person, jsonSerializeSettings);
		assert(secondSerialisedObject !== undefined);
		const firstDeserialisedObj = JSON.parse(firstSerialisedObject);
		const secondDeserialisedObj = JSON.parse(secondSerialisedObject);
		const firstIndex = findIndexOfPropertyKey(firstDeserialisedObj, "Name");
		const secondIndex = findIndexOfPropertyKey(secondDeserialisedObj, "Name");
		expect(firstIndex).toEqual(secondIndex);
	}
});
