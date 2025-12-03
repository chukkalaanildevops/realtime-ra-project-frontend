import React from 'react';
import './warningIconWithTooltip.index.less';
import { Button, Tooltip } from 'antd';
import { WarningFilled, WarningOutlined } from '@ant-design/icons';

interface IProps {
  text?: any;
  color: any;
  id: any;
  filled?: any;
  onIconClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const WarningIconWithTooltip: React.FC<IProps> = ({
  filled = false,
  text = '',
  color = null,
  id = null,
  onIconClick,
}) => {
  const iconClass =
    color === 'RED'
      ? 'warning-icon-red'
      : color === 'ORANGE'
      ? 'warning-icon-orange'
      : null;

  const tooltipClass =
    color === 'RED'
      ? 'warning-tooltip-card border-red'
      : color === 'ORANGE'
      ? 'warning-tooltip-card border-orange'
      : 'warning-tooltip-card';
  return (
    <div className='warning-container'>
      {iconClass && (
        <Button onClick={onIconClick} style={{ padding: '0 2px' }} type='link'>
          <Tooltip
            title={
              text ? (text.includes('out of') ? `${text} expenses` : text) : ''
            }
            overlayClassName={tooltipClass}
            // color={tooltipColor}
            key={id}
          >
            {filled ? (
              <WarningFilled className={iconClass} />
            ) : (
              <WarningOutlined className={iconClass} />
            )}
          </Tooltip>
        </Button>
      )}
    </div>
  );
};

export default WarningIconWithTooltip;
