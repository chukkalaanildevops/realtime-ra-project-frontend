export interface IRoles {
  roles: { [key: string]: any }[];
  roleDetails: { [key: string]: any } | null;
  isLoading: boolean;
  formSubmissionInProgress: boolean;
  formSubmissionSuccessful: boolean;
  formErrors: { [key: string]: any };
  serviceCallFailed: boolean;
  serviceCallError?: string;
}

export interface IPermission {
  id: number;
  code: string;
  title: any;
  action: string;
}
