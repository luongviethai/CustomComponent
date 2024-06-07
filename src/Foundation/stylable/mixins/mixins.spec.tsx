import hex_to_hsl from './hex_to_hsl';
import hex_to_rgba from './hex_to_rgba';

describe('Stylable mixins', () => {
    it('hex to hsl', () => {
        expect(hex_to_hsl('#000000')).toStrictEqual([0, -0, 0]);
        expect(hex_to_hsl('#ff0000')).toStrictEqual([0, 100, 50]);
        expect(hex_to_hsl('#00ff00')).toStrictEqual([120, 100, 50]);
        expect(hex_to_hsl('#0000ff')).toStrictEqual([240, 100, 50]);
        expect(hex_to_hsl('#ffffff')).toStrictEqual([0, -0, 100]);
    });

    it('hex to rgba', () => {
        expect(hex_to_rgba('#000000')).toStrictEqual({ b: 0, g: 0, r: 0 });
        expect(hex_to_rgba('#ff0000')).toStrictEqual({ b: 0, g: 0, r: 255 });
        expect(hex_to_rgba('#00ff00')).toStrictEqual({ b: 0, g: 255, r: 0 });
        expect(hex_to_rgba('#0000ff')).toStrictEqual({ b: 255, g: 0, r: 0 });
        expect(hex_to_rgba('#ffffff')).toStrictEqual({ b: 255, g: 255, r: 255 });
    });
});
