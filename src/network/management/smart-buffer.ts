import Vector2 from '@/physics/vector2';

export default class SmartBuffer {
	view: DataView;

	offset: number;

	constructor(
		viewOrBuffer: ArrayBuffer | DataView, 
		offset?: number
	) {
		if (viewOrBuffer instanceof DataView) {
			this.view = viewOrBuffer;
		} else {
			if (!(viewOrBuffer instanceof ArrayBuffer)) {
				throw new TypeError('First argument to SmartBuffer constructor must be an ArrayBuffer or DataView');
			}
            
			this.view = new DataView(viewOrBuffer);
		}

		this.offset = offset || 0;
	}

	ensureCapacity(size: number) {
		let newSize = this.offset + size;

		if (newSize > this.length) {
			let buffer = new ArrayBuffer(newSize);

			const view = new Uint8Array(buffer);
			view.set(new Uint8Array(this.buffer));

			this.view = new DataView(buffer);
		}
	}

	static fromSize(size: number): SmartBuffer {
		return new this(new ArrayBuffer(size), 0);
	}

	static fromBuffer(buffer: ArrayBuffer): SmartBuffer {
		return new this(buffer, 0);
	}

	get buffer() { return this.view.buffer; }

	toBuffer() { return this.buffer; }

	get length() {
        const {view} = this;
		return !!view ? view.byteLength : 0;
	}

	get eof() { return this.offset >= this.length; }

	/**
	 * Wrapper to call arbitrary read functions
	 */
	read(callback: Function, size: number, littleEndian?: boolean, offset?: number) {
		if (typeof offset !== 'number') {
			offset = this.offset;
			this.offset += size;
		}
		
		return callback.call(this.view, offset, littleEndian) as number;
	}

	/**
	 * Wrapper to call arbitrary writing functions
	 */
	write(callback: Function, size: number, value: number, littleEndian?: boolean) {
		this.ensureCapacity(size);
		void(callback.call(this.view, this.offset, value, littleEndian));
		this.offset += size;
	}

	readInt8(offset?: number) {
		return this.read(DataView.prototype.getInt8, 1, null, offset);
	}

	readUInt8(offset?: number) {
		return this.read(DataView.prototype.getUint8, 1, null, offset);
	}

	readInt16LE(offset?: number) {
		return this.read(DataView.prototype.getInt16, 2, true, offset);
	}

	readInt16BE(offset?: number) {
		return this.read(DataView.prototype.getInt16, 2, false, offset);
	}

	readUInt16LE(offset?: number) {
		return this.read(DataView.prototype.getUint16, 2, true, offset);
	}

	readUInt16BE(offset?: number) {
		return this.read(DataView.prototype.getUint16, 2, false, offset);
	}

	readInt32LE(offset?: number) {
		return this.read(DataView.prototype.getInt32, 4, true, offset);
	}

	readInt32BE(offset?: number) {
		return this.read(DataView.prototype.getInt32, 4, false, offset);
	}

	readUInt32LE(offset?: number) {
		return this.read(DataView.prototype.getUint32, 4, true, offset);
	}

	readUInt32BE(offset?: number) {
		return this.read(DataView.prototype.getUint32, 4, false, offset);
	}

	readVector2(offset?: number, littleEndian?: boolean) {
		if (typeof offset !== 'number') {
			offset = this.offset;
			this.offset += 4;
		}
		
		let {view} = this;
		return new Vector2(view.getUint16(offset, littleEndian), view.getUint16(offset + 2, littleEndian));
	}

	readString16() {
		let result = '';

		for (;;) {
			const ch = this.readUInt16LE();
			if (ch === 0 || this.eof) break;

			result += String.fromCharCode(ch);
		}

		return result;
	}

	readString() {
		let result = '';

		for (;;) {
			const ch = this.readUInt8();
			if (ch === 0 || this.eof) break;

			result += String.fromCharCode(ch);
		}

		return result;
	}

	readEscapedString() {
		return decodeURIComponent(escape(this.readString()));
	}

	writeInt8(value: number) {
		this.write(DataView.prototype.setInt8, 1, value, null);
	}

	writeUInt8(value: number) {
		this.write(DataView.prototype.setUint8, 1, value, null);
	}

	writeInt16LE(value: number) {
		this.write(DataView.prototype.setInt16, 2, value, true);
	}

	writeInt16BE(value: number) {
		this.write(DataView.prototype.setInt16, 2, value, false);
	}

	writeUInt16LE(value: number) {
		this.write(DataView.prototype.setUint16, 2, value, true);
	}

	writeUInt16BE(value: number) {
		this.write(DataView.prototype.setUint16, 2, value, false);
	}

	writeInt32LE(value: number) {
		this.write(DataView.prototype.setInt32, 4, value, true);
	}

	writeInt32BE(value: number) {
		this.write(DataView.prototype.setInt32, 4, value, false);
	}

	writeUInt32LE(value: number) {
		this.write(DataView.prototype.setUint32, 4, value, true);
	}

	writeUInt32BE(value: number) {
		this.write(DataView.prototype.setUint32, 4, value, false);
	}

	writeString(value: string) {
		let l = value.length;
		this.ensureCapacity(l); /* optimization */
		for (let i = 0; i < l; i++) {
			this.writeUInt8(value.charCodeAt(i));
		}
	}

	writeStringNT(value: string) {
		this.writeString(value);
		this.writeUInt8(0);
	}

	writeEscapedString(value: string) {
		this.writeString(unescape(encodeURIComponent(value)));
	}

	writeEscapedStringNT(value: string) {
		this.writeStringNT(unescape(encodeURIComponent(value)));
	}
}