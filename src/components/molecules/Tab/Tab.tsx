import { Tab as HeadlessTab } from '@headlessui/react';
import { Children, useState } from 'react';
import { NavTab } from 'src/components/atoms';

export type TabHighlight = {
    text: string;
    size: 'small' | 'large';
    visible: boolean;
};

export type TabData = {
    text: string;
    disabled?: boolean;
    highlight?: TabHighlight;
    util?: React.ReactNode;
};

interface TabProps {
    tabDataArray: TabData[];
}

export const Tab: React.FC<TabProps> = ({ tabDataArray, children }) => {
    const arrayChildren = Children.toArray(children);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const util = tabDataArray[selectedIndex].util;

    return (
        <HeadlessTab.Group
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            as='div'
            className='rounded-b-2xl border border-white-10 bg-gunMetal/40 shadow-tab'
        >
            <div className='grid w-full grid-cols-1 border-b border-white-10 tablet:grid-cols-2'>
                <HeadlessTab.List className='col-span-1 flex h-[60px] w-full'>
                    {tabDataArray.map((tabData, index) => {
                        return (
                            <HeadlessTab
                                key={tabData.text}
                                className='h-full w-full focus:outline-none tablet:w-fit'
                                disabled={tabData.disabled}
                                data-testid={tabData.text}
                            >
                                <NavTab
                                    text={tabData.text}
                                    active={selectedIndex === index}
                                    highlight={tabData.highlight}
                                ></NavTab>
                            </HeadlessTab>
                        );
                    })}
                </HeadlessTab.List>
                {util && <div className='col-span-1 h-full w-full'>{util}</div>}
            </div>
            <HeadlessTab.Panels className='min-h-[25vh] overflow-hidden rounded-b-2xl bg-cardBackground'>
                {arrayChildren[selectedIndex]}
            </HeadlessTab.Panels>
        </HeadlessTab.Group>
    );
};