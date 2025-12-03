/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import {
  HeaderBarWrapper,
  FilterBar,
  EntityCard,
  AppDrawer,
  ConfigurationDetailView,
  ErrorBoundary,
} from '../../../shared/components';

import './benefitLegalEntityListing.index.less';
import { connect, ConnectedProps } from 'react-redux';
import {
  getBenefitTypeLoader,
  getBenefitTypeLoadingMessage,
  getBenefitTypeLegalEntityRecords,
  getBenefitTypeExpandedItem,
  getBenefitTypeDataLoading,
  getBenefitTypeData,
  getBenefitEntities,
  getBenefitTypeErrorMessage,
  getPermissions,
} from '../../../shared/redux/rootReducer';
import {
  fetchLegalEntityRecords,
  // fetchBenefitTypeConfigById,
  fetchEntities,
  attachLegalEntities,
  fetchBenefitTypeById,
  removeLegalEntity,
  revertLegalEntity,
  fetchBenefitTypeConfigById,
} from '../benefitTypeConfiguration.thunk';
import { useParams } from 'react-router-dom';
import { message, Button, Row, Col, Modal, Select } from 'antd';

import { saveExpandedItem } from '../benefitTypeConfiguration.action';
import ConfigDetails from '../benefitTypes/components/configDetails/configDetails.index';
import BenefitDetailIndex from '../../benefits/benefitDetail/benefitDetail.index';
import { Trans } from '@lingui/macro';
// import { appPath } from '../../app/app.routes';

const BenefitLegalEntityListing: React.FC<ConnectedProps<typeof connector>> = ({
  isLoading,
  legalEntitiesRecords,
  initialBenefitCostCenterForLegalEntity,
  loadingMessage,
  isDataLoading,
  benefitDetails,
  legalEntities,
  benefitType,
  error,
  getPermissions,
  _fetchLegalEntities,
  _fetchLegalEntityRecords,
  _fetchBenefitTypeDetails,
  _resetBenefitItem,
  _attachLegalEntities,
  _fetchBenefitType,
  _removeLegalEntity,
  _revertLegalEntity,
}) => {
  const params: any = useParams();
  const id = params.id;

  const [isItemExpanded, expandItem] = useState(false);
  const [isEntityModalShowing, setEntityModal] = useState(false);
  const [selectedEntities, setLegalEntities] = useState<string[]>([]);

  const onItemExpand = (record: any) => {
    const id = record.custom_configuration || record.global_configuration;
    expandItem(true);
    _fetchBenefitTypeDetails(id, record.legal_entity.title);
  };

  useEffect(() => {
    _fetchLegalEntityRecords(id);
    _fetchBenefitType(id);
  }, []);

  useEffect(() => {
    if (isLoading && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
    }
  }, [isLoading, loadingMessage]);

  const addLegalEntity = () => {
    _fetchLegalEntities();
    setLegalEntities([]);
    setEntityModal(true);
  };

  const resetConfiguration = (record: any) => {
    _revertLegalEntity(record.id, id);
  };

  const deleteConfiguration = (record: any) => {
    _removeLegalEntity(record.id, id);
  };

  useEffect(() => {
    if (error) {
      error && message.error(error);
    } else {
      message.destroy();
    }
  }, [error]);

  const renderCards = () => {
    return legalEntitiesRecords.map(item => (
      <ErrorBoundary>
        <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={4}>
          <EntityCard
            title={item.legal_entity.title}
            subTitle={item.legal_entity.legal_entity_type.title}
            onDetailClick={() => onItemExpand(item)}
            onReset={() => resetConfiguration(item)}
            onDelete={() => deleteConfiguration(item)}
            // onCustomize={() => customizeConfiguration(item)}
            isCustomConfig={item.custom_configuration ? true : false}
            isCustomizeHidden={true}
            isDotMenuHidden={!getPermissions.ACTION_SETUP_BENEFIT_TYPES}
          />
        </Col>
      </ErrorBoundary>
    ));
  };

  const closeDetailsDrawer = () => {
    _resetBenefitItem();
    expandItem(false);
  };

  const renderOptions = () => {
    try {
      const alreadyAttached = legalEntitiesRecords.map(
        item => item.legal_entity.uuid,
      );
      const items = legalEntities.filter(
        o => !alreadyAttached.includes(o.uuid),
      );

      return items
        .filter(items => items.is_active)
        .map(item => (
          <Select.Option value={item.uuid}>{item.title}</Select.Option>
        ));
    } catch (e) {
      return [];
    }
  };

  const onAttachEntities = () => {
    if (selectedEntities.length > 0) {
      setLegalEntities([]);
      setEntityModal(false);
      _attachLegalEntities(id, selectedEntities);
    } else {
      message.error('Select entity to add');
    }
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Benefit Types</Trans> }}
        breadcrumbCompVisibility={true}
        breadcrumbCompProps={{
          enableBackBtn: true,
          breadcrumProps: {
            routes: [
              {
                path: '',
                breadcrumbName: `${benefitType?.title ||
                  ''} (${benefitType?.code || ''})`,
              },
            ],
          },
        }}
      >
        <div className='benefit-type-legal-entity-listing'>
          <FilterBar
            isAddButton={getPermissions.ACTION_SETUP_BENEFIT_TYPES}
            addButtonOnClickFn={addLegalEntity}
            filterShown={true}
          />
          <Row gutter={[24, 24]}>{renderCards()}</Row>
          <AppDrawer
            visible={isItemExpanded}
            destroyOnClose={true}
            closable={true}
            onClose={closeDetailsDrawer}
            title=''
            showCancelButton={false}
            showOkButton={false}
            getContainer='.benefit-type-legal-entity-listing'
          >
            <ConfigurationDetailView
              ConfigurationComponent={
                <ConfigDetails
                  isDataLoading={isDataLoading}
                  configData={{
                    ...benefitDetails,
                    initialBenefitCostCenterForLegalEntity,
                  }}
                  isEntityList={true}
                />
              }
              customFieldsData={benefitDetails.custom_fields}
              isLoadingData={isDataLoading}
              FormPreviewComponent={
                <BenefitDetailIndex
                  benefitClaimId={undefined}
                  _configuration={benefitDetails || {}}
                />
              }
            />
          </AppDrawer>
          <Modal
            closable
            title='Add Entities'
            visible={isEntityModalShowing}
            footer={false}
            onCancel={() => setEntityModal(false)}
            maskClosable={false}
            centered={true}
            destroyOnClose={true}
            className='add-entity-container'
            getContainer='.benefit-type-legal-entity-listing'
          >
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, marginRight: 12, width: '100%' }}>
                <Select
                  style={{ width: '100%' }}
                  mode='multiple'
                  showSearch
                  maxTagCount={2}
                  value={selectedEntities}
                  onChange={selected => setLegalEntities(selected)}
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {renderOptions()}
                </Select>
              </div>
              <Button type='link' onClick={onAttachEntities}>
                Add
              </Button>
            </div>
          </Modal>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  const { initialBenefitCostCenterForLegalEntity } = state.benefitConfig;
  return {
    initialBenefitCostCenterForLegalEntity,
    isLoading: getBenefitTypeLoader(state),
    loadingMessage: getBenefitTypeLoadingMessage(state),
    legalEntitiesRecords: getBenefitTypeLegalEntityRecords(state),
    benefitDetails: getBenefitTypeExpandedItem(state),
    isDataLoading: getBenefitTypeDataLoading(state),
    legalEntities: getBenefitEntities(state),
    benefitType: getBenefitTypeData(state),
    error: getBenefitTypeErrorMessage(state),
    getPermissions: getPermissions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchLegalEntityRecords: (id: string) =>
    dispatch(fetchLegalEntityRecords(id)),
  _fetchBenefitTypeDetails: (id: string, entity: any) =>
    dispatch(fetchBenefitTypeConfigById(id, entity)),
  _resetBenefitItem: () => dispatch(saveExpandedItem({})),
  _fetchLegalEntities: () => dispatch(fetchEntities()),
  _attachLegalEntities: (id: string, legal_entity: string[]) =>
    dispatch(attachLegalEntities(id, legal_entity)),
  _fetchBenefitType: (id: string) => dispatch(fetchBenefitTypeById(id)),
  _removeLegalEntity: (id: string, typeId: string) =>
    dispatch(removeLegalEntity(id, typeId)),
  _revertLegalEntity: (id: string, typeId: string) =>
    dispatch(revertLegalEntity(id, typeId)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(BenefitLegalEntityListing);
