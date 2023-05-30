import React from 'react';
import { GradientBox, Separator } from 'src/components/atoms';
import {
    PortfolioTab,
    PortfolioTabProps,
} from 'src/components/atoms/PortfolioTab/PortfolioTab';

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
        name: 'Lending PV',
        value: '--',
    },
    {
        name: 'Borrowing PV',
        value: '--',
    },
];

export const PortfolioManagementTable = ({ values }: { values?: string[] }) => {
    return (
        <GradientBox data-testid='portfolio-management-table'>
            <div className='flex flex-col tablet:flex-row' role='grid'>
                <div className='flex w-full flex-row'>
                    {tableArray.slice(0, 2).map((item, index) => {
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

                <Separator orientation='horizontal' color='white-10' />

                <div className='flex w-full flex-row'>
                    {tableArray.slice(2).map((item, index) => {
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
            </div>
        </GradientBox>
    );
};
