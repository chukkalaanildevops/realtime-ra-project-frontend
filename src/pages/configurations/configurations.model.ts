export interface ISettingsConfigurationState {
  activeKey: string;
  ftpRecords: any[];
  tenantConfig: any[];
  ssoConfigRecords: Array<any>;
  error: any;
  success: string;
  nameIdFormats: any[];
  loader: false;
  timeZoneList: any[];
  languagesList: any[];
  dataSaveLoader: boolean;
  isBenefitEnable: boolean;
  isAllowanceEnable: boolean;
  testingConnection: boolean;
  loadingMessage: string;
  isEnableTrafficLightFeatureForTenantFeatures: boolean;
}
