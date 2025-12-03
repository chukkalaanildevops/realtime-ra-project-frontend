import React from 'react';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import ShowAll from '../../../showAll/showAll';
import CardLoader from '../../cardLoader/cardLoader.index';

import { appPath } from '../../../../../app/app.routes';

const ExpenseDraftCard = (props: any) => {
  const {
    // variables //
    history,
    dashboardData,
    cardLoader,
    // functions //
    onAction,
    openDetailsDrawer,
    _fetchSpecificData,
    _sendExpensesForApproval,
    getViolationTitleWithIcons,
  } = props;
  const allData = dashboardData[DASHBOARD_CARD_TYPES.draftExpense];
  if (cardLoader.draftExpense) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.draftExpense} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.draftExpense}
        >
          {data.map((dataItem: any, index: number) => {
            return dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.drafts.linkTo}expense`}
                type={DASHBOARD_CARD_TYPES.draftExpense}
              />
            ) : (
              <CardItem
                date={dataItem.date}
                documentType='expense'
                index={index}
                key={index}
                category={dataItem.category.title}
                itemId={dataItem.id}
                itemNumber={dataItem.claim_number}
                remarkType='expense-claims'
                title={dataItem.title}
                total={data.length}
                amount={dataItem.converted_amount}
                currency={dataItem.currency_code}
                receipt={dataItem.receipt}
                total_receipt={dataItem.total_attachments}
                attachments={dataItem.supporting_documents}
                total_comments={dataItem.total_comments}
                isFooterRightEnable={dataItem?.is_submittable}
                _onRemarkAdded={() => _fetchSpecificData('draftExpense')}
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.draftExpense, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.draftExpense, 'next')
                }
                footerRightAction={() => _sendExpensesForApproval(dataItem)}
                getViolationTitleWithIcons={
                  getViolationTitleWithIcons
                    ? getViolationTitleWithIcons(dataItem)
                    : null
                }
                footerLeftAction={() => openDetailsDrawer(dataItem, 'expense')}
              />
            );
          })}
        </CardContainer>
      );
    } else {
      return null;
    }
  }
};
export default ExpenseDraftCard;
