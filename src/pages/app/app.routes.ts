export const appPath = {
  root: {
    path: '/',
    linkTo: '/',
    title: 'Dashboard',
  },
  notFound: {
    path: '/404',
    linkTo: '/404',
    title: '404 Not Found',
  },
  unauthorized: {
    path: '/403',
    linkTo: '/403',
    title: '403 Forbidden',
  },
  redirect: {
    path: '/loginRedirect',
    linkTo: '/loginRedirect/',
    title: 'Redirect',
  },
  all: {
    path: '*',
    linkTo: '*',
  },
  home: {
    path: '/home/',
    linkTo: '/home/',
    title: 'Dashboard',
  },
  expenses: {
    path: '/:type/:id/history/',
    linkTo: '/:type/:id/history/',
  },
  // expenses: {
  //   path: '/:type(expenses|requests|expensesWithRequests)/:id/history/',
  //   linkTo: '/:type(expenses|requests|expensesWithRequests)/:id/history/',
  // },
  addNewExpense: {
    add: {
      path:
        '/add-expense-claim/:category(general|entertainment|mileage|petty|allowance)/',
      linkTo: '/add-expense-claim/',
      general: {
        path:
          '/add-expense-claim/:category(general|entertainment|mileage|petty|allowance)/',
        linkTo: '/add-expense-claim/general',
      },
      entertainment: {
        path:
          '/add-expense-claim/:category(general|entertainment|mileage|petty|allowance)/',
        linkTo: '/add-expense-claim/entertainment',
      },
      mileage: {
        path:
          '/add-expense-claim/:category(general|entertainment|mileage|petty|allowance)/',
        linkTo: '/add-expense-claim/mileage',
      },
      petty: {
        path:
          '/add-expense-claim/:category(general|entertainment|mileage|petty|allowance)/',
        linkTo: '/add-expense-claim/petty',
      },
      allowance: {
        path:
          '/add-expense-claim/:category(general|entertainment|mileage|petty|allowance)/',
        linkTo: '/add-expense-claim/allowance',
      },
    },
    redirectAdd: { path: '/add-expense-claim/', linkTo: '/add-expense-claim/' },
    update: {
      path: '/update-expense-claim/:id',
      linkTo: '/update-expense-claim/',
    },
  },
  receipt: {
    add: { path: '/receipt/', linkTo: '/receipt/' },
  },
  benefit: {
    add: {
      path: '/add-benefit-claim/:category',
      linkTo: '/add-benefit-claim/',
      benefit: {
        path: '/add-benefit-claim/:category',
        linkTo: '/add-benefit-claim/benefit',
      },
    },
    update: {
      path: '/update-benefit-claim/:id',
      linkTo: '/update-benefit-claim/',
    },
  },
  dashboard: {
    path: '/dashboard/',
    linkTo: '/dashboard/',
    title: 'Dashboard',
  },
  insights: {
    path: '/insights/',
    linkTo: '/insights/',
    title: 'insights',
  },

  drafts: {
    path: '/drafts/:tab(expense|request|benefit|receipt|expenses-with-request)',
    linkTo: '/drafts/',
    expense: {
      path:
        '/drafts/:tab(expense|request|benefit|receipt|expenses-with-request)',
      linkTo: '/drafts/expense',
    },
    request: {
      path:
        '/drafts/:tab(expense|request|benefit|receipt|expenses-with-request)',
      linkTo: '/drafts/request',
    },
    benefit: {
      path:
        '/drafts/:tab(expense|request|benefit|receipt|expenses-with-request)',
      linkTo: '/drafts/benefit',
    },
    receipt: {
      path:
        '/drafts/:tab(expense|request|benefit|receipt|expenses-with-request)',
      linkTo: '/drafts/receipt',
    },
    expensesWithRequest: {
      path:
        '/drafts/:tab(expense|request|benefit|receipt|expenses-with-request)',
      linkTo: '/drafts/expenses-with-request',
    },
  },
  submitted: {
    path: '/submitted/:tab',
    linkTo: '/submitted/',
    expenses: {
      path: '/submitted/request/:requestId',
      linkTo: '/submitted/request/',
      addNew: {
        path: '/submitted/request/:requestId/add-new-expense/',
        linkTo: '/submitted/request/:requestId/add-new-expense/',
      },
      update: {
        path: '/submitted/request/:requestId/update-expense/:id',
        linkTo: '/submitted/request/:requestId/update-expense/',
      },
    },
  },
  settings: {
    path: '/settings/',
    linkTo: '/settings/',

    configuration: {
      path: '/settings/configuration/:tab',
      linkTo: '/settings/configuration/',
      backLink: '/settings/',
    },
    sfIntegration: {
      path:
        '/settings/sf-integration/:tab(scheduling|stages|file-configuration|entity-setup|sf-logs)',
      linkTo: '/settings/sf-integration/',
      backLink: '/settings/',
      logs: {
        path:
          '/settings/sf-integration/stages/:id/logs/:fileType/:file/:successStatus/',
        linkTo:
          '/settings/sf-integration/stages/:id/logs/:fileType/:file/:successStatus/',
        backLink: '/settings/sf-integration',
      },
      stages: {
        path: '/settings/sf-integration/stages/:id',
        linkTo: '/settings/sf-integration/stages/',
        backLink: '/settings/sf-integration',
      },
      fileConfiguration: {
        path: '/settings/sf-integration/file-configuration/:id',
        linkTo: '/settings/sf-integration/file-configuration/',
        backLink: '/settings/sf-integration',
      },
    },
    systemLabelsCustomisation: {
      path: '/settings/system-labels-customisation/',
      linkTo: '/settings/system-labels-customisation/',
      backLink: '/settings/',
    },
    outbound: {
      path: '/settings/outbound/:tab(scheduling)',
      linkTo: '/settings/outbound/',
    },
    inbound: {
      path: '/settings/inbound/:tab(scheduling|stages)',
      linkTo: '/settings/inbound/',
      logs: {
        path: '/settings/inbound/stages/:id/logs/:file/:successStatus/',
        linkTo: '/settings/inbound/stages/:id/logs/:file/:successStatus/',
        backLink: '/settings/inbound/',
      },
      stages: {
        path: '/settings/inbound/stages/:id',
        linkTo: '/settings/inbound/stages/',
        backLink: '/settings/inbound/',
      },
    },
  },
  search: {
    path: '/search/',
    linkTo: '/search/',
    users: {
      path: '/search/users/',
      linkTo: '/search/users/',
    },
    expenses: {
      path: '/search/expenses/',
      linkTo: '/search/expenses/',
      details: {
        path: '/expenses/:expenseId/',
        linkTo: '/expenses/',
      },
    },
    requests: {
      path: '/search/requests/',
      linkTo: '/search/requests/',
      details: {
        path: '/requests/:requestId/',
        linkTo: '/requests/',
      },
    },
    benefits: {
      path: '/search/benefits/',
      linkTo: '/search/benefits/',
      details: {
        path: '/benefits/:benefitId/',
        linkTo: '/benefits/',
      },
    },
  },
  config_setup: {
    path: '/setup/',
    linkTo: '/setup/',
    expenseType: {
      path: '/setup/expense-types/', //expense type
      linkTo: '/setup/expense-types/',
      backLink: '/setup/',
      add: {
        path: '/setup/expense-types/add/',
        linkTo: '/setup/expense-types/add/',
        backLink: '/setup/expense-types/',
      },
      update: {
        path: '/setup/expense-types/update/:id',
        linkTo: '/setup/expense-types/update/',
        backLink: '/setup/expense-types/',
      },
      legalEntityListing: {
        path: '/setup/expense-types/:id',
        linkTo: '/setup/expense-types/',
        backLink: '/setup/expense-types/',
        customize: {
          path: '/setup/expense-types/customize/:id',
          linkTo: '/setup/expense-types/customize/',
          backLink: '/setup/expense-types/',
        },
      },
    },
    requestType: {
      path: '/setup/request-types/', //request type
      linkTo: '/setup/request-types/',
      backLink: '/setup/',
      add: {
        path: '/setup/request-types/add/',
        linkTo: '/setup/request-types/add/',
        backLink: '/setup/request-types/',
      },
      update: {
        path: '/setup/request-types/update/:id',
        linkTo: '/setup/request-types/update/',
        backLink: '/setup/request-types/',
      },
      legalEntityListing: {
        path: '/setup/request-types/:id',
        linkTo: '/setup/request-types/',
        backLink: '/setup/request-types/',
        // add: {
        //   path: '/setup/request-types/:id/custom-add/:id',
        //   linkTo: '/setup/request-types/:id/custom-add/',
        // },
        // update: {
        //   path: '/setup/request-types/:id/custom-update/:id',
        //   linkTo: '/setup/request-types/:id/custom-update/',
        // },
        customize: {
          path: '/setup/request-types/customize/:id',
          linkTo: '/setup/request-types/customize/',
          backLink: '/setup/request-types/:id',
        },
      },
    },
    benefitType: {
      path: '/setup/benefit-types/', //benefit type
      linkTo: '/setup/benefit-types/',
      backLink: '/setup/',
      add: {
        path: '/setup/benefit-types/add/',
        linkTo: '/setup/benefit-types/add/',
        backLink: '/setup/benefit-types/',
      },
      update: {
        path: '/setup/benefit-types/update/:id',
        linkTo: '/setup/benefit-types/update/',
        backLink: '/setup/benefit-types/',
      },
      legalEntityListing: {
        path: '/setup/benefit-types/:id',
        linkTo: '/setup/benefit-types/',
        backLink: '/setup/benefit-types/',
        // add: {
        //   path: '/setup/benefit-types/:id/custom-add/:id',
        //   linkTo: '/setup/benefit-types/:id/custom-add/',
        // },
        // update: {
        //   path: '/setup/benefit-types/:id/custom-update/:id',
        //   linkTo: '/setup/benefit-types/:id/custom-update/',
        // },
        customize: {
          path: '/setup/benefit-types/customize/:id',
          linkTo: '/setup/benefit-types/customize/',
          backLink: '/setup/benefit-types/:id',
        },
      },
    },
    roles: {
      path: '/setup/roles/',
      linkTo: '/setup/roles/',
      backLink: '/setup/',
      add: {
        path: '/setup/roles/add/',
        linkTo: '/setup/roles/add/',
        backLink: '/setup/roles/',
      },
      update: {
        path: '/setup/roles/update/:roleId(\\d+)',
        linkTo: '/setup/roles/update/',
        backLink: '/setup/roles/',
      },
    },
    employeeGroups: {
      path: '/setup/employee-groups/',
      linkTo: '/setup/employee-groups/',
      backLink: '/setup/',
      add: {
        path: '/setup/employee-groups/add/',
        linkTo: '/setup/employee-groups/add/',
        backLink: '/setup/employee-groups/',
      },
      update: {
        path: '/setup/employee-groups/update/:id',
        linkTo: '/setup/employee-groups/update/',
        backLink: '/setup/employee-groups/',
      },
    },

    allowanceRate: {
      path: '/setup/allowance-rate/',
      linkTo: '/setup/allowance-rate/',
      backLink: '/setup/',
    },
    benefitCategories: {
      path: '/setup/benefit-categories/',
      linkTo: '/setup/benefit-categories/',
      backLink: '/setup/',
    },
    currencyConversion: {
      path: '/setup/currency-conversion/',
      linkTo: '/setup/currency-conversion/',
      backLink: '/setup/',
    },
    claimInspector: {
      path: '/setup/claim-detection/',
      linkTo: '/setup/claim-detection/',
      backLink: '/setup/',
    },
    referenceObjects: {
      path: '/setup/reference-objects/',
      linkTo: '/setup/reference-objects/',
      backLink: '/setup/',
      add: {
        path: '/setup/reference-objects/add/',
        linkTo: '/setup/reference-objects/add/',
        backLink: '/setup/reference-objects/',
      },
      update: {
        path: '/setup/reference-objects/update/:id',
        linkTo: '/setup/reference-objects/update/',
        backLink: '/setup/reference-objects/',
      },
    },
    costCentre: {
      path: '/setup/cost-centres/',
      linkTo: '/setup/cost-centres/',
      backLink: '/setup/',
    },
    wageType: {
      path: '/setup/wage-type/',
      linkTo: '/setup/wage-type/',
      backLink: '/setup/',
    },
    glAccounts: {
      path: '/setup/gl-account/',
      linkTo: '/setup/gl-account/',
      backLink: '/setup/',
      add: {
        path: '/setup/gl-account/add/',
        linkTo: '/setup/gl-account/add/',
        backLink: '/setup/gl-account/',
      },
      update: {
        path: '/setup/gl-account/update/:id',
        linkTo: '/setup/gl-account/update/',
        backLink: '/setup/gl-account/',
      },
    },
    entityTypes: {
      path: '/setup/entity-types/:tab?',
      linkTo: '/setup/entity-types/',
      backLink: '/setup/',
      viewHierarchy: {
        path: '/setup/entity-types/view-hierarchy/:id',
        linkTo: '/setup/entity-types/view-hierarchy/',
      },
    },
    rules: {
      path: '/setup/rules/',
      linkTo: '/setup/rules/',
      backLink: '/setup/',
      add: {
        path: '/setup/rules/add/',
        linkTo: '/setup/rules/add/',
        backLink: '/setup/rules/',
      },
      update: {
        path: '/setup/rules/update/:id',
        linkTo: '/setup/rules/update/',
        backLink: '/setup/rules/',
      },
    },
    entitlementRules: {
      path: '/setup/entitlement-rules/',
      linkTo: '/setup/entitlement-rules/',
      backLink: '/setup/',
      add: {
        path: '/setup/entitlement-rules/add/',
        linkTo: '/setup/entitlement-rules/add/',
        backLink: '/setup/entitlement-rules/',
      },
      update: {
        path: '/setup/entitlement-rules/update/:id/',
        linkTo: '/setup/entitlement-rules/update/',
        backLink: '/setup/entitlement-rules/',
      },
      simulate: {
        path: '/setup/entitlement-rules/simulate/:id/',
        linkTo: '/setup/entitlement-rules/simulate/',
        backLink: '/setup/entitlement-rules/',
      },
    },
    riskScoreRange: {
      path: '/setup/risk-score/',
      linkTo: '/setup/risk-score/',
      backLink: '/setup/',
    },
    fileEncryption: {
      path: '/setup/file-encryption/:tab',
      linkTo: '/setup/file-encryption/',
      backLink: '/setup/',
      add: {
        path: '/setup/file-encryption/add/',
        linkTo: '/setup/file-encryption/add/',
      },
      update: {
        path: '/setup/file-encryption/update/:id',
        linkTo: '/setup/file-encryption/update',
      },
    },
    policyConfiguration: {
      path: '/setup/policy-configuration',
      linkTo: '/setup/policy-configuration',
      backLink: '/setup/',
      update: {
        path: '/setup/policy-configuration/update/:id',
        linkTo: '/setup/policy-configuration/update',
      },
    },
    // admin delegations
    adminDelegations: {
      path: '/setup/delegations/',
      linkTo: '/setup/delegations/',
      backLink: '/setup/',
      add: {
        path: '/setup/delegations/add/',
        linkTo: '/setup/delegations/add/',
        backLink: '/setup/delegations/',
      },
      update: {
        path: '/setup/delegations/update/:id',
        linkTo: '/setup/delegations/update/',
        backLink: '/setup/delegations/',
      },
    },

    emailTemplates: {
      path: '/setup/email-templates/',
      linkTo: '/setup/email-templates/',
      backLink: '/setup/',
      update: {
        path: '/setup/email-templates/:templateId',
        linkTo: '/setup/email-templates/',
        backLink: '/setup/email-templates/',
      },
    },
  },
  addNew: {
    addRequest: {
      path: '/add-new-request/:tab(travel|general|)',
      linkTo: '/add-new-request/',
      travel: {
        path: '/add-new-request/:id',
        linkTo: '/add-new-request/travel',
      },
      general: {
        path: '/add-new-request/:id',
        linkTo: '/add-new-request/general',
      },
      update: {
        path: '/update-request/:id',
        linkTo: '/update-request/',
      },
    },
  },
  auth: {
    login: {
      path: '/login/',
      linkTo: '/login/',
      title: 'Sign In',
    },
  },
  reports: {
    path: '/reports/',
    linkTo: '/reports/',
    expense: {
      path: '/reports/:tab',
      linkTo: '/reports/expense',
    },
    request: {
      path: '/reports/:tab',
      linkTo: '/reports/request',
    },
    expensesWithRequest: {
      path: '/reports/:tab',
      linkTo: '/reports/expenses-with-request',
    },
    cashAdvanceRequest: {
      path: '/reports/:tab',
      linkTo: '/reports/cash-advance-request',
    },
    benefit: {
      path: '/reports/:tab',
      linkTo: '/reports/benefit',
    },
    benefitEntitlement: {
      path: '/reports/:tab/',
      linkTo: '/reports/benefit-entitlement',
    },
    specialisedReport: {
      path: '/reports/:tab',
      linkTo: '/reports/specialised-report',
    },
    specialisedBenefitReport: {
      path: '/reports/:tab',
      linkTo: '/reports/specialised-benefit-report',
    },
  },
  approvals: {
    path: '/approvals/',
    linkTo: '/approvals/',
    expenses: {
      path: '/approvals/:tab',
      linkTo: '/approvals/expenses',
    },
    requests: {
      path: '/approvals/:tab',
      linkTo: '/approvals/requests',
    },
    expensesWithRequest: {
      path: '/approvals/:tab',
      linkTo: '/approvals/expenses-with-request',
    },
    benefits: {
      path: '/approvals/:tab',
      linkTo: '/approvals/benefits',
    },
  },
  profile: {
    path: '/profile/',
    linkTo: '/profile/',
    otherUser: {
      path: '/profile/:userId/',
      linkTo: '/profile/',
    },
  },
  admin: {
    path: '/admin/',
    linkTo: '/admin/',
    expenseClaims: {
      path: '/admin/:tab/',
      linkTo: '/admin/expenses',
    },
    requests: {
      path: '/admin/:tab/',
      linkTo: '/admin/requests',
    },
    cashAdvanceRequests: {
      path: '/admin/:tab/',
      linkTo: '/admin/cash-advance-requests',
    },
    expensesWithRequests: {
      path: '/admin/:tab/',
      linkTo: '/admin/expenses-with-requests',
    },
    benefitEntitlement: {
      path: '/admin/:tab/',
      linkTo: '/admin/benefit-entitlement',
    },
    expenseEntitlement: {
      path: '/admin/:tab/',
      linkTo: '/admin/expense-entitlement',
    },
    benefits: {
      path: '/admin/benefits',
      linkTo: '/admin/benefits',
    },
  },
  delegate: {
    path: '/delegate/:tab(delegated-by-me|delegated-to-me)',
    linkTo: '/delegate/',
    delegatedByMe: {
      path: '/delegate/:tab(delegated-by-me|delegated-to-me)',
      linkTo: '/delegate/delegated-by-me',
    },
    delegatedToMe: {
      path: '/delegate/:tab(delegated-by-me|delegated-to-me)',
      linkTo: '/delegate/delegated-to-me',
    },
  },
  deviceManagement: {
    path: '/device-management/',
    linkTo: '/device-management/',
  },
  delegateUsers: {
    path: '/delegate-users/',
    linkTo: '/delegate-users/',
  },
};
