/**
 * @note 
 * The 'authentication' packet uses eight random values, 
 * followed by four seeded values (possibly bruteforced),
 * then the first encoded number in the result.
 * 
 * Ex. N1 N2 N3 N4 N5 N6 N7 N8 S1 S2 S3 S4 N1
 */

/**
 * Array of numbers to be used as constant keys.
 */
let constants: number[];

if (production) { /* lol */
	let cipher = 'you skid.';

	constants = [
		0x7c, 0x18, 0x8a, 0x1d,
		0xd8, 4, 0x81, 0x42,
		8 /* key for 'writeIndex' */
	].map((n, i) => n ^ (cipher.charCodeAt(i) + i));
} else {
	constants = [
		5, 0x68, 0xfd, 0x3e,
		0xaf, 0x74, 0xee, 0x29
	];
}

export default class KeyEncoder {
	/** 
	 * Initialize a key encoder
	 */
	constructor(private data: number[]) {}

	/**
	 * Writes an encoded version of the given index to the result array
	 */
	private writeIndex(result: number[], index: number) {
		let value = this.data[index];
		let mask = value + 5 & 7;
		const p1 = ((value << mask) | (value >>> (8 - mask))) & 0xff;
		const p2 = result[index != 0 ? (index - 1) : 0] ^ constants[index];
		result.push((p1^p2) ^ (production ? constants[8] : 0x3e));
	}

	/**
	 * Constructs an encoded version of the current key data
	 */
	build(invert: boolean = false) {
		let result: number[] = [];

		for (let i = 0; i < 8; i++) {
			this.writeIndex(result, i);
		}

		const seed = 1 + Math.floor(0x7ffffffe * Math.random());
		result.push(result[0] ^ (seed >> 24));
		result.push(result[1] ^ (seed >> 16));
		result.push(result[2] ^ (seed >> 8));
		result.push(seed ^ result[3]);

		result.push((result[0] ^ +invert) ^ 0x1f);

		return result.map(n => n & 0xff);
	}
}