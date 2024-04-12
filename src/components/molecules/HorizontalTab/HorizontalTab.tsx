import { Tab as HeadlessTab } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Children, useState } from 'react';
import TooltipIcon from 'src/assets/icons/information-circle-block.svg';
import { Tooltip } from 'src/components/templates';

const TitleChip = ({
    title,
    selected,
    tooltip,
    testId,
}: {
    title: string;
    selected: boolean;
    tooltip?: string;
    testId?: string;
}) => {
    return (
        <div
            data-testid={testId ?? title}
            className={clsx(
                'flex w-fit min-w-[92px] items-center justify-center gap-2 whitespace-nowrap rounded-3xl px-5 py-2 text-xs leading-4 laptop:py-3',
                {
                    'bg-primary-500 font-semibold text-neutral-8': selected,
                    'bg-neutral-700 text-neutral-300': !selected,
                }
            )}
        >
            {title}
            {tooltip && (
                <Tooltip
                    iconElement={
                        <TooltipIcon
                            className='h-[12.8px] w-[12.8px]'
                            data-testid={`${title}-tooltip`}
                        />
                    }
                    severity='warning'
                    align='right'
                >
                    <div className='grid grid-cols-10'>
                        <InformationCircleIcon className='col-span-1 mt-1 h-3 w-3 text-white' />
                        <div className='col-span-9'>{tooltip}</div>
                    </div>
                </Tooltip>
            )}
        </div>
    );
};
export const HorizontalTab = ({
    tabTitles,
    children,
    onTabChange,
    tooltipMap,
}: {
    tabTitles: { title: string; testId: string }[];
    children?: React.ReactNode;
    onTabChange?: (v: number) => void;
    tooltipMap?: Record<number, string>;
}) => {
    const arrayChildren = Children.toArray(children);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onChange = (index: number) => {
        setSelectedIndex(index);
        onTabChange?.(index);
    };

    return (
        <HeadlessTab.Group
            selectedIndex={selectedIndex}
            onChange={onChange}
            as='div'
            className='h-full'
        >
            <div className='flex flex-col rounded-xl border border-neutral-600 bg-neutral-900 shadow-tab laptop:bg-gunMetal/40'>
                <HeadlessTab.List className='flex h-auto justify-center border-b border-neutral-600 p-3 laptop:h-16 laptop:justify-start'>
                    <div className='flex gap-3'>
                        {tabTitles.map((title, index) => {
                            return (
                                <HeadlessTab
                                    key={index}
                                    className='h-full focus:outline-none'
                                >
                                    {({ selected }) => (
                                        <TitleChip
                                            title={title.title}
                                            selected={selected}
                                            tooltip={tooltipMap?.[index]}
                                            testId={title.testId}
                                        />
                                    )}
                                </HeadlessTab>
                            );
                        })}
                    </div>
                </HeadlessTab.List>
                <HeadlessTab.Panels className='h-[385px] overflow-auto rounded-b-xl pb-2 laptop:h-full laptop:min-h-[25vh] laptop:bg-cardBackground'>
                    {arrayChildren[selectedIndex]}
                </HeadlessTab.Panels>
            </div>
        </HeadlessTab.Group>
    );
};
