import { Switch } from '@headlessui/react';
import { useState } from 'react';

export const Toggle = () => {
    const [enabled, setEnabled] = useState(false);

    return (
        <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
                enabled ? 'bg-primary-400' : 'bg-secondary-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
            <span className='sr-only text-gray'>Enable notifications</span>
            <span
                className={`transform transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 rounded-full bg-white`}
            />
        </Switch>
    );
};
