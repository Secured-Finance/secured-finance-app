import { useState } from 'react';
import { SimpleAdvancedSelector, ViewType } from 'src/components/atoms';

export const SimpleAdvancedView = ({
    title,
    simpleComponent,
    advanceComponent,
    onModeChange,
    initialView = 'Simple',
}: {
    title: string;
    simpleComponent: React.ReactNode;
    advanceComponent: React.ReactNode;
    onModeChange?: (v: ViewType) => void;
    initialView?: ViewType;
}) => {
    const [view, setView] = useState<ViewType>(initialView);

    const component = view === 'Simple' ? simpleComponent : advanceComponent;

    return (
        <>
            <div className='flex h-16 justify-between border-b-[0.5px] border-panelStroke'>
                <span className='font-secondary text-lg font-light leading-7 text-white'>
                    {title}
                </span>
                <SimpleAdvancedSelector
                    handleClick={v => {
                        setView(v);
                        onModeChange?.(v);
                    }}
                    text={view as ViewType}
                />
            </div>
            {component}
        </>
    );
};
