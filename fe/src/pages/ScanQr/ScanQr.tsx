import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";
import axios from "axios";

const ScanQr: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string>("");
  const scannerId = "qr-reader";

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(scannerId);
    let isScannerRunning = false;
    let hasScanned = false; // 👈 Prevents multiple triggers

    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: { width: 300, height: 300 },
    };

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          setError("No cameras found");
          return;
        }

        const cameraId = devices[0].id;

        await html5QrCode.start(
          { deviceId: { exact: cameraId } },
          config,
          async (decodedText) => {
            if (hasScanned) return; // 👈 Ignore subsequent scans
            console.log("Decoded text:", decodedText);
            setScannedData(decodedText);

            if (decodedText === "https://hostel-code.onrender.com/outing") {
              hasScanned = true; // 👈 Lock further scans
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
    
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-xl font-bold mb-4">QR Code Scanner</h1>
      {error && <p className="text-red-600">{error}</p>}

      <div className="rounded-xl overflow-hidden mr-16">
        <div id={scannerId} className="w-[300px] h-[300px]" />
      </div>

      {scannedData && (
        <p className="mt-4 text-sm text-gray-700">
          Scanned Data: <strong>{scannedData}</strong>
        </p>
      )}
    </div>
  );
};

export default ScanQr;
