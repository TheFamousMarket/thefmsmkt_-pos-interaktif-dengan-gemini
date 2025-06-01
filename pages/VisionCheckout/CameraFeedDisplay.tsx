
import React, { useEffect, useRef, useState } from 'react';
import { CameraIcon, VideoCameraSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

interface CameraFeedDisplayProps {
  isScanning: boolean;
}

const CameraFeedDisplay: React.FC<CameraFeedDisplayProps> = ({ isScanning }) => {
  const { translate } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false); // To manage video visibility

  useEffect(() => {
    const startCamera = async () => {
      setError(null);
      setIsCameraActive(false);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                setIsCameraActive(true); // Show video only after it's loaded
            };
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setError(err instanceof Error ? err.message : "Unknown camera error");
          setIsCameraActive(false);
        }
      } else {
        setError("getUserMedia not supported in this browser.");
        setIsCameraActive(false);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    };

    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera(); // Cleanup on component unmount or when isScanning changes
    };
  }, [isScanning]);

  return (
    <div className="bg-slate-700 rounded-lg p-1 sm:p-2 aspect-[4/3] flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 z-10 p-4">
          <ExclamationCircleIcon className="h-16 w-16 text-red-400 mb-3" />
          <p className="text-md font-semibold text-red-300">Camera Error</p>
          <p className="text-xs text-stone-400 max-w-xs">{error}</p>
        </div>
      )}

      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isCameraActive && isScanning && !error ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Overlays for text and icons, visible based on state */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center p-2 transition-opacity duration-300 
                     ${(isScanning && isCameraActive && !error) ? 'bg-black/30' : ''} 
                     ${(!isScanning || !isCameraActive || error) ? 'opacity-100' : (isScanning && isCameraActive ? 'opacity-100' : 'opacity-0')}`} // Control overlay visibility
      >
        {isScanning && !error ? (
          <>
            {isCameraActive ? (
                 <CameraIcon className="h-12 w-12 sm:h-16 sm:w-16 text-green-400/70 mb-2 sm:mb-3 opacity-60" /> // Icon less prominent when video is active
            ) : (
                 <CameraIcon className="h-12 w-12 sm:h-16 sm:w-16 text-green-400 mb-2 sm:mb-3 animate-pulse" /> // Pulsing while waiting for video
            )}
            <p className="text-md sm:text-lg font-semibold text-green-300">{translate('vision_scanning_active')}</p>
            <p className="text-xs sm:text-sm text-stone-300">{translate('vision_camera_feed_title')}</p>
          </>
        ) : !error ? ( // Not scanning and no error
          <>
            <VideoCameraSlashIcon className="h-12 w-12 sm:h-16 sm:w-16 text-stone-500 mb-2 sm:mb-3" />
            <p className="text-md sm:text-lg font-semibold text-stone-400">{translate('vision_scanning_idle')}</p>
            <p className="text-xs sm:text-sm text-stone-500">{translate('vision_camera_feed_title')}</p>
          </>
        ) : null /* Error message is handled by its own div */}
      </div>
      
       {/* Optional scan line for when camera is active */}
      {isScanning && isCameraActive && !error && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div 
                className="absolute w-full h-0.5 bg-green-500/70 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]" 
                style={{
                    animation: 'scan-line-anim 2.5s ease-in-out infinite alternate',
                    top: '0%' 
                }}
            ></div>
        </div>
      )}
      <style>{`
        @keyframes scan-line-anim {
          0% { transform: translateY(0%); }
          100% { transform: translateY(calc(100% - 2px)); } /* 2px is h-0.5 */
        }
      `}</style>
    </div>
  );
};

export default CameraFeedDisplay;
