import React from 'react';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import ShowAll from '../../../showAll/showAll';
import CardLoader from '../../cardLoader/cardLoader.index';
import { appPath } from '../../../../../app/app.routes';
import { StatusTag } from '../../../../../../shared/components';

const RequestRejectedCard = (props: any) => {
  const {
    // variables //
    history,
    dashboardData,
    cardLoader,
    // functions //
    onAction,
    openDetailsDrawer,
    _fetchSpecificData,
    handleStatusTagClick,
  } = props;
  const allData = dashboardData[DASHBOARD_CARD_TYPES.rejectedRequest];
  //debugger;
  if (cardLoader.approvedBenefit) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.rejectedRequest} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.rejectedRequest}
        >
          {data.map((dataItem: any, index: number) =>
            dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.submitted.linkTo}request`}
                type={DASHBOARD_CARD_TYPES.rejectedRequest}
                status='REJCTD'
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
                _onRemarkAdded={() => _fetchSpecificData('rejectedRequest')}
                attachments={dataItem.attachments}
                total_receipt={dataItem.additional_documents}
                documentType='request'
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.rejectedRequest, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.rejectedRequest, 'next')
                }
                footerRight={
                  <StatusTag
                    status={dataItem.workflow_status}
                    onStatusClick={() =>
                      handleStatusTagClick(dataItem.id, 'request')
                    }
                  />
                }
                footerLeft='VIEW DETAILS'
                footerLeftAction={() => openDetailsDrawer(dataItem, 'request')}
              />
            ),
          )}
        </CardContainer>
      );
    } else return null;
  }
};

export default RequestRejectedCard;
