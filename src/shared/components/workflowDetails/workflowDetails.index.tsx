import React, { memo, ReactNode, useState, useEffect } from 'react';
import { ModalProps } from 'antd/lib/modal';
import {
  CreatedByOrModifiedByOrDeletedBy,
  IUserForDD,
  IWorkFlowDetails,
} from '../../model';
import { getFormattedDate } from '../../../utils/scroll.utils';
import { timeZoneMomentDate } from '../../../utils/global.utils';

import {
  Modal,
  Table,
  Skeleton,
  Collapse,
  Button,
  Form,
  Row,
  Col,
  Select,
  message,
} from 'antd';

import { ErrorBoundary, StatusTag, NoData } from '../';

import './workflowDetails.index.less';
import { ColumnsType } from 'antd/lib/table';
import { Trans } from '@lingui/macro';

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

const WorkflowDetails: React.FC<{
  Id?: number;
  header?: ReactNode;
  visibility: boolean;
  boldHeader?: boolean;
  isLoading?: boolean;
  modalProps?: ModalProps;
  workFlowData: IWorkFlowDetails[];
  onClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  isAdmin?: boolean;
  onApproverSelection?: (
    approvers: number[],
    stepId: number,
    isAdd: boolean,
  ) => void;
  users?: any[];
  usersLoader?: boolean;
  showAttachedWorkflow?: boolean;
  isActionAllowed?: any;
  employeeId: any;
  permissions: any;
  onWorkflowAttached?: () => void;
}> = props => {
  const {
    onClose,
    employeeId,
    visibility = false,
    boldHeader = true,
    isLoading = false,
    modalProps = {},
    workFlowData = props.workFlowData,
    isAdmin = false,
    onApproverSelection,
    users = [],
    usersLoader = false,
    showAttachedWorkflow = false,
    onWorkflowAttached,
    isActionAllowed,
    permissions,
  } = props;

  const [form] = Form.useForm();
  const [getApproversData, setApproversData] = useState<{
    id: number;
    responders: any[];
    created_by: CreatedByOrModifiedByOrDeletedBy;
    mode: 'ADD' | 'UPDATE';
  } | null>(null);
  const [activeCollapseKey, setActiveCollapseKey] = useState<string | string[]>(
    '1',
  );
  useEffect(() => {
    setActiveCollapseKey(_activeCollapseKey => String(workFlowData.length));
    // eslint-disable-next-line
  }, [workFlowData]);

  const columns: ColumnsType<any> = [
    {
      title: <Trans>Name</Trans>,
      dataIndex: 'responders',
      key: 'responders',
      width: '18%',
      render: (responders: Array<any>, item: any) => {
        let respondersList: any = responders.map(
          (i: any) => `${i.legal_name || i.name} (${i.username})`,
        );
        const DISPLAY_NAMES = 2;
        const OTHERS =
          respondersList.length - DISPLAY_NAMES > 0
            ? respondersList.length - DISPLAY_NAMES
            : 0;
        respondersList = respondersList.slice(0, 2);
        respondersList = respondersList.join(', ');
        if (OTHERS > 0) {
          respondersList = `${respondersList} and ${OTHERS} ${
            OTHERS >= 1 ? 'other' : 'others'
          }.`;
        }

        if (!respondersList) {
          respondersList = '-';
        }

        let title: string = '';
        if (item.step_owner === 'Employee Group') {
          title = respondersList;
          respondersList = item.employee_group.title;
        } else {
          if (item.responders.length === 1) {
            const responder = item.responders[0];
            respondersList = responder.legal_name || responder.name;
            title = `${responder.legal_name || responder.name} (${
              responder.username
            })`;
          }
        }

        if (item.is_new_approvers_added) {
          title += ' [UPDATED]';
        }

        return <span title={title}>{respondersList}</span>;
      },
    },
    {
      title: <Trans>Role</Trans>,
      dataIndex: 'step_owner',
      key: 'step_owner',
      width: '15%',
      render: (step_owner: any, item: any) => {
        let row = null;
        if (item.is_new_approvers_added) {
          row = <span style={{ color: 'lightgray' }}>{step_owner}</span>;
        } else {
          row = <span>{step_owner}</span>;
        }

        return row;
      },
    },
    {
      title: <Trans>Remark</Trans>,
      dataIndex: 'remark',
      key: 'remark',
      width: '20%',
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: <Trans>Status</Trans>,
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      align: 'center' as any,
      render: (status: any, item: any) => {
        let title: string = '';
        if (item.status.code === 'STALED') {
          title = item.reason_for_stalling;
        } else if (item.status.code === 'SKIPED') {
          title = item.reason_for_skipping;
        }
        return (
          <span title={title}>
            <StatusTag status={status} />
          </span>
        );
      },
    },
    {
      title: <Trans>Response</Trans>,
      dataIndex: 'response',
      key: 'status',
      width: '17%',
      render: (_status: any, item: any) => {
        let respondedOn = '--';
        if (item.responded_on !== null) {
          respondedOn = timeZoneMomentDate(
            getFormattedDate(item.responded_on, 'DD/MM/YYYY HH:mm'),
          ).format('DD/MM/YYYY HH:mm');
        }

        if (item.status.code === 'APPRVD') {
          if (item.step_owner === 'Auto-Approval') {
            return `Auto Approved on ${respondedOn}`;
          } else {
            if (item.responded_on_behalf_of !== null) {
              return `Approved by ${item.responded_by.legal_name ||
                item.responded_by.name} on behalf of ${item
                .responded_on_behalf_of.legal_name ||
                item.responded_on_behalf_of.name} on ${respondedOn}`;
            } else {
              return `Approved by ${item.responded_by.legal_name ||
                item.responded_by.name} on ${respondedOn}`;
            }
          }
        } else if (item.status.code === 'REJCTD') {
          if (item.responded_on_behalf_of !== null) {
            return `Rejected by ${item.responded_by.legal_name ||
              item.responded_by.name} on behalf of ${item.responded_on_behalf_of
              .legal_name ||
              item.responded_on_behalf_of.name} on ${respondedOn}`;
          } else {
            return `Rejected by ${item.responded_by.legal_name ||
              item.responded_by.name} on ${respondedOn}`;
          }
        }
      },
    },
  ];

  if (isAdmin) {
    columns.push({
      title: <Trans>Action</Trans>,
      dataIndex: 'status',
      key: 'status',
      width: '18%',
      align: 'center' as any,
      className: isAdmin ? '' : 'hide',
      render: (_status: any, item: any) => {
        // is_step_closed - hide column
        const activeResponders = users.filter(o => {
          const resId = item.responders.map((o: any) => o.id);
          return resId.includes(o.id);
        });
        const isEnable = isActionAllowed(permissions, employeeId);

        return isAdmin ? (
          <span className='approver-add-button'>
            <Button
              type='link'
              onClick={() => {
                setApproversData({
                  id: item.id,
                  responders: activeResponders,
                  created_by: item.created_by,
                  mode: item?.responders?.length === 0 ? 'ADD' : 'UPDATE',
                });
                form.setFieldsValue({
                  approvers: activeResponders.map((o: any) => o.id),
                });
              }}
              // icon={<UserAddOutlined />}
              disabled={item.is_step_closed || !isEnable}
            >
              {item.responders.length ? 'Update Approver' : 'Add Approver'}
            </Button>
          </span>
        ) : (
          '-'
        );
      },
    });
  }

  const getModalTitle = () => {
    if (workFlowData.length === 0) {
      return <Skeleton.Input />;
    }

    let modalTitle;
    let workflow: IWorkFlowDetails = workFlowData[0];
    if (workflow.expense_claim !== null) {
      modalTitle = `Approval Workflow For Expense Claim No. #${workflow.claim_number}`;
    } else if (workflow.request !== null) {
      modalTitle = `Approval Workflow For Request No. #${workflow.request_number}`;
    } else if (workflow.benefit_claim !== null) {
      modalTitle = `Approval Workflow For Benefit Claim No. #${workflow.claim_number}`;
    }

    if (boldHeader) {
      modalTitle = <strong>{modalTitle}</strong>;
    }

    return modalTitle;
  };

  const getWorkflowsTables = () => {
    if (workFlowData.length === 0) {
      return <NoData />;
    }
    let workflowItems = workFlowData.map(
      (item: IWorkFlowDetails, index: number) => {
        let collapseHeader: ReactNode;
        let collapseHeaderText = '';

        let submissionDate = timeZoneMomentDate(
          getFormattedDate(item.submitted_on, 'DD/MM/YYYY HH:mm'),
        ).format('DD/MM/YYYY HH:mm');

        if (item.employee !== undefined) {
          // setOnBeHalfOf(item?.employee?.id);
          if (item.employee.id === item.created_by?.id) {
            collapseHeaderText = `Submitted by ${item.employee.legal_name ||
              item.employee.name} on ${submissionDate}`;
          } else {
            collapseHeaderText = `Submitted by ${item.created_by?.legal_name ||
              item.created_by?.name} on behalf of ${item.employee.legal_name ||
              item.employee.name} on ${submissionDate}`;
          }
        } else {
          // setOnBeHalfOf(item?.on_behalf_of?.id);
          collapseHeaderText =
            item.on_behalf_of === null
              ? `Submitted by ${item.created_by?.legal_name ||
                  item.created_by?.name} on ${submissionDate}`
              : `Submitted by ${item.created_by?.legal_name ||
                  item.created_by?.name} on behalf of ${item.on_behalf_of
                  ?.legal_name ||
                  item.on_behalf_of?.name} on ${submissionDate}`;
        }

        collapseHeader = (
          <div className='workflow-collapse-header'>
            <span className='text'>{collapseHeaderText}</span>
            <span className='status'>
              <StatusTag status={item.workflow_status} />
            </span>
          </div>
        );

        const settledExtraInfo: ReactNode =
          item.workflow_status.code === 'SETTLD' ? (
            <div className='settled-message'>
              <Trans>Settled On</Trans>
              <span className='settled-date date'>
                {timeZoneMomentDate(item.settled_on).format('DD/MM/YYYY')}
              </span>
              <Trans>With Batch No.</Trans>
              <span className='settled-batch-no batch-no'>
                {item.batch_number}
              </span>
            </div>
          ) : null;

        const attachedWorkflowButton = showAttachedWorkflow ? (
          <Button
            type='link'
            onClick={() => {
              if (onWorkflowAttached) {
                onWorkflowAttached();
                onClose({} as any);
              } else {
                message.error('Something Went Wrong.');
                console.error(
                  'Developer forgot to pass `onWorkflowAttached` function',
                );
              }
            }}
          >
            <Trans>Attach Workflow</Trans>
          </Button>
        ) : null;

        if (item?.workflow_steps.length === 0) {
          return (
            <Collapse.Panel key={String(index + 1)} header={collapseHeader}>
              <div className='stalled-message'>
                <Trans>
                  Workflow is stalled because there is no attached workflow
                  rule.
                </Trans>
                {attachedWorkflowButton}
              </div>
              {item?.withdrawal_remark !== null ? (
                <div className='withdrawal-remark'>
                  <div className='title'>
                    <Trans>Withdrawal Remark</Trans>
                  </div>
                  <div className='text'>{item.withdrawal_remark}</div>
                </div>
              ) : (
                <></>
              )}
              {settledExtraInfo}
            </Collapse.Panel>
          );
        } else {
          return (
            <Collapse.Panel key={String(index + 1)} header={collapseHeader}>
              <Table
                key={index}
                dataSource={item?.workflow_steps}
                columns={columns}
                pagination={false}
                rowKey='id'
              />

              {item.withdrawal_remark !== null ? (
                <div className='withdrawal-remark'>
                  <div className='title'>
                    <Trans>Withdrawal Remark</Trans>
                  </div>
                  <div className='text'>{item.withdrawal_remark}</div>
                </div>
              ) : (
                <></>
              )}

              {settledExtraInfo}
            </Collapse.Panel>
          );
        }
      },
    );

    return (
      <Collapse
        bordered={false}
        activeKey={activeCollapseKey}
        className='workflow-collapse'
        onChange={key => {
          setActiveCollapseKey(key);
        }}
      >
        {workflowItems}
      </Collapse>
    );
  };

  const onApproversAddFn = (changedValue: any) => {
    onApproverSelection &&
      onApproverSelection(
        changedValue.approvers,
        getApproversData?.id as number,
        getApproversData?.mode === 'ADD',
      );

    setApproversData(null);
  };

  return (
    <ErrorBoundary>
      {getApproversData ? (
        <Modal
          className='add-approver-container'
          title={
            getApproversData?.responders?.length ? (
              <Trans>Update Approver</Trans>
            ) : (
              <Trans>Add Approver</Trans>
            )
          }
          visible={typeof getApproversData === 'object'}
          maskClosable={false}
          onCancel={() => setApproversData(null)}
          footer={null}
          centered={true}
          destroyOnClose={true}
        >
          <ErrorBoundary>
            <Form form={form} layout='vertical' onFinish={onApproversAddFn}>
              <Row gutter={[0, 0]} align='middle' justify='center'>
                <Col span={20}>
                  <Form.Item
                    label=''
                    name='approvers'
                    rules={[
                      () => ({
                        validator(_rule, value) {
                          if (!value || value?.length === 0) {
                            return Promise.reject(
                              'Select Atleast One Approver.',
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Select
                      showSearch
                      mode='multiple'
                      placeholder='Select Approvers'
                      style={{ width: '100%' }}
                      loading={usersLoader}
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      defaultValue={
                        getApproversData?.responders?.length
                          ? getApproversData?.responders.map(o => o.id)
                          : []
                      }
                    >
                      {users.map((o: IUserForDD, i: number) => {
                        if (getApproversData.created_by?.id !== o.id)
                          return (
                            <Select.Option value={o.id} key={i}>
                              {`${o.legal_name || o.name} (${o.emp_id}) `}
                            </Select.Option>
                          );
                        else return null;
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    style={{ marginTop: '5px', marginBottom: '24px' }}
                    type='link'
                    htmlType='submit'
                    disabled={isLoading}
                  >
                    {getApproversData?.responders?.length ? 'Update' : 'Add'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </ErrorBoundary>
        </Modal>
      ) : (
        <Modal
          className='workflow-modal'
          title={
            <GetSkeletonOnLoading isLoading={isLoading}>
              {getModalTitle()}
            </GetSkeletonOnLoading>
          }
          visible={visibility}
          onCancel={onClose}
          centered={true}
          footer={null}
          getContainer='#root'
          destroyOnClose
          {...modalProps}
        >
          <ErrorBoundary>
            <div className='workflows'>
              <GetSkeletonOnLoading isLoading={isLoading}>
                {getWorkflowsTables()}
              </GetSkeletonOnLoading>
            </div>
          </ErrorBoundary>
        </Modal>
      )}
    </ErrorBoundary>
  );
};

export default memo(WorkflowDetails);
