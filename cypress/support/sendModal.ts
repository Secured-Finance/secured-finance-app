export const expectSendModal = {
    displayCurrency(currency: string) {
        cy.log(`Checking sendModal with the currency ${currency}`);
        cy.get('[data-cy="send-modal"]').should('be.visible');
        cy.get('[data-cy="balance-label"]').contains(currency);
        cy.get('[data-cy="currency-image-icon"]').should('exist');
        cy.get('[data-cy="currency-image-ccy"]').contains(currency);
        cy.get('[data-cy="send-button"]').should('be.disabled');
    },
};
