"use client";

import React, { useState, useEffect } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { Fairytale } from '@/context/fairytaleContext';

const FairytaleList = () => {
  const [fairyTales, setFairyTales] = useState<Fairytale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFairyTales = async () => {
      try {
        const response = await fetch('http://localhost:8080/fairytales');
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

  // const handleToggleFavorite = (id: number) => {
  //   setFairyTales(
  //     fairyTales.map((tale) =>
  //       tale.id === id ? { ...tale, isFavorite: !tale.isFavorite } : tale
  //     )
  //   );
  // };

  if (loading) return <div className="container mx-auto p-4">로딩 중...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">에러: {error}</div>;

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
                  <Link href={`/fairytale/read?id=${tale.id}`} className="hover:underline">
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