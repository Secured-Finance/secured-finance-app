import { getTermBy, TermInfo } from 'src/utils';

interface RenderTermsProps {
    label: keyof TermInfo;
    value: string | number;
}

export const RenderTerms: React.FC<RenderTermsProps> = ({ label, value }) => {
    const term = getTermBy(label, value);
    return <span>{term.label}</span>;
};
