import React from 'react';
import {
    GradientBox,
    PortfolioTab,
    PortfolioTabProps,
    Separator,
} from 'src/components/atoms';

export const MarketDashboardTable = ({
    values,
}: {
    values: Array<PortfolioTabProps>;
}) => {
    return (
        <GradientBox data-testid='market-dashboard-table'>
            <div className='flex flex-row' role='grid'>
                {values.map((item, index) => {
                    return (
                        <React.Fragment key={`market-dashboard-table-${index}`}>
                            <PortfolioTab
                                key={item.name}
                                {...item}
                                value={item.value}
                            />
                            {values.length - 1 !== index && (
                                <Separator orientation='vertical' />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </GradientBox>
    );
};
