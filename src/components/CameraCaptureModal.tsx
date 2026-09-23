import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  studentName?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  studentName,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      setError(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('કેમેરા શરૂ કરી શકાયો નથી. કૃપા કરીને કેમેરા પરવાનગી (Permission) તપાસો.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square
    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - minDim) / 2;
    const startY = (video.videoHeight - minDim) / 2;

    ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              વિદ્યાર્થીનો ફોટો પાડો
            </h3>
            {studentName && (
              <p className="text-xs text-slate-500 mt-0.5">{studentName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center">
          {error ? (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm flex items-start gap-2 text-center max-w-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : capturedPhoto ? (
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-emerald-500 shadow-md">
                <img
                  src={capturedPhoto}
                  alt="Captured snapshot"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-500 mt-3">
                શું આ ફોટો બરાબર છે?
              </p>
            </div>
          ) : (
            <div className="relative w-64 h-64 rounded-full overflow-hidden bg-slate-900 border-4 border-slate-200 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                onLoadedMetadata={() => videoRef.current?.play()}
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-full pointer-events-none" />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-6 flex items-center gap-3 w-full justify-center">
            {capturedPhoto ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  ફરીથી પાડો
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  ફોટો સેવ કરો
                </button>
              </>
            ) : !error ? (
              <button
                type="button"
                onClick={takeSnapshot}
                className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Camera className="w-5 h-5" />
                ક્લિક કરીને ફોટો પાડો
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                બંધ કરો
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
