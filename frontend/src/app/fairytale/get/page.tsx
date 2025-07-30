"use client";

import React, { useState, useEffect } from 'react';
import { FaRegStar, FaBook, FaStar, FaCalendarAlt, FaTrashAlt } from 'react-icons/fa';
// 뷰모드 전환을 위한 아이콘 추가
import { MdViewList, MdGridView } from 'react-icons/md';
import Link from 'next/link';
import { Fairytale } from '@/context/fairytaleContext';

// 뷰모드 타입 정의 (테이블 또는 그리드)
type ViewMode = 'table' | 'grid';

const FairytaleList = () => {
  const [fairyTales, setFairyTales] = useState<Fairytale[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 뷰모드 상태 추가 (기본값: 테이블)
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  // 삭제 중인 동화 ID를 추적하는 상태 (로딩 표시용)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // 동화 삭제 함수
  const handleDeleteFairytale = async (id: number, title: string) => {
    // 사용자에게 삭제 확인 요청
    const isConfirmed = window.confirm(`"${title}" 동화를 정말 삭제하시겠습니까?`);
    
    if (!isConfirmed) {
      return; // 사용자가 취소한 경우 함수 종료
    }

    // 삭제 중인 상태로 설정 (버튼 비활성화용)
    setDeletingIds(prev => new Set([...prev, id.toString()]));

    try {
      // 백엔드에 DELETE 요청 보내기
      const response = await fetch(`http://localhost:8080/fairytales/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`삭제 실패! status: ${response.status}`);
      }

      // 성공적으로 삭제된 경우, 로컬 상태에서도 해당 동화 제거
      setFairyTales(prev => prev.filter(tale => tale.id !== id));
      
      // 성공 메시지 (선택사항)
      alert(`"${title}" 동화가 삭제되었습니다.`);
      
    } catch (error: any) {
      // 에러 발생 시 사용자에게 알림
      console.error('삭제 중 오류 발생:', error);
      alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      // 삭제 중인 상태 해제 (성공/실패 관계없이 실행)
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id.toString());
        return newSet;
      });
    }
  };

  useEffect(() => {
    const fetchFairyTales = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const response = await fetch('http://localhost:8080/fairytales');
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Fairytale[] = await response.json();
        setFairyTales(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFairyTales();
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
    <div className="container mx-auto p-4">
      {/* 헤더 영역: 제목과 뷰모드 전환 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">동화 목록</h1>
        
        {/* 뷰모드 전환 버튼 그룹 */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          {/* 테이블 뷰 버튼 */}
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 transition-colors ${
              viewMode === 'table' 
                ? 'bg-orange-100 text-orange-800'  // 선택된 상태
                : 'bg-white hover:bg-gray-50'       // 선택되지 않은 상태
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
                ? 'bg-orange-100 text-orange-800'   // 선택된 상태
                : 'bg-white hover:bg-gray-50'        // 선택되지 않은 상태
            }`}
            title="그리드 뷰"
          >
            <MdGridView />
          </button>
        </div>
      </div>
      
      {/* 테이블 뷰 (디자인 보완) - viewMode가 'table'일 때만 표시 */}
      {viewMode === 'table' && (
        <div className="bg-white border-gray-300 rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-orange-50">
                <tr>
                  {/* 즐겨찾기 컬럼 (주석처리) */}
                  {/* <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    즐겨찾기
                  </th> */}
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
                {fairyTales.map((tale) => (
                  <tr key={tale.id} className="hover:bg-gray-50 transition-colors">
                    {/* 즐겨찾기 셀 (주석처리) */}
                    {/* <td className="py-4 px-6 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleFavorite(tale.id)} 
                        className="text-xl text-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        {tale.isFavorite ? <FaStar /> : <FaRegStar />}
                      </button>
                    </td> */}
                    
                    {/* 제목 셀 - 개선된 디자인 */}
                    <td className="py-4 px-6">
                      <Link 
                        href={`/fairytale/get/${tale.id}`} 
                        className="text-gray-900 hover:text-orange-600 hover:underline font-medium transition-colors text-lg"
                      >
                        {tale.title}
                      </Link>
                    </td>
                    
                    {/* 생성일자 셀 - 아이콘 추가 */}
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
                          disabled={deletingIds.has(tale.id.toString())} // 삭제 중일 때 버튼 비활성화
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            deletingIds.has(tale.id.toString())
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' // 삭제 중 스타일
                              : 'bg-red-100 text-red-800 hover:bg-red-200'     // 일반 스타일
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
      
      {/* 그리드 뷰 - viewMode가 'grid'일 때만 표시 */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fairyTales.map((tale) => (
            <div key={tale.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              {/* 카드 내용 */}
              <div className="p-4">
                {/* 동화 제목 */}
                <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-3">
                  <Link 
                    href={`/fairytale/get/${tale.id}`}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {tale.title}
                  </Link>
                </h3>
                
                {/* 생성일자 */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaCalendarAlt className="mr-2" />
                  {new Date(tale.createdAt).toLocaleDateString('ko-KR')}
                </div>
                
                {/* 즐겨찾기 버튼 (주석처리) */}
                {/* <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => handleToggleFavorite(tale.id)} 
                    className="text-lg text-yellow-500 hover:text-yellow-600 transition-colors"
                  >
                    {tale.isFavorite ? <FaStar /> : <FaRegStar />}
                  </button>
                </div> */}
                
                {/* 버튼 그룹 - 간격 개선 */}
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
                    disabled={deletingIds.has(tale.id.toString())} // number를 string으로 변환
                    className={`block w-full text-center py-3 px-4 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                      deletingIds.has(tale.id.toString())
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // 삭제 중 스타일
                        : 'bg-red-500 text-white hover:bg-red-600'        // 일반 스타일
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