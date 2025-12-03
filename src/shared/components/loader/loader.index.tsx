import React, { FC } from 'react';
import { Spin } from 'antd';
import './loader.index.less';

const Loader: FC<{
  loaderClass?: string;
  loadingName?: string;
}> = props => {
  const { loaderClass, loadingName } = props;

  let LoaderTip = loadingName ? loadingName : '';
  let classname = loaderClass ? loaderClass : 'Loader-class';

  return (
    <div className={classname}>
      <Spin tip={LoaderTip}></Spin>
    </div>
  );
};

export default Loader;
