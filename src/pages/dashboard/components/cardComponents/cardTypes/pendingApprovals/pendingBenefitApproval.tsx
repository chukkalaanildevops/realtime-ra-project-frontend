import React from 'react';
import { Button } from 'antd';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import CardLoader from '../../cardLoader/cardLoader.index';
import ShowAll from '../../../showAll/showAll';
import { appPath } from '../../../../../app/app.routes';

import ApproveReject from '../../../approveReject/approveReject';

const PendingBenefitApprovals = (props: any) => {
  const {
    //variables//
    history,
    dashboardData,
    cardLoader,

    //functions//
    onAction,
    setApprovalModal,
    openDetailsDrawer,
    _fetchSpecificData,
    queryString,
  } = props;

  const allData = dashboardData[DASHBOARD_CARD_TYPES.pendingBenefit];
  if (cardLoader.pendingBenefit) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.pendingBenefit} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.pendingBenefit}
        >
          {data.map((dataItem: any, index: number) =>
            dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.approvals.linkTo}benefits/?${queryString}`}
                type={DASHBOARD_CARD_TYPES.pendingBenefit}
              />
            ) : (
              <CardItem
                date={dataItem.date}
                documentType='benefit'
                index={index}
                key={index}
                itemId={dataItem.id}
                itemNumber={dataItem.claim_number}
                userView={
                  <Button
                    type='link'
                    className='user-name'
                    title={
                      dataItem.employee.legal_name || dataItem.employee.name
                    }
                  >
                    {dataItem.employee.legal_name || dataItem.employee.name}
                  </Button>
                }
                remarkType='benefit-claim'
                category={
                  dataItem.benefit_type_legal_entity?.benefit_type.category
                    ?.title
                }
                title={dataItem.benefit_type_legal_entity?.benefit_type?.title}
                total={data.length}
                amount={dataItem.amount}
                currency={dataItem.converted_currency || dataItem.currency}
                receipt={dataItem.receipt}
                attachments={dataItem.supporting_documents}
                total_comments={dataItem.total_comments}
                _onRemarkAdded={() => _fetchSpecificData('pendingBenefit')}
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.pendingBenefit, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.pendingBenefit, 'next')
                }
                footerRight={
                  <ApproveReject
                    type={dataItem.item_type}
                    id={dataItem.id}
                    empId={dataItem.employee.id}
                    setApprovalModal={setApprovalModal}
                    item={dataItem}
                  />
                }
                // footerLeft={
                //   <StatusTag
                //     status={dataItem.workflow_status}
                //     onStatusClick={() =>
                //       handleStatusTagClick(dataItem.id, 'benefit')
                //     }
                //   />
                // }
                footerLeftAction={() =>
                  openDetailsDrawer(
                    {
                      ...dataItem,
                      workflow_status: {
                        code: 'PENDNG',
                        title: 'Pending',
                      },
                    },
                    'benefit',
                  )
                }
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

export default PendingBenefitApprovals;
