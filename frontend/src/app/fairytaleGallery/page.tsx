'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Fairytale {
  id: number;
  title: string;
  createdAt: string;
  // 백엔드에서 제공될 수 있는 추가 필드들
  childName?: string;
  childRole?: string;
  characters?: string;
  place?: string;
  mood?: string;
  lesson?: string;
  // 프론트엔드에서 관리할 좋아요 상태
  likeCount?: number;
  isLiked?: boolean;
}

export default function FairytaleGallery() {
  const [fairytales, setFairytales] = useState<Fairytale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedFairytales, setLikedFairytales] = useState<Set<number>>(new Set());
  const router = useRouter();

  useEffect(() => {
    fetchFairytales();
    loadLikedFairytales();
  }, []);

  const fetchFairytales = async () => {
    try {
      const response = await fetch('http://localhost:8080/fairytales/public', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const fairytalesWithLikes = data.map((fairytale: Fairytale) => ({
        ...fairytale,
        isLiked: likedFairytales.has(fairytale.id)
      }));

      setFairytales(fairytalesWithLikes);
      setError(null);
    } catch (err) {
      console.error('Error fetching fairytales:', err);
      setError('동화를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLikedFairytales = () => {
    const liked = localStorage.getItem('likedFairytales');
    if (liked) {
      const likedIds = JSON.parse(liked);
      setLikedFairytales(new Set(likedIds));
    }
  };

  const toggleLike = (fairytaleId: number) => {
    const newLikedFairytales = new Set(likedFairytales);

    if (newLikedFairytales.has(fairytaleId)) {
      newLikedFairytales.delete(fairytaleId);
    } else {
      newLikedFairytales.add(fairytaleId);
    }

    setLikedFairytales(newLikedFairytales);
    localStorage.setItem('likedFairytales', JSON.stringify(Array.from(newLikedFairytales)));

    setFairytales(prev => 
      prev.map(fairytale => 
        fairytale.id === fairytaleId 
          ? { ...fairytale, isLiked: !fairytale.isLiked }
          : fairytale
      )
    );
  };

  const handleFairytaleClick = (fairytaleId: number) => {
    router.push(`/fairytale/get/${fairytaleId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <main className="py-12 space-y-14 text-gray-800">
        <section className="w-full py-12 md:py-16 lg:py-16 bg-[#FFE0B5] relative">
          <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-6">
            <h1 className="text-5xl font-extrabold text-orange-500 tracking-tight">
              동화 갤러리
            </h1>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-2xl text-gray-600 animate-pulse">
              동화를 불러오는 중...
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-12 space-y-14 text-gray-800">
        <section className="w-full py-12 md:py-16 lg:py-16 bg-[#FFE0B5] relative">
          <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-6">
            <h1 className="text-5xl font-extrabold text-orange-500 tracking-tight">
              동화 갤러리
            </h1>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-2xl text-red-600">❌ {error}</div>
          </div>
        </section>
      </main>
    );
  }

  if (fairytales.length === 0) {
    return (
      <main className="py-12 space-y-14 text-gray-800">
        <section className="w-full py-12 md:py-16 lg:py-16 bg-[#FFE0B5] relative">
          <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-6">
            <h1 className="text-5xl font-extrabold text-orange-500 tracking-tight">
              동화 갤러리
            </h1>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-2xl text-gray-600">📚 아직 등록된 동화가 없습니다.</div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="py-12 space-y-14 text-gray-800">
      <section className="w-full py-12 md:py-16 lg:py-16 bg-[#FFE0B5] relative">
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-6">
          <h1 className="text-5xl font-extrabold text-orange-500 tracking-tight">
            동화 갤러리
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-4">
            우리 아이들의 특별한 이야기들
          </h2>
          <p className="text-lg text-gray-600">
            아이와 함께 만든 소중한 동화들을 모아봤어요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fairytales.map((fairytale) => (
            <div
              key={fairytale.id}
              className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-orange-200"
              onClick={() => handleFairytaleClick(fairytale.id)}
            >
              {/* 상단 오렌지 바 */}
              <div className="h-2 bg-orange-400"></div>

              <div className="p-6">
                {/* 제목 영역 */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                    {fairytale.title}
                  </h3>
                </div>

                {/* 카드 내용 */}
                <div className="mb-6">
                  {/* 동화 내용 미리보기 */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      아이와 함께 만든 특별한 동화입니다. 
                      자세한 내용을 보려면 카드를 클릭해주세요!
                    </p>
                  </div>

                  {/* 동적 데이터 표시 (백엔드에서 제공될 때) */}
                  {(fairytale.characters || fairytale.place || fairytale.mood) && (
                    <div className="space-y-3 mb-4">
                      {fairytale.characters && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            👥 등장인물
                          </span>
                          <span className="text-sm text-gray-700">{fairytale.characters}</span>
                        </div>
                      )}
                      {fairytale.place && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            🏰 장소
                          </span>
                          <span className="text-sm text-gray-700">{fairytale.place}</span>
                        </div>
                      )}
                      {fairytale.mood && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                            ✨ 분위기
                          </span>
                          <span className="text-sm text-gray-700">{fairytale.mood}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 하단 영역 */}
                <div className="pt-4 border-t border-orange-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">📅</span>
                      <span>{formatDate(fairytale.createdAt)}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(fairytale.id);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        fairytale.isLiked
                          ? 'text-red-500 hover:text-red-600 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill={fairytale.isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}