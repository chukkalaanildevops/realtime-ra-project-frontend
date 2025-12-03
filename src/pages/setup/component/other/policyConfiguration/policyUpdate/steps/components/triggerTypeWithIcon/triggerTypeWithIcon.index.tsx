import React from 'react';
import './triggerTypeWithIcon.index.less';
import { WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface IProps {
  text: any;
  id: any;
  filled?: any;
}

const TriggerTypeWithIcon: React.FC<IProps> = ({
  filled = false,
  text = '',
  id = null,
}) => {
  const iconClass =
    text === 'High Risk'
      ? 'warning-icon-red'
      : text === 'Low Risk'
      ? 'warning-icon-orange'
      : null;

  return (
    <div className='warning-container' key={id}>
      {iconClass &&
        (text === 'High Risk' ? (
          <ExclamationCircleOutlined className={iconClass} />
        ) : (
          <WarningOutlined className={iconClass} />
        ))}
      <span className={`trigger-title ${iconClass}`}>{text}</span>
    </div>
  );
};

export default TriggerTypeWithIcon;
