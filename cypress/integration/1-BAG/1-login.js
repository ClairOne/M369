/// <reference types="cypress" />

describe('The Login Page', () => {
  beforeEach(() => {
    // reset and seed
    // yeah, we don't do this with firestore
  })
  it('Logout', function () {
    cy.visit('/logout')
    cy.url({ timeout: 3000 }).should('eq', Cypress.config().baseUrl + '/login')
  })
  it('Login', function () {
    const { username, password } = { 'username': 'dave@clair.one', 'password': 'LetMeIn!!@' }
    cy.visit('/login')
    cy.get('input[name=login').type(username)
    cy.get('input[name=password]').type(password)
    cy.get('[id="loginButton"]').click()
    cy.url({ timeout: 3000 }).should('eq', Cypress.config().baseUrl + '/')
  })
})
