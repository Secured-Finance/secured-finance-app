import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import { useState } from 'react';

export const Toggle = ({ disabled = false }: { disabled?: boolean }) => {
    const [enabled, setEnabled] = useState(true);

    return (
        <Switch
            checked={enabled}
            onChange={disabled ? () => {} : setEnabled}
            className={classNames(
                'relative inline-flex h-6 w-11 items-center rounded-full',
                {
                    'bg-gradient-to-r from-[#246CF9]/60 to-[#2334D2]/60':
                        enabled,
                    'bg-horizonBlue/30': !enabled,
                }
            )}
        >
            <span
                className={`transform transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 rounded-full bg-white`}
            />
        </Switch>
    );
};
