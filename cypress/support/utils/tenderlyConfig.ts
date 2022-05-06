import { TenderlyFork } from './tenderlyFork';

export const tenderlyConfig = () => {
    const tenderlyFork = new TenderlyFork(3, Cypress.env('TENDERLY_FORK_ID'));

    before(() => {
        cy.then(async () => {
            await tenderlyFork.init();
        });
    });

    after(() => {
        cy.then(async () => {
            await tenderlyFork.deleteFork();
        });
    });

    const onBeforeLoad = tenderlyFork.onBeforeLoad();

    return { onBeforeLoad };
};
