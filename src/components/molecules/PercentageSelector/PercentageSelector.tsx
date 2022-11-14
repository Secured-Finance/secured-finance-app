import { useState } from 'react';
import { PercentageTab } from 'src/components/atoms';

interface PercentageSelectorProps {
    onClick: (percentage: number) => void;
}

const percentage = [25, 50, 75, 100];

export const PercentageSelector = ({ onClick }: PercentageSelectorProps) => {
    const [activeNumber, setActiveNumber] = useState(0);

    const handleClick = (percentage: number) => {
        setActiveNumber(percentage);
        onClick(percentage / 100.0);
    };

    return (
        <div className='flex h-10 flex-col items-center'>
            <div className='flex flex-row justify-around gap-4'>
                {percentage.map(percentage => {
                    return (
                        <PercentageTab
                            key={percentage}
                            percentage={percentage}
                            onClick={() => handleClick(percentage)}
                            active={percentage === activeNumber}
                        ></PercentageTab>
                    );
                })}
            </div>
        </div>
    );
};
