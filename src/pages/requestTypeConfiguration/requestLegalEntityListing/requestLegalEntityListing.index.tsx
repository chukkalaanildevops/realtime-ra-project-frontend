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

import './requestLegalEntityListing.index.less';
import { connect, ConnectedProps } from 'react-redux';
import {
  getRequestTypeLoader,
  getRequestTypeLoadingMessage,
  getRequestTypeLegalEntityRecords,
  getRequestTypeExpandedItem,
  getRequestTypeDataLoading,
  getEntities,
  getRequestTypeData,
  getRequestTypeErrorMessage,
  getPermissions,
  getLabels,
} from '../../../shared/redux/rootReducer';
import {
  fetchLegalEntityRecords,
  fetchRequestTypeConfigById,
  fetchEntities,
  attachLegalEntities,
  fetchRequestTypeById,
  removeLegalEntity,
  revertLegalEntity,
} from '../requestTypeConfiguration.thunk';
import { useHistory, useParams } from 'react-router-dom';
import { message, Button, Row, Col, Modal, Select } from 'antd';

import {
  saveExpandedItem,
  saveLegalEntityRecords,
} from '../requestTypeConfiguration.action';
import ConfigDetails from '../requestTypes/components/configDetails.index';
import { appPath } from '../../app/app.routes';
import { AddRequestForm } from '../addRequest/components';
import { Trans } from '@lingui/macro';

const RequestLegalEntityListing: React.FC<ConnectedProps<typeof connector>> = ({
  isLoading,
  legalEntitiesRecords,
  loadingMessage,
  isDataLoading,
  requestDetails,
  legalEntities,
  requestType,
  error,
  label,
  getPermissions,
  _fetchLegalEntities,
  _fetchLegalEntityRecords,
  _fetchRequestTypeDetails,
  _resetRequestItem,
  _attachLegalEntities,
  _fetchRequestType,
  _removeLegalEntity,
  _revertLegalEntity,
  _resetLegalEntityRecords,
}) => {
  const params: any = useParams();
  const id = params.id;
  const history = useHistory();

  const [isItemExpanded, expandItem] = useState(false);
  const [isEntityModalShowing, setEntityModal] = useState(false);
  const [selectedEntities, setLegalEntities] = useState<string[]>([]);

  const onItemExpand = (record: any) => {
    const id = record.custom_configuration || record.global_configuration;
    expandItem(true);
    _fetchRequestTypeDetails(id);
  };

  useEffect(() => {
    _fetchLegalEntityRecords(id);
    _fetchRequestType(id);

    return () => _resetLegalEntityRecords();
  }, []);

  useEffect(() => {
    if (isLoading && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
    }
  }, [isLoading, loadingMessage]);

  useEffect(() => {
    if (error) {
      error && message.error(error);
    } else {
      message.destroy();
    }
  }, [error]);

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

  const customizeConfiguration = (record: any) => {
    const url =
      appPath.config_setup.requestType.legalEntityListing.customize.linkTo +
      id +
      '/';
    // return;
    const configId = record.custom_configuration || record.global_configuration;
    if (record.custom_configuration) {
      history.push(`${url}?mode=cu&conf_id=${configId}`);
    } else {
      history.push(
        `${url}?mode=ca&conf_id=${configId}&entity=${record.legal_entity.uuid}`,
      );
    }
  };

  const renderCards = () => {
    return legalEntitiesRecords.map(item => (
      <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={4}>
        <ErrorBoundary>
          <EntityCard
            key={item.id}
            title={item.legal_entity.title}
            subTitle={item.legal_entity.legal_entity_type.title}
            onDetailClick={() => onItemExpand(item)}
            onReset={() => resetConfiguration(item)}
            onDelete={() => deleteConfiguration(item)}
            onCustomize={() => customizeConfiguration(item)}
            isCustomConfig={item.custom_configuration ? true : false}
            isDotMenuHidden={!getPermissions.ACTION_SETUP_REQUEST_TYPES}
          />
        </ErrorBoundary>
      </Col>
    ));
  };

  const closeDetailsDrawer = () => {
    _resetRequestItem();
    expandItem(false);
  };

  const renderOptions = () => {
    const alreadyAttached = legalEntitiesRecords.map(
      item => item.legal_entity.uuid,
    );
    const items = legalEntities.filter(o => !alreadyAttached.includes(o.uuid));

    return items
      .filter(items => items.is_active)
      .map(item => (
        <Select.Option value={item.uuid}>{item.title}</Select.Option>
      ));
  };

  const onAttachEntities = () => {
    if (selectedEntities.length > 0) {
      // api call for adding
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
        headerCommonProps={{ title: <Trans>Request Types</Trans> }}
        breadcrumbCompVisibility={true}
        breadcrumbCompProps={{
          enableBackBtn: true,
          breadcrumProps: {
            routes: [
              {
                path: '',
                breadcrumbName: `${requestType?.title ||
                  ''} (${requestType?.code || ''})`,
              },
            ],
          },
        }}
      >
        <div className='request-type-legal-entity-listing'>
          <FilterBar
            isAddButton={getPermissions.ACTION_SETUP_REQUEST_TYPES}
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
            getContainer='.request-type-legal-entity-listing'
          >
            <ConfigurationDetailView
              ConfigurationComponent={
                <ConfigDetails
                  isDataLoading={isDataLoading}
                  configData={requestDetails}
                />
              }
              customFieldsData={requestDetails.custom_fields}
              isLoadingData={isDataLoading}
              FormPreviewComponent={
                <AddRequestForm
                  is_travel_type={requestDetails.is_travel_type || false}
                  is_preview={true}
                  requestData={requestDetails}
                  labelData={label}
                  customFields={requestDetails.custom_fields}
                />
              }
            />
          </AppDrawer>
          <Modal
            closable
            title={<Trans>Add Entities</Trans>}
            visible={isEntityModalShowing}
            footer={false}
            onCancel={() => setEntityModal(false)}
            maskClosable={false}
            centered={true}
            destroyOnClose={true}
            className='add-entity-container'
            getContainer='.request-type-legal-entity-listing'
          >
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, marginRight: 12, width: '100%' }}>
                <Select
                  style={{ width: '100%' }}
                  mode='multiple'
                  maxTagCount={2}
                  value={selectedEntities}
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={selected => setLegalEntities(selected)}
                >
                  {renderOptions()}
                </Select>
              </div>
              <Button type='link' onClick={onAttachEntities}>
                <Trans>Add</Trans>
              </Button>
            </div>
          </Modal>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  isLoading: getRequestTypeLoader(state),
  loadingMessage: getRequestTypeLoadingMessage(state),
  legalEntitiesRecords: getRequestTypeLegalEntityRecords(state),
  requestDetails: getRequestTypeExpandedItem(state),
  isDataLoading: getRequestTypeDataLoading(state),
  legalEntities: getEntities(state),
  requestType: getRequestTypeData(state),
  error: getRequestTypeErrorMessage(state),
  getPermissions: getPermissions(state),
  label: getLabels(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchLegalEntityRecords: (id: string) =>
    dispatch(fetchLegalEntityRecords(id)),
  _fetchRequestTypeDetails: (id: string) =>
    dispatch(fetchRequestTypeConfigById(id, true)),
  _resetRequestItem: () => dispatch(saveExpandedItem({})),
  _fetchLegalEntities: () => dispatch(fetchEntities(true)),
  _attachLegalEntities: (id: string, legal_entity: string[]) =>
    dispatch(attachLegalEntities(id, legal_entity)),
  _fetchRequestType: (id: string) => dispatch(fetchRequestTypeById(id)),
  _removeLegalEntity: (id: string, typeId: string) =>
    dispatch(removeLegalEntity(id, typeId)),
  _revertLegalEntity: (id: string, typeId: string) =>
    dispatch(revertLegalEntity(id, typeId)),
  _resetLegalEntityRecords: () => dispatch(saveLegalEntityRecords([])),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(RequestLegalEntityListing);
