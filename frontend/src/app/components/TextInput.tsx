import React, { useRef, useEffect } from 'react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onTextSubmit }) => {
  const textRef = useRef<HTMLDivElement>(null);

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    // retrieve the content of the text input 
    const inputContent = textRef.current?.innerText || '';

    // check if the user has pressed enter
    if (event.nativeEvent instanceof InputEvent) {
      if (event.nativeEvent.inputType === 'insertParagraph' || (event.nativeEvent.inputType === 'insertText' && event.nativeEvent.data?.endsWith('.'))) {
        onTextSubmit(inputContent);
      }
    }
  };

  useEffect(() => {
    if (textRef.current) {
      textRef.current.focus(); // focus text input when the component is mounted 
    }
  }, []);

  return (
    <div
      ref={textRef}
      contentEditable={true}
      className="flex-1 p-10 text-4xl border-r border-gray-300 overflow-auto whitespace-pre-wrap outline-none"
      onInput={handleInput}
      suppressContentEditableWarning={true}
    />
  );
};

export default TextInput;
