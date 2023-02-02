import { useState } from 'react';
import { SimpleAdvancedSelector, ViewType } from 'src/components/atoms';
import { Page } from 'src/components/templates';

export const SimpleAdvancedView = ({
    title,
    simpleComponent,
    advanceComponent,
    onModeChange,
    pageName,
}: {
    title: string;
    simpleComponent: React.ReactNode;
    advanceComponent: React.ReactNode;
    onModeChange?: (v: ViewType) => void;
    pageName?: string;
}) => {
    const [view, setView] = useState<ViewType>('Simple');

    const component = view === 'Simple' ? simpleComponent : advanceComponent;

    return (
        <Page
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
            name={pageName}
        >
            {component}
        </Page>
    );
};
