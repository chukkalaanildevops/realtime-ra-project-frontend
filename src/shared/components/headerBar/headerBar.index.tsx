import React, { useEffect } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Badge } from 'antd';

import SearchBar from '../searchBar/searchBar.index';

import { IheaderProps } from './headerBar.model';

import './headerBar.index.less';
import LocalizationDropDown from '../localizationDropDown/localizationDropDown.index';
import { setDocumentTitle } from '../../../utils/global.utils';

const HeaderCommon: React.FC<IheaderProps> = ({
  title,
  serachBarComp = true,
  notificationComp = false,
  handleSearchChange,
}) => {
  const serarchBarVisibility: boolean = serachBarComp;
  const notificationCompVisibility: boolean = notificationComp;

  useEffect(() => {
    const docTitle =
      typeof title === 'string'
        ? title
        : (title as React.ReactElement)?.props?.id ||
          (title as React.ReactElement)?.props?.children;

    setDocumentTitle(docTitle);
  }, [title]);

  return (
    <div className='page-header' data-testId='header-component'>
      <h1 className='title' data-testId='h1-title'>
        {title}
      </h1>
      {serarchBarVisibility && (
        <div className='search-container' data-testId='search-container'>
          <SearchBar onSearchChange={handleSearchChange} />
        </div>
      )}
      <LocalizationDropDown />
      {notificationCompVisibility && (
        <div className='badge-container' data-testId='badge-container'>
          <Badge color='#f5222d' dot title='Notification' offset={[-8.35, -1]}>
            <BellOutlined />
          </Badge>
        </div>
      )}
    </div>
  );
};

export default HeaderCommon;
