import { Tab as HeadlessTab } from '@headlessui/react';
import classNames from 'classnames';
import React, { Children, useState } from 'react';

const TitleChip = ({
    title,
    selected,
}: {
    title: string;
    selected: boolean;
}) => {
    return (
        <div
            className={classNames('typography-caption-2 w-fit py-3 px-5', {
                'rounded-3xl bg-black-30 text-neutral-8': selected,
                'text-neutral-4': !selected,
            })}
        >
            {title}
        </div>
    );
};
export const TradeHistoryTab = ({
    tabTitles,
    children,
}: {
    tabTitles: string[];
    children: React.ReactNode;
}) => {
    const arrayChildren = Children.toArray(children);
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div className='border border-white-10 bg-cardBackground/60 shadow-tab'>
            <HeadlessTab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
            >
                <HeadlessTab.List className='flex justify-start border-b border-white-10 py-3 px-8'>
                    {tabTitles.map(title => {
                        return (
                            <HeadlessTab
                                key={title}
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
                </HeadlessTab.List>
                <HeadlessTab.Panels>
                    {arrayChildren[selectedIndex]}
                </HeadlessTab.Panels>
            </HeadlessTab.Group>
        </div>
    );
};
