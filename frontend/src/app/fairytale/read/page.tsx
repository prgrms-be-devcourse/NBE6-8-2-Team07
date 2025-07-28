'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const FairytaleReader = () => {
  const searchParams = useSearchParams();
  const fairytaleId = searchParams.get('id');
  const [isKeywordPopupOpen, setIsKeywordPopupOpen] = useState(false);

  // Sample data - replace with actual data fetching logic based on fairytaleId
  const fairyTales: { [key: string]: any } = {
    '1': {
      title: '신데렐라',
      content: 
        '옛날 옛적에 신데렐라라는 예쁜 소녀가 살고 있었어요. 신데렐라에게는 못된 새어머니와 두 명의 언니가 있었답니다. 어느 날, 왕자님이 무도회를 열었어요. 새어머니와 언니들은 신데렐라만 남겨두고 무도회에 가버렸어요. 혼자 남은 신데렐라가 슬프게 울고 있을 때, 요정이 나타나 신데렐라에게 예쁜 드레스와 유리구두를 선물해주었어요. 신데렐라는 무도회에 가서 왕자님과 춤을 추었지만, 12시가 되자마자 급하게 집으로 돌아와야 했어요. 왕자님은 신데렐라가 떨어뜨린 유리구두를 가지고 신데렐라를 찾아 나섰고, 마침내 신데렐라를 찾아내어 결혼했답니다.\n\n왕자님과 신데렐라는 행복하게 살았답니다.\n\n모두가 행복하게 살았어요.',
      keywords: {
        CHILD_NAME: ['신데렐라'],
        CHILD_ROLE: ['착한', '예쁜'],
        CHARACTERS: ['새어머니', '언니', '왕자님', '요정'],
        PLACE: ['집', '왕궁'],
        MOOD: ['슬픈', '희망적인', '행복한'],
        LESSON: ['착하게 살면 복을 받는다.'],
      },
    },
    '2': {
        title: '백설공주',
        content: 
            '옛날 옛적에 백설공주라는 아름다운 공주가 살았어요. 공주의 새어머니인 여왕은 자신이 세상에서 가장 아름답다고 생각했지만, 마법 거울이 백설공주가 더 아름답다고 말하자 질투심에 불타올랐어요. 여왕은 사냥꾼에게 백설공주를 죽이라고 명령했지만, 사냥꾼은 공주를 불쌍히 여겨 숲으로 도망치게 해주었어요. 숲속에서 백설공주는 일곱 난쟁이를 만나 함께 살게 되었어요. 하지만 여왕은 백설공주가 살아있다는 것을 알고 독이 든 사과를 이용해 공주를 잠들게 했어요. 슬픔에 잠긴 난쟁이들 앞에 나타난 왕자님이 백설공주에게 입을 맞추자, 공주는 깨어났고 왕자님과 결혼하여 행복하게 살았답니다.\n\n백설공주와 왕자님은 행복하게 살았답니다.',
        keywords: {
            CHILD_NAME: ['백설공주'],
            CHILD_ROLE: ['아름다운', '친절한'],
            CHARACTERS: ['여왕', '사냥꾼', '일곱 난쟁이', '왕자'],
            PLACE: ['성', '숲'],
            MOOD: ['질투', '위기', '행복'],
            LESSON: ['진정한 아름다움은 내면에 있다.'],
        },
    },
  };

  const fairytale = fairytaleId ? fairyTales[fairytaleId] : null;

  if (!fairytale) {
    return <div className="container mx-auto p-4">동화를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-[#FAF9F6] min-h-screen flex flex-col items-center relative">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 mt-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">{fairytale.title}</h1>
        <div className="text-lg leading-relaxed text-gray-700 mb-8">
          <p style={{ whiteSpace: 'pre-line' }}>{fairytale.content}</p>
        </div>
      </div>

      <button 
        onClick={() => setIsKeywordPopupOpen(true)}
        className="fixed bottom-8 right-8 bg-orange-400 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-500 transition-colors cursor-pointer"
      >
        키워드 보기
      </button>

      {isKeywordPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">동화 키워드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-orange-500 text-lg mb-2">주인공 이름</h3>
                <div className="flex flex-wrap gap-2">
                  {fairytale.keywords.CHILD_NAME.map((feature: string, index: number) => (
                    <span key={index} className="bg-orange-400 text-white px-2 py-1 rounded-full text-sm">{feature}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-orange-500 text-lg mb-2">주인공 역할</h3>
                <div className="flex flex-wrap gap-2">
                  {fairytale.keywords.CHILD_ROLE.map((feature: string, index: number) => (
                    <span key={index} className="bg-orange-400 text-white px-2 py-1 rounded-full text-sm">{feature}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-orange-500 text-lg mb-2">등장인물</h3>
                <div className="flex flex-wrap gap-2">
                  {fairytale.keywords.CHARACTERS.map((character: string, index: number) => (
                    <span key={index} className="bg-orange-400 text-white px-2 py-1 rounded-full text-sm">{character}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-orange-500 text-lg mb-2">장소</h3>
                <div className="flex flex-wrap gap-2">
                  {fairytale.keywords.PLACE.map((place: string, index: number) => (
                    <span key={index} className="bg-orange-400 text-white px-2 py-1 rounded-full text-sm">{place}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-orange-500 text-lg mb-2">분위기</h3>
                <div className="flex flex-wrap gap-2">
                  {fairytale.keywords.MOOD.map((item: string, index: number) => (
                    <span key={index} className="bg-orange-400 text-white px-2 py-1 rounded-full text-sm">{item}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-orange-500 text-lg mb-2">교훈</h3>
                <div className="flex flex-wrap gap-2">
                  {fairytale.keywords.LESSON.map((item: string, index: number) => (
                    <span key={index} className="bg-orange-400 text-white px-2 py-1 rounded-full text-sm">{item}</span>
                  ))}
                </div>
              </div>
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


