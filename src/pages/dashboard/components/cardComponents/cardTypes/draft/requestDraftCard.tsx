import React from 'react';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import ShowAll from '../../../showAll/showAll';
import CardLoader from '../../cardLoader/cardLoader.index';

import { appPath } from '../../../../../app/app.routes';

const RequestDraftCard = (props: any) => {
  const {
    // variables //
    history,
    dashboardData,
    cardLoader,
    // functions //
    onAction,
    openDetailsDrawer,
    _fetchSpecificData,
    _sendRequestsForApproval,
  } = props;
  const allData = dashboardData[DASHBOARD_CARD_TYPES.draftRequest];

  //debugger;
  if (cardLoader.draftRequest) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.draftRequest} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.draftRequest}
        >
          {data.map((dataItem: any, index: number) =>
            dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.drafts.linkTo}request`}
                type={DASHBOARD_CARD_TYPES.draftRequest}
              />
            ) : (
              <CardItem
                date={`${dataItem.start_date} - ${dataItem.end_date}`}
                itemNumber={dataItem.request_no}
                index={index}
                key={index}
                itemId={dataItem.id}
                remarkType='requests'
                category={dataItem.is_travel_type ? 'Travel' : 'General'}
                title={dataItem.title}
                isFooterRightEnable={dataItem?.is_submittable}
                total={data.length}
                total_comments={dataItem.total_comments}
                _onRemarkAdded={() => _fetchSpecificData('draftRequest')}
                attachments={dataItem.attachments}
                total_receipt={dataItem.additional_documents}
                documentType='request'
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.draftRequest, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.draftRequest, 'next')
                }
                footerRightAction={() =>
                  _sendRequestsForApproval([dataItem.id])
                }
                footerLeftAction={() => openDetailsDrawer(dataItem, 'request')}
              />
            ),
          )}
        </CardContainer>
      );
    } else return null;
  }
};
export default RequestDraftCard;
