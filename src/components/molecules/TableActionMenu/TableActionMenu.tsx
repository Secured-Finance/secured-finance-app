import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import MoreIcon from 'src/assets/icons/more.svg';
import { Separator } from 'src/components/atoms';

type MenuItem = { text: string; onClick: () => void; disabled?: boolean };

const MenuItem = ({ text, onClick, disabled = false }: MenuItem) => {
    return (
        <div
            className={classNames('flex w-full rounded-md py-3 px-3', {
                'cursor-pointer hover:bg-horizonBlue': !disabled,
            })}
        >
            <button
                aria-label='Menu Item'
                onClick={onClick}
                className={classNames(
                    'flex flex-row items-center justify-start'
                )}
                disabled={disabled}
            >
                <p className='typography-caption-2 capitalize text-neutral-8'>
                    {text}
                </p>
            </button>
        </div>
    );
};
export const TableActionMenu = ({ items }: { items: MenuItem[] }) => {
    return (
        <div>
            <Menu>
                <Menu.Button>
                    <MoreIcon className='text-starBlue' />
                </Menu.Button>
                <Menu.Items
                    as='div'
                    className='w-fit min-w-[150px] rounded-xl bg-gunMetal focus:outline-none'
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
