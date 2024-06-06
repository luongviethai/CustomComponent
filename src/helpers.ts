import { customAlphabet } from "nanoid";

export const getUniqueId = (
	length = 7,
	alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
) => {
	const nanoid = customAlphabet(alphabet, length);
	return nanoid();
};
