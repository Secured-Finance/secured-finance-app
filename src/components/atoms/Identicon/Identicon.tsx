import * as jdenticon from 'jdenticon';
import { useEffect, useRef } from 'react';

interface IdenticonProps {
    value: string;
    size: number;
}

export const Identicon = ({ value, size }: IdenticonProps) => {
    const iconRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (iconRef.current) {
            jdenticon.update(iconRef.current, value);
        }
    }, [value]);

    return <svg ref={iconRef} width={size} height={size} />;
};
