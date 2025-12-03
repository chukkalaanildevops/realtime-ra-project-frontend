import React, { Dispatch, useEffect, memo, useState } from 'react';
import { Col, Row } from 'antd';
import { ErrorBoundary, Loader } from '../../../../shared/components';
import ChartLayout from '../chartLayout/chartLayout.index';
import { stateInterface } from '../../../../shared/redux/rootReducer';
import { getLayoutList } from '../../dashboards.thunk';
import { connect } from 'react-redux';
import DropdownContainer from '../dropdownContainer/dropdownContainer.index';
import { Trans } from '@lingui/macro';

const DashboardsContainer: React.FC<{
  item: any;
  dashboardListLoader: any;
  layoutDataList: any;
  layoutDataListLoader: any;
  _getLayoutList: any;
}> = props => {
  const { item, layoutDataList, layoutDataListLoader, _getLayoutList } = props;
  const { id } = item;
  const [viewAsRole, setViewAsRole] = useState<{
    title: string;
    code: string;
  }>({
    title: item.view_as_roles[0].title,
    code: item.view_as_roles[0].code,
  });

  useEffect(() => {
    id && _getLayoutList(id);
  }, [_getLayoutList, id]);

  const dashboardRows =
    item.title === layoutDataList.title ? layoutDataList.charts : [];

  const selectedOptionHandler = (selectedRole: {
    title: string;
    code: string;
  }) => {
    setViewAsRole({ ...selectedRole });
  };
  return !layoutDataListLoader ? (
    <ErrorBoundary>
      <div>
        {item.view_as_roles.length > 0 && (
          <DropdownContainer
            dropdownList={item.view_as_roles}
            title={<Trans>You are viewing as</Trans>}
            setSelectedOption={selectedOptionHandler}
            selectedValue={viewAsRole.title}
          />
        )}
        <div className='content-container'>
          {layoutDataListLoader &&
          item.view_as_roles.find(
            (role: any) => role.code === viewAsRole.code,
          ) ? (
            <Loader loadingName='Loading' loaderClass='loader' />
          ) : (
            <ErrorBoundary>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className='title-content-container' span={24}>
                  {layoutDataList.title}
                </Col>
                <Col className='data-container' span={24}>
                  {dashboardRows.length > 0 && (
                    <ChartLayout
                      rows={dashboardRows}
                      viewAsRole={viewAsRole.code}
                    />
                  )}
                </Col>
              </Row>
            </ErrorBoundary>
          )}
        </div>
      </div>
    </ErrorBoundary>
  ) : (
    <Loader loaderClass='loader' />
  );
};

const mapStateToProps = (state: stateInterface) => {
  const {
    dashboardListLoader,
    layoutDataList,
    layoutDataListLoader,
  } = state.DashboardsReducer;
  return {
    dashboardListLoader,
    layoutDataList,
    layoutDataListLoader,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _getLayoutList: (id: string) => dispatch(getLayoutList(id)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(DashboardsContainer));
