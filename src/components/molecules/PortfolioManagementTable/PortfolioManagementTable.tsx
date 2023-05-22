import React from 'react';
import {
    GradientBox,
    PortfolioTab,
    PortfolioTabProps,
    Separator,
} from 'src/components/atoms';

const tableArray: PortfolioTabProps[] = [
    {
        name: 'Net Asset Value',
        value: '$0.00',
    },
    {
        name: 'Active Contracts',
        value: '--',
    },
    {
        name: 'Borrow PV',
        value: '--',
    },
    {
        name: 'Lend PV',
        value: '--',
    },
];

export const PortfolioManagementTable = ({ values }: { values?: string[] }) => {
    return (
        <GradientBox data-testid='portfolio-management-table'>
            <div className='flex flex-row' role='grid'>
                {tableArray.map((item, index) => {
                    return (
                        <React.Fragment
                            key={`portfolio-management-tab-${index}`}
                        >
                            <PortfolioTab
                                key={item.name}
                                {...item}
                                value={
                                    values && values[index]
                                        ? values[index]
                                        : item.value
                                }
                            />
                            {tableArray.length - 1 !== index && (
                                <Separator
                                    orientation='vertical'
                                    color='white-10'
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </GradientBox>
    );
};
