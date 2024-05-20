import { useState } from 'react';
import { SimpleAdvancedSelector, ViewType } from 'src/components/atoms';
import { Page } from 'src/components/templates';

export const SimpleAdvancedView = ({
    title,
    simpleComponent,
    advanceComponent,
    initialView = 'Advanced',
    onModeChange,
    pageName,
}: {
    title: string;
    simpleComponent: React.ReactNode;
    advanceComponent: React.ReactNode;
    initialView?: ViewType;
    onModeChange?: (v: ViewType) => void;
    pageName?: string;
}) => {
    const [view, setView] = useState<ViewType>(initialView);

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
                    text={view}
                />
            }
            name={pageName}
        >
            {component}
        </Page>
    );
};
