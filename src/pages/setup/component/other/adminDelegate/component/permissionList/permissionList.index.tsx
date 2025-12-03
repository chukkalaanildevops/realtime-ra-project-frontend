import React from 'react';
import { Row, Col, Checkbox } from 'antd';

const PermissionList: React.FC<{
  value?: number[];
  onChange?: (value?: number[]) => void;
  data: any[];
}> = ({ onChange, value, data }) => {
  const onCheckValue = (checked: boolean, id: number) => {
    let valuesToReturn = value ? [...value] : [];
    if (checked) {
      valuesToReturn.push(id);
    } else {
      const vals = valuesToReturn.filter(item => item !== id);
      valuesToReturn = vals;
    }
    triggerChange(valuesToReturn);
  };

  const triggerChange = (values?: number[]) => {
    const vals = values?.length === 0 ? undefined : values;
    if (onChange) {
      onChange(vals);
    }
  };
  return (
    <Row gutter={[12, 12]}>
      {data.map((item: any) => {
        return (
          <Col span={24} key={item.id}>
            <Checkbox
              checked={(value || []).includes(item.id)}
              onChange={e => onCheckValue(e.target.checked, item.id)}
            >
              {item.title}
            </Checkbox>
          </Col>
        );
      })}
    </Row>
  );
};

export default PermissionList;
