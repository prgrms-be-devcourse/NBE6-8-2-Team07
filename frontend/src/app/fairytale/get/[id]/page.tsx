'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Fairytale } from '@/context/fairytaleContext';
import { customFetch } from '@/utils/customFetch';
import { FaLock, FaGlobe } from 'react-icons/fa';

interface GroupedKeywords {
  [key: string]: string[]; // 각 키워드는 문자열 배열로 예상
}

const FairytaleReader = () => {
  const params = useParams();
  const fairytaleId = params.id as string;

  const [isKeywordPopupOpen, setIsKeywordPopupOpen] = useState(false);
  const [fairytale, setFairytale] = useState<Fairytale | null>(null);
  const [groupedKeywords, setGroupedKeywords] = useState<GroupedKeywords>({
    CHILD_NAME: [],
    CHILD_ROLE: [],
    CHARACTERS: [],
    PLACE: [],
    MOOD: [],
    LESSON: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const keywordCategoryNames: { [key: string]: string } = {
    CHILD_NAME: '주인공 이름',
    CHILD_ROLE: '주인공 역할',
    CHARACTERS: '등장인물',
    PLACE: '장소',
    MOOD: '분위기',
    LESSON: '교훈',
  };
  
  // 공개설정 토글 메서드 추가가
  const handleToggleVisibility = async () => {
    if (!fairytale) return;
    
    setIsUpdatingVisibility(true);
    
    try {
      const response = await customFetch(
        `http://localhost:8080/fairytales/${fairytaleId}/visibility?isPublic=${!fairytale.isPublic}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`공개 설정 변경 실패! status: ${response.status}`);
      }

      setFairytale(prev => 
        prev ? { ...prev, isPublic: !prev.isPublic } : null
      );

      // 성공 알림
      alert(`동화가 ${!fairytale.isPublic ? '공개' : '비공개'}로 설정되었습니다.`);
      
    } catch (error: unknown) {
      console.error('공개 설정 변경 중 오류 발생:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`공개 설정 변경 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  useEffect(() => {
    const fetchFairytaleData = async () => {
      if (!fairytaleId) {
        setError('Fairytale ID is missing.');
        setLoading(false);
        return;
      }

      try {
        // Fetch fairytale details
        const fairytaleResponse = await customFetch(`http://localhost:8080/fairytales/${fairytaleId}`,{
          credentials: 'include', // 인증 정보 포함
        });
        if (!fairytaleResponse.ok) {
          throw new Error(`Failed to fetch fairytale: ${fairytaleResponse.statusText}`);
        }
        const fairytaleData: Fairytale = await fairytaleResponse.json();
        setFairytale(fairytaleData);

        // API에서 키워드가 문자열로 내려온다면 쉼표로 분리해서 배열로 만듭니다.
        // 만약 이미 배열이라면 이 부분은 필요 없어요.
        const parseKeywords = (str?: string) =>
          str ? str.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

        const newGroupedKeywords: GroupedKeywords = {
          CHILD_NAME: parseKeywords((fairytaleData as Fairytale & { childName?: string }).childName),
          CHILD_ROLE: parseKeywords((fairytaleData as Fairytale & { childRole?: string }).childRole),
          CHARACTERS: parseKeywords((fairytaleData as Fairytale & { characters?: string }).characters),
          PLACE: parseKeywords((fairytaleData as Fairytale & { place?: string }).place),
          MOOD: parseKeywords((fairytaleData as Fairytale & { mood?: string }).mood),
          LESSON: parseKeywords((fairytaleData as Fairytale & { lesson?: string }).lesson),
        };

        setGroupedKeywords(newGroupedKeywords);

      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFairytaleData();
  }, [fairytaleId]);

  if (loading) return <div className="container mx-auto p-4">로딩 중...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">에러: {error}</div>;
  if (!fairytale) return <div className="container mx-auto p-4">동화를 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-4 mb-6 bg-[#FAF9F6] min-h-screen flex flex-col items-center relative">
      <div className="relative w-full max-w-3xl">
        <div className="bg-white shadow-lg rounded-lg mt-8">
          {/* 동화 이미지 섹션 - 카드 내부에 패딩과 함께 배치 */}
          <div className="p-8">
            {/* 제목과 공개설정 토글을 같은 라인에 배치 */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800 flex-1 mr-4">{fairytale.title}</h1>
            
            {/* 공개설정 토글 버튼 추가 */}
            <div className="flex items-center">
                <button
                  onClick={handleToggleVisibility}
                  disabled={isUpdatingVisibility}
                  className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                    isUpdatingVisibility
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : fairytale.isPublic
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer'
                  }`}
                  title={
                    isUpdatingVisibility
                      ? '설정 변경 중...'
                      : `현재 ${fairytale.isPublic ? '공개' : '비공개'} 상태 (클릭하여 변경)`
                  }
                >
                  {isUpdatingVisibility ? (
                    <>
                      {/* 로딩 스피너 */}
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                      <span className="text-sm font-medium">변경 중...</span>
                    </>
                  ) : (
                    <>
                      {fairytale.isPublic ? (
                        <>
                          <FaGlobe className="mr-2" />
                          <span className="text-sm font-medium">공개</span>
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-2" />
                          <span className="text-sm font-medium">비공개</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>

            {fairytale.imageUrl && (
              <div className="flex justify-center mb-6">
                <div className="w-90 h-90 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={fairytale.imageUrl} 
                    alt={fairytale.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            <div className="text-lg leading-relaxed text-gray-700 mb-8">
              <p style={{ whiteSpace: 'pre-line' }}>{fairytale.content}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsKeywordPopupOpen(true)}
          className="fixed bottom-8 right-8 bg-orange-400 text-white text-lg px-4 py-2 rounded-full shadow-lg hover:bg-orange-500 transition-colors cursor-pointer"
        >
          키워드 보기
        </button>
      </div>

      {/* 키워드 팝업은 기존과 동일 */}
      {isKeywordPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full overflow-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4">동화 키워드</h2>
            <div className="space-y-4">
              {Object.entries(groupedKeywords).map(([type, keywords]) => (
                <div key={type}>
                  <h3 className="font-semibold text-orange-600 text-lg mb-2">{keywordCategoryNames[type] || type}</h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.length > 0 ? (
                      keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-orange-400 text-white px-2 py-1 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">등록된 키워드가 없습니다.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsKeywordPopupOpen(false)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FairytaleReader;

