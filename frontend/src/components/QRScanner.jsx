import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  BrowserMultiFormatReader,
  NotFoundException,
} from "@zxing/library";
import { checkInAttendance } from "../utils/api";

const QRScanner = ({ onSuccess, userId }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const webcamRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const isMounted = useRef(true);
  const scanned = useRef(false); // prevent duplicate scan

  useEffect(() => {
    isMounted.current = true;
    startScan();
    return () => {
      isMounted.current = false;
      stopScan();
    };
  }, []);

  const startScan = () => {
    if (scanning || !webcamRef.current) return;

    const videoElement = webcamRef.current.video;
    if (!videoElement) {
      setErrorMessage("Camera not available.");
      return;
    }

    setScanning(true);
    scanned.current = false;

    codeReader.current.decodeFromVideoDevice(
      undefined,
      videoElement,
      async (result, error) => {
        if (result && !scanned.current) {
          scanned.current = true;
          stopScan();
          const qrData = result.getText();
          console.log("✅ QR Scanned:", qrData);

          try {
            await checkInAttendance(qrData, userId);
            alert("✅ Attendance marked successfully!");
            if (onSuccess && isMounted.current) onSuccess();
          } catch (err) {
            console.error("❌ Attendance failed:", err);
            alert("❌ Failed to mark attendance!");
          }
        }

        if (error && !(error instanceof NotFoundException)) {
          console.warn("QR Scan Error:", error.message);
        }
      }
    );
  };

  const stopScan = () => {
    if (!scanning) return;
    setScanning(false);
    codeReader.current.reset();
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-500">
        Scan QR Code
      </h2>
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 shadow-2xl rounded-xl p-4 md:p-8">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <div className="relative rounded-lg overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
              videoConstraints={{ facingMode: "environment" }}
            />
            <div className="absolute inset-0 border-4 border-indigo-500 rounded-lg pointer-events-none animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-indigo-500 bg-opacity-40 rounded-full p-2 animate-ping"></div>
            </div>
          </div>
        )}
        <p className="text-gray-300 mt-4 text-sm md:text-base">
          Point the camera at a QR code to mark attendance
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
