export interface IEmailTemplates {
  emailTemplates: { [key: string]: any }[];
  isLoading: boolean;
  formSubmissionInProgress: boolean;
  formSubmissionSuccessful: boolean;
  formErrors: { [key: string]: any };
  serviceCallFailed: boolean;
  serviceCallError?: string;
  triggerTypes: any[];
  cronData: ICronData;
}

export interface ICronData {
  frequency: string;
  daysOfWeek: string[];
  daysOfMonth: string[];
}
