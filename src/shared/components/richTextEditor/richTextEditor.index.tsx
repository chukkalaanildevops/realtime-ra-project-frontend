import React, { FC, CSSProperties } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

const RichTextEditor: FC<{
  value?: string;
  onChange?: (value: string) => void;
  inlineStyle?: CSSProperties;
  placeholder?: string;
}> = props => {
  const { value = '', onChange, inlineStyle, placeholder } = props;
  // const [getVal, setVal] = useState<any>(value || '');

  // useEffect(() => {
  //   setVal(value || '');
  // }, [value]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link'],
      // ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    // 'image',
  ];

  return (
    <ReactQuill
      theme='snow'
      style={{ minHeight: '100px', ...inlineStyle }}
      placeholder={
        placeholder !== undefined ? placeholder : 'Instruction Text.......'
      }
      modules={modules}
      formats={formats}
      value={value}
      onChange={e => onChange && onChange(e)}
      // onBlur={() => changeFn(getVal)}
    />
  );
};

export default RichTextEditor;
