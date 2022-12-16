import { PortfolioTab, PortfolioTabProps } from 'src/components/atoms';

const tableArray: PortfolioTabProps[] = [
    {
        name: 'Total Lend',
        value: '$0.00',
        orientation: 'left',
    },
    {
        name: 'Total Borrow',
        value: '--',
        orientation: 'center',
    },
    {
        name: 'Total Value Locked',
        value: '--',
        orientation: 'center',
    },
    {
        name: 'Assets',
        value: '--',
        orientation: 'right',
    },
];

interface MarketDashboardTableProps {
    values?: string[];
}

export const MarketDashboardTable = ({ values }: MarketDashboardTableProps) => {
    return (
        <div
            className='flex flex-row drop-shadow-tab'
            data-testid='market-dashboard-table'
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
