import { Switch } from '@headlessui/react';
import classNames from 'classnames';

export const Toggle = ({
    checked = true,
    disabled = false,
    onChange,
}: {
    checked?: boolean;
    disabled?: boolean;
    onChange: (v: boolean) => void;
}) => {
    return (
        <Switch
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className={classNames(
                'relative inline-flex h-18px w-8 items-center rounded-[14px]',
                {
                    'bg-starBlue': checked,
                    'bg-neutral-300': !checked,
                    'disabled:opacity-50': disabled,
                }
            )}
        >
            <span
                className={`transform transition duration-200 ease-in-out ${
                    checked ? 'translate-x-4' : 'translate-x-[2px]'
                } inline-block h-14px w-14px rounded-full bg-neutral-50`}
            />
        </Switch>
    );
};
