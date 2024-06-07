export const generateDataAttr = (props: Object, filter?: any[]) =>
    Object.entries(props)
        .filter(([key]) => filter && filter.includes(key))
        .reduce(
            (output, [key, value]) => ({
                ...output,
                [`data-${key.toLowerCase()}`]: value
            }),
            {}
        );
