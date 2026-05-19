"use client";

import { useEffect, useRef, useState } from "react";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      // 브라우저에서 mediaDevices API 지원 여부 확인
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Media devices API가 지원되지 않습니다.");
        setHasPermission(false);
        return;
      }

      try {
        // 해상도 제약을 풀고 가장 기본적인 전면 카메라 옵션만 사용해 호환성 극대화
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // iOS 사파리/크롬에서는 명시적으로 play()를 호출해줘야 검은 화면이 안 나오는 경우가 많습니다.
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((e) => {
              console.error("비디오 재생 실패:", e);
            });
          };
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access error:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    // 컴포넌트 언마운트 시 카메라 스트림 해제
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    // 100dvh를 사용하여 iOS 하단바 영향을 받지 않는 정확한 전체 화면 높이 확보
    <main className="relative w-full h-[100dvh] bg-black p-1.5 flex items-center justify-center font-sans">
      
      {/* 둥근 모서리와 보라색 네온 라인 컨테이너 */}
      <div className="relative w-full h-full rounded-[44px] border-[3px] border-[#f472b6] overflow-hidden shadow-[0_0_15px_rgba(244,114,182,0.4)] bg-zinc-900">
        
        {/* 맨 아래 레이어: 실시간 카메라 비디오 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline // iOS 사파리 전체화면 자동 재생 방지 (필수)
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* 맨 위 레이어: UI 오버레이 (pointer-events-none로 터치 통과) */}
        <div 
          className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none p-4 pb-8"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }} // iOS 노치 대응
        >
          
          {/* 상단 닫기(X) 버튼 영역 */}
          <div className="flex justify-end pointer-events-auto">
            <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 active:scale-95 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 화면 중앙부: 90도 회전된 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* 중앙 시간 */}
            <div className="rotate-90 text-white font-extrabold text-5xl tracking-widest drop-shadow-md">
              9:00
            </div>
          </div>

          <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
            {/* 우측 텍스트 라벨 */}
            <div className="rotate-90 text-white/90 font-medium text-lg tracking-[0.3em] drop-shadow-md origin-center">
              우리가족
            </div>
          </div>

          {/* 하단 컨트롤 영역 */}
          <div className="flex flex-col items-center gap-5 pointer-events-auto pb-2">
            
            {/* 플래시 및 줌 배율 영역 */}
            <div className="relative flex items-center justify-center w-full px-8">
              {/* 번개(플래시) 아이콘 */}
              <div className="absolute left-8 rotate-90 text-white drop-shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>

              {/* 줌 배율 텍스트 */}
              <div className="flex items-center gap-7 text-sm font-semibold tracking-wider">
                <span className="rotate-90 text-white/80 drop-shadow-md">.5</span>
                <span className="rotate-90 text-yellow-400 drop-shadow-md">1</span>
                <span className="rotate-90 text-white/80 drop-shadow-md">2</span>
                <span className="rotate-90 text-white/80 drop-shadow-md">3</span>
              </div>
            </div>

            {/* 메인 촬영(스마일) 버튼 */}
            <button className="relative flex items-center justify-center w-[76px] h-[76px] rounded-full border-[3px] border-blue-600 bg-transparent active:scale-95 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              <div className="w-[64px] h-[64px] bg-[#22d3ee] rounded-full flex items-center justify-center border border-blue-500 shadow-inner">
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-blue-950">
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <circle cx="9" cy="10" r="1.5" fill="currentColor"></circle>
                  <circle cx="15" cy="10" r="1.5" fill="currentColor"></circle>
                </svg>
              </div>
            </button>

            {/* 최하단 메뉴 바 */}
            <div className="flex items-center justify-between w-full px-6 mt-1">
              {/* 좌측: 타이머 설정 아이콘 등 */}
              <button className="w-11 h-11 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* 중앙: 카메라/로그 탭 */}
              <div className="flex items-center gap-6 bg-black/50 backdrop-blur-md px-6 py-3.5 rounded-[30px] border border-white/10 shadow-lg">
                <button className="text-white font-medium text-sm drop-shadow-sm">카메라</button>
                <button className="text-white/50 font-medium text-sm">로그</button>
              </div>

              {/* 우측: 카메라 전환 아이콘 */}
              <button className="w-11 h-11 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
      
      {/* 카메라 권한 거부 / 에러 시 폴백 UI */}
      {hasPermission === false && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 text-white text-center p-6 backdrop-blur-md pointer-events-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          <p className="text-lg font-bold mb-2">카메라 접근 권한이 필요합니다.</p>
          <p className="text-sm text-gray-400 mb-6">주소창 좌측의 'aA' 버튼을 누르거나<br/>설정에서 카메라 권한을 허용해주세요.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 rounded-full font-semibold"
          >
            다시 시도
          </button>
        </div>
      )}
    </main>
  );
}
