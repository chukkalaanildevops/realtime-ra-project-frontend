import { ISystemLabelsCustomisation } from './systemLabelsCustomisation.model';
import { SYSTEM_LABELS_CUSTOMISATION } from './systemLabelsCustomisation.actions';

export const initialState: ISystemLabelsCustomisation = {
  systemLabelsCustomisation: {},
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case SYSTEM_LABELS_CUSTOMISATION.SET_SYSTEM_LABELS_CUSTOMISATION:
      return {
        ...state,
        systemLabelsCustomisation: payload,
      };
    default:
      return state;
  }
};

export const getSystemLabelCustomisations = (
  state: ISystemLabelsCustomisation,
) => state.systemLabelsCustomisation;
