import { Tab as HeadlessTab } from '@headlessui/react';
import { Children, useState } from 'react';
import { NavTab } from 'src/components/atoms';

type TabData = {
    text: string;
    disabled?: boolean;
};

interface TabProps {
    tabDataArray: TabData[];
}

export const Tab: React.FC<TabProps> = ({ tabDataArray, children }) => {
    const arrayChildren = Children.toArray(children);
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div className='h-full w-full overflow-hidden rounded-br-2xl rounded-bl-2xl border border-white-10 bg-cardBackground/60 shadow-tab'>
            <HeadlessTab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
            >
                <HeadlessTab.List className='flex h-[60px] border-b border-white-10'>
                    {tabDataArray.map(tabData => {
                        return (
                            <HeadlessTab
                                key={tabData.text}
                                className='h-full focus:outline-none'
                                disabled={tabData.disabled}
                            >
                                {({ selected }) => (
                                    <NavTab
                                        text={tabData.text}
                                        active={selected}
                                    ></NavTab>
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
