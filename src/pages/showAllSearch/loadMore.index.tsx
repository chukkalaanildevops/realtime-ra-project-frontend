import { Button } from 'antd';
import React, { Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IloadMoreProps } from '../../shared/components/searchBar/searchBar.model';
import { fetchUsersFromSearchBar } from '../../shared/components/searchBar/searchBar.thunk';
import { stateInterface } from '../../shared/redux/rootReducer';

const LoadMore: React.FC<IloadMoreProps & ConnectedProps<typeof connector>> = ({
  data,
  isLoading,
  _fetchUsersFromSearchBar,
  searchValue,
  type,
  nextPage,
}) => {
  return (
    <Button
      type='link'
      disabled={nextPage === null || data?.data?.length === 0}
      onClick={e => {
        e.preventDefault();
        _fetchUsersFromSearchBar(searchValue || '', type || '', nextPage);
      }}
    >
      Load More
    </Button>
  );
};

const mapStateToProps = (state: stateInterface) => ({
  data: state.searchBar.data,
  isLoading: state.searchBar.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchUsersFromSearchBar: (
    val: string,
    type: string,
    pageNumber: number = 1,
  ) => dispatch(fetchUsersFromSearchBar(val, type, pageNumber)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(LoadMore);
// export default LoadMore;
