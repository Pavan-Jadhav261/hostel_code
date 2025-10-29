import React, { useState } from "react";
import axios from "axios";

const Qrgenerator: React.FC = () => {
 
  const [qrImageUrl, setQrImageUrl] = useState<string>("");

  const generateQR = async () => {
  
    try {
      const response = await axios.post("https://hostel-code.onrender.com/generateQR");
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
        justifyContent:"center",
        marginTop: "50px",
        height:"screen",
        width : "full"
      }}
    >
      <h1>Backend QR Code Generator</h1>


      <button
        onClick={generateQR}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "20px",
          border: "solid 1px black",
          borderRadius : "10px"
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
