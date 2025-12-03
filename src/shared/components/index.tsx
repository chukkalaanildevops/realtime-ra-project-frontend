import React, { ReactNode, FC } from 'react';

import { AppDrawer } from './appDrawer/appDrawer.index';
import CustomFields from './customFields/customFields.index';
import DotMenu from './dotMenu/dotMenu.index';
import EditableTable from './editableTable/editableTable.index';
import FilterBar from './filterBar/filterBar.index';
import FormPreview from './formPreview/formPreview.index';
import HeaderBar from './headerBar/headerBar.index';
import HeaderBarWrapper from './headerBarWrapper/headerBarWrapper.index';
import LabelMapping from './labelMapping/labelMapping.index';
import MenuDrawer from './menuDrawer/menuDrawer.index';
import NotFound from './notFound/notFound.index';
import Unauthorized from './unauthorized403/unauthorized.index';
import RichTextEditor from './richTextEditor/richTextEditor.index';
import SearchBar from './searchBar/searchBar.index';
import ProtectedRoute from './protectedRoute/protectedRoute.index';
import ConfigurationDetailView from './configurationDetailView/configurationDetailView.index';
import SkeletonItem from './skeleton/skeleton.index';
import BooleanItem from './booleanItem/booleanItem.index';
import OptionalItem from './optionalItem/optionalItem.index';
import BackButton from './backButton/backButton.index';
import CSVTable from './csvTable/csvTable.index';
import EntityCard from './entityCard/entityCard.index';
import BreadcrumbBar from './breadcrumbBar/breadcrumbBar.index';
import ConfirmationModal from './confirmationModal/confirmationModal.index';
import ReceiptSelector from './receiptSelector/receiptSelector.index';
import NoInternetConnection from './noInternetConnection/noInternetConnection.index';
import CustomFieldsForm from './customFieldsForm/customFieldsForm.index';
import ReceiptAndSupportDocumentUploader from './receiptAndSupportDocumentUploader/receiptAndSupportDocumentUploader.index';
import CustomPlacesAutocomplete from './customPlacesAutocomplete/index';
import ErrorBoundary from './errorBoundary/errorBoundary.index';
import WorkflowDetails from './workflowDetails/workflowDetails.index';
import Remark from './remark/remark.index';
import Remarks from './remarks/remarks.index';
import Loader from './loader/loader.index';
import PDFViewer from './pdfViewer/pdfViewer.index';
import DocumentsViewer from './documentsViewer/documentsViewer.index';
import ReceiptViewer from './receiptViewer/receiptViewer.index';
import ApprovalResponseCommentModal from './approvalResponseCommentModal/approvalResponseCommentModal.index';
import BrokenLink from './brokenLink/brokenLink.index';
import DataFilter from './transactionDataFilter/transactionDataFilter.index';
import CustomisedDropdown from './customisedDropdown/customisedDropdown.index';
import ElementOrSkeleton from './elementOrSkeleton/elementOrSkeleton.index';
import {
  SearchableUserDropdown,
  SearchableMultiUserDropdown,
} from './searchableUserDropdown/searchableUserDropdown.index';
import DownloadButton from './downloadButton/downloadButton.index';

import AdminFieldIcon from './adminFieldIcon/adminFieldIcon';
import Card from './card/card.index';
import { Statistic, Empty, Button, Col, Spin } from 'antd';
import { ColProps } from 'antd/lib/grid/col';
import { EmptyProps } from 'antd/lib/empty/';
import CronBuilder from './cronbuilder/cronbuilder.index';
import SearchableDropdown from './searchableDropdown/searchableDropdown.index';
import AppendToDOM from './appendToDOM/appendToDOM.index';

import { IWorkflowStatus } from '../../shared/model';

import noDataImage from '../../assets/images/default/nodata.png';
import ReimburseLogo from '../../assets/images/branding/logo.png';
import { ButtonProps } from 'antd/lib/button';
import ViolationDetails from './violationDetails/violationDetails.index';

/**
 * Dummy component for customizing tab name.(Figma tab name design).
 * <Tabs.TabPane tab={<CustomizeTabName title='Configuration' icon='.' count={15}/>} ...>
 */
const CustomizeTabName: FC<{
  title: string | React.ReactNode;
  icon?: ReactNode | string;
  count?: ReactNode | number;
  bold?: boolean;
}> = props => {
  const { title, icon = '', count, bold = false } = props;
  // const innerContent = `${title} ${icon} ${count ? count : ''}`;
  return (
    <div className={`customized-tab-name`}>
      {/* {bold ? <strong>{innerContent}</strong> : innerContent} */}

      {bold ? (
        <strong>
          <span>{title}</span>
          <span>{icon}</span>
          <span>{count}</span>
        </strong>
      ) : (
        <div>
          <span>{title}</span>
          <span>{icon}</span>
          <span>{count}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Dummy component for customizing Currency.(Figma Currency design).
 * <Currency currencytype='SGD' amount={2249} suffix={29} />
 */

const Currency: FC<{
  currencytype?: string;
  amount: number | string;
  suffix?: string | number;
  bold?: boolean;
  classForCustomization?: string;
}> = props => {
  const {
    currencytype = '',
    amount,
    suffix,
    bold = true,
    classForCustomization = '',
  } = props;

  const innerContent = (
    <Statistic
      title=''
      prefix={<span className='currency-prefix'>{currencytype}</span>}
      // value={amount}
      value={Intl.NumberFormat(
        Intl.DateTimeFormat().resolvedOptions().locale,
      ).format(Number(amount))}
      suffix={
        suffix ? (
          <span className='currency-suffix'>{`.${String(suffix)}`}</span>
        ) : (
          ''
        )
      }
      formatter={(value: string | number) => (
        <span className='currency-value'>{value}</span>
      )}
    />
  );

  return (
    <div className={`customize-currency ${classForCustomization}`}>
      {bold ? <strong>{innerContent}</strong> : innerContent}
    </div>
  );
};

/**
 * Use this component instead of Ant Design Empty component
 * Accept all empty props - For customization.
 * @param props {EmptyProps}
 */
const NoData = (props: EmptyProps) => (
  <div className='no-data-container'>
    <Empty
      {...props}
      image={noDataImage}
      imageStyle={{ width: 72, height: 72 }}
      style={{
        height: 120,
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
      }}
    />
  </div>
);

const StatusTag = (props: {
  status: IWorkflowStatus;
  onStatusClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  btnProps?: ButtonProps;
}) => {
  return (
    <Button
      onClick={props?.onStatusClick}
      type='link'
      className={`status-btn ${
        Boolean(props.onStatusClick)
          ? 'all-pointer-events'
          : 'no-pointer-events'
      }`}
      disabled={props?.status?.code === 'DRAFTD'}
      {...(props.btnProps || {})}
    >
      <span className={`status ${props?.status?.code || ''}`}>
        {props?.status?.title || ''}
      </span>
    </Button>
  );
};

/* Customised component to display amount along with currency as per design in Figma. This is to be used in future designs instead of Currency. */

const Amount = (props: {
  amount: number;
  currency?: string | undefined;
  noStyle?: boolean;
  align?: 'left' | 'center' | 'right';
}) => {
  let align = props.align || 'left';
  let wholeNumber = '0';
  let precision = '00';

  if (props.amount !== null) {
    [wholeNumber, precision] = String(props.amount).split('.');
  }

  if (precision === undefined) {
    precision = '00';
  } else if (precision.length === 1) {
    precision = precision + '0';
  }

  if (precision.length > 2) {
    precision = precision.slice(0, 2);
  }

  if (props.noStyle !== undefined && props.noStyle === true) {
    return (
      <div className={`unstyled-amount-component ${align}`}>
        <span className='currency-code'>
          {props.currency === undefined ? '--' : props.currency}
        </span>
        {/* <span className='whole-number'>{wholeNumber}</span> */}
        <span className='whole-number'>
          {Intl.NumberFormat(
            Intl.DateTimeFormat().resolvedOptions().locale,
          ).format(Number(wholeNumber))}
        </span>
        <span className='separator'>.</span>
        <span className='precision'>{precision}</span>
      </div>
    );
  }

  return (
    <div className={`customised-amount-component ${align}`}>
      {props.currency === undefined ? (
        <></>
      ) : (
        <span className='currency-code'>{props.currency}</span>
      )}
      {/* <span className='whole-number'>{wholeNumber}</span> */}
      <span className='whole-number'>
        {Intl.NumberFormat(
          Intl.DateTimeFormat().resolvedOptions().locale,
        ).format(Number(wholeNumber))}
      </span>
      <span className='separator'>.</span>
      <span className='precision'>{precision}</span>
    </div>
  );
};

const DetailsDrawerSingleInfo: FC<{
  label: ReactNode;
  content: ReactNode;
  colProps?: ColProps;
}> = props => {
  const { label, content, colProps = null } = props;
  const component = (
    <>
      <span
        className='drawer-single-info-label'
        data-test='drawer-single-info-label'
      >
        {label}
      </span>
      <span
        className='drawer-single-info-content'
        data-test='drawer-single-info-content'
      >
        {content}
      </span>
    </>
  );

  return colProps ? (
    <Col span={12} {...colProps}>
      {component}
    </Col>
  ) : (
    component
  );
};

const ReimburseGlobalLoader: FC<{
  includeLogo?: boolean;
  loader?: React.Component;
  isDarkBg?: boolean;
}> = ({ includeLogo = true, loader = <Spin />, isDarkBg = true }) => {
  return (
    <div className={`reimburse-loader ${isDarkBg ? 'dark' : 'light'}`}>
      {includeLogo ? <img src={ReimburseLogo} alt='Reimburse' /> : null}
      {loader}
    </div>
  );
};

export {
  AppDrawer,
  CustomFields,
  DotMenu,
  EditableTable,
  FilterBar,
  FormPreview,
  HeaderBar,
  HeaderBarWrapper,
  LabelMapping,
  MenuDrawer,
  NotFound,
  RichTextEditor,
  SearchBar,
  ProtectedRoute,
  ConfigurationDetailView,
  CustomPlacesAutocomplete,
  SkeletonItem,
  BooleanItem,
  OptionalItem,
  BackButton,
  CSVTable,
  EntityCard,
  BreadcrumbBar,
  ConfirmationModal,
  ReceiptSelector,
  CustomFieldsForm,
  CustomizeTabName,
  Currency,
  NoInternetConnection,
  // SearchLocationInput,
  ReceiptAndSupportDocumentUploader,
  ErrorBoundary,
  NoData,
  Card,
  WorkflowDetails,
  StatusTag,
  Remark,
  Remarks,
  PDFViewer,
  Amount,
  Loader,
  Unauthorized,
  DocumentsViewer,
  ReceiptViewer,
  ApprovalResponseCommentModal,
  BrokenLink,
  DataFilter,
  CustomisedDropdown,
  ElementOrSkeleton,
  SearchableUserDropdown,
  SearchableMultiUserDropdown,
  AdminFieldIcon,
  DetailsDrawerSingleInfo,
  CronBuilder,
  DownloadButton,
  SearchableDropdown,
  AppendToDOM,
  ReimburseGlobalLoader,
  ViolationDetails,
};
