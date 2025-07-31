"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { FaRegStar, FaBook, FaStar, FaCalendarAlt, FaTrashAlt } from 'react-icons/fa';
import { MdViewList, MdGridView } from 'react-icons/md';
import { customFetch } from '@/utils/customFetch';
import { Fairytale, FairytaleWithBookmark } from '@/context/fairytaleContext';


// 뷰모드 타입 정의 (테이블 또는 그리드)
type ViewMode = 'table' | 'grid';

const FairytaleList = () => {
  const [fairyTales, setFairyTales] = useState<FairytaleWithBookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarked'>('all');
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [bookmarkingIds, setBookmarkingIds] = useState<Set<string>>(new Set());

  // 필터링된 동화 목록
  const filteredFairyTales = filterMode === 'all' 
    ? fairyTales 
    : fairyTales.filter(tale => tale.isBookmarked);

  // 즐겨찾기 토글 함수
  const handleToggleBookmark = async (fairytaleId: number, currentBookmarkStatus: boolean) => {
    // 북마킹 중인 상태로 설정 (버튼 비활성화)
    setBookmarkingIds(prev => new Set([...prev, fairytaleId.toString()]));

    try {
      const method = currentBookmarkStatus ? 'DELETE' : 'POST';
      const response = await customFetch(`http://localhost:8080/bookmark/${fairytaleId}`, {
        method: method,
        credentials: 'include', // 인증 정보 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`즐겨찾기 ${currentBookmarkStatus ? '해제' : '추가'} 실패! status: ${response.status}`);
      }

      // 로컬 상태 업데이트
      setFairyTales(prev => 
        prev.map(tale => 
          tale.id === fairytaleId 
            ? { ...tale, isBookmarked: !currentBookmarkStatus }
            : tale
        )
      );

      alert(`즐겨찾기가 ${currentBookmarkStatus ? '해제' : '추가'}되었습니다.`);
      
    } catch (error: unknown) {
      console.error('즐겨찾기 처리 중 오류 발생:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`즐겨찾기 처리 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setBookmarkingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fairytaleId.toString());
        return newSet;
      });
    }
  };

  // 동화 삭제 함수
  const handleDeleteFairytale = async (id: number, title: string) => {
    // 사용자에게 삭제 확인 요청
    const isConfirmed = window.confirm(`"${title}" 동화를 정말 삭제하시겠습니까?`);
    
    if (!isConfirmed) {
      return; // 사용자가 취소한 경우 함수 종료
    }

    // 삭제 중인 상태로 설정 (버튼 비활성화)
    setDeletingIds(prev => new Set([...prev, id.toString()]));

    try {
      const response = await customFetch(`http://localhost:8080/fairytales/${id}`, {
        method: 'DELETE',
        credentials: 'include', // 인증 정보 포함
      });

      if (!response.ok) {
        throw new Error(`삭제 실패! status: ${response.status}`);
      }

      setFairyTales(prev => prev.filter(tale => tale.id !== id));
      
      alert(`"${title}" 동화가 삭제되었습니다.`);
      
    } catch (error: unknown) {
      console.error('삭제 중 오류 발생:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`삭제 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id.toString());
        return newSet;
      });
    }
  };

  useEffect(() => {
    const fetchFairyTalesWithBookmarks = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        // 동화 목록 가져오기
        const fairytalesResponse = await customFetch('http://localhost:8080/fairytales', {
          credentials: 'include', // 인증 정보 포함
        });
        
        if (fairytalesResponse.status === 404) {
          setNotFound(true);
          return;
        }
        
        if (!fairytalesResponse.ok) {
          throw new Error(`HTTP error! status: ${fairytalesResponse.status}`);
        }
        
        const fairytalesData: Fairytale[] = await fairytalesResponse.json();

        // 즐겨찾기 목록 가져오기
        let bookmarkedIds: number[] = [];
        try {
          const bookmarksResponse = await customFetch('http://localhost:8080/bookmarks', {
            credentials: 'include', 
          });
          
          if (bookmarksResponse.ok) {
            const bookmarksData = await bookmarksResponse.json();
            bookmarkedIds = bookmarksData.map((bookmark: { fairytaleId: number })=> bookmark.fairytaleId);
          }
        } catch (bookmarkError) {
          console.warn('즐겨찾기 정보를 가져오는데 실패했습니다:', bookmarkError);
          // 즐겨찾기 정보를 가져오지 못해도 동화 목록은 표시
        }

        // 동화 목록에 즐겨찾기 상태 추가
        const fairytalesWithBookmarks: FairytaleWithBookmark[] = fairytalesData.map(tale => ({
          ...tale,
          isBookmarked: bookmarkedIds.includes(tale.id)
        }));

        setFairyTales(fairytalesWithBookmarks);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFairyTalesWithBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-lg">동화를 불러오는 중...</span>
        </div>
      </div>
    );
  }
  
  if (error) return <div className="container mx-auto p-4 text-red-500">에러: {error}</div>;

  // 404 에러 (동화가 없음)
  if (notFound) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <FaBook className="mx-auto text-gray-400 text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">아직 동화가 없습니다</h2>
          <p className="text-gray-500">첫 번째 동화를 만들어보세요!</p>
          <Link 
            href="/fairytale/post" 
            className="inline-block mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            동화 만들기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 relative pt-[40px]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">동화 목록</h1>
        
        <div className="flex items-center space-x-4">
          {/* 필터 버튼 그룹 */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filterMode === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 cursor-pointer'      
              }`}
            >
              전체보기
            </button>
            <button
              onClick={() => setFilterMode('bookmarked')}
              className={`px-4 py-2 border-l border-gray-300 text-sm font-medium transition-colors ${
                filterMode === 'bookmarked' 
                  ? 'bg-blue-100 text-blue-800'   
                  : 'bg-white hover:bg-gray-50 text-gray-700 cursor-pointer'      
              }`}
            >
              즐겨찾기만
            </button>
          </div>
          
          {/* 뷰모드 전환 버튼 그룹 */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            {/* 테이블 뷰 버튼 */}
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors ${
                viewMode === 'table' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-white hover:bg-gray-50 cursor-pointer'      
              }`}
              title="테이블 뷰"
            >
              <MdViewList />
            </button>
            
            {/* 그리드 뷰 버튼 */}
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border-l border-gray-300 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-orange-100 text-orange-800'   
                  : 'bg-white hover:bg-gray-50 cursor-pointer'      
              }`}
              title="그리드 뷰"
            >
              <MdGridView />
            </button>
          </div>
        </div>
      </div>

      {/* 필터 결과 안내 메시지 */}
      {filterMode === 'bookmarked' && filteredFairyTales.length === 0 && fairyTales.length > 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg mb-4">
          <FaStar className="mx-auto text-yellow-400 text-4xl mb-2" />
          <p className="text-gray-600">아직 즐겨찾기한 동화가 없습니다.</p>
          <p className="text-sm text-gray-500">별 아이콘을 클릭해서 동화를 즐겨찾기에 추가해보세요!</p>
        </div>
      )}
      
      {/* 테이블 뷰 */}
      {viewMode === 'table' && (
        <div className="bg-white border-gray-300 rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-orange-50">
                <tr>
                  {/* 즐겨찾기 컬럼 */}
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    즐겨찾기
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    생성일자
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFairyTales.map((tale) => (
                  <tr key={tale.id} className="hover:bg-gray-50 transition-colors">
                    {/* 즐겨찾기 셀 */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleBookmark(tale.id, tale.isBookmarked)} 
                        disabled={bookmarkingIds.has(tale.id.toString())}
                        className={`text-xl transition-colors cursor-pointer ${
                          bookmarkingIds.has(tale.id.toString())
                            ? 'text-gray-400 cursor-not-allowed'
                            : tale.isBookmarked 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-gray-300 hover:text-yellow-500'
                        }`}
                        title={
                          bookmarkingIds.has(tale.id.toString()) 
                            ? '처리 중...' 
                            : tale.isBookmarked 
                              ? '즐겨찾기 해제' 
                              : '즐겨찾기 추가'
                        }
                      >
                        {tale.isBookmarked ? <FaStar /> : <FaRegStar />}
                      </button>
                    </td>
                    
                    {/* 제목 셀 */}
                    <td className="py-4 px-6">
                      <Link 
                        href={`/fairytale/get/${tale.id}`} 
                        className="text-gray-900 hover:text-orange-600 hover:underline font-medium transition-colors text-lg"
                      >
                        {tale.title}
                      </Link>
                    </td>
                    
                    {/* 생성일자 셀 */}
                    <td className="py-4 px-6 whitespace-nowrap text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span className="text-sm">
                          {new Date(tale.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </td>
                    
                    {/* 액션 셀 - 읽기/삭제 버튼 */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* 읽기 버튼 */}
                        <Link
                          href={`/fairytale/get/${tale.id}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                        >
                          읽기 →
                        </Link>
                        
                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => handleDeleteFairytale(tale.id, tale.title)}
                          disabled={deletingIds.has(tale.id.toString())}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            deletingIds.has(tale.id.toString())
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'     
                          }`}
                          title={deletingIds.has(tale.id.toString()) ? '삭제 중...' : '동화 삭제'}
                        >
                          <FaTrashAlt className="mr-1" />
                          {deletingIds.has(tale.id.toString()) ? '삭제 중...' : '삭제'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* 그리드 뷰 */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFairyTales.map((tale) => (
            <div key={tale.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              {/* 카드 내용 */}
              <div className="p-4">
                {/* 즐겨찾기 버튼과 제목 */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight flex-1 mr-2">
                    <Link 
                      href={`/fairytale/get/${tale.id}`}
                      className="hover:text-orange-600 transition-colors"
                    >
                      {tale.title}
                    </Link>
                  </h3>
                  
                  {/* 즐겨찾기 버튼 */}
                  <button 
                    onClick={() => handleToggleBookmark(tale.id, tale.isBookmarked)} 
                    disabled={bookmarkingIds.has(tale.id.toString())}
                    className={`text-lg transition-colors ${
                      bookmarkingIds.has(tale.id.toString())
                        ? 'text-gray-400 cursor-not-allowed'
                        : tale.isBookmarked 
                          ? 'text-yellow-500 hover:text-yellow-600' 
                          : 'text-gray-300 hover:text-yellow-500'
                    }`}
                    title={
                      bookmarkingIds.has(tale.id.toString()) 
                        ? '처리 중...' 
                        : tale.isBookmarked 
                          ? '즐겨찾기 해제' 
                          : '즐겨찾기 추가'
                    }
                  >
                    {tale.isBookmarked ? <FaStar /> : <FaRegStar />}
                  </button>
                </div>
                
                {/* 생성일자 */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaCalendarAlt className="mr-2" />
                  {new Date(tale.createdAt).toLocaleDateString('ko-KR')}
                </div>

                {/* 버튼 그룹 */}
                <div className="space-y-3">
                  {/* 읽기 버튼 */}
                  <Link
                    href={`/fairytale/get/${tale.id}`}
                    className="block w-full text-center py-3 px-4 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium"
                  >
                    읽기
                  </Link>
                  
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleDeleteFairytale(tale.id, tale.title)}
                    disabled={deletingIds.has(tale.id.toString())} 
                    className={`block w-full text-center py-3 px-4 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                      deletingIds.has(tale.id.toString())
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-500 text-white hover:bg-red-600'        
                    }`}
                    title={deletingIds.has(tale.id.toString()) ? '삭제 중...' : '동화 삭제'}
                  >
                    <FaTrashAlt className="inline mr-2" />
                    {deletingIds.has(tale.id.toString()) ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FairytaleList;