/* eslint-disable no-useless-escape */
/**
 * RegExps.
 * A URL must match #1 and then at least one of #2/#3.
 * Use two levels of REs to avoid REDOS.
 */

const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const protocolRE = /^https?:\/\/.+$/i;

const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

/**
 * Loosely validate a URL `string`.
 */
export function isUrl(string?: string) {
    if (typeof string !== 'string') {
        return false;
    }

    const match = string.match(protocolAndDomainRE);
    if (!match) {
        return false;
    }

    const everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
        return false;
    }

    return (
        localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)
    );
}

/**
 * Prepend `http://` to relative url.
 */
export const prependHTTP = (url?: string) => url && (protocolRE.test(url) ? url : `http://${url}`);
