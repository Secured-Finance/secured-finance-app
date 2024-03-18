import { RadioGroup } from '@headlessui/react';
import { Tab, TabVariant } from 'src/components/atoms';

export const TabGroup = ({
    options,
    selectedOption,
    handleClick,
}: {
    options: {
        text: string;
        variant: TabVariant;
    }[];
    selectedOption: string;
    handleClick: (option: string) => void;
}) => {
    return (
        <RadioGroup
            value={selectedOption}
            onChange={handleClick}
            as='div'
            className='flex flex-row items-center'
        >
            {options.map((option, index) => (
                <RadioGroup.Option
                    key={`${option.text}-${index}`}
                    value={option.text}
                    className='h-full flex-1'
                    as='button'
                >
                    {({ checked }) => (
                        <Tab
                            text={option.text}
                            active={checked}
                            isFullHeight
                            variant={option.variant}
                        />
                    )}
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
};
