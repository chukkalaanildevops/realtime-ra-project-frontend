import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import FTPConfig from '../../../../pages/configurations/ftpConfiguration/ftpConfig.index';
import { ISettingsConfigurationState } from '../../../../pages/configurations/configurations.model';
import { initialState as configState } from '../../../../pages/configurations/configurations.reducer';
import { runTimer } from '../../../../utils/test.utils';
import { Empty, Table } from 'antd';
// import {DotMenu} from '../../../../shared/components/';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

const mockStore = configureStore();

const initialState: { configuration: ISettingsConfigurationState } = {
  configuration: { ...configState },
};

const setUp = (props = initialState.configuration) => {
  const state = { ...initialState, configuration: { ...props } };

  return render(
    <I18nProvider i18n={i18n}>
      <Provider store={mockStore(state)}>
        <FTPConfig />
      </Provider>
    </I18nProvider>,
  );
};
describe('<FTPConfig />', () => {
  test('Component renders correctly', () => {
    const wrapper = setUp();
    expect(wrapper.asFragment()).toBeTruthy();
  });

  // it('Open FTP configuration drawer on click add new icon ', () => {
  // const wrapper = setUp();
  // expect(wrapper.asFragment()).toMatchSnapshot();
  // const addFun: Function = wrapper.getByTestId('filter-bar').prop(
  //   'addButtonOnClickFn',
  // );
  // addFun();
  // runTimer(() => {
  //   const prop = wrapper.getByTestId('ftp-config-drawer').prop('visible');
  //   expect(prop).toBe(true);
  // }, 100);
  // });

  // it('Render empty component if there are no ftp records', () => {
  //   const wrapper = setUp();
  //   expect(wrapper.find(Empty)).toHaveLength(1);
  // });

  // it('Render Table component if there are no ftp records', () => {
  //   const wrapper = setUp({ ftpRecords: [{}, {}] });
  //   expect(wrapper.find(Table)).toHaveLength(1);
  // });

  // it('Render Table rows ', () => {
  //   const wrapper = setUp({ ftpRecords: [{}, {}] });
  //   expect(wrapper.find(Table).prop('dataSource')?.length).toEqual(2);
  // });
});
