import { useState } from 'react';
import { SimpleAdvancedSelector, ViewType } from 'src/components/atoms';
import { TitlePage } from 'src/components/templates';

export const SimpleAdvancedView = ({
    title,
    simpleComponent,
    advanceComponent,
    onModeChange,
}: {
    title: string;
    simpleComponent: React.ReactNode;
    advanceComponent: React.ReactNode;
    onModeChange?: (v: ViewType) => void;
}) => {
    const [view, setView] = useState<ViewType>('Simple');

    const component = view === 'Simple' ? simpleComponent : advanceComponent;

    return (
        <TitlePage
            title={title}
            titleComponent={
                <SimpleAdvancedSelector
                    handleClick={v => {
                        setView(v);
                        onModeChange?.(v);
                    }}
                    text={view as ViewType}
                />
            }
        >
            {component}
        </TitlePage>
    );
};
