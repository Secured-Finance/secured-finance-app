/**
 * Shallow comparison function for objects
 * Returns true if objects have the same keys and values (shallow equality)
 */
export function shallowEqual<T extends Record<string, unknown>>(
    a: T,
    b: T
): boolean {
    if (Object.is(a, b)) {
        return true;
    }

    if (a === null || a === undefined || b === null || b === undefined) {
        return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (const key of keysA) {
        if (
            !Object.prototype.hasOwnProperty.call(b, key) ||
            !Object.is(a[key], b[key])
        ) {
            return false;
        }
    }

    return true;
}

/**
 * Creates a selector that uses shallow comparison
 * Useful for selecting multiple properties from a store
 */
export function createShallowSelector<T, R extends Record<string, unknown>>(
    selector: (state: T) => R
): (state: T) => R {
    let lastResult: R | undefined;
    let lastArgs: T | undefined;

    return (state: T): R => {
        if (state !== lastArgs) {
            const result = selector(state);
            if (!lastResult || !shallowEqual(lastResult, result)) {
                lastResult = result;
            }
            lastArgs = state;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return lastResult!;
    };
}
