function replacer(_key: string, value: unknown) {
    if (typeof value === 'bigint') {
        return {
            type: 'bigint',
            value: value.toString(),
        };
    } else {
        return value;
    }
}

export const jsonStringify = (obj: unknown) => {
    return JSON.stringify(obj, replacer);
};
