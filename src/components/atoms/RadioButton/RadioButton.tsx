import clsx from 'clsx';

interface ButtonSelectProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}

export function RadioButton({ options, value, onChange }: ButtonSelectProps) {
    return (
        <div className='flex gap-2'>
            {' '}
            {options.map(option => (
                <button
                    key={option.value}
                    className={clsx(
                        'typography-caption flex cursor-pointer items-center justify-center rounded-full px-4 py-1 text-sm transition-colors duration-300 ease-in-out',
                        'border border-transparent',
                        {
                            'border-starBlue bg-starBlue text-white':
                                value === option.value,
                            'text-white opacity-40 hover:opacity-80':
                                value !== option.value,
                        }
                    )}
                    onClick={() => onChange(option.value)}
                    data-testid={option.label}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
