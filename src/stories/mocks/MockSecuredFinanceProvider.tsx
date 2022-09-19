import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { Context } from 'src/contexts/SecuredFinanceProvider';
import { mockUseSF } from './useSFMock';

const securedFinance = mockUseSF() as unknown as SecuredFinanceClient;
export const MockSecuredFinanceProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};
