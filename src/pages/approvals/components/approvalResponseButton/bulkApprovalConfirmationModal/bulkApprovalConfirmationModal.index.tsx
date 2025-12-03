import React, { memo, FC, useState, useEffect, ChangeEvent } from 'react';
import { Modal, Table, Input, Skeleton, TableProps } from 'antd';
import { IBulkApprovalResponseData } from '../../../approvals.model';
import WarningIconWithTooltip from '../../warningIconWithTooltip/warningIconWithTooltip.index';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { getExpenseClaimViolationData } from '../../../../../services/expenseClaim';

const GetSkeletonOnLoading: React.FC<{
  isLoading: boolean;
  width?: string | number;
}> = props => {
  const { isLoading, width = '100%', children } = props;

  try {
    if (isLoading) {
      return <Skeleton.Input style={{ width: width }} size='small' active />;
    } else {
      return <>{children}</>;
    }
  } catch (error) {
    return <>{children}</>;
  }
};
interface IProps {
  onOk: (data: IBulkApprovalResponseData) => void;
  onCancel: () => void;
  responseData: IBulkApprovalResponseData;
  visibility: boolean;
  action: string;
  isLoading: boolean;
  allItemsInfo: any[];
  isTrafficLightEnable?: boolean;
}
let arr: any = [];
const BulkApprovalConfirmationModal: FC<IProps> = props => {
  const {
    onOk,
    responseData,
    visibility,
    action,
    isLoading,
    onCancel,
    allItemsInfo,
    isTrafficLightEnable = false,
  } = props;
  const [errorMessage, setErrorMessage] = useState<any>({});
  const [itemsdata, setItemsdata] = useState<
    {
      id: number;
      comment?: string;
    }[]
  >([]);
  const [remarks, setRemarks] = useState<string[]>([]);
  const [remarkError, setRemarkError] = useState<boolean>(false);

  const [
    expenseClaimViolationFetchedDataLoader,
    setExpenseClaimViolationFetchedDataLoader,
  ] = useState<boolean>(false);
  const [
    expenseClaimViolationFetchedData,
    setExpenseClaimViolationFetchedData,
  ] = useState<any>([]);
  const columns = [
    {
      title: responseData.items.length > 1 ? 'Item(s)' : 'Item',
      dataIndex: 'id',
      key: 'id',
      width: '30%',
      render: (val: number) => {
        const filteredItem = allItemsInfo.filter(o => o.id === val);
        return (
          <span key={val}>
            {responseData.item === 'request'
              ? filteredItem[0].request_no
              : filteredItem[0].claim_number}
          </span>
        );
      },
    },
    {
      title: (
        <span className={action === 'reject' ? 'mandatory' : ''}>Remarks</span>
      ),
      dataIndex: 'id',
      key: 'id',
      width: '70%',
      render: (_val: number, _item: any, index: number) => (
        <>
          <Input
            key={index}
            style={{ width: '100%' }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value;
              if (value) {
                value = value.trim();
              }

              if (value) {
                if (String(value.match(/[^=+\-!@#﹘—⸺⸻].*/g)) !== value) {
                  setErrorMessage((prev: any) => ({
                    ...prev,
                    [index]: 'Can not start with special characters.',
                  }));
                } else {
                  setErrorMessage((prev: any) => {
                    let obj = { ...prev };
                    delete obj[index];
                    return obj;
                  });
                }
              } else {
                setErrorMessage((prev: any) => {
                  let obj = { ...prev };
                  delete obj[index];
                  return obj;
                });
              }

              if (typeof value === 'string' && value?.trim() !== '') {
                if (!new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value.trim())) {
                  if (!arr.includes(index)) {
                    arr.push(index);
                  }
                } else {
                  if (arr.includes(index)) {
                    arr.splice(arr.indexOf(index), 1);
                  }
                }

                //valid comment
                updateState(_val, value, index, 'add');
              } else if (remarks.includes(String(index))) {
                // user removed entered comment

                arr.splice(arr.indexOf(index), 1);

                updateState(_val, value, index, 'remove');
              }
            }}
          />
          <p className='error-text'>{errorMessage[index]}</p>
        </>
      ),
    },
  ];

  let confirmationStatement = `Are you sure you want to ${action} below ${
    responseData.items.length > 1 ? 'items' : 'item'
  } ?`;

  const handleOk = () => {
    if (Object.keys(errorMessage).length === 0) {
      onOk({ ...responseData, items: itemsdata });
    }
  };

  const updateState = (
    _val: number,
    value: string,
    index: number,
    action: 'add' | 'remove',
  ) => {
    setItemsdata(ps => {
      const val = ps.filter(o => o.id === _val);
      const otherObj = ps.filter(o => o.id !== _val);

      return [
        ...otherObj,
        {
          ...val[0],
          comment: value.trim(),
        },
      ];
    });
    setRemarks(ps => {
      const nA = [...ps];
      if (action === 'remove') nA.splice(nA.indexOf(String(index)), 1);
      else {
        if (!nA.includes(String(index))) nA.push(String(index));
      }
      return nA;
    });
  };

  useEffect(() => {
    if (responseData?.items) setItemsdata(responseData.items);
  }, [responseData]);

  useEffect(() => {
    let flag = 0;
    for (let item of itemsdata) {
      if (
        item?.comment &&
        !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(item?.comment.trim())
      ) {
        flag = 1;
        setRemarkError(true);
      }
    }
    if (flag === 0) {
      setRemarkError(false);
    }
  }, [itemsdata]);

  const renderPolicyViolations = (expenseClaimViolationFetchedData: any) => {
    const riskContainerColor =
      expenseClaimViolationFetchedData?.flag_color === 'RED'
        ? 'border-color-red'
        : expenseClaimViolationFetchedData?.flag_color === 'ORA'
        ? 'border-color-orange'
        : '';
    const renderViolatedPolicy = (item: any, msgFlagKey: string) => {
      return (
        <>
          {item[`msg_for_${msgFlagKey}`]
            ? item[`msg_for_${msgFlagKey}`]
            : item?.policy_title}
        </>
      );
    };
    const riskScoreValue =
      expenseClaimViolationFetchedData?.flag_color === 'ORA'
        ? 'ORANGE'
        : expenseClaimViolationFetchedData?.flag_color === 'RED'
        ? 'RED'
        : '';

    const violatedPoliciesLength = expenseClaimViolationFetchedData?.violated_policy_details?.data?.filter(
      (item: any) => item?.is_show_flag_to_approver,
    )?.length;
    let displayRiskContainer = ['RED', 'ORA'].includes(
      expenseClaimViolationFetchedData?.flag_color,
    );

    return (
      <GetSkeletonOnLoading isLoading={expenseClaimViolationFetchedDataLoader}>
        {displayRiskContainer &&
          expenseClaimViolationFetchedData?.flag_score > 0 &&
          expenseClaimViolationFetchedData?.violated_policy_details?.data?.some(
            (item: any) => item?.is_show_flag_to_approver,
          ) && (
            <div
              className={`approval-risk-container ${riskContainerColor}`}
              data-testId='approval-risk-container'
            >
              <div className='approval-risk-container__risk-criteria-title-container'>
                <div className='approval-risk-container__risk-criteria-title'>
                  {violatedPoliciesLength}
                  {violatedPoliciesLength > 1
                    ? ' Policies Violated :'
                    : ' Policy Violated :'}
                </div>
                <div
                  className={`approval-risk-container__risk-score ${
                    riskScoreValue === 'ORANGE' ? 'color-orange' : 'color-red'
                  }`}
                >
                  <WarningIconWithTooltip
                    filled={false}
                    color={riskScoreValue}
                    id={'1'}
                  />
                  <span className='approval-risk-container__risk-score-title'>
                    {riskScoreValue === 'ORANGE'
                      ? 'Risk Score : Low'
                      : 'Risk Score : High'}
                  </span>
                  &nbsp;-&nbsp;
                  <span className='approval-risk-container__risk-score-data'>
                    {expenseClaimViolationFetchedData.flag_score}%
                  </span>
                </div>
              </div>
              <div className='approval-risk-container__risk-criteria'>
                <ul>
                  {expenseClaimViolationFetchedData?.violated_policy_details?.data?.map(
                    (item: any) => {
                      if (item?.is_show_flag_to_approver)
                        return (
                          <li key={item?.policy_id}>
                            {renderViolatedPolicy(item, 'approver')}
                          </li>
                        );
                    },
                  )}
                </ul>
              </div>
            </div>
          )}
      </GetSkeletonOnLoading>
    );
  };

  const tableProps: TableProps<any> = {
    expandable:
      isTrafficLightEnable &&
      allItemsInfo.some(o => ['RED', 'ORA'].includes(o?.flag_color_v2))
        ? {
            columnWidth: '10%',
            rowExpandable: record => {
              const filteredItem = allItemsInfo.find(o => o.id === record.id);
              return isTrafficLightEnable &&
                ['RED', 'ORA'].includes(filteredItem?.flag_color_v2)
                ? true
                : false;
            },
            expandedRowRender: record => {
              const filterItem = expenseClaimViolationFetchedData?.find(
                (item: any) =>
                  parseInt(item[record.id]?.expense_claim) === record.id,
              );
              if (filterItem) {
                return (
                  <div style={{ marginLeft: '30px' }}>
                    {renderPolicyViolations(filterItem[record.id])}
                  </div>
                );
              }
            },
            expandIcon: ({ expanded, onExpand, record }) => {
              const filteredItem = allItemsInfo.find(o => o.id === record.id);
              if (
                isTrafficLightEnable &&
                ['RED', 'ORA'].includes(filteredItem?.flag_color_v2)
              ) {
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '5px',
                    }}
                  >
                    {expanded ? (
                      <UpOutlined
                        onClick={(e: any) => {
                          onExpand(record, e);
                        }}
                      />
                    ) : (
                      <DownOutlined
                        onClick={async (e: any) => {
                          onExpand(record, e);
                          try {
                            if (
                              !expenseClaimViolationFetchedData.some(
                                (item: any) => item.hasOwnProperty(record.id),
                              )
                            ) {
                              setExpenseClaimViolationFetchedDataLoader(true);
                              const response = await getExpenseClaimViolationData(
                                filteredItem.id,
                              );
                              setExpenseClaimViolationFetchedDataLoader(false);
                              setExpenseClaimViolationFetchedData([
                                ...expenseClaimViolationFetchedData,
                                { [record.id]: response?.data },
                              ]);
                            }
                          } catch (error) {}
                        }}
                      />
                    )}
                    {filteredItem?.flag_color_v2 === 'ORA' && (
                      <WarningIconWithTooltip
                        color='ORANGE'
                        id={filteredItem.id}
                      />
                    )}
                    {filteredItem?.flag_color_v2 === 'RED' && (
                      <WarningIconWithTooltip
                        color='RED'
                        id={filteredItem.id}
                      />
                    )}
                  </div>
                );
              } else return null;
            },
          }
        : undefined,
  };

  return (
    <>
      <Modal
        title={false}
        visible={visibility}
        onOk={handleOk}
        onCancel={() => {
          setErrorMessage({});
          setRemarkError(false);
          setRemarks([]);
          setExpenseClaimViolationFetchedData([]);
          arr = [];
          onCancel();
        }}
        width={800}
        centered={true}
        closable={false}
        cancelText='Cancel'
        okText='Save Response'
        className='bulk-item-response-modal'
        destroyOnClose={true}
        confirmLoading={isLoading}
        okButtonProps={{
          disabled:
            (remarks.length !== responseData.items.length &&
              action === 'reject') ||
            remarkError ||
            (arr.length > 0 && action === 'approve'),
        }}
      >
        <p className='instruction-text'>{confirmationStatement}</p>
        <Table
          scroll={{
            y: 350,
          }}
          size='middle'
          dataSource={responseData.items.map(item => {
            return {
              ...item,
              key: item.id,
            };
          })}
          columns={columns}
          pagination={false}
          className='hide-unwanted-scroll y'
          {...tableProps}
        />
      </Modal>
    </>
  );
};

export default memo(BulkApprovalConfirmationModal);
