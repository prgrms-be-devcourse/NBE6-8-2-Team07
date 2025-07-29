'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Fairytale {
  id: number;
  title: string;
  content: string;
  childName: string;
  childRole: string;
  characters: string;
  place: string;
  lesson: string;
  mood: string;
  createdAt: string;
}

export default function FairytaleDetailPage() {
  const params = useParams();
  const id = params.id;
  const [fairytale, setFairytale] = useState<Fairytale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchFairytale = async () => {
        try {
          const response = await fetch(`http://localhost:8080/fairytales/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch fairytale');
          }
          const data = await response.json();
          setFairytale(data);
        } catch (err) {
          setError('동화를 불러오는 데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchFairytale();
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div>로딩 중...</div></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><div>{error}</div></div>;
  }

  if (!fairytale) {
    return <div className="flex justify-center items-center h-screen"><div>동화를 찾을 수 없습니다.</div></div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{fairytale.title}</h1>
      <div className="text-gray-500 mb-8">{new Date(fairytale.createdAt).toLocaleDateString()}</div>
      <div className="prose lg:prose-xl max-w-none">
        <p>{fairytale.content}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">동화 정보</h2>
        <ul>
          <li><strong>아이 이름:</strong> {fairytale.childName}</li>
          <li><strong>아이 역할:</strong> {fairytale.childRole}</li>
          <li><strong>등장인물:</strong> {fairytale.characters}</li>
          <li><strong>장소:</strong> {fairytale.place}</li>
          <li><strong>교훈:</strong> {fairytale.lesson}</li>
          <li><strong>분위기:</strong> {fairytale.mood}</li>
        </ul>
      </div>
    </div>
  );
}
