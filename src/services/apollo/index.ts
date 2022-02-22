import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
export { LOAN_DEALS, BORROW_DEALS, LOAN_INFO } from './loanQueries';
export { COLLATERAL_BOOK } from './collateralQueries';
export {
    LENDING_BORROW_ORDERBOOK,
    LENDING_LEND_ORDERBOOK,
    LENDING_MARKET_INFO,
    LENDING_TRADING_HISTORY,
} from './lendingMarketQueries';

export const client = new ApolloClient({
    link: new HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/bahadylbekov/secured-finance-ropsten',
    }),
    cache: new InMemoryCache(),
});
