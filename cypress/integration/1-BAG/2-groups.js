/// <reference types="cypress" />

describe('Groups', () => {
  beforeEach(() => {
    // reset and seed
    // yeah, we don't do this with firestore
  })
  it('Group List', function () {
    cy.visit('/bag')
    cy.get('.bagGroup-list-item').should('have.length', 2)
    cy.get('.bagGroup-list-item').first().should('contain', 'M3 Elite')
    cy.get('.bagGroup-list-item').last().should('contain', 'Local Workshorse')
    cy.get('.v-avatar white').click()
  })
})
