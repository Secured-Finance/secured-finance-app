import { useState } from 'react';
import { SimpleAdvancedSelector, ViewType } from 'src/components/atoms';
import { Alert, AlertSeverity } from 'src/components/molecules';
import { Page } from 'src/components/templates';
import { useBalances } from 'src/hooks';
import { useAccount } from 'wagmi';

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

    const { isConnected } = useAccount();
    const balance = useBalances();

    const isShowWelcomeAlert =
        Object.values(balance).every(v => v === 0) || !isConnected;

    return (
        <Page
            title={title}
            alertComponent={
                isShowWelcomeAlert && (
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
