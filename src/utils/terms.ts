import { Option } from 'src/components/atoms';

export interface TermInfo {
    value: string;
    numOfDays: number;
    termIndex: string;
    label: string;
}

export const getTermBy = (label: keyof TermInfo, value: string | number) => {
    const term = termList.find(
        ({ [label]: val }) =>
            val.toString().toLowerCase() === value.toString().toLowerCase()
    );

    if (!term) {
        throw new Error(`Term ${label} ${value} not found`);
    }

    return term;
};

export enum Term {
    '3M' = '3M',
    '6M' = '6M',
    '1Y' = '1Y',
    '2Y' = '2Y',
    '3Y' = '3Y',
    '5Y' = '5Y',
}

export const termMap: Record<Term, TermInfo> = {
    '3M': {
        value: '3 month',
        numOfDays: 90,
        termIndex: '90',
        label: '3 Month',
    },
    '6M': {
        value: '6 month',
        numOfDays: 180,
        termIndex: '180',
        label: '6 Month',
    },
    '1Y': {
        value: '1 year',
        numOfDays: 365,
        termIndex: '365',
        label: '1 Year',
    },
    '2Y': {
        value: '2 year',
        numOfDays: 730,
        termIndex: '730',
        label: '2 Year',
    },
    '3Y': {
        value: '3 year',
        numOfDays: 1095,
        termIndex: '1095',
        label: '3 Year',
    },
    '5Y': {
        value: '5 year',
        numOfDays: 1825,
        termIndex: '1825',
        label: '5 Year',
    },
};

export const getTermsAsOptions = () => {
    return Object.entries(termMap).map<Option<Term>>(o => ({
        label: o[1].label,
        value: o[0] as Term,
    }));
};

export const termList: TermInfo[] = [
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
