export const isCurrentSectionDataOK = ({
  data,
  action,
}: {
  data: any;
  action: 'CUSTOM' | 'DEFAULT';
}): {
  success: boolean;
  msg: string;
} => {
  if (action === 'CUSTOM') {
    if (data.entities.length === 0)
      return { success: false, msg: 'entities empty' };
  }

  if (
    !data.rule.default_case.is_auto_approval &&
    data.rule.default_case.steps.length === 0
  ) {
    return { success: false, msg: 'default cases empty' };
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

  for (const [i, customCaseItem] of data.rule.cases.entries()) {
    for (const [j, conditionItem] of customCaseItem.conditions.entries()) {
      if (
        !conditionItem.option ||
        !conditionItem.operator ||
        !conditionItem.value ||
        conditionItem.value.length === 0
      )
        return {
          success: false,
          msg: `condition ${j + 1} of custom case ${i + 1} incomplete`,
        };
    }

    if (!customCaseItem.is_auto_approval && customCaseItem.steps.length === 0)
      return { success: false, msg: `rules empty for custom case ${i + 1}` };

    if (customCaseItem.conditions.length === 0) {
      return {
        success: false,
        msg: `conditions empty for custom case ${i + 1}`,
      };
    }

    for (const [k, stepItem] of customCaseItem.steps.entries()) {
      if (!stepItem.owner)
        return { success: false, msg: `step owner ${k + 1} empty` };
      if (stepItem.owner === 'EMP_GROUP' && !stepItem.owner_id)
        return { success: false, msg: `step owner id ${k + 1} empty` };
      if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD') && !stepItem.owner_id)
        return { success: false, msg: `step owner id ${k + 1} empty` };
    }

    for (const [k, stepItem] of customCaseItem.fallback_steps.entries()) {
      if (!stepItem.owner)
        return { success: false, msg: `step owner ${k + 1} empty` };
      if (stepItem.owner === 'EMP_GROUP' && !stepItem.owner_id)
        return { success: false, msg: `step owner id ${k + 1} empty` };
    }
  }

  for (const [i, stepItem] of data.rule.default_case.steps.entries()) {
    if (!stepItem.owner)
      return {
        success: false,
        msg: `default case step owner ${i + 1} empty`,
      };
    if (stepItem.owner === 'EMP_GROUP' && !stepItem.owner_id)
      return {
        success: false,
        msg: `default case step owner id ${i + 1} empty`,
      };
    if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD') && !stepItem.owner_id)
      return {
        success: false,
        msg: `default case step owner id ${i + 1} empty`,
      };
  }

  for (const [i, stepItem] of data.rule.default_case.fallback_steps.entries()) {
    if (!stepItem.owner)
      return {
        success: false,
        msg: `default case step owner ${i + 1} empty`,
      };
    if (stepItem.owner === 'EMP_GROUP' && !stepItem.owner_id)
      return {
        success: false,
        msg: `default case step owner id ${i + 1} empty`,
      };
  }

  return { success: true, msg: 'OK' };
};
