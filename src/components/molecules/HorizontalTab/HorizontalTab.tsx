import { Tab as HeadlessTab } from '@headlessui/react';
import classNames from 'classnames';
import React, { Children, useState } from 'react';
import { DropdownSelector } from 'src/components/atoms';

const TitleChip = ({
    title,
    selected,
}: {
    title: string;
    selected: boolean;
}) => {
    return (
        <div
            data-testid={title}
            className={classNames(
                'typography-caption-2 w-fit whitespace-nowrap px-5 py-3',
                {
                    'rounded-3xl bg-black-30 text-neutral-8': selected,
                    'text-neutral-4': !selected,
                }
            )}
        >
            {title}
        </div>
    );
};
export const HorizontalTab = ({
    tabTitles,
    children,
}: {
    tabTitles: string[];
    children?: React.ReactNode;
}) => {
    const arrayChildren = Children.toArray(children);
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div className='rounded-b-2xl border border-white-10 bg-cardBackground/60 shadow-tab'>
            <HeadlessTab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
            >
                <HeadlessTab.List className='h-16 justify-start border-b border-white-10 p-3'>
                    <div className='w-full tablet:hidden'>
                        <DropdownSelector
                            optionList={tabTitles.map((title, index) => ({
                                label: title,
                                value: index.toString(),
                            }))}
                            selected={{
                                label: tabTitles[selectedIndex],
                                value: selectedIndex.toString(),
                            }}
                            onChange={option =>
                                setSelectedIndex(parseInt(option) || 0)
                            }
                            variant='fullWidth'
                        />
                    </div>
                    <div className='hidden tablet:block'>
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
                                        />
                                    )}
                                </HeadlessTab>
                            );
                        })}
                    </div>
                </HeadlessTab.List>
                <HeadlessTab.Panels className='min-h-[30vh] rounded-b-2xl bg-black-20 px-2'>
                    {arrayChildren[selectedIndex]}
                </HeadlessTab.Panels>
            </HeadlessTab.Group>
        </div>
    );
};
