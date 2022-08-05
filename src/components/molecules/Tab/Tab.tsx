import { Tab as HeadlessTab } from '@headlessui/react';
import { NavTab } from 'src/components/atoms';

export const Tab = ({ children }: { children: JSX.Element }) => {
    return (
        <div className='h-[470px] w-[746px] rounded-br-2xl rounded-bl-2xl border border-white-10 bg-[rgba(41,45,63,0.6)] shadow-tab'>
            <HeadlessTab.Group>
                <HeadlessTab.List className='flex h-[60px] border-b border-white-10'>
                    <HeadlessTab className='h-full focus:outline-none'>
                        {({ selected }) => (
                            <NavTab
                                text='Collateral Management'
                                active={selected}
                            ></NavTab>
                        )}
                    </HeadlessTab>
                    <HeadlessTab
                        className='h-full focus:outline-none'
                        disabled={true}
                    >
                        {({ selected }) => (
                            <NavTab
                                text='Scenario Analysis'
                                active={selected}
                            ></NavTab>
                        )}
                    </HeadlessTab>
                </HeadlessTab.List>
                <HeadlessTab.Panels className='h-full'>
                    {children}
                    {/* <HeadlessTab.Panel>Content 2</HeadlessTab.Panel> */}
                </HeadlessTab.Panels>
            </HeadlessTab.Group>
        </div>
    );
};
