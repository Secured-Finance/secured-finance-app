import { useState } from 'react';
import { ViewType } from 'src/components/atoms';
import { Page } from 'src/components/templates';

export const SimpleAdvancedView = ({
    simpleComponent,
    advanceComponent,
    initialView = 'Advanced',
    // onModeChange,
    pageName,
}: {
    simpleComponent: React.ReactNode;
    advanceComponent: React.ReactNode;
    initialView?: ViewType;
    pageName?: string;
}) => {
    const [view] = useState<ViewType>(initialView);

    const component = view === 'Simple' ? simpleComponent : advanceComponent;

    return <Page name={pageName}>{component}</Page>;
};
