export type FontFamilyGroupType = 'google' | 'local';

export type FontFamilyValue = {
    family?: string;
    type: FontFamilyGroupType;
    weight?: string;
};

export type FontFamilyFontVendors = {
    [id: string]: FontFamilyFontVendor;
};

export type FontFamilyFontVendor = {
    fonts: FontFamilyFontVendors;
    id: 'google' | 'local';
    name: string;
};

export type FontFamilyVendorFonts = {
    [id: string]: FontFamilyFontVendor;
};

export type FontFamilyVendorFont = {
    family: string;
    files: {
        [name: string]: string;
    };
    variants: string[];
};
