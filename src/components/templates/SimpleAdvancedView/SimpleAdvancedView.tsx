import { useState } from 'react';
import { useSelector } from 'react-redux';
import { SimpleAdvancedSelector, ViewType } from 'src/components/atoms';
import { Alert, AlertSeverity } from 'src/components/molecules';
import { Page } from 'src/components/templates';
import { useBalances } from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';

const WELCOME_MESSAGE =
    'Welcome to Secured Finance! Deposit funds to start trading.';

export const SimpleAdvancedView = ({
    title,
    simpleComponent,
    advanceComponent,
    initialView = 'Simple',
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

    const balanceRecord = useBalances();
    const { currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    return (
        <Page
            title={title}
            alertComponent={
                !balanceRecord[currency] && (
                    <Alert
                        title={WELCOME_MESSAGE}
                        severity={AlertSeverity.Basic}
                        isShowCloseButton={false}
                    />
                )
            }
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
