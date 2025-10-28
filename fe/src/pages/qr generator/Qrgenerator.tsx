import React, { useState } from "react";
import axios from "axios";

const Qrgenerator: React.FC = () => {
  const [data, setData] = useState<string>("");
  const [qrImageUrl, setQrImageUrl] = useState<string>("");

  const generateQR = async () => {
    if (!data.trim()) {
      alert("Please enter some data!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/generateQR", { data });
      setQrImageUrl(response.data.qrImageUrl);
    } catch (error) {
      console.error("Error generating QR:", error);
      alert("Failed to generate QR code");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h1>Backend QR Code Generator</h1>

      <input
        type="text"
        placeholder="Enter data for QR"
        value={data}
        onChange={(e) => setData(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "300px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={generateQR}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      >
        Generate QR
      </button>

      {qrImageUrl && (
        <div style={{ textAlign: "center" }}>
          <h3>Generated QR Code:</h3>
          <img src={qrImageUrl} alt="QR Code" width={250} height={250} />
        </div>
      )}
    </div>
  );
};

export default Qrgenerator;
