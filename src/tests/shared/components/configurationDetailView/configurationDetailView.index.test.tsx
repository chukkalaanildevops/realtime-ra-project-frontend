import React from 'react';
// import { shallow, ShallowWrapper } from 'enzyme';
// import { findByTestAttr, findByDataTest1 } from '../../../../utils/test.utils';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import ConfigurationDetailView, {
  ReturnCustomFieldStructure,
  ReturnEmptyComponent,
} from '../../../../shared/components/configurationDetailView/configurationDetailView.index';
import * as Models from '../../../../shared/components/configurationDetailView/configurationDetailView.model';
import { Result } from 'antd';
/**
 * This function returns shallow rendered component
 * @function setUp
 * @param {Models.IconfigurationDetailViewProps} props
 * @returns {ShallowWrapper} wrapper
 */
const setUp = (props: Models.IconfigurationDetailViewProps): any => {
  return render(
    <I18nProvider i18n={i18n}>
      <ConfigurationDetailView {...props} />;
    </I18nProvider>,
  );
};

describe('<configurationDetailView />', () => {
  const dummyCustomFieldsData: any = [
    {
      type: 'TEXT',
      title: 'text field',
      is_filled_by_admin: true,
      is_required: true,
      sub_type: 'SHORTTEXT',
    },
    {
      type: 'NUMBER',
      title: 'Number  field with decimal',
      is_filled_by_admin: true,
      is_required: true,
      sub_type: 'NUMBER',
      is_range: false,
      range_min: -1,
      range_max: -1,
      is_decimal_allowed: true,
      precision: -1,
    },
    {
      type: 'NUMBER',
      title: 'Number  field',
      is_filled_by_admin: true,
      is_required: true,
      sub_type: 'NUMBER',
      is_range: true,
      range_min: -1,
      range_max: 100,
      is_decimal_allowed: false,
      precision: -1,
    },
    {
      type: 'DROPDOWN',
      title: 'DropDown fields',
      is_filled_by_admin: true,
      is_required: true,
      sub_type: 'SINGLESELECT',
      reference_object_id: '5',
    },
    {
      type: 'DATETIME',
      title: 'DateTime  field',
      is_filled_by_admin: true,
      is_required: true,
    },
    {
      type: 'DATE',
      title: 'Date  field',
      is_filled_by_admin: true,
      is_required: true,
    },
    {
      type: 'TIME',
      title: 'Time  field',
      is_filled_by_admin: true,
      is_required: true,
      is_range: false,
      range_min: '01:01:00',
      range_max: '11:11:00',
    },
  ];
  const comingSoonComponent = <Result title='Coming Soon...' />;
  const ConfigurationComponent = <div>Configuration Component</div>;
  let wrapper: any = setUp({
    ConfigurationComponent: () => null,
    FormPreviewComponent: () => comingSoonComponent,
    customFieldsData: dummyCustomFieldsData,
  });

  describe('All Props Render ', () => {
    const defaultProps = {
      ConfigurationComponent: () => ConfigurationComponent,
      FormPreviewComponent: () => comingSoonComponent,
      customFieldsData: dummyCustomFieldsData,
    };
    beforeAll(() => {
      setUp(defaultProps);
    });

    // test('render without error', () => {
    //   expect(
    //     screen.getByTestId('configurationDetailPageTabs'),
    //   ).toBeInTheDocument();
    // });

    // test('tab pane count', () => {
    //   expect(
    //     screen.getAllByTestId('configurationDetailPageTabsPane'),
    //   ).toBeInTheDocument();
    // });

    // test('Configuration Tab child test on valids data(component)', () => {
    //   const component = findByDataTest1(wrapper, 'configurationsTab')
    //     .children()
    //     .dive();
    //   expect(component).toEqual(ConfigurationComponent);
    // });
  });

  test('temporary test', () => {});
});
