export const isString = a => typeof a === 'string';

/**
 * a includes b (with case insensitive matching)
 */
export function includesCaseInsensitive(a = '', b = '') {
    return [a, b].every(isString) && (!b || a.toLowerCase().indexOf(b.toLowerCase()) !== -1);
}

export const StringUtils = {
    includesCaseInsensitive
};
