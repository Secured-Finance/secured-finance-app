import React from 'react';

interface ArrowSVGProps {
    width: string;
    height: string;
    rotate?: number;
    fill?: string;
    stroke?: string;
}

export const ArrowSVG: React.FC<ArrowSVGProps> = ({
    width,
    height,
    rotate,
    fill,
    stroke,
}) => {
    return (
        <svg
            width={width}
            height={height}
            style={{ display: 'block', transform: 'rotateX(' + rotate + 'deg' }}
            viewBox='0 0 11 7'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M5.87492 5.625C5.76825 5.625 5.66158 5.58417 5.58033 5.50292L1.41367 1.33625C1.2945 1.21708 1.25867 1.03792 1.32325 0.882083C1.38742 0.72625 1.53992 0.625 1.70825 0.625H10.0416C10.2099 0.625 10.3624 0.72625 10.4266 0.882083C10.4912 1.03792 10.4553 1.21708 10.3362 1.33625L6.1695 5.50292C6.08825 5.58417 5.98158 5.625 5.87492 5.625Z'
                fill={fill}
                stroke={stroke}
            />
        </svg>
    );
};
