import { Menu, Tab as HeadlessTab } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import classNames from 'classnames';
import React, { Children, useState } from 'react';
import { Separator } from 'src/components/atoms';

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
                        <Menu as='div' className='relative'>
                            <Menu.Button
                                data-testid='menu'
                                className=' flex h-10 w-full flex-row items-center justify-between rounded-xl bg-black-30 p-2 text-neutral-8 focus:outline-none'
                            >
                                {tabTitles[selectedIndex]}
                                <ChevronDownIcon className='h-4' />
                            </Menu.Button>
                            <Menu.Items className='absolute z-20 mt-1 flex w-full flex-col rounded-lg bg-gunMetal p-2 shadow-sm'>
                                {tabTitles.map((title, index) => (
                                    <Menu.Item key={title}>
                                        {({ active }) => (
                                            <div>
                                                <div
                                                    className={classNames(
                                                        'flex flex-row items-center justify-between space-x-4 rounded-lg p-2 text-white-80',
                                                        {
                                                            'bg-horizonBlue':
                                                                active,
                                                        }
                                                    )}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            setSelectedIndex(
                                                                index
                                                            )
                                                        }
                                                        className='w-full'
                                                        data-testid={`${title}-mobile`}
                                                    >
                                                        {title}
                                                    </button>
                                                    <ChevronDownIcon className='h-4' />
                                                </div>
                                                {index !==
                                                tabTitles.length - 1 ? (
                                                    <div className='py-2'>
                                                        <Separator />
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </Menu.Item>
                                ))}
                            </Menu.Items>
                        </Menu>
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
