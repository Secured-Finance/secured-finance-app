import { Tab as HeadlessTab } from '@headlessui/react';
import classNames from 'classnames';
import { Children, useState } from 'react';

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
                'typography-caption-2 w-fit whitespace-nowrap rounded-3xl px-5 py-3',
                {
                    'bg-starBlue text-neutral-8': selected,
                    'bg-black-20 text-[#CBD5E1]': !selected,
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
    onTabChange,
}: {
    tabTitles: string[];
    children?: React.ReactNode;
    onTabChange?: (v: number) => void;
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
            className='flex h-full flex-col overflow-hidden rounded-xl border-white-10 bg-gunMetal/40 shadow-tab laptop:rounded-none laptop:rounded-b-2xl laptop:border'
        >
            <HeadlessTab.List className='justify-start border-white-10 p-3 laptop:h-16 laptop:border-b'>
                <div className='flex gap-3'>
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
            <HeadlessTab.Panels className='h-full min-h-[25vh] bg-cardBackground pb-2 laptop:rounded-b-2xl'>
                {arrayChildren[selectedIndex]}
            </HeadlessTab.Panels>
        </HeadlessTab.Group>
    );
};
