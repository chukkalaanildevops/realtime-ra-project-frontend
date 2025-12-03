import React, { useEffect, useState } from 'react';
import { Language, LOCALIZATION } from '../../../utils/types.utils';
import { Select } from 'antd';
import { setLocalization } from '../../../pages/dashboard/dashboard.actions';
import { connect, ConnectedProps } from 'react-redux';
import { getLocalization, getUser } from '../../redux/rootReducer';
import { setLanguageForUser } from '../../redux/auth/auth.thunk';

const LocalizationDropDown: React.FC<ConnectedProps<typeof connector>> = ({
  user,
  locale,
  tenantConfig,
  setLanguageForUser,
}) => {
  const [allowedLang, setAllowedLang] = useState([]);
  useEffect(() => {
    const filterLang = tenantConfig[0]?.allowed_languages?.map((lang: any) => {
      const selectedLang = LOCALIZATION.find(
        (value: any) => value.code === lang,
      );

      return selectedLang;
    });
    setAllowedLang(filterLang);
  }, [tenantConfig]);
  const onMenuClick = (ln: Language) => {
    // setLocalization(ln);
    user && setLanguageForUser(ln, user.id);
  };
  const dropdownItems = allowedLang?.map((lang: any) => {
    return (
      <Select.Option value={lang.code} key={lang.code}>
        {lang?.title}
      </Select.Option>
    );
  });

  return (
    <div style={{ marginLeft: 12, marginRight: 12, width: '100px' }}>
      <Select style={{ width: '100%' }} value={locale} onSelect={onMenuClick}>
        {dropdownItems}
      </Select>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  const { tenantConfig } = state.configuration;

  return {
    tenantConfig,
    locale: getLocalization(state),
    user: getUser(state),
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    setLocalization: (ln: Language) => dispatch(setLocalization(ln)),
    setLanguageForUser: (lang: any, id: any) =>
      dispatch(setLanguageForUser(lang, id)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(LocalizationDropDown);
