import React, { FC, useEffect, useState } from 'react';
import _debounce from 'lodash/debounce';
import { Input, List } from 'antd';
import { getPlacesAPI } from '../../../services/geoLocation/index';
import './index.less';

const CustomPlacesAutocomplete: FC<{
  defaultValue?: string;
  onSelect?: any;
}> = ({ defaultValue = '', onSelect }) => {
  const [placeValue, setPlaceValue] = useState(defaultValue);
  const [placeList, setPlaceList] = useState<any[]>([]);
  const [enableDropdown, setEnableDropdown] = useState(false);

  useEffect(() => {
    setEnableDropdown(false);
  }, []);
  const getOnChangePlace = (text: any) => {
    getPlacesAPI(text)
      .then((res: any) => {
        const result = res?.data?.results.map((item: any) => {
          const isStartWith = item?.formatted_address?.startsWith(item?.name);
          if (isStartWith) {
            return {
              ...item,
              place: item?.formatted_address,
            };
          } else {
            return {
              ...item,
              place: item?.name + ' , ' + item?.formatted_address,
            };
          }
        });
        setPlaceList(result);
      })
      .catch(_ => {});
  };
  const debounceFn = React.useCallback(
    _debounce(text => {
      getOnChangePlace(text);
      setEnableDropdown(true);
    }, 1000),
    [],
  );
  return (
    <div>
      <Input
        value={placeValue}
        onChange={(event: any) => {
          setPlaceValue(event.target.value);
          debounceFn(event.target.value);
        }}
      />
      {enableDropdown && (
        <List
          bordered
          dataSource={placeList}
          className='place-autocomplete-dropdown'
          renderItem={(item: any) => (
            <List.Item
              onClick={() => {
                setPlaceValue(item.place);
                onSelect(item.place);
                setEnableDropdown(false);
              }}
            >
              {item.place}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default CustomPlacesAutocomplete;
