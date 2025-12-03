import Axios from '../../utils/reimAxios.utils';

export const fetchEmailTemplatesService = () => {
  return Axios.get('/email-templates/');
};

export const fetchEmailTemplatesDetailsService = (templateId: number) => {
  return Axios.get(`/email-templates/${templateId}/`);
};

export const updateEmailTemplateService = (
  templateId: number,
  data: { [key: string]: any },
) => {
  return Axios.put(`/email-templates/${templateId}/`, data);
};

export const toggleEmailTemplateActiveStatusService = (
  templateId: number,
  data: { [key: string]: any },
) => {
  return Axios.put(`/email-templates/${templateId}/mark-active/`, data);
};

export const fetchTriggerTypesData = () => {
  return Axios.get('/email-templates/trigger-type-choices/');
};
