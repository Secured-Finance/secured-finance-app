import { ViewType } from 'src/components/atoms';
import { Page } from 'src/components/templates';

export const SimpleAdvancedView = ({
    simpleComponent,
    advanceComponent,
    initialView,
    pageName,
}: {
    simpleComponent: React.ReactNode;
    advanceComponent: React.ReactNode;
    initialView: ViewType;
    pageName?: string;
}) => {
    const component =
        initialView === 'Simple' ? simpleComponent : advanceComponent;

    return <Page name={pageName}>{component}</Page>;
};
