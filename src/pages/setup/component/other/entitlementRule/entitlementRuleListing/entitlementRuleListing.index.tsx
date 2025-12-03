import React, { useState } from 'react';

import { FC, memo, Dispatch, ReactNode, useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { useHistory, useLocation } from 'react-router';
import { Trans } from '@lingui/macro';
import { SearchOutlined } from '@ant-design/icons';
import {
  AppDrawer,
  DotMenu,
  ElementOrSkeleton,
  FilterBar,
  HeaderBarWrapper,
} from '../../../../../../shared/components';

import { getFormattedDate } from '../../../../../../utils/scroll.utils';

import './entitlementRuleListing.index.less';
import {
  Table,
  message,
  Skeleton,
  Tag,
  Pagination,
  Button,
  Modal,
  Input,
} from 'antd';

import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FullscreenOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  FundViewOutlined,
  FundProjectionScreenOutlined,
} from '@ant-design/icons';
import { setError } from '../../../../../../shared/redux/entitlementRule/entitlementRules.action';
import {
  fetchEntitlementRules,
  fetchEntitlementById,
  deleteEntitlementRule,
  executeEntitlementRule,
  simulateEntitlementRule,
} from '../../../../../../shared/redux/entitlementRule/entitlementRules.thunk';
import {
  getEntitlementRulesError,
  getEntitlementRulesItemLoader,
  getEntitlementRulesLoader,
  getEntitlementRulesData,
  getEntitlementRuleDetails,
  getIsSimulatedDataLoading,
  getSimulatedEntitementData,
  getSelectedProcessTypeForEntitlement,
  getIsRuleItemLoading,
} from '../../../../../../shared/redux/rootReducer';

import { appPath } from '../../../../../app/app.routes';

import { getQueryParametersAsObject } from '../../../../../../utils/global.utils';
import EntitlementRuleSectionPreview from '../addUpdateEntitlementRule/entitlementRuleSectionPreview';
import { selectedBenefitTypeConfig } from '../../../../../../shared/redux/entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.thunk';
const { confirm } = Modal;
let pageSize = 10;

const EntitlementRuleListing: FC<ConnectedProps<typeof connector>> = ({
  _fetchEntitlementRulesData,
  _fetchEntitlementRuleDetailsById,
  selectedProcessTypeForEntitlement,
  isRuleItemLoading,
  error,
  isLoading,
  entitlementRulesLoader,
  deleteEntitlementRule,
  executeEntitlementRule,
  simulateEntitlementRule,
  entitlementRules,
  benefitTypeConfig,
  entitlementRuleDetails,
  isEntitlementRuleItemLoading,
  _selectedBenefitTypeConfig,
  _setError,
}) => {
  const { push, replace } = useHistory();
  const history = useHistory();
  const location = useLocation();
  let pathname = location.pathname;
  const urlQueryParameters = getQueryParametersAsObject();
  // const { getSearchProps } = useTableFilters();

  const [editData, setEditData] = useState<any>(undefined);

  const config = benefitTypeConfig.selectedBenefitTypeConfig;
  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
    const pageNo =
      urlQueryParameters.page || entitlementRules.current_page || 1;
    const pageSize = urlQueryParameters.page_size;
    _fetchEntitlementRulesData(pageNo, pageSize);
  };
  const handleSearch = (
    _selectedKeys: React.Key[],
    confirm: () => void,
    _dataIndex: string,
  ) => {
    confirm();
    if (_selectedKeys) {
      const pageSize =
        urlQueryParameters.page_size || entitlementRules.current_page;
      const query = String(_selectedKeys[0]);
      _fetchEntitlementRulesData(1, pageSize, query);
    }
  };
  const editEntitlementRule = (record: any) => {
    history.push(
      `${appPath.config_setup.entitlementRules.update.linkTo}${record.id}/`,
    );
  };
  const viewSimulatedEntitlementRule = (record: any) => {
    history.push(
      `${appPath.config_setup.entitlementRules.simulate.linkTo}${record.id}/`,
    );
  };
  const cloneEntitlementRule = (record: any) => {
    history.push(
      `${appPath.config_setup.entitlementRules.add.linkTo}?process=${record.process.code}&clone=${record.id}`,
    );
  };
  const getSearchProps = (
    dataIndex: string,
    renderFunction?: (_val: any, _record?: any, _index?: number) => ReactNode,
  ) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          autoFocus
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            if (!e.target.value) {
              handleReset(clearFilters);
            }
          }}
          onPressEnter={() => {
            handleSearch(selectedKeys, confirm, dataIndex);
          }}
          suffix={<SearchOutlined style={{ color: '#1890ff' }} />}
          allowClear
        />
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: renderFunction,
  });
  const deleteEntitlementRuleRecord = (record: any) => {
    confirm({
      title: `Delete entitlement: ${record.title}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        const ruleId = record.id;
        await deleteEntitlementRule(ruleId, entitlementRules.current_page);
      },
      onCancel() {},
    });
  };

  const executeEntitlementRuleRecord = (record: any) => {
    confirm({
      title: `Do you want to execute ${record.title} entitement rule ?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        const ruleId = record.id;
        await executeEntitlementRule(ruleId, record.process.code);
        message.success(`Execution for ${record.title} started.`);
      },
      onCancel() {},
    });
  };

  const simulateEntitlementRuleRecord = (record: any) => {
    confirm({
      title: `Simulate ${record.title} entitlement rule`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        const ruleId = record.id;
        const data = {
          process: record.process.code,
        };
        await simulateEntitlementRule(ruleId, data);
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    error && message.error(error, 3, _setError);
  }, [_setError, error]);

  const getElemOrSkeleton = (
    _text: string | ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return isLoading ? (
      <Skeleton.Input size='small' active={isLoading} />
    ) : (
      _text
    );
  };

  const columns = [
    {
      key: 'TITLE',
      title: () => getElemOrSkeleton(<Trans>Title</Trans>),
      dataIndex: 'title',
      ...getSearchProps('title'),
      render: getElemOrSkeleton,
    },
    {
      key: 'PROCESS',
      title: () => getElemOrSkeleton(<Trans>Process</Trans>),
      dataIndex: 'process',
      render: (val: any) => {
        let tagColor = 'green';
        if (val?.code === 'BEN') {
          tagColor = 'purple';
        }
        return getElemOrSkeleton(<Tag color={tagColor}>{val?.title}</Tag>);
      },
    },
    {
      key: 'TYPE',
      title: () => getElemOrSkeleton(<Trans>Entitlement Rule for</Trans>),
      render: (_val: any, item: any) =>
        getElemOrSkeleton(
          item ? (item.benefit_type || item.expense_type)?.title : '',
        ),
    },
    {
      key: 'MODIFIED_BY',
      title: () => getElemOrSkeleton(<Trans>Modified By</Trans>),
      dataIndex: 'modified_by',
      render: (val: any) => getElemOrSkeleton(val?.legal_name || val?.name),
    },
    {
      key: 'MODIFIED_ON',
      title: () => getElemOrSkeleton(<Trans>Modified On</Trans>),
      dataIndex: 'modified_on',
      render: (val: any) => getElemOrSkeleton(getFormattedDate(val)),
    },
    {
      key: 'ACTION',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      dataIndex: '',
      width: '100px',
      render: (_val: any, record: any) => {
        return (
          <>
            {isLoading ? (
              getElemOrSkeleton('')
            ) : (
              <DotMenu
                actionBtn={[
                  {
                    Type: 'link',
                    icon: EditOutlined,
                    children: <Trans>Edit</Trans>,
                    OnClick: () => editEntitlementRule(record),
                  },
                  {
                    children: <Trans>Delete</Trans>,
                    Type: 'link',
                    icon: DeleteOutlined,
                    OnClick: () => deleteEntitlementRuleRecord(record),
                  },
                  {
                    Type: 'link',
                    icon: CopyOutlined,
                    children: <Trans>Clone</Trans>,
                    OnClick: () => cloneEntitlementRule(record),
                  },
                  {
                    children: <Trans>Execute</Trans>,
                    Type: 'link',
                    icon: PlayCircleOutlined,
                    OnClick: () => executeEntitlementRuleRecord(record),
                  },
                  {
                    children: <Trans>Simulate</Trans>,
                    Type: 'link',
                    icon: FundProjectionScreenOutlined,
                    OnClick: () => simulateEntitlementRuleRecord(record),
                  },
                  {
                    children: <Trans>View Results</Trans>,
                    Type: 'link',
                    icon: FundViewOutlined,
                    OnClick: () => viewSimulatedEntitlementRule(record),
                  },
                ]}
              >
                <EllipsisOutlined />
              </DotMenu>
            )}
          </>
        );
      },
    },
  ];

  const onItemExpand = (record: any) => {
    setEditData(record);
    record?.process.code === 'BEN' &&
      _selectedBenefitTypeConfig(
        record?.benefit_type?.global_configuration,
        record?.process.code,
      );
    _fetchEntitlementRuleDetailsById(record.id);
  };

  const urlChange = () => {
    if (location.pathname === appPath.config_setup.entitlementRules.linkTo) {
      if (urlQueryParameters.page || entitlementRules.current_page) {
        const pageNo = urlQueryParameters.page || entitlementRules.current_page;
        const pageSize = urlQueryParameters.page_size;
        _fetchEntitlementRulesData(pageNo, pageSize);
      }
    }
  };

  useEffect(urlChange, [location.search]);

  useEffect(() => {
    pageSize = urlQueryParameters?.page_size || 10;
    const page = urlQueryParameters?.page || 1;
    replace(`${pathname}?page=${page}&page_size=${pageSize}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <HeaderBarWrapper headerCommonProps={{ title: <Trans>Entitlement</Trans> }}>
      <div className='entitlement-rule-listing-container'>
        {entitlementRulesLoader ? (
          <ElementOrSkeleton
            isLoading={entitlementRulesLoader}
            type={'table'}
            tableConfiguration={{ columns: 8, rows: 10 }}
          />
        ) : (
          <>
            <FilterBar
              isAddButton={true}
              addButtonOnClickFn={() =>
                push(appPath.config_setup.entitlementRules.add.linkTo)
              }
              enableBackBtn={true}
              backBtnUrl={appPath.config_setup.entitlementRules.backLink}
            />

            <Table
              // data-test='entitlementRuleListingTable'
              columns={columns}
              dataSource={entitlementRules.data}
              bordered
              loading={isLoading}
              rowKey={record => record?.item?.id}
              pagination={false}
              expandable={{
                expandedRowRender: () => null,
                rowExpandable: () => true,
                expandIcon: ({ record }) =>
                  isLoading ? (
                    <Skeleton.Input size='small' active={isLoading} />
                  ) : (
                    <FullscreenOutlined
                      onClick={() => onItemExpand(record)}
                      title='Details'
                    />
                  ),
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginTop: 12,
              }}
            >
              <Pagination
                showQuickJumper={{
                  goButton: (
                    <Button type='default'>
                      <Trans>Go</Trans>
                    </Button>
                  ),
                }}
                defaultCurrent={1}
                current={
                  entitlementRules.current_page !== undefined
                    ? typeof entitlementRules.current_page === 'string'
                      ? parseInt(entitlementRules.current_page)
                      : entitlementRules.current_page
                    : 1
                }
                pageSizeOptions={['10', '20', '50', '100']}
                pageSize={pageSize || 10}
                onShowSizeChange={(_current, size) => {
                  pageSize = size;
                }}
                onChange={page => {
                  push(`${pathname}?page=${page}&page_size=${pageSize}`);
                }}
                hideOnSinglePage={false}
                total={entitlementRules.pagination_data.total_records}
                showTotal={(total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                }}
              />
            </div>
            {editData && (
              <AppDrawer
                title={editData.title}
                closable
                visible={editData}
                showOkButton={false}
                getContainer='.entitlement-rule-listing-container'
                className='app-drawer-entitlement-rules'
                showCancelButton={false}
                onClose={() => setEditData(undefined)}
              >
                {isEntitlementRuleItemLoading && <Skeleton />}

                {!isEntitlementRuleItemLoading &&
                  !isRuleItemLoading &&
                  entitlementRuleDetails?.readable_configuration.custom.map(
                    (customItem: any, customItemIndex: number) => {
                      return (
                        <div key={customItemIndex}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              border: '1px solid lightgray',
                              borderBottom: '0',
                              padding: '0 18px',
                            }}
                          >
                            <div>Criteria {customItemIndex + 1}</div>
                          </div>
                          <EntitlementRuleSectionPreview
                            selectedProcessTypeForEntitlement={
                              selectedProcessTypeForEntitlement
                            }
                            config={config}
                            currentSectionData={customItem}
                            action='CUSTOM'
                          />
                        </div>
                      );
                    },
                  )}

                {!isEntitlementRuleItemLoading &&
                  !isRuleItemLoading &&
                  entitlementRuleDetails?.readable_configuration.default && (
                    <div>
                      <div
                        style={{
                          border: '1px solid lightgray',
                          borderBottom: '0',
                          padding: '0 18px',
                          marginTop: '24px',
                        }}
                      >
                        <Trans>Default Criteria</Trans>
                      </div>
                      <EntitlementRuleSectionPreview
                        selectedProcessTypeForEntitlement={
                          selectedProcessTypeForEntitlement
                        }
                        config={config}
                        currentSectionData={
                          entitlementRuleDetails.readable_configuration.default
                        }
                        action='DEFAULT'
                      />
                    </div>
                  )}
              </AppDrawer>
            )}
          </>
        )}
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => {
  const { entitlementRulesLoader } = state.entitlementRules;

  return {
    entitlementRules: getEntitlementRulesData(state),
    isLoading: getEntitlementRulesLoader(state),
    isEntitlementRuleItemLoading: getEntitlementRulesItemLoader(state),
    isRuleItemLoading: getIsRuleItemLoading(state),
    // lodingMessage: getEntitlementRulesLodingMessage(state),
    entitlementRuleDetails: getEntitlementRuleDetails(state),
    error: getEntitlementRulesError(state),
    benefitTypeConfig: state.addUpdateEntitlementRule,
    isSimulatedDataLoading: getIsSimulatedDataLoading(state),
    simulatedEntitlementData: getSimulatedEntitementData(state),
    selectedProcessTypeForEntitlement: getSelectedProcessTypeForEntitlement(
      state,
    ),
    entitlementRulesLoader,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchEntitlementRulesData: (page?: number, pageSize?: number, query?: any) =>
    dispatch(fetchEntitlementRules(page, pageSize, query)),
  _setError: () => dispatch(setError('')),
  _fetchEntitlementRuleDetailsById: (id: number) =>
    dispatch(fetchEntitlementById(id)),
  deleteEntitlementRule: (id: number, page?: number) =>
    dispatch(deleteEntitlementRule(id, page)),
  executeEntitlementRule: (id: number, code?: any) =>
    dispatch(executeEntitlementRule(id, code)),
  simulateEntitlementRule: (id: number, data: any) =>
    dispatch(simulateEntitlementRule(id, data)),
  _selectedBenefitTypeConfig: (typeId: number, process: string) =>
    dispatch(selectedBenefitTypeConfig(typeId, process)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(EntitlementRuleListing));
