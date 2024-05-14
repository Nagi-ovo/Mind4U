'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import TextInput from './components/TextInput'; // Adjust path as needed

const GraphDisplay = dynamic(() => import('./components/GraphDisplay'), { ssr: false });

const Home: React.FC = () => {
  const [elements, setElements] = useState<{ nodes: any[], edges: any[] }>({ nodes: [], edges: [] });

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

  return (
    <>
      <Head>
        <title>Text to Graph</title>
      </Head>
      <div className="flex h-screen">
        <TextInput onTextSubmit={handleTextSubmit} />
        <GraphDisplay elements={elements} />
      </div>
    </>
  );
};

export default Home;
