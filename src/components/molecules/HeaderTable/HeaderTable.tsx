import React from 'react';
import {
    GradientBox,
    HeaderTableTab,
    HeaderTableTabProps,
    Separator,
} from 'src/components/atoms';

export const HeaderTable = ({
    values,
    testid,
}: {
    values: Array<HeaderTableTabProps>;
    testid: string;
}) => {
    return (
        <GradientBox data-testid={`${testid}-table`}>
            <div className='flex flex-row' role='grid'>
                {values.map((item, index) => {
                    return (
                        <React.Fragment key={`${testid}-table-${index}`}>
                            <HeaderTableTab
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
