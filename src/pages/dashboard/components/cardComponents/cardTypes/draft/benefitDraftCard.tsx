import React from 'react';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import ShowAll from '../../../showAll/showAll';
import CardLoader from '../../cardLoader/cardLoader.index';

import { appPath } from '../../../../../app/app.routes';

const BenefitDraftCard = (props: any) => {
  const {
    // variables //
    history,
    dashboardData,
    cardLoader,
    // functions //
    onAction,
    openDetailsDrawer,
    _fetchSpecificData,
    _sendBenefitForApproval,
  } = props;
  const allData = dashboardData[DASHBOARD_CARD_TYPES.draftBenefit];
  if (cardLoader.draftBenefit) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.draftBenefit} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.draftBenefit}
        >
          {data.map((dataItem: any, index: number) =>
            dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.drafts.linkTo}benefit`}
                type={DASHBOARD_CARD_TYPES.draftBenefit}
              />
            ) : (
              <CardItem
                date={dataItem.date}
                documentType='benefit'
                index={index}
                key={index}
                category={dataItem?.category?.title}
                itemId={dataItem.id}
                itemNumber={dataItem.claim_number}
                remarkType='benefit-claim'
                total_receipt={dataItem.total_attachments}
                title={dataItem.title}
                total={data.length}
                amount={dataItem.converted_amount}
                currency={dataItem.currency_code}
                isFooterRightEnable={dataItem?.is_submittable}
                receipt={dataItem.receipt}
                attachments={dataItem.supporting_documents}
                total_comments={dataItem.total_comments}
                _onRemarkAdded={() => _fetchSpecificData('draftBenefit')}
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.draftBenefit, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.draftBenefit, 'next')
                }
                footerRightAction={() => _sendBenefitForApproval([dataItem.id])}
                footerLeftAction={() => openDetailsDrawer(dataItem, 'benefit')}
              />
            ),
          )}
        </CardContainer>
      );
    } else {
      return null;
    }
  }
};
export default BenefitDraftCard;
