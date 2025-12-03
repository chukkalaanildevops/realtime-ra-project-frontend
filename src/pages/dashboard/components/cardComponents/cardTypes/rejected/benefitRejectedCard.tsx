import React from 'react';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import ShowAll from '../../../showAll/showAll';
import CardLoader from '../../cardLoader/cardLoader.index';

import { appPath } from '../../../../../app/app.routes';
import { StatusTag } from '../../../../../../shared/components';

const BenefitRejectedCard = (props: any) => {
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
  const allData = dashboardData[DASHBOARD_CARD_TYPES.rejectedBenefit];
  //debugger;
  if (cardLoader.approvedBenefit) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.rejectedBenefit} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.rejectedBenefit}
        >
          {data.map((dataItem: any, index: number) =>
            dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.submitted.linkTo}benefit`}
                type={DASHBOARD_CARD_TYPES.rejectedBenefit}
                status='REJCTD'
              />
            ) : (
              <CardItem
                date={dataItem.date}
                documentType='benefit'
                index={index}
                key={index}
                itemId={dataItem.id}
                itemNumber={dataItem.claim_number}
                remarkType='benefit-claim'
                category={
                  dataItem.benefit_type_legal_entity?.benefit_type.category
                    ?.title
                }
                title={dataItem.benefit_type_legal_entity?.benefit_type?.title}
                total={data.length}
                amount={dataItem.converted_amount}
                currency={dataItem.converted_amount_currency.currency.code}
                receipt={dataItem.receipt}
                attachments={dataItem.supporting_documents}
                total_receipt={dataItem.total_attachments}
                total_comments={dataItem.total_comments}
                _onRemarkAdded={() => _fetchSpecificData('rejectedBenefit')}
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.rejectedBenefit, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.rejectedBenefit, 'next')
                }
                footerLeft='VIEW DETAILS'
                footerLeftAction={() => openDetailsDrawer(dataItem, 'benefit')}
                footerRight={
                  <StatusTag
                    status={dataItem.workflow_status}
                    onStatusClick={() =>
                      handleStatusTagClick(dataItem.id, 'benefit')
                    }
                  />
                }
              />
            ),
          )}
        </CardContainer>
      );
    } else return null;
  }
};

export default BenefitRejectedCard;
