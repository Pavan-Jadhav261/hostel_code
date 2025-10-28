import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";

const QRScanner: React.FC = () => {
  const [scannedData, setScannedData] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scannerId = "qr-reader";

  // Keep a reference to the Html5Qrcode instance outside of useEffect
  let html5QrCode: Html5Qrcode | null = null;
  let isScannerRunning = false;

  useEffect(() => {
    // Prevent multiple instances
    if (html5QrCode) return;

    html5QrCode = new Html5Qrcode(scannerId);

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
        await html5QrCode!.start(
          { deviceId: { exact: cameraId } },
          config,
          (decodedText) => setScannedData(decodedText),
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
      if (html5QrCode && isScannerRunning) {
        html5QrCode
          .stop()
          .then(() => console.log("Camera stopped"))
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-red-300  w-full h-screen">
      <h1>QR Code Scanner</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="rounded-full w-70 h-70 ">
      <div
        id={scannerId}
        className="w-100 h-100 rounded-full"
      ></div>
      </div>
      <p style={{ marginTop: 20, fontWeight: "bold" }}>Scanned Data: {scannedData || "None yet"}</p>
    </div>
  );
};

export default QRScanner;
