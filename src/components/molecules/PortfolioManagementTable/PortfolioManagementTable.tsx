import { PortfolioTab, PortfolioTabProps } from 'src/components/atoms';

const tableArray: PortfolioTabProps[] = [
    {
        name: 'Net Value',
        value: '$0.00',
        orientation: 'left',
    },
    {
        name: 'Net APY',
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
    values: string[];
}

export const PortfolioManagementTable: React.FC<
    PortfolioManagementTableProps
> = ({ values }) => {
    return (
        <div
            className='flex flex-row drop-shadow-[0_46px_64px_rgba(31,47,70,0.4)]'
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
