import { v4 } from "uuid";

export type FuzzyStringifySettings = Partial<{
	shuffleResponse: boolean;
	addRandomPropertyToObjects: boolean;
	addPropertyInRandomPosition: boolean;
}>;

export function stringify(
	value,
	settings: FuzzyStringifySettings = { addRandomPropertyToObjects: true },
	space: string | number | undefined = undefined,
): string | undefined {
	if (typeof value !== "object" || Array.isArray(value) || value === null) {
		return JSON.stringify(value, undefined, space);
	}
	const properties = Object.keys(value);
	if (settings.shuffleResponse) {
		let currentIndex = properties.length;
		while (currentIndex > 0) {
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			const hold = properties[currentIndex];
			properties[currentIndex] = properties[randomIndex];
			properties[randomIndex] = hold;
		}
	}
	let randomProperty: string | undefined;
	if (settings.addRandomPropertyToObjects) {
		randomProperty = v4();
		let where = properties.length;
		if (settings.addPropertyInRandomPosition) {
			where = Math.floor((properties.length + 1) * Math.random());
		}
		properties.splice(where, 0, randomProperty);
	}
	const stringifyValue = {};
	const replacerSymbol = Symbol();
	for (let i = 0; i < properties.length; i++) {
		stringifyValue[properties[i]] = replacerSymbol;
	}
	return JSON.stringify(
		stringifyValue,
		(key, unchanged) => {
			if (key === randomProperty) {
				return randomProperty;
			}
			if (unchanged === replacerSymbol) {
				return value[key];
			}
			return unchanged;
		},
		space,
	);
}
