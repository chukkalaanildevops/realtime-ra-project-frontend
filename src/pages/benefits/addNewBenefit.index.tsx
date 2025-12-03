import React, { FC, memo, Dispatch, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { stateInterface } from '../../shared/redux/rootReducer';

import { Tabs } from 'antd';
import { HeaderBarWrapper, ErrorBoundary } from '../../shared/components';

import {
  IaddNewExpenseProps,
  // TactiveTabKey,
  // IgetUserEntitledExpenseTypeListprops,
  // Tmode,
  // IgetUserEntitledExpenseTypeListUsingRequestIdprops,
} from './addNewBenefit.model';
import {
  fetchUserJobInfo,
  fetchLoggedInUserInfo,
  fetchUserEntitledBenefitsList,
} from './addNewBenefit.thunk';
import { fetchCountryCurrencyList } from '../setup/component/other/currencyConversion/currencyConversion.thunk';
// import {
//   updateTabKey,
//   apiCallReset,
//   setUpdateId,
//   setViewMode,
//   setFormMode,
//   setRequestData,
//   setIsAdminEdit,
//   updateIsResubmissionCase,
// } from './addNewExpense.actions';
import { resetToInitial } from './store/benefit.action';
import { setConfirmationInfo, resetConfirmationInfo } from '../app/app.actions';
// import { IConfirmationInfo } from '../app/app.model';

import './addNewBenefit.index.less';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
// import { IuserInfo } from '../../shared/model';
import { getQueryString } from '../../utils/scroll.utils';
// import { getQueryParametersAsObject } from '../../utils/global.utils';
// import { appPath } from '../app/app.routes';
import { saveUserData } from '../../shared/redux/auth/auth.actions';
import AddNewBenefitClaimForm from './components/addNewBenefitClaimForm.index';

const mapStateToProps = (state: stateInterface) => {
  const { userInfo, benefitEntitledList } = state.BenefitReducer;
  return { userInfo, benefitEntitledList };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchLoggedInUserInfo: (): any => dispatch(fetchLoggedInUserInfo()),
    _saveUserData: (userData: any) => dispatch(saveUserData(userData)),
    _resetToInitial: () => dispatch(resetToInitial()),
    _fetchUserJobInfo: (userId: number) => dispatch(fetchUserJobInfo(userId)),
    _setConfirmationInfo: (_data: any) => dispatch(setConfirmationInfo(_data)),
    _fetchUserEntitledBenefitsList: (props: any) =>
      dispatch(fetchUserEntitledBenefitsList(props)),
    _fetchCurrencyList: () => dispatch(fetchCountryCurrencyList()),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Tprops = ConnectedProps<typeof connector> & IaddNewExpenseProps;

const AddNewBenefit: FC<Tprops> = props => {
  const {
    ////Data////
    userInfo,
    // benefitEntitledList,
    ///functions///
    _saveUserData,
    _resetToInitial,
    _fetchUserJobInfo,
    _fetchCurrencyList,
    // _resetConfirmationInfo,
    _fetchLoggedInUserInfo,
    _fetchUserEntitledBenefitsList,
  } = props;

  const params: any = useParams();
  const benefitClaimId = params.id;
  const isAdminEdit = getQueryString('mode') === 'admin' ? true : false;
  const mode = params.hasOwnProperty('id') ? 'UPDATE' : 'ADD';
  const { TabPane } = Tabs;
  const [activeTabKey, setActiveTabKey] = useState<string | null>('benefit');
  // const [form] = Form.useForm();

  // const handleConfirmationModelOkBtn = () => {
  //   try {
  //     _resetConfirmationInfo();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleConfirmationModelCancelBtn = () => {
  //   try {
  //     _resetConfirmationInfo();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const apiCalls = async () => {
    try {
      _fetchCurrencyList();
      const _userInfo: any = await _fetchLoggedInUserInfo();
      _userInfo && _saveUserData(_userInfo);
      _userInfo?.id && _fetchUserJobInfo(_userInfo?.id);
    } catch (error) {
      console.error(error);
    }
  };
  const _comonentDidMount_EffectFn = () => {
    try {
      apiCalls();
    } catch (error) {
      console.error(error);
    }
    return _comonentWillUnmount_EffectFn;
  };

  const _comonentWillUnmount_EffectFn = () => {
    try {
      _resetToInitial();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(_comonentDidMount_EffectFn, []);

  const _ExpenseTypeListFetching_EffectFn = () => {
    //On change of user id or tab key calling expense type list fetching api
    userInfo?.id &&
      _fetchUserEntitledBenefitsList({
        userId: userInfo.id,
      });
  };

  useEffect(_ExpenseTypeListFetching_EffectFn, [userInfo]);

  useEffect(() => {
    if (mode === 'ADD') {
      const category = params.category ? params.category : 'benefit';
      setActiveTabKey(category);
    }
  }, [params.category, mode]);

  const getMainComponent = () => (
    <div className='add-new-expense-container'>
      <ErrorBoundary>
        <Tabs
          destroyInactiveTabPane
          activeKey={activeTabKey || ''}
          onChange={(activeKey: string) => setActiveTabKey(activeKey)}
        >
          {mode !== 'ADD' && activeTabKey !== 'benefit' ? null : (
            <TabPane
              tab={<Trans>Benefit</Trans>}
              // disabled={isLoading}
              key='benefit'
            >
              <AddNewBenefitClaimForm
                benefitClaimId={benefitClaimId}
                isAdminEdit={isAdminEdit}
              />
            </TabPane>
          )}
        </Tabs>
      </ErrorBoundary>
    </div>
  );
  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{
          title: benefitClaimId ? (
            <Trans>Update Benefit</Trans>
          ) : (
            <Trans>Add Benefit</Trans>
          ),
        }}
        data-test='headerBarWrapper'
      >
        {mode === 'ADD' ? (
          getMainComponent()
        ) : (
          <div className='add-new-benefit-container without-tabs'>
            <AddNewBenefitClaimForm
              benefitClaimId={benefitClaimId}
              isAdminEdit={isAdminEdit}
            />
          </div>
        )}
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

export default connector(memo(AddNewBenefit));

const GetLabelName: FC<{
  defaultTitle: any;
  configuration: any;
}> = props => {
  const { defaultTitle, configuration } = props;
  try {
    const objValue =
      configuration?.label_mapping[
        defaultTitle.toLowerCase().replace(/ /g, '_')
      ];

    if (objValue) {
      return <span title={defaultTitle}>{objValue?.mapped}</span>;
    }
  } catch (error) {
    console.error(error);
  }
  return <span title={defaultTitle}>{defaultTitle}</span>;
};

export { GetLabelName };
