'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import TextInput from './components/TextInput'; // Adjust path as needed
import ThemeToggleButton from './components/ThemeToggleButton'; // Import the new component

const GraphDisplay = dynamic(() => import('./components/GraphDisplay'), { ssr: false });

const defaultElements = {
  nodes: [
    {'data': {'id': '1', 'label': '王比', 'color': '#FFB3BA'}},
    {'data': {'id': '2', 'label': '男孩', 'color': '#FFDFBA'}},
    {'data': {'id': '3', 'label': '篮球', 'color': '#FFFFBA'}},
    {'data': {'id': '4', 'label': '科比', 'color': '#BAFFC9'}},
    {'data': {'id': '5', 'label': '黑曼巴', 'color': '#BAE1FF'}}
  ],
  edges: [
    {'data': {'source': '1', 'target': '2', 'label': '性别', 'color': '#B5EAD7'}},
    {'data': {'source': '1', 'target': '3', 'label': '喜欢', 'color': '#ECC5FB'}},
    {'data': {'source': '1', 'target': '4', 'label': '偶像', 'color': '#FFC3A0'}},
    {'data': {'source': '4', 'target': '5', 'label': '绰号', 'color': '#FF9AA2'}}
  ]
}; // default JSON result

const defaultText = "有一个叫王比的男孩，他非常喜欢打篮球，他的偶像是科比-黑曼巴。"; // default example

const Home: React.FC = () => {
  const [elements, setElements] = useState<{ nodes: any[], edges: any[] }>(defaultElements); // 使用默认的知识图谱 JSON 结果
  const [theme, setTheme] = useState('light'); // Default theme is light
  const [isClient, setIsClient] = useState(false);
  const [inputText, setInputText] = useState(defaultText);

  useEffect(() => {
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(preferredTheme);
    setIsClient(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.add('transition-colors', 'duration-500'); // 添加过渡效果
  }, [theme]);

  const handleTextSubmit = async (text: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/update_graph`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    })
      .then(response => response.json())
      .then(data => {
        if (data.text && data.graph) {
          setInputText(data.text); // 设置压缩后的文本内容
          setElements({ nodes: data.graph.nodes || [], edges: data.graph.edges || [] });
        } else if (data.text) {
          setInputText(data.text); // 设置压缩后的文本内容
        } else if (data.graph) {
          setElements({ nodes: data.graph.nodes || [], edges: data.graph.edges || [] });
        }
      })
      .catch(err => console.error('Failed to fetch graph data:', err));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (!isClient) {
    return null; // Avoid rendering on the server side
  }

  return (
    <>
      <Head>
        <title>Text to Graph</title>
      </Head>
      <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
        <div className={`flex-1 flex flex-col p-4 m-4 rounded-lg shadow-lg overflow-hidden transition-colors duration-500 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h2 className="text-2xl font-bold mb-4">Text Input</h2>
          <TextInput onTextSubmit={handleTextSubmit} theme={theme} defaultText={defaultText} highlightData={elements} inputText={inputText} />
        </div>
        <div className={`flex-1 p-4 m-4 rounded-lg shadow-lg overflow-hidden relative transition-colors duration-500 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h2 className="text-2xl font-bold mb-4">Graph Display</h2>
          <GraphDisplay elements={elements} theme={theme} toggleTheme={toggleTheme} />
        </div>
        <div className="absolute top-8 right-8"> {/* Adjust the top and right padding */}
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </>
  );
};

export default Home;
