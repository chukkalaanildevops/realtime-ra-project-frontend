import React from 'react';
import TopClaimedAmount from '../topclaimedamount/topClaimedAmount.index';
import CostCentreAnalytics from '../costcentreanalytics/costCentreAnalytics.index';
import CategoryReport from '../categoryreport/categoryReport.index';
import ToalReport from '../totalReport/toalReport.index';
import './maincontainer.index.less';
import ExpenseTypeData from '../../expensetypedata/expenseTypeData.index';

const MainContainer = () => {
  return (
    <div className='maincontainer-1'>
      <div className='child'>
        <div className='child-1'>
          <ToalReport />
        </div>
        <div className='child-2'>
          <CostCentreAnalytics />
        </div>
      </div>
      <br></br>
      <div className='child'>
        <div className='child-3'>
          <CategoryReport />
        </div>
        <div className='child-4'>
          <TopClaimedAmount />
        </div>
      </div>
      <br></br>
      <div className='child-5'>
        <ExpenseTypeData />
      </div>
    </div>
  );
};

export default MainContainer;
