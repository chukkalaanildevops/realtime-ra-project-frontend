/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, memo, useEffect } from 'react';
import {
  ElementOrSkeleton,
  HeaderBarWrapper,
} from '../../../shared/components';
import {
  getSubmittedLoader,
  getSubmittedLoadingMessage,
  getSubmittedRequestDetails,
  getSubmittedSuccess,
  getSubmittedError,
} from '../../../shared/redux/rootReducer';
import { fetchRequestDetailsById } from '../submitted.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { message, Result } from 'antd';
import {
  setSuccess,
  setError,
} from '../../../shared/redux/referenceObject/referenceObject.actions';

import AddNewExpense from '../../addNewExpense/addNewExpense.index';
import { StopOutlined } from '@ant-design/icons';
import { RequestDetails } from '../components';
import { appPath } from '../../app/app.routes';
import { Trans } from '@lingui/macro';

const AddRequestNewExpense: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchRequestDetails,
  _setError,
  _setSuccess,
  isLoading,
  loadingMessage,
  requestDetails,
  error,
  success,
}) => {
  const params: any = useParams();
  const id = params.requestId;
  const history = useHistory();

  useEffect(() => {
    _fetchRequestDetails(id);
  }, []);

  useEffect(() => {
    if (isLoading && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
      _setSuccess();
      _setError();
    }
  }, [isLoading, loadingMessage]);

  useEffect(() => {
    success && message.success(success, 3, _setSuccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    error && message.error(error, 3, _setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  let routes = [
    { path: '', breadcrumbName: 'Request' },
    {
      path: '',
      breadcrumbName: requestDetails?.request_no,
    },
    { path: '', breadcrumbName: 'Add New Expense' },
  ];

  const onExpenseAdded = () => {
    message.success('Expense added successfully', 3, () => {
      history.push(`${appPath.submitted.expenses.linkTo}${id}`);
    });
  };

  return (
    <HeaderBarWrapper
      breadcrumbCompVisibility={true}
      breadcrumbCompProps={{
        enableBackBtn: true,
        breadcrumProps: {
          routes,
        },
        backBtnUrl: appPath.submitted.expenses.linkTo,
      }}
      headerCommonProps={{ title: <Trans>Submitted</Trans> }}
    >
      <div className='request-expense-listing'>
        {!requestDetails?.workflow_status?.code ||
        requestDetails?.workflow_status?.code === 'APPRVD' ? (
          <>
            <ElementOrSkeleton
              isLoading={!requestDetails}
              isActive={true}
              type='page'
            >
              <RequestDetails requestDetails={requestDetails} />
            </ElementOrSkeleton>
            <div style={{ marginTop: 12 }}>
              <AddNewExpense
                isForRequest={true}
                requestId={Number(id)}
                onExpenseAddedSuccessfully={onExpenseAdded}
              />
            </div>
          </>
        ) : (
          <Result
            title='Action Not Allowed'
            subTitle='You can not add expenses to this request'
            icon={<StopOutlined style={{ color: '#dce6f1' }} />}
          />
        )}
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  isLoading: getSubmittedLoader(state),
  loadingMessage: getSubmittedLoadingMessage(state),
  requestDetails: getSubmittedRequestDetails(state),
  success: getSubmittedSuccess(state),
  error: getSubmittedError(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRequestDetails: (id: string) => dispatch(fetchRequestDetailsById(id)),
  _setSuccess: () => dispatch(setSuccess('')),
  _setError: () => dispatch(setError('')),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(memo(AddRequestNewExpense));
