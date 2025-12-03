export interface ILegalEntityState {
  isLoading: boolean;
  loadingMessage: string;
  companies: any[];
  departments: any[];
  organizations: any[];
  divisions: any[];
  entityData: {
    [id: string]: {
      id: number;
      data: any[];
      isLoading: boolean;
      isActive: boolean;
      type: string;
      isParentEntity: boolean;
    };
  };
  success: string;
  error: any;
  isDataSubmitting: boolean;
  financialYear: any[];
  entityHierarchy: any;
}
