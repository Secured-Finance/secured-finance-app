import classNames from 'classnames';

export const HighlightChip = ({
    text,
    size = 'large',
}: {
    text: string;
    size?: 'small' | 'large';
}) => (
    <div
        className={classNames(
            'flex items-center justify-center rounded-3xl bg-starBlue text-neutral-8',
            {
                'typography-dropdown-selection-label h-5 w-10 font-semibold':
                    size === 'large',
                'typography-caption-3 h-4 w-8': size === 'small',
            }
        )}
    >
        {text}
    </div>
);
