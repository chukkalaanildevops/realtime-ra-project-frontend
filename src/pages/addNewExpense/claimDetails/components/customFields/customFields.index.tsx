import React, { memo, ReactNode, FC } from 'react';
import { GetFieldStructure } from '..';
import { Col, Row } from 'antd';
import { SafetyCertificateTwoTone } from '@ant-design/icons';
import { FormProps } from 'antd/lib/form';
import { CustomFieldsForm } from '../../../../../shared/components';

const CustomFields: FC<{
  claimFieldsData: any;
  configuration: any;
  formProps?: FormProps;
  isUseForFormPreview?: boolean;
  _isAdmin: boolean;
}> = props => {
  const {
    claimFieldsData,
    formProps,
    isUseForFormPreview,
    configuration,
    // _isAdmin,
  } = props;
  const rowGutter: [number, number] = [24, 24];
  const returnElement: ReactNode[] = isUseForFormPreview
    ? []
    : claimFieldsData?.map((o: any, i: number) => {
        const cField = configuration
          ? configuration?.custom_fields?.fields?.filter((p: any) => {
              if (p.is_filled_by_admin) {
                return o.id === p.id;
              } else {
                return o.id === p.id;
              }
            }) || []
          : [];
        const isAdmin = cField.length ? cField[0]?.is_filled_by_admin : false;
        const returnVal = (
          <Row gutter={rowGutter} key={i}>
            <Col span={24}>
              <GetFieldStructure
                lable={
                  <>
                    {o?.title || 'Label'}{' '}
                    {isAdmin ? (
                      <SafetyCertificateTwoTone
                        title='Admin Field'
                        twoToneColor='#faad14'
                        className='is-admin-icon'
                        style={{
                          verticalAlign: 'middle',
                          fontSize: '1rem',
                        }}
                      />
                    ) : null}
                  </>
                }
              >
                {o?.textual_values
                  ? o?.textual_values.map((o: string, i: number) => (
                      <span className='dd-items' key={i}>
                        {o}
                      </span>
                    ))
                  : o.value
                  ? o.sub_type === 'PERCENTAGE'
                    ? `${o.value}%`
                    : o.value
                  : ''}
              </GetFieldStructure>
            </Col>
          </Row>
        );
        // if (isAdmin) {
        //   return _isAdmin ? returnVal : null; //uncomment this code if you dont want to print admin fields to others
        // } else {
        return returnVal;
        // }
      });
  return (
    <Row gutter={rowGutter} className='custom-fields-container'>
      <Col span={24}>
        {!isUseForFormPreview ? (
          returnElement
        ) : (
          <CustomFieldsForm
            isAdmin={false}
            isViewMode={false}
            customFields={
              claimFieldsData || {
                fields: [],
                layout: [],
              }
            }
            formProps={formProps}
          />
        )}
      </Col>
    </Row>
  );
};

/**
 * This function returns matched custom field to the title.
 * @param _title : Title of custom field.
 * @param customFieldobject : Array of custom fields.
 */
// const getElementUsingTitle = (
//   _title: string,
//   customFieldobject: customObjInterface[],
// ): customObjInterface | null => {
//   const filteredObj = customFieldobject.filter(
//     (o: customObjInterface) => o.title === _title,
//   );
//   return filteredObj[0] || null;
// };

export default memo(CustomFields);
