/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Dispatch } from 'react';
import { HeaderBarWrapper, ErrorBoundary } from '../../shared/components';
// import Tree from 'react-tree-graph';
// import 'react-tree-graph/dist/style.css'
import { Tree } from 'react-d3-tree';
import { ConnectedProps, connect } from 'react-redux';
import {
  getEntityHierarchy,
  getEntityLoader,
} from '../../shared/redux/rootReducer';
// import { fetchEntities } from '../requestTypeConfiguration/requestTypeConfiguration.thunk';
import { useParams } from 'react-router-dom';
import { fetchEntityHierarchy } from './legalEntityListing.thunk';
import { Trans } from '@lingui/macro';
// import { getQueryString } from '../../utils/scroll.utils';
// import { message } from 'antd';

const EntityHierarchy: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchHierarchy,
  hierarchyData,
  // loading,
}) => {
  const param: any = useParams();
  const id = param.id;

  // useEffect(() => {
  //   if (loading) {
  //     message.loading('Loading data', 0);
  //   } else {
  //     message.destroy();
  //   }
  // }, [loading]);

  const getChildren = (uuid: string) =>
    hierarchyData[uuid]?.map((item: any) => {
      return {
        name: item.title,
        uuid: item.uuid,
        _collapsed: hierarchyData[item.uuid] ? false : true,
        has_child: item.has_child,
        children:
          hierarchyData[item.uuid] && item.uuid !== id
            ? getChildren(item.uuid)
            : item.has_child
            ? new Array(1).fill({ name: 'Dummy' })
            : [],
      };
    });

  const children = getChildren(id);

  const params = new URLSearchParams(window.location.search);

  const title = params.get('title');

  const data = {
    name: title || '',
    uuid: id,
    has_child: false,
    _collapsed: false,
    children: children || [],
  };

  const onTreeItemClick = (targetNode: any) => {
    if (
      !targetNode._collapsed &&
      targetNode.has_child &&
      !hierarchyData[targetNode.uuid]
    ) {
      _fetchHierarchy(targetNode.uuid);
    }
  };

  // eslint-disable-next-line no-restricted-globals
  const width = (screen.availWidth - 400) / 2;
  useEffect(() => {
    _fetchHierarchy(id);
  }, []);

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Entity Hierarchy</Trans> }}
        breadcrumbCompVisibility={true}
        breadcrumbCompProps={{
          enableBackBtn: true,
          breadcrumProps: {
            routes: [
              {
                path: '',
                breadcrumbName: title || '',
              },
            ],
          },
        }}
      >
        <div className='legal-entity-listing-container' style={{ padding: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '96%',
              width: '100%',
            }}
          >
            <Tree
              data={data}
              pathFunc='step'
              orientation='vertical'
              initialDepth={1}
              useCollapseData
              translate={{ x: width, y: 50 }}
              // zoomable={false}
              // styles={{ }}
              transitionDuration={0}
              onClick={onTreeItemClick}
              nodeSize={{ x: 200, y: 200 }}
              allowForeignObjects
              nodeLabelComponent={{
                render: <NodeLabel />,
                foreignObjectWrapper: {
                  y: -10,
                  x: 20,
                },
              }}
              // textLayout={{ textAnchor: 'start', x: 20, y: 0 }}
              // separation={{siblings:2,nonSiblings:4}}
              styles={{
                // links: { stroke: 'red', height: '100', background: 'green' },
                nodes: {
                  node: {
                    circle: { stroke: '#1890ff', fill: '#1890ff' },
                    name: { strokeWidth: 1, stroke: '#68737d' },
                  },
                  leafNode: {
                    circle: { stroke: '#1890ff', fill: '#fff' },
                    name: { stroke: '#68737d' },
                  },
                },
              }}
            />
            {/* </div> */}
          </div>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  hierarchyData: getEntityHierarchy(state),
  loading: getEntityLoader(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchHierarchy: (id: string) => dispatch(fetchEntityHierarchy(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(EntityHierarchy);

const NodeLabel: React.FC<{ nodeData?: any }> = ({ nodeData }) => {
  return (
    <div>
      <p
        style={{
          color: '#68737d',
          fontWeight: nodeData._collapsed ? 200 : 800,
          paddingRight: 10,
        }}
      >
        {nodeData.name}
      </p>
      {/* {nodeData._children && 
        <button>{nodeData._collapsed ? 'Expand' : 'Collapse'}</button>
      } */}
    </div>
  );
};
