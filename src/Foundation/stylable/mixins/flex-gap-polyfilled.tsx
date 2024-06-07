module.exports.gap = args => {
    const gap = args[0];
    return {
        '&': {
            gap
        },
        '@supports (not (translate: none)) and (not (appearance: auto))': {
            '&': {
                gap: 0,
                margin: `calc(${gap} / -2) calc(${gap} / -2);`
            },
            '& > *': {
                margin: `calc(${gap} / 2) calc(${gap} / 2);`
            }
        }
    };
};
