import hex_to_hsl from './hex_to_hsl';

export default function calc_color_vars(color) {
    const [h, s, l] = hex_to_hsl(color);
    return {
        color00: `hsl(${h}, ${s}%, ${l}%)`,
        color05: `hsl(${h}, ${s}%, ${l + 5}%)`,
        color10: `hsl(${h}, ${s}%, ${l + 10}%)`,
        color20: `hsl(${h}, ${s}%, ${l + 20}%)`,
        color30: `hsl(${h}, ${s}%, ${l + 30}%)`,
        color40: `hsl(${h}, ${s}%, ${l + 40}%)`,
        color50: `hsl(${h}, ${s}%, ${l + 50}%)`,
        color60: `hsl(${h}, ${s}%, ${l + 60}%)`
    };
}
