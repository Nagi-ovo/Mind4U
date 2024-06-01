import React, { useRef, useEffect } from 'react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  theme: string;
  defaultText?: string;
  highlightData: {
    nodes: Array<{ data: { label: string, color: string } }>,
    edges: Array<{ data: { label: string, color: string } }>
  };
  inputText: string;
}

const TextInput: React.FC<TextInputProps> = ({ onTextSubmit, theme, defaultText, highlightData, inputText }) => {
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
      if (defaultText) {
        textRef.current.innerText = defaultText;
      }
    }
  }, [defaultText]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.innerText = inputText;
      highlightText(textRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightData, inputText]);

  const highlightText = (element: HTMLElement) => {
    let content = element.innerText;
    highlightData.nodes.forEach(node => {
      const regex = new RegExp(`(${node.data.label})`, 'gi');
      content = content.replace(regex, `<span style="background-color: ${node.data.color};">$1</span>`);
    });
    highlightData.edges.forEach(edge => {
      const regex = new RegExp(`(${edge.data.label})`, 'gi');
      content = content.replace(regex, `<span style="background-color: ${edge.data.color};">$1</span>`);
    });
    element.innerHTML = content;
  };

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
