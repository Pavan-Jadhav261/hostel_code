import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";
import axios from "axios";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";

const ScanQr: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string>("");
  const scannerId = "qr-reader";
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login first");
      navigate("/");
      return;
    }

    const html5QrCode = new Html5Qrcode(scannerId);
    let isScannerRunning = false;
    let hasScanned = false;

    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: { width: 300, height: 300 },
    };

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, // rear camera
          config,
          async (decodedText) => {
            if (hasScanned) return;
            console.log("Decoded text:", decodedText);
            setScannedData(decodedText);

            if (decodedText === "https://hostel-code.onrender.com/outing") {
              hasScanned = true;
              console.log("Match found, stopping scanner...");

              try {
                await html5QrCode.stop();
                isScannerRunning = false;

                const token = localStorage.getItem("token");
                await axios.post(decodedText, {}, {
                  headers: { token },
                });
                console.log("POST request sent successfully");
              } catch (err) {
                console.error("Error:", err);
                setError("Failed to send request");
              }
            }
          },
          (err) => console.log("Scanning...", err)
        );

        console.log("Camera started");
        isScannerRunning = true;
      } catch (err: any) {
        console.error("Error starting scanner:", err);
        setError(err.message || "Unknown error");
      }
    };

    startScanner();

    return () => {
      if (isScannerRunning) {
        html5QrCode.stop().then(() => console.log("Camera stopped on cleanup"));
      }
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen mb-30">
      <h1 className="text-xl font-bold mb-4">QR Code Scanner</h1>
      {error && <p className="text-red-600">{error}</p>}

      <div id={scannerId} className="w-[320px] h-80" />

      {scannedData && (
        <p className="mt-4 text-sm text-gray-700">
          Scanned Data: <strong>{scannedData}</strong>
        </p>
        
      )}
        <Button
        text="Logout"
        varient="secondary"
        OnClick={() => {
          localStorage.clear();
          navigate("/");
        }}
        isClickAble={true}
      />
    
     
    </div>
  );
};

export default ScanQr;
