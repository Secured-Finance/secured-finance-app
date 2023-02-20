import { PortfolioTab, PortfolioTabProps } from 'src/components/atoms';

export const MarketDashboardTable = ({
    values,
}: {
    values: Array<PortfolioTabProps>;
}) => {
    return (
        <div
            className='flex flex-row drop-shadow-tab'
            data-testid='market-dashboard-table'
        >
            {values.map(item => {
                return (
                    <PortfolioTab
                        key={item.name}
                        {...item}
                        value={item.value}
                    />
                );
            })}
        </div>
    );
};
