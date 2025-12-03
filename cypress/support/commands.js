// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload';

Cypress.Commands.add('login', () => {
  const url = Cypress.env('url');
  const tenant = Cypress.env('tenant');
  const server = Cypress.env('server');

  cy.fixture('auth.json').then(auth => {
    const username = auth[server][tenant][0].username;
    const password = auth[server][tenant][0].password;
    cy.visit(`${url}/login/`);

    cy.get('[data-cy=enterOrganisationInput]')
      .as('organisationInput')
      .type(tenant);

    cy.get('[data-cy=selectOrganisationContinueButton]')
      .as('signInTenantContinueButton')
      .trigger('click');

    cy.get('[data-cy=usernameInput]')
      .as('usernameInput')
      .type(username);

    cy.get('[data-cy=passwordInput]')
      .as('passwordInput')
      .type(password);

    cy.get('[data-cy=loginButton]')
      .as('loginSubmitButton')
      .trigger('click');

    cy.url().should('include', '/dashboard');

    cy.log('User logged in');
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('.image')
    .as('reimburseLogo')
    .trigger('click');

  cy.get('[data-cy=userProfileNameOnMenuBar]')
    .as('userProfileNameOnMenuBar')
    .trigger('click');

  cy.get('[data-cy=logoutButton]')
    .as('logoutButton')
    .trigger('click');

  cy.url().should('include', '/login');

  cy.log('User logged out');
});

Cypress.Commands.add('loginUsing', (username, password) => {
  const url = Cypress.env('url');
  const tenant = Cypress.env('tenant');

  cy.visit(`${url}/login/`);

  cy.get('[data-cy=enterOrganisationInput]')
    .as('organisationInput')
    .type(tenant);

  cy.get('[data-cy=selectOrganisationContinueButton]')
    .as('signInTenantContinueButton')
    .trigger('click');

  cy.get('[data-cy=usernameInput]')
    .as('usernameInput')
    .type(username);

  cy.get('[data-cy=passwordInput]')
    .as('passwordInput')
    .type(password);

  cy.get('[data-cy=loginButton]')
    .as('loginSubmitButton')
    .trigger('click');

  cy.url().should('include', '/dashboard');

  cy.log('User logged in');
});
