import React, { FC, useState, DragEvent, ReactNode } from 'react';
import { Row, Col } from 'antd';
import { customObjInterface } from '../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';
import { Trans } from '@lingui/macro';

export const Droppable: FC<{
  data: customObjInterface[];
  dropId: number;
  droppedItem: customObjInterface[];
  updateState: Function;
  updateDragState: React.Dispatch<React.SetStateAction<string>>;
  dragState: string;
}> = props => {
  const {
    updateState,
    children,
    droppedItem,
    dropId,
    updateDragState,
    dragState,
  } = props;
  const onDropHandler = (
    droppedItem: customObjInterface[],
    e: DragEvent<HTMLDivElement>,
  ) => {
    // const _e = { ...e };
    e.preventDefault();
    if (droppedItem.length < 3) {
      // this condition allow only 3 elements in a single drop.
      const target = (e.currentTarget || e.target) as HTMLDivElement;
      const dragItemId = String(e.dataTransfer.getData('dragId'));
      const dragItemTitle = String(e.dataTransfer.getData('dragTitle'));
      const isSameDrop: boolean = droppedItem.some(
        (o: customObjInterface) => o.title === dragItemId,
      );

      if (!isSameDrop) {
        // this condition checks thats if the drag elem is droppes on same elem of not.

        if (dragItemId) {
          updateState(
            dragItemTitle,
            {
              row: Number(target.id),
              col: droppedItem.length + 1,
            },
            droppedItem,
            dragItemId,
          );
        } else {
          updateState(
            dragItemTitle,
            {
              row: Number(target.id),
              col: droppedItem.length + 1,
            },
            droppedItem,
          );
        }
      }
    }
    updateDragState('');
  };
  const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // const _e = { ...e };
  };

  const droppableStyle = {
    // padding: '0.5rem 0',
    margin: ' 0',
    display: 'flex',
    width: '100%',
    borderRadious: '5px',
    minHeight: '90px',
    border: 'none',
  };

  return (
    <Row>
      <div
        id={String(dropId)}
        className='drop'
        style={droppableStyle}
        onDrop={onDropHandler.bind(null, droppedItem)}
        onDragOver={onDragOverHandler}
      >
        {children ? (
          children
        ) : dragState === 'dragging' ? (
          <div
            style={{
              textAlign: 'center',
              display: 'block',
              width: '100%',
              opacity: '0.5',
              pointerEvents: 'none',
            }}
          >
            <Trans>New Line</Trans>
          </div>
        ) : null}
      </div>
    </Row>
  );
};

export const Draggable: React.FC<{
  data: customObjInterface[];
  item: customObjInterface;
  updateState: Function;
  siblingLenght: number;
  updateDragState: React.Dispatch<React.SetStateAction<string>>;
  dragState: string;
  children: ReactNode;
}> = props => {
  const { dragState, item, updateDragState, siblingLenght, children } = props;

  const [getDragInfo, setDragInfo] = useState<string>('');
  const onDragStartHandler = (title: string, e: DragEvent<HTMLDivElement>) => {
    // const _e = { ...e };
    const target = e.target as HTMLDivElement;
    item.id && e.dataTransfer.setData('dragId', String(item.id));

    e.dataTransfer.setData('dragTitle', title);
    setTimeout(() => {
      target.style.display = 'none';
    }, 0);
    updateDragState('dragging');
    setDragInfo(target.id);
  };
  const onDragEndHandler = (e: DragEvent<HTMLDivElement>) => {
    // const _e = { ...e };
    const target = e.target as HTMLDivElement;
    setTimeout(() => {
      target.style.display = 'block';
    }, 0);
    updateDragState('');
    setDragInfo('');
  };
  const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const draggableStyle = {
    // background: '#c5d2d63b',
    // padding: '0.5rem',
    // margin: '0.2rem',
    cursor: 'move',
    // borderRadius: '5px',
    // boxShadow: '#000000 1px 1px 4px -3px',
  };
  const _clsNm =
    dragState === 'dragging' && getDragInfo !== item.title
      ? 'drag no-pointer-events'
      : 'drag';
  return (
    <Col span={Math.floor(24 / siblingLenght)}>
      <div
        id={item.title}
        className={_clsNm}
        style={draggableStyle}
        draggable='true'
        onDragStart={onDragStartHandler.bind(null, item.title)}
        onDragEnd={onDragEndHandler}
        onDragOver={onDragOverHandler}
      >
        {children ? children : `< ${item.title} >`}
      </div>
    </Col>
  );
};
