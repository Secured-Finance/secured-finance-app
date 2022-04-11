import { termList } from 'src/utils';

interface RenderTermsProps {
    index?: number;
}

export const RenderTerms: React.FC<RenderTermsProps> = ({ index }) => {
    return <span>{termList[index]?.label}</span>;
};
