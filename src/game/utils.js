import Swal from 'sweetalert2';

/**
 * Linearly interpolate between `x` and `v`, where alpha is `a`
 * 
 * @param {number} a
 * @param {number} b
 * @param {number} amount
 * @returns {number} The interpolated value
 */
const lerp = (a, b, amount) => a + (b - a) * amount;

/**
 * Clamps `value` between `min` and `max` inclusive
 * 
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number} The clamped value
 */
const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));

let entries = ['INFO', 'WARNING', 'ERROR', 'DEBUG', 'FATAL'].map(x=>`[${x}]`);

/** @type {Map<number, function>} */
let loggers = new Map([
    [0, console.log.bind(null, entries.shift())],
    [1, console.warn.bind(null, entries.shift())],
    [2, console.error.bind(null, entries.shift())],
    [3, console.log.bind(null, entries.shift())],
    [4, console.error.bind(null, entries.shift())]
]);

/**
 * @param {EventLevel} level 
 * @param  {EventData} args
 */
const logEvent = (level, ...data) => {
    if (!loggers.has(level)) return;
    loggers.get(level)(...data);
}

/** @param {SmartBuffer} packet */
const writeClientData = (packet) => {
    // TODO
    packet.writeEscapedStringNT('Test');
    packet.writeEscapedStringNT('');
    packet.writeEscapedStringNT('https://skins.vanis.io/s/cytos1');
}

global.Swal = Swal;

let toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    showCloseButton: true
});

export {lerp, clampNumber, logEvent, writeClientData, toast};