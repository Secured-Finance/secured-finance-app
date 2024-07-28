import { Tab as HeadlessTab } from '@headlessui/react';
import clsx from 'clsx';
import { Children, useState } from 'react';
import TooltipIcon from 'src/assets/icons/information-circle-block.svg';
import { DropdownSelector } from 'src/components/atoms';
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
                'typography-caption-2 flex w-fit items-center justify-center gap-2 whitespace-nowrap px-5 py-3',
                {
                    'rounded-3xl bg-black-30 text-neutral-8': selected,
                    'text-neutral-4': !selected,
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

export const HorizontalTab = ({
    className,
    tabTitles,
    children,
    onTabChange,
    useCustomBreakpoint = false,
    tooltipMap,
}: {
    className?: string;
    tabTitles: string[];
    children?: React.ReactNode;
    onTabChange?: (v: number) => void;
    useCustomBreakpoint?: boolean;
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
                    'flex h-full flex-col border border-white-10 bg-gunMetal/40 shadow-tab tablet:rounded-b-2xl',
                    className
                )}
            >
                <HeadlessTab.List className='h-16 justify-start border-b border-white-10 p-3'>
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
                            variant='fullWidth'
                        />
                    </div>
                    <div
                        className={clsx('hidden', {
                            'horizontalTab:block': useCustomBreakpoint,
                            'tablet:block': !useCustomBreakpoint,
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
                </HeadlessTab.List>
                <HeadlessTab.Panels className='h-full bg-cardBackground pb-2 tablet:min-h-[25vh] tablet:rounded-b-2xl'>
                    {arrayChildren[selectedIndex]}
                </HeadlessTab.Panels>
            </div>
        </HeadlessTab.Group>
    );
};

export const HorizontalTabTable = ({
    tabTitles,
    children,
    onTabChange,
    useCustomBreakpoint = false,
    tooltipMap,
}: {
    tabTitles: string[];
    children?: React.ReactNode;
    onTabChange?: (v: number) => void;
    useCustomBreakpoint?: boolean;
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
                    'flex h-full flex-col rounded-xl border border-neutral-600 bg-neutral-900 laptop:rounded-t-none'
                )}
            >
                <HeadlessTab.List className='justify-start border-b border-white-10 px-4 py-3 laptop:h-16 laptop:px-3'>
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
                            variant='tab'
                        />
                    </div>
                    <div
                        className={clsx('hidden', {
                            'horizontalTab:block': useCustomBreakpoint,
                            'tablet:block': !useCustomBreakpoint,
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
                </HeadlessTab.List>
                <HeadlessTab.Panels
                    className={clsx(
                        'h-full rounded-b-xl bg-neutral-900 tablet:min-h-[25vh] laptop:rounded-b-2xl'
                    )}
                >
                    {arrayChildren[selectedIndex]}
                </HeadlessTab.Panels>
            </div>
        </HeadlessTab.Group>
    );
};
