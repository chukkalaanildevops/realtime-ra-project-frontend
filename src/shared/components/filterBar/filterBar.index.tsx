/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Upload, Skeleton, Dropdown, Menu } from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DownOutlined,
  DownloadOutlined,
  FilterOutlined,
  BulbOutlined,
  BulbFilled,
  CloseOutlined,
  AppstoreOutlined,
  TableOutlined,
  ExportOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { BackButton, CSVTable, DotMenu } from '../';
import { IfilterBarProps, viewType } from './filterBar.model';
import './filterBar.index.less';
import { Trans } from '@lingui/macro';
import { ICSVTableProps } from '../csvTable/csvTable.model';

const FilterBar: React.FC<IfilterBarProps> = ({
  isAddButton = true,
  addButtonText = <Trans>Add New</Trans>,
  isAddButtonDisabled = false,
  addButtonOnClickFn = undefined,
  uploadButtonHandler = undefined,
  isLoading = false,
  uploadConfig = {
    accept: '.csv',
  },
  enableBackBtn = false,
  backBtnStyle = {},
  backBtnUrl,
  onBackClick,
  extraData = {
    showDropdown: false,
    downloadHandle: () => {},
    uploadHandle: () => {},
  },
  CSVTableVisibility = false,
  CSVConfig,
  filterShown = false,
  canShare = false,
  tips = [],
  tipsObject = {},
  viewConfig = {
    enableToggleView: false,
    currentView: 'Table',
  },
  filterView,
  canExport = false,
  onExport = _type => {},
  showDownload = false,
  onDownload = () => {},
  isFilterActive = false,
}) => {
  const [isTipsShowing, setTipsShowing] = useState(true);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [tipsArray, setTipsArray] = useState(tips);
  const [currentView, setCurrentView] = useState(viewConfig.currentView);
  useEffect(() => {
    if (uploadButtonHandler) {
      setTipsArray(prev => {
        const data = [...prev, 'Upload the saved and updated csv template'];
        const set = new Set(data);
        const newData = Array.from(set);
        return newData;
      });
    }
  }, [uploadButtonHandler]);

  useEffect(() => {
    if (extraData && extraData.showDropdown) {
      setTipsArray(prev => {
        const data = [
          ...prev,
          'For bulk upload ,download the csv template and fill data accordingly and save it',
          'Upload the saved and updated csv template',
        ];
        const set = new Set(data);
        const newData = Array.from(set);
        return newData;
      });
    }
  }, [extraData]);

  useEffect(() => {
    if (tips && tips.length) {
      setTipsArray(tips);
    }
  }, [tips]);

  useEffect(() => {
    setFilterVisible(isFilterActive);
  }, [isFilterActive]);

  const renderExtraMenu = () => {
    return (
      <Menu>
        <Menu.Item key='1'>
          <Button
            type='link'
            onClick={extraData.downloadHandle}
            className='menu-button'
          >
            <DownloadOutlined style={{ marginRight: 8 }} />
            <Trans>Download</Trans>
          </Button>
        </Menu.Item>
        <Menu.Item key='2' onClick={e => e.domEvent.preventDefault()}>
          <Upload {...uploadConfig} onChange={extraData.uploadHandle}>
            <Button type='link' className='menu-button'>
              <UploadOutlined style={{ marginRight: 8 }} />
              <Trans>Upload</Trans>
            </Button>
          </Upload>
        </Menu.Item>
        {extraData.uploadFromFTP && (
          <Menu.Item key='3' onClick={e => e.domEvent.preventDefault()}>
            <Button
              type='link'
              onClick={extraData.uploadFromFTP}
              className='menu-button'
            >
              <DownloadOutlined style={{ marginRight: 8 }} />
              <Trans>Upload From FTP</Trans>
            </Button>
          </Menu.Item>
        )}
      </Menu>
    );
  };
  const addButtonVisibility = isAddButton;

  const changeView = (view: viewType) => {
    setCurrentView(view);
    viewConfig.onChangeView && viewConfig.onChangeView(view);
  };

  useEffect(() => {
    filterView && filterView(isFilterVisible);
  }, [isFilterVisible, filterView]);
  return (
    <>
      <Row
        className='filter-bar-container'
        justify='end'
        gutter={15}
        align='middle'
      >
        {enableBackBtn && (
          <Col className='back-btn-container'>
            {isLoading ? (
              <Skeleton.Button active={isLoading} />
            ) : (
              <BackButton
                backBtnStyle={backBtnStyle}
                backBtnUrl={backBtnUrl}
                onBackClick={onBackClick}
              />
            )}
          </Col>
        )}
        {viewConfig && viewConfig.enableToggleView && (
          <Row>
            <Col>
              <AppstoreOutlined
                className={
                  currentView === 'Card' ? 'active-icon' : 'filter-icon'
                }
                // style={currentView === 'Card' ? { color: '#1890FF' } : {}}
                onClick={() => changeView('Card')}
              />
            </Col>
            <Col>
              <TableOutlined
                className={
                  currentView === 'Table' ? 'active-icon' : 'filter-icon'
                }
                // style={currentView === 'Table' ? { color: '#1890FF' } : {}}
                onClick={() => changeView('Table')}
              />
            </Col>
          </Row>
        )}
        {tipsArray && tipsArray.length > 0 && (
          <Col>
            <BulbOutlined
              className={isTipsShowing ? 'active-icon' : 'filter-icon'}
              onClick={() => setTipsShowing(prev => !prev)}
            />
          </Col>
        )}
        {/* {canShare && (
          <Col>
            <ShareAltOutlined className='filter-icon' />
          </Col>
        )} */}
        {canExport && (
          <Col>
            <DotMenu
              showInMenu={true}
              actionBtn={[
                {
                  children: 'Excel Report',
                  OnClick: () => onExport('excel'),
                  icon: FileExcelOutlined,
                  Type: 'link',
                },
              ]}
            >
              {/* <ShareAltOutlined className='filter-icon' /> */}
              <Button
                type='primary'
                // ghost
                title='Export Report'
                icon={<ExportOutlined />}
                className='custom-primary-btn'
              >
                <Trans>Export Report</Trans>
              </Button>
            </DotMenu>
          </Col>
        )}
        {extraData && extraData.showDropdown && (
          <Col>
            {isLoading ? (
              <Skeleton.Button active={isLoading} />
            ) : (
              <Dropdown
                overlay={renderExtraMenu}
                getPopupContainer={() =>
                  document.getElementsByClassName(
                    'filter-bar-container',
                  )[0] as HTMLElement
                }
              >
                <a onClick={e => e.preventDefault()}>
                  <Trans>More Actions</Trans> <DownOutlined />
                </a>
              </Dropdown>
            )}
          </Col>
        )}
        {showDownload && (
          <Col>
            <DownloadOutlined className='filter-icon' onClick={onDownload} />
          </Col>
        )}
        {filterShown && (
          <Col>
            <FilterOutlined className='filter-icon' />
          </Col>
        )}
        {filterView && (
          <>
            <Col>
              <FilterOutlined
                className={isFilterVisible ? 'active-icon' : 'filter-icon'}
                onClick={() => {
                  setFilterVisible(prev => !prev);
                }}
              />
            </Col>
          </>
        )}

        {uploadButtonHandler && (
          <Col>
            {isLoading ? (
              <Skeleton.Button active={isLoading} />
            ) : (
              <Upload {...uploadConfig} onChange={uploadButtonHandler}>
                <Button>
                  <>
                    <UploadOutlined /> <Trans>Upload</Trans>
                  </>
                </Button>
              </Upload>
            )}
          </Col>
        )}

        {addButtonVisibility && (
          <Col>
            {isLoading ? (
              <Skeleton.Button active={isLoading} />
            ) : (
              <Button
                type='primary'
                onClick={addButtonOnClickFn}
                disabled={isAddButtonDisabled}
                className='add-new-button'
              >
                <PlusOutlined style={{ fontSize: 12, marginRight: 6 }} />
                {addButtonText}
              </Button>
            )}
          </Col>
        )}

        {CSVTableVisibility ? (
          <CSVTable {...(CSVConfig as ICSVTableProps)} />
        ) : null}
      </Row>

      {isTipsShowing && tipsArray.length > 0 && (
        <Row className='tips-container' align='top'>
          <Col
            span={24}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex' }}>
              <BulbFilled className='bulb-filled' />
              <div>
                <Trans>TIPS</Trans>
              </div>
            </div>
            <CloseOutlined
              style={{ float: 'right' }}
              onClick={() => setTipsShowing(false)}
            />
          </Col>
          <Col className='tips'>
            {tipsArray.map((item, i) => (
              <div>
                {tipsArray.length > 1 && `(${i + 1})`}{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: item as string,
                  }}
                ></span>
              </div>
            ))}
            {tipsObject.hasOwnProperty('start_date') && (
              <div className='tips_container'>
                <div className='tips_detail-container'>
                  <div className='tips_detail'>
                    <Trans>Entitled Amount</Trans>{' '}
                    <span>
                      {tipsObject.amount >= 0
                        ? parseFloat(tipsObject.amount).toFixed(2)
                        : '-'}
                    </span>
                  </div>
                  <div className='tips_detail tip-date'>
                    <Trans>Start Date</Trans>{' '}
                    <span>{tipsObject.start_date || '-'}</span>
                  </div>
                </div>
                <div className='tips_detail-container'>
                  <div className='tips_detail'>
                    <Trans>Minimum Claim Amount</Trans>{' '}
                    <span>
                      {tipsObject.min_claim_amount >= 0
                        ? parseFloat(tipsObject.min_claim_amount).toFixed(2)
                        : '-'}
                    </span>
                  </div>
                  <div className='tips_detail tip-date'>
                    <Trans>End Date</Trans>{' '}
                    <span>{tipsObject.end_date || '-'}</span>
                  </div>
                </div>
                <div className='tips_detail-container'>
                  <div className='tips_detail'>
                    <Trans>Maximum Claim Amount</Trans>{' '}
                    <span>
                      {tipsObject.max_claim_amount >= 0
                        ? parseFloat(tipsObject.max_claim_amount).toFixed(2)
                        : '-'}
                    </span>
                  </div>
                </div>
                <div className='tips_detail-container'>
                  <div className='tips_detail'>
                    <Trans>Remaining Amount</Trans>{' '}
                    <span>
                      {tipsObject.remaining_balance.remaining_benefit_amount >=
                      0
                        ? parseFloat(
                            tipsObject.remaining_balance
                              .remaining_benefit_amount,
                          ).toFixed(2)
                        : '-'}
                    </span>
                  </div>
                </div>
                <div className='tips_detail-container'>
                  <div className='tips_detail'>
                    <Trans>Total Claimed Amount</Trans>{' '}
                    <span>
                      {tipsObject.remaining_balance
                        .total_benefit_claimed_amount >= 0
                        ? parseFloat(
                            tipsObject.remaining_balance
                              .total_benefit_claimed_amount,
                          ).toFixed(2)
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default FilterBar;
