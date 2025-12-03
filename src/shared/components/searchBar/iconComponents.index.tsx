import React from 'react';
import Icon from '@mdi/react';
import {
  mdiCurrencyUsd,
  mdiFileEditOutline,
  mdiSilverware,
  mdiCar,
  mdiAccountCashOutline,
  mdiAirplaneTakeoff,
} from '@mdi/js';

export const getUserIcon = (src?: string) => (
  <img
    className='img-layer'
    alt='profile'
    src={src || '/static/media/user.f131520c.png'}
    height='40px'
    width='40px'
  />
);

export const getExpenseIcon = (category?: string, _className: string = '') => {
  let icon = mdiCurrencyUsd; // General Default

  switch (category) {
    case 'Entertainment':
      icon = mdiSilverware;
      break;
    case 'Mileage':
      icon = mdiCar;
      break;
    case 'Petty Cash':
      icon = mdiAccountCashOutline;
      break;
  }
  return (
    <div className={`test ${_className} ${category}`}>
      <Icon path={icon} className='material-menu-icons' />
    </div>
  );
};

export const getRequestIcon = (category?: string, _className: string = '') => {
  let icon = category === 'TRAVEL' ? mdiAirplaneTakeoff : mdiFileEditOutline;

  return (
    <div className={`test ${_className} ${category}`}>
      <Icon path={icon} className='material-menu-icons' />
    </div>
  );
};
export const getBenefitIcon = (category?: string, _className: string = '') => {
  let icon = mdiFileEditOutline;

  return (
    <div className={`test ${_className} ${category}`}>
      <Icon path={icon} className='material-menu-icons' />
    </div>
  );
};
export default {
  getUserIcon,
  getExpenseIcon,
  getRequestIcon,
  getBenefitIcon,
};
