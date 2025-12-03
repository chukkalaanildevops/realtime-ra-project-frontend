/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Dispatch, memo, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import {
  Row,
  Col,
  Switch,
  Button,
  message,
  Steps,
  Form,
  Typography,
  Input,
  Modal,
  Result,
} from 'antd';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { appPath } from '../../../../../app/app.routes';
import { Trans } from '@lingui/macro';
import {
  HeaderBarWrapper,
  SkeletonItem,
} from '../../../../../../shared/components';

import './policyUpdate.index.less';
import { stateInterface } from '../../../../../../shared/redux/rootReducer';
import TargetGroupsAndEpenses from './steps/targetGroupsAndExpenses/targetGroupsAndEpenses.index';
import RulesAndConditions from './steps/rulesAndConditions/rulesAndConditions.index';
import Preview from './steps/preview/preview.index';
import {
  fetchAllExpanseTypes,
  fetchAllSfEmployeeGroups,
  fetchListAllEmployeeGroups,
  fetchListAllPayGrades,
  fetchListDepartments,
  fetchListDivisions,
  fetchListEntitiesCompany,
  fetchListBusinessUnits,
  fetchPolicyConfigurationDetail,
  updatePolicyConfiguration,
  fetchExpenseCategory,
  fetchPolicyConfigDetailsForView,
  fetchAllTargetTypes,
} from '../policyConfiguration.thunk';
import { RouteParams } from '../policyConfiguration.models';
import _some from 'lodash/some';
import { AxiosResponse } from 'axios';
import {
  listAllExpanseTypes,
  listAllExpenseCategoryService,
  listAllSfEmployeeGroups as listAllSfEmployeeGroupsAPI,
  listEntitiesService as listEntitiesServiceAPI,
  listDepartmentsService as listDepartmentsServiceAPI,
  listDevisionsService as listDevisionsServiceAPI,
  listBusinessUnitsService as listBusinessUnitsServiceAPI,
  listAllEmployeeGroups as listAllEmployeeGroupsAPI,
  listAllPayGrades as listAllPayGradesAPI,
  listAllRequestTypes,
} from '../../../../../../services/policyConfiguration';
import {
  resetPolicyConfirmationInfo,
  setPolicyConfigurationState,
  setPolicyUpdateId,
} from '../policyConfiguration.actions';
import { ReactComponent as GroupIcon } from '../../../../../../assets/images/default/Group 1586.svg';
import { getExpenseTypeListAPI } from '../../../../../../services/expenseTypeConfiguration';
import { fetchRequestTypesAPI } from '../../../../../../services/requestType';

const { TextArea } = Input;

const mapStateToProps = (state: stateInterface) => {
  const {
    isLoading,
    policyConfiguration,
    formSubmissionInProgress,
    formSubmissionSuccessful,
    formErrors,
    policyConfigurationDetail,
    listEntities,
    listBusinessUnits,
    listDivisions,
    listDepartments,
    listAllEmployeeGroups,
    listAllPayGrades,
    listAllSfEmployeeGroups,
    listExpenseCategory,
    confirmationInfo,
    listTargetTypes,
  } = state.policyConfiguration;
  return {
    isLoading: isLoading,
    policyConfiguration: policyConfiguration,
    formSubmissionInProgress: formSubmissionInProgress,
    formSubmissionSuccessful: formSubmissionSuccessful,
    formErrors: formErrors,
    policyConfigurationDetail: policyConfigurationDetail,
    listEntities,
    listBusinessUnits,
    listDivisions,
    listDepartments,
    listAllEmployeeGroups,
    listAllPayGrades,
    listAllSfEmployeeGroups,
    listExpenseCategory,
    confirmationInfo,
    listTargetTypes: listTargetTypes,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    // _setLoader: (isLoading: boolean) => dispatch(setPageLoader(isLoading)),
    _fetchPolicyConfigurationDetail: (id: any) =>
      dispatch(fetchPolicyConfigurationDetail(id)),
    _listEntities: () => dispatch(fetchListEntitiesCompany()),
    _listDivisions: () => dispatch(fetchListDivisions()),
    _listBusinessUnits: () => dispatch(fetchListBusinessUnits()),
    _listDepartments: () => dispatch(fetchListDepartments()),
    _listAllEmployeeGroups: () => dispatch(fetchListAllEmployeeGroups()),
    _listAllPayGrades: () => dispatch(fetchListAllPayGrades()),
    _listAllSfEmployeeGroups: () => dispatch(fetchAllSfEmployeeGroups()),
    _listAllExpenseTypes: () => dispatch(fetchAllExpanseTypes()),
    _setPolicyConfigurationState: (data: any) =>
      dispatch(setPolicyConfigurationState(data)),
    _listExpenseCategory: (category: any) =>
      dispatch(fetchExpenseCategory(category)),
    _updatePolicyConfiguration: (id: any, data: any, messageType: any) =>
      dispatch(updatePolicyConfiguration(id, data, messageType)),
    _fetchPolicyDetailsByID: (id: string) =>
      dispatch(fetchPolicyConfigDetailsForView(id)),
    _setPolicyUpdateId: (data: any) => dispatch(setPolicyUpdateId(data)),
    _resetConfirmationInfo: () => dispatch(resetPolicyConfirmationInfo()),
    _listAllTargetTypes: () => dispatch(fetchAllTargetTypes()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const initialConfigurationState: any = {
  applicable_on: '',
  applicable_to: [],
  selected_applicable_to: [],
  claim_types: [],
  request_types: [],
  selected_claim_types: {},
  selected_request_types: {},
  weightage: 1,
  is_enforcement: false,
  is_show_flag_to_approver: true,
  is_show_flag_to_employee: false,
  is_show_flag_to_finance_admin: false,
  msg_for_approver: '',
  msg_for_employee: '',
  msg_for_finance_admin: '',
  expenseCategory: [],
  requestCategory: [],
  expenseTypesListOptions: [],
  requestTypesListOptions: [],
  expenseTypes: [],
  requestTypes: [],
  requestCheck: false,
  claimCheck: true,
};

const PolicyUpdate: React.FC<ConnectedProps<typeof connector> &
  RouteComponentProps<RouteParams>> = (props: any) => {
  const {
    _fetchPolicyConfigurationDetail,
    match,
    policyConfigurationDetail,
    _listEntities,
    _listDivisions,
    _listBusinessUnits,
    _listDepartments,
    _listAllEmployeeGroups,
    _listAllPayGrades,
    _listAllSfEmployeeGroups,
    _listAllExpenseTypes,
    _updatePolicyConfiguration,
    _setPolicyConfigurationState,
    listEntities,
    listDivisions,
    listBusinessUnits,
    listDepartments,
    listAllEmployeeGroups,
    listAllPayGrades,
    listAllSfEmployeeGroups,
    listExpenseTypes,
    isLoading,
    _fetchPolicyDetailsByID,
    _setPolicyUpdateId,
    confirmationInfo,
    _resetConfirmationInfo,
    listTargetTypes,
    _listAllTargetTypes,
  } = props;

  const [form] = Form.useForm();
  const { Step } = Steps;
  const [current, setCurrent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [policyConfiguration, setPolicyConfiguration] = useState([
    initialConfigurationState,
  ]);
  const [isDisableSaveButton, setIsDisableSaveButton] = useState(true);
  const { Title } = Typography;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [policyId, setPolicyId] = useState(null);
  const [expenseTypeList, setExpenseTypeList] = useState([]);
  const [requestTypeList, setRequestTypeList] = useState([]);
  const { push } = useHistory();
  const [
    rulesPolicyConfigurationState,
    setRulesPolicyConfigurationState,
  ] = useState([]);
  const [entityNames, setEntityNames] = useState<any>({});

  useEffect(() => {
    let defaultLists = {
      EMPLOYEE_GROUP: {
        title: 'Employee Group',
        display_text: 'Employee Group',
      },
      JOB_INFO_EMPLOYEE_GROUP: {
        title: 'SF Employee Group',
        display_text: 'SF Employee Group',
      },
      JOB_INFO_PAY_GRADE: { title: 'Pay Grade', display_text: 'Pay Grade' },
    };
    let objLists: any = {};
    listTargetTypes.forEach((item: any) => {
      if (item.title === 'Company') {
        objLists['ENTITY__COMPANY'] = item;
      }
      if (item.title === 'Division') {
        objLists['ENTITY__DIVISION'] = item;
      }
      if (item.title === 'Business Unit') {
        objLists['ENTITY__BUSINESS_UNIT'] = item;
      }
      if (item.title === 'Department') {
        objLists['ENTITY__DEPARTMENT'] = item;
      }
    });
    objLists = { ...objLists, ...defaultLists };
    setEntityNames(objLists);
  }, [listTargetTypes]);

  useEffect(() => {
    if (policyConfigurationDetail?.id) {
      loadConfigurationData();
    }
  }, [policyConfigurationDetail]);

  useEffect(() => {
    let { params } = match;

    _fetchPolicyConfigurationDetail(params?.id);

    _setPolicyUpdateId([params?.id]);
  }, []);

  useEffect(() => {
    // setIsLoadingData(true);
    _listAllTargetTypes();
    _listEntities();
    _listDepartments();
    _listDivisions();
    _listBusinessUnits();
    _listAllEmployeeGroups();
    _listAllPayGrades();
    _listAllSfEmployeeGroups();
    _listAllExpenseTypes();
    let { params } = match;
    setPolicyId(params?.id);
    _fetchPolicyConfigurationDetail(params?.id);
  }, []);

  useEffect(() => {
    if (policyConfigurationDetail?.id) {
      setIsActive(policyConfigurationDetail.is_active);
    }
  }, [policyConfigurationDetail]);

  useEffect(() => {
    (async () => {
      const response = await getExpenseTypeListAPI();
      const data = response?.data;
      setExpenseTypeList(data);
      const res = await fetchRequestTypesAPI();
      const dataList = res?.data;
      setRequestTypeList(dataList);
    })();
  }, []);

  const selected_Applicable_To = async (
    applicable_on: any,
    applicable_to: any,
  ) => {
    return await new Promise(async reslove => {
      let temp: any;
      const Values = (uuid: Boolean, items: any) => {
        const list = applicable_to?.map((ele: any) => {
          const id = ele;
          let index = items?.findIndex((e: any) =>
            uuid ? e?.uuid === id : `${e?.id}` === `${id}`,
          );
          return {
            children: items[index]?.title,
            data: items[index],
            key: items[index]?.id,
            value: uuid ? items[index]?.uuid : items[index]?.id,
            tryAgain: false,
          };
        });
        return list;
      };

      if (applicable_on === 'ENTITY__COMPANY') {
        if (listEntities.length === 0) {
          let response: AxiosResponse = await listEntitiesServiceAPI();
          _setPolicyConfigurationState({ listEntities: response.data || [] });
          temp = Values(true, response.data);
        } else {
          temp = Values(true, listEntities);
        }
      }
      if (applicable_on === 'JOB_INFO_PAY_GRADE') {
        if (listAllPayGrades.length === 0) {
          let response: AxiosResponse = await listAllPayGradesAPI();
          _setPolicyConfigurationState({
            listAllPayGrades: response.data || [],
          });
          temp = Values(false, response.data);
        } else {
          temp = Values(false, listAllPayGrades);
        }
      }
      if (applicable_on === 'EMPLOYEE_GROUP') {
        if (listAllEmployeeGroups.length === 0) {
          let response: AxiosResponse = await listAllEmployeeGroupsAPI();
          _setPolicyConfigurationState({
            listAllEmployeeGroups: response.data || [],
          });
          temp = Values(false, response.data);
        } else {
          temp = Values(false, listAllEmployeeGroups);
        }
      }
      if (applicable_on === 'JOB_INFO_EMPLOYEE_GROUP') {
        if (listAllEmployeeGroups.length === 0) {
          let response: AxiosResponse = await listAllSfEmployeeGroupsAPI();
          _setPolicyConfigurationState({
            listAllSfEmployeeGroups: response.data || [],
          });
          temp = Values(false, response.data);
        } else {
          temp = Values(false, listAllSfEmployeeGroups || []);
        }
      }
      if (applicable_on === 'ENTITY__DIVISION') {
        if (listDivisions.length === 0) {
          let response: AxiosResponse = await listDevisionsServiceAPI();
          _setPolicyConfigurationState({ listDivisions: response.data || [] });
          temp = Values(true, response.data);
        } else {
          temp = Values(true, listDivisions);
        }
      }
      if (applicable_on === 'ENTITY__DEPARTMENT') {
        if (listDepartments.length === 0) {
          let response: AxiosResponse = await listDepartmentsServiceAPI();
          _setPolicyConfigurationState({
            listDepartments: response.data || [],
          });
          temp = Values(true, response.data);
        } else {
          temp = Values(true, listDepartments);
        }
      }
      if (applicable_on === 'ENTITY__BUSINESS_UNIT') {
        if (listBusinessUnits.length === 0) {
          let response: AxiosResponse = await listBusinessUnitsServiceAPI();
          _setPolicyConfigurationState({
            listBusinessUnits: response.data || [],
          });
          temp = Values(true, response.data);
        } else {
          temp = Values(true, listBusinessUnits);
        }
      }

      reslove(temp);
    });
  };

  async function delay(ms: any) {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }

  const loadConfigurationData = async () => {
    setIsLoadingData(true);
    if (_some(policyConfigurationDetail)) {
      if (policyConfigurationDetail?.target_configuration?.data.length) {
        let configs: any = [];
        for (
          let index = 0;
          index < policyConfigurationDetail?.target_configuration?.data.length;
          index++
        ) {
          let item =
            policyConfigurationDetail?.target_configuration?.data[index];

          let expenseCategories: any = [];
          item?.expense_categories.forEach((eitem: any) => {
            expenseCategories.push(...eitem?.types);
          });

          let selected_claim_types: any = {};
          expenseCategories.forEach((ecItem: any) => {
            if (!selected_claim_types[ecItem.global_configuration__category]) {
              selected_claim_types[ecItem.global_configuration__category] = [];
            }
            selected_claim_types[ecItem.global_configuration__category].push(
              ecItem,
            );
          });

          let expenseCategoryCodeLists = Object.keys(selected_claim_types).map(
            key => key,
          );

          let {
            expenseTypesListOptions,
            expenseTypes,
          } = await getExpenseDetails(expenseCategoryCodeLists.join(','));

          let requestCategories: any = [];
          item?.request_categories?.forEach((eitem: any) => {
            let types = eitem?.types.map((item: any) => {
              return { ...item, global_configuration__category: eitem?.name };
            });
            requestCategories.push(...types);
          });

          let selected_request_types: any = {};

          requestCategories?.forEach((ecItem: any) => {
            if (
              !selected_request_types[ecItem.global_configuration__category]
            ) {
              selected_request_types[
                ecItem.global_configuration__category
              ] = [];
            }
            selected_request_types[ecItem.global_configuration__category].push(
              ecItem,
            );
          });

          let requestCategoryCodeLists = Object.keys(
            selected_request_types,
          ).map(key => key);

          let {
            requestTypesListOptions,
            requestTypes,
          } = await getRequestDetails(requestCategoryCodeLists.join(','));

          let selected_applicable: any;
          selected_applicable = await selected_Applicable_To(
            item?.applicable_on,
            item?.applicable_to,
          );

          let obj = {
            applicable_on: item?.applicable_on,
            applicable_to: item?.applicable_to,
            selected_applicable_to: selected_applicable,
            claim_types: item?.claim_types,
            selected_claim_types: selected_claim_types,
            weightage: item.weightage,
            is_enforcement: item?.is_enforcement,
            is_show_flag_to_approver: item?.is_show_flag_to_approver,
            is_show_flag_to_employee: item?.is_show_flag_to_employee,
            is_show_flag_to_finance_admin: item?.is_show_flag_to_finance_admin,
            msg_for_approver:
              item?.msg_for_approver !== ''
                ? item?.msg_for_approver
                : policyConfigurationDetail?.title,
            msg_for_employee:
              item?.msg_for_employee !== ''
                ? item?.msg_for_employee
                : policyConfigurationDetail?.title,
            msg_for_finance_admin:
              item?.msg_for_finance_admin !== ''
                ? item?.msg_for_finance_admin
                : policyConfigurationDetail?.title,
            expenseCategory: expenseCategoryCodeLists,
            expenseTypesListOptions: expenseTypesListOptions,
            expenseTypes: expenseTypes,
            request_types: item?.request_types ? item?.request_types : [],
            selected_request_types: selected_request_types,
            requestCategory: requestCategoryCodeLists,
            requestTypesListOptions: requestTypesListOptions,
            requestTypes: requestTypes,
            requestCheck:
              item?.request_types?.length === 0 ||
              item?.request_types === undefined
                ? false
                : true,
            claimCheck: item?.claim_types?.length === 0 ? false : true,
          };
          configs.push(obj);
        }

        setPolicyConfiguration(configs);
        setIsLoadingData(false);
      } else {
        setPolicyConfiguration([
          {
            ...initialConfigurationState,
            msg_for_approver: policyConfigurationDetail.title,
            msg_for_employee: policyConfigurationDetail.title,
            msg_for_finance_admin: policyConfigurationDetail.title,
          },
        ]);
        setIsLoadingData(false);
      }
    } else {
      setPolicyConfiguration([
        {
          ...initialConfigurationState,
          msg_for_approver: policyConfigurationDetail.title,
          msg_for_employee: policyConfigurationDetail.title,
          msg_for_finance_admin: policyConfigurationDetail.title,
        },
      ]);
      setIsLoadingData(false);
    }
  };

  const getExpenseDetails = async (code: any) => {
    if (!code) {
      return { expenseTypesListOptions: [], expenseTypes: [] };
    }
    const response: AxiosResponse = await listAllExpenseCategoryService(code);
    let listExpenseTypesLists = response.data;
    let expenseTypes = response.data;

    const resp: AxiosResponse = await listAllExpanseTypes();
    let listExpenseTypes = resp.data;
    const tempData = [];
    let expenseTypeObj: any = {};

    listExpenseTypes.forEach((item: any) => {
      expenseTypeObj[item?.code] = item?.title;
    });

    for (const key in listExpenseTypesLists) {
      let optionData = {
        title: expenseTypeObj[key],
        value: key,
        key: key,
        data: key,
        type: 'parent',
        children: listExpenseTypesLists[key].map((ele: any) => {
          return {
            title: ele?.title,
            value: ele?.id,
            key: ele?.id,
            type: 'child',
            data: ele,
          };
        }),
      };
      tempData.push(optionData);
    }
    let expenseTypesListOptions = tempData;
    return { expenseTypesListOptions, expenseTypes };
  };

  const getRequestDetails = async (code: any) => {
    if (!code) {
      return { requestTypesListOptions: [], requestTypes: [] };
    }
    const response: AxiosResponse = await listAllRequestTypes(code);
    let listRequestTypesLists = response.data;
    let requestTypes = response.data;

    // const resp: AxiosResponse = await listAllExpanseTypes();
    const AllRequestTypes = [
      {
        code: 'GEN',
        title: 'GEN',
      },
      {
        code: 'TRA',
        title: 'TRA',
      },
    ];
    let listRequestTypes = AllRequestTypes;
    const tempData = [];
    let requestTypeObj: any = {};

    listRequestTypes.forEach((item: any) => {
      requestTypeObj[item?.code] = item?.title;
    });

    for (const key in listRequestTypesLists) {
      let optionData = {
        title: requestTypeObj[key],
        value: key,
        key: key,
        data: key,
        type: 'parent',
        children: listRequestTypesLists[key].map((ele: any) => {
          return {
            title: ele?.title,
            value: ele?.id,
            key: ele?.id,
            type: 'child',
            data: ele,
          };
        }),
      };
      tempData.push(optionData);
    }
    let requestTypesListOptions = tempData;
    return { requestTypesListOptions, requestTypes };
  };

  const handleAddNewGroup = async () => {
    await setPolicyConfiguration([
      ...policyConfiguration,
      {
        ...initialConfigurationState,
        msg_for_approver: policyConfigurationDetail.title,
        msg_for_employee: policyConfigurationDetail.title,
        msg_for_finance_admin: policyConfigurationDetail.title,
      },
    ]);
    var element: any = document.querySelector('#page-container');
    if (element.scrollHeight !== null) {
      const height: any = element.scrollHeight;
      element.scrollBy(0, height);
    }
  };

  const handleRemoveGroup = (index: any) => {
    let newPolicy = Object.assign([], policyConfiguration);
    newPolicy.splice(index, 1);
    setPolicyConfiguration(newPolicy);
  };

  useEffect(() => {
    let finalPolicyConfigureState = policyConfiguration;
    if (current === 1) {
      finalPolicyConfigureState = rulesPolicyConfigurationState;
    } else {
      finalPolicyConfigureState = policyConfiguration;
    }
    if (checkValidation(finalPolicyConfigureState)) {
      setTimeout(() => {
        setIsDisableSaveButton(false);
      }, 300);
    } else {
      setIsDisableSaveButton(true);
    }
  }, [policyConfiguration, rulesPolicyConfigurationState, current]);

  const checkValidation = (finalPolicyConfigureState: any) => {
    let isValid = true;
    finalPolicyConfigureState.forEach((item: any) => {
      if (!item?.claimCheck) {
        isValid = false;
        return false;
      }
      if (item?.requestCheck && item?.requestCategory?.length === 0) {
        isValid = false;
        return false;
      }
      if (item?.requestCheck && item?.request_types?.length === 0) {
        isValid = false;
        return false;
      }
      if (!item?.applicable_on) {
        isValid = false;
        return false;
      }
      if (item?.applicable_to.length === 0) {
        isValid = false;
        return false;
      }
      if (item?.expenseCategory.length === 0) {
        isValid = false;
        return false;
      }
      if (current === 1 && item?.is_show_flag_to_approver === false) {
        isValid = false;
        return false;
      }
      if (_some(item?.selected_claim_types)) {
        Object.keys(item?.selected_claim_types).forEach(key => {
          if (item?.selected_claim_types[key].length === 0) {
            isValid = false;
            return false;
          }
        });
      }
    });
    return isValid;
  };

  const next = () => {
    let newPolicy;
    let finalPolicyConfigureState = policyConfiguration;
    if (current === 1) {
      setPolicyConfiguration(rulesPolicyConfigurationState);
      let finalData: any[];
      finalData = rulesPolicyConfigurationState;
      newPolicy = finalData?.map(
        ({
          expenseCategory,
          expenseTypes,
          expenseTypesListOptions,
          selected_claim_types,
          selected_applicable_to,
          requestTypes,
          requestTypesListOptions,
          selected_request_types,
          requestCategory,
          ...rest
        }) => rest,
      );
      finalPolicyConfigureState = rulesPolicyConfigurationState;
    } else {
      newPolicy = policyConfiguration?.map(
        ({
          expenseCategory,
          expenseTypes,
          expenseTypesListOptions,
          selected_claim_types,
          selected_applicable_to,
          requestTypes,
          requestTypesListOptions,
          selected_request_types,
          requestCategory,
          ...rest
        }) => rest,
      );
      finalPolicyConfigureState = policyConfiguration;
    }

    let newDetail = policyConfigurationDetail.target_configuration.data.map(
      ({ expense_categories, selected_applicable_to, ...rest }: any) => rest,
    );

    const is = isEqual(newPolicy, newDetail);
    // true
    if (checkValidation(finalPolicyConfigureState)) {
      const filterPolicyConfiguration = finalPolicyConfigureState?.filter(
        (item: any) => {
          if (
            item?.request_types?.length === 0 ||
            item?.requestCheck === false
          ) {
            delete item?.request_types;
          }
          return item;
        },
      );

      policyConfigurationDetail.target_configuration = {
        version: 'v1',
        data: filterPolicyConfiguration?.map(
          ({
            expenseCategory,
            expenseTypes,
            expenseTypesListOptions,
            selected_claim_types,
            requestTypes,
            requestTypesListOptions,
            selected_request_types,
            requestCategory,
            requestCheck,
            claimCheck,
            ...rest
          }) => rest,
        ),
      };

      let items = Object.assign(
        [],
        policyConfigurationDetail.target_configuration.data,
      );
      let list: any = items.filter((ele: any) => {
        ele.claim_types = ele.claim_types.filter((item: any) => {
          let isincludes = expenseTypeList?.findIndex(
            (e: any) => e.id === item,
          );
          return isincludes !== -1 && item;
        });
        return ele;
      });
      list = items.filter((ele: any) => {
        if (ele?.request_types?.length !== 0) {
          ele.request_types = ele.request_types?.filter((item: any) => {
            let isincludes = requestTypeList?.findIndex(
              (e: any) => e.id === item,
            );
            return isincludes !== -1 && item;
          });
          return ele;
        }
      });
      let list1 = list.map(({ selected_applicable_to, ...item }: any) => item);
      const modifiedArr = list1?.map((item: any) => ({
        ...item,
        applicable_to: item?.applicable_to?.map((value: any) =>
          value?.toString(),
        ),
      }));
      let reqData = {
        is_active: policyConfigurationDetail.is_active,
        target_configuration: {
          ...policyConfigurationDetail.target_configuration,
          data: modifiedArr,
        },
      };
      if (!is) {
        let type = current === 0 ? 'targetgroup' : current === 1 ? 'rules' : '';
        if (
          current === 0 &&
          policyConfigurationDetail?.target_configuration?.data.length === 0
        ) {
          type = 'targetgroup-created';
        } else if (
          current === 0 &&
          policyConfigurationDetail?.target_configuration?.data.length > 0
        ) {
          type = 'targetgroup';
        } else if (
          current === 1 &&
          policyConfigurationDetail?.target_configuration?.data.length === 0
        ) {
          type = 'rules-created';
        } else if (
          current === 1 &&
          policyConfigurationDetail?.target_configuration?.data.length > 0
        ) {
          type = 'rules';
        }

        _updatePolicyConfiguration(
          policyConfigurationDetail?.id,
          reqData,
          type,
        );
      }
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onChange = (value: number) => {
    if (value < current) {
      setCurrent(value);
    }
  };

  const steps = [
    {
      title: 'Target Groups & Expense Details',
      content: (
        <>
          <TargetGroupsAndEpenses
            policyConfigurationDetail={policyConfigurationDetail}
            policyConfiguration={policyConfiguration}
            setPolicyConfiguration={setPolicyConfiguration}
            handleAddNewGroup={handleAddNewGroup}
            handleRemoveGroup={handleRemoveGroup}
            listTargetTypes={listTargetTypes}
            entityNames={entityNames}
          />
        </>
      ),
    },
    {
      title: 'Rules & Conditions',
      content: (
        <RulesAndConditions
          policyConfiguration={policyConfiguration}
          setPolicyConfiguration={setPolicyConfiguration}
          policyConfigurationDetail={policyConfigurationDetail}
          rulesPolicyConfigurationState={rulesPolicyConfigurationState}
          setRulesPolicyConfigurationState={setRulesPolicyConfigurationState}
          entityNames={entityNames}
        />
      ),
    },
    {
      title: 'Preview',
      content: (
        <Preview
          policyId={policyId}
          _fetchPolicyDetailsByID={_fetchPolicyDetailsByID}
          listTargetTypes={listTargetTypes}
          entityNames={entityNames}
        />
      ),
    },
  ];

  return (
    <>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Policy Configuration</Trans> }}
        breadcrumbCompVisibility={true}
        breadcrumbCompProps={{
          enableBackBtn: true,
          backBtnUrl: props.history.location.pathname,
          onBackClick: () => {
            _setPolicyConfigurationState({
              confirmationInfo: {
                ...confirmationInfo,
                params: appPath.config_setup.policyConfiguration.path,
                visibility: true,
              },
            });
          },
          breadcrumProps: {
            separator: '>',
            routes: [
              {
                path: appPath.config_setup.policyConfiguration.path,
                breadcrumbName: `Edit Policy`,
              },
            ],
          },
        }}
      >
        <div className='policy-configuration-container'>
          {/* <FilterBar enableBackBtn={false} isAddButton={false} /> */}

          {isLoadingData ? (
            <SkeletonItem isLoadingData={isLoadingData} />
          ) : null}

          {!isLoadingData ? (
            <>
              <Row>
                <Col span={20}>
                  <Title level={5} style={{ color: '#000000' }}>
                    <Trans>Policy Details</Trans>
                  </Title>
                </Col>
                <Col span={4}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <Trans>Policy Status :</Trans>
                    <div
                      style={{
                        padding: '3px 10px',
                        width: '120px',
                        justifyContent: 'inherit',
                      }}
                      className={`switch-button status ${
                        isActive ? 'ACTIVE' : 'INACTIVE'
                      }`}
                    >
                      {current === steps.length - 1 ? (
                        <Switch
                          size='small'
                          checked={isActive}
                          onChange={(e: any) => {
                            setIsActive(e);
                            let { params } = match;
                            let reqData: any = {
                              ...policyConfigurationDetail,
                              is_active: e,
                            };
                            _setPolicyConfigurationState(reqData);
                            _updatePolicyConfiguration(
                              params?.id,
                              {
                                is_active: e,
                              },
                              'status',
                            );
                          }}
                        />
                      ) : null}
                      {isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col span={24} className='container-box'>
                  <Row>
                    <Col span={18}>
                      <Form.Item
                        label={
                          <span
                            style={{
                              // marginTop: '12px',
                              fontWeight: 500,
                              color: '#344054',
                            }}
                          >
                            Policy Name
                          </span>
                        }
                      >
                        <div className='text-box text-box-small'>
                          {policyConfigurationDetail?.title}
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Form.Item
                        label={
                          <span
                            style={{
                              // marginTop: '12px',
                              fontWeight: 500,
                              color: '#344054',
                            }}
                          >
                            Policy Code
                          </span>
                        }
                      >
                        <div className='text-box text-box-small'>
                          {policyConfigurationDetail?.code}
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <span
                            style={{
                              // marginTop: '12px',
                              fontWeight: 500,
                              color: '#344054',
                            }}
                          >
                            Description
                          </span>
                        }
                        className='label-dark'
                      >
                        <div className='text-box text-box-small'>
                          {policyConfigurationDetail?.description}
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row
                gutter={12}
                align='middle'
                justify='space-around'
                style={{ marginBottom: '1rem' }}
              >
                <>
                  <Steps
                    current={current}
                    onChange={onChange}
                    progressDot={false}
                    size={'small'}
                    iconPrefix='X'
                  >
                    {steps.map((item, index) => (
                      <Step
                        key={item.title}
                        title={<Trans>{item.title}</Trans>}
                        icon={
                          current >= index ? (
                            <CheckCircleOutlined />
                          ) : (
                            <MinusCircleOutlined />
                          )
                        }
                        // icon={<CheckCircleOutlined />}
                        // status={
                        //   current === 0
                        //     ? 'process'
                        //     : current > 0
                        //     ? 'wait'
                        //     : 'process'
                        // }
                      />
                    ))}
                  </Steps>
                </>
                <Col span={6}></Col>
              </Row>
              <Row style={{ marginBottom: '1rem' }}>
                <Col span={24}>
                  <Form
                    form={form}
                    layout='vertical'
                    // initialValues={{ requiredMarkValue: requiredMark }}
                    // onValuesChange={onRequiredTypeChange}
                    // requiredMark={requiredMark}
                  >
                    {steps[current].content}
                  </Form>
                </Col>
              </Row>
              <div className='policy-update-action-wrapper'>
                <Row justify='end' style={{ padding: '1rem 0' }}>
                  {current > 0 && (
                    <Col span={4} style={{ margin: '0px 10px' }}>
                      <Button
                        onClick={() => prev()}
                        block
                        style={{
                          color: '#0090FF',
                          border: '1px solid #0090FF',
                        }}
                      >
                        Back
                      </Button>
                    </Col>
                  )}
                  {current === steps.length - 1 && (
                    <Col span={4}>
                      <Button
                        type='primary'
                        onClick={() => {
                          if (!isActive) setIsModalOpen(true);
                          else {
                            _setPolicyConfigurationState({
                              confirmationInfo: {
                                ...confirmationInfo,
                                visibility: false,
                              },
                              policyConfigurationDetail: null,
                              policyUpdateId: [],
                            });
                            push(appPath.config_setup.policyConfiguration.path);
                          }
                        }}
                        // onClick={() => message.success('Processing complete!')}
                        block
                      >
                        Close
                      </Button>
                    </Col>
                  )}
                  {current < steps.length - 1 && (
                    <Col span={4}>
                      <Button
                        style={{ width: '100%' }}
                        type='primary'
                        disabled={isDisableSaveButton}
                        onClick={() => next()}
                      >
                        Save & Proceed
                      </Button>
                    </Col>
                  )}
                </Row>
              </div>
            </>
          ) : null}
        </div>
      </HeaderBarWrapper>

      <Modal
        style={{
          top: 25,
          left: 100,
          borderRadius: 10,
        }}
        // width={500}
        visible={isModalOpen}
        closable={true}
        centered
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={false}
        // destroyOnClose={true}
        bodyStyle={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 50px)',
        }}
      >
        {/* <img src={GroupIcon} /> */}
        <Result
          icon={<GroupIcon />}
          title='Policy is not Activated!'
          subTitle='Are you sure to updating policy without activating it ?'
          extra={[
            <div className='policy-update-action-wrapper'>
              <Button
                shape='round'
                style={{ margin: '2px' }}
                onClick={() => {
                  setIsActive(true);
                  let { params } = match;

                  let reqData: any = {
                    ...policyConfigurationDetail,
                    is_active: true,
                    confirmationInfo: {
                      ...confirmationInfo,
                      visibility: false,
                    },
                    policyUpdateId: [],
                  };
                  _setPolicyConfigurationState(reqData);
                  _updatePolicyConfiguration(
                    params?.id,
                    {
                      is_active: true,
                    },
                    'status',
                  );
                  _setPolicyConfigurationState({
                    confirmationInfo: {
                      ...confirmationInfo,
                      visibility: false,
                    },
                    policyUpdateId: [],
                  });
                  setIsModalOpen(false);
                  message
                    .success(
                      'Policy Configuration status active and update successfully',
                      3000,
                    )
                    .then(() => {
                      push(appPath.config_setup.policyConfiguration.path);
                    });
                }}
              >
                Activate & Update
              </Button>
              <Button
                onClick={() => {
                  _setPolicyConfigurationState({
                    confirmationInfo: {
                      ...confirmationInfo,
                      visibility: false,
                    },
                    policyUpdateId: [],
                  });
                  push(appPath.config_setup.policyConfiguration.path);
                }}
                type='primary'
                shape='round'
                style={{ minWidth: '150px', margin: '2px' }}
              >
                Yes
              </Button>
            </div>,
          ]}
        ></Result>
      </Modal>

      <Modal
        style={{
          top: 25,
          left: 100,
          borderRadius: 10,
        }}
        visible={confirmationInfo.visibility}
        closable={true}
        centered
        onCancel={() => {
          _setPolicyConfigurationState({
            confirmationInfo: {
              ...confirmationInfo,
              visibility: false,
            },
          });
        }}
        footer={false}
        bodyStyle={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 50px)',
        }}
      >
        <Result
          icon={<GroupIcon />}
          title='Policy is not Saved!'
          subTitle='Are you sure about exiting without saving the Policy? Entered details might get lost.'
          extra={[
            <div className='policy-update-action-wrapper'>
              <Button
                shape='round'
                style={{ margin: '2px' }}
                onClick={() => {
                  _setPolicyConfigurationState({
                    confirmationInfo: {
                      ...confirmationInfo,
                      visibility: false,
                    },
                  });
                }}
              >
                Stay on the Page
              </Button>
              <Button
                onClick={() => {
                  _setPolicyConfigurationState({
                    confirmationInfo: {
                      ...confirmationInfo,
                      visibility: false,
                    },
                    policyUpdateId: [],
                    policyConfigurationDetail: null,
                  });
                  if (_some(confirmationInfo)) {
                    if (
                      typeof confirmationInfo.params === 'object' &&
                      _some(confirmationInfo.params)
                    ) {
                      props.history.push(confirmationInfo.params.navigate);
                    } else if (
                      typeof confirmationInfo.params === 'string' &&
                      confirmationInfo.params
                    ) {
                      props.history.push(confirmationInfo.params);
                    }
                  }
                }}
                type='primary'
                shape='round'
                style={{ minWidth: '150px', margin: '2px' }}
              >
                Yes
              </Button>
            </div>,
          ]}
        ></Result>
      </Modal>
    </>
  );
};

export default memo(connector(PolicyUpdate));
