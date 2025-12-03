/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, Dispatch, useEffect, useRef } from 'react';
import {
  stateInterface,
  getBenefitTypeSuccessMessage,
  getBenefitTypeErrorMessage,
  getBenefitTypeLoader,
  getBenefitTypeLoadingMessage,
  getBenefitTypeExpandedItem,
  getBenefitLabels,
  getBenefitCustomField,
} from '../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';

import { Tabs, message, Button, Modal } from 'antd';
// import ConfigForm from './components/configForm/configForm.index';
import BenefitConfigurationFormIndex from './components/benefitConfigurationForm/benefitConfigurationForm.index';
import {
  CustomFields,
  LabelMapping,
  HeaderBarWrapper,
  BackButton,
  ErrorBoundary,
} from '../../../shared/components';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { generalStructure } from '../benefitTypeConfiguration.structure';
import {
  customObjInterface,
  Ilabel,
  generalDataInterface,
} from '../benefitTypeConfiguration.model';

import {
  saveCustomFieldsData,
  saveLabelMapping,
  resetLabelMapping,
  resetBenefitTypeMessages,
} from '../benefitTypeConfiguration.action';
import {
  fetchLabelMapping,
  createBenefitType,
  // fetchBenefitTypeById,
  updateBenefitType,
  updateConfigDetails,
  addCustomBenefitTypeConfig,
  fetchBenefitTypeConfigById,
} from '../benefitTypeConfiguration.thunk';

import {
  RouteComponentProps,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import './addBenefitTypeConfiguration.index.less';
import { appPath } from '../../app/app.routes';
import { Trans } from '@lingui/macro';
import { getQueryString } from '../../../utils/scroll.utils';
import BenefitDetailIndex from '../../benefits/benefitDetail/benefitDetail.index';

const BenefitTypeConfiguration: React.FC<ConnectedProps<typeof connector> &
  RouteComponentProps<{ id: string }>> = props => {
  const {
    _createBenefitType,
    _fetchBenefitTypeDetails,
    saveCustomFields,
    saveLabelMappingData,
    fetchLabelMappingData,
    _addCustomBenefitTypeConfig,
    _resetMessages,
    _resetLabelMapping,
    _updateConfigDetails,
    success,
    isLoading,
    entityList,
    loadingMessage,
    custom,
    label,
    match,
    benefitDetails,
    initialBenefitCostCenterForLegalEntity,
  } = props;

  const [, setFormConfig] = useState<generalDataInterface>(
    {} as generalDataInterface,
  );

  const history = useHistory();
  const location: any = useLocation();
  const params: any = useParams();
  const configFormRef = useRef<HTMLElement | any>(null);
  const [activeKey, updateActiveTab] = useState('1');
  const [isUpdate, setIsUpdate] = useState(false);
  const saveFieldsData = (data: customObjInterface[]) => {
    saveCustomFields(data);
  };

  const isClone = (location.state as any)?.type === 'clone';

  const isCustom = match.url.includes('customize');
  const legal_entity = getQueryString('entity');

  useEffect(() => {
    params.hasOwnProperty('id') ? setIsUpdate(true) : setIsUpdate(false);
    if (isClone) {
      const id = (location.state as any)?.id;
      _fetchBenefitTypeDetails(id);
    }
  }, [isClone, location.state]);

  useEffect(() => {
    try {
      if (
        benefitDetails &&
        Object.keys(benefitDetails).length > 0 &&
        (isClone || (isCustom && legal_entity))
      ) {
        const cFields = custom.fields?.map(item => {
          const field = { ...item };
          delete (field as any).id;
          delete (field as any).is_deleted;
          return field;
        });

        const layout = custom.layout?.map(arr => {
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
  }, [isClone, benefitDetails]);

  useEffect(() => {
    const id = isCustom ? (getQueryString('conf_id') as string) : params.id;
    if (id) {
      _fetchBenefitTypeDetails(id);
    } else {
      fetchLabelMappingData();
    }
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        message.success(success, 2, () => {
          _resetMessages();
          history.goBack();
        });
      }, 100);
    }
  }, [success]);

  useEffect(() => {
    if (!isLoading) {
      message.destroy();
    } else {
      loadingMessage && message.loading(loadingMessage, 0);
    }
  }, [isLoading, loadingMessage]);

  const saveMappedLabel = (data: Ilabel) => {
    saveLabelMappingData(data);
  };

  const onFormValueChange = (values: any) => {
    setFormConfig(values);
  };

  const onSubmitHandler = async (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    try {
      if (configFormRef !== null && configFormRef.current) {
        const values = await configFormRef.current!.onSubmitHandler();
        if (!values) return;

        if (!values.hasOwnProperty('is_receipt_mandatory')) {
          values.is_receipt_mandatory = false;
        }
        if (!values.hasOwnProperty('is_display_no_receipt_attached_field')) {
          values.is_display_no_receipt_attached_field = false;
        }
        if (!values.hasOwnProperty('is_remark_for_no_receipt_mandatory')) {
          values.is_remark_for_no_receipt_mandatory = false;
        }

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
        let formData = new FormData();
        Object.keys(values).forEach((key: string) =>
          values[key] instanceof Object && !(values[key] instanceof Array)
            ? formData.set(key, JSON.stringify(values[key]))
            : formData.set(key, values[key]),
        );
        formData.delete('policy_documents');
        if (values.wage_type === undefined) {
          formData.delete('wage_type');
          delete values.wage_type;
        }
        if (values.gl_account === undefined) {
          formData.delete('gl_account');
          delete values.gl_account;
        }
        if (typeof values.legal_entity === 'object') {
          formData.delete('legal_entity');

          values.legal_entity.map((entity: string) =>
            formData.append('legal_entity', entity),
          );
        }
        if (
          values?.is_default_to_entity_cost_centre &&
          values?.cost_centres_for_legal_entity?.length > 0
        ) {
          // entityList
          const updatedCostCenterLegalEntity = values?.cost_centres_for_legal_entity.map(
            (data: any) => {
              const resultEntity = entityList.find(
                (entity: any) => entity.title === data.legal_entity,
              );
              if (id) {
                const isChanged = initialBenefitCostCenterForLegalEntity.find(
                  (value: any) =>
                    value.legal_entity.title === data.legal_entity &&
                    value.cost_centre.uuid !== data.cost_centre,
                );

                const obj = initialBenefitCostCenterForLegalEntity.find(
                  (value: any) =>
                    value.legal_entity.title === data.legal_entity,
                );
                const result = obj ? true : false;

                if (isChanged || result === false) {
                  return {
                    ...data,
                    legal_entity: resultEntity.uuid,
                    is_cc_value_updated: true,
                  };
                }
              }
              return {
                ...data,
                legal_entity: resultEntity.uuid,
              };
            },
          );
          if (id) {
            // initialBenefitCostCenterForLegalEntity
          }
          values.cost_centres_for_legal_entity = updatedCostCenterLegalEntity;
          formData.set(
            'cost_centres_for_legal_entity',
            updatedCostCenterLegalEntity,
          );
        }
        // eslint-disable-next-line no-unused-expressions
        formData.set('benefit_category', values.benefit_category);
        // eslint-disable-next-line no-unused-expressions
        values.cost_centres?.map((cCentre: string) =>
          formData.append('cost_centres', cCentre),
        );
        values.tax_percentages = values.tax_percentages
          ? values.tax_percentages
          : 0;
        values.tax_percentage_as_of_date = values.tax_percentage_as_of_date
          ? values.tax_percentage_as_of_date.format('DD/MM/YYYY')
          : null;
        if (isCustom && legal_entity) {
          const isUpdate = getQueryString('mode') === 'cu';
          if (isUpdate) {
            _updateConfigDetails(formData, id);
          } else {
            const benefit_type = params.id;
            formData.delete('legal_entity');
            formData.set('legal_entity', legal_entity);
            _addCustomBenefitTypeConfig(formData, benefit_type);
          }
        } else {
          if (id) {
            if (
              values.local_cc_threshold_amount &&
              !values.overseas_cc_threshold_amount
            ) {
              const data = {
                ...values,
                local_cc_threshold_amount: Number(
                  values?.local_cc_threshold_amount,
                ).toFixed(2),
              };
              _updateConfigDetails(data, id);
            } else if (
              values.local_cc_threshold_amount &&
              values.overseas_cc_threshold_amount
            ) {
              const data = {
                ...values,
                local_cc_threshold_amount: Number(
                  values?.local_cc_threshold_amount,
                ).toFixed(2),
                overseas_cc_threshold_amount: Number(
                  values?.overseas_cc_threshold_amount,
                ).toFixed(2),
              };
              _updateConfigDetails(data, id);
            } else {
              _updateConfigDetails(values, id);
            }
          } else {
            if (
              values.local_cc_threshold_amount &&
              !values.overseas_cc_threshold_amount
            ) {
              const data = {
                ...values,
                local_cc_threshold_amount: Number(
                  values?.local_cc_threshold_amount,
                ).toFixed(2),
              };
              _createBenefitType(data);
            } else if (
              values.local_cc_threshold_amount &&
              values.overseas_cc_threshold_amount
            ) {
              const data = {
                ...values,
                local_cc_threshold_amount: Number(
                  values?.local_cc_threshold_amount,
                ).toFixed(2),
                overseas_cc_threshold_amount: Number(
                  values?.overseas_cc_threshold_amount,
                ).toFixed(2),
              };
              _createBenefitType(data);
            } else {
              _createBenefitType(values);
            }
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
      },
      onCancel() {},
    });
  };
  const recordId = isCustom ? (getQueryString('conf_id') as string) : params.id;
  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Benefit Type Configuration</Trans> }}
      >
        <div className='benefit-type-container'>
          <Tabs
            onTabClick={(key: string) => updateActiveTab(key)}
            defaultActiveKey='2'
            size='large'
            activeKey={activeKey}
            renderTabBar={(_props: any, DefaultTabBar: React.ComponentType) => (
              <div className='tabs-with-back-button-container'>
                <BackButton
                  backBtnUrl={appPath.config_setup.benefitType.add.backLink}
                />
                <DefaultTabBar {..._props} />
              </div>
            )}
          >
            <Tabs.TabPane tab={<Trans>Configuration</Trans>} key='1'>
              {/* <ConfigForm
                onValueChange={onFormValueChange}
                ref={configFormRef}
                isClone={isClone}
                legal_entity={legal_entity || undefined}
              /> */}
              <BenefitConfigurationFormIndex
                onValueChange={onFormValueChange}
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
                title='<Benefit Type> Form'
                isRemoveDeletedField={recordId ? false : true}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Trans>Label Mapping</Trans>} key='3'>
              <LabelMapping
                labelData={label}
                saveMappedLabel={saveMappedLabel}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Trans>Form Preview</Trans>} key='4'>
              <BenefitDetailIndex benefitClaimId={null} custom={custom} />
            </Tabs.TabPane>
          </Tabs>
          <div className='tab-footer'>
            {!isUpdate && (
              <Button
                type='primary'
                ghost
                onClick={onClearBtnHandler}
                style={{ padding: '0 3rem', margin: '0 1rem' }}
              >
                <Trans>Clear</Trans>
              </Button>
            )}

            <Button
              type='primary'
              htmlType='submit'
              onClick={onSubmitHandler}
              style={{ padding: '0 3rem', margin: '0 1rem' }}
            >
              <Trans>Save Configuration</Trans>
            </Button>
          </div>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: stateInterface) => {
  const {
    entityList,
    initialBenefitCostCenterForLegalEntity,
  } = state.benefitConfig;
  return {
    entityList,
    initialBenefitCostCenterForLegalEntity,
    label: getBenefitLabels(state),
    custom: getBenefitCustomField(state),
    success: getBenefitTypeSuccessMessage(state),
    error: getBenefitTypeErrorMessage(state),
    isLoading: getBenefitTypeLoader(state),
    loadingMessage: getBenefitTypeLoadingMessage(state),
    benefitDetails: getBenefitTypeExpandedItem(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    saveCustomFields: (data: any) => dispatch(saveCustomFieldsData(data)),
    saveLabelMappingData: (data: Ilabel) => dispatch(saveLabelMapping(data)),
    fetchLabelMappingData: () => dispatch(fetchLabelMapping()),
    _createBenefitType: (body: any) => dispatch(createBenefitType(body)),
    _fetchBenefitTypeDetails: (id: string) =>
      dispatch(fetchBenefitTypeConfigById(id)),
    _updateBenefitType: (id: string, body: any) =>
      dispatch(updateBenefitType(id, body)),
    _resetLabelMapping: () => dispatch(resetLabelMapping()),
    _updateConfigDetails: (configData: any, id: string) =>
      dispatch(updateConfigDetails(configData, id)),
    _addCustomBenefitTypeConfig: (configData: any, id: string) =>
      dispatch(addCustomBenefitTypeConfig(configData, id)),
    _resetMessages: () => dispatch(resetBenefitTypeMessages()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(memo(BenefitTypeConfiguration));
