/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import { Table, Input, Button } from 'antd';
import {
  HeaderBarWrapper,
  FilterBar,
  ErrorBoundary,
} from '../../shared/components';
import './systemLabelsCustomisation.index.less';
import {
  fetchSystemLabelsCustomisation,
  updateSystemLabelsCustomisation,
} from './systemLabelsCustomisation.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { getSystemLabelsCustomisation } from '../../shared/redux/rootReducer';
import { appPath } from '../app/app.routes';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: any) => ({
  systemLabelsCustomisation: getSystemLabelsCustomisation(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  fetchSystemLabelsCustomisation: () =>
    dispatch(fetchSystemLabelsCustomisation()),
  updateSystemLabelsCustomisation: (data: any) =>
    dispatch(updateSystemLabelsCustomisation(data)),
});

const SystemLabelsCustomisation: React.FC<ConnectedProps<
  typeof connector
>> = props => {
  const updateFileName = (value: string, item: any) => {
    setEnableUpdateButton(value !== '');
    setDataSource(
      dataSource.map((dataSourceItem: any) => {
        if (item.code === dataSourceItem.code) {
          dataSourceItem.updatedLabelName = value;
        }
        return dataSourceItem;
      }),
    );
  };

  const columns = [
    {
      dataIndex: 'labelName',
      title: () => <Trans>Label Name</Trans>,
    },
    {
      dataIndex: 'updatedLabelName',
      title: () => <Trans>Updated Label Name</Trans>,
      render: (val: string, item: any) => {
        return (
          <Input
            value={val}
            onChange={e => updateFileName(e.target.value, item)}
            onKeyDown={e => {
              if (e.key === 'Enter' && enableUpdateButton) {
                onUpdate();
              }
            }}
          />
        );
      },
    },
  ];

  const KEY_MAP: any = {
    CCHEAD1: 'cost_centre_head_1',
    CCHEAD2: 'cost_centre_head_2',
    CCHEAD3: 'cost_centre_head_3',
    APPR1: 'approver_1',
    APPR2: 'approver_2',
    APPR3: 'approver_3',
    APPR4: 'approver_4',
    APPR5: 'approver_5',
  };

  let [dataSource, setDataSource] = useState<any>([
    {
      key: 1,
      labelName: 'Cost Centre Head 1',
      updatedLabelName: '',
      code: 'CCHEAD1',
    },
    {
      key: 2,
      labelName: 'Cost Centre Head 2',
      updatedLabelName: '',
      code: 'CCHEAD2',
    },
    {
      key: 3,
      labelName: 'Cost Centre Head 3',
      updatedLabelName: '',
      code: 'CCHEAD3',
    },
    {
      key: 4,
      labelName: 'Approver 1',
      updatedLabelName: '',
      code: 'APPR1',
    },
    {
      key: 5,
      labelName: 'Approver 2',
      updatedLabelName: '',
      code: 'APPR2',
    },
    {
      key: 6,
      labelName: 'Approver 3',
      updatedLabelName: '',
      code: 'APPR3',
    },
    {
      key: 7,
      labelName: 'Approver 4',
      updatedLabelName: '',
      code: 'APPR4',
    },
    {
      key: 8,
      labelName: 'Approver 5',
      updatedLabelName: '',
      code: 'APPR5',
    },
  ]);

  let [enableUpdateButton, setEnableUpdateButton] = useState<boolean>(true);

  const onUpdate = () => {
    const formData: any = {
      cost_centre_head_1: '',
      cost_centre_head_2: '',
      cost_centre_head_3: '',
      approver_1: '',
      approver_2: '',
      approver_3: '',
      approver_4: '',
      approver_5: '',
    };
    dataSource.forEach((item: any) => {
      const formDataKey = KEY_MAP[item.code];
      formData[formDataKey] = item.updatedLabelName;
    });
    props.updateSystemLabelsCustomisation(formData);
  };

  useEffect(() => {
    async function fetchWrapper() {
      const customisation: any = await props.fetchSystemLabelsCustomisation();
      setDataSource(
        dataSource.map((item: any) => {
          const dataKey = KEY_MAP[item.code];
          item.updatedLabelName = customisation ? customisation[dataKey] : '';
          return item;
        }),
      );
    }
    fetchWrapper();
  }, []);

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{
          title: <Trans>System Labels Customisation</Trans>,
        }}
      >
        <div className='container'>
          <FilterBar
            isLoading={false}
            isAddButton={false}
            enableBackBtn={true}
            backBtnUrl={appPath.settings.systemLabelsCustomisation.backLink}
            data-test='filterBar'
          />
          <Table columns={columns} dataSource={dataSource} pagination={false} />
          <br />
          <Button
            type='primary'
            onClick={onUpdate}
            disabled={!enableUpdateButton}
          >
            <Trans>Update</Trans>
          </Button>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(SystemLabelsCustomisation);
