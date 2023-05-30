import { Tab as HeadlessTab } from '@headlessui/react';
import classNames from 'classnames';
import React, { Children, useState } from 'react';
import { GradientBox } from 'src/components/atoms';

const TitleChip = ({
    title,
    selected,
}: {
    title: string;
    selected: boolean;
}) => {
    return (
        <div
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
    tabTitles: [string, string][] | string[];
    children?: React.ReactNode;
}) => {
    const arrayChildren = Children.toArray(children);
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div>
            <div className='h-16 border-white-10 bg-cardBackground/60 shadow-tab  tablet:hidden'>
                <GradientBox shape='rectangle'>
                    <select
                        value={selectedIndex}
                        onChange={event =>
                            setSelectedIndex(Number(event.target.value))
                        }
                        className='mx-2 my-3 h-10 w-[95%] justify-start rounded-xl  bg-black-30 p-2 text-neutral-8 focus:outline-none'
                    >
                        {tabTitles.map((title, index) => {
                            const chipTitle =
                                typeof title === 'string' ? title : title[0];

                            return (
                                <option
                                    key={chipTitle}
                                    value={index}
                                    className='rounded-xl bg-black-30 text-neutral-8 '
                                >
                                    {chipTitle}
                                </option>
                            );
                        })}
                    </select>
                </GradientBox>
            </div>

            <div className='rounded-b-2xl border border-white-10 bg-cardBackground/60 shadow-tab'>
                <HeadlessTab.Group
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                >
                    <HeadlessTab.List className='invisible h-0 justify-start border-b border-white-10 px-5 tablet:visible tablet:h-16 tablet:py-3'>
                        {tabTitles.map(title => {
                            const chipTitle =
                                typeof title === 'string' ? title : title[0];
                            const chipClassName =
                                typeof title === 'string' ? '' : title[1];

                            return (
                                <HeadlessTab
                                    key={chipTitle}
                                    className='h-full focus:outline-none'
                                >
                                    {({ selected }) => (
                                        <div className={chipClassName}>
                                            <TitleChip
                                                title={chipTitle}
                                                selected={selected}
                                            />
                                        </div>
                                    )}
                                </HeadlessTab>
                            );
                        })}
                    </HeadlessTab.List>
                    <HeadlessTab.Panels className='min-h-[30vh] rounded-b-2xl bg-black-20 px-2'>
                        {arrayChildren[selectedIndex]}
                    </HeadlessTab.Panels>
                </HeadlessTab.Group>
            </div>
        </div>
    );
};
