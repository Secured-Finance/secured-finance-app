import { Tab as HeadlessTab } from '@headlessui/react';
import clsx from 'clsx';
import { Children, useState } from 'react';
import TooltipIcon from 'src/assets/icons/information-circle-block.svg';
import { Checkbox, DropdownSelector } from 'src/components/atoms';
import { Tooltip, TooltipMode } from 'src/components/molecules';

const TitleChip = ({
    title,
    selected,
    tooltip,
}: {
    title: string;
    selected: boolean;
    tooltip?: string;
}) => {
    return (
        <div
            data-testid={title}
            className={clsx(
                'flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-[100px] px-6 py-2 text-3 leading-4 text-neutral-50',
                {
                    'bg-primary-700': selected,
                    'bg-neutral-700 hover:bg-neutral-600': !selected,
                },
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
                    mode={TooltipMode.Warning}
                    align='right'
                    placement='bottom'
                >
                    {tooltip}
                </Tooltip>
            )}
        </div>
    );
};

export const HorizontalTabTable = ({
    tabTitles,
    children,
    onTabChange,
    useCustomBreakpoint = false,
    showAllPositions = false,
    isChecked = false,
    setIsChecked,
    tooltipMap,
}: {
    tabTitles: string[];
    children?: React.ReactNode;
    onTabChange?: (v: number) => void;
    useCustomBreakpoint?: boolean;
    showAllPositions?: boolean;
    isChecked?: boolean;
    setIsChecked?: (v: boolean) => void;
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
        >
            <div
                className={clsx(
                    'flex h-full flex-col rounded-xl border border-neutral-600 bg-neutral-900 laptop:rounded-t-none',
                )}
            >
                <HeadlessTab.List className='flex justify-between border-b border-neutral-600 px-4 py-3 laptop:h-fit laptop:py-3.5'>
                    <div
                        className={clsx('w-full', {
                            'horizontalTab:hidden': useCustomBreakpoint,
                            'tablet:hidden': !useCustomBreakpoint,
                        })}
                    >
                        <DropdownSelector
                            optionList={tabTitles.map((title, index) => ({
                                label: title,
                                value: index.toString(),
                            }))}
                            selected={{
                                label: tabTitles[selectedIndex],
                                value: selectedIndex.toString(),
                            }}
                            onChange={option => onChange(parseInt(option) || 0)}
                            variant={
                                showAllPositions
                                    ? 'tabWidthFit'
                                    : 'tabWidthFull'
                            }
                        />
                    </div>
                    <div
                        className={clsx('hidden gap-4', {
                            'horizontalTab:flex': useCustomBreakpoint,
                            'tablet:flex': !useCustomBreakpoint,
                        })}
                    >
                        {tabTitles.map((title, index) => {
                            return (
                                <HeadlessTab
                                    key={index}
                                    className='h-full focus:outline-none'
                                >
                                    {({ selected }) => (
                                        <TitleChip
                                            title={title}
                                            selected={selected}
                                            tooltip={tooltipMap?.[index]}
                                        />
                                    )}
                                </HeadlessTab>
                            );
                        })}
                    </div>
                    {showAllPositions && setIsChecked && (
                        <Checkbox
                            isChecked={isChecked}
                            onChange={setIsChecked}
                            label='Show All Positions'
                        />
                    )}
                </HeadlessTab.List>
                <HeadlessTab.Panels
                    className={clsx(
                        'h-full rounded-b-xl bg-neutral-900 tablet:min-h-[25vh] laptop:pb-2',
                    )}
                >
                    {arrayChildren[selectedIndex]}
                </HeadlessTab.Panels>
            </div>
        </HeadlessTab.Group>
    );
};
