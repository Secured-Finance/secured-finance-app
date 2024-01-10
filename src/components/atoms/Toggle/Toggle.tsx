import { Switch } from '@headlessui/react';
import classNames from 'classnames';

export const Toggle = ({
    enabled = true,
    onChange,
}: {
    enabled?: boolean;
    onChange: (v: boolean) => void;
}) => {
    return (
        <Switch
            checked={enabled}
            onChange={onChange}
            className={classNames(
                'relative inline-flex h-18px w-8 items-center rounded-[14px]',
                {
                    'bg-starBlue': enabled,
                    'bg-neutral-300': !enabled,
                }
            )}
        >
            <span
                className={`transform transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-4' : 'translate-x-[2px]'
                } inline-block h-14px w-14px rounded-full bg-neutral-50`}
            />
        </Switch>
    );
};
