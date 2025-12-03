const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#1890FF', // primary color for all components
      '@link-color': '#1890ff', // link color
      '@success-color': '#52c41a', // success state color
      '@warning-color': '#faad14', // warning state color
      '@error-color': '#f5222d', // error state color
      '@font-size-base': '14px', // major text font size
      '@heading-color': '#4E555C', // heading text color
      '@text-color': '#68737D', // major text color
      '@text-color-secondary': '#84929F', // secondary text color
      '@disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
      '@border-radius-base': '4px', // major border radius
      '@border-color-base': '#d9d9d9', // major border color
      '@box-shadow-base': '0px 4px 12px rgba(0, 0, 0, 0.15)', // major shadow for layers
      '@body-background': '#F5F8FB;',
      '@tabs-horizontal-margin': '0 52px 0 0',
      '@font-family': 'Poppins',
      '@tabs-bar-margin': '0 0 0 0',
    },
  }),
);
