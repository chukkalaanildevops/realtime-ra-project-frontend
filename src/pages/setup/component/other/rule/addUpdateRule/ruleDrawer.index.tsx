import { FC, memo, useState, Dispatch } from 'react';
import React from 'react';

import RuleTabsCustom from './ruleTabsCustom.index';
import RuleTabsDefault from './ruleTabsDefault.index';

import { isCurrentSectionDataOK } from './utils/isCurrentSectionDataOK';

import { Button, Drawer } from 'antd';
import { ConnectedProps, connect } from 'react-redux';

import {
  saveCustomSection,
  saveDefaultSection,
} from '../../../../../../shared/redux/rule/addUpdateRule/addUpdateRule.action';

import {
  getCurrentSectionData,
  getCurrentReadableSectionData,
  getDrawerFor,
  getDrawerTitle,
  getSelectedProcessType,
} from '../../../../../../shared/redux/rootReducer';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: any, ownProps: any) => ({
  selectedProcessType: getSelectedProcessType(state),
  currentSectionData: getCurrentSectionData(state),
  currentReadableSectionData: getCurrentReadableSectionData(state),
  drawerTitle: getDrawerTitle(state),
  drawerFor: getDrawerFor(state),
  onCloseDrawer: ownProps.onCloseDrawer,
  isDrawerOpen: ownProps.isDrawerOpen,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  saveCustomSection: () => dispatch(saveCustomSection()),
  saveDefaultSection: () => dispatch(saveDefaultSection()),
});

const RuleDrawer: FC<ConnectedProps<typeof connector>> = props => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');

  const onSaveCriteria = () => {
    const { success } = isCurrentSectionDataOK({
      data: props.currentSectionData,
      action: props.drawerFor,
    });

    if (success) {
      if (props.drawerFor === 'CUSTOM') {
        props.saveCustomSection();
      } else if (props.drawerFor === 'DEFAULT') {
        props.saveDefaultSection();
      }
      props.onCloseDrawer();
      setTabActiveKey('1');
    } else {
      // if error, display the PREVIEW tab
      if (props.drawerFor === 'CUSTOM') {
        setTabActiveKey('4');
      } else if (props.drawerFor === 'DEFAULT') {
        setTabActiveKey('2');
      }
    }
  };

  const onClickCancelDrawer = () => {
    setTabActiveKey('1');
    props.onCloseDrawer();
  };

  return (
    <Drawer
      title={props.drawerTitle}
      placement='right'
      closable={false}
      maskClosable={false}
      destroyOnClose={true}
      forceRender={true}
      onClose={props.onCloseDrawer}
      width={1000}
      visible={props.isDrawerOpen}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onClickCancelDrawer} style={{ marginRight: 8 }}>
            <Trans>Cancel</Trans>
          </Button>
          <Button onClick={onSaveCriteria} type='primary'>
            <Trans>Save Criteria</Trans>
          </Button>
        </div>
      }
    >
      {/* <div>{JSON.stringify(props.currentSectionData, null, 2)}</div>
      <hr />
      <div>{JSON.stringify(props.currentReadableSectionData, null, 2)}</div> */}

      {props.drawerFor === 'CUSTOM' && (
        <RuleTabsCustom
          tabActiveKey={tabActiveKey}
          onSetTabActiveKey={setTabActiveKey}
        />
      )}

      {props.drawerFor === 'DEFAULT' && (
        <RuleTabsDefault
          tabActiveKey={tabActiveKey}
          onSetTabActiveKey={setTabActiveKey}
        />
      )}
    </Drawer>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(RuleDrawer));
