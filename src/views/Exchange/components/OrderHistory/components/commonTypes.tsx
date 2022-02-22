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
    index?: number;
}

export const RenderTerms: React.FC<IndexProps> = ({ index }) => {
    switch (index) {
        case 0:
            return <span>3 Month</span>;
        case 1:
            return <span>6 Month</span>;
        case 2:
            return <span>1 Year</span>;
        case 3:
            return <span>2 Years</span>;
        case 4:
            return <span>3 Years</span>;
        case 5:
            return <span>5 Years</span>;
        default:
            break;
    }
};
