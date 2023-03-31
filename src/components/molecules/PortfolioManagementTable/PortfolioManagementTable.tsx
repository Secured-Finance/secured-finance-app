import { PortfolioTab, PortfolioTabProps } from 'src/components/atoms';

const tableArray: PortfolioTabProps[] = [
    {
        name: 'Net Value',
        value: '$0.00',
        orientation: 'left',
    },
    {
        name: 'Net APR',
        value: '--',
        orientation: 'center',
    },
    {
        name: 'Active Contracts',
        value: '--',
        orientation: 'center',
    },
    {
        name: 'Net Interest Accrued*',
        value: '--',
        orientation: 'right',
    },
];

interface PortfolioManagementTableProps {
    values?: string[];
}

export const PortfolioManagementTable = ({
    values,
}: PortfolioManagementTableProps) => {
    return (
        <div
            className='flex flex-row drop-shadow-tab'
            data-testid='portfolio-management-table'
        >
            {tableArray.map((item, index) => {
                return (
                    <PortfolioTab
                        key={item.name}
                        {...item}
                        value={
                            values && values[index] ? values[index] : item.value
                        }
                    />
                );
            })}
        </div>
    );
};
