/**
 * Chain event handlers.
 *
 *
 * @returns an event handler which calls all given handler by order while skipping undefined handlers.
 */
export function chainEventHandlers(...handlers) {
    return event => handlers.filter(i => i).forEach(handler => handler(event));
}
