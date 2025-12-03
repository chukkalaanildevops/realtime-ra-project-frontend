const createDraftedExpense = () => {
  // cy.wait(2000);

  cy.get('#addNewExpenseForm_expense_type_legal_entity')
    .as('expenseTypeDropdown')
    .type('TESLA-BOR-Minimal Expenses{enter}', {
      force: true,
    });

  cy.get(
    '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.add-expense-form-container.general > div > div > div:nth-child(1) > button',
  )
    .as('saveAsDraftButton')
    .should('contain.text', 'Save as Draft')
    .and('not.be.disabled');

  cy.get(
    '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-8.ant-col-xxl-8 > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > div > input',
  )
    .as('receiptDateInput')
    .type(`${Cypress.moment().format('DD/MM/YYYY')}{enter}`, {
      force: true,
    });

  cy.get('@saveAsDraftButton').trigger('click');
};

describe('Minimal Expenses - (TESLA-BOR-Minimal Expenses)', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.login();
  });

  afterEach(() => {
    cy.task('db:seed');
    cy.logout();
  });

  it('Should submit and delete SINGLE drafted expense', () => {
    const url = Cypress.env('url');

    cy.visit(`${url}/add-expense-claim/general/`);

    // cy.wait(2000);

    cy.get('#addNewExpenseForm_expense_type_legal_entity')
      .as('expenseTypeDropdown')
      .type('TESLA-BOR-Minimal Expenses{enter}', {
        force: true,
      });

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-16.ant-col-xxl-16 > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('expenseTypeLabel')
      .should('contain.text', 'Expense Type');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-8.ant-col-xxl-8 > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('receiptDateLabel')
      .should('contain.text', 'Receipt Date');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(1) > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('expenseCurrencyLabel')
      .should('contain.text', 'Expense Currency');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(2) > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('expenseAmountLabel')
      .should('contain.text', 'Expense Amount');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(3) > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('taxAmountLabel')
      .should('contain.text', 'Tax Amount');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(4) > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('amountBeforeTaxesLabel')
      .should('contain.text', 'Amount Before Taxes');

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.add-expense-form-container.general > div > div > div:nth-child(1) > button',
    )
      .as('saveAsDraftButton')
      .should('contain.text', 'Save as Draft')
      .and('not.be.disabled');

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.add-expense-form-container.general > div > div > div:nth-child(2) > button',
    )
      .as('sendForApprovalButton')
      .should('contain.text', 'Send for Approval')
      .and('not.be.disabled');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-8.ant-col-xxl-8 > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > div > input',
    )
      .as('receiptDateInput')
      .type(`${Cypress.moment().format('DD/MM/YYYY')}{enter}`, {
        force: true,
      });

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(1) > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div',
    )
      .as('currencyDropdown')
      .should('have.class', 'ant-select-disabled');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(3) > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > span.prefix-value',
    )
      .as('taxAmountCurrency')
      .should('contain.text', 'SGD');

    cy.get('#addNewExpenseForm_tax_amount')
      .as('taxAmountInput')
      .should('be.disabled')
      .and('have.value', '0.00');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(4) > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > span.prefix-value',
    )
      .as('amountBeforeTaxesCurrency')
      .should('contain.text', 'SGD');

    cy.get('#addNewExpenseForm_amount_before_taxes')
      .as('amountBeforeTaxesInput')
      .should('be.disabled')
      .and('have.value', '15.00');

    cy.get('@saveAsDraftButton').trigger('click');

    cy.log('Expense drafted successfully');

    cy.get('.footer > .ant-btn-primary')
      .as('addMoreDialogNOButton')
      .trigger('click');

    cy.get(':nth-child(1) > .card-inner > .heading > .anticon > svg')
      .as('expenseCardOptionEllipsis')
      .trigger('click');

    cy.get('.ant-dropdown-menu > :nth-child(2) > .ant-btn')
      .as('expenseCardOptionsDeleteButton')
      .trigger('click');

    cy.get('.footer > .ant-btn-primary')
      .as('confirmDeleteButton')
      .trigger('click');

    cy.log('Expense deleted successfully');
  });

  it('Should submit and delete MULTIPLE drafted expenses', () => {
    const url = Cypress.env('url');

    cy.visit(`${url}/add-expense-claim/general/`);

    createDraftedExpense();

    cy.get('.ant-btn-default')
      .as('addMoreDialogYESButton')
      .trigger('click');

    cy.log('First Expense drafted successfully');

    createDraftedExpense();

    cy.log('Second Expense drafted successfully');

    cy.get('.footer > .ant-btn-primary')
      .as('addMoreDialogNOButton')
      .trigger('click');

    for (let index = 0; index < 2; index++) {
      // cy.wait(2000);

      cy.get(':nth-child(1) > .card-inner > .heading > .anticon > svg')
        .as('expenseCardOptionEllipsis')
        .trigger('click');

      cy.get('.ant-dropdown-menu > :nth-child(2) > .ant-btn')
        .as('expenseCardOptionsDeleteButton')
        .trigger('click');

      cy.get('.footer > .ant-btn-primary')
        .as('confirmDeleteButton')
        .trigger('click');

      cy.log(`Expense ${index + 1} deleted successfully`);
    }
  });

  it('Should submit, send for approval, withdraw and delete SINGLE expense', () => {
    const url = Cypress.env('url');

    cy.visit(`${url}/add-expense-claim/general/`);

    // cy.wait(2000);

    cy.get('#addNewExpenseForm_expense_type_legal_entity')
      .as('expenseTypeDropdown')
      .type('TESLA-BOR-Minimal Expenses{enter}', {
        force: true,
      });

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-16.ant-col-xxl-16 > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('expenseTypeLabel')
      .should('contain.text', 'Expense Type');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-8.ant-col-xxl-8 > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('receiptDateLabel')
      .should('contain.text', 'Receipt Date');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(1) > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('expenseCurrencyLabel')
      .should('contain.text', 'Expense Currency');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(2) > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('expenseAmountLabel')
      .should('contain.text', 'Expense Amount');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(3) > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('taxAmountLabel')
      .should('contain.text', 'Tax Amount');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(4) > div > div.ant-col.ant-col-24.ant-form-item-label > label > span',
    )
      .as('amountBeforeTaxesLabel')
      .should('contain.text', 'Amount Before Taxes');

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.add-expense-form-container.general > div > div > div:nth-child(1) > button',
    )
      .as('saveAsDraftButton')
      .should('contain.text', 'Save as Draft')
      .and('not.be.disabled');

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.add-expense-form-container.general > div > div > div:nth-child(2) > button',
    )
      .as('sendForApprovalButton')
      .should('contain.text', 'Send for Approval')
      .and('not.be.disabled');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-8.ant-col-xxl-8 > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > div > input',
    )
      .as('receiptDateInput')
      .type(`${Cypress.moment().format('DD/MM/YYYY')}{enter}`, {
        force: true,
      });

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(1) > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div',
    )
      .as('currencyDropdown')
      .should('have.class', 'ant-select-disabled');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(3) > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > span.prefix-value',
    )
      .as('taxAmountCurrency')
      .should('contain.text', 'SGD');

    cy.get('#addNewExpenseForm_tax_amount')
      .as('taxAmountInput')
      .should('be.disabled')
      .and('have.value', '0.00');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(4) > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > span.prefix-value',
    )
      .as('amountBeforeTaxesCurrency')
      .should('contain.text', 'SGD');

    cy.get('#addNewExpenseForm_amount_before_taxes')
      .as('amountBeforeTaxesInput')
      .should('be.disabled')
      .and('have.value', '15.00');

    cy.get('@sendForApprovalButton').trigger('click');

    cy.get('.footer > .ant-btn-primary')
      .as('addMoreDialogNOButton')
      .trigger('click');

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.draft-expense-container > div.card-parent-container > div > div > div > div:nth-child(2) > div.status-tag > button',
    )
      .as('approvedStatusTag')
      .trigger('click');

    cy.get(
      '#root > div > div > div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > div.ant-modal-body > div > div > div > div.ant-collapse-content.ant-collapse-content-active > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(2)',
    )
      .as('firstRowRoleCell')
      .should('contain.text', 'Auto-Approval');

    cy.get(
      '#root > div > div > div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > button > span',
    )
      .as('closeWorkflowModalButton')
      .trigger('click');

    cy.get(':nth-child(1) > .card-inner > .heading > .anticon > svg')
      .as('expenseCardOptionEllipsis')
      .trigger('click');

    cy.get('.ant-dropdown-menu > :nth-child(1) > .ant-btn')
      .as('expenseCardOptionsWithdrawButton')
      .trigger('click');

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > div > div:nth-child(3) > div > input',
    )
      .as('withdrawReasonInput')
      .type('Some reason to withdraw this expense');

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > div > button.ant-btn.ant-btn-primary',
    )
      .as('withdrawButton')
      .trigger('click');
  });

  it('Should display the instruction text', () => {
    const url = Cypress.env('url');

    cy.visit(`${url}/add-expense-claim/general/`);

    // cy.wait(2000);

    cy.get('#addNewExpenseForm_expense_type_legal_entity')
      .as('expenseTypeDropdown')
      .type('TESLA-BOR-Minimal Expenses{enter}', {
        force: true,
      });

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.ant-row-end.ant-row-middle.filter-bar-container > div > span',
    )
      .as('instructionTextBulbButton')
      .trigger('click');

    cy.get(
      '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.ant-row-top.tips-container > div.ant-col.tips > div > span > p',
    )
      .as('instructionTextParaTag')
      .should(
        'contain.text',
        'This is the instruction text for TESLA-BOR-Minimal Expenses',
      );
  });

  it('Should display error if expense amount is less than 15', () => {
    const url = Cypress.env('url');

    cy.visit(`${url}/add-expense-claim/general/`);

    // cy.wait(2000);

    cy.get('#addNewExpenseForm_expense_type_legal_entity')
      .as('expenseTypeDropdown')
      .type('TESLA-BOR-Minimal Expenses{enter}', {
        force: true,
      });

    cy.get('#addNewExpenseForm_amount')
      .as('expenseAmountInput')
      .clear()
      .type('11{enter}');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(2) > div > div.ant-col.ant-col-24.ant-form-item-control > div.ant-form-item-explain > div',
    )
      .as('expenseAmountErrorContainer')
      .should('contain.text', 'Value should be greater than 15');
  });

  it('Should update amount before taxes when amount is updated', () => {
    const url = Cypress.env('url');

    cy.visit(`${url}/add-expense-claim/general/`);

    // cy.wait(2000);

    cy.get('#addNewExpenseForm_expense_type_legal_entity')
      .as('expenseTypeDropdown')
      .type('TESLA-BOR-Minimal Expenses{enter}', {
        force: true,
      });

    cy.get('#addNewExpenseForm_amount')
      .as('expenseAmountInput')
      .clear()
      .type('100{enter}');

    cy.get('#addNewExpenseForm_amount_before_taxes')
      .as('amountBeforeTaxesInput')
      .should('be.disabled')
      .and('have.value', '100.00');
  });

  it('Should display currency in expense currency dropdown', () => {
    const url = Cypress.env('url');

    cy.visit(`${url}/add-expense-claim/general/`);

    // cy.wait(2000);

    cy.get('#addNewExpenseForm_expense_type_legal_entity')
      .as('expenseTypeDropdown')
      .type('TESLA-BOR-Minimal Expenses{enter}', {
        force: true,
      });

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-24 > div > div:nth-child(1) > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > div > span.ant-select-selection-item',
    )
      .as('expenseCurrencyInput')
      .should('contain.text', 'Singapore Dollar');
  });
});
