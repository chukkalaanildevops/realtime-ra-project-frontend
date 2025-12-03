import React, { memo, FC, CSSProperties } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const BackButton: FC<{
  backBtnStyle?: CSSProperties;
  backBtnUrl?: string;
  onBackClick?: Function;
}> = props => {
  const { backBtnStyle, backBtnUrl, onBackClick } = props;

  const history = useHistory();

  const handleBackBtnClick = () => {
    onBackClick && onBackClick();
    if (backBtnUrl) {
      history.push(backBtnUrl);
    } else {
      history.goBack();
    }
  };

  return (
    <>
      <ArrowLeftOutlined
        className='arrow-back-btn'
        style={{ ...backBtnStyle }}
        onClick={handleBackBtnClick}
      />
    </>
  );
};

export default memo(BackButton);
