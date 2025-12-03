/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import { Dispatch } from 'react';
import {
  setLogListLoader,
  setLogDetailDataLoader,
  setLogList,
  setLogDetailData,
  setApproversCustomFieldsListData,
  setEmployeeApproversCFData,
  setEmployeeApproversCFListLoader,
  setDependentInfoCFListData,
  setEmployeeDependentInfoListData,
  setDependentInfoListLoader,
} from './sfLogs.actions';

import {
  success,
  destroy,
  error,
  loading,
} from '../../../shared/components/responcePopUp/responcePopUp';

import {
  getDownloadAPI,
  getLogListAPI,
  getLogListDetailAPI,
  deleteEmployeeBasicInfoAPI,
  deleteEmployeeJobInfoAPI,
  deleteEmployeeApproversAPI,
  deleteEmployeeBankDetailsAPI,
  fetchApproversCustomFieldsListAPI,
  fetchEmployeeApproversDataAPI,
  fetchDependentInfoCFListAPI,
  fetchEmployeeDependentInfoDataAPI,
  deleteEmployeeDependentInfoAPI,
} from '../../../services/sfIntegration';
const FileDownload = require('js-file-download');

export const getLogList = (pageNumber: any = 1, query?: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLogListLoader(true));
    getLogListAPI(pageNumber, query)
      .then((response: any) => {
        dispatch(setLogList(response.data));
      })
      .then(() => {
        destroy();
        dispatch(setLogListLoader(false));
      })
      .catch(() => {
        destroy();
        dispatch(setLogListLoader(false));
        error('Failed to Load Log List');
      });
  };
};

export const getLogDetailList = (userId: any, type: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLogDetailDataLoader(true));
    getLogListDetailAPI(userId, type)
      .then((response: any) => {
        dispatch(setLogDetailData(response.data));
      })
      .then(() => {
        destroy();
        dispatch(setLogDetailDataLoader(false));
      })
      .catch(() => {
        destroy();
        dispatch(setLogDetailDataLoader(false));
        error('Failed to Load Log Detail List');
      });
  };
};

export const onDownloadClick = (userId: any, fileName: any) => {
  return async () => {
    if (userId) {
      const response = await getDownloadAPI(userId);
      FileDownload(response.data, fileName);
    }
  };
};

export const deleteEmployeeBasicInfo = (id: number, userId: any, type: any) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting record');
    deleteEmployeeBasicInfoAPI(id)
      .then(() => {
        dispatch(getLogDetailList(userId, type));
        destroy();
        success('Record deleted successfully');
      })
      .catch(() => {
        destroy();
        error('Failed to delete record');
      });
  };
};

export const deleteEmployeeJobInfo = (id: number, userId: any, type: any) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting record');
    deleteEmployeeJobInfoAPI(id)
      .then(() => {
        dispatch(getLogDetailList(userId, type));
        destroy();
        success('Record deleted successfully');
      })
      .catch(() => {
        destroy();
        error('Failed to delete record');
      });
  };
};

export const deleteEmployeeApprovers = (id: number, userId: any, type: any) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting record');
    deleteEmployeeApproversAPI(id)
      .then(() => {
        dispatch(getLogDetailList(userId, type));
        destroy();
        success('Record deleted successfully');
      })
      .catch(() => {
        destroy();
        error('Failed to delete record');
      });
  };
};

export const deleteEmployeeApproversCustomField = (
  id: number,
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
  approversCustomFieldsListData?: any,
  callback?: Function,
) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting record');
    deleteEmployeeApproversAPI(id)
      .then(() => {
        dispatch(
          fetchEmployeeApproversCFData(
            page,
            pageSize,
            employeeId,
            effective_from__lte,
            sort,
            approversCustomFieldsListData,
          ),
        );
        destroy();
        success('Record deleted successfully');
        callback && callback();
      })
      .catch(() => {
        destroy();
        error('Failed to delete record');
      });
  };
};

export const deleteEmployeeBankDetails = (
  id: number,
  userId: any,
  type: any,
) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting record');
    deleteEmployeeBankDetailsAPI(id)
      .then(() => {
        dispatch(getLogDetailList(userId, type));
        destroy();
        success('Record deleted successfully');
      })
      .catch(() => {
        destroy();
        error('Failed to delete record');
      });
  };
};

export const fetchEmployeeApproversCFData = (
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
  approversCustomFieldsListData?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setEmployeeApproversCFListLoader(true));
      const response = await fetchEmployeeApproversDataAPI(
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
      );
      let employeeApproversCFData = response?.data?.data;
      let newData: any = [];
      let titleList: any = [];

      approversCustomFieldsListData.map((item: any) => {
        titleList.push(item?.title);
      });

      employeeApproversCFData.map((item: any) => {
        let newobject: any = {};
        titleList.map((titleName: any) => {
          let items: any = {};
          Object.keys(item?.approvers).find((data: any) => {
            if (item?.approvers[data].title === titleName) {
              items = item?.approvers[data];
            }
          });
          newobject[titleName] = items;
        });
        newData.push(newobject);
      });
      employeeApproversCFData = employeeApproversCFData.map(
        (item: any, index: number) => {
          return { ...item, ...newData[index] };
        },
      );
      response.data.data = employeeApproversCFData;

      dispatch(setEmployeeApproversCFData(response?.data));
      dispatch(setEmployeeApproversCFListLoader(false));
    } catch (e) {
      dispatch(setEmployeeApproversCFListLoader(false));
      destroy();
      error('Failed to fetch approvers data');
      // eslint-disable-next-line no-console
    }
  };
};
export const fetchApproversCustomFieldsList = (
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setEmployeeApproversCFListLoader(true));
      const response = await fetchApproversCustomFieldsListAPI(1, 50);
      dispatch(setApproversCustomFieldsListData(response?.data));
      let approversCustomFieldsListData: any = response?.data?.data;
      if (response?.data?.data?.length > 0) {
        dispatch(
          fetchEmployeeApproversCFData(
            page,
            pageSize,
            employeeId,
            effective_from__lte,
            sort,
            approversCustomFieldsListData,
          ),
        );
      }
      response?.data?.data?.length === 0 &&
        dispatch(setEmployeeApproversCFListLoader(false));
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = (e as any).response?.data;
      dispatch(setEmployeeApproversCFListLoader(false));
    }
  };
};

export const fetchEmployeeDependentInfoData = (
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
  dependentInfoCFListData?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setDependentInfoListLoader(true));
      const response = await fetchEmployeeDependentInfoDataAPI(
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
      );
      let employeeDependentInfoListData: any = response?.data?.data;
      let newData: any = [];
      let titleList: any = [];

      dependentInfoCFListData?.map((item: any) => {
        titleList.push(item?.title);
      });

      employeeDependentInfoListData?.map((item: any) => {
        let newobject: any = {};
        titleList?.map((titleName: any) => {
          let items: any = {};
          if (item?.custom_fields) {
            Object.keys(item?.custom_fields).find((data: any) => {
              if (item?.custom_fields[data]?.title === titleName) {
                items = item?.custom_fields[data];
              }
            });
            newobject[titleName] = items;
          }
        });
        newData.push(newobject);
      });
      employeeDependentInfoListData = employeeDependentInfoListData?.map(
        (item: any, index: number) => {
          return { ...item, ...newData[index] };
        },
      );
      response.data.data = employeeDependentInfoListData;

      dispatch(setEmployeeDependentInfoListData(response.data));
      dispatch(setDependentInfoListLoader(false));
    } catch (e) {
      dispatch(setDependentInfoListLoader(false));
      destroy();
      error('Failed to fetch dependents info');
      // eslint-disable-next-line no-console
    }
  };
};
export const fetchDependenInfoCFList = (
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setDependentInfoListLoader(true));
      let dependentPage = 1;
      let newData: any = {};
      let isDependentUpdated = false;
      let allDependentInfoCFListData: any = [];
      while (dependentPage >= 1) {
        const response = await fetchDependentInfoCFListAPI(dependentPage, 12);

        let dependentInfoCFListData: any = response?.data?.data;
        allDependentInfoCFListData.push(...dependentInfoCFListData);
        response.data.data = allDependentInfoCFListData;
        newData = response.data;
        isDependentUpdated = true;

        if (!response?.data?.pagination_data?.next_page_no) {
          break;
        }

        dependentPage = response?.data?.pagination_data?.next_page_no;
      }

      if (isDependentUpdated) {
        dispatch(setDependentInfoCFListData(newData));
      }

      dispatch(
        fetchEmployeeDependentInfoData(
          page,
          pageSize,
          employeeId,
          effective_from__lte,
          sort,
          allDependentInfoCFListData,
        ),
      );
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = (e as any).response?.data;
      dispatch(setDependentInfoListLoader(false));
    }
  };
};

export const deleteEmployeeDependentInfo = (
  id: number,
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
  dependentInfoCFListData?: any,
  callback?: Function,
) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting record');
    deleteEmployeeDependentInfoAPI(id)
      .then(() => {
        dispatch(
          fetchEmployeeDependentInfoData(
            page,
            pageSize,
            employeeId,
            effective_from__lte,
            sort,
            dependentInfoCFListData,
          ),
        );
        destroy();
        success('Record deleted successfully');
        callback && callback();
      })
      .catch(() => {
        destroy();
        error('Failed to delete record');
      });
  };
};
