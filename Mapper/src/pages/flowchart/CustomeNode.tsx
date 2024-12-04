interface CustomNodeProps {
  data: {
    label1: string;
    label2: string;
  };
}

const CustomNode = ({ data }: CustomNodeProps) => {
  return (
    <div
      style={{
        padding: "10px",
        textAlign: "center",
        width: "150px",
      }}
    >
      {/* First Label */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "14px",
          marginBottom: "3px",
          color: "#333",
        }}
      >
        {data.label1}
      </div>

      {/* Second Label */}
      <div
        style={{
          fontSize: "14px",
          color: "#222",
        }}
      >
        {data.label2}
      </div>
    </div>
  );
};

export default CustomNode;
