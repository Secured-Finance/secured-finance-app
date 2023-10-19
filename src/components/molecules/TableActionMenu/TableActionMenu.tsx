import { Menu } from '@headlessui/react';
import EllipsisHorizontalIcon from '@heroicons/react/24/outline/EllipsisHorizontalIcon';
import classNames from 'classnames';
import { Separator } from 'src/components/atoms';

type MenuItem = { text: string; onClick: () => void; disabled?: boolean };

const MenuItem = ({ text, onClick, disabled = false }: MenuItem) => {
    return (
        <button
            className='flex w-full rounded-md px-3 py-3 hover:bg-horizonBlue focus:outline-none'
            aria-label='Menu Item'
            onClick={onClick}
            disabled={disabled}
        >
            <p
                className={classNames(
                    'typography-caption-2 text-center capitalize',
                    {
                        'text-neutral-8': !disabled,
                        'text-slateGray': disabled,
                    }
                )}
            >
                {text}
            </p>
        </button>
    );
};
export const TableActionMenu = ({ items }: { items: MenuItem[] }) => {
    return (
        <Menu className='relative' as='div'>
            <Menu.Button aria-label='More options'>
                <EllipsisHorizontalIcon className='ml-1 h-5 w-5 text-planetaryPurple' />
            </Menu.Button>
            <Menu.Items
                as='div'
                className='absolute right-[4vh] top-4 z-50 w-fit min-w-[150px] rounded-xl bg-gunMetal opacity-100 focus:outline-none tablet:right-0'
            >
                {items.map((item, index) => (
                    <Menu.Item key={index} as='div'>
                        <MenuItem
                            text={item.text}
                            onClick={item.onClick}
                            disabled={item.disabled}
                        />
                        {index !== items.length - 1 ? (
                            <div className='px-2'>
                                <Separator />
                            </div>
                        ) : null}
                    </Menu.Item>
                ))}
            </Menu.Items>
        </Menu>
    );
};
