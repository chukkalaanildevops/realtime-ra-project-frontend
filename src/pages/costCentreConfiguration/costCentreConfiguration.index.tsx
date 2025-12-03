/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import {
  HeaderBarWrapper,
  BackButton,
  NoData,
  ErrorBoundary,
  ElementOrSkeleton,
  CustomisedDropdown,
  AppDrawer,
  SearchableUserDropdown,
} from '../../shared/components';
import {
  getCostCentre,
  getCostCentreLoader,
  getCostCentreDetails,
  getCostCentreDetailsLoader,
  getCostCentresPaginationData,
  getSystemLabelsCustomisation,
} from '../../shared/redux/rootReducer';
import {
  fetchCostCentres,
  fetchCostCentresForListing,
} from '../../shared/redux/costCentre/costCentre.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Row, Col, Button, Select, Input, Form, message } from 'antd';
import { Trans } from '@lingui/macro';
import { FilterOutlined, EditOutlined } from '@ant-design/icons';
import './costCentreConfiguration.index.less';
import { ColumnsType } from 'antd/lib/table';
import {
  generateQueryParamsString,
  getQueryParametersAsObject,
} from '../../utils/global.utils';
import { ICostCentreListingRequestParameters } from '../../shared/redux/costCentre/costCentre.model';
import { useHistory } from 'react-router-dom';
import { appPath } from '../app/app.routes';
import { updateCostCentreService } from '../../services/costCentre';
import { fetchSystemLabelsCustomisation } from '../systemLabelsCustomisation/systemLabelsCustomisation.thunk';

const mapStateToProps = (state: any) => ({
  costCentres: getCostCentre(state),
  isLoading: getCostCentreLoader(state),
  costCentreDetails: getCostCentreDetails(state),
  detailsLoader: getCostCentreDetailsLoader(state),
  paginationData: getCostCentresPaginationData(state),
  systemLabelsCustomisation: getSystemLabelsCustomisation(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchCostCentre: (id?: string) => dispatch(fetchCostCentres(id)),
  _fetchCostCentresForListing: (
    parameters: ICostCentreListingRequestParameters,
  ) => dispatch(fetchCostCentresForListing(parameters)),
  fetchSystemLabelsCustomisation: () =>
    dispatch(fetchSystemLabelsCustomisation()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

let pageSize = 20;

const CostCenterConfig: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchCostCentre,
  _fetchCostCentresForListing,
  fetchSystemLabelsCustomisation,
  costCentreDetails,
  costCentres,
  isLoading,
  paginationData,
  detailsLoader,
  systemLabelsCustomisation,
}) => {
  const { push } = useHistory();
  const urlQueryParameters = getQueryParametersAsObject();
  const [form] = Form.useForm();

  const updateCostCentre = async (
    costCentreId: number,
    data: { [key: string]: any },
  ) => {
    try {
      await updateCostCentreService(costCentreId, data);

      let parameters: ICostCentreListingRequestParameters = {
        ...urlQueryParameters,
      };

      message.success('Cost centre updated successfully');
      closeAppDrawer();
      _fetchCostCentresForListing(parameters);
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  useEffect(() => {
    let parameters: ICostCentreListingRequestParameters = {
      page: 1,
      ...urlQueryParameters,
    };

    pageSize = urlQueryParameters.page_size || 20;
    _fetchCostCentresForListing(parameters);
    fetchSystemLabelsCustomisation();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      title: costCentreDetails.title,
      code: costCentreDetails.code,
      cost_centre_type: costCentreDetails.cost_centre_type
        ? costCentreDetails.cost_centre_type.code
        : 'LOCAL',
      head_1: costCentreDetails.head_1 ? costCentreDetails.head_1.id : null,
      head_2: costCentreDetails.head_2 ? costCentreDetails.head_2.id : null,
      head_3: costCentreDetails.head_3 ? costCentreDetails.head_3.id : null,
    });
    // eslint-disable-next-line
  }, [costCentreDetails]);

  const [appDrawerProps, setAppDrawerProps] = useState<{
    visibility: boolean;
    drawerTitle: any;
    costCentreId: number;
  } | null>(null);

  const openAppDrawer = (
    title: any,
    costCentreUUID: string,
    costCentreId: number,
  ) => {
    _fetchCostCentre(costCentreUUID);

    setAppDrawerProps({
      visibility: true,
      drawerTitle: title,
      costCentreId: costCentreId,
    });
  };

  const closeAppDrawer = () => {
    setAppDrawerProps(null);
  };

  let columns: ColumnsType<any> = [
    {
      key: 'title',
      dataIndex: 'title',
      title: <Trans>Title</Trans>,
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: <Trans>Code</Trans>,
    },
    {
      key: 'cost_centre_type',
      dataIndex: 'cost_centre_type',
      title: <Trans>Type</Trans>,
      render: (_text: any, _record: any) => _record.cost_centre_type.title,
    },
    {
      key: 'is_active',
      title: <Trans>Is Active</Trans>,
      dataIndex: 'is_active',
      align: 'center',
      render: (value: boolean, _: any) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'effective_from',
      dataIndex: 'effective_from',
      title: <Trans>Effective From</Trans>,
    },
    {
      key: 'is_chargeable',
      dataIndex: 'is_chargeable',
      title: <Trans>Is Chargeable</Trans>,
      render: (value: boolean) =>
        value ? <Trans>Yes</Trans> : <Trans>No</Trans>,
    },
    {
      key: 'head_1',
      title: systemLabelsCustomisation
        ? systemLabelsCustomisation.cost_centre_head_1
        : 'Head 1',
      dataIndex: 'head_1',
      render: (_text: string, _record: any) =>
        _record.head_1 ? (
          _record?.head_1?.legal_name || _record.head_1.name
        ) : (
          <></>
        ),
    },
    {
      key: 'head_2',
      title: systemLabelsCustomisation
        ? systemLabelsCustomisation.cost_centre_head_2
        : 'Head 2',
      dataIndex: 'head_2',
      render: (_text: string, _record: any) =>
        _record.head_2 ? (
          _record?.head_2?.legal_name || _record.head_2.name
        ) : (
          <></>
        ),
    },
    {
      key: 'head_3',
      title: systemLabelsCustomisation
        ? systemLabelsCustomisation.cost_centre_head_3
        : 'Head 3',
      dataIndex: 'head_3',
      render: (_text: string, _record: any) =>
        _record.head_3 ? (
          _record?.head_3?.legal_name || _record.head_3.name
        ) : (
          <></>
        ),
    },
    {
      key: 'action',
      title: <Trans>Action</Trans>,
      dataIndex: 'action',
      render: (_text: string, _record: any) => {
        return (
          <Button
            type='link'
            title={`${(<Trans>Edit</Trans>)}`}
            icon={<EditOutlined />}
            onClick={_ => {
              openAppDrawer(_record.title, _record.uuid, _record.id);
            }}
          />
        );
      },
    },
  ];

  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    urlQueryParameters.type !== undefined
      ? urlQueryParameters.type
      : ['local', 'overs', 'inter'],
  );
  const [isActiveTypes, setSelectedIsActiveTypes] = useState<string[]>(
    urlQueryParameters.is_active !== undefined
      ? urlQueryParameters.is_active.split(',')
      : ['yes', 'no'],
  );
  const [isChargeableTypes, setSelectedIsChargeableTypes] = useState<string[]>(
    urlQueryParameters.is_chargeable !== undefined
      ? urlQueryParameters.is_chargeable.split(',')
      : ['yes', 'no'],
  );
  const [searchQuery, setSearchQuery] = useState<string | null>(
    urlQueryParameters.q !== undefined ? urlQueryParameters.q : null,
  );

  const applyFilters = () => {
    let filters: { [key: string]: any } = {};

    if (selectedTypes.length > 0 && selectedTypes.length < 3) {
      filters.type = selectedTypes.join(',');
    }

    if (isActiveTypes.length > 0 && isActiveTypes.length < 2) {
      filters.is_active = isActiveTypes.join(',');
    }

    if (isChargeableTypes.length > 0 && isChargeableTypes.length < 2) {
      filters.is_chargeable = isChargeableTypes.join(',');
    }

    if (searchQuery !== null && searchQuery.length > 0) {
      filters.q = searchQuery;
    }

    let parameters: ICostCentreListingRequestParameters = {
      ...filters,
      page: 1,
      page_size: pageSize || 20,
    };

    _fetchCostCentresForListing(parameters);
    push(
      `${appPath.config_setup.costCentre.linkTo}?${generateQueryParamsString(
        filters,
      )}&page=1&page_size=${pageSize || 20}`,
    );
  };

  const resetFilters = () => {
    let parameters: ICostCentreListingRequestParameters = {
      page: 1,
      page_size: pageSize || 20,
    };
    setSelectedTypes(['local', 'overs', 'inter']);
    setSelectedIsActiveTypes(['yes', 'no']);
    setSelectedIsChargeableTypes(['yes', 'no']);
    setSearchQuery(null);
    _fetchCostCentresForListing(parameters);
    push(appPath.config_setup.costCentre.path);
  };

  const { Option } = Select;

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{
          title: <Trans>Cost Centres</Trans>,
        }}
      >
        {costCentres.length === 0 ? (
          <div className='cost-centres-container'>
            <BackButton></BackButton>
            <NoData description='There are no cost centres in the system' />
          </div>
        ) : (
          <div className='cost-centres-container'>
            <Row
              className='back-button-filter-bar'
              justify='space-between'
              style={{ paddingBottom: 12, paddingTop: 12 }}
              align='middle'
            >
              <Col>
                <ElementOrSkeleton
                  type='input'
                  isLoading={isLoading}
                  isActive={true}
                >
                  <BackButton />
                </ElementOrSkeleton>
              </Col>
              <Col>
                <ElementOrSkeleton
                  type='input'
                  isLoading={isLoading}
                  isActive={true}
                >
                  <Button
                    type='default'
                    title={`${(<Trans>Filters</Trans>)}`}
                    className='filters-button'
                    icon={<FilterOutlined />}
                    onClick={() => setFiltersVisible(!filtersVisible)}
                  ></Button>
                </ElementOrSkeleton>
              </Col>
            </Row>

            <div
              className={
                filtersVisible
                  ? 'filters-container'
                  : 'hidden filters-container'
              }
            >
              <div className='row'>
                <div className='filter-option'>
                  <div className='filter-label'>
                    <Trans>Cost Centre Type</Trans>
                  </div>
                  <CustomisedDropdown
                    bordered={false}
                    placeholder='Cost Centre Type'
                    allValues={['local', 'overs', 'inter']}
                    preSelectedValues={selectedTypes}
                    onSelect={value => {
                      setSelectedTypes(selectedTypes => [
                        ...selectedTypes,
                        value.toString(),
                      ]);
                    }}
                    onDeselect={value => {
                      setSelectedTypes(selectedTypes =>
                        selectedTypes.filter((item: any) => item !== value),
                      );
                    }}
                    onSelectAllToggled={value => {
                      setSelectedTypes(
                        value.map((item: any) => item.toString()),
                      );
                    }}
                  >
                    <Option key='local' value='local'>
                      Local
                    </Option>
                    <Option key='overs' value='overs'>
                      Overseas
                    </Option>
                    <Option key='inter' value='inter'>
                      Internal Order
                    </Option>
                  </CustomisedDropdown>
                </div>

                <div className='filter-option'>
                  <div className='filter-label'>
                    <Trans>Is Active</Trans>
                  </div>
                  <CustomisedDropdown
                    bordered={false}
                    placeholder='Is Active'
                    allValues={['yes', 'no']}
                    preSelectedValues={isActiveTypes}
                    onSelect={value => {
                      setSelectedIsActiveTypes(selectedTypes => [
                        ...selectedTypes,
                        value.toString(),
                      ]);
                    }}
                    onDeselect={value => {
                      setSelectedIsActiveTypes(selectedTypes =>
                        selectedTypes.filter((item: any) => item !== value),
                      );
                    }}
                    onSelectAllToggled={value => {
                      setSelectedIsActiveTypes(
                        value.map((item: any) => item.toString()),
                      );
                    }}
                  >
                    <Option key='yes' value='yes'>
                      Yes
                    </Option>
                    <Option key='no' value='no'>
                      No
                    </Option>
                  </CustomisedDropdown>
                </div>

                <div className='filter-option'>
                  <div className='filter-label'>
                    <Trans>Is Chargeable</Trans>
                  </div>
                  <CustomisedDropdown
                    bordered={false}
                    placeholder='Is Chargeable'
                    allValues={['yes', 'no']}
                    preSelectedValues={isChargeableTypes}
                    onSelect={value => {
                      setSelectedIsChargeableTypes(selectedTypes => [
                        ...selectedTypes,
                        value.toString(),
                      ]);
                    }}
                    onDeselect={value => {
                      setSelectedIsChargeableTypes(selectedTypes =>
                        selectedTypes.filter((item: any) => item !== value),
                      );
                    }}
                    onSelectAllToggled={value => {
                      setSelectedIsChargeableTypes(
                        value.map((item: any) => item.toString()),
                      );
                    }}
                  >
                    <Option key='yes' value='yes'>
                      Yes
                    </Option>
                    <Option key='no' value='no'>
                      No
                    </Option>
                  </CustomisedDropdown>
                </div>

                <div className='filter-option'>
                  <div className='filter-label'>
                    <Trans>Title Or Code Starts With</Trans>
                  </div>
                  <Input
                    value={searchQuery !== null ? searchQuery : undefined}
                    className='search-query'
                    placeholder='Search query'
                    onChange={event => {
                      setSearchQuery(
                        event.target.value !== undefined
                          ? event.target.value
                          : null,
                      );
                    }}
                  />
                </div>
              </div>

              <div className='buttons'>
                <Button
                  type='link'
                  onClick={_ => {
                    resetFilters();
                  }}
                >
                  <Trans>Reset</Trans>
                </Button>
                <Button
                  type='primary'
                  onClick={_ => {
                    applyFilters();
                  }}
                >
                  <Trans>Filter</Trans>
                </Button>
              </div>
            </div>

            <ElementOrSkeleton
              type='table'
              isLoading={isLoading}
              isActive={true}
              tableConfiguration={{
                rows: 10,
                columns: 9,
              }}
            >
              <Table
                bordered={true}
                columns={columns}
                dataSource={costCentres}
                rowKey='id'
                pagination={{
                  position: ['bottomRight'],
                  hideOnSinglePage: false,
                  current:
                    urlQueryParameters.page !== undefined
                      ? typeof urlQueryParameters.page === 'string'
                        ? parseInt(urlQueryParameters.page)
                        : urlQueryParameters.page
                      : 1,
                  defaultCurrent: 1,
                  showQuickJumper: {
                    goButton: (
                      <Button type='default'>
                        <Trans>Go</Trans>
                      </Button>
                    ),
                  },
                  showSizeChanger: true,
                  defaultPageSize: 20,
                  pageSize: pageSize || 20,
                  total: paginationData.total_records,
                  showLessItems: true,
                  onShowSizeChange: (_current, size) => {
                    pageSize = size;
                  },
                  showTotal: (total: number, range: number[]) => {
                    return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                  },
                  onChange: (pageNumber: number, _size?: number) => {
                    // urlQueryParameters = {
                    //   ...urlQueryParameters,
                    // }

                    let urlParams: any;

                    if (
                      typeof urlQueryParameters?.type !== 'string' &&
                      urlQueryParameters?.type?.length > 1
                    ) {
                      urlParams = {
                        ...urlQueryParameters,
                        type: urlQueryParameters.type.join(','),
                      };
                    } else {
                      urlParams = { ...urlQueryParameters };
                    }

                    let queryParameters = {
                      ...urlParams,
                      page: pageNumber,
                      page_size: pageSize || 20,
                    };

                    let parameters: ICostCentreListingRequestParameters = {
                      ...queryParameters,
                    };

                    _fetchCostCentresForListing(parameters);
                    push(
                      `${
                        appPath.config_setup.costCentre.linkTo
                      }?${generateQueryParamsString(queryParameters)}`,
                    );
                  },
                }}
              />
            </ElementOrSkeleton>

            <AppDrawer
              width={'50%'}
              visible={appDrawerProps?.visibility}
              destroyOnClose={true}
              closable={true}
              onClose={closeAppDrawer}
              title={
                <>
                  <span>{appDrawerProps?.drawerTitle}</span>
                </>
              }
              showCancelButton={false}
              showOkButton={false}
              getContainer='.cost-centres-container'
              className='.detail-drawer'
            >
              <ElementOrSkeleton
                isActive={true}
                isLoading={detailsLoader}
                type='page'
              >
                <Form
                  form={form}
                  layout='vertical'
                  className='update-cost-centre-form'
                  onFinish={values => {
                    if (appDrawerProps?.costCentreId) {
                      updateCostCentre(appDrawerProps?.costCentreId, values);
                    }
                  }}
                >
                  <Form.Item label={<Trans>Title</Trans>}>
                    <Input
                      value={costCentreDetails.title}
                      disabled={true}
                      readOnly={true}
                    />
                  </Form.Item>

                  <Form.Item label={<Trans>Code</Trans>}>
                    <Input
                      value={costCentreDetails.code}
                      disabled={true}
                      readOnly={true}
                    />
                  </Form.Item>

                  <Form.Item
                    name='cost_centre_type'
                    label={<Trans>Cost Centre Type</Trans>}
                    required={true}
                  >
                    <Select disabled={true}>
                      <Option key='LOCAL' value='LOCAL'>
                        Local
                      </Option>
                      <Option key='OVERS' value='OVERS'>
                        Overseas
                      </Option>
                      <Option key='INTER' value='INTER'>
                        Internal Order
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name='head_1'
                    label={
                      systemLabelsCustomisation
                        ? systemLabelsCustomisation.cost_centre_head_1
                        : 'Cost Centre Head 1'
                    }
                  >
                    <SearchableUserDropdown
                      isFormField={true}
                      fieldName='head_1'
                      selectedUser={costCentreDetails.head_1}
                    />
                  </Form.Item>

                  <Form.Item
                    name='head_2'
                    label={
                      systemLabelsCustomisation
                        ? systemLabelsCustomisation.cost_centre_head_2
                        : 'Cost Centre Head 2'
                    }
                  >
                    <SearchableUserDropdown
                      isFormField={true}
                      fieldName='head_2'
                      selectedUser={costCentreDetails.head_2}
                    />
                  </Form.Item>

                  <Form.Item
                    name='head_3'
                    label={
                      systemLabelsCustomisation
                        ? systemLabelsCustomisation.cost_centre_head_3
                        : 'Cost Centre Head 3'
                    }
                  >
                    <SearchableUserDropdown
                      isFormField={true}
                      fieldName='head_3'
                      selectedUser={costCentreDetails.head_3}
                    />
                  </Form.Item>

                  <div className='buttons'>
                    <Button type='primary' htmlType='submit'>
                      <Trans>Update</Trans>
                    </Button>
                  </div>
                </Form>
              </ElementOrSkeleton>
            </AppDrawer>
          </div>
        )}
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

export default connector(CostCenterConfig);
