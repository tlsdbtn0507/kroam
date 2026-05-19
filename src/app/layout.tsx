import type { Metadata, Viewport } from "next";
import "./globals.css";

// 모바일 웹앱 전체화면 및 줌 방지 설정
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // 아이폰 노치 영역까지 확장
  themeColor: "#000000",
};

// PWA 및 Apple Mobile Web App 관련 메타태그
export const metadata: Metadata = {
  title: "Setlog Camera",
  description: "Vlog Style Camera UI",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true, // 사파리 툴바 제거 (홈 화면 추가 시)
    statusBarStyle: "black-translucent", // 상태바를 투명하게 만들어 콘텐츠 위로 오버레이
    title: "Setlog",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* 
        overscroll-none: 당겨서 새로고침(바운스) 방지
        touch-none: 브라우저 기본 터치 제스처 방지
        select-none: 텍스트 선택 방지
      */}
      <body className="bg-black text-white antialiased overflow-hidden overscroll-none touch-none select-none">
        {children}
      </body>
    </html>
  );
}
