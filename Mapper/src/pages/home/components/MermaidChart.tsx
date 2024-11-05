import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

const MermaidChart: React.FC = () => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mermaidRef.current) {
      // Initialize mermaid
      mermaid.initialize({ startOnLoad: true });
      // Render the mermaid chart
      mermaid.contentLoaded();
    }
  }, []);

  const mermaidDiagram = `
    flowchart LR
    Table1["Table 1"]
   

    Table1:::table
    Table2:::table
    Table5:::table
    Table4:::table

    classDef table fill:#fff9f9,stroke:#0000aa,stroke-width:1px,cornerRadius:5px;

    subgraph Table1 [Table 1]
        T1C1["Col1"]
        T1C2["Col2"]
        T1C3["Col3"]
    end

    subgraph Table2 [Table 2]
        T2C1["Col1"]
    end

    subgraph Table5 [Table 5]
        T5C1["Col5"]
    end

    subgraph Table4 [Table 4]
        T4C1["Col4"]
    end

    T1C1 --> T2C1
    T1C2 --> T5C1
    T1C3 --> T4C1
  `;

  return (
    <div ref={mermaidRef}>
      <div className="mermaid">
        {mermaidDiagram}
      </div>
    </div>
  );
};

export default MermaidChart;
