import { BENEFIT_TYPE_CONFIG_ACTION_TYPES } from './addBenefitTypeConfig.action';

const initialState: any = {
  entityList: [],
  label: {},
  customFields: { fields: [], layout: [] },
  entityTypesList: [],
  wageTypes: [],
  // costCentre: [],
  benefitTypes: [],
  success: '',
  error: '',
  loader: false,
  expenseTypes: [],
  loadingMessage: '',
  glAccounts: [],
  // expandedItem: {} as IExpandedItem,
  isDataLoading: false,
  defaultLabels: {},
  availableAfter: [],
  availableAfterPeriodUnit: [],
  claimFor: [],
  deductibleComponent: [],
  entitlementPeriod: [
    { code: 'FY', title: 'Financial Year' },
    { code: 'CY', title: 'Calendar Year' },
    { code: 'LF', title: 'LifeTime' },
  ],
  frequencyUnit: [
    { code: 'MON', title: 'Month' },
    { code: 'Day', title: 'Day' },
    { code: 'YER', title: 'Year' },
  ],
  _deductibleComponent: [],
  entitlementTypeUnit: [],
  proratedBy: [],
  benefitLegalEntitiesRecords: [],
  benefitTypeData: undefined,
};
const AddBenefitTypeConfigReducer: any = (
  state = initialState,
  actions: { type: any; payload: any },
) => {
  const { type, payload } = actions;

  switch (type) {
    // LOADERS //

    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_DEDUCTIBLE_COMPONENT:
      return {
        ...state,
        deductibleComponent: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITLEMENT_PERIOD:
      return {
        ...state,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_FREQUENCY_UNIT:
      return {
        ...state,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_PRORATION:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default AddBenefitTypeConfigReducer;
