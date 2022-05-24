import { getTermBy, Term } from 'src/utils';

interface RenderTermsProps {
    label: keyof Term;
    value: string | number;
}

export const RenderTerms: React.FC<RenderTermsProps> = ({ label, value }) => {
    const term = getTermBy(label, value);
    return <span>{term.label}</span>;
};
