export const isCurrentSectionDataOK = ({
  data,
  action,
  benefitConfig,
  selectedProcessTypeForEntitlement,
}: {
  data: any;
  action: 'CUSTOM' | 'DEFAULT';
  benefitConfig: any;
  selectedProcessTypeForEntitlement: any;
}): {
  success: boolean;
  msg: string;
} => {
  if (action === 'CUSTOM') {
    if (data.entities.length === 0)
      return { success: false, msg: 'entities empty' };
  }

  // Default must have either no entitlement to True or fields values
  if (!data.rule.is_no_entitlement && data.rule.fields === {}) {
    return {
      success: false,
      msg: "Fields values can't be 0 as 'Is entitlement' is true",
    };
  }
  if (
    !data.rule.is_no_entitlement &&
    ((!benefitConfig.is_unlimited_amount &&
      data.rule.fields.amount === 0 &&
      selectedProcessTypeForEntitlement === 'BEN') ||
      (data.rule.fields.max_amount === 0 &&
        selectedProcessTypeForEntitlement === 'BEN'))
    // ||
    // data.rule.fields.min_amount === 0 ||
    // data.rule.fields.copay_value === 0 ||
    // data.rule.fields.payable_percent === 0
  ) {
    return {
      success: false,
      msg: "Fields values can't be 0 as 'Is entitlement' is true",
    };
  }

  if (action === 'CUSTOM') {
    for (let [i, criteriaItem] of data.criterias.entries()) {
      for (let [j, conditionItem] of criteriaItem.entries()) {
        const incompleteCondition =
          !conditionItem.option ||
          !conditionItem.operator ||
          !conditionItem.value;
        if (incompleteCondition)
          return {
            success: false,
            msg: `condition ${j + 1} of criteria ${i + 1} incomplete`,
          };
      }
    }
  }

  return { success: true, msg: 'OK' };
};
