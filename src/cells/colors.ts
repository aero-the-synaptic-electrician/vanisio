// pellet colors
let neon: number[] = [0xffff00, 0x00ff00, 0x00ffff, 0xff00ff];

// cell colors
let basic: number[] = [0xff0000, 0xff8000, 0xffff00, 0x80ff00, 0x00ff00, 0x00ff80, 0x00ffff, 0x0080ff, 0x8000ff, 0xff00ff, 0xff0080];

// dull cell colors - to make bots stand out
let basicd: number[] = neon.map((n) => {
    const r = (n >> 16) & 0xff;
    const g = (n >> 8) & 0xff;
    const b = n & 0xff;
    return (((r*0.8) << 16) | ((g*0.8) << 8) | ((b*0.8))) >> 0;
});

export {neon, basic, basicd};