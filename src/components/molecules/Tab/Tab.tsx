import { Tab as HeadlessTab } from '@headlessui/react';
import { Children, useState } from 'react';
import { NavTab } from 'src/components/atoms';

type TabData = {
    text: string;
    disabled?: boolean;
    highlight?: { text: string; size: 'small' | 'large' };
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
        <div className='h-full w-full rounded-b-2xl border border-white-10 bg-cardBackground/60 shadow-tab'>
            <HeadlessTab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
            >
                <div className='grid w-full grid-cols-1  border-b border-white-10 tablet:grid-cols-2'>
                    <HeadlessTab.List className='col-span-1 flex h-[60px] w-full'>
                        {tabDataArray.map(tabData => {
                            return (
                                <HeadlessTab
                                    key={tabData.text}
                                    className='h-full w-full focus:outline-none tablet:w-fit'
                                    disabled={tabData.disabled}
                                >
                                    {({ selected }) => (
                                        <NavTab
                                            text={tabData.text}
                                            active={selected}
                                            highlight={tabData.highlight}
                                        ></NavTab>
                                    )}
                                </HeadlessTab>
                            );
                        })}
                    </HeadlessTab.List>
                    {util && (
                        <div className='col-span-1 h-full w-full'>{util}</div>
                    )}
                </div>
                <HeadlessTab.Panels>
                    {arrayChildren[selectedIndex]}
                </HeadlessTab.Panels>
            </HeadlessTab.Group>
        </div>
    );
};
