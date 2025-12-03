import React, { FC, memo } from 'react';
import { Layout } from 'antd';
import HeaderCommon from '../headerBar/headerBar.index';
import LocalizationDropDown from '../localizationDropDown/localizationDropDown.index';
import './headerBarWrapper.index.less';

import { IMainInnerContainerProps } from './headerBarWrapper.model';
import { BreadcrumbBar } from '..';

const MainInnerContainer: FC<IMainInnerContainerProps> = props => {
  const {
    containerStyle = {},
    hideHeaderCommon = false,
    showOnlyLocal = false,
    headerCommonProps,
    breadcrumbCompProps = {
      breadcrumProps: {},
      enableBackBtn: false,
      backBtnStyle: {},
      backBtnUrl: '',
      isLoading: false,
      separator: '',
    },
    counterProps = {
      enableCounter: false,
      counterValue: '',
    },
    breadcrumbCompVisibility = false,
  } = props;
  return (
    <Layout.Content className='layout-content'>
      {!hideHeaderCommon && <HeaderCommon {...headerCommonProps} />}
      {showOnlyLocal && (
        <div className='page-header local-header'>
          <LocalizationDropDown />
        </div>
      )}
      <div
        id='page-container'
        className={`page-container ${
          breadcrumbCompVisibility ? `with-breadcrumb` : ``
        }`}
        style={{ ...containerStyle }}
      >
        {breadcrumbCompVisibility && (
          <BreadcrumbBar {...counterProps} {...breadcrumbCompProps} />
        )}
        {props.children}
      </div>
    </Layout.Content>
  );
};

export default memo(MainInnerContainer);
