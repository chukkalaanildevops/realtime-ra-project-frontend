describe('JWT Authentication', () => {
  beforeEach(() => {
    cy.task('db:seed');
  });

  afterEach(() => {
    cy.task('db:seed');
  });

  it('Should login and logout using JWT authentication', () => {
    const url = Cypress.env('url');
    const tenant = Cypress.env('tenant');
    const server = Cypress.env('server');

    cy.fixture('auth.json').then(auth => {
      const username = auth[server][tenant][0].username;
      const password = auth[server][tenant][0].password;
      cy.visit(`${url}/sign-in-tenant/`);

      cy.get('[data-cy=enterOrganisationHeader]').should(
        'contain.text',
        'Sign In',
      );

      cy.get('[data-cy=organisationIDLabel]').should(
        'contain.text',
        'Organisation ID',
      );

      cy.get('[data-cy=enterOrganisationInput]')
        .as('organisationInput')
        .type(tenant);

      cy.get('[data-cy=selectOrganisationContinueButton]')
        .as('signInTenantContinueButton')
        .should('contain.text', 'Continue')
        .trigger('click');

      // cy.get('[data-cy=usernameFormItem] > .ant-form-item-label > label')
      //   .as('usernameLabel')
      //   .should('contain.text', 'Username');
      cy.url().should('include', '/login');

      cy.get('[data-cy=usernameInput]')
        .as('usernameInput')
        .type(username);

      cy.get('[data-cy=passwordFormItem] > .ant-form-item-label > label')
        .as('passwordLabel')
        .should('contain.text', 'Password');

      cy.get('[data-cy=passwordInput]')
        .as('passwordInput')
        .type(password);

      cy.get('[data-cy=loginButton]')
        .as('loginSubmitButton')
        .should('contain.text', 'Continue')
        .trigger('click');

      cy.url().should('include', '/dashboard');

      cy.log('User logged in');

      cy.get('.image')
        .as('reimburseLogo')
        .trigger('click');

      cy.get('[data-cy=userProfileNameOnMenuBar]')
        .as('userProfileNameOnMenuBar')
        .trigger('click');

      cy.get('[data-cy=logoutButton]')
        .as('logoutButton')
        .trigger('click');

      // cy.url().should('include', '/sign-in-tenant');
      cy.url().should('include', '/login');

      cy.log('User logged out');
    });
  });

  it('Should switch organisation', () => {
    const url = Cypress.env('url');

    cy.visit(`${url}/sign-in-tenant/`);

    cy.get('[data-cy=enterOrganisationInput]')
      .as('organisationInput')
      .type('mobile');

    cy.get('[data-cy=selectOrganisationContinueButton]')
      .as('signInTenantContinueButton')
      .should('contain.text', 'Continue')
      .trigger('click');

    cy.get('[data-cy=switchTenantButton]')
      .as('switchTenantButton')
      .trigger('click');

    cy.log('Organisation switched.');

    cy.get('[data-cy=enterOrganisationInput]')
      .as('organisationInput')
      .type('tesla');

    cy.get('[data-cy=selectOrganisationContinueButton]')
      .as('signInTenantContinueButton')
      .should('contain.text', 'Continue')
      .trigger('click');

    cy.url().should('include', '/login');
  });
});
