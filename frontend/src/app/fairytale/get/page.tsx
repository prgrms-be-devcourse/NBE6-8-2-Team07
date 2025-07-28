"use client";

import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import Link from 'next/link';

const FairytaleList = () => {
  // Sample data - replace with actual data fetching logic
  const initialFairyTales = [
    { id: 1, title: '신데렐라', createdAt: '2024-07-28', isFavorite: false },
    { id: 2, title: '백설공주', createdAt: '2024-07-27', isFavorite: true },
    { id: 3, title: '인어공주', createdAt: '2024-07-26', isFavorite: false },
    { id: 4, title: '라푼젤', createdAt: '2024-07-25', isFavorite: false },
    { id: 5, title: '잠자는 숲속의 공주', createdAt: '2024-07-24', isFavorite: true },
  ];

  const [fairyTales, setFairyTales] = useState(initialFairyTales);

  const handleToggleFavorite = (id: number) => {
    setFairyTales(
      fairyTales.map((tale) =>
        tale.id === id ? { ...tale, isFavorite: !tale.isFavorite } : tale
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">동화 목록</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-orange-200">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">즐겨찾기</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">제목</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">생성일자</th>
            </tr>
          </thead>
          <tbody className="bg-[#FAF9F6] divide-y divide-gray-200">
            {fairyTales.map((tale) => (
              <tr key={tale.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 whitespace-nowrap">
                  <button onClick={() => handleToggleFavorite(tale.id)} className="text-2xl text-[#FFB347] cursor-pointer">
                    {tale.isFavorite ? <FaStar /> : <FaRegStar />}
                  </button>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <Link href={`/fairytale/read?id=${tale.id}`} className="hover:underline">
                    {tale.title}
                  </Link>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">{tale.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FairytaleList;