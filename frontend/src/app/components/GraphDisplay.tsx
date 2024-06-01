import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { ElementGroup } from 'cytoscape';

interface GraphProps {
  elements: {
    nodes: Array<{ data: { id: string, color: string, [key: string]: any } }>,
    edges: Array<{ data: { source: string, target: string, color: string, [key: string]: any } }>
  };
  theme: string;
  toggleTheme: () => void;
}

const GraphDisplay: React.FC<GraphProps> = ({ elements, theme, toggleTheme }) => {
  const cyContainer = useRef<HTMLDivElement>(null);
  const [cy, setCy] = useState<cytoscape.Core>();

  useEffect(() => {
    if (!cy && cyContainer.current) {
      const newCy = cytoscape({
        container: cyContainer.current,
        elements: [],
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              'label': 'data(label)',
              'color': theme === 'light' ? '#000' : '#FFF'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': 'data(color)',
              'target-arrow-color': 'data(color)',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'label': 'data(label)',
              'color': theme === 'light' ? '#000' : '#FFF'
            }
          }
        ],
        layout: {
          name: 'cose',
          fit: true,
          animate: true,
          animationDuration: 1000,
          animationEasing: 'ease-in-out'
        }
      });
      setCy(newCy);
    }

    if (cy) {
      cy.elements().remove();
      cy.add(elements.nodes);
      cy.add(elements.edges);
      cy.layout({ name: 'grid' }).run();
    }
  }, [elements, cy, theme]);

  useEffect(() => {
    if (cy) {
      cy.style()
        .selector('node')
        .style({
          'color': theme === 'light' ? '#000' : '#FFF'
        })
        .update();

      cy.style()
        .selector('edge')
        .style({
          'color': theme === 'light' ? '#000' : '#FFF'
        })
        .update();
    }
  }, [theme, cy]);

  return (
    <div className={`relative flex-1 h-full rounded-lg shadow-lg transition-colors duration-1000 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
      <div ref={cyContainer} className="absolute inset-0" />
    </div>
  );
};

export default GraphDisplay;
