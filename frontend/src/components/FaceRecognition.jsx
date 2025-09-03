import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "user",
};

const FaceRecognition = ({ onSuccess }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const capture = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    // Ensure webcam is ready
    if (!webcamRef.current || !webcamRef.current.getScreenshot) {
      setError("⚠️ Webcam not accessible.");
      setLoading(false);
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    try {
      // 🔒 Send to backend for verification (replace URL with your real endpoint)
      const response = await fetch("/api/verify-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        onSuccess(); // Callback to parent
      } else {
        setError(data.message || "Face not recognized.");
      }
    } catch (err) {
      console.error("Error verifying face:", err);
      setError("Something went wrong during verification.");
    } finally {
      setLoading(false);
    }
  }, [webcamRef, onSuccess]);

  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-500">
        Face Recognition
      </h2>
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 shadow-2xl rounded-xl p-4 md:p-8">
        <div className="webcam-container relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg w-full h-auto"
          />
          <div className="webcam-overlay absolute inset-0 border-4 border-indigo-500 rounded-lg pointer-events-none animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-indigo-500 bg-opacity-50 rounded-full p-2 animate-ping"></div>
          </div>
        </div>
        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 md:py-3 md:px-6 rounded-lg text-sm md:text-lg transition-transform hover:scale-105 hover:bg-blue-500 shadow-lg"
          onClick={capture}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Capture and Verify"}
        </button>
        {error && (
          <p className="text-red-500 mt-4 text-sm md:text-base">{error}</p>
        )}
        {success && (
          <p className="text-green-500 mt-4 text-sm md:text-base">
            Face Verified Successfully ✅
          </p>
        )}
        <p className="text-gray-300 mt-4 text-sm md:text-base">
          Align your face within the frame
        </p>
      </div>
    </div>
  );
};

export default FaceRecognition;
