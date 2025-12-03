const deleteTheReceipt = id => {
  cy.get('.receipt-structure > .top-bar > .left-side').should(
    'contain.text',
    id,
  );

  cy.get('.receipt-structure > .top-bar > .right-side > .ant-btn').trigger(
    'click',
  );
  cy.get('.footer > :nth-child(2').trigger('click');
  cy.log('receipt deleted successfully');
};

const updateTheReceipt = id => {
  cy.get('.receipt-structure > .top-bar > .left-side').should(
    'contain.text',
    id,
  );

  cy.get(
    '.receipt-form.hidden > .receipt-inner-container > .collabsable-header > .outer-btn > button',
  ).should('be.disabled');
  cy.get(
    '.receipt-form.hidden > .receipt-inner-container > .collabsable-header > .accordian-icon',
  ).trigger('click');
  cy.get('#receipt_number')
    .clear()
    .then(() => {
      cy.get('#receipt_number').type(101);
    });

  cy.get(
    '.receipt-form > .receipt-form-tag > .ant-row > :nth-child(4) > div > div > div > div > div > div > button',
  )
    .should('contain.text', 'Update')
    .trigger('click');
  // cy.get('.footer > :nth-child(2').trigger('click');s
  cy.log('receipt updated successfully');
};

const uploadNewReceiptAndDeleteOrUpdate = (url, functionName) => {
  cy.visit(`${url}/receipt`);

  const fileName = 'test.png';

  cy.fixture(fileName).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent,
      fileName,
      mimeType: 'image/png',
    });
  });

  // cy.wait(5000);

  cy.get('#currency')
    .as('getCurrencyInputField')
    .type('SGD - Singapore{enter}', {
      force: true,
    });

  cy.get('#receipt_number').type('12345');

  cy.get('button[type="submit"]')
    .should('contain', 'Save')
    .trigger('click');

  cy.log('file successfully uploaded');

  cy.url('include', '/receipt');

  cy.visit(`${url}/drafts/receipt`);

  cy.get(
    '.ant-tabs-nav-wrap > .ant-tabs-nav-scroll > .ant-tabs-nav > div > :nth-child(4) > .customized-tab-name > div > :nth-child(1)',
  ).should('contain.text', 'Receipts');

  cy.get(
    '.ant-tabs-nav-wrap > .ant-tabs-nav-scroll > .ant-tabs-nav > div > :nth-child(4) > .customized-tab-name > div > :nth-child(3)',
  ).should('contain.text', '1');

  functionName === 'deleteTheReceipt'
    ? deleteTheReceipt('12345')
    : updateTheReceipt('12345');
};

describe('add New Receipt', () => {
  beforeEach(() => {
    cy.task('db:seed');
  });

  afterEach(() => {
    cy.task('db:seed');
  });

  it.skip('Upload receipt And Delete It', () => {
    const url = Cypress.env('url');

    cy.loginUsing('elon@gmail.com', 'elon');
    uploadNewReceiptAndDeleteOrUpdate(url, 'deleteTheReceipt');
    cy.logout();
  });

  it('Upload receipt And Update It', () => {
    const url = Cypress.env('url');

    cy.loginUsing('elon@gmail.com', 'elon');
    uploadNewReceiptAndDeleteOrUpdate(url, 'updateTheReceipt');
    // cy.logout();
  });
});
