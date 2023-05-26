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
            <div className='flex flex-row' role='grid'>
                {values.map((item, index) => {
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
        </GradientBox>
    );
};
