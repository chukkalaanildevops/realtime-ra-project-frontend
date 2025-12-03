import { FC, memo, ReactNode, Dispatch, useEffect, useState } from 'react';
import React from 'react';
import {
  HeaderBarWrapper,
  FilterBar,
  AppDrawer,
  // NoData,
  DotMenu,
} from '../../../../../../shared/components';
import { Trans } from '@lingui/macro';
import {
  Table,
  message,
  Pagination,
  Skeleton,
  Modal,
  Tag,
  Button,
  Input,
} from 'antd';
import './ruleListing.index.less';
import { connect, ConnectedProps } from 'react-redux';
import {
  fetchRules,
  fetchRulesByQuery,
  fetchRuleById,
  deleteRule,
} from '../../../../../../shared/redux/rule/rules.thunk';
import {
  getRulesData,
  getRulesLoader,
  getRulesLoadingMessage,
  getRulesError,
  getRuleDetails,
  getRuleItemLoader,
  getPermissions,
} from '../../../../../../shared/redux/rootReducer';

import {
  FullscreenOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons';

import { setError } from '../../../../../../shared/redux/rule/rules.action';
import { appPath } from '../../../../../app/app.routes';
import { getFormattedDate } from '../../../../../../utils/scroll.utils';

import RuleSectionPreview from '../addUpdateRule/ruleSectionPreview.index';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getQueryParametersAsObject } from '../../../../../../utils/global.utils';
import { useHistory, useLocation } from 'react-router-dom';

import { FilterDropdownProps } from 'antd/lib/table/interface';
import { SearchOutlined } from '@ant-design/icons';

const { confirm } = Modal;
let pageSize = 10;

const RuleListing: FC<ConnectedProps<typeof connector>> = ({
  _fetchRulesData,
  _fetchRulesByQueryData,
  _fetchRuleDetailsById,
  deleteRule,
  getPermissions,
  error,
  isLoading,
  // loadingMessage,
  rules,
  ruleDetails,
  isRuleItemLoading,
  _setError,
}) => {
  const { push, replace } = useHistory();
  const history = useHistory();
  const location = useLocation();
  let pathname = location.pathname;
  const urlQueryParameters = getQueryParametersAsObject();

  const [editData, setEditData] = useState<any>(undefined);

  const editRule = (record: any) => {
    history.push(`${appPath.config_setup.rules.update.linkTo}${record.id}/`);
  };

  const cloneRule = (record: any) => {
    history.push(
      `${appPath.config_setup.rules.add.linkTo}?process=${record.process.code}&clone=${record.id}`,
    );
  };

  const deleteRuleRecord = (record: any) => {
    confirm({
      title: `Delete rule: ${record.title}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        const ruleId = record.id;
        await deleteRule(ruleId, rules.current_page);
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

  const handleSearch = (
    _selectedKeys: React.Key[],
    confirm: () => void,
    _dataIndex: string,
  ) => {
    confirm();
    if (_selectedKeys) {
      const pageSize = urlQueryParameters.page_size;
      const query = String(_selectedKeys[0]);
      _fetchRulesByQueryData(query, 1, pageSize);
    }
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
    const pageNo = urlQueryParameters.page || rules.current_page || 1;
    const pageSize = urlQueryParameters.page_size;
    _fetchRulesData(pageNo, pageSize);
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
    }: FilterDropdownProps) => (
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

  const columns = [
    {
      key: 'TITLE',
      title: () => getElemOrSkeleton(<Trans>Title</Trans>),
      dataIndex: 'title',
      render: getElemOrSkeleton,
      ...getSearchProps('title'),
    },
    {
      key: 'PROCESS',
      title: () => getElemOrSkeleton(<Trans>Process</Trans>),
      dataIndex: 'process',
      render: (val: any) => {
        let tagColor = 'green';
        if (val?.title === 'Request Approval') {
          tagColor = 'blue';
        } else if (val?.title === 'Benefit Claim Approval') {
          tagColor = 'purple';
        }

        return getElemOrSkeleton(<Tag color={tagColor}>{val?.title}</Tag>);
      },
    },
    {
      key: 'TYPE',
      title: () => getElemOrSkeleton(<Trans>Rule for</Trans>),
      render: (_val: any, item: any) =>
        getElemOrSkeleton(
          item
            ? (item.expense_type || item.request_type || item.benefit_type)
                ?.title
            : '',
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
      render: (_val: any, record: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <DotMenu
            actionBtn={[
              {
                Type: 'link',
                icon: EditOutlined,
                children: <Trans>Edit</Trans>,
                OnClick: () => editRule(record),
              },
              {
                Type: 'link',
                icon: CopyOutlined,
                children: <Trans>Clone</Trans>,
                OnClick: () => cloneRule(record),
              },
              {
                children: <Trans>Delete</Trans>,
                Type: 'link',
                icon: DeleteOutlined,
                OnClick: () => deleteRuleRecord(record),
              },
            ]}
          >
            <EllipsisOutlined />
          </DotMenu>
        ),
    },
  ];

  const getColumns = () => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (item.key === 'ACTION' && !getPermissions.ACTION_SETUP_RULES) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  const onItemExpand = (record: any) => {
    setEditData(record);
    _fetchRuleDetailsById(record.id);
  };

  const urlChange = () => {
    if (location.pathname === appPath.config_setup.rules.linkTo) {
      if (urlQueryParameters.page || rules.current_page) {
        const pageNo = urlQueryParameters.page || rules.current_page || 1;
        const pageSize = urlQueryParameters.page_size;
        _fetchRulesData(pageNo, pageSize);
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
    <HeaderBarWrapper headerCommonProps={{ title: <Trans>Rules</Trans> }}>
      <div className='rule-listing-container'>
        {/* table */}
        <FilterBar
          isAddButton={getPermissions.ACTION_SETUP_RULES}
          addButtonOnClickFn={() => push(appPath.config_setup.rules.add.linkTo)}
          enableBackBtn={true}
          backBtnUrl={appPath.config_setup.linkTo}
        />
        {/* {rules.pagination_data.total_records === 0 && !isLoading ? (
          <NoData />
        ) : ( */}
        <Table
          data-test='ruleListingTable'
          columns={getColumns()}
          dataSource={rules.data}
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
        {/* )} */}
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
              rules.current_page !== undefined
                ? typeof rules.current_page === 'string'
                  ? parseInt(rules.current_page)
                  : rules.current_page
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
            total={rules.pagination_data.total_records}
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
            getContainer='.rule-listing-container'
            className='app-drawer-rules'
            showCancelButton={false}
            onClose={() => setEditData(undefined)}
          >
            {isRuleItemLoading && <Skeleton />}
            {!isRuleItemLoading &&
              ruleDetails?.readable_configuration.custom.map(
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
                      <RuleSectionPreview
                        currentSectionData={customItem}
                        action='CUSTOM'
                      />
                    </div>
                  );
                },
              )}

            {!isRuleItemLoading && ruleDetails?.readable_configuration.default && (
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
                <RuleSectionPreview
                  currentSectionData={
                    ruleDetails.readable_configuration.default
                  }
                  action='DEFAULT'
                />
              </div>
            )}
          </AppDrawer>
        )}
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  rules: getRulesData(state),
  isLoading: getRulesLoader(state),
  isRuleItemLoading: getRuleItemLoader(state),
  loadingMessage: getRulesLoadingMessage(state),
  error: getRulesError(state),
  ruleDetails: getRuleDetails(state),
  getPermissions: getPermissions(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRulesData: (page?: number, pageSize?: number) =>
    dispatch(fetchRules(page, pageSize)),
  _fetchRulesByQueryData: (query: string, page?: number, pageSize?: number) =>
    dispatch(fetchRulesByQuery(query, page, pageSize)),
  _setError: () => dispatch(setError('')),
  _fetchRuleDetailsById: (id: number) => dispatch(fetchRuleById(id)),
  deleteRule: (id: number, page?: number) => dispatch(deleteRule(id, page)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(RuleListing));
