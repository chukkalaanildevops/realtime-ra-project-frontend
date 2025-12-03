import React from 'react';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import ShowAll from '../../../showAll/showAll';
import CardLoader from '../../cardLoader/cardLoader.index';
import { appPath } from '../../../../../app/app.routes';
import { StatusTag } from '../../../../../../shared/components';

const ExpenseRejectedCard = (props: any) => {
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
    getViolationTitleWithIcons,
  } = props;
  const allData = dashboardData[DASHBOARD_CARD_TYPES.rejectedClaims];
  if (cardLoader.approvedBenefit) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.rejectedClaims} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.rejectedClaims}
        >
          {data.map((dataItem: any, index: number) =>
            dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.submitted.linkTo}expense`}
                type={DASHBOARD_CARD_TYPES.rejectedClaims}
                status='REJCTD'
              />
            ) : (
              <CardItem
                date={dataItem.date}
                documentType='expense'
                index={index}
                key={index}
                itemId={dataItem.id}
                itemNumber={dataItem.claim_number}
                total_receipt={dataItem.total_attachments}
                remarkType='expense-claims'
                category={
                  dataItem.expense_type_legal_entity?.expense_type.category
                    ?.title
                }
                title={dataItem.expense_type_legal_entity?.expense_type?.title}
                total={data.length}
                amount={dataItem.converted_amount}
                currency={dataItem.converted_amount_currency.currency.code}
                receipt={dataItem.receipt}
                attachments={dataItem.supporting_documents}
                total_comments={dataItem.total_comments}
                _onRemarkAdded={() => _fetchSpecificData('rejectedClaims')}
                closeRemarkOnAdd={true}
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.rejectedClaims, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.rejectedClaims, 'next')
                }
                footerLeft='VIEW DETAILS'
                footerLeftAction={() => openDetailsDrawer(dataItem, 'expense')}
                footerRight={
                  <StatusTag
                    status={dataItem.workflow_status}
                    onStatusClick={() =>
                      handleStatusTagClick(dataItem.id, 'expense')
                    }
                  />
                }
                getViolationTitleWithIcons={
                  getViolationTitleWithIcons
                    ? getViolationTitleWithIcons(dataItem)
                    : null
                }
              />
            ),
          )}
        </CardContainer>
      );
    } else return null;
  }
};

export default ExpenseRejectedCard;
