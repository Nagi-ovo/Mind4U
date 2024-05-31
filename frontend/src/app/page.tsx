'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import TextInput from './components/TextInput'; // Adjust path as needed
import ThemeToggleButton from './components/ThemeToggleButton'; // Import the new component

const GraphDisplay = dynamic(() => import('./components/GraphDisplay'), { ssr: false });

const Home: React.FC = () => {
  const [elements, setElements] = useState<{ nodes: any[], edges: any[] }>({ nodes: [], edges: [] });
  const [theme, setTheme] = useState('light'); // Default theme is light
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(preferredTheme);
    setIsClient(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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
      .then(data => setElements({ nodes: data.nodes || [], edges: data.edges || [] }))
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
      <div className={`flex h-screen overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
        <div className={`flex-1 flex flex-col p-4 m-4 rounded-lg shadow-lg overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h2 className="text-2xl font-bold mb-4">Text Input</h2>
          <TextInput onTextSubmit={handleTextSubmit} theme={theme} />
        </div>
        <div className={`flex-1 p-4 m-4 rounded-lg shadow-lg overflow-hidden relative ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
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

