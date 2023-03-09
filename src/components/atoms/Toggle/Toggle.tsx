import { Switch } from '@headlessui/react';
import { useState } from 'react';

export const Toggle = ({ disabled = false }: { disabled?: boolean }) => {
    const [enabled, setEnabled] = useState(true);

    return (
        <Switch
            checked={enabled}
            onChange={disabled ? () => {} : setEnabled}
            className={`${
                enabled ? 'bg-starBlue-60' : 'bg-starBlue'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
            <span
                className={`transform transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 rounded-full bg-white`}
            />
        </Switch>
    );
};
