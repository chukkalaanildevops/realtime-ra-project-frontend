import React, { SFC, memo, CSSProperties } from 'react';
import { Breadcrumb, Row, Col, Skeleton, Tag } from 'antd';
import { BreadcrumbProps } from 'antd/lib/breadcrumb/Breadcrumb';
import { BackButton } from '..';

const BreadcrumbBar: SFC<{
  breadcrumProps?: BreadcrumbProps;
  enableBackBtn?: boolean;
  backBtnStyle?: CSSProperties;
  backBtnUrl?: string;
  isLoading?: boolean;
  onBackClick?: Function;
  separator?: string;
  enableCounter?: boolean;
  counterValue?: string;
}> = props => {
  const {
    breadcrumProps = {},
    enableBackBtn = false,
    backBtnStyle = {},
    backBtnUrl = '',
    isLoading = false,
    onBackClick,
    separator = <span>&bull;</span>,
    enableCounter = false,
    counterValue = '',
  } = props;

  return (
    <Row>
      <Col span={24}>
        {enableBackBtn && (
          <span className='back-btn-container'>
            {isLoading ? (
              <Skeleton.Button active={isLoading} />
            ) : (
              <BackButton
                backBtnStyle={backBtnStyle}
                backBtnUrl={backBtnUrl}
                onBackClick={onBackClick}
              />
            )}
          </span>
        )}
        <Breadcrumb
          // separator={<span>&bull;</span>}
          separator={separator}
          {...breadcrumProps}
          className={`breadcrum-container ${breadcrumProps.className}`}
        ></Breadcrumb>
        {enableCounter && (
          <span>
            {' '}
            <Tag color='blue'>{counterValue}</Tag>
          </span>
        )}
      </Col>
    </Row>
  );
};

export default memo(BreadcrumbBar);

/*
Copy this and use this component
<BreadcrumbBar
breadcrumProps={{
    routes: [
    {
        path: '',
        breadcrumbName: 'home',
    },
    ],
}}
enableBackBtn={true}
backBtnUrl={appPath.admin.expenseType.legalEntityListing.backLink}
isLoading={loadingExpenseTypeEntityList}
/> */
