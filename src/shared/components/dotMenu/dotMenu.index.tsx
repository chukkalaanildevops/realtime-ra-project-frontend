import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { DotMenuPropsInterface, actionBtnObjInterface } from './dotMenu.model';

import './dotMenu.index.less';
import { useHistory } from 'react-router-dom';

/**
 *
 * Note: dont pass NavLink. instead use history.pust();
 * @param props
 */
const DotMenu: React.FC<DotMenuPropsInterface> = props => {
  const { actionBtn, dDDisabled = false, showInMenu = false } = props;

  const history = useHistory();

  if (actionBtn.length > 2 || showInMenu) {
    return (
      <Dropdown
        disabled={dDDisabled}
        overlay={MenuComponent(actionBtn)}
        trigger={['click']}
        className='custom-dropdown'
      >
        {props.children && props.children}
      </Dropdown>
    );
  } else {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {actionBtn.map((o: actionBtnObjInterface, i: number) => {
          return (
            <span key={i}>
              <Button
                type={o.Type ? o.Type : 'default'}
                title={o.title ? o.title : ''}
                className={`menu-button ${o.hide ? 'hide' : 'show'}`}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  o.OnClick && o.OnClick(e);
                  if (
                    o.children &&
                    (o?.children as any).type?.displayName === 'NavLink'
                  ) {
                    const url: string = (o?.children as any).props?.to;
                    url && history.push(url);
                  }
                }}
                disabled={o.Disabled ? o.Disabled : false}
              >
                <o.icon />
              </Button>
            </span>
          );
        })}
      </div>
    );
  }
};

export const MenuComponent = (props: actionBtnObjInterface[]) => {
  const items = props.map((o: actionBtnObjInterface, i: number) => (
    <Menu.Item key={i} className={`menu-button ${o.hide ? 'hide' : 'show'}`}>
      <Button
        type={o.Type ? o.Type : 'default'}
        title={o.title ? o.title : ''}
        onClick={o.OnClick}
        disabled={o.Disabled ? o.Disabled : false}
      >
        <o.icon
          style={typeof o.children === 'string' ? {} : { marginRight: 8 }}
        />
        {o.children}
      </Button>
    </Menu.Item>
  ));
  return <Menu className='custom-dropdown'>{items}</Menu>;
};

export default DotMenu;
