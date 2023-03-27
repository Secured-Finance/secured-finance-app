import classNames from 'classnames';
import Fail from 'src/assets/icons/failed.svg';

export const FailurePanel = ({
    itemList,
}: {
    itemList: [string, string][];
}) => {
    return (
        <div className='flex w-full flex-col items-center gap-6'>
            <Fail className='h-[100px] w-[100px]' />
            <div className='flex h-28 w-full flex-row gap-6 rounded-xl border border-neutral-3 p-6'>
                {itemList.map(([key, value], index) => (
                    <div
                        key={`${key}-${index}`}
                        className='typography-caption flex flex-col gap-10px'
                    >
                        <span className='text-neutral-4'>{key}</span>
                        <span
                            className={classNames('leading-6', {
                                'text-[#FA5656]': index === 0,
                                'text-neutral-8': index !== 0,
                            })}
                        >
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
