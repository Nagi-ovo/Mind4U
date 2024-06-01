import React, { useRef, useEffect } from 'react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  theme: string; // Add theme prop
  defaultText?: string; // Add defaultText prop
}

const TextInput: React.FC<TextInputProps> = ({ onTextSubmit, theme, defaultText }) => {
  const textRef = useRef<HTMLDivElement>(null);

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const inputContent = textRef.current?.innerText || '';

    if (event.nativeEvent instanceof InputEvent) {
      if (event.nativeEvent.inputType === 'insertParagraph' || (event.nativeEvent.inputType === 'insertText' && event.nativeEvent.data?.endsWith('.'))) {
        onTextSubmit(inputContent);
      }
    }
  };

  useEffect(() => {
    if (textRef.current) {
      textRef.current.focus();
      // 设置默认输入例子
      if (defaultText) {
        textRef.current.innerText = defaultText;
      }
    }
  }, [defaultText]);

  return (
    <div
      ref={textRef}
      contentEditable={true}
      className={`flex-1 p-4 text-lg border rounded-lg overflow-auto whitespace-pre-wrap outline-none transition-colors duration-1000 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} ${theme === 'light' ? 'text-black' : 'text-white'}`}
      onInput={handleInput}
      suppressContentEditableWarning={true}
    />
  );
};

export default TextInput;
