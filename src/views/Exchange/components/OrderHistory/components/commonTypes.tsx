export interface TableColumns {
    Header: string;
    id: string;
    isHiddenHeader: boolean;
    columns: Array<Columns>;
    isSorted?: boolean;
    isSortedDesc?: boolean;
}

interface Columns {
    Header: string;
    accessor: string;
    Cell: any;
}

interface IndexProps {
    index?: number | string;
}

export const RenderTerms: React.FC<IndexProps> = ({ index }) => {
    switch (index) {
        case '90':
            return <span>3 Month</span>;
        case '180':
            return <span>6 Month</span>;
        case '365':
            return <span>1 Year</span>;
        case '730':
            return <span>2 Years</span>;
        case '1095':
            return <span>3 Years</span>;
        case '1825':
            return <span>5 Years</span>;
        default:
            break;
    }
};
