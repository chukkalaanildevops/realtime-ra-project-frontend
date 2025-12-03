export interface Item {
  key: string;
  entityId: string;
  singleSignOnService: string;
  singleLogoutService: string;
  singleLogoutServiceBinding: string;
  xCertificate: string;
  NameIDFormat?: string;
  isEditable: boolean;
  isRequired: boolean;
  isNew?: boolean;
  consumerService: string;
}
