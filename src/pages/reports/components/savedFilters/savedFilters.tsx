/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button, Tag, Input, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';

const SavedFilters: React.FC<{
  savedFilters: any[];
  setFilterVisible: (isVisible: boolean) => void;
  showNameModal: boolean;
  _onEditFilter: (filter: any) => void;
  _onCreateUpdateFilter: (title?: string) => void;
  _removeFilter: (id: number) => void;
}> = ({
  savedFilters,
  setFilterVisible,
  showNameModal,
  _onEditFilter,
  _onCreateUpdateFilter,
  _removeFilter,
}) => {
  const [isSavedFilterShowing, showSavedFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [popupVisible, setPopupVisible] = useState(Boolean);
  const [filterTitle, setFilterTitle] = useState('');

  useEffect(() => {
    if (typeof showNameModal === 'boolean') {
      if (!selectedFilter) {
        setPopupVisible(true);
        setFilterTitle('');
      } else {
        const isExist = savedFilters.find(
          item => item.title.trim() === selectedFilter.trim(),
        );
        if (isExist) {
          _onCreateUpdateFilter();
        } else {
          setPopupVisible(true);
          setFilterTitle('');
        }
      }
    }
  }, [showNameModal]);

  useEffect(() => {
    if (savedFilters.length === 0) {
      showSavedFilters(false);
    }
  }, [savedFilters]);

  const handleClose = (e: any, item: any) => {
    e.preventDefault();
    _removeFilter(item.id);
  };

  const saveFilter = () => {
    if (filterTitle.trim().length !== 0) {
      const isExist = savedFilters.find(
        item => item.title.trim() === filterTitle.trim(),
      );

      if (isExist) {
        return message.error('Filter name already exist');
      }
      _onCreateUpdateFilter(filterTitle);
      setFilterTitle('');
      setSelectedFilter('');
      setPopupVisible(false);
    } else {
      return message.error('Enter name for filter');
    }
  };

  const addNewFilter = () => {
    setFilterVisible(true);
    setSelectedFilter('');
    _onEditFilter(undefined);
  };

  const onEditFilter = (item: any) => {
    _onEditFilter(item);
    setSelectedFilter(item.title);
  };

  const handleVisibleChange = (visible: boolean) => {
    setPopupVisible(visible);
  };

  return (
    <div>
      {savedFilters.length > 0 ? (
        isSavedFilterShowing ? (
          <>
            {`Saved Filters. ${Object.keys(savedFilters).length}`}
            <Button type='link' onClick={() => showSavedFilters(false)}>
              <Trans>Hide</Trans>
            </Button>
          </>
        ) : (
          <Button
            type='link'
            onClick={() => showSavedFilters(true)}
          >{`Saved Filters. ${Object.keys(savedFilters).length}`}</Button>
        )
      ) : null}
      {isSavedFilterShowing && (
        <div>
          {savedFilters.map(item => (
            <Tag
              closable={true}
              style={{
                padding: 8,
                border: '1px solid #EBF1F8',
                backgroundColor:
                  selectedFilter === item.title ? '#fff' : '#F5F8FB',
                color: selectedFilter === item.title ? '#1890FF' : '#68737D',
              }}
              key={item.id}
              onClose={(e: any) => handleClose(e, item)}
              onClick={() => onEditFilter(item)}
            >
              {item.title}
            </Tag>
          ))}
          <PlusOutlined
            onClick={addNewFilter}
            style={{ padding: 12, background: '#E6F7FF', color: '#1890FF' }}
          />
        </div>
      )}
      <Modal
        visible={popupVisible}
        closable
        onCancel={() => handleVisibleChange(false)}
        footer={null}
        width={400}
        destroyOnClose
        className='save-filters-modal'
        title={<Trans>Enter Name For Filter</Trans>}
        getContainer='.reports-container'
      >
        <div className='form'>
          <Input
            required={true}
            value={filterTitle}
            autoFocus
            onChange={e => setFilterTitle(e.target.value)}
          />
          <Button
            type='primary'
            onClick={saveFilter}
            className='save-filters-button'
            disabled={!Boolean(filterTitle.trim())}
          >
            <Trans>Save</Trans>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SavedFilters;
