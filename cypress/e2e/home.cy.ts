describe('My First Test', () => {
    it('headings are set as expected', () => {
        cy.visit('/')
        cy.contains('h1.red', 'You did it!').should('be.visible')

        cy.contains('h3', 'Documentation').should('be.visible')
        cy.contains('h3', 'Tooling').should('be.visible')
        cy.contains('h3', 'Ecosystem').should('be.visible')
        cy.contains('h3', 'Community').should('be.visible')
        cy.contains('h3', 'Support Vue').should('be.visible')
    })
})