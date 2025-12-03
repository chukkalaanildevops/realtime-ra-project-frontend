import React, { Dispatch } from 'react';
import { Button } from 'antd';
import { tabs } from '../../reports.model';
import { fetchReportTabData } from '../../reports.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { moreReportsLoading } from '../../../../shared/redux/rootReducer';

const LoadMore: React.FC<{
  source: any;
  item: tabs;
  nextPage: number;
  filters: any;
} & ConnectedProps<typeof connector>> = ({
  _fetchRecords,
  source,
  item,
  nextPage,
  filters,
  isLoading,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
      <Button
        type='link'
        onClick={() => _fetchRecords(item, source, nextPage, filters)}
        loading={isLoading}
      >
        {isLoading ? 'Loading' : 'Load More'}
      </Button>
    </div>
  );
};

const mapStateToDispatch = (dispatch: Dispatch<any>) => ({
  _fetchRecords: (type: tabs, source: any, page: number, filters: any) =>
    dispatch(fetchReportTabData(type, source, page, filters)),
});

const mapStateToProp = (state: any) => ({
  isLoading: moreReportsLoading(state),
});
const connector = connect(mapStateToProp, mapStateToDispatch);

export default connector(LoadMore);
