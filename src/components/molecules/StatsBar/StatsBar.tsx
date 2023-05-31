import React from 'react';
import {
    GradientBox,
    Separator,
    StatsBox,
    StatsBoxProps,
} from 'src/components/atoms';

export const StatsBar = ({
    values,
    testid,
}: {
    values: Array<StatsBoxProps>;
    testid: string;
}) => {
    return (
        <GradientBox data-testid={`${testid}-table`}>
            <div className='flex flex-col tablet:flex-row' role='grid'>
                <div className='flex w-full flex-row'>
                    {values.slice(0, 2).map((item, index) => {
                        return (
                            <React.Fragment key={`${testid}-table-${index}`}>
                                <StatsBox
                                    key={item.name}
                                    {...item}
                                    value={item.value}
                                />
                                {values.length - 1 !== index && (
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
                    {values.slice(2).map((item, index) => {
                        return (
                            <React.Fragment key={`${testid}-table-${index}`}>
                                <StatsBox
                                    key={item.name}
                                    {...item}
                                    value={item.value}
                                />
                                {values.length - 1 !== index && (
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
