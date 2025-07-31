'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { customFetch } from '@/utils/customFetch';

export default function ClientLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showLoginRequiredPopup, setShowLoginRequiredPopup] = useState(false); // 로그인 필요 팝업 상태
  const router = useRouter();

  // 페이지 로드 시 로그인 상태를 관리하던 useEffect는 customFetch 로직으로 대체되므로 제거하였습니다.
  // 로그인 상태는 API 요청의 성공/실패 여부에 따라 결정되도록 합니다.
  // 초기 로그인 상태는 false로 유지합니다.

  // 로그인 성공 여부를 sessionStorage를 통해 확인하고 알림을 띄우는 로직
  useEffect(() => {
    const isLoggingIn = sessionStorage.getItem('isLoggingIn');
    if (isLoggingIn === 'true') {
      // 이 시점에서 실제 로그인 성공 여부를 확인하기 위해
      // 간단한 상태 확인용 API(/auth/status 등)를 호출하는 것이 이상적입니다.
      // 지금은 임시로 sessionStorage 아이템 존재 여부로만 판단합니다.
      setIsLoggedIn(true);
      alert('로그인 되었습니다!');
      sessionStorage.removeItem('isLoggingIn');
    }
  }, []);

  const handleLoginClick = () => {
    sessionStorage.setItem('isLoggingIn', 'true');
  };
  // 로그아웃 로직
  const handleLogout = async () => {
    try {
      await customFetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키를 포함하여 요청
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // 서버에서 쿠키를 삭제하므로 클라이언트에서는 상태만 업데이트
      setIsLoggedIn(false);
      alert('로그아웃 되었습니다.');
      router.push('/');
    }
  };

  // 로그인이 필요한 메뉴 클릭 핸들러
  const handleProtectedLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginRequiredPopup(true);
    }
  };

  return (
    <>
      <header className="h-26">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="font-bold text-xl">
            <img src="/images/logo.png" alt="로고" className="h-25" />
          </Link>
          <nav className="flex items-center space-x-8">
            <div className="relative group">
              <button className="cursor-pointer py-2" onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setShowLoginRequiredPopup(true); }}}>나의 동화책</button>
              <div className="absolute z-10 hidden group-hover:block bg-[#FAF9F6] shadow-lg rounded-md mt-0 py-1 w-full min-w-max left-1/2 -translate-x-1/2">
                <Link href="/fairytale/post" onClick={handleProtectedLinkClick} className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100">
                  동화책만들기
                </Link>
                <Link href="/fairytale/get" onClick={handleProtectedLinkClick} className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100">
                  동화책펼치기
                </Link>
              </div>
            </div>
            <Link href="/fairytaleGallery" onClick={handleProtectedLinkClick} className="py-2">
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

      {/* 로그인 팝업 */}
      {showLoginPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowLoginPopup(false)}
        >
          <div 
            className="bg-white p-8 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()} // Prevent popup from closing when clicking inside
          >
            <Link 
              href="http://localhost:8080/oauth2/authorization/naver"
              onClick={handleLoginClick}
              className="bg-[#03C75A] text-white font-bold py-2 px-4 rounded"
            >
              네이버 로그인
            </Link>
          </div>
        </div>
      )}

      {/* 로그인 필요 팝업 */}
      {showLoginRequiredPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowLoginRequiredPopup(false)}
        >
          <div 
            className="bg-white p-8 rounded-lg shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-7">로그인이 필요합니다.</p>
            <Link 
              href="http://localhost:8080/oauth2/authorization/naver"
              onClick={handleLoginClick}
              className="bg-[#03C75A] text-white font-bold py-2 px-4 rounded"
            >
              네이버 로그인
            </Link>
          </div>
        </div>
      )}

      <>
        {children}
      </>
      <footer className="bg-[#FFD6A5] text-[#9B4500] py-8 px-4 text-center text-sm">
        <p>동화공방</p>
        <p>Team07 | 키워드 기반 AI 동화 생성 서비스</p>
        <p>프로그래머스 데브코스 백엔드 6기 2차 프로젝트</p>
        <div>
          <Link href="/introduction" className="hover:underline">서비스 소개</Link>
        </div>
        <div>
          <Link href="https://github.com/prgrms-be-devcourse/NBE6-8-2-Team07" className="hover:underline" target="_blank" rel="noopener noreferrer">GitHub 저장소</Link>
        </div>
      </footer>
    </>
  );
}