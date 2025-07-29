"use client";

import React, { useState, useEffect } from 'react';
import { FaRegStar, FaBook, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { Fairytale } from '@/context/fairytaleContext';

const FairytaleList = () => {
  const [fairyTales, setFairyTales] = useState<Fairytale[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <h1 className="text-2xl font-bold mb-4">동화 목록</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-orange-200">
            <tr>
              {/* <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">즐겨찾기</th> */}
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">제목</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">생성일자</th>
            </tr>
          </thead>
          <tbody className="bg-[#FAF9F6] divide-y divide-gray-200">
            {fairyTales.map((tale) => (
              <tr key={tale.id} className="hover:bg-gray-100">
                {/* 즐겨찾기 UI 주석처리 */}
                {/* <td className="py-4 px-6 whitespace-nowrap">
                  <button onClick={() => handleToggleFavorite(tale.id)} className="text-2xl text-[#FFB347] cursor-pointer">
                    {tale.isFavorite ? <FaStar /> : <FaRegStar />}
                  </button>
                </td> */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <Link href={`/fairytale/get/${tale.id}`} className="hover:underline">
                    {tale.title}
                  </Link>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">{new Date(tale.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FairytaleList;