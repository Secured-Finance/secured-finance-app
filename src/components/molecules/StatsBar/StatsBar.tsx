import clsx from 'clsx';
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
            <div
                className={clsx(
                    `grid grid-cols-2 grid-rows-1`,
                    values.length > 2
                        ? 'grid-rows-2 tablet:grid-cols-4  tablet:grid-rows-1'
                        : '',
                )}
                role='grid'
            >
                {values.map((item, index) => (
                    <div
                        key={`${testid}-table-${index}`}
                        className={
                            'border-white-10 odd:border-r tablet:last:border-none tablet:even:border-r'
                        }
                    >
                        <StatsBox
                            key={item.name}
                            {...item}
                            value={item.value}
                        />
                        {values.length - 2 > index && (
                            <div className='tablet:hidden'>
                                <Separator
                                    orientation='horizontal'
                                    color='white-10'
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </GradientBox>
    );
};
