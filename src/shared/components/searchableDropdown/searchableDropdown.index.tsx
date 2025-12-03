import React, {
  FC,
  memo,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  // useMemo,
} from 'react';
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';
import { Button, Input, Tooltip, Checkbox } from 'antd';
import {
  DownOutlined,
  UpOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import { useScrollSize, useOnClickOutside } from '../../hooks/index';

import { AppendToDOM, NoData } from '../';

import { IKeyValue, TSearchableDropdownListType } from '../../model';

import _ from 'lodash';

import './searchableDropdown.index.less';
import { Trans } from '@lingui/macro';

interface IProps {
  type?: 'single' | 'multi';
  showLoader?: boolean;
  list: TSearchableDropdownListType[];
  preSelectedValues?: TSelectedList[];
  listTitle?: string;
  placeholder?: string;
  appendToBody?: boolean;
  maxSelection?: number;
  onChange: (selectedValues: TSelectedList[]) => void;
}

type TSelectedList = string | number;

const SearchableDropdown: FC<IProps> = props => {
  const {
    type = 'multi',
    listTitle,
    list,
    placeholder = 'Search',
    preSelectedValues = [],
    appendToBody = true,
    showLoader = false,
    maxSelection = null,
    onChange,
  } = props;

  //   const windowSize = useWindowsSize();
  const windowScrollXY = useScrollSize('.page-container');
  const cache = React.useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 42,
    }),
  );

  const [dDvisibility, setDDvisibility] = useState(false);
  const [sList, setsList] = useState<TSearchableDropdownListType[]>(list);
  const [selectedList, setSelectedList] = useState<TSelectedList[]>(
    preSelectedValues,
  );
  const [searchText, setSearchText] = useState<string>('');
  const isMaxSelectionExeeded =
    maxSelection !== null && selectedList.length >= maxSelection;

  useEffect(() => {
    if (list?.length > 0 && sList?.length === 0) setsList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    setSelectedList(preSelectedValues.map(Number)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelectedValues]);

  useEffect(() => {
    // componentDidMount
    const elem = document.querySelector('.page-container') || document.body;
    elem.addEventListener('scroll', hideDDContent);
    elem.addEventListener('resize', hideDDContent);
    return () => {
      // componentWillUnmount
      elem.addEventListener('scroll', hideDDContent);
      elem.addEventListener('resize', hideDDContent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listType = list.length
    ? typeof list[0] === 'object'
      ? 'object'
      : 'other'
    : null;
  const isAllSelected = list.length === selectedList.length;
  let dDButton = useRef(null);
  const ddContentRef = useRef<HTMLDivElement | null>(null);

  const hideDDContent = () => {
    setDDvisibility(false);
  };

  useOnClickOutside(ddContentRef, hideDDContent);

  const handleDDBtnClick = () => {
    setDDvisibility(prevState => !prevState);
  };

  const handleItemClick = (
    key: TSelectedList,
    action: 'ADD' | 'REMOVE' = 'ADD',
  ) => {
    let newState = selectedList;
    if (action === 'ADD') {
      if (isMaxSelectionExeeded) {
        return false;
      }
      setSelectedList(prevState => {
        newState = type === 'single' ? [key] : [...prevState, key];
        onChange && onChange(newState);

        return newState;
      });
    } else if (action === 'REMOVE') {
      setSelectedList(prevState => {
        newState = type === 'single' ? [] : prevState.filter(o => o !== key);
        onChange && onChange(newState);

        return newState;
      });
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSearch = (ser: string) => {
    setsList(_prevState => {
      if (ser === '' || !ser) {
        return list;
      } else {
        return list.filter((i: TSearchableDropdownListType) => {
          let index;
          if (listType === 'other') {
            index = String(i)
              .toLowerCase()
              .indexOf(ser.toLowerCase());
          } else if (listType === 'object') {
            index = String((i as IKeyValue).value)
              .toLowerCase()
              .indexOf(ser.toLowerCase());
          }
          return index !== -1;
        });
      }
    });
  };

  const handleSelectAll = (isSelectAll: boolean) => {
    let _newState: TSelectedList[] = [];
    if (isSelectAll) {
      if (listType === 'other') {
        _newState = list as TSelectedList[];
      } else if (listType === 'object') {
        // _newState = (list as IKeyValue[]).map(o => o.key);
        _newState = _.map(list as IKeyValue[], 'key');
      }
    }
    setSelectedList(_newState);
    onChange && onChange(_newState);
  };

  const getOffsetFromBody = (
    elem: HTMLElement,
    skipBoundryCheck: boolean = true,
  ): { left: number; top: number; minHeight: number; minWidth: number } => {
    const ddHeight: number = 300;
    const ddWidth: number = 300;

    if (!elem || !appendToBody) {
      return {
        left: 0,
        top: 0,
        minHeight: ddHeight,
        minWidth: ddWidth,
      };
    }

    let offsetLeft = 0;
    let offsetTop = 0;
    const _elem: HTMLElement | any = elem;
    const height: number = _elem.clientHeight || 0;
    // let width: number = _elem.clientWidth || 0;
    const availableHeight: number = window.innerHeight || 0;
    const availableWidth: number = window.innerWidth || 0;
    const gap = 4;

    if (_elem) {
      // do {
      //   if (!isNaN(_elem.offsetLeft)) {
      //     offsetLeft += _elem.offsetLeft || 0;
      //   }
      //   if (!isNaN(_elem.offsetTop)) {
      //     offsetTop += _elem.offsetTop || 0;
      //   }
      // } while ((_elem = _elem.offsetParent));

      const { top, left } = _elem.getBoundingClientRect();
      offsetTop = top;
      offsetLeft = left;
    }

    // not going out side off the window :: Heigth
    if (skipBoundryCheck) {
      const topWithHeight = offsetTop + ddHeight + height;
      if (topWithHeight < availableHeight) {
        offsetTop = offsetTop + height + gap;
      } else {
        offsetTop = offsetTop - Math.abs(ddHeight + gap);
        offsetTop = offsetTop < 0 ? 0 : offsetTop;
      }

      // not going out side off the window ::Width
      const leftWithWidth = offsetLeft + ddWidth;
      if (leftWithWidth > availableWidth) {
        offsetLeft = Math.abs(availableWidth - gap) - ddWidth;
        offsetLeft = offsetLeft < 0 ? 0 : offsetLeft;
      }
    }

    return {
      left: (appendToBody ? offsetLeft : offsetLeft - windowScrollXY.left) || 0,
      top: (appendToBody ? offsetTop : offsetTop - windowScrollXY.top) || 0,
      minHeight: ddHeight,
      minWidth: ddWidth,
    };
  };

  const getDropDownContent = () => {
    const hasListData = !Boolean(list.length);
    const position = getOffsetFromBody(dDButton?.current as any);
    return (
      <div className='searchable-dropdown-content-wrapper' ref={ddContentRef}>
        <div
          className={`searchable-dropdown-content ${
            dDvisibility ? 'visible' : 'hidden'
          }`}
          style={{
            ...position,
          }}
        >
          <div className='searchable-header'>
            <Input.Search
              value={searchText}
              placeholder={placeholder}
              onChange={handleSearchChange}
              allowClear
              disabled={hasListData}
            />
          </div>
          <div className='searchable-body'>
            <div className='row'>
              {listTitle ? (
                <p className='list-title'>{`${list.length} ${listTitle}`}</p>
              ) : null}
              {maxSelection === null ? (
                <Button
                  type='link'
                  className={`select-all-button ${
                    type === 'single' ? 'hide' : ''
                  }`}
                  onClick={handleSelectAll.bind(null, !isAllSelected)}
                  disabled={hasListData}
                >
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </Button>
              ) : (
                <Tooltip
                  title={`Maximum ${maxSelection} ${listTitle} can be selected.`}
                  className='max-slection-count'
                >
                  <span>
                    <InfoCircleOutlined />
                  </span>
                </Tooltip>
              )}
            </div>

            {!Boolean(sList.length) ? (
              <NoData />
            ) : (
              <AutoSizer>
                {({ width, height }: any) => (
                  <List
                    width={width}
                    height={height}
                    rowHeight={cache.current.rowHeight}
                    deferredMeasurementCache={cache.current}
                    rowCount={sList.length}
                    rowRenderer={({ key, index, style, parent }: any) => {
                      const e = sList[index];
                      const _key =
                        listType === 'other'
                          ? (e as string | number)
                          : (e as IKeyValue).key;
                      const _val =
                        listType === 'other' ? e : (e as IKeyValue).value;
                      const isThisSelected =
                        listType === 'other'
                          ? selectedList.includes(_key)
                          : _.includes(selectedList, _key);
                      return (
                        <CellMeasurer
                          key={key}
                          cache={cache.current}
                          parent={parent}
                          columnIndex={0}
                          rowIndex={index}
                        >
                          <div
                            style={style}
                            className={`dd-item ${
                              isThisSelected
                                ? 'selected'
                                : isMaxSelectionExeeded
                                ? 'disabled-item'
                                : ''
                            }`}
                            onClick={handleItemClick.bind(
                              null,
                              _key,
                              isThisSelected ? 'REMOVE' : 'ADD',
                            )}
                          >
                            <Checkbox checked={isThisSelected} /> {_val}
                          </div>
                        </CellMeasurer>
                      );
                    }}
                  />
                )}
              </AutoSizer>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Button
        className='searchable-dropdown'
        onClick={handleDDBtnClick}
        ref={dDButton}
        loading={showLoader}
        size='large'
      >
        <span>
          {selectedList.length} <Trans>Selected</Trans>
        </span>
        <span>{dDvisibility ? <UpOutlined /> : <DownOutlined />}</span>
      </Button>
      {appendToBody ? (
        <AppendToDOM>
          <div className='appended-to-body'>{getDropDownContent()}</div>
        </AppendToDOM>
      ) : (
        <div className='not-appended-to-body'>
          {getDropDownContent()}
          {/* dDvisibility ? getDropDownContent() : null */}
        </div>
      )}
    </>
  );
};

export default memo(SearchableDropdown);
