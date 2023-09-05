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
            'typography-caption-3 flex items-center justify-center rounded-3xl bg-starBlue text-neutral-8',
            {
                'h-5 w-10': size === 'large',
                'h-4 w-8': size === 'small',
            }
        )}
    >
        {text}
    </div>
);
