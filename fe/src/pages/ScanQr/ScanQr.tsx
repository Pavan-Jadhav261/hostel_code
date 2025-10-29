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
    let hasScanned = false;

    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, // back camera (works on more devices)
          config,
          async (decodedText) => {
            if (hasScanned) return; // prevent multiple triggers

            console.log("✅ Decoded text:", decodedText);
            setScannedData(decodedText);

            const outingUrl = "http://localhost:3000/outing";

            // Check if scanned URL matches the outing link
            if (decodedText.trim() === outingUrl) {
              hasScanned = true;
              console.log("✅ Match found! Stopping scanner...");
              
              try {
                await html5QrCode.stop();
                console.log("📷 Scanner stopped");

                const token = localStorage.getItem("token");
                const res = await axios.post("https://hostel-code.onrender.com/outing", {}, { headers: { token } });

                console.log("✅ POST success:", res.data);
                alert("Outing marked successfully ✅");
              } catch (err: any) {
                console.error("❌ Error sending request:", err);
                setError("Failed to send request");
              }
            }
          },
          (scanErr) => {
            console.log("Scanning...", scanErr);
          }
        );

        console.log("📷 Camera started");
      } catch (err: any) {
        console.error("❌ Error starting scanner:", err);
        setError(err.message || "Failed to start camera");
      }
    };

    startScanner();

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-50 relative">
      <h1 className="text-xl font-bold mb-4 text-center text-gray-800">
        QR Code Scanner
      </h1>

      {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

      <div
        id={scannerId}
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] border-2 border-gray-300 rounded-xl shadow-md"
      />

      {scannedData && (
        <p className="mt-4 text-sm text-gray-700 text-center break-all px-3">
          Scanned Data: <strong>{scannedData}</strong>
        </p>
      )}

      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
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
    </div>
  );
};

export default ScanQr;
