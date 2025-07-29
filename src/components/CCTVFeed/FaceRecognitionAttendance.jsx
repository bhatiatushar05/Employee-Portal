import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FaceRecognitionAttendance = ({ onCheckInOut }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle, detecting, success, fail
  const [liveness, setLiveness] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      setLoading(false);
    };
    loadModels();
  }, []);

  // Start webcam
  useEffect(() => {
    if (!loading) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
      });
    }
  }, [loading]);

  // Face detection loop
  useEffect(() => {
    let interval;
    if (!loading) {
      interval = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          );
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.matchDimensions(canvasRef.current, {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          });
          const resized = faceapi.resizeResults(detections, {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          });
          faceapi.draw.drawDetections(canvasRef.current, resized);
          setStatus(detections.length > 0 ? 'success' : 'fail');
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Dummy liveness simulation (blink button)
  const handleLiveness = () => {
    setLiveness(true);
    setTimeout(() => setLiveness(false), 1000);
  };

  // Check In/Out handler
  const handleCheckInOut = () => {
    if (status === 'success') {
      // Capture photo
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const photo = canvas.toDataURL('image/png');
      onCheckInOut(photo);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden mb-6 flex flex-col items-center p-4">
      <div className="relative w-full max-w-md aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width="100%"
          height="auto"
          className="rounded-lg shadow-lg"
          style={{ width: '100%', height: 'auto' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          width={videoRef.current?.videoWidth || 640}
          height={videoRef.current?.videoHeight || 360}
        />
        <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold"
          style={{ background: status === 'success' ? '#22c55e' : '#ef4444', color: 'white' }}>
          {status === 'success' ? 'Face Detected' : 'No Face'}
        </div>
      </div>
      <button
        onClick={handleLiveness}
        className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500"
      >
        Simulate Blink (Liveness)
      </button>
      <button
        onClick={handleCheckInOut}
        disabled={status !== 'success'}
        className="mt-12 px-9 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
      >
        Tap to Check In/Out
      </button>
      {liveness && <div className="mt-2 text-green-500 font-bold">Liveness Detected!</div>}
    </div>
  );
};

export default FaceRecognitionAttendance; 