import * as jdenticon from 'jdenticon';
import React, { useEffect, useRef } from 'react';

interface IdenticonProps {
    value: string;
    size: number;
}

export const Identicon: React.FC<IdenticonProps> = ({ value, size }) => {
    const iconRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (iconRef.current) {
            jdenticon.update(iconRef.current, value);
        }
    }, [value]);

    return <svg ref={iconRef} width={size} height={size} />;
};
