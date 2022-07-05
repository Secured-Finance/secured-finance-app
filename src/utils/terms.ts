export interface Term {
    value: string;
    numOfDays: number;
    termIndex: string;
    label: string;
}

export const getTermBy = (label: keyof Term, value: string | number) => {
    const term = termList.find(
        ({ [label]: val }) =>
            val.toString().toLowerCase() === value.toString().toLowerCase()
    );

    if (!term) {
        throw new Error(`Term ${label} ${value} not found`);
    }

    return term;
};

export const termList: Term[] = [
    {
        value: '3 month',
        numOfDays: 90,
        termIndex: '90',
        label: '3 Month',
    },
    {
        value: '6 month',
        numOfDays: 180,
        termIndex: '180',
        label: '6 Month',
    },
    {
        value: '1 year',
        numOfDays: 365,
        termIndex: '365',
        label: '1 Year',
    },
    {
        value: '2 year',
        numOfDays: 730,
        termIndex: '730',
        label: '2 Years',
    },
    {
        value: '3 year',
        numOfDays: 1095,
        termIndex: '1095',
        label: '3 Years',
    },
    {
        value: '5 year',
        numOfDays: 1825,
        termIndex: '1825',
        label: '5 Years',
    },
];
