import React from 'react';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import ShowAll from '../../../showAll/showAll';
import CardLoader from '../../cardLoader/cardLoader.index';

import { appPath } from '../../../../../app/app.routes';
import { StatusTag } from '../../../../../../shared/components';

const RequestApprovedCard = (props: any) => {
  const {
    // variables //
    history,
    dashboardData,
    cardLoader,
    // functions //
    onAction,
    openDetailsDrawer,
    _fetchSpecificData,
    isPermissionAllowed,
    handleStatusTagClick,
  } = props;
  const allData = dashboardData[DASHBOARD_CARD_TYPES.approvedRequest];

  const addNewExpense = (recordId: any) => {
    let path = appPath.submitted.expenses.addNew.linkTo;
    path = path.replace(':requestId', recordId);
    history.push(path);
  };
  //debugger;
  if (cardLoader.approvedRequest) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.approvedRequest} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.approvedRequest}
        >
          {data.map((dataItem: any, index: number) =>
            dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.submitted.linkTo}request`}
                type={DASHBOARD_CARD_TYPES.approvedRequest}
                status='APPRVD'
              />
            ) : (
              <CardItem
                date={`${dataItem.start_date} - ${dataItem.end_date}`}
                itemNumber={dataItem.request_no}
                index={index}
                key={index}
                itemId={dataItem.id}
                remarkType='requests'
                category={
                  dataItem.request_type_legal_entity.is_travel_type
                    ? 'Travel'
                    : 'General'
                }
                title={dataItem.request_type_legal_entity.title}
                total={data.length}
                total_comments={dataItem.total_comments}
                _onRemarkAdded={() => _fetchSpecificData('approvedRequest')}
                attachments={dataItem.attachments}
                total_receipt={dataItem.additional_documents}
                documentType='request'
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.approvedRequest, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.approvedRequest, 'next')
                }
                footerLeft={
                  <StatusTag
                    status={dataItem.workflow_status}
                    onStatusClick={() =>
                      handleStatusTagClick(dataItem.id, 'request')
                    }
                  />
                }
                attachedRequestCount={
                  dataItem.can_claim_expense &&
                  isPermissionAllowed('ACTION_EXPENSE')
                    ? dataItem.attached_expense_types
                    : undefined
                }
                // footerRight={data.can_claim_expense.toString()}
                isFooterRightEnable={!dataItem?.is_request_expired}
                footerRight={
                  dataItem.can_claim_expense &&
                  isPermissionAllowed('ACTION_EXPENSE')
                    ? 'ADD EXPENSE'
                    : 'VIEW DETAILS'
                }
                footerRightAction={
                  dataItem.can_claim_expense &&
                  isPermissionAllowed('ACTION_EXPENSE')
                    ? () => addNewExpense(dataItem.id)
                    : () => openDetailsDrawer(dataItem, 'request')
                }
                history={history}
              />

              // footer={()=>openDetailsDrawer(dataItem,'expense')}
            ),
          )}
        </CardContainer>
      );
    } else return null;
  }
};

export default RequestApprovedCard;
