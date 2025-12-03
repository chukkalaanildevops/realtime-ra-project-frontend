/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  useState,
  Dispatch,
  useEffect,
  useRef,
  ComponentType,
} from 'react';
import {
  stateInterface,
  getRequestTypeSuccessMessage,
  getRequestTypeErrorMessage,
  getRequestTypeLoader,
  getRequestTypeLoadingMessage,
  getRequestTypeExpandedItem,
} from '../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { Tabs, message, Button, Modal } from 'antd';
import ConfigForm from './components/configForm/configForm.index';
import {
  CustomFields,
  LabelMapping,
  HeaderBarWrapper,
  BackButton,
} from '../../../shared/components/';
import { generalStructure } from '../requestTypeConfiguration.structure';
import {
  customObjInterface,
  Ilabel,
  generalDataInterface,
} from '../requestTypeConfiguration.model';
import { getLabels, getCustomField } from '../../../shared/redux/rootReducer';
import {
  saveCustomFieldsData,
  saveLabelMapping,
  resetLabelMapping,
  resetRequestTypeMessages,
  saveExpandedItem,
} from '../requestTypeConfiguration.action';
import {
  fetchLabelMapping,
  createRequestType,
  fetchRequestTypeConfigById,
  updateRequestType,
  updateConfigDetails,
  addCustomRequestTypeConfig,
} from '../requestTypeConfiguration.thunk';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  RouteComponentProps,
  withRouter,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import './addRequestTypeConfiguration.index.less';
import { Trans } from '@lingui/macro';
import { getQueryString } from '../../../utils/scroll.utils';

import { AddRequestForm } from '../addRequest/components';

const RequestTypeConfiguration: React.FC<ConnectedProps<typeof connector> &
  RouteComponentProps<{ id: string }>> = props => {
  const {
    // dispatch,
    // activeTabKey,
    // general_data,
    // entertaiment,
    // mileage,
    // entertaiment,
    // milage,
    success,
    errors,
    isLoading,
    loadingMessage,
    _createRequestType,
    custom,
    label,
    saveCustomFields,
    saveLabelMappingData,
    fetchLabelMappingData,
    _resetAllRequestData,
    match,
    requestDetails,
    _fetchRequestTypeDetails,
    // _updateRequestType,
    _resetLabelMapping,
    _updateConfigDetails,
    _addCustomRequestTypeConfig,
    _resetMessages,
  } = props;

  const [_formConfig, setFormConfig] = useState<generalDataInterface>(
    {} as generalDataInterface,
  );
  // eslint-disable-next-line no-console

  const location: any = useLocation();
  const isClone = (location.state as any)?.type === 'clone';

  const params: any = useParams();
  const isCustom = match.url.includes('customize');
  const legal_entity = getQueryString('entity');
  const history = useHistory();

  useEffect(() => {
    // if (isCustom) {
    // const isUpdate = getQueryString("mode")==="cu"
    // if (!legal_entity && !isUpdate) {
    // //  history.push(appPath.dashboard.path);
    // }
    // }
    if (isClone) {
      const id = (location.state as any)?.id;
      _fetchRequestTypeDetails(id);
    }
  }, [_fetchRequestTypeDetails, isClone, location.state]);

  const configFormRef = useRef<HTMLElement | any>(null);
  const [activeKey, updateActiveTab] = useState('1');

  const saveFieldsData = (data: customObjInterface[]) => {
    saveCustomFields(data);
  };

  useEffect(() => {
    const id = isCustom ? (getQueryString('conf_id') as string) : params.id;
    if (id) {
      _fetchRequestTypeDetails(id);
    } else {
      fetchLabelMappingData();
    }

    return () => _resetAllRequestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (
        requestDetails &&
        Object.keys(requestDetails).length > 0 &&
        (isClone || (isCustom && legal_entity))
      ) {
        const cFields = custom.fields?.map(item => {
          const field = { ...item };
          delete (field as any).id;
          delete (field as any).is_deleted;
          return field;
        });

        const layout = custom.layout.map(arr => {
          return arr.map(item => {
            const field = { ...item };
            delete (field as any).id;
            return field;
          });
        });
        const newCustom = { fields: cFields, layout: layout };

        saveCustomFields(newCustom);
      }
    } catch (e) {}
  }, [isClone, requestDetails]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        message.success(success, 2, () => {
          // props.history.push(appPath.admin.requestType.path);
          _resetMessages();
          history.goBack();
        });
      }, 100);
      // setLoadingMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    // message.destroy();

    if (!isLoading) {
      message.destroy();
    } else {
      loadingMessage && message.loading(loadingMessage);
    }
  }, [isLoading, loadingMessage]);

  const saveMappedLabel = (data: Ilabel) => {
    saveLabelMappingData(data);
  };

  const onFormValueChange = (values: any) => {
    setFormConfig(values);
  };
  const updateId = isCustom ? (getQueryString('conf_id') as string) : params.id;
  const onSubmitHandler = async (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    try {
      if (configFormRef !== null && configFormRef.current) {
        const values = await configFormRef.current!.onSubmitHandler();
        if (!values) return;

        const cFields = custom.fields?.map(item => {
          delete (item as any).reference_object_title;
          return {
            ...item,
            sub_type: item.sub_type?.toUpperCase().replace(/ /g, ''),
          };
        });
        values.custom_fields = { layout: custom.layout, fields: cFields };
        values.label_mapping = label;
        const id = isCustom ? (getQueryString('conf_id') as string) : params.id;

        // return;
        if (isCustom && legal_entity) {
          // const isUpdate = match.url.includes('custom-update');
          const isUpdate = getQueryString('mode') === 'cu';
          if (isUpdate) {
            _updateConfigDetails(values, id, history);
          } else {
            // const request_type = (location.state as any)?.request_type;
            const request_type = params.id;

            values.legal_entity = legal_entity;
            _addCustomRequestTypeConfig(values, request_type);
          }
        } else {
          if (id) {
            // _updateRequestType(id, values);
            _updateConfigDetails(values, id, history);
          } else {
            _createRequestType(values);
          }
        }
      }
    } catch (e) {}
  };
  const { confirm } = Modal;
  const onClearBtnHandler = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    confirm({
      title: 'Confirmation',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want clear all data?',
      okText: <Trans>Clear</Trans>,
      cancelText: 'Cancel',
      centered: true,
      onOk() {
        if (configFormRef !== null && configFormRef.current) {
          configFormRef.current!.onClearBtnHandler(); //this line clear all form data(reset form fields).
        }
        _resetLabelMapping();
        saveCustomFields({ fields: [], layout: [] });
        updateActiveTab('1');
      },
      onCancel() {},
    });
  };

  const createRequestType = (_values: any) => {
    // const reqObj = { ..._values, label_mapping: label, custom_fields: custom };
  };

  const recordId = isCustom ? (getQueryString('conf_id') as string) : params.id;
  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Request Type Configuration</Trans> }}
    >
      <div className='request-type-container'>
        <Tabs
          onTabClick={(key: string) => updateActiveTab(key)}
          size='large'
          activeKey={activeKey}
          // style={{ tabSize: '600px' }}
          renderTabBar={(_props: any, DefaultTabBar: ComponentType) => (
            <div className='tabs-with-back-button-container'>
              <BackButton />
              <DefaultTabBar {..._props} />
            </div>
          )}
        >
          <Tabs.TabPane tab={<Trans>Configuration</Trans>} key='1'>
            <ConfigForm
              onValueChange={onFormValueChange}
              onSave={createRequestType}
              ref={configFormRef}
              isClone={isClone}
              legal_entity={legal_entity || undefined}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Trans>Custom Fields</Trans>} key='2'>
            <CustomFields
              formStructure={generalStructure.custom}
              saveCustomFields={saveFieldsData as any}
              savedCustomFields={custom}
              title='<Request Type> Form'
              isRemoveDeletedField={recordId ? false : true}
              errors={
                errors && typeof errors !== 'string' ? errors.custom_fields : {}
              }
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Trans>Label Mapping</Trans>} key='3'>
            <LabelMapping labelData={label} saveMappedLabel={saveMappedLabel} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab='Form Design' key='4'>
            <FormDesign
              changeActiveTab={(key: string) => updateActiveTab(key)}
              saveCustomElem={saveFieldsData}
              // labelData={label}
              customData={custom}
              // saveMappedLabel={saveMappedLabel}
            />
          </Tabs.TabPane> */}
          <Tabs.TabPane tab={<Trans>Form Preview</Trans>} key='5'>
            {/* <FormPreview
              data={formConfig}
              customFields={custom}
              labelData={label}
              // entertaiment={
              //   {
              //     canHaveStaffMembers:
              //       formConfig.is_allow_adding_staff_members_to_requests,
              //     canHaveGuestMembers:
              //       formConfig.is_allow_adding_guest_members_to_requests,
              //   } as Ientertaiment
              // }
              // milage={mileage}
            /> */}
            {/* <Result title='Coming Soon...' /> */}
            <AddRequestForm
              is_travel_type={_formConfig.is_travel_type || false}
              is_preview={true}
              requestData={_formConfig}
              labelData={label}
              customFields={custom}
            />
          </Tabs.TabPane>
        </Tabs>
        <div className='tab-footer'>
          {/* {activeKey === '1' && ( */}
          {updateId ? null : (
            <Button
              type='primary'
              ghost
              onClick={onClearBtnHandler}
              style={{ padding: '0 3rem', margin: '0 1rem' }}
            >
              <Trans>Clear</Trans>
            </Button>
          )}
          {/* )} */}
          <Button
            type='primary'
            htmlType='submit'
            disabled={isLoading}
            onClick={onSubmitHandler}
            style={{ padding: '0 3rem', margin: '0 1rem' }}
          >
            <Trans>Save Configuration</Trans>
          </Button>
        </div>
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: stateInterface) => {
  return {
    label: getLabels(state),
    custom: getCustomField(state),
    success: getRequestTypeSuccessMessage(state),
    errors: getRequestTypeErrorMessage(state),
    isLoading: getRequestTypeLoader(state),
    loadingMessage: getRequestTypeLoadingMessage(state),
    requestDetails: getRequestTypeExpandedItem(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    saveCustomFields: (data: any) => dispatch(saveCustomFieldsData(data)),
    saveLabelMappingData: (data: Ilabel) => dispatch(saveLabelMapping(data)),
    fetchLabelMappingData: () => dispatch(fetchLabelMapping()),
    _createRequestType: (body: any) => dispatch(createRequestType(body)),
    _fetchRequestTypeDetails: (id: string) =>
      dispatch(fetchRequestTypeConfigById(id, true)),
    _updateRequestType: (id: string, body: any) =>
      dispatch(updateRequestType(id, body)),
    _resetLabelMapping: () => dispatch(resetLabelMapping()),
    _updateConfigDetails: (configData: any, id: string, history: any) =>
      dispatch(updateConfigDetails(configData, id, history)),
    _addCustomRequestTypeConfig: (configData: any, id: string) =>
      dispatch(addCustomRequestTypeConfig(configData, id)),
    _resetMessages: () => dispatch(resetRequestTypeMessages()),
    _resetAllRequestData: () => dispatch(saveExpandedItem({})),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(memo(withRouter(RequestTypeConfiguration)));
