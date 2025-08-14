import clsx from 'clsx';

export const HighlightChip = ({
    text,
    size = 'large',
}: {
    text: string;
    size?: 'small' | 'large';
}) => (
    <div
        className={clsx(
            'flex items-center justify-center rounded-3xl bg-starBlue ',
            {
                'typography-dropdown-selection-label h-5 w-10 font-semibold text-white':
                    size === 'large',
                'typography-caption-3 h-4 w-8 text-neutral-8': size === 'small',
            },
        )}
    >
        {text}
    </div>
);
