"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export default function CameraApp() {
  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const replayVideoRef = useRef<HTMLVideoElement>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRecordedUrlRef = useRef<string | null>(null);

  // 카메라 초기화 및 전환
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { 
            facingMode,
            // 모바일 화면 비율(세로)에 맞는 고해상도 영상을 요청하여 크롭 손실을 최소화
            width: { ideal: 1080 },
            height: { ideal: 1920 }
          },
        });
        
        streamRef.current = stream;
        currentStream = stream;

        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("카메라 접근 에러:", error);
      }
    };

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // 원인 C 해결: 아이폰 Safari 자동재생(Auto-play) 강제 트리거
  useEffect(() => {
    if (isReplaying && replayVideoRef.current && recordedUrl) {
      const video = replayVideoRef.current;
      video.load(); // iOS Safari를 위한 강제 로드
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.error("Auto-play failed:", e));
      }
    }
  }, [isReplaying, recordedUrl]);

  // 메모리 및 타이머 해제
  useEffect(() => {
    return () => {
      if (lastRecordedUrlRef.current) {
        URL.revokeObjectURL(lastRecordedUrlRef.current);
      }
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    };
  }, []);

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current || isRecording) return;

    if (lastRecordedUrlRef.current) {
      URL.revokeObjectURL(lastRecordedUrlRef.current);
    }
    
    setRecordedUrl(null);
    setIsReplaying(false);
    setProgress(0);
    chunksRef.current = [];

    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      // 원인 B 해결: MIME 타입 첫 번째 청크 기준으로 명시 (없으면 mp4 맹신)
      const mimeType = chunksRef.current[0]?.type || "video/mp4";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      lastRecordedUrlRef.current = url;
      
      setRecordedUrl(url);
      setIsReplaying(true);
      setIsRecording(false);
      setProgress(0);
    };

    // 원인 A 해결: 타임슬라이스 제거 (iOS 파편화 버그 방지 - 한 번에 모아서 뱉음)
    recorder.start(); 
    setIsRecording(true);

    const duration = 1500;
    const interval = 15;
    let currentProgress = 0;

    progressIntervalRef.current = setInterval(() => {
      currentProgress += (interval / duration) * 100;
      if (currentProgress >= 100) {
        currentProgress = 100;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      }
      setProgress(currentProgress);
    }, interval);

    recordingTimeoutRef.current = setTimeout(() => {
      if (recorderRef.current && recorderRef.current.state === "recording") {
        recorderRef.current.stop();
      }
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }, duration);
  }, [isRecording]);

  return (
    <div className="w-full h-[100dvh] bg-black flex items-center justify-center sm:min-h-screen sm:h-auto sm:p-4">
      {/* 테두리/그림자 렌더링 문제 해결: 모바일에서는 테두리 적용 제외, 정확히 부모 높이 채움 */}
      <div className="relative w-full h-full sm:h-[850px] max-w-[420px] bg-black sm:rounded-[40px] overflow-hidden sm:border-[4px] sm:border-fuchsia-600 sm:shadow-[0_0_40px_rgba(217,70,239,0.4)]">
        
        {/* 상단 프로그레스 바 (노치/다이내믹 아일랜드 Safe Area 대응) */}
        <div 
          className="absolute left-0 right-0 h-1.5 bg-gray-800 z-50"
          style={{ top: "max(env(safe-area-inset-top), 0px)" }}
        >
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-linear"
            style={{ width: `${progress}%`, transitionDuration: progress === 0 ? "0ms" : "15ms" }}
          />
        </div>

        {/* 카메라 전환 버튼 (Safe Area 대응) */}
        {!isRecording && !isReplaying && (
          <button
            onClick={toggleCamera}
            className="absolute right-4 z-50 p-3 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-all active:scale-95"
            style={{ top: "max(env(safe-area-inset-top, 24px), 24px)" }}
            aria-label="Switch Camera"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 10.5C20 6.35786 16.6421 3 12.5 3C8.64215 3 5.46461 5.91893 5.04561 9.66667M5.04561 9.66667H7.95455M5.04561 9.66667V6.33333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.00015 13.5C4.00015 17.6421 7.35802 21 11.5002 21C15.358 21 18.5355 18.0811 18.9545 14.3333M18.9545 14.3333H16.0456M18.9545 14.3333V17.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <video
          ref={previewVideoRef}
          autoPlay
          playsInline
          muted
          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)" }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isReplaying ? "opacity-0 z-0" : "opacity-100 z-10"
          }`}
        />

        <video
          ref={replayVideoRef}
          src={recordedUrl || undefined}
          autoPlay
          playsInline
          muted
          loop
          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)" }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isReplaying ? "opacity-100 z-20" : "opacity-0 z-0"
          }`}
        />

        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div 
            className="text-white/90 font-bold text-7xl tracking-[0.2em] font-mono blur-[0.5px] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            9:00
          </div>
        </div>

        {/* 하단 스마일 촬영 버튼 (하단 홈 인디케이터 Safe Area 대응) */}
        <div 
          className="absolute left-0 right-0 flex justify-center items-center z-50"
          style={{ bottom: "max(env(safe-area-inset-bottom, 40px), 40px)" }}
        >
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`
              relative w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-300 outline-none
              ${isRecording ? "scale-90" : "scale-100 hover:scale-105 active:scale-95"}
            `}
          >
            <div className={`absolute inset-0 rounded-full border-[3px] border-white transition-all duration-300 ${
              isRecording ? "border-pink-500 scale-110 shadow-[0_0_15px_rgba(236,72,153,0.8)]" : ""
            }`} />
            
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              transition-colors duration-300
              ${isRecording ? "bg-pink-500" : "bg-white"}
            `}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={isRecording ? "white" : "black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke={isRecording ? "white" : "black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9H9.01" stroke={isRecording ? "white" : "black"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9H15.01" stroke={isRecording ? "white" : "black"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
