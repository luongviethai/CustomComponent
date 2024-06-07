module.exports = function rgba_to_hex8(orig) {
    let a;
    const rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
    const alpha = ((rgb && rgb[4]) || '').trim();
    let hex = rgb
        ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
          (rgb[2] | (1 << 8)).toString(16).slice(1) +
          (rgb[3] | (1 << 8)).toString(16).slice(1)
        : orig;

    if (alpha !== '') {
        // multiply before convert to HEX
        a = ((alpha * 255) | (1 << 8)).toString(16).slice(1);
        hex = hex + a;
    }

    return '#' + hex.toUpperCase();
};
