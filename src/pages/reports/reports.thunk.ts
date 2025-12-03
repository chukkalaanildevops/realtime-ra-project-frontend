import { Dispatch } from 'react';
import {
  fetchReportsData,
  fetchExportedReportsListAPI,
  downloadReportAPI,
  fetchSavedReportFiltersAPI,
  saveReportFilter,
  updateReportFilter,
  deleteReportFilterAPI,
  fetchExpenseTypesAPI,
  fetchBenefitTypesAPI,
  generateSpecializedReportAPI,
  generateSpecializedBenefitReportAPI,
  fetchSpecializedReportTypesAPI,
  getDataForReportsService,
} from '../../services/reports';
import {
  saveExpenses,
  saveRequests,
  setError,
  setLoader,
  setLoadingMessage,
  setReportCountLoading,
  saveReportCount,
  saveBenefits,
  saveBenefitEntitlement,
  saveCashAdvanceRequests,
  saveExpenseWithRequest,
  setSuccess,
  setLoadingMore,
  saveDownloadedReportsList,
  saveExpenseReportFilters,
  saveRequestReportFilters,
  saveCashRequestReportFilters,
  saveExpenseRequestReportFilters,
  saveExpenseTypes,
  saveBenefitTypes,
  saveSpecializedReportTypes,
  saveBenefitEntitlementUsers,
} from './reports.action';
import { loading } from '../../shared/components/responcePopUp/responcePopUp';
import { tabs } from './reports.model';
import { stateInterface } from '../../shared/redux/rootReducer';

const FileDownload = require('js-file-download');

const apiStart = (isLoading = false, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoading));
    dispatch(setLoadingMessage(message));
  };
};

export const fetchReportCount = (
  fetchNext?: tabs,
  source?: any,
  filters?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setReportCountLoading(true));
      const response = await fetchReportsData(
        'count',
        source,
        undefined,
        undefined,
        filters,
      );
      dispatch(saveReportCount(response.data));
      dispatch(setReportCountLoading(false));
      if (fetchNext) {
        dispatch(fetchReportTabData(fetchNext, source, 1));
      }
    } catch (e) {
      dispatch(setReportCountLoading(false));
      dispatch(setError('Failed to fetch data'));
    }
  };
};

export const fetchReportTabData = (
  tab: tabs,
  source?: any,
  page?: number,
  filters?: any,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const pageNumber = page || getState()?.reports[tab]?.current_page;

      if (getState()?.reports[tab]?.data.length === 0) {
        dispatch(apiStart(true, ''));
      } else {
        dispatch(setLoadingMore(true));
      }

      dispatch(setLoader(true));
      loading(true, 'Loading');

      const response = await fetchReportsData(
        'data',
        source,
        tab,
        pageNumber,
        filters,
        pageSize,
      );
      const responseData = response.data;

      if (tab === 'benefit_entitlement') {
        dispatch(
          saveReportCount({
            [`${tab}s`]: responseData.pagination_data.benefit_entitlements,
          }),
        );
      } else {
        dispatch(
          saveReportCount({
            [`${tab}s`]: responseData.pagination_data.total_records,
          }),
        );
      }
      const current_page = pageNumber;
      if (tab === 'expense') {
        dispatch(saveExpenses({ ...responseData, current_page: current_page }));
      } else if (tab === 'request') {
        dispatch(saveRequests({ ...responseData, current_page: current_page }));
      } else if (tab === 'benefit') {
        dispatch(saveBenefits({ ...responseData, current_page: current_page }));
      } else if (tab === 'benefit_entitlement') {
        dispatch(
          saveBenefitEntitlement({
            ...responseData,
            current_page: current_page,
          }),
        );
      } else if (tab === 'cash_advance_request') {
        dispatch(
          saveCashAdvanceRequests({
            ...responseData,
            current_page: current_page,
          }),
        );
      } else if (tab === 'expenses_with_request') {
        dispatch(
          saveExpenseWithRequest({
            ...responseData,
            current_page: current_page,
          }),
        );
      }
      dispatch(apiStart(false));
      dispatch(setLoadingMore(false));
    } catch (e) {
      dispatch(apiStart());
      dispatch(setLoadingMore(false));
      dispatch(setError('Failed to fetch data'));
    }
  };
};

export const exportReport = (tab: tabs, source: any, filters?: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await fetchReportsData('report', source, tab, undefined, filters);

      dispatch(
        setSuccess(
          'Your request has been initiated. Report will be available for download shortly.',
        ),
      );
    } catch (e) {
      dispatch(setError('Failed to export report'));
    }
  };
};

export const fetchExportedDownloadList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchExportedReportsListAPI();
      dispatch(saveDownloadedReportsList(response.data));
      if (response.data?.length === 0) {
        dispatch(setError('No reports to download'));
      }
    } catch (e) {
      dispatch(setError('Failed to load data'));
    }
  };
};

export const downloadReport = (reportId: number, fileName: string) => {
  return async () => {
    const response = await downloadReportAPI(reportId);
    FileDownload(response.data, fileName);
  };
};

export const fetchSavedFilters = (
  category: 'EXPNSE' | 'REQEST' | 'CSHADV' | 'EXPREQ',
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchSavedReportFiltersAPI('REPRT', category);
      const data = response.data;
      if (category === 'EXPNSE') {
        dispatch(saveExpenseReportFilters(data));
      } else if (category === 'REQEST') {
        dispatch(saveRequestReportFilters(data));
      } else if (category === 'CSHADV') {
        dispatch(saveCashRequestReportFilters(data));
      } else if (category === 'EXPREQ') {
        dispatch(saveExpenseRequestReportFilters(data));
      }
    } catch (e) {
      dispatch(setError(`Failed to fetch ${category} filters`));
    }
  };
};

export const createUpdateFilter = (body: any, id?: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      id ? await updateReportFilter(body, id) : await saveReportFilter(body);

      const category = body.category;
      dispatch(fetchSavedFilters(category));
      dispatch(setSuccess('Filter added'));
    } catch (e) {
      dispatch(setError(`Failed to ${id ? 'save' : 'update'} filter`));
    }
  };
};

export const deleteFilter = (
  id: number,
  category: 'EXPNSE' | 'REQEST' | 'CSHADV' | 'EXPREQ',
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await deleteReportFilterAPI(id);
      dispatch(fetchSavedFilters(category));
      dispatch(setSuccess('Filter deleted'));
    } catch (e) {
      dispatch(setError(`Failed to remove filter`));
    }
  };
};

export const fetchExpenseTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchExpenseTypesAPI();
      dispatch(saveExpenseTypes(response.data));
      // dispatch(setSuccess('Filter deleted'));
    } catch (e) {
      // dispatch(setError(`Failed to remove filter`));
    }
  };
};

export const fetchBenefitTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchBenefitTypesAPI();
      dispatch(saveBenefitTypes(response.data));
      // dispatch(setSuccess('Filter deleted'));
    } catch (e) {
      // dispatch(setError(`Failed to remove filter`));
    }
  };
};

export const generateSpecializedReport = (id: number, filter: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await generateSpecializedReportAPI(id, filter);
      // dispatch(saveExpenseTypes(response.data));
      dispatch(setSuccess('Report generated successfully'));
    } catch (e) {
      dispatch(setError(`Failed to generate report`));
    }
  };
};

export const generateSpecializedBenefitReport = (id: number, filter: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await generateSpecializedBenefitReportAPI(id, filter);
      dispatch(setSuccess('Report generated successfully'));
    } catch (e) {
      dispatch(setError(`Failed to generate report`));
    }
  };
};

export const fetchSpecializedReportTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchSpecializedReportTypesAPI();
      dispatch(saveSpecializedReportTypes(response.data));
      // if (response.data?.length === 0) {
      //   dispatch(setError('No reports to download'));
      // }
    } catch (e) {
      dispatch(setError('Failed to fetch report types'));
    }
  };
};

export const fetchUserEntitlementRecords = (parameters: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, ''));
      dispatch(setLoader(true));
      loading(true, 'Loading');
      const response = await getDataForReportsService(parameters);
      let dataGroupItems = response.data.data;
      let paginationData = response.data.pagination_data;
      dispatch(apiStart(false));
      dispatch(setLoadingMore(false));
      dispatch(saveBenefitEntitlementUsers(dataGroupItems, paginationData));
    } catch (error) {
      dispatch(apiStart());
      dispatch(setLoadingMore(false));
      dispatch(setError('Failed to fetch data'));
      // message.error(error.response.data.error);
    }
  };
};
