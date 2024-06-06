import { Tab as HeadlessTab } from '@headlessui/react';
import clsx from 'clsx';
import React, { Children, useState } from 'react';
import { Tab } from 'src/components/atoms';

export type TabSelectorData = {
    text: string;
    disabled?: boolean;
    util?: React.ReactNode;
};

interface TabSelectorProps {
    tabDataArray: TabSelectorData[];
    children: React.ReactNode;
    tabGroupClassName?: string;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
    tabDataArray,
    children,
    tabGroupClassName,
}) => {
    const arrayChildren = Children.toArray(children);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const util = tabDataArray[selectedIndex].util;

    return (
        <HeadlessTab.Group
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            as='div'
            className='border-white-10 bg-gunMetal/40 shadow-tab laptop:rounded-b-2xl laptop:border'
        >
            <div className='border-b border-white-10'>
                <HeadlessTab.List
                    className={clsx(
                        'flex h-11 w-full laptop:h-[60px]',
                        tabGroupClassName
                    )}
                >
                    {tabDataArray.map((tabData, index) => {
                        return (
                            <HeadlessTab
                                key={tabData.text}
                                className='h-full w-full flex-1 focus:outline-none tablet:w-fit'
                                disabled={tabData.disabled}
                                data-testid={tabData.text}
                            >
                                <Tab
                                    text={tabData.text}
                                    active={selectedIndex === index}
                                    disabled={tabData.disabled}
                                />
                            </HeadlessTab>
                        );
                    })}
                </HeadlessTab.List>
                {util && <div className='col-span-1 h-full w-full'>{util}</div>}
            </div>
            <HeadlessTab.Panels className='min-h-[25vh] overflow-hidden bg-cardBackground laptop:rounded-b-2xl'>
                {arrayChildren[selectedIndex]}
            </HeadlessTab.Panels>
        </HeadlessTab.Group>
    );
};
