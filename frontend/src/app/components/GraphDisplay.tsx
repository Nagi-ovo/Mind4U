import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { ElementGroup } from 'cytoscape';

interface GraphProps {
  elements: {
    nodes: Array<{ data: { id: string, [key: string]: any } }>,
    edges: Array<{ data: { source: string, target: string, [key: string]: any } }>
  };
  theme: string; // Add theme prop
  toggleTheme: () => void; // Add toggleTheme prop
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
      const colors = [
        "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
        "#B5EAD7", "#ECC5FB", "#FFC3A0", "#FF9AA2", "#FFDAC1",
        "#E2F0CB", "#B5EAD7", "#C7CEEA", "#FFB7B2", "#FF9AA2",
        "#FFDAC1", "#C7CEEA", "#FFB3BA", "#FFDFBA", "#FFFFBA",
        "#BAFFC9", "#BAE1FF", "#FFC3A0", "#FF9AA2", "#FFDAC1",
        "#E2F0CB", "#B5EAD7", "#C7CEEA", "#FFB7B2", "#FF9AA2",
        "#FFDAC1", "#C7CEEA", "#FFB3BA", "#FFDFBA", "#FFFFBA",
        "#BAFFC9", "#BAE1FF", "#FFC3A0", "#FF9AA2", "#FFDAC1",
        "#E2F0CB", "#B5EAD7", "#C7CEEA", "#FFB7B2", "#FF9AA2",
        "#FFDAC1", "#C7CEEA", "#FFB3BA", "#FFDFBA", "#FFFFBA",
        "#BAFFC9", "#BAE1FF", "#FFC3A0", "#FF9AA2", "#FFDAC1"
      ];
      let colorIndex = 0;

      const preparedNodes = elements.nodes.map(node => ({
        group: 'nodes' as ElementGroup, 
        data: { ...node.data, color: colors[colorIndex++ % colors.length] }
      }));
      cy.add(preparedNodes);

      const preparedEdges = elements.edges.filter(edge =>
        edge.data && edge.data.source && edge.data.target &&
        cy.getElementById(edge.data.source).length > 0 &&
        cy.getElementById(edge.data.target).length > 0
      ).map(edge => ({
        group: 'edges' as ElementGroup,
        data: { ...edge.data, color: colors[colorIndex++ % colors.length] }
      }));
      cy.add(preparedEdges);

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
