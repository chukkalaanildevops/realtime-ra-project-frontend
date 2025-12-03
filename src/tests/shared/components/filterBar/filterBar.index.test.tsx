import React from 'react';
// import { configure, shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import FilterBar from '../../../../shared/components/filterBar/filterBar.index';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

describe('<FilterBar />', () => {
  const singleBtnWrapper = render(
    <I18nProvider i18n={i18n}>
      <FilterBar isAddButton={true} isAddButtonDisabled={false} />,
    </I18nProvider>,
  );
  it('Renders without error', () => {
    expect(singleBtnWrapper).toBeTruthy();
  });

  // it('Single button disabled snapshot test', () => {
  //   singleBtnWrapper.setProps({ isAddButtonDisabled: true });
  //   expect(singleBtnWrapper.find('[disabled]')).toHaveLength(1);
  // });

  // it('Single button test', () => {
  //   expect(singleBtnWrapper.find('.filter-bar-container')).toHaveLength(1);
  // });
});
