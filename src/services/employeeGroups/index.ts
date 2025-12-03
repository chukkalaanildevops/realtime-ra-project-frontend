import Axios from '../../utils/reimAxios.utils';

export const getEmployeeGroupList = () => {
  return Axios.get('/employee-groups/');
};

export const postEmployeeGroup = (data: {
  title: string;
  criteria:
    | 'ALLEMPS'
    | 'L1DREPO'
    | 'LV2REPO'
    | 'LV3REPO'
    | 'L2DREPO'
    | 'L3DREPO'
    | 'L23DREP'
    | 'ENTITYM'
    | 'INDSELU'
    | 'CUSTOMU';
  selected_users?: number[];
  is_criteria_based: boolean;
  custom_config?: {
    entity_type: number;
    operator: 'NOTIN' | 'IN' | 'IS' | 'ISNOT';
    entities: number[];
  }[];
}) => {
  let formData = getFormData(data);
  return Axios.post('/employee-groups/', formData, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};

export const getEmployeeGroupById = (id: number) => {
  return Axios.get(`/employee-groups/${id}/`);
};

export const getEmployeeGroupMembersNoPagination = (id: number) => {
  return Axios.get(`/employee-groups/${id}/members/?dropdown=true`);
};

export const getEmployeeGroupMembers = (
  id: number,
  page: number = 1,
  search: string = '',
) => {
  return Axios.get(
    `/employee-groups/${id}/members/?page=${page}&search=${search}`,
  );
};

export const updateEmployeeGroupById = (
  id: number,
  data: {
    title: string;
    criteria:
      | 'ALLEMPS'
      | 'L1DREPO'
      | 'LV2REPO'
      | 'LV3REPO'
      | 'L2DREPO'
      | 'L3DREPO'
      | 'L23DREP'
      | 'ENTITYM'
      | 'INDSELU'
      | 'CUSTOMU';
    selected_users?: number[];
    is_criteria_based: boolean;
    custom_config?: {
      entity_type: number;
      operator: 'NOTIN' | 'IN' | 'IS' | 'ISNOT';
      entities: number[];
    }[];
  },
) => {
  let formData = getFormData(data);
  return Axios.put(`/employee-groups/${id}/`, formData, {
    headers: { 'content-type': 'application/json' },
  });
};

export const updateEmployeeGroupSpecificValueById = (id: number, data: any) => {
  return Axios.patch(`/employee-groups/${id}/`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

export const deleteEmployeeGroupById = (id: number) => {
  return Axios.delete(`/employee-groups/${id}/`);
};

export const getLegalEntities = () => {
  return Axios.get('/legal-entities/');
};

export const getLegalEntitiesUsingEntityTypeId = (id: number) => {
  return Axios.get(`/legal-entities/?legal_entity_type=${id}`);
};

export const getLegalEntityTypes = () => {
  return Axios.get('/legal-entity-types/');
};

export const removeEmployeeFromIndividualCat = (
  employeeGroupId: number,
  removedEmployees: number[],
) =>
  Axios.post(
    `/employee-groups/${employeeGroupId}/remove_member/`,
    {
      remove_members: removedEmployees,
    },
    {
      headers: { 'content-type': 'application/json' },
    },
  );

const getFormData = (data: any) => {
  let formData = new FormData();
  for (let [key, value] of Object.entries(data)) {
    if (key !== 'file' && typeof value !== 'string')
      if (Array.isArray(value) && key !== 'custom_config')
        value.forEach(o => {
          formData.append(key, o);
        });
      else formData.append(key, JSON.stringify(value));
    else formData.append(key, value as any);
  }
  return formData;
};
