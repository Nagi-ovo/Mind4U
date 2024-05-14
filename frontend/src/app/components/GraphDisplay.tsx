import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { ElementGroup } from 'cytoscape';

interface GraphProps {
  elements: {
    nodes: Array<{ data: { id: string, [key: string]: any } }>,
    edges: Array<{ data: { source: string, target: string, [key: string]: any } }>
  };
}

const GraphDisplay: React.FC<GraphProps> = ({ elements }) => {
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
              'color': '#000'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': 'data(color)',
              'target-arrow-color': 'data(color)',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'label': 'data(label)'
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
      cy.elements().remove(); // Clear the graph
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

      // Prepare nodes with explicitly set group type
      const preparedNodes = elements.nodes.map(node => ({
        group: 'nodes' as ElementGroup, 
        data: { ...node.data, color: colors[colorIndex++ % colors.length] }
      }));
      cy.add(preparedNodes);

      // Prepare edges with explicitly set group type
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
  }, [elements, cy]); // Dependencies

  return <div ref={cyContainer} className="flex-1" />;
};

export default GraphDisplay;