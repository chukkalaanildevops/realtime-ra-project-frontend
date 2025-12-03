import React, { memo, FC, useMemo } from 'react';
// import { Document, Page } from 'react-pdf';
// import { Button } from 'antd';
import {
  FilePdfFilled,
  // LeftOutlined,
  // RightOutlined
} from '@ant-design/icons';

import { IPDFPageProps, IPDFDocumentProps } from '../../model';

import { isPdfFile } from '../../../utils/global.utils';

import './pdfViewer.index.less';

const PDFViewer: FC<{
  file: File | string;
  documentProps?: IPDFDocumentProps;
  pageProps?: IPDFPageProps;
  showPagination?: boolean;
  showPdfIcon?: boolean;
}> = props => {
  const { file, showPdfIcon = true } = props;
  // const { file, documentProps, pageProps, showPagination = true } = props;

  // const [getNavigationVisiblity, setNavigationVisiblity] = useState<boolean>(
  //   false,
  // );
  // const [numPages, setNumPages] = useState<number | null>(null);
  // const [pageNumber, setPageNumber] = useState<number>(1);

  const _isPdfFile: boolean = useMemo(() => isPdfFile(file), [file]);

  // const onDocumentLoadSuccess = ({ numPages }: any) => {
  //   setNumPages(numPages);
  //   if (numPages > 1) setNavigationVisiblity(true);
  // };

  // const handlePrev = () => {
  //   setPageNumber(num => --num);
  // };

  // const handleNext = () => {
  //   setPageNumber(num => ++num);
  // };

  if (!_isPdfFile) {
    // return <div className='pdf-viewer'>Error!!.. File type is not pdf</div>;
    console.error('PDFVIEWER :: File is not type of pdf');
    return null;
  }

  return (
    <div className={`pdf-viewer ${showPdfIcon ? 'icon-only' : ''}`}>
      {/* <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={() => setNavigationVisiblity(false)}
        onSourceError={() => setNavigationVisiblity(false)}
        {...documentProps}
        renderMode='svg'
      >
        <Page
          pageNumber={pageNumber}
          onLoadError={() => setNavigationVisiblity(false)}
          onRenderError={() => setNavigationVisiblity(false)}
          {...pageProps}
          renderAnnotationLayer={false}
          height={360}
        />
      </Document>
      {showPagination && getNavigationVisiblity ? (
        <div className='pdf-navigation'>
          <p>
            <Button onClick={handlePrev} disabled={pageNumber === 1}>
              <LeftOutlined />
            </Button>{' '}
            Page {pageNumber} of {numPages}{' '}
            <Button onClick={handleNext} disabled={pageNumber === numPages}>
              <RightOutlined />
            </Button>
          </p>
        </div>
      ) : null} */}
      {showPdfIcon ? (
        <FilePdfFilled className='responsive-icon' />
      ) : (
        <div className='container'>
          <iframe
            src={
              typeof file === 'string' ? file : window.URL.createObjectURL(file)
            }
            className='document responsive-iframe'
            title='sjkd'
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default memo(PDFViewer);
