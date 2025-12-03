import Axios from '../../utils/reimAxios.utils';
import { remarkType } from '../../pages/app/app.model';
import { IItemTypes } from '../../pages/approvals/approvals.model';

/* -----------WORKFLOW----------- */
// export const getWorkFlow = (id: number, type: IItemTypes) =>
//   Axios.get(`/workflow/${id}/?item=${type}`);
export const getWorkFlow = (id: number, type: IItemTypes) => {
  const url =
    type === 'expense' || type === 'expenses_with_request'
      ? 'expense-claims'
      : type === 'benefit'
      ? 'benefit-claim'
      : 'requests';
  return Axios.get(`/${url}/${id}/workflow/`);
};
export const addApprover = (id: number, _approvers: number[]) =>
  Axios.post(`/workflow/${id}/add-approver/`, { approvers: _approvers });

export const updateApprover = (id: number, _approvers: number[]) =>
  Axios.post(`/workflow/${id}/update-approver/`, { approvers: _approvers });

/* -----------WORKFLOW----------- */

export const getRemarks = (type: remarkType, id: number) =>
  Axios.get(`/${type}/${id}/?for_comments=true`);

export const addRemarks = (type: remarkType, id: number, comments: any) =>
  Axios.post(`/${type}/${id}/add-comment/`, comments);

export const getReceipts = (type: any, id: any) =>
  Axios.get(`/${type}/${id}/all-attachments`);

export const checkAppVersion = () => {
  const key = process.env.REACT_APP_VERSION;
  Axios.post(`/app-check/check-app-version/`, { app_version: key })
    .then(res => {
      return;
    })
    .catch(err => {
      let currentApiCount: number =
        Number(sessionStorage.getItem('CheckApiVersionCount')) || 0;
      if (currentApiCount <= 3) {
        window.location.reload();
        currentApiCount += 1;
        sessionStorage.setItem('CheckApiVersionCount', String(currentApiCount));
      }
    });
};

export const fetchApproverCustomFieldDataAPI = (id: string) =>
  Axios.get(`/employee-approver-custom-fields/${id}/`);
