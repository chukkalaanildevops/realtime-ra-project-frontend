export interface IRequest {
  requestDetailInstance: { [key: string]: any };
  requestTypeConfiguration: { [key: string]: any };
  requestDetailLoading: boolean;
  requestDetailFetchingFailed: boolean;
}

export interface IRequestDetailProps {
  requestId: number;
  isAdmin?: boolean;
  isCreatedByVisible?: boolean;
  isApprovalPage?: boolean;
  isEmployee?: boolean;
}
