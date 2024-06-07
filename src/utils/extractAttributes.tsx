import { filterObject } from './filterObject';

/**
 * a generic utility to get a subset of the received props object according to the prefix of the prop name
 * @param props
 * @param prefix
 * @return {any}
 */
export const extractAttributes = (props: Record<string, any>, prefix = '') =>
    filterObject(props, key => key.length >= prefix.length && key.indexOf(prefix) === 0);

/**
 * Returns a subset of the received props object that starts with "data-"
 * @param props
 * @return {*}
 */
export const extractDataAttributes = props => extractAttributes(props, 'data-');
