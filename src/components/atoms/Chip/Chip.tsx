import cx from 'classnames';
import React from 'react';

function Chip({
    onClick,
    text,
    variant = 'primary',
}: {
    onClick: () => void;
    text: string;
    variant?: string;
}): JSX.Element {
    const className = cx(
        'cursor-pointer rounded-2xl border-0 px-3 py-1 text-sm font-bold text-blue',
        variant.toLowerCase() === 'secondary' ? 'bg-red' : 'bg-darkenedBg'
    );
    return (
        <button className={className} onClick={onClick}>
            {text}
        </button>
    );
}

export default Chip;
