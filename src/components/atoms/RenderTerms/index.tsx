export interface Term {
    value: string;
    label: string;
}

interface RenderTermsProps {
    index?: number;
}

export const termsList: Term[] = [
    {
        value: '3mo',
        label: '3 Month',
    },
    {
        value: '6mo',
        label: '6 Month',
    },
    {
        value: '1yr',
        label: '1 Year',
    },
    {
        value: '2yr',
        label: '2 Years',
    },
    {
        value: '3yr',
        label: '3 Years',
    },
    {
        value: '5yr',
        label: '5 Years',
    },
];

export const RenderTerms: React.FC<RenderTermsProps> = ({ index }) => {
    return <span>{termsList[index]?.label}</span>;
};
