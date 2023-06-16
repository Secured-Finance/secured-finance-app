import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import MoreIcon from 'src/assets/icons/more.svg';
import { Separator } from 'src/components/atoms';

type MenuItem = { text: string; onClick: () => void; disabled?: boolean };

const MenuItem = ({ text, onClick, disabled = false }: MenuItem) => {
    return (
        <div
            className={classNames('z-10 flex w-full rounded-md px-3 py-3', {
                'cursor-pointer hover:bg-horizonBlue': !disabled,
            })}
        >
            <button
                aria-label='Menu Item'
                onClick={onClick}
                disabled={disabled}
            >
                <p className='typography-caption-2 text-center capitalize text-neutral-8'>
                    {text}
                </p>
            </button>
        </div>
    );
};
export const TableActionMenu = ({ items }: { items: MenuItem[] }) => {
    return (
        <div className='relative'>
            <Menu>
                <Menu.Button as='button' aria-label='More options'>
                    <MoreIcon className='text-starBlue' />
                </Menu.Button>
                <Menu.Items
                    as='div'
                    className='absolute right-[4vh] top-8 z-50 w-fit min-w-[150px] rounded-xl bg-gunMetal/100 focus:outline-none tablet:right-0'
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
        </div>
    );
};
