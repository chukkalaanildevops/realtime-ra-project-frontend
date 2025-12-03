import React from 'react';

import { FC, memo, useState, Dispatch } from 'react';

import { Button, Drawer, Form } from 'antd';
import { ConnectedProps, connect } from 'react-redux';
import {
  getCurrentReadableSectionDataForEntitlement,
  getCurrentSectionDataForEntitlement,
  getDrawerForEntitlement,
  getDrawerTitleForEntitlement,
  getSelectedProcessTypeForEntitlement,
} from '../../../../../../shared/redux/rootReducer';
import {
  saveCustomSectionForEntitlement,
  saveDefaultSectionForEntitlement,
  // setIsDefaultEntitlementTouched,
  setIsDefaultCriteraForEntitlementTouched,
} from '../../../../../../shared/redux/entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.action';
import { isCurrentSectionDataOK } from './utils/isCurrentSectionDataOK';
import EntitlementRuleTabsCustom from './entitlementRuleTabsCustom';
import EntitlementRuleTabsDefault from './entitlementRuleTabsDefault';

const mapStateToProps = (state: any, ownProps: any) => ({
  selectedProcessTypeForEntitlement: getSelectedProcessTypeForEntitlement(
    state,
  ),
  currentSectionData: getCurrentSectionDataForEntitlement(state),
  currentReadableSectionData: getCurrentReadableSectionDataForEntitlement(
    state,
  ),
  drawerTitleForEntitlement: getDrawerTitleForEntitlement(state),
  drawerForEntitlement: getDrawerForEntitlement(state),
  onCloseDrawer: ownProps.onCloseDrawer,
  isDrawerOpen: ownProps.isDrawerOpen,
  benefitTypeConfig: state.addUpdateEntitlementRule,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  saveCustomSectionForEntitlement: () =>
    dispatch(saveCustomSectionForEntitlement()),
  saveDefaultSectionForEntitlement: () =>
    dispatch(saveDefaultSectionForEntitlement()),
  setIsDefaultCriteraForEntitlementTouched: (is_touched: boolean) =>
    dispatch(setIsDefaultCriteraForEntitlementTouched(is_touched)),
});

const EntitlementRuleDrawer: FC<ConnectedProps<typeof connector>> = props => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');
  const { benefitTypeConfig } = props;
  const config = benefitTypeConfig.selectedBenefitTypeConfig;
  const [form] = Form.useForm();
  const onSaveCriteria = async () => {
    try {
      await form.validateFields();
      const { success } = isCurrentSectionDataOK({
        data: props.currentSectionData,
        action: props.drawerForEntitlement,
        selectedProcessTypeForEntitlement:
          props.selectedProcessTypeForEntitlement,
        benefitConfig: config,
      });
      if (success) {
        if (props.drawerForEntitlement === 'CUSTOM') {
          props.saveCustomSectionForEntitlement();
        } else if (props.drawerForEntitlement === 'DEFAULT') {
          props.setIsDefaultCriteraForEntitlementTouched(true);
          props.saveDefaultSectionForEntitlement();
        }
        props.onCloseDrawer();
        setTabActiveKey('1');
      } else {
        // if error, display the PREVIEW tab
        if (props.drawerForEntitlement === 'CUSTOM') {
          setTabActiveKey('4');
        } else if (props.drawerForEntitlement === 'DEFAULT') {
          setTabActiveKey('2');
        }
      }
    } catch (error) {
      console.warn(error);
      return Promise.reject(error);
    }
  };

  const onClickCancelDrawer = () => {
    setTabActiveKey('1');
    props.onCloseDrawer();
  };

  return (
    <Drawer
      title={props.drawerTitleForEntitlement}
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
            Cancel
          </Button>
          <Button onClick={onSaveCriteria} type='primary'>
            Save Criteria
          </Button>
        </div>
      }
    >
      {/* <div>{JSON.stringify(props.currentSectionData, null, 2)}</div>
            <hr />
            <div>{JSON.stringify(props.currentReadableSectionData, null, 2)}</div> */}

      {props.drawerForEntitlement === 'CUSTOM' && (
        <EntitlementRuleTabsCustom
          tabActiveKey={tabActiveKey}
          onSetTabActiveKey={setTabActiveKey}
          form={form}
        />
      )}

      {props.drawerForEntitlement === 'DEFAULT' && (
        <EntitlementRuleTabsDefault
          tabActiveKey={tabActiveKey}
          onSetTabActiveKey={setTabActiveKey}
          form={form}
        />
      )}
    </Drawer>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(EntitlementRuleDrawer));
