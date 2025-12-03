import React from 'react';
import { Button } from 'antd';
import { DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import CardContainer from '../../cardContainer/cardContainer';
import CardItem from '../../cardItem/cardItem';
import CardLoader from '../../cardLoader/cardLoader.index';
import ShowAll from '../../../showAll/showAll';
import { appPath } from '../../../../../app/app.routes';

import ApproveReject from '../../../approveReject/approveReject';

const PendingRequestApprovals = (props: any) => {
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

  const allData = dashboardData[DASHBOARD_CARD_TYPES.pendingRequest];
  if (cardLoader.pendingRequest) {
    return <CardLoader title={DASHBOARD_CARD_TYPES.pendingRequest} />;
  } else {
    if (allData?.data?.length > 0) {
      const data = allData.data.slice(0, 3);
      return (
        <CardContainer
          cardCount={data.length}
          count={allData.total_records}
          title={DASHBOARD_CARD_TYPES.pendingRequest}
        >
          {data.map((dataItem: any, index: number) =>
            dataItem.showAllCard ? (
              <ShowAll
                history={history}
                onAction={onAction}
                index={index}
                navigate={`${appPath.approvals.linkTo}requests/?${queryString}`}
                type={DASHBOARD_CARD_TYPES.pendingRequest}
              />
            ) : (
              <CardItem
                date={`${dataItem.start_date} - ${dataItem.end_date}`}
                itemNumber={dataItem.request_no}
                index={index}
                key={index}
                itemId={dataItem.id}
                userView={
                  <Button type='link'>
                    {dataItem.employee.legal_name || dataItem.employee.name}
                  </Button>
                }
                remarkType='requests'
                category={
                  dataItem.request_type_legal_entity.is_travel_type
                    ? 'Travel'
                    : 'General'
                }
                title={dataItem.request_type_legal_entity.title}
                total={data.length}
                total_comments={dataItem.total_comments}
                _onRemarkAdded={() => _fetchSpecificData('pendingRequest')}
                attachments={dataItem.attachments}
                documentType='request'
                onPrevClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.pendingRequest, 'prev')
                }
                onNextClick={() =>
                  onAction(DASHBOARD_CARD_TYPES.pendingRequest, 'next')
                }
                // footerLeft={
                //   <StatusTag
                //     status={dataItem.workflow_status}
                //     onStatusClick={() =>
                //       handleStatusTagClick(dataItem.id, 'request')
                //     }
                //   />
                // }
                footerRight={
                  <ApproveReject
                    type={dataItem.item_type}
                    id={dataItem.id}
                    empId={dataItem.employee.id}
                    setApprovalModal={setApprovalModal}
                    item={dataItem}
                  />
                }
                footerLeftAction={() =>
                  openDetailsDrawer(
                    {
                      ...dataItem,
                      workflow_status: {
                        code: 'PENDNG',
                        title: 'Pending',
                      },
                    },
                    'request',
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
  //debugger;
};

export default PendingRequestApprovals;
