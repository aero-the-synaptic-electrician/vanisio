export default class Vector2 {
	/**
	 * Instantiate a Vector2 object.
	 */
	constructor(
		public x: number = 0, 
		public y: number = 0
	) {}

	/**
	 * Set the x & y position of the current Vector2 object.
	 */
	set(x: number | Vector2, y?: number) {
		if (x instanceof Vector2) {
			y = x.y;
			x = x.x;
		}

		this.x = x;
		this.y = y;
	}

	/**
	 * Add 'x' and 'y' to the x/y position of the current Vector2 object.
	 */
	add(x: number | Vector2, y?: number): Vector2 {
		if (x instanceof Vector2) {
			y = x.y;
			x = x.x;
		}
		this.x += x;
		this.y += y;
		return this;
	}


	/**
	 * Divide the x/y position of the current Vector2 object by 'v'.
	 */
	divide(v: number): Vector2 {
		this.x /= v;
		this.y /= v;
		return this;
	}

	/**
	 * Linearly interpolate between `this` and `v`, where alpha is `amount`
	 */
	lerp(v: Vector2, amount: number): Vector2 {
		this.x += (v.x - this.x) * amount;
		this.y += (v.y - this.y) * amount;
		return this;
	}

	reset() {
		this.x = this.y = 0;
	}

	copy(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	toString() {
		return `{${this.x}, ${this.y}}`;
	}

	toObject(): [number, number] {
		return [this.x, this.y];
	}
}