import { useState, useCallback, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { useAlertStore } from '@/store/alertStore';
import { AlertTriangle } from 'lucide-react';

export const useWebcam = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [eyeAwayCount, setEyeAwayCount] = useState(0);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
    const eyeAwayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { showAlert } = useAlertStore();

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      showAlert({
        title: "Peringatan",
        description: "Pastikan Anda memberikan izin untuk mengakses webcam.",
        icon: AlertTriangle,
        variant: "warning",
      });
    }
  }, [videoRef, showAlert]);

  const stopWebcam = useCallback(() => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
  }, [webcamStream]);

  const startDetection = useCallback(async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");

    const video = videoRef.current;
    if (!video) return;

    detectionInterval.current = setInterval(async () => {
      if (video.readyState !== 4) return;

      const results = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (results.length === 1 && results[0]) {
        const leftEye = results[0].landmarks.getLeftEye();
        const rightEye = results[0].landmarks.getRightEye();

        const getAspectRatio = (eye: faceapi.Point[]) => {
          const width = Math.hypot(eye[3].x - eye[0].x, eye[3].y - eye[0].y);
          const height = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
          return width / height;
        };

        if (leftEye.length >= 6 && rightEye.length >= 6) {
          const arLeft = getAspectRatio(leftEye);
          const arRight = getAspectRatio(rightEye);
          const avg = (arLeft + arRight) / 2;
          const isLooking = avg > 3.0;

          if (!isLooking) {
            if (!eyeAwayTimerRef.current) {
              eyeAwayTimerRef.current = setTimeout(() => {
                setEyeAwayCount((prev) => prev + 1);
                eyeAwayTimerRef.current = null;
              }, 2000);
            }
          } else {
            if (eyeAwayTimerRef.current) {
              clearTimeout(eyeAwayTimerRef.current);
              eyeAwayTimerRef.current = null;
            }
          }
        }
      }
    }, 300);
  }, [videoRef]);

  useEffect(() => {
    if (webcamStream && videoRef.current) {
        startDetection();
    }
    return () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);
      if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [webcamStream, videoRef, startDetection]);

  return {
    webcamStream,
    eyeAwayCount,
    startWebcam,
    stopWebcam,
    setEyeAwayCount,
  };
};
