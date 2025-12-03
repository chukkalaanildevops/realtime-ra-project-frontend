const addNewExpenseAndSendForApproval = url => {
  cy.visit(`${url}/add-expense-claim/general/`);

  // cy.wait(2000);

  cy.get('#addNewExpenseForm_expense_type_legal_entity')
    .as('expenseTypeDropdown')
    .type('TESLA-BOR-Custom Expenses - Manager Approval{enter}', {
      force: true,
    });

  cy.get(
    '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-8.ant-col-xxl-8 > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > div > input',
  )
    .as('receiptDateInput')
    .type(`${Cypress.moment().format('DD/MM/YYYY')}{enter}`, {
      force: true,
    });

  cy.get(
    '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.add-expense-form-container.general > div > div > div:nth-child(2) > button',
  )
    .as('sendForApprovalButton')
    .should('contain.text', 'Send for Approval')
    .and('not.be.disabled');

  cy.get('@sendForApprovalButton').trigger('click');

  cy.get('.footer > .ant-btn-primary')
    .as('addMoreDialogNOButton')
    .trigger('click');
};

const addNewExpenseAndSaveAsDraft = url => {
  cy.visit(`${url}/add-expense-claim/general/`);

  // cy.wait(2000);

  cy.get('#addNewExpenseForm_expense_type_legal_entity')
    .as('expenseTypeDropdown')
    .type('TESLA-BOR-Custom Expenses - Manager Approval{enter}', {
      force: true,
    });

  cy.get(
    '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-8.ant-col-xxl-8 > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > div > input',
  )
    .as('receiptDateInput')
    .type(`${Cypress.moment().format('DD/MM/YYYY')}{enter}`, {
      force: true,
    });

  cy.get(
    '#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-row.add-expense-form-container.general > div > div > div:nth-child(1) > button',
  )
    .as('saveAsDraft')
    .should('contain.text', 'Save as Draft')
    .and('not.be.disabled');

  cy.get('@saveAsDraft').trigger('click');

  cy.get('.footer > .ant-btn-primary')
    .as('addMoreDialogNOButton')
    .trigger('click');

  cy.url('include', 'drafts/expense');

  cy.get(
    '#root > section > div.content > main > div.page-container > div > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.draft-expense-container > div.card-parent-container > div > div > div > div:nth-child(2) > div.status-tag > button > span',
  )
    .as('firstExpenseStatusSpan')
    .should('contain.text', 'Draft');
};

const withdrawAndDelete = (url, withdrawMsg) => {
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
    .type(`${withdrawMsg}{enter}`);

  cy.visit(`${url}/drafts/expense`);

  cy.get(':nth-child(1) > .card-inner > .heading > .anticon > svg')
    .as('expenseCardOptionEllipsis')
    .trigger('click');

  cy.get('.ant-dropdown-menu > :nth-child(2) > .ant-btn')
    .as('expenseCardOptionsDeleteButton')
    .trigger('click');

  cy.get('.footer > .ant-btn-primary')
    .as('confirmDeleteButton')
    .trigger('click');
};

const resubmit = () => {
  cy.get(':nth-child(1) > .card-inner > .heading > .anticon > svg')
    .as('expenseCardOptionEllipsis')
    .trigger('click');

  cy.get('.ant-dropdown-menu > :nth-child(1) > .ant-btn').as(
    'expenseCardOptionsEditButton',
  );

  cy.get('@expenseCardOptionsEditButton')
    .should('contain.text', 'Edit')
    .trigger('click');

  cy.get(
    '#root > .ant-layout > .content > .ant-layout-content > .page-container > .add-new-expense-container > .add-expense-form-container > .ant-col > .button-container > :nth-child(2) > button',
  )
    .should('contain.text', 'Send for Approval')
    .and('not.be.disabled')
    .trigger('click');

  cy.url('include', 'submitted/expense');

  // cy.wait(2000);

  cy.get(
    '#root > section > div.content > main > div.page-container > div > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.draft-expense-container > div.card-parent-container > div > div > div > div:nth-child(2) > div.status-tag > button',
  )
    .as('statusButton')
    .should('contain.text', 'Pending');
};

const approveOrRejectExpenseClaim = (url, status) => {
  cy.loginUsing('bill@gmail.com', 'bill');

  cy.visit(`${url}/approvals/expenses`);

  cy.get(
    `#root > section > div.content > main > div.page-container > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.ant-collapse.ant-collapse-borderless.ant-collapse-icon-position-left.groups > div > div.ant-collapse-header > div > div.extra > div:nth-child(3) > button.ant-btn.filled.${status}-item-button.ant-btn-circle.ant-btn-sm.ant-btn-icon-only`,
  )
    .as('firstLevelAccordianApprovalButton')
    .trigger('click');

  cy.get('.ant-modal-confirm-btns > .ant-btn-primary')
    .as('approvalConfirmationSaveResponseButton')
    .trigger('click');
};

const checkAfterApprovalofManager = (url, status) => {
  cy.loginUsing('elon@gmail.com', 'elon');

  cy.visit(`${url}/submitted/expense`);

  cy.get(
    '#root > section > div.content > main > div.page-container > div > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.draft-expense-container > div.card-parent-container > div > div > div > div:nth-child(2) > div.status-tag > button > span',
  )
    .as('firstExpenseStatusSpan')
    .should('contain.text', status);

  cy.get(
    '#root > section > div.content > main > div.page-container > div > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.draft-expense-container > div.card-parent-container > div > div > div > div:nth-child(2) > div.status-tag > button',
  )
    .as('statusButton')
    .trigger('click');

  cy.get(
    '#root > div > div > div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > div.ant-modal-body > div > div > div > div.ant-collapse-content.ant-collapse-content-active > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(1) > span',
  )
    .as('workflowModalFirstRowNameCell')
    .should('contain.text', 'Bill Gates');

  cy.get(
    '#root > div > div > div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > div.ant-modal-body > div > div > div > div.ant-collapse-content.ant-collapse-content-active > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(2)',
  )
    .as('workflowModelFirstRowRoleCell')
    .should('contain.text', 'Manager');

  cy.get(
    '#root > div > div > div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > div.ant-modal-body > div > div > div > div.ant-collapse-content.ant-collapse-content-active > div > div > div > div > div > div > div > table > tbody > tr > td:nth-child(5) > span > button > span',
  )
    .as('workflowModalFirstRowStatusCell')
    .should('contain.text', status);

  cy.get(
    '#root > div > div > div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > button > span > span',
  )
    .as('workflowModalCloseButton')
    .trigger('click');
};

describe('Expenses Manager Approvals (TESLA-BOR-Custom Expenses - Manager Approval)', () => {
  beforeEach(() => {
    cy.task('db:seed');
  });

  afterEach(() => {
    cy.task('db:seed');
  });

  it('Save as a draft and then approved by manager', () => {
    const url = Cypress.env('url');
    cy.loginUsing('elon@gmail.com', 'elon');

    addNewExpenseAndSaveAsDraft(url);

    cy.get(
      '.draft-expense-container  > .card-parent-container > .ant-row > :nth-child(1) > .card-inner > .heading > span > svg',
    ).trigger('click');

    cy.get(
      '.ant-dropdown.ant-dropdown-placement-bottomLeft > .ant-dropdown-menu > :nth-child(3) > button',
    )
      .should('contain.text', 'Send For Approval')
      .trigger('click');

    cy.url('include', 'drafts/expense');

    cy.get(
      '#root > .ant-layout > .content > .ant-layout-content > :nth-child(2) > .drafts-container > .empty-view-container > .textContainer > .noExpenseText',
    ).should('contain', 'You have no expenses or claims !');

    cy.logout();

    approveOrRejectExpenseClaim(url, 'approve');

    cy.logout();

    checkAfterApprovalofManager(url, 'Approved');

    withdrawAndDelete(url, 'Some reason to withdraw this approved expense');

    cy.logout();
  });

  it('Save as a draft and then delete the expense', () => {
    const url = Cypress.env('url');
    cy.loginUsing('elon@gmail.com', 'elon');

    addNewExpenseAndSaveAsDraft(url);

    cy.get(
      '.draft-expense-container  > .card-parent-container > .ant-row > :nth-child(1) > .card-inner > .heading > span > svg',
    ).trigger('click');

    cy.get(
      '.ant-dropdown.ant-dropdown-placement-bottomLeft > .ant-dropdown-menu > :nth-child(2) > button',
    )
      .should('contain.text', 'Delete')
      .trigger('click');

    cy.get(
      '.ant-modal-root > .ant-modal-centered > .confirmation-model > .ant-modal-content > .ant-modal-body > div.footer > :nth-child(2)',
    ).trigger('click');

    cy.url('include', 'drafts/expense');

    cy.get(
      '#root > .ant-layout > .content > .ant-layout-content > :nth-child(2) > .drafts-container > .empty-view-container > .textContainer > .noExpenseText',
    ).should('contain', 'You have no expenses or claims !');
  });

  it('Save as a draft and then copy the expense', () => {
    const url = Cypress.env('url');
    cy.loginUsing('elon@gmail.com', 'elon');

    addNewExpenseAndSaveAsDraft(url);

    cy.get(
      '.draft-expense-container  > .card-parent-container > .ant-row > :nth-child(1) > .card-inner > .heading > span > svg',
    ).trigger('click');

    cy.get(
      '.ant-dropdown.ant-dropdown-placement-bottomLeft > .ant-dropdown-menu > :nth-child(1) > button',
    )
      .should('contain.text', 'Clone')
      .trigger('click');

    cy.url('include', 'add-expense-claim');

    cy.get(
      '#addNewExpenseForm > div > div.ant-col.ant-col-xs-24.ant-col-sm-24.ant-col-md-12.ant-col-lg-12.ant-col-xl-8.ant-col-xxl-8 > div > div.ant-col.ant-col-24.ant-form-item-control > div > div > div > div > input',
    )
      .as('receiptDateInput')
      .type(`${Cypress.moment().format('DD/MM/YYYY')}{enter}`, {
        force: true,
      });

    cy.get('.add-expense-form-container > div > div > :nth-child(2) > button')
      .as('sendForApprovalButton')
      .should('contain.text', 'Send for Approval')
      .and('not.be.disabled');

    cy.get('@sendForApprovalButton').trigger('click');

    cy.get('.footer > .ant-btn-primary')
      .as('addMoreDialogNOButton')
      .trigger('click');
  });

  it('Manager should be able to approve an expense', () => {
    const url = Cypress.env('url');

    cy.loginUsing('elon@gmail.com', 'elon');

    addNewExpenseAndSendForApproval(url);

    cy.logout();

    approveOrRejectExpenseClaim(url, 'approve');

    cy.logout();

    checkAfterApprovalofManager(url, 'Approved');

    withdrawAndDelete(url, 'Some reason to withdraw this approved expense');

    cy.logout();
  });

  it('Manager should be able to reject an expense', () => {
    const url = Cypress.env('url');

    cy.loginUsing('elon@gmail.com', 'elon');

    addNewExpenseAndSendForApproval(url);

    cy.logout();

    approveOrRejectExpenseClaim(url, 'reject');

    cy.logout();

    checkAfterApprovalofManager(url, 'Rejected');

    resubmit(url);

    cy.logout();
  });
});
