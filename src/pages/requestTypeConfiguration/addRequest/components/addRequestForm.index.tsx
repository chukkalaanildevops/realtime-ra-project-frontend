/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Dispatch, useRef } from 'react';
import {
  Form,
  Select,
  Input,
  Row,
  Col,
  DatePicker,
  Button,
  Checkbox,
  InputNumber,
  TimePicker,
  Upload,
  message,
  Modal,
  Collapse,
  Result,
} from 'antd';
import {
  generalDataInterface,
  Ilabel,
  IcustomFields,
  RequestDetails,
  COST_CENTRE_TYPES,
} from '../../requestTypeConfiguration.model';
import { ConnectedProps, connect } from 'react-redux';

import {
  HeaderBarWrapper,
  FilterBar,
  CustomFieldsForm,
  SkeletonItem,
  ConfirmationModal,
  ErrorBoundary,
  CustomizeTabName,
  PDFViewer,
  AdminFieldIcon,
  ReceiptSelector,
  Loader,
  CustomPlacesAutocomplete,
} from '../../../../shared/components';
import moment, { isMoment } from 'moment';
import {
  CloseOutlined,
  PlusOutlined,
  UploadOutlined,
  StopOutlined,
  PaperClipOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Trans } from '@lingui/macro';
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Autocomplete from 'react-google-autocomplete';

import 'react-google-places-autocomplete/dist/index.min.css';
import './addRequestForm.index.less';

import {
  getUpdateRequestTypeData,
  getRequestReferenceData,
  getUserCostCentre,
  getRequestLegalEntities,
  getRequestTypeExpandedItem,
  getRequestTypeDataLoading,
  getStaffMembers,
  getExpenseTypesForRequest,
  getRequestTypeLoader,
  getRequestTypeLoadingMessage,
  getRequestTypeSuccessMessage,
  getRequestTypeErrorMessage,
  getRequestOverseasCostCentres,
  getRequestLocalCostCentres,
  getRequestInternalCostCentres,
  getIsPresentInTargetAudience,
  getCountryCurrencyList,
  getCurrentDelegateUser,
  getcreateRequestLoadingStatus,
  getstaffMemberLoadingStatus,
  getDelegateUserCostCentre,
  getRequestLegalEntitiesLoadingStatus,
} from '../../../../shared/redux/rootReducer';
import {
  createRequest,
  fetchRequestLegalEntities,
  fetchRequestTypeConfigById,
  fetchRequestDetailsById,
  fetchStaffMembers,
  fetchExpenseTypesAgainstRequest,
  fetchCostCentres,
} from '../../requestTypeConfiguration.thunk';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ACTION_TYPE } from '../addRequest.model';
import { appPath } from '../../../app/app.routes';
import {
  resetAllRequestData,
  saveExpandedItem,
} from '../../requestTypeConfiguration.action';
import { fetchCountryCurrencyList } from '../../../setup/component/other/currencyConversion/currencyConversion.thunk';
import { ATTACHMENT } from '../addRequest.model';
import { isPdfFile, isGoogleApiDisabled } from '../../../../utils/global.utils';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { getQueryString } from '../../../../utils/scroll.utils';
import Store from '../../../../shared/redux/store/store.index';
let deletedList: string[] = [];

const ESTIMATION_TABLE_KEY = 'estimationTable';
const FLIGHT_TABLE_KEY = 'flightTable';
const TRAVEL_TABLE_KEY = 'travelData';
const HOTEL_TABLE_KEY = 'hotelAccommodationTable';
const STAFF_TABLE_KEY = 'staffAttendeeTable';
const GUEST_TABLE_KEY = 'guestAttendeeTable';

const DATE_FORMAT = 'DD/MM/YYYY';
const rowGutter: [number, number] = [16, 8];

const AddRequestForm: React.FC<{
  is_travel_type: boolean;
  is_preview: boolean;
  requestData?: generalDataInterface;
  labelData?: Ilabel;
  customFields?: IcustomFields;
  readOnly?: boolean;
  onSelectRequestType?: (id?: string) => void;
  isClone?: boolean;
} & ConnectedProps<typeof connector>> = ({
  customFields = { fields: [], layout: [] },
  is_preview,
  is_travel_type,
  labelData = {},
  requestDetails,
  default_cost_centre,
  currencies,
  request_type_legal_entity,
  requestConfigData,
  requestData,
  createRequestLoadingStatus,
  isDataLoading,
  requestLegalEntitiesLoading,
  employeeList,
  expenseTypesForRequest,
  error,
  staffMemberLoading,
  loader,
  loadingMessage,
  success,
  readOnly,
  isClone = false,
  internalCostCentres,
  localCostCentres,
  overseasCostCentres,
  currentDelegationUser,
  _createDraft,
  _fetchLegalEntities,
  _fetchRequestConfig,
  _fetchRequestDetails,
  _fetchEmployeeList,
  _fetchExpensesForRequest,
  _resetAllData,
  _fetchCountryCurrencies,
  _resetConfigData,
  _fetchCostCentres,
  onSelectRequestType,
}) => {
  const [form] = Form.useForm();
  const customFieldForm = useRef<any>(null);
  const [, forceUpdate] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [action, setAction] = useState<ACTION_TYPE | undefined>();
  const [attachmentPath, setAttachmentPath] = useState<ATTACHMENT | undefined>(
    undefined,
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [defaultFileList, setDefaultFileList] = useState<any[]>([]);

  const [costCentres, setCostCentres] = useState<any[]>([]);

  const [estimationActiveKey, setEstimationActiveKey] = useState<any>(
    ESTIMATION_TABLE_KEY,
  );
  const [flightActiveKey, setFlightActiveKey] = useState<any>(FLIGHT_TABLE_KEY);
  const [hotelActiveKey, setHotelActiveKey] = useState<any>(HOTEL_TABLE_KEY);
  const [staffActiveKey, setStaffActiveKey] = useState<any>(STAFF_TABLE_KEY);
  const [guestActiveKey, setGuestActiveKey] = useState<any>(GUEST_TABLE_KEY);
  const [travelActiveKey, setTravelActiveKey] = useState<any>(TRAVEL_TABLE_KEY);
  const [isAutoCompleteDisable, setIsAutoCompleteDisable] = useState(false);

  const requestConfig = requestData || requestConfigData;

  const params: any = useParams();
  const id = params.id;
  const history = useHistory();
  const location: any = useLocation();

  // const cloneState = JSON.parse(localStorage.getItem('clone_data') || '{}');
  // if (!id && cloneState?.item?.id) {
  //   id = cloneState.item.id;
  // }

  const isAdmin = getQueryString('mode') === 'admin' && Boolean(id);

  const [confirmationModal, setConfirmationModal] = useState(false);
  useEffect(() => {
    if (success && action !== undefined) {
      if (
        (action === ACTION_TYPE.SAVE_DRAFT ||
          action === ACTION_TYPE.SEND_APPROVAL) &&
        !id
      ) {
        setConfirmationModal(true);
      } else {
        if (isAdmin) {
          history.goBack();
        } else if (action === ACTION_TYPE.SAVE_DRAFT) {
          history.push(`${appPath.drafts.linkTo}request`);
        } else {
          history.push(`${appPath.submitted.linkTo}request`);
        }
      }
    }
  }, [success]);
  useEffect(() => {
    const isAutoCompleteDisable = isGoogleApiDisabled();
    isAutoCompleteDisable && setIsAutoCompleteDisable(isAutoCompleteDisable);
  }, []);
  const navigateToDraft = () => {
    setConfirmationModal(false);
    _resetAllData();
    if (action === ACTION_TYPE.SAVE_DRAFT) {
      history.push(`${appPath.drafts.linkTo}request`);
    } else {
      history.push(`${appPath.submitted.linkTo}request`);
    }
  };
  const deleteFile = (id: string) => {
    try {
      const newFiles = fileList.filter(item => item.uid !== id);
      setFileList(newFiles);
    } catch (e) {}
  };
  const removeFile = (id: string) => {
    try {
      const newFiles = defaultFileList.filter(item => item.id !== id);
      deletedList.push(id);
      setDefaultFileList(newFiles);
    } catch (e) {}
  };
  const reloadPage = () => {
    setConfirmationModal(false);
    _resetAllData();
    _resetConfigData();
    form.resetFields();
    setFileList([]);
    history.push(
      `${appPath.addNew.addRequest.linkTo}${
        is_travel_type ? 'travel' : 'general'
      }`,
    );
  };

  useEffect(() => {
    let totalSize = 0;
    fileList.forEach(item => {
      totalSize += item.size;
    });
    const maxSize = 1024 * 1024 * 20;
    if (totalSize > maxSize) {
      message.error('Total size should be less than 20MB', 2);
      // return;
      setFileList([]);
    }
  }, [fileList]);
  const additionalDocumentHandler = (
    info: UploadChangeParam<UploadFile<any>>,
  ) => {
    try {
      // debugger;
      if (info.fileList.length > 5) {
        message.destroy();
        message.warning('Maximum 5 document supported');
        return;
      }

      if (isImgAndPdf(info.file.type)) {
        setFileList(prev => [...prev, info.file]);
      }
    } catch (e) {}
  };
  useEffect(() => {
    if (requestDetails?.charge_to?.code) {
      const chargeTo = requestDetails.charge_to.code;
      if (
        chargeTo === 'OVERS' &&
        requestConfig.is_allow_overseas_cost_centres
      ) {
        setCostCentres(overseasCostCentres);
      } else if (
        chargeTo === 'INTER' &&
        requestConfig.is_allow_internal_order_cost_centres
      ) {
        setCostCentres(internalCostCentres);
      } else {
        setCostCentres(localCostCentres);
      }
    } else {
      setCostCentres(localCostCentres);
    }
  }, [localCostCentres, overseasCostCentres, internalCostCentres]);

  const onStartDateSelect = (val: any) => {
    let travelItineraries = form.getFieldValue('travel_itineraries');
    if (travelItineraries && travelItineraries.length !== 0) {
      travelItineraries = [{ ...travelItineraries[0], start_date: val }];
    }

    form.setFieldsValue({
      end_date: val,
      travel_itineraries: travelItineraries,
    });
  };

  const fetchCostCentreList = (type: COST_CENTRE_TYPES) => {
    _fetchCostCentres(type);
  };
  useEffect(() => {
    try {
      if (!requestConfig || Object.keys(requestConfig).length === 0) {
        form.resetFields();
      }
      if (is_preview) {
        setRequests([
          { title: requestConfig.title, value: requestConfig.title },
        ]);
        form.setFieldsValue({ request_type_legal_entity: requestConfig.title });
      }
      let IsFetchLegalEntites =
        is_travel_type === undefined && requests.length < 1;
      if (IsFetchLegalEntites) {
        _fetchLegalEntities(requestConfig.is_travel_type || false);
      }
      if (requestConfig.is_allow_adding_staff_members_to_requests) {
        _fetchEmployeeList();
      }

      const allowedCostCentresTypes = [];
      if (requestConfig.is_allow_charging_to_cost_centres) {
        allowedCostCentresTypes.push('LOCAL');
        if (!requestDetails) {
          form.setFieldsValue({ charge_to: 'LOCAL' });
        }
        if (requestConfig.is_allow_internal_order_cost_centres) {
          allowedCostCentresTypes.push('INTER');
          fetchCostCentreList('INTER');
        }
        if (requestConfig.is_allow_overseas_cost_centres) {
          allowedCostCentresTypes.push('OVERS');
          fetchCostCentreList('OVERS');
        }
        if (requestConfig.is_allow_3rd_party_vendor) {
          allowedCostCentresTypes.push('THIRD');
        }
        fetchCostCentreList('LOCAL');
      }

      if (
        requestConfig.is_allow_claims_against_request &&
        requestConfig.is_allow_expense_claim_estimation &&
        ((requestConfig.estimation_type as any)?.code === 'ITM' ||
          requestConfig.estimation_type === 'ITM')
      ) {
        if (!is_preview) {
          if (requestDetails && Object.keys(requestDetails).length > 0) {
            if (
              requestConfig.is_allow_claims_against_request &&
              requestConfig.is_allow_expense_claim_estimation &&
              (requestConfig.estimation_type as any).code === 'ITM'
            ) {
              _fetchExpensesForRequest(
                requestDetails.request_type_legal_entity.id + '',
                isAdmin ? requestDetails.employee.id : undefined,
              );
            }
          } else {
            if (
              requestConfig.is_allow_claims_against_request &&
              requestConfig.is_allow_expense_claim_estimation &&
              (requestConfig.estimation_type as any).code === 'ITM'
            ) {
              _fetchExpensesForRequest(
                form.getFieldValue('request_type_legal_entity'),
              );
            }
          }
        } else {
          form.setFieldsValue({
            expense_claim_estimations: requestConfig.allow_claims_against_request_options?.map(
              () => undefined,
            ),
          });
        }
      }
      if (!is_preview) {
        if (
          requestConfig.is_include_flight_booking &&
          (!requestConfig.is_flight_booking_filled_by_admin ||
            (requestConfig.is_travel_insurance_filled_by_admin && isAdmin))
        ) {
          _fetchCountryCurrencies();
        }

        if (
          requestConfig.is_include_hotel_accommodation &&
          (!requestConfig.is_hotel_accommodation_filled_by_admin ||
            (requestConfig.is_hotel_accommodation_filled_by_admin && isAdmin))
        ) {
          _fetchCountryCurrencies();
        }
      }
    } catch (e) {}
  }, [requestConfig]);

  useEffect(() => {
    if (
      requestConfig &&
      Object.keys(requestConfig).length > 0 &&
      requestDetails &&
      default_cost_centre
    ) {
      const allowedCostCentresTypes = [];
      if (requestConfig.is_allow_charging_to_cost_centres) {
        allowedCostCentresTypes.push('LOCAL');
        if (!requestDetails) {
          form.setFieldsValue({ charge_to: 'LOCAL' });
        }
        if (requestConfig.is_allow_internal_order_cost_centres) {
          allowedCostCentresTypes.push('INTER');
        }
        if (requestConfig.is_allow_overseas_cost_centres) {
          allowedCostCentresTypes.push('OVERS');
        }
        if (requestConfig.is_allow_3rd_party_vendor) {
          allowedCostCentresTypes.push('THIRD');
        }
        fetchCostCentreList('LOCAL');
      }
      if (
        !allowedCostCentresTypes.includes(requestDetails?.charge_to.code || '')
      ) {
        form.setFieldsValue({
          cost_centres: default_cost_centre?.uuid,
          charge_to: 'LOCAL',
        });
        setCostCentres(localCostCentres);
      }
    }
  }, [default_cost_centre, requestConfig, requestDetails]);

  useEffect(() => {
    try {
      if (!is_preview) {
        if (
          requestDetails &&
          Object.keys(requestDetails).length > 0 &&
          requests &&
          requests.length > 0
        ) {
          form.setFieldsValue({
            request_type_legal_entity:
              requestDetails.request_type_legal_entity.id,
          });
        }
      }
    } catch (e) {}
  }, [requests, requestDetails]);

  useEffect(() => {
    !isClone &&
      !is_preview &&
      !isAdmin &&
      setRequests(request_type_legal_entity);
  }, [request_type_legal_entity]);

  useEffect(() => {
    message.destroy();
    if (!loader) {
      message.destroy();
    } else {
      if (
        action === ACTION_TYPE.SAVE_DRAFT ||
        action === ACTION_TYPE.SEND_APPROVAL
      ) {
        loadingMessage && message.loading(loadingMessage, 0);
      }
    }
  }, [loader, loadingMessage]);

  useEffect(() => {
    if (error) {
      if (error instanceof Object) {
        if (error.error) {
          message.error(error.error);
        } else {
          message.error('Failed to save request');
          let errors = Object.keys(error).map(item => ({
            name: item,
            errors: error[item],
          }));
          if (error.hotel_accommodations) {
            errors = errors.concat(parseErrors('hotel_accommodations'));
          }
          if (error.flight_details) {
            errors = errors.concat(parseErrors('flight_details'));
          }
          if (error.guest_members) {
            errors = errors.concat(parseErrors('guest_members'));
          }
          if (error.staff_members) {
            errors = errors.concat(parseErrors('staff_members'));
          }
          if (error.expense_claim_estimations) {
            errors = errors.concat(parseErrors('expense_claim_estimations'));
          }
          if (error.travel_itineraries) {
            errors = errors.concat(parseErrors('travel_itineraries'));
          }
          const errorData = errors.flat(2);
          form.setFields(errorData);
          openErrorCarousel(errorData);
        }
      } else if (typeof error === 'string') {
        message.error(error || 'Something went wrong');
      }
    }
  }, [error]);

  const parseErrors = (fieldName: string) => {
    if (error[fieldName] && error[fieldName].length > 0) {
      const errorData = error[fieldName].map((key: string, index: number) =>
        Object.keys(key).map(errorKey => ({
          name: [fieldName, index, errorKey],
          errors: error[fieldName][index][errorKey],
        })),
      );
      return errorData ? errorData : [];
    } else {
      return [];
    }
  };

  useEffect(() => {
    try {
      if (requestDetails && Object.keys(requestDetails).length > 0) {
        const data = {
          ...requestDetails,
          charge_to: requestDetails.charge_to.code,
          request_type_legal_entity: undefined,
          end_date: moment(requestDetails.end_date, 'DD/MM/YYYY'),
          start_date: moment(requestDetails.start_date, 'DD/MM/YYYY'),
          flight_details: requestDetails.flight_details?.map(item => {
            return {
              ...item,
              departure_time: moment(item.departure_time, 'HH:mm'),
              arrival_time: moment(item.arrival_time, 'HH:mm'),
              id: isClone ? undefined : item.id,
              flight_ticket: isClone ? undefined : item.flight_ticket,
              flight_ticket_title: isClone
                ? undefined
                : item?.flight_ticket_title,
              country_currency: item.country_currency?.id,
            };
          }),
          hotel_accommodations: requestDetails.hotel_accommodations?.map(
            item => {
              return {
                ...item,
                check_in_date: moment(item.check_in_date, 'DD/MM/YYYY'),
                check_out_date: moment(item.check_out_date, 'DD/MM/YYYY'),
                id: isClone ? undefined : item.id,
                attachment: isClone ? undefined : item.attachment,
                attachment_title: isClone ? undefined : item?.attachment_title,
                country_currency: item.country_currency?.id,
              };
            },
          ),
          travel_itineraries: requestDetails.travel_itineraries?.map(item => {
            return {
              ...item,
              start_date: moment(item.start_date, 'DD/MM/YYYY'),
              id: isClone ? undefined : item.id,
            };
          }),
          staff_members: requestDetails.staff_members?.map(item => ({
            ...item,
            member: item['employee_id'],
            emp_id: item.emp_id,
          })),
          guest_members: requestDetails.guest_members?.map(item => ({
            ...item,
            id: isClone ? undefined : item.id,
          })),
          cost_centre_uuid_to_route_workflow:
            requestDetails.cost_centre_uuid_to_route_workflow?.uuid,
          expense_claim_estimations: requestDetails.expense_claim_estimations.map(
            item => ({
              ...item,
              id: isClone ? undefined : item.id,
            }),
          ),
          bulk_estimation_amount: Number(
            requestDetails?.bulk_estimation_amount,
          ).toFixed(2),
          cash_advance: Number(requestDetails?.cash_advance).toFixed(2),
        };

        form.setFieldsValue(data);

        if (requestDetails.flight_details?.length === 0) {
          form.setFieldsValue({ flight_details: [{}] });
        }
        if (
          requestDetails.cost_centres &&
          requestDetails.cost_centres.length > 0
        ) {
          form.setFieldsValue({
            cost_centres: requestDetails.cost_centres.map(item => item.uuid),
          });
        }

        setRequests([
          {
            id: requestDetails.request_type_legal_entity.id,
            title: requestDetails.request_type_legal_entity.title,
          },
        ]);
        if (isAdmin) {
          const requestType = requestDetails.request_type_legal_entity;
          setRequests([requestType]);
        }
        const configKey =
          requestDetails.request_type_legal_entity.custom_configuration ||
          requestDetails.request_type_legal_entity.global_configuration;
        _fetchRequestConfig(configKey + '');
        if (!isClone && requestDetails.additional_documents) {
          setDefaultFileList(requestDetails.additional_documents);
        }
      }
    } catch (e) {}
  }, [requestDetails]);

  useEffect(() => {
    try {
      if (
        customFieldForm.current &&
        requestDetails &&
        Object.keys(requestDetails).length > 0 &&
        requestConfig &&
        Object.keys(requestConfig).length > 0
      ) {
        if (requestDetails.custom_fields) {
          // eslint-disable-next-line no-unused-expressions
          customFieldForm?.current?.setValues(requestDetails.custom_fields);
        }
      }
    } catch (e) {}
  }, [requestDetails, requestConfig, customFieldForm.current]);

  const saveCustomValues = () => {
    if (
      requestDetails &&
      Object.keys(requestDetails).length > 0 &&
      requestConfig &&
      Object.keys(requestConfig).length > 0
    ) {
      if (requestDetails.custom_fields) {
        // eslint-disable-next-line no-unused-expressions
        customFieldForm?.current?.setValues(requestDetails.custom_fields);
      }
    }
  };

  const isImgAndPdf = (type: string): boolean => {
    const condition = Boolean(
      type === 'image/jpeg' ||
        type === 'image/png' ||
        type === 'application/pdf' ||
        type === 'image/jfif',
    );

    if (!condition) message.error('Unsupported file type', 2);

    return condition;
  };

  useEffect(() => {
    saveCustomValues();
  }, [customFieldForm.current]);

  useEffect(() => {
    if (!is_preview && !readOnly && !id && !isAdmin) {
      _fetchLegalEntities(is_travel_type);
    }

    if (id && !is_preview) {
      _fetchRequestDetails(id);
    }

    if (isClone && !is_preview && location?.state?.item?.id) {
      _fetchRequestDetails(location?.state?.item?.id);
    }

    return () => {
      if (!is_preview) {
        _resetAllData();
        _resetConfigData();
      }
    };
  }, []);

  const onFieldChange = (changedValues: any) => {
    forceUpdate(prev => !prev);
    if (requestConfig.is_enable_cash_advance) {
      if (changedValues.expense_claim_estimations) {
        const amount = getItemizedTotal(false);
        form.setFieldsValue({ cash_advance: amount });
      }
      if (changedValues.bulk_estimation_amount) {
        form.setFieldsValue({
          cash_advance: changedValues.bulk_estimation_amount,
        });
      }
    }
  };

  useEffect(() => {
    if (!requestDetails && default_cost_centre) {
      form.setFieldsValue({ cost_centres: default_cost_centre.uuid });
    }
  }, [default_cost_centre, requestConfig]);

  const renderCostCentres = () => {
    if (form.getFieldValue('charge_to') === 'THIRD') {
      return (
        <Form.Item
          rules={[
            () => ({
              validator(_, value) {
                if (value !== undefined) {
                  value = value?.trim();
                }
                if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                  return Promise.resolve();
                } else if (!value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Can not start with special character'),
                );
              },
            }),
          ]}
          name='third_party_vendor'
          label={getLabel('third_party_vendor', 'Third party vendor')}
        >
          <Input autoComplete='new-password' disabled={readOnly} />
        </Form.Item>
      );
    }

    return (
      <Form.Item
        name='cost_centres'
        label={getLabel('cost_centre', 'Cost Centre')}
      >
        <Select
          maxTagCount={3}
          showSearch
          disabled={requestConfig.is_employee_cost_centre_readonly || readOnly}
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          // {...props}
        >
          {costCentres.map(item => (
            <Select.Option
              value={item.uuid}
            >{`${item.title} (${item.code})`}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  const renderChargeTo = () => {
    const array = [
      <Select.Option value='LOCAL'>Local cost centre</Select.Option>,
      <Select.Option
        value='OVERS'
        disabled={!Boolean(requestConfig.is_allow_overseas_cost_centres)}
      >
        <Trans>Overseas cost centre</Trans>
      </Select.Option>,
      <Select.Option
        value='INTER'
        disabled={!Boolean(requestConfig.is_allow_internal_order_cost_centres)}
      >
        <Trans>Internal order</Trans>
      </Select.Option>,
      <Select.Option
        value='THIRD'
        disabled={!Boolean(requestConfig.is_allow_3rd_party_vendor)}
      >
        <Trans>Third party vendor</Trans>
      </Select.Option>,
    ];

    return (
      <Form.Item
        name='charge_to'
        label={<Trans>Charge-To</Trans>}
        rules={[
          {
            required: false,
            message: 'Charge to required',
          },
        ]}
      >
        <Select
          showSearch
          defaultValue='LOCAL'
          disabled={requestConfig.is_employee_cost_centre_readonly || readOnly}
          onChange={value => onChargeToChange(value)}
        >
          {array}
        </Select>
      </Form.Item>
    );
  };

  const onChargeToChange = (value: string) => {
    if (value === 'LOCAL') {
      setCostCentres(localCostCentres);
    } else if (value === 'OVERS') {
      setCostCentres(overseasCostCentres);
    } else if (value === 'INTER') {
      setCostCentres(internalCostCentres);
    } else if (value === 'THIRD') {
      setCostCentres([]);
    } else {
      setCostCentres(localCostCentres);
    }
    form.setFieldsValue({
      cost_centres: undefined,
      cost_centre_uuid_to_route_workflow: undefined,
    });

    if (is_preview) {
      if (value === 'LOCAL') {
        setCostCentres([default_cost_centre]);
      }
    }
  };
  const disabledDate = (current: any) => {
    if (requestConfig.is_allow_backdated_requests) {
      const tooEarly =
        moment().diff(current, 'days') >
        requestConfig.backdated_request_period_in_days!;
      return tooEarly;
    } else {
      return current && current < moment().startOf('day');
    }
  };

  const disableEndDates = (current: any) => {
    const startDate = form.getFieldValue('start_date');
    if (startDate) {
      return startDate > current;
    } else {
      return false;
    }
  };

  let canUpdate = true;

  if (isAdmin && requestDetails) {
    const { code } = requestDetails?.workflow_status as any;
    canUpdate =
      isActionAllowed(
        'ACTION_ADMIN_UPDATE_REQUESTS',
        requestDetails?.employee.id,
      ) &&
      (code === 'APPRVD' || code === 'PENDNG' || code === 'STALED');
  } else if (currentDelegationUser && requestDetails) {
    canUpdate =
      currentDelegationUser.on_behalf_of.id === requestDetails?.employee?.id;
  }

  const renderExpenseTypes = (id: number) => {
    const alreadyAttached = form
      .getFieldValue('expense_claim_estimations')
      .map((item: any) => item?.expense_type_legal_entity);

    const list = !is_preview
      ? expenseTypesForRequest
      : requestConfig.allow_claims_against_request_options;

    const items =
      list?.filter((o: any) => !alreadyAttached.includes(o?.id)) || [];

    const currentOption = list?.find(
      (item: any) => item.id === alreadyAttached[id],
    );
    currentOption && items.push(currentOption);

    return items.map((item: any) => (
      <Select.Option value={item.id} key={item.id}>
        {is_preview ? 'Expense' : `${item.expense_type.title}`}
      </Select.Option>
    ));
  };

  const renderItemizedRecords = (fields: any[], add: any, remove: Function) => {
    return (
      <ErrorBoundary>
        <div className='estimation-container'>
          {fields.length > 0 && (
            <Row
              gutter={12}
              style={{
                marginTop: 6,
                marginBottom: 12,
              }}
            >
              <Col span={11}>
                <Trans>Type</Trans>
              </Col>
              <Col span={11} style={{ paddingLeft: 8 }}>
                <Trans>Amount</Trans>
              </Col>
            </Row>
          )}
          {fields?.map(field => (
            <Row gutter={rowGutter} key={field.key}>
              <Col span={11}>
                <Form.Item
                  name={[field.name, 'expense_type_legal_entity']}
                  rules={[
                    {
                      required: true,
                      message: 'Estimation Type required',
                    },
                  ]}
                >
                  <Select disabled={readOnly}>
                    {renderExpenseTypes(field.name)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={11}>
                <div
                  style={{
                    borderRadius: 4,
                  }}
                >
                  <Form.Item
                    name={[field.name, 'estimated_amount']}
                    rules={[
                      {
                        required: true,
                        message: 'Estimation Amount required',
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder='00.00'
                      min={0}
                      maxLength={15}
                      disabled={readOnly}
                      precision={2}
                    />
                  </Form.Item>
                </div>
              </Col>
              {(fields.length > 1 || !requestConfig.is_estimation_mandatory) &&
                !readOnly && (
                  <Col flex='none'>
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                      style={{ fontSize: '16px', marginTop: 8 }}
                    />
                  </Col>
                )}
            </Row>
          ))}
          {requestConfig.is_estimation_mandatory &&
            fields.length === 0 &&
            add()}
          {fields.length <
            (expenseTypesForRequest?.length ||
              requestConfig?.allow_claims_against_request_options?.length ||
              0) && AnotherLine(add)}
        </div>
      </ErrorBoundary>
    );
  };

  const validateEndDate = (_rule: any, val: any, getFieldsValue: any) => {
    const startDate = getFieldsValue('start_date');
    if (val && startDate && val.isBefore(startDate)) {
      return Promise.reject('End Date cannot be greater than start date');
    } else {
      return Promise.resolve();
    }
  };

  const getOptions = (list: any[]) => {
    return list.map(item => (
      <Select.Option value={item.id} key={item.id}>
        {item.title}
      </Select.Option>
    ));
  };

  const renderStaffMemberOptions = (id: number) => {
    const alreadyAttached = form
      .getFieldValue('staff_members')
      .map((item: any) => item?.member);

    const items =
      employeeList?.filter(
        (o: any) => !alreadyAttached.includes(o.employee_id),
      ) || [];

    const currentOption = employeeList?.find(
      (item: any) => item.employee_id === alreadyAttached[id],
    );
    currentOption && items.push(currentOption);

    return items.map((item: any) => (
      <Select.Option value={item.employee_id} key={item.id}>
        {item.legal_name || item.employee__name}
      </Select.Option>
    ));
  };

  const selectStaffMember = (value: any) => {
    const employee = employeeList?.find(item => item.employee_id === value);
    const staffIndex = form
      .getFieldValue('staff_members')
      .findIndex((item: any) => item?.member === value);
    const staffMembers = form.getFieldValue('staff_members');

    const selectedMember = {
      member: value,
      emp_id: employee.emp_id,
    };
    staffMembers[staffIndex] = selectedMember;
    form.setFieldsValue({ staff_members: staffMembers });
  };

  const renderStaffMembers = (
    type: 'staff' | 'guest',
    fields: any[],
    add: any,
    remove: Function,
  ) => (
    <>
      {fields.map(field => (
        <Row
          key={field.key}
          gutter={rowGutter}
          className='table-row staff-guest-table'
        >
          <Col span={11} className='align-self'>
            <Form.Item
              className='attendee-table'
              label={
                type === 'staff'
                  ? getLabel('staff_members', 'Staff Members')
                  : getLabel('guest_members', 'Guest Members')
              }
              name={[field.name, 'member']}
              rules={[
                {
                  required: true,
                  message: `Select ${type} name`,
                },
              ]}
            >
              {type === 'staff' ? (
                <Select
                  onSelect={selectStaffMember}
                  disabled={readOnly}
                  className='staff-guest-placeholder'
                  showSearch={true}
                  placeholder={'eg. Adam'}
                  filterOption={(input: any, option: any) =>
                    (option.children || '')
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {renderStaffMemberOptions(field.name)}
                </Select>
              ) : (
                <Input
                  autoComplete='new-password'
                  className='staff-guest-placeholder'
                  disabled={readOnly}
                  placeholder={'eg. Paul'}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              className='attendee-table'
              label={
                type === 'staff'
                  ? getLabel('staff_employee_id', <Trans>Employee ID</Trans>)
                  : 'organisation'
              }
              name={[field.name, type === 'staff' ? 'emp_id' : 'organisation']}
              required
              rules={[
                () => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      value = value?.trim();
                    }
                    if ((!value || value === undefined) && type === 'guest') {
                      return Promise.reject(`Select organisation`);
                    }
                    if ((!value || value === undefined) && type === 'staff') {
                      return Promise.reject(`Employee ID is required`);
                    } else {
                      if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                        return Promise.resolve();
                      }
                      if (!value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Can not start with special character'),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input
                autoComplete='new-password'
                placeholder={
                  type === 'staff' ? 'eg. RA10001' : 'eg. Rolling Arrays'
                }
                disabled={type === 'staff' || readOnly}
              />
            </Form.Item>
          </Col>
          {type === 'staff' ? (
            !requestConfig.are_staff_members_mandatory && !readOnly ? (
              <Col flex='none'>
                <CloseOutlined
                  onClick={() => {
                    remove(field.name);
                  }}
                  style={{ fontSize: '16px' }}
                />
              </Col>
            ) : (
              fields.length > 1 &&
              !readOnly && (
                <Col flex='none'>
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                    style={{ fontSize: '16px' }}
                  />
                </Col>
              )
            )
          ) : !requestConfig.are_guest_members_mandatory && !readOnly ? (
            <Col flex='none'>
              <CloseOutlined
                onClick={() => {
                  remove(field.name);
                }}
                style={{ fontSize: '16px' }}
              />
            </Col>
          ) : (
            fields.length > 1 &&
            !readOnly && (
              <Col flex='none'>
                <CloseOutlined
                  onClick={() => {
                    remove(field.name);
                  }}
                  style={{ fontSize: '16px' }}
                />
              </Col>
            )
          )}
        </Row>
      ))}
      {type === 'staff'
        ? fields.length === 0 &&
          requestConfig.are_staff_members_mandatory &&
          add()
        : fields.length === 0 &&
          requestConfig.are_guest_members_mandatory &&
          add()}

      {AnotherLine(add)}
    </>
  );

  const AnotherLine = (add: () => void) =>
    !readOnly && (
      <Form.Item noStyle>
        <Button onClick={() => add()} type='link' className='add-btn-container'>
          <PlusOutlined style={{ fontSize: 12, marginRight: 6 }} />
          <Trans>Add Another</Trans>
        </Button>
      </Form.Item>
    );

  const processData = <U extends keyof RequestDetails>(
    values: any,
    field: U,
  ) => {
    try {
      if (requestDetails && requestDetails[field]) {
        const newRecords = values[field]?.map((item: any) => item.id) || [];
        const deletedRecords = (requestDetails[field] as any[])
          .map((item: any) => {
            if (!newRecords.includes(item.id)) {
              let obj = {
                ...item,
                is_deleted: true,
              };
              if (
                field === 'flight_details' ||
                field === 'hotel_accommodations'
              ) {
                obj.country_currency = item.country_currency.id;
              }
              return obj;
            } else {
              return undefined;
            }
          })
          .filter((item: any) => item);
        const travelItineraries = [...(values[field] || []), ...deletedRecords];
        return travelItineraries;
      }
    } catch (e) {}
  };
  const saveAsDraft = async (isSubmit: boolean) => {
    try {
      const values = await form.validateFields();
      const customForm = customFieldForm?.current?.getCustomFieldFormInstance();
      if (customForm) {
        await customForm.validateFields();
        const custFields = customFieldForm?.current.getpostData();
        values.custom_fields = custFields;
      }

      if (id) {
        if (!requestDetails) return;

        values.travel_itineraries = processData(values, 'travel_itineraries');
        values.guest_members = processData(values, 'guest_members');

        values.expense_claim_estimations = processData(
          values,
          'expense_claim_estimations',
        );

        if (
          isAdmin ||
          (!requestConfig.is_hotel_accommodation_filled_by_admin && !isAdmin)
        ) {
          values.hotel_accommodations = processData(
            values,
            'hotel_accommodations',
          );
        }

        if (
          isAdmin ||
          (!requestConfig.is_flight_booking_filled_by_admin && !isAdmin)
        ) {
          values.flight_details = processData(values, 'flight_details');
        }

        values.remove_additional_documents = deletedList.join(',');
      }

      let formData = new FormData();
      Object.keys(values).forEach((key: string) => {
        if (values[key]) {
          values[key] instanceof Object && values[key] instanceof Array
            ? formData.set(key, JSON.stringify(values[key]))
            : formData.set(key, values[key]);
        }
      });
      if (values.staff_members) {
        formData.delete('staff_members');
        values.staff_members.map((item: any) =>
          formData.append('staff_members', item.member),
        );
      }
      if (values.cost_centres) {
        formData.delete('cost_centres');
        typeof values.cost_centres === 'object'
          ? values.cost_centres.map((item: any) =>
              formData.append('cost_centres', item),
            )
          : formData.append('cost_centres', values.cost_centres);
      }
      if (values.flight_details && values.flight_details.length > 0) {
        formData.delete('flight_details');
        const data = values.flight_details
          .filter((item: any) => (item.airlines ? true : false))
          .map((item: any, index: number) => {
            const newItem = {
              ...item,
              is_file_attached: item.flight_ticket ? true : false,
              arrival_time: isMoment(item.arrival_time)
                ? item.arrival_time?.format('HH:mm')
                : item.arrival_time,
              departure_time: isMoment(item.departure_time)
                ? item.departure_time?.format('HH:mm')
                : item.departure_time,
            };

            if (item.id) {
              const oldItem = requestDetails?.flight_details?.find(
                data => data.id === item.id,
              );
              if (oldItem?.flight_ticket && !item.flight_ticket) {
                newItem.is_file_removed = true;
                newItem.is_file_attached = true;
              }
              if (oldItem?.flight_ticket === item.flight_ticket) {
                newItem.is_file_attached = false;
                newItem.flight_ticket = undefined;
              } else {
                newItem.is_file_attached = true;
                item.flight_ticket &&
                  formData.append(
                    'flight_details_files_' + (index + 1),
                    item.flight_ticket.file,
                  );
              }
            } else {
              item.flight_ticket &&
                formData.append(
                  'flight_details_files_' + (index + 1),
                  item.flight_ticket.file,
                );
            }
            return newItem;
          });
        formData.set('flight_details', JSON.stringify(data));
      }
      if (
        values.hotel_accommodations &&
        values.hotel_accommodations.length > 0
      ) {
        formData.delete('hotel_accommodations');
        const data = values.hotel_accommodations
          .filter((item: any) => (item.hotel_name ? true : false))
          .map((item: any, index: number) => {
            const newItem = {
              ...item,
              is_file_attached: item.attachment ? true : false,
              check_in_date: isMoment(item.check_in_date)
                ? moment(item.check_in_date).format('YYYY-MM-DD')
                : item.check_in_date,
              check_out_date: isMoment(item.check_out_date)
                ? moment(item.check_out_date).format('YYYY-MM-DD')
                : item.check_out_date,
            };

            if (item.id) {
              const oldItem = requestDetails?.hotel_accommodations?.find(
                data => data.id === item.id,
              );
              if (oldItem?.attachment && !item.attachment) {
                newItem.is_file_removed = true;
                newItem.is_file_attached = true;
              }
              if (oldItem?.attachment === item.attachment) {
                newItem.is_file_attached = false;
                newItem.attachment = undefined;
              } else {
                newItem.is_file_attached = true;
                newItem.attachment &&
                  formData.append(
                    'hotel_accommodation_files_' + (index + 1),
                    item.attachment.file,
                  );
              }
            } else {
              item.attachment &&
                formData.append(
                  'hotel_accommodation_files_' + (index + 1),
                  item.attachment.file,
                );
            }
            return newItem;
          });
        formData.set('hotel_accommodations', JSON.stringify(data));
      }

      if (values.travel_itineraries) {
        formData.delete('travel_itineraries');
        const data = values.travel_itineraries.map((item: any) => {
          const obj = {
            ...item,
            start_date: isMoment(item.start_date)
              ? moment(item.start_date).format('YYYY-MM-DD')
              : moment(item.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          };
          return obj;
        });
        formData.set('travel_itineraries', JSON.stringify(data));
      }

      formData.set('start_date', values.start_date.format('YYYY-MM-DD'));
      formData.set('end_date', values.end_date.format('YYYY-MM-DD'));
      if (isSubmit) {
        setAction(ACTION_TYPE.SEND_APPROVAL);
      } else {
        setAction(ACTION_TYPE.SAVE_DRAFT);
      }

      fileList.forEach((file: any) => {
        formData.append('additional_documents', file);
      });
      _createDraft(formData, id, isSubmit, isAdmin, () => {
        customFieldForm.current.clearCustomFieldForm();
        form.resetFields();
        _resetAllData();
        _resetConfigData();
      });
    } catch (e) {
      if (e.errorFields) {
        openErrorCarousel(e.errorFields);
      }
    }
  };

  const openErrorCarousel = (errorFields: any[]) => {
    const fields = errorFields.flatMap((item: any) => item.name);
    if (fields.includes('guest_members')) {
      setGuestActiveKey(GUEST_TABLE_KEY);
    }
    if (fields.includes('expense_claim_estimations')) {
      setEstimationActiveKey(ESTIMATION_TABLE_KEY);
    }
    if (fields.includes('staff_members')) {
      setStaffActiveKey(STAFF_TABLE_KEY);
    }
    if (fields.includes('flight_details')) {
      setFlightActiveKey(FLIGHT_TABLE_KEY);
    }
    if (fields.includes('hotel_accommodations')) {
      setHotelActiveKey(HOTEL_TABLE_KEY);
    }
    if (fields.includes('travel_itineraries')) {
      setTravelActiveKey(TRAVEL_TABLE_KEY);
    }
  };

  const onDeleteAttachment = () => {
    const { index, type } = attachmentPath!;
    if (type === 'flight') {
      const flight_details = form.getFieldValue('flight_details');
      const newFlightDetails = [...flight_details];

      newFlightDetails[index].flight_ticket = undefined;
      form.setFieldsValue({ flight_details: newFlightDetails });
    } else {
      const hotel_accommodation = form.getFieldValue('hotel_accommodations');
      const newHotelDetails = [...hotel_accommodation];

      newHotelDetails[index].attachment = undefined;
      form.setFieldsValue({ hotel_accommodations: hotel_accommodation });
    }
    setAttachmentPath(undefined);
  };

  const openFlightTicket = (fieldName: number) => {
    const flight_details = form.getFieldValue('flight_details');
    const newFlightDetails = [...flight_details];
    const file =
      typeof newFlightDetails[fieldName].flight_ticket === 'string'
        ? newFlightDetails[fieldName].flight_ticket
        : newFlightDetails[fieldName].flight_ticket.file;
    const obj: ATTACHMENT = {
      index: fieldName,
      type: 'flight',
      file,
    };
    setAttachmentPath(obj);
  };

  const getFlightFileName = (fieldName: number) => {
    const flight_details = form.getFieldValue('flight_details');
    const newFlightDetails = [...flight_details];
    const fileName =
      typeof newFlightDetails[fieldName]?.flight_ticket === 'string'
        ? newFlightDetails[fieldName]?.flight_ticket_title || 'Attachment'
        : newFlightDetails[fieldName]?.flight_ticket?.file?.name;
    return fileName;
  };

  const getHotelFileName = (fieldName: number) => {
    const hotel_accommodation = form.getFieldValue('hotel_accommodations');
    const newHotelDetails = [...hotel_accommodation];
    const fileName =
      typeof newHotelDetails[fieldName]?.attachment === 'string'
        ? newHotelDetails[fieldName]?.attachment_title || 'Attachment'
        : newHotelDetails[fieldName]?.attachment?.file?.name;
    return fileName;
  };

  const openHotelAttachment = (fieldName: number) => {
    const hotel_accommodation = form.getFieldValue('hotel_accommodations');
    const newHotelDetails = [...hotel_accommodation];
    const file =
      typeof newHotelDetails[fieldName].attachment === 'string'
        ? newHotelDetails[fieldName].attachment
        : newHotelDetails[fieldName].attachment.file;

    const obj: ATTACHMENT = {
      index: fieldName,
      type: 'hotel',
      file,
    };

    setAttachmentPath(obj);
  };

  const onChangeRequest = (value: string) => {
    const obj = requests.find(item => item.id === value);
    const configKey = obj.custom_configuration || obj.global_configuration;
    form.resetFields();
    form.setFieldsValue({ request_type_legal_entity: value });
    _fetchRequestConfig(configKey);
    onSelectRequestType && onSelectRequestType(value);
  };

  const renderCurrencies = () => {
    return currencies.map(item => (
      <Select.Option
        value={item.id}
        key={item.id}
        title={`${item.currency.title} (${item.currency.code})`}
      >
        {item.currency.title}({item.currency.code})
      </Select.Option>
    ));
  };

  const dataLabel = is_preview
    ? labelData
    : (requestConfig as any)?.label_mapping;

  const getLabel = (key: any, _default: any) => {
    return dataLabel?.[key]?.mapped || _default;
  };
  const fromDate = form.getFieldValue('start_date');
  const toDate = form.getFieldValue('end_date');
  const duration =
    fromDate && toDate ? moment(toDate).diff(fromDate, 'days') + 1 : 0;

  const disabledMultiCityDates = (current: any) => {
    const fromDate = form.getFieldValue('start_date');
    const toDate = form.getFieldValue('end_date');
    return !current.isBetween(fromDate, toDate, 'day', '[]');
  };

  const getCompletedCount = () => {
    return (
      form
        .getFieldValue('expense_claim_estimations')
        ?.filter(
          (item: any) =>
            item?.expense_type_legal_entity && item?.estimated_amount,
        ).length || 0
    );
  };

  const getItemizedTotal = (includeCashAdvance: boolean = true) => {
    const amount = form
      .getFieldValue('expense_claim_estimations')
      ?.reduce((sum: number, item: any) => {
        const expense = expenseTypesForRequest?.find(
          i => item?.expense_type_legal_entity === i.id,
        );
        if (!includeCashAdvance && expense?.exclude_from_cash_advance) {
          return sum;
        } else {
          return sum + +(item?.estimated_amount || 0);
        }
      }, 0);

    return (amount || 0).toFixed(2).toString();
  };

  const updateLocation = (
    selection: any,
    fieldName: number,
    name: 'source' | 'destination',
  ) => {
    const travel_itineraries = form.getFieldValue('travel_itineraries');
    const new_travel_itineraries = [...travel_itineraries];
    new_travel_itineraries[fieldName][name] = selection;

    form.setFieldsValue({
      travel_itineraries: new_travel_itineraries,
    });
  };

  const disabledCheckOutDates = (current: any, index: number) => {
    const hotel_accommodations = form.getFieldValue('hotel_accommodations');
    let checkIn = hotel_accommodations[index]?.check_in_date;
    const fromDate = form.getFieldValue('start_date');
    const toDate = form.getFieldValue('end_date');
    checkIn = checkIn || fromDate;
    return !current.isBetween(checkIn, toDate, 'day', '[]');
  };

  const totalExpenseCount = expenseTypesForRequest
    ? expenseTypesForRequest.length
    : requestConfig.allow_claims_against_request_options?.length;

  let colSpan: any = {
    xs: 24,
  };
  if (!readOnly) {
    colSpan = { md: 24, lg: 20, xs: 24, sm: 24, xl: 16, xll: 18 };
  }

  const documentsSpan = { md: 24, lg: 4, xs: 24, sm: 24, xl: 8, xll: 6 };

  const Container = (id && !is_preview) || isClone ? HeaderBarWrapper : Row;
  const containerProps: any =
    (id && !is_preview) || isClone
      ? {
          headerCommonProps: { title: `${isClone ? 'Add' : 'Update'} Request` },
        }
      : {};
  return (
    <ErrorBoundary>
      <Container {...containerProps}>
        {attachmentPath && (
          <Modal
            closable={true}
            onCancel={() => setAttachmentPath(undefined)}
            okText='Delete'
            onOk={onDeleteAttachment}
            centered
            visible={true}
            title={attachmentPath.file.name}
            style={{ width: 'auto', height: 'auto', transformOrigin: 'unset' }}
            width='auto'
          >
            {isPdfFile(attachmentPath.file) ? (
              <PDFViewer showPdfIcon={false} file={attachmentPath.file} />
            ) : (
              <img
                alt='attachment'
                style={{ width: 450, height: 650 }}
                src={
                  typeof attachmentPath.file === 'string'
                    ? attachmentPath.file
                    : window.URL.createObjectURL(attachmentPath.file)
                }
              />
            )}
          </Modal>
        )}

        <div
          className={`add-request-config-form-container ${
            readOnly ? 'view-only-disabled' : ''
          }`}
          style={{
            padding: is_preview || readOnly ? '0px 0px 0px' : '10px 50px 50px',
          }}
        >
          {isDataLoading && requestLegalEntitiesLoading ? (
            <SkeletonItem type='Form' />
          ) : (
            <div>
              {!readOnly && (
                <FilterBar
                  tips={
                    requestConfig.instruction_text
                      ? [requestConfig.instruction_text]
                      : ['No Instructions']
                  }
                  isAddButton={false}
                  enableBackBtn={isAdmin}
                  backBtnUrl={location?.state?.backButtonUrl || undefined}
                />
              )}
              {canUpdate ? (
                <div>
                  <Row gutter={[24, 23]}>
                    <Col {...colSpan}>
                      <div className='form-container'>
                        <Form
                          form={form}
                          layout='vertical'
                          onValuesChange={onFieldChange}
                          size='middle'
                        >
                          {/* Editable only when new request or in draft */}
                          <Row></Row>
                          {requestDetails &&
                            requestDetails.request_no &&
                            !isClone && (
                              <Form.Item
                                label={<Trans>Request Claim No.</Trans>}
                                name='request_no'
                              >
                                <InputNumber
                                  disabled
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            )}
                          <>
                            <Form.Item
                              name='request_type_legal_entity'
                              label={getLabel('request_type', 'Request Type')}
                              rules={[
                                {
                                  required: true,
                                  message: 'Request type required',
                                },
                              ]}
                            >
                              <Select
                                onChange={onChangeRequest}
                                disabled={
                                  requests.length === 0
                                    ? true
                                    : id || readOnly
                                    ? true
                                    : false
                                }
                                showSearch={true}
                                filterOption={(input: any, option: any) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {getOptions(requests)}
                              </Select>
                            </Form.Item>

                            {requests.length === 0 &&
                              !(
                                requestDetails &&
                                Object.keys(requestDetails).length > 0
                              ) &&
                              !requestLegalEntitiesLoading && (
                                <div>
                                  <Trans>
                                    User is not eligible for this Request Type
                                  </Trans>
                                </div>
                              )}
                          </>

                          {requestConfig.is_allow_remark && (
                            <Form.Item
                              name='purpose'
                              label={getLabel('remark', 'Description/Purpose')}
                              required={requestConfig.is_remark_mandatory}
                              rules={[
                                () => ({
                                  validator(_, value) {
                                    if (value !== undefined) {
                                      value = value?.trim();
                                    }
                                    if (
                                      (!value || value === undefined) &&
                                      requestConfig.is_remark_mandatory
                                    ) {
                                      return Promise.reject(
                                        `${getLabel(
                                          'remark',
                                          'Description/Purpose',
                                        )} is mandatory`,
                                      );
                                    } else {
                                      if (
                                        new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                                          value,
                                        )
                                      ) {
                                        return Promise.resolve();
                                      } else if (!value) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error(
                                          'Can not start with special character',
                                        ),
                                      );
                                    }
                                  },
                                }),
                              ]}
                            >
                              <Input
                                autoComplete='new-password'
                                disabled={readOnly}
                              />
                            </Form.Item>
                          )}
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                label={getLabel('from_date', 'From Date')}
                                name='start_date'
                                rules={[
                                  {
                                    required: true,
                                    message: 'This field required',
                                  },
                                ]}
                              >
                                <DatePicker
                                  style={{ width: '100%' }}
                                  disabledDate={disabledDate}
                                  disabled={readOnly || isAdmin}
                                  format={DATE_FORMAT}
                                  onChange={onStartDateSelect}
                                  showToday={false}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={10}>
                              <Form.Item
                                label={getLabel('to_date', 'To Date')}
                                name='end_date'
                                dependencies={['start_date']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'This field required',
                                  },
                                  ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                      return validateEndDate(
                                        rule,
                                        value,
                                        getFieldValue,
                                      );
                                    },
                                  }),
                                ]}
                              >
                                <DatePicker
                                  style={{ width: '100%' }}
                                  disabledDate={disableEndDates}
                                  disabled={
                                    (form.getFieldValue('start_date')
                                      ? false
                                      : true) ||
                                    readOnly ||
                                    isAdmin
                                  }
                                  format={DATE_FORMAT}
                                  showToday={false}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item label={<Trans>Duration</Trans>}>
                                <div>
                                  {duration} {duration <= 1 ? 'Day' : 'Days'}
                                </div>
                              </Form.Item>
                            </Col>
                          </Row>
                          {(is_travel_type || requestConfig.is_travel_type) && (
                            <div data-testId='travel_data'>
                              <Form.Item
                                name='is_multi_destination_trip'
                                label=''
                                valuePropName='checked'
                              >
                                <Checkbox
                                  onChange={e => {
                                    if (e.target.checked) {
                                      form.setFieldsValue({
                                        travel_itineraries: [
                                          {
                                            start_date: form.getFieldValue(
                                              'start_date',
                                            ),
                                          },
                                        ],
                                        arrival_at: '',
                                        departure_from: '',
                                      });
                                    } else {
                                      form.setFieldsValue({
                                        travel_itineraries: [],
                                      });
                                    }
                                  }}
                                  disabled={readOnly || isAdmin}
                                >
                                  <Trans>Multi City</Trans>
                                </Checkbox>
                              </Form.Item>

                              {form.getFieldValue(
                                'is_multi_destination_trip',
                              ) ? (
                                <Form.Item>
                                  <Collapse
                                    expandIconPosition='right'
                                    defaultActiveKey={[TRAVEL_TABLE_KEY]}
                                    activeKey={travelActiveKey}
                                    onChange={key => setTravelActiveKey(key)}
                                  >
                                    <Collapse.Panel
                                      header={
                                        <CustomizeTabName
                                          title={
                                            <Trans>Travel Itineraries</Trans>
                                          }
                                          count={
                                            form.getFieldValue(
                                              'travel_itineraries',
                                            )?.length || 0
                                          }
                                          icon=' . '
                                        />
                                      }
                                      key={TRAVEL_TABLE_KEY}
                                    >
                                      <div className='travel-records'>
                                        <Row
                                          gutter={12}
                                          style={{ marginBottom: 6 }}
                                        >
                                          <Col span={8}>
                                            <div>
                                              <Trans>Start Date</Trans>
                                            </div>
                                          </Col>
                                          <Col span={7}>
                                            <div>
                                              <Trans>Depart From</Trans>
                                            </div>
                                          </Col>
                                          <Col span={7}>
                                            <div>
                                              <Trans>Arrive At</Trans>
                                            </div>
                                          </Col>
                                        </Row>
                                        <Form.List name='travel_itineraries'>
                                          {(fields, { add, remove }) => {
                                            return (
                                              <div>
                                                {fields.map((field, index) => (
                                                  <Row
                                                    gutter={rowGutter}
                                                    key={field.key}
                                                    className='table-row'
                                                    style={{
                                                      alignItems: 'baseline',
                                                    }}
                                                  >
                                                    <Col span={8}>
                                                      <Form.Item
                                                        name={[
                                                          field.name,
                                                          'start_date',
                                                        ]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              'This field is required',
                                                          },
                                                        ]}
                                                      >
                                                        <DatePicker
                                                          style={{
                                                            width: '100%',
                                                          }}
                                                          disabled={
                                                            readOnly || isAdmin
                                                          }
                                                          format={DATE_FORMAT}
                                                          showToday={false}
                                                          disabledDate={current =>
                                                            disabledMultiCityDates(
                                                              current,
                                                            )
                                                          }
                                                        />
                                                      </Form.Item>
                                                    </Col>
                                                    <Col
                                                      span={7}
                                                      style={{
                                                        paddingBottom: 24,
                                                      }}
                                                    >
                                                      <Form.Item
                                                        required
                                                        rules={[
                                                          () => ({
                                                            validator(
                                                              _,
                                                              value,
                                                            ) {
                                                              if (
                                                                value !==
                                                                undefined
                                                              ) {
                                                                value = value?.trim();
                                                              }
                                                              if (
                                                                !value ||
                                                                value ===
                                                                  undefined
                                                              ) {
                                                                return Promise.reject(
                                                                  'This field is required',
                                                                );
                                                              } else {
                                                                if (
                                                                  new RegExp(
                                                                    /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                                  ).test(value)
                                                                ) {
                                                                  return Promise.resolve();
                                                                }
                                                                return Promise.reject(
                                                                  new Error(
                                                                    'Can not start with special character',
                                                                  ),
                                                                );
                                                              }
                                                            },
                                                          }),
                                                        ]}
                                                        name={[
                                                          field.name,
                                                          'source',
                                                        ]}
                                                        style={{
                                                          marginBottom: 0,
                                                        }}
                                                      >
                                                        {isAutoCompleteDisable ? (
                                                          <CustomPlacesAutocomplete
                                                            defaultValue={
                                                              form.getFieldValue(
                                                                'travel_itineraries',
                                                              )[index]?.source
                                                            }
                                                            onSelect={(
                                                              value: any,
                                                            ) => {
                                                              updateLocation(
                                                                value,
                                                                field.name,
                                                                'source',
                                                              );
                                                            }}
                                                          />
                                                        ) : (
                                                          <Autocomplete
                                                            apiKey={
                                                              process.env
                                                                .REACT_APP_GOOGLE_API_KEY
                                                            }
                                                            onPlaceSelected={place => {
                                                              updateLocation(
                                                                place.formatted_address,
                                                                field.name,
                                                                'source',
                                                              );
                                                            }}
                                                            inputAutocompleteValue='new-password'
                                                            options={{
                                                              types: [],
                                                            }}
                                                            defaultValue={form.getFieldValue(
                                                              'source',
                                                            )}
                                                          />
                                                        )}
                                                      </Form.Item>
                                                    </Col>
                                                    <Col
                                                      span={7}
                                                      style={{
                                                        paddingBottom: 24,
                                                      }}
                                                    >
                                                      <Form.Item
                                                        required
                                                        rules={[
                                                          () => ({
                                                            validator(
                                                              _,
                                                              value,
                                                            ) {
                                                              if (
                                                                value !==
                                                                undefined
                                                              ) {
                                                                value = value?.trim();
                                                              }
                                                              if (
                                                                !value ||
                                                                value ===
                                                                  undefined
                                                              ) {
                                                                return Promise.reject(
                                                                  'This field is required',
                                                                );
                                                              } else {
                                                                if (
                                                                  new RegExp(
                                                                    /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                                  ).test(value)
                                                                ) {
                                                                  return Promise.resolve();
                                                                }
                                                                return Promise.reject(
                                                                  new Error(
                                                                    'Can not start with special character',
                                                                  ),
                                                                );
                                                              }
                                                            },
                                                          }),
                                                        ]}
                                                        name={[
                                                          field.name,
                                                          'destination',
                                                        ]}
                                                        style={{
                                                          marginBottom: 0,
                                                        }}
                                                      >
                                                        {isAutoCompleteDisable ? (
                                                          <CustomPlacesAutocomplete
                                                            defaultValue={
                                                              form.getFieldValue(
                                                                'travel_itineraries',
                                                              )[index]
                                                                ?.destination
                                                            }
                                                            onSelect={(
                                                              value: any,
                                                            ) => {
                                                              updateLocation(
                                                                value,
                                                                field.name,
                                                                'destination',
                                                              );
                                                            }}
                                                          />
                                                        ) : (
                                                          <Autocomplete
                                                            apiKey={
                                                              process.env
                                                                .REACT_APP_GOOGLE_API_KEY
                                                            }
                                                            onPlaceSelected={place => {
                                                              updateLocation(
                                                                place.formatted_address,
                                                                field.name,
                                                                'destination',
                                                              );
                                                            }}
                                                            inputAutocompleteValue='new-password'
                                                            options={{
                                                              types: [],
                                                            }}
                                                            defaultValue={form.getFieldValue(
                                                              'destination',
                                                            )}
                                                          />
                                                        )}
                                                      </Form.Item>
                                                    </Col>
                                                    {fields.length > 1 &&
                                                      !readOnly && (
                                                        <Col flex='none'>
                                                          <CloseOutlined
                                                            className='dynamic-delete-button'
                                                            onClick={() => {
                                                              remove(
                                                                field.name,
                                                              );
                                                            }}
                                                            style={{
                                                              fontSize: '16px',
                                                            }}
                                                          />
                                                        </Col>
                                                      )}
                                                  </Row>
                                                ))}
                                                {fields.length === 0 && add()}
                                                {!isAdmin && AnotherLine(add)}
                                              </div>
                                            );
                                          }}
                                        </Form.List>
                                      </div>
                                    </Collapse.Panel>
                                  </Collapse>
                                </Form.Item>
                              ) : (
                                <Row gutter={24} style={{ marginBottom: 24 }}>
                                  <Col span={12}>
                                    <Form.Item
                                      label={<Trans>Depart From</Trans>}
                                      name='departure_from'
                                      style={{ marginBottom: 0 }}
                                      required
                                      rules={[
                                        () => ({
                                          validator(_, value) {
                                            if (value !== undefined) {
                                              value = value?.trim();
                                            }
                                            if (!value || value === undefined) {
                                              return Promise.reject(
                                                'This field required',
                                              );
                                            } else {
                                              if (
                                                new RegExp(
                                                  /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                ).test(value)
                                              ) {
                                                return Promise.resolve();
                                              }
                                              return Promise.reject(
                                                new Error(
                                                  'Can not start with special character',
                                                ),
                                              );
                                            }
                                          },
                                        }),
                                      ]}
                                    >
                                      {isAutoCompleteDisable ? (
                                        <CustomPlacesAutocomplete
                                          defaultValue={form.getFieldValue(
                                            'departure_from',
                                          )}
                                          onSelect={(value: any) => {
                                            form.setFieldsValue({
                                              departure_from: value,
                                            });
                                          }}
                                        />
                                      ) : (
                                        <Autocomplete
                                          apiKey={
                                            process.env.REACT_APP_GOOGLE_API_KEY
                                          }
                                          onPlaceSelected={place => {
                                            form.setFieldsValue({
                                              departure_from:
                                                place.formatted_address,
                                            });
                                          }}
                                          inputAutocompleteValue='new-password'
                                          options={{
                                            types: [],
                                          }}
                                          defaultValue={form.getFieldValue(
                                            'departure_from',
                                          )}
                                        />
                                      )}
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      label={<Trans>Arrive At</Trans>}
                                      name='arrival_at'
                                      style={{ marginBottom: 0 }}
                                      required
                                      rules={[
                                        () => ({
                                          validator(_, value) {
                                            if (value !== undefined) {
                                              value = value?.trim();
                                            }
                                            if (!value || value === undefined) {
                                              return Promise.reject(
                                                'This field required',
                                              );
                                            } else {
                                              if (
                                                new RegExp(
                                                  /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                ).test(value)
                                              ) {
                                                return Promise.resolve();
                                              }
                                              return Promise.reject(
                                                new Error(
                                                  'Can not start with special character',
                                                ),
                                              );
                                            }
                                          },
                                        }),
                                      ]}
                                    >
                                      {isAutoCompleteDisable ? (
                                        <CustomPlacesAutocomplete
                                          defaultValue={form.getFieldValue(
                                            'arrival_at',
                                          )}
                                          onSelect={(value: any) => {
                                            form.setFieldsValue({
                                              arrival_at: value,
                                            });
                                          }}
                                        />
                                      ) : (
                                        <Autocomplete
                                          apiKey={
                                            process.env.REACT_APP_GOOGLE_API_KEY
                                          }
                                          onPlaceSelected={place => {
                                            form.setFieldsValue({
                                              arrival_at:
                                                place.formatted_address,
                                            });
                                          }}
                                          inputAutocompleteValue='new-password'
                                          options={{
                                            types: [],
                                          }}
                                          defaultValue={form.getFieldValue(
                                            'arrival_at',
                                          )}
                                        />
                                      )}
                                    </Form.Item>
                                  </Col>
                                </Row>
                              )}
                            </div>
                          )}
                          {requestConfig.is_allow_claims_against_request &&
                            requestConfig.is_allow_expense_claim_estimation && (
                              <div>
                                {(requestConfig.estimation_type as any)
                                  ?.code === 'BLK' ? (
                                  <Form.Item
                                    name='bulk_estimation_amount'
                                    label={getLabel(
                                      'expense_claim_estimation',
                                      'Bulk Cost Estimation',
                                    )}
                                    rules={[
                                      {
                                        required:
                                          requestConfig.is_estimation_mandatory,
                                        message: `${getLabel(
                                          'expense_claim_estimation',
                                          'Bulk Cost Estimation',
                                        )} required'`,
                                      },
                                    ]}
                                    required={
                                      requestConfig.is_estimation_mandatory
                                    }
                                  >
                                    <InputNumber
                                      min={0}
                                      maxLength={15}
                                      disabled={readOnly}
                                      style={{ width: '100%' }}
                                      precision={2}
                                    />
                                  </Form.Item>
                                ) : totalExpenseCount !== 0 ||
                                  totalExpenseCount ? (
                                  <div>
                                    <Form.Item
                                      className='estimation-container'
                                      required={true}
                                    >
                                      <Collapse
                                        expandIconPosition='right'
                                        defaultActiveKey={[
                                          ESTIMATION_TABLE_KEY,
                                        ]}
                                        activeKey={estimationActiveKey}
                                        onChange={key =>
                                          setEstimationActiveKey(key)
                                        }
                                      >
                                        <Collapse.Panel
                                          header={
                                            <Row gutter={24}>
                                              <Col
                                                span={11}
                                                title={getLabel(
                                                  'expense_claim_estimation',
                                                  'Itemized Cost Estimation',
                                                )}
                                              >
                                                {requestConfig.is_estimation_mandatory && (
                                                  <label
                                                    style={{
                                                      marginRight: 4,
                                                      color: '#ff4d4f',
                                                      fontSize: 14,
                                                      fontFamily:
                                                        'SimSun, sans-serif',
                                                      lineHeight: 1,
                                                    }}
                                                  >
                                                    *
                                                  </label>
                                                )}
                                                <span>
                                                  {getLabel(
                                                    'expense_claim_estimation',
                                                    'Itemized Cost Estimation',
                                                  )}
                                                  .{' '}
                                                </span>
                                                <span className='completed-count'>
                                                  {getCompletedCount()}
                                                </span>
                                                <span>{`/${totalExpenseCount}`}</span>
                                              </Col>
                                              <Col span={12}>
                                                <div className='amount'>
                                                  <div>
                                                    <span
                                                      style={{ paddingLeft: 8 }}
                                                    >
                                                      SGD{' '}
                                                    </span>
                                                    <span className='amount-complete'>
                                                      {
                                                        getItemizedTotal().split(
                                                          '.',
                                                        )[0]
                                                      }
                                                      .
                                                    </span>
                                                    <span>
                                                      {getItemizedTotal().split(
                                                        '.',
                                                      )[1] || '00'}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          }
                                          key={ESTIMATION_TABLE_KEY}
                                        >
                                          <Form.List name='expense_claim_estimations'>
                                            {(fields, { add, remove }) => {
                                              return renderItemizedRecords(
                                                fields,
                                                add,
                                                remove,
                                              );
                                            }}
                                          </Form.List>
                                        </Collapse.Panel>
                                      </Collapse>
                                    </Form.Item>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          {requestConfig.is_include_flight_booking &&
                            ((requestConfig.is_flight_booking_filled_by_admin &&
                              isAdmin) ||
                              !requestConfig.is_flight_booking_filled_by_admin) && (
                              <Form.Item required={true}>
                                <Collapse
                                  expandIconPosition='right'
                                  defaultActiveKey={[FLIGHT_TABLE_KEY]}
                                  activeKey={flightActiveKey}
                                  onChange={key => setFlightActiveKey(key)}
                                >
                                  <Collapse.Panel
                                    header={
                                      <CustomizeTabName
                                        title={
                                          <>
                                            {getLabel(
                                              'flight_details',
                                              'Flight Details',
                                            )}
                                            {requestConfig.is_flight_booking_filled_by_admin ? (
                                              <AdminFieldIcon />
                                            ) : null}
                                          </>
                                        }
                                        count={
                                          form.getFieldValue('flight_details')
                                            ?.length || 0
                                        }
                                        icon=' . '
                                      />
                                    }
                                    key={FLIGHT_TABLE_KEY}
                                  >
                                    <Form.List name='flight_details'>
                                      {(fields, { add, remove }) => (
                                        <div className='estimation-container'>
                                          {fields.map(field => (
                                            <Row
                                              key={field.key}
                                              gutter={rowGutter}
                                              className='table-row'
                                            >
                                              <Col span={22}>
                                                <Row gutter={24}>
                                                  <Col span={24}>
                                                    <Form.Item
                                                      name={[
                                                        field.name,
                                                        'airlines',
                                                      ]}
                                                      label={
                                                        <Trans>
                                                          Flight Name
                                                        </Trans>
                                                      }
                                                      required
                                                      rules={[
                                                        () => ({
                                                          validator(_, value) {
                                                            if (
                                                              value !==
                                                              undefined
                                                            ) {
                                                              value = value?.trim();
                                                            }
                                                            if (
                                                              !value ||
                                                              value ===
                                                                undefined
                                                            ) {
                                                              return Promise.reject(
                                                                'This field required',
                                                              );
                                                            } else {
                                                              if (
                                                                new RegExp(
                                                                  /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                                ).test(value)
                                                              ) {
                                                                return Promise.resolve();
                                                              }
                                                              return Promise.reject(
                                                                new Error(
                                                                  'Can not start with special character',
                                                                ),
                                                              );
                                                            }
                                                          },
                                                        }),
                                                      ]}
                                                    >
                                                      <Input
                                                        autoComplete='new-password'
                                                        disabled={readOnly}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      name={[
                                                        field.name,
                                                        'flight_number',
                                                      ]}
                                                      label={
                                                        <Trans>
                                                          Flight Number
                                                        </Trans>
                                                      }
                                                      required
                                                      rules={[
                                                        () => ({
                                                          validator(_, value) {
                                                            if (
                                                              value !==
                                                              undefined
                                                            ) {
                                                              value = value?.trim();
                                                            }
                                                            if (
                                                              !value ||
                                                              value ===
                                                                undefined
                                                            ) {
                                                              return Promise.reject(
                                                                'This field required',
                                                              );
                                                            } else {
                                                              if (
                                                                new RegExp(
                                                                  /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                                ).test(value)
                                                              ) {
                                                                return Promise.resolve();
                                                              }
                                                              return Promise.reject(
                                                                new Error(
                                                                  'Can not start with special character',
                                                                ),
                                                              );
                                                            }
                                                          },
                                                        }),
                                                      ]}
                                                    >
                                                      <Input
                                                        autoComplete='new-password'
                                                        style={{
                                                          width: '100%',
                                                        }}
                                                        disabled={readOnly}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      name={[
                                                        field.name,
                                                        'departure_time',
                                                      ]}
                                                      label={
                                                        <Trans>
                                                          Departure Time
                                                        </Trans>
                                                      }
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            'This field required',
                                                        },
                                                      ]}
                                                    >
                                                      <TimePicker
                                                        disabled={readOnly}
                                                        format='HH:mm'
                                                        style={{
                                                          width: '100%',
                                                        }}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      name={[
                                                        field.name,
                                                        'arrival_time',
                                                      ]}
                                                      label={
                                                        <Trans>
                                                          Arrival Time
                                                        </Trans>
                                                      }
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            'This field required',
                                                        },
                                                      ]}
                                                    >
                                                      <TimePicker
                                                        disabled={readOnly}
                                                        format='HH:mm'
                                                        style={{
                                                          width: '100%',
                                                        }}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      label={
                                                        <Trans>Currency</Trans>
                                                      }
                                                      name={[
                                                        field.name,
                                                        'country_currency',
                                                      ]}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            'This field required',
                                                        },
                                                      ]}
                                                    >
                                                      <Select
                                                        disabled={readOnly}
                                                        showSearch
                                                        filterOption={(
                                                          input,
                                                          option,
                                                        ) =>
                                                          option?.children
                                                            .join(' ')
                                                            .toLowerCase()
                                                            .indexOf(
                                                              input.toLowerCase(),
                                                            ) >= 0
                                                        }
                                                      >
                                                        {renderCurrencies()}
                                                      </Select>
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      label={
                                                        <Trans>Amount</Trans>
                                                      }
                                                      name={[
                                                        field.name,
                                                        'ticket_cost',
                                                      ]}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            'This field required',
                                                        },
                                                      ]}
                                                    >
                                                      <InputNumber
                                                        style={{
                                                          width: '100%',
                                                        }}
                                                        disabled={readOnly}
                                                        precision={2}
                                                        min={0}
                                                        maxLength={15}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      name={[
                                                        field.name,
                                                        'flight_ticket',
                                                      ]}
                                                      label={
                                                        <Trans>
                                                          Flight Ticket
                                                        </Trans>
                                                      }
                                                    >
                                                      <UploadInput
                                                        disabled={readOnly}
                                                        onOpenAttachment={() =>
                                                          openFlightTicket(
                                                            field.name,
                                                          )
                                                        }
                                                        fileName={getFlightFileName(
                                                          field.name,
                                                        )}
                                                      />
                                                    </Form.Item>
                                                    <h5 className='ant-upload-hint'>
                                                      <Trans>Format</Trans>: JPG
                                                      , JPEG , PNG , JFIF , PDF{' '}
                                                      <br />{' '}
                                                      <Trans>
                                                        Maximum File Size
                                                      </Trans>{' '}
                                                      : 20 MB
                                                    </h5>
                                                  </Col>
                                                </Row>
                                              </Col>
                                              <Col span={2}>
                                                {fields.length > 1 &&
                                                  !readOnly && (
                                                    <Col flex='none'>
                                                      <CloseOutlined
                                                        className='dynamic-delete-button'
                                                        onClick={() => {
                                                          remove(field.name);
                                                        }}
                                                        style={{
                                                          fontSize: '16px',
                                                        }}
                                                      />
                                                    </Col>
                                                  )}
                                              </Col>
                                            </Row>
                                          ))}
                                          {fields.length === 0 && add()}
                                          {AnotherLine(add)}
                                        </div>
                                      )}
                                    </Form.List>
                                  </Collapse.Panel>
                                </Collapse>
                              </Form.Item>
                            )}
                          {requestConfig.is_include_hotel_accommodation &&
                            ((requestConfig.is_hotel_accommodation_filled_by_admin &&
                              isAdmin) ||
                              !requestConfig.is_hotel_accommodation_filled_by_admin) && (
                              <Form.Item required={true}>
                                <Collapse
                                  expandIconPosition='right'
                                  defaultActiveKey={[HOTEL_TABLE_KEY]}
                                  activeKey={hotelActiveKey}
                                  onChange={key => setHotelActiveKey(key)}
                                >
                                  <Collapse.Panel
                                    header={
                                      <CustomizeTabName
                                        title={
                                          <>
                                            <Trans>Hotel Accommodation</Trans>
                                            {requestConfig.is_hotel_accommodation_filled_by_admin ? (
                                              <AdminFieldIcon />
                                            ) : null}
                                          </>
                                        }
                                        count={
                                          form.getFieldValue(
                                            'hotel_accommodations',
                                          )?.length || 0
                                        }
                                        icon=' . '
                                      />
                                    }
                                    key={HOTEL_TABLE_KEY}
                                  >
                                    <Form.List name='hotel_accommodations'>
                                      {(fields, { add, remove }) => (
                                        <div className='estimation-container'>
                                          {fields.map(field => (
                                            <Row
                                              key={field.key}
                                              gutter={rowGutter}
                                              className='table-row'
                                            >
                                              <Col span={22}>
                                                <Row gutter={24}>
                                                  <Col span={12}>
                                                    <Form.Item
                                                      name={[
                                                        field.name,
                                                        'hotel_name',
                                                      ]}
                                                      label={
                                                        <Trans>
                                                          Hotel Name
                                                        </Trans>
                                                      }
                                                      required
                                                      rules={[
                                                        () => ({
                                                          validator(_, value) {
                                                            if (
                                                              value !==
                                                              undefined
                                                            ) {
                                                              value = value?.trim();
                                                            }
                                                            if (
                                                              !value ||
                                                              value ===
                                                                undefined
                                                            ) {
                                                              return Promise.reject(
                                                                'This field required',
                                                              );
                                                            } else {
                                                              if (
                                                                new RegExp(
                                                                  /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                                ).test(value)
                                                              ) {
                                                                return Promise.resolve();
                                                              }
                                                              return Promise.reject(
                                                                new Error(
                                                                  'Can not start with special character',
                                                                ),
                                                              );
                                                            }
                                                          },
                                                        }),
                                                      ]}
                                                    >
                                                      <Input
                                                        autoComplete='new-password'
                                                        disabled={readOnly}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={12}>
                                                    <Form.Item
                                                      label={
                                                        <Trans>
                                                          Hotel Address
                                                        </Trans>
                                                      }
                                                      name={[
                                                        field.name,
                                                        'hotel_address',
                                                      ]}
                                                      required
                                                      rules={[
                                                        () => ({
                                                          validator(_, value) {
                                                            if (
                                                              value !==
                                                              undefined
                                                            ) {
                                                              value = value?.trim();
                                                            }
                                                            if (
                                                              !value ||
                                                              value ===
                                                                undefined
                                                            ) {
                                                              return Promise.reject(
                                                                'This field required',
                                                              );
                                                            } else {
                                                              if (
                                                                new RegExp(
                                                                  /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                                ).test(value)
                                                              ) {
                                                                return Promise.resolve();
                                                              }
                                                              return Promise.reject(
                                                                new Error(
                                                                  'Can not start with special character',
                                                                ),
                                                              );
                                                            }
                                                          },
                                                        }),
                                                      ]}
                                                    >
                                                      <Input
                                                        autoComplete='new-password'
                                                        disabled={readOnly}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      rules={[
                                                        () => ({
                                                          validator(_, value) {
                                                            if (
                                                              value !==
                                                              undefined
                                                            ) {
                                                              value = value?.trim();
                                                            }
                                                            if (
                                                              new RegExp(
                                                                /^[^@!=\-+#﹘—⸺⸻].*$/,
                                                              ).test(value)
                                                            ) {
                                                              return Promise.resolve();
                                                            } else if (!value) {
                                                              return Promise.resolve();
                                                            }
                                                            return Promise.reject(
                                                              new Error(
                                                                'Can not start with special character',
                                                              ),
                                                            );
                                                          },
                                                        }),
                                                      ]}
                                                      name={[
                                                        field.name,
                                                        'remark',
                                                      ]}
                                                      label={getLabel(
                                                        'remark',
                                                        'Remark',
                                                      )}
                                                    >
                                                      <Input
                                                        autoComplete='new-password'
                                                        disabled={readOnly}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      label={
                                                        <Trans>Check-In</Trans>
                                                      }
                                                      name={[
                                                        field.name,
                                                        'check_in_date',
                                                      ]}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            'This field required',
                                                        },
                                                      ]}
                                                    >
                                                      <DatePicker
                                                        disabled={readOnly}
                                                        format={DATE_FORMAT}
                                                        showToday={false}
                                                        style={{
                                                          width: '100%',
                                                        }}
                                                        disabledDate={current =>
                                                          disabledMultiCityDates(
                                                            current,
                                                          )
                                                        }
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      label={
                                                        <Trans>Check-Out</Trans>
                                                      }
                                                      name={[
                                                        field.name,
                                                        'check_out_date',
                                                      ]}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            'This field required',
                                                        },
                                                      ]}
                                                    >
                                                      <DatePicker
                                                        showToday={false}
                                                        style={{
                                                          width: '100%',
                                                        }}
                                                        disabledDate={(
                                                          current: any,
                                                        ) =>
                                                          disabledCheckOutDates(
                                                            current,
                                                            field.name,
                                                          )
                                                        }
                                                        disabled={
                                                          (form.getFieldValue(
                                                            'hotel_accommodations',
                                                          )[field.name]
                                                            ?.check_in_date
                                                            ? false
                                                            : true) || readOnly
                                                        }
                                                        format={DATE_FORMAT}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      label={
                                                        <Trans>Currency</Trans>
                                                      }
                                                      name={[
                                                        field.name,
                                                        'country_currency',
                                                      ]}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            'This field required',
                                                        },
                                                      ]}
                                                    >
                                                      <Select
                                                        disabled={readOnly}
                                                        showSearch
                                                        filterOption={(
                                                          input,
                                                          option,
                                                        ) =>
                                                          option?.children
                                                            .join(' ')
                                                            .toLowerCase()
                                                            .indexOf(
                                                              input.toLowerCase(),
                                                            ) >= 0
                                                        }
                                                      >
                                                        {renderCurrencies()}
                                                      </Select>
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      name={[
                                                        field.name,
                                                        'amount',
                                                      ]}
                                                      label={
                                                        <Trans>Amount</Trans>
                                                      }
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            'This field required',
                                                        },
                                                      ]}
                                                    >
                                                      <InputNumber
                                                        style={{
                                                          width: '100%',
                                                        }}
                                                        min={0}
                                                        maxLength={15}
                                                        disabled={readOnly}
                                                        precision={2}
                                                      />
                                                    </Form.Item>
                                                  </Col>

                                                  <Col span={8}>
                                                    <Form.Item
                                                      name={[
                                                        field.name,
                                                        'attachment',
                                                      ]}
                                                      label={
                                                        <Trans>
                                                          Attachment
                                                        </Trans>
                                                      }
                                                    >
                                                      <UploadInput
                                                        disabled={readOnly}
                                                        fileName={getHotelFileName(
                                                          field.name,
                                                        )}
                                                        onOpenAttachment={() =>
                                                          openHotelAttachment(
                                                            field.name,
                                                          )
                                                        }
                                                      />
                                                    </Form.Item>
                                                    <h5 className='ant-upload-hint'>
                                                      <Trans>Format</Trans>: JPG
                                                      , JPEG , PNG , JFIF , PDF{' '}
                                                      <br />{' '}
                                                      <Trans>
                                                        Maximum File Size
                                                      </Trans>{' '}
                                                      : 20 MB
                                                    </h5>
                                                  </Col>
                                                </Row>
                                              </Col>
                                              <Col span={2}>
                                                {fields.length > 1 &&
                                                  !readOnly && (
                                                    <Col flex='none'>
                                                      <CloseOutlined
                                                        className='dynamic-delete-button'
                                                        onClick={() => {
                                                          remove(field.name);
                                                        }}
                                                        style={{
                                                          fontSize: '16px',
                                                        }}
                                                      />
                                                    </Col>
                                                  )}
                                              </Col>
                                            </Row>
                                          ))}
                                          {fields.length === 0 && add()}
                                          {AnotherLine(add)}
                                        </div>
                                      )}
                                    </Form.List>
                                  </Collapse.Panel>
                                </Collapse>
                              </Form.Item>
                            )}
                          {requestConfig.is_allow_adding_staff_members_to_requests && (
                            <Form.Item
                              required={
                                requestConfig.are_staff_members_mandatory
                              }
                              rules={[
                                {
                                  required:
                                    requestConfig.are_staff_members_mandatory,
                                  message: `${getLabel(
                                    'staff_members',
                                    'Staff Members',
                                  )} required`,
                                },
                              ]}
                            >
                              <Collapse
                                expandIconPosition='right'
                                defaultActiveKey={[STAFF_TABLE_KEY]}
                                activeKey={staffActiveKey}
                                onChange={key => setStaffActiveKey(key)}
                              >
                                <Collapse.Panel
                                  header={
                                    <CustomizeTabName
                                      title={<Trans>Staff Attendee</Trans>}
                                      count={
                                        form.getFieldValue('staff_members')
                                          ?.length || 0
                                      }
                                      icon=' . '
                                    />
                                  }
                                  key={STAFF_TABLE_KEY}
                                >
                                  {staffMemberLoading ? (
                                    <Loader loadingName='Loading Staff Data' />
                                  ) : (
                                    <Form.List name='staff_members'>
                                      {(fields, { add, remove }) => (
                                        <div className='estimation-container'>
                                          {renderStaffMembers(
                                            'staff',
                                            fields,
                                            add,
                                            remove,
                                          )}
                                        </div>
                                      )}
                                    </Form.List>
                                  )}
                                </Collapse.Panel>
                              </Collapse>
                            </Form.Item>
                          )}
                          {requestConfig.is_allow_adding_guest_members_to_requests && (
                            <Form.Item
                              required={
                                requestConfig.are_guest_members_mandatory
                              }
                              rules={[
                                {
                                  required:
                                    requestConfig.are_guest_members_mandatory,
                                  message: `${getLabel(
                                    'guest_members',
                                    'Guest Members',
                                  )} required`,
                                },
                              ]}
                            >
                              <Collapse
                                expandIconPosition='right'
                                defaultActiveKey={[GUEST_TABLE_KEY]}
                                activeKey={guestActiveKey}
                                onChange={key => setGuestActiveKey(key)}
                              >
                                <Collapse.Panel
                                  header={
                                    <CustomizeTabName
                                      title={<Trans>Guest Attendee</Trans>}
                                      count={
                                        form.getFieldValue('guest_members')
                                          ?.length || 0
                                      }
                                      icon=' . '
                                    />
                                  }
                                  key={GUEST_TABLE_KEY}
                                >
                                  <Form.List name='guest_members'>
                                    {(fields, { add, remove }) => (
                                      <div className='estimation-container'>
                                        {renderStaffMembers(
                                          'guest',
                                          fields,
                                          add,
                                          remove,
                                        )}
                                      </div>
                                    )}
                                  </Form.List>
                                </Collapse.Panel>
                              </Collapse>
                            </Form.Item>
                          )}
                          {requestConfig.is_allow_charging_to_cost_centres && (
                            <Row gutter={24}>
                              <Col span={12}>{renderChargeTo()}</Col>
                              <Col span={12}>{renderCostCentres()}</Col>
                            </Row>
                          )}
                          {requestConfig.is_enable_cash_advance && (
                            <Row gutter={24}>
                              <Col span={12}>
                                <Form.Item
                                  // label={getLabel(
                                  //   'cash_advance',
                                  //   'Cash Advance Amount',
                                  // )}
                                  label={<Trans>Cash Advance Amount</Trans>}
                                  name='cash_advance'
                                  initialValue={0}
                                >
                                  <InputNumber
                                    min={0}
                                    maxLength={15}
                                    style={{ width: '100%' }}
                                    disabled={readOnly}
                                    precision={2}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          )}
                        </Form>
                        <CustomFieldsForm
                          ref={customFieldForm}
                          isViewMode={readOnly}
                          isAdmin={isAdmin}
                          customFields={
                            (is_preview
                              ? customFields
                              : requestConfig.custom_fields || {
                                  fields: [],
                                  layout: [],
                                }) as IcustomFields
                          }
                          isClone={isClone}
                        />
                      </div>
                    </Col>
                    <Col {...documentsSpan}>
                      <div className='receiptSelector'>
                        <ReceiptSelector
                          displayNoReceiptAttachedField={false}
                          isReceiptMandatory={false}
                          showUploadList={false}
                          // onChange={additionalDocumentHandler}
                          fileList={fileList}
                          receiptLabel=''
                          disabled={fileList.length >= 5}
                          beforeUpload={(file, fileList) => {
                            additionalDocumentHandler({ file, fileList });
                            return false;
                          }}
                          //accept='.pdf,.png,.jpg,.jpeg,.jfif'
                        />
                        {fileList.map((file: any, i) => (
                          <div className='document-item'>
                            <PaperClipOutlined />
                            <div className='document-name'>
                              <a
                                href={window.URL.createObjectURL(file)}
                                target='_new'
                              >
                                {file.name || 'Attachment#' + (i + 1)}
                              </a>
                            </div>
                            <DeleteOutlined
                              onClick={() => deleteFile(file.uid)}
                            />
                          </div>
                        ))}
                        {defaultFileList.map((file, i) => (
                          <div className='document-item'>
                            <PaperClipOutlined />
                            <div className='document-name'>
                              <a href={file.file} target='_new'>
                                {file.file_name || 'Attachment#' + (i + 1)}
                              </a>
                            </div>
                            <DeleteOutlined
                              onClick={() => removeFile(file.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </Col>
                  </Row>
                  <Col {...colSpan}>
                    {!is_preview && !readOnly && (
                      <Row
                        gutter={[22, 8]}
                        justify='end'
                        style={{ marginTop: 40 }}
                      >
                        <Col span={4.5}>
                          <Button
                            onClick={() => saveAsDraft(false)}
                            type='primary'
                            ghost
                            disabled={
                              createRequestLoadingStatus ||
                              staffMemberLoading ||
                              form.getFieldValue(
                                'request_type_legal_entity',
                              ) === undefined
                            }
                          >
                            {id ? (
                              <Trans>Update</Trans>
                            ) : (
                              <Trans>Save as Draft</Trans>
                            )}
                          </Button>
                        </Col>
                        {!isAdmin && (
                          <Col span={4.5}>
                            <Button
                              type='primary'
                              disabled={
                                createRequestLoadingStatus ||
                                staffMemberLoading ||
                                form.getFieldValue(
                                  'request_type_legal_entity',
                                ) === undefined
                              }
                              onClick={() => saveAsDraft(true)}
                            >
                              <Trans>Send for Approval</Trans>
                            </Button>
                          </Col>
                        )}
                      </Row>
                    )}
                  </Col>
                </div>
              ) : (
                <Result
                  title={<Trans>Action Not Allowed</Trans>}
                  subTitle={
                    <Trans>You are not allowed to update this request</Trans>
                  }
                  icon={<StopOutlined style={{ color: '#dce6f1' }} />}
                />
              )}
            </div>
          )}
        </div>
        <ConfirmationModal
          visible={confirmationModal}
          header='Do you want to add another request?'
          cancelText='Yes'
          okText='No'
          onOkClick={navigateToDraft}
          onCancelClick={reloadPage}
        />
      </Container>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  const currentDelegationUser = getCurrentDelegateUser(state);

  return {
    request_type_legal_entity: getRequestLegalEntities(state),
    requestDetails: getUpdateRequestTypeData(state),
    referenceData: getRequestReferenceData(state),
    default_cost_centre: currentDelegationUser
      ? getDelegateUserCostCentre(state)
      : getUserCostCentre(state),
    overseasCostCentres: getRequestOverseasCostCentres(state),
    localCostCentres: getRequestLocalCostCentres(state),
    internalCostCentres: getRequestInternalCostCentres(state),
    requestConfigData: getRequestTypeExpandedItem(state),
    isDataLoading: getRequestTypeDataLoading(state),
    employeeList: getStaffMembers(state),
    expenseTypesForRequest: getExpenseTypesForRequest(state),
    loader: getRequestTypeLoader(state),
    loadingMessage: getRequestTypeLoadingMessage(state),
    requestLegalEntitiesLoading: getRequestLegalEntitiesLoadingStatus(state),
    success: getRequestTypeSuccessMessage(state),
    error: getRequestTypeErrorMessage(state),
    currencies: getCountryCurrencyList(state),
    staffMemberLoading: getstaffMemberLoadingStatus(state),
    createRequestLoadingStatus: getcreateRequestLoadingStatus(state),
    currentDelegationUser,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _createDraft: (
    body: any,
    id: string,
    isSubmit: boolean,
    isadmin?: boolean,
    callback?: Function,
  ) => dispatch(createRequest(body, id, isSubmit, isadmin, callback)),
  _fetchLegalEntities: (is_travel_type: boolean) =>
    dispatch(fetchRequestLegalEntities(is_travel_type)),
  _fetchRequestConfig: (id: string) => dispatch(fetchRequestTypeConfigById(id)),
  _fetchRequestDetails: (id: string) => dispatch(fetchRequestDetailsById(id)),
  _fetchEmployeeList: () => dispatch(fetchStaffMembers()),
  _fetchExpensesForRequest: (id: string, empId?: number) =>
    dispatch(fetchExpenseTypesAgainstRequest(id, empId)),
  _resetAllData: () => dispatch(resetAllRequestData()),
  _resetConfigData: () => dispatch(saveExpandedItem({})),
  _fetchCountryCurrencies: () => dispatch(fetchCountryCurrencyList()),
  _fetchCostCentres: (type: COST_CENTRE_TYPES) =>
    dispatch(fetchCostCentres(type)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default React.memo(connector(AddRequestForm));

const UploadInput: React.FC<{
  value?: any;
  onChange?: (info: UploadChangeParam<UploadFile<any>>) => void;
  disabled?: boolean;
  onOpenAttachment?: () => void;
  fileName?: string;
}> = ({ disabled, onChange, value, onOpenAttachment, fileName }) => {
  let uploadFileName = fileName;
  if (!fileName) {
    uploadFileName = value
      ? typeof value === 'string'
        ? value
        : value.file.name
      : 'Click on icon';
  }

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onClick = () => {
    fileName && onOpenAttachment && onOpenAttachment();
  };

  const isImgAndPdf = (type: string): boolean => {
    const condition = Boolean(
      type === 'image/jpeg' ||
        type === 'image/png' ||
        type === 'application/pdf' ||
        type === 'image/jfif',
    );

    if (!condition) message.error('Unsupported file type', 2);

    return condition;
  };
  const onUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (isImgAndPdf(info.file.type)) {
      setFileList(prev => [...prev, info.file]);
      onChange && onChange(info);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Upload
        beforeUpload={(file, fileList) => {
          onUploadChange({ file, fileList });
          return false;
        }}
        fileList={fileList}
        showUploadList={false}
        disabled={disabled}
        //accept='.pdf,.png,.jpg,.jpeg,.jfif'
        // onChange={onUploadChange}
      >
        <Button
          icon={<UploadOutlined />}
          style={{
            width: 40,
            height: 40,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
      </Upload>
      <Input
        readOnly
        value={uploadFileName}
        onClick={onClick}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      />
    </div>
  );
};

const isActionAllowed = (permissionCode: string, userId: number): boolean => {
  return getIsPresentInTargetAudience(Store.getState(), permissionCode, userId);
};
