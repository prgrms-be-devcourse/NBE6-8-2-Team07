'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // 백엔드를 통해 로그인 상태를 확인하는 함수
  const checkLoginStatusOnBackend = async () => {
    try {
      const response = await fetch('http://localhost:8080/reissue', {
        method: 'POST',
        credentials: 'include', // HttpOnly 쿠키를 포함하여 요청
      });
      // 200 OK 응답은 로그인 상태임을 의미
      return response.ok; 
    } catch (error) {
      console.error("Failed to check login status:", error);
      return false;
    }
  };

  useEffect(() => {
    const handleInitialLoginCheck = async () => {
      const isLoggingIn = sessionStorage.getItem('isLoggingIn');
      const loggedIn = await checkLoginStatusOnBackend();

      if (loggedIn) {
        setIsLoggedIn(true);
        if (isLoggingIn) {
          alert('로그인에 성공했습니다!');
          sessionStorage.removeItem('isLoggingIn');
        }
      } else {
        setIsLoggedIn(false);
        if (isLoggingIn) {
          // 로그인 시도 후 실패한 경우 (예: 토큰 만료 등)
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
          sessionStorage.removeItem('isLoggingIn');
        }
      }
    };

    handleInitialLoginCheck();
  }, []);

  const handleLoginClick = () => {
    sessionStorage.setItem('isLoggingIn', 'true');
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키를 포함하여 요청
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // 서버에서 쿠키를 삭제하므로 클라이언트에서는 상태만 업데이트
      setIsLoggedIn(false);
      alert('로그아웃 되었습니다.');
    }
  };

  return (
    <html lang="en">
      <header className="">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="font-bold text-xl">
            로고이미지
          </Link>
          <nav className="flex items-center space-x-8">
            <div className="relative group">
              <button className="cursor-pointer py-2">나의 동화책</button>
              <div className="absolute z-10 hidden group-hover:block bg-[#FAF9F6] shadow-lg rounded-md mt-0 py-1 w-full min-w-max left-1/2 -translate-x-1/2">
                <Link href="/fairytale/post" className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100">
                  동화책만들기
                </Link>
                <Link href="/fairytale/get" className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100">
                  동화책펼치기
                </Link>
              </div>
            </div>
            <Link href="/fairytaleGallery" className="py-2">
              동화갤러리
            </Link>
            <Link href="/introduction" className="py-2">
              소개
            </Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="py-2 cursor-pointer">
                로그아웃
              </button>
            ) : (
              <button onClick={() => setShowLoginPopup(true)} className="py-2 cursor-pointer">
                로그인
              </button>
            )}
          </nav>
        </div>
      </header>

      {showLoginPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowLoginPopup(false)}
        >
          <div 
            className="bg-white p-8 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()} // Prevent popup from closing when clicking inside
          >
            <a 
              href="http://localhost:8080/oauth2/authorization/naver"
              onClick={handleLoginClick}
              className="bg-[#03C75A] text-white font-bold py-2 px-4 rounded"
            >
              네이버 로그인
            </a>
          </div>
        </div>
      )}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <footer className="bg-[#FFD6A5]">
        <div>
           <br/>
           <br/>
           <br/>
           <br/>
           <br/>
        </div>
      </footer>
    </html>
  );
}