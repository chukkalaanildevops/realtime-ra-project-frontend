import { Dispatch } from 'react';
import { setSystemLabelsCustomisations } from './systemLabelsCustomisation.actions';
import {
  fetchSystemLabelsCustomisationAPI,
  updateSystemLabelsCustomisationAPI,
} from '../../services/systemLabelsCustomisation';
import { message } from 'antd';

export const fetchSystemLabelsCustomisation = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchSystemLabelsCustomisationAPI();
      dispatch(setSystemLabelsCustomisations(response.data));
      return response.data;
    } catch (e) {
      // eslint-disable-next-line no-console
    }
  };
};

export const updateSystemLabelsCustomisation = (data: any) => {
  return async (_dispatch: Dispatch<any>) => {
    try {
      message.info({
        content: `Updating labels`,
        key: 'UPDATE_SYSTEM_LABELS_CUSTOMISATION',
      });
      await updateSystemLabelsCustomisationAPI(data);
      message.success({
        content: `System labels updated`,
        key: 'UPDATE_SYSTEM_LABELS_CUSTOMISATION',
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      message.error({
        content: `Unable to update system labels`,
        key: 'UPDATE_SYSTEM_LABELS_CUSTOMISATION',
      });
    }
  };
};
