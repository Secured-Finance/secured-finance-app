import { DEFAULT_TEST_ACCOUNT, TenderlyFork } from './tenderlyFork';

export const tenderlyConfig = () => {
    const tenderlyFork = new TenderlyFork(4, Cypress.env('TENDERLY_FORK_ID'));

    before(() => {
        cy.then(async () => {
            await tenderlyFork.init();
            await tenderlyFork.addBalanceRpc(DEFAULT_TEST_ACCOUNT.address);
        });
    });

    after(() => {
        cy.then(async () => {
            await tenderlyFork.deleteFork();
        });
    });

    beforeEach(() => {
        cy.connectWallet(tenderlyFork.onBeforeLoad()).then(() => {
            cy.window().its('ethereum').should('exist');
        });
    });

    afterEach(() => {
        cy.disconnectWallet();
    });

    const onBeforeLoad = tenderlyFork.onBeforeLoad();

    return { onBeforeLoad };
};
