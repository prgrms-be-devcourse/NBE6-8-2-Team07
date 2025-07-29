'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FairytaleCreatePage() {
  const router = useRouter();
  const [slides, setSlides] = useState([
    { title: '동화를 쓰기에 앞서', content: '생성방법 설명창', image: '', addedItems: [], name: '' },
    { title: '주인공', content: '주인공의 이름과 역할을 적어주세요.', image: '', addedItems: [], name: '' },
    { title: '등장인물', content: '동화에 등장할 사람이나 동물을 적어주세요.', image: '', addedItems: [], name: '' },
    { title: '장소', content: '동화에 등장할 장소를 적어주세요.', image: '', addedItems: [], name: '' },
    { title: '분위기', content: '동화의 분위기를 적어주세요.', image: '', addedItems: [], name: '' },
    { title: '교훈', content: '동화의 교훈을 적어주세요.', image: '', addedItems: [], name: '' },
    { title: '입력 내용 확인', content: '지금까지 입력한 내용을 확인해주세요.', image: '', addedItems: [], name: '' },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [slide1SpecificInput, setSlide1SpecificInput] = useState('');
  const [showSlide1SpecificInput, setShowSlide1SpecificInput] = useState(true);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleAdd = () => {
    if (currentInput.trim()) {
      const newSlides = [...slides];
      newSlides[currentSlide].addedItems.push(currentInput.trim());
      setSlides(newSlides);
      setCurrentInput('');
    }
  };

  const handleSaveSlide1SpecificContent = () => {
    if (slide1SpecificInput.trim()) {
      const newSlides = [...slides];
      newSlides[1].name = slide1SpecificInput.trim();
      setSlides(newSlides);
      setShowSlide1SpecificInput(false);
    }
  };
  
  const handleResetName = () => {
    setShowSlide1SpecificInput(true);
    setSlide1SpecificInput('');
    const newSlides = [...slides];
    newSlides[1].name = '';
    setSlides(newSlides);
  };

  const handleCreateFairytale = async () => {
    const fairytaleCreateRequest = {
      childName: slides[1].name,
      childRole: slides[1].addedItems.join(', '),
      characters: slides[2].addedItems.join(', '),
      place: slides[3].addedItems.join(', '),
      mood: slides[4].addedItems.join(', '),
      lesson: slides[5].addedItems.join(', '),
    };

    try {
      const response = await fetch('http://localhost:8080/fairytales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fairytaleCreateRequest),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Fairytale created successfully:', result);
      router.push(`/fairytale/get/${result.id}`);
    } catch (error) {
      console.error('Failed to create fairytale:', error);
      alert('동화 생성에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="relative w-full h-full p-8 bg-[#FAF9F6] rounded-lg shadow-lg flex flex-col">
        {/* 슬라이드 내용 영역 */}
        <div className="flex-grow p-4">
          {currentSlide === slides.length - 1 ? (
            // Review Slide
            <div className="flex flex-row space-x-4 h-full">
              <div className="flex-1 flex flex-col items-center">
                <div className="mb-4 w-150 h-150 flex items-center justify-center bg-orange-100 text-gray-500 relative">
                  {slides[currentSlide].image ? (
                    <img src={slides[currentSlide].image} alt="Slide Image" className="max-h-full max-w-full object-contain" />
                  ) : (
                    "이미지 삽입 공간"
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h2 className="text-3xl font-bold mb-2">{slides[currentSlide].title}</h2>
                <p className="text-gray-500 mb-4 text-lg">{slides[currentSlide].content}</p>
                <div className="mb-2">
                  {slides.slice(1, -1).map((slide, index) => (
                    <div key={index} className="p-4">
                      <h3 className="text-xl font-semibold mb-4 text-orange-500">{slide.title}</h3>
                      {index === 0 && slide.name && (
                        <>
                          <span className="text-lg">이름 : </span>
                          <div className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">
                            <span className="whitespace-nowrap">{slide.name}</span>
                          </div>
                        </>
                      )}
                      {slide.addedItems.length > 0 && (
                        <div className="mt-2 flex items-center flex-wrap">
                          {index === 0 && <span className="text-lg mr-2">역할 :</span>}
                          {slide.addedItems.map((item, itemIndex) => (
                            <div key={itemIndex} className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">
                              <span className="whitespace-nowrap">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Normal Slides
            <div className="flex flex-row space-x-4 h-full">
              <div className="flex-1 flex flex-col items-center">
                <div className="mb-4 w-150 h-150 flex items-center justify-center bg-orange-100 text-gray-500 relative">
                  {slides[currentSlide].image ? (
                    <img src={slides[currentSlide].image} alt="Slide Image" className="max-h-full max-w-full object-contain" />
                  ) : (
                    "이미지 삽입 공간"
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h2 className="text-3xl font-bold mb-2">{slides[currentSlide].title}</h2>
                <p className="text-gray-500 mb-2 text-lg">{slides[currentSlide].content}</p>

                {currentSlide === 1 && (
                  <div className="mb-2">
                    {showSlide1SpecificInput ? (
                      <div className="flex mb-1">
                        <textarea
                          className="w-60 p-2 border border-gray-300 rounded-md resize-none mr-2"
                          rows={1}
                          placeholder="여기에 이름을 입력하세요."
                          value={slide1SpecificInput}
                          onChange={(e) => setSlide1SpecificInput(e.target.value)}
                        ></textarea>
                        <button
                          onClick={handleSaveSlide1SpecificContent}
                          className="px-2 py-2 font-bold text-white bg-orange-400 rounded hover:bg-orange-300 cursor-pointer disabled:cursor-not-allowed"
                          disabled={!slide1SpecificInput.trim()}
                        >
                          저장
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xl">이름 : </span>
                        <div className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">
                          <p className="whitespace-nowrap">{slides[1].name}</p>
                          <button
                            onClick={handleResetName}
                            className="ml-1.5 -mr-0.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-orange-300 text-gray-50 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
                          >
                            <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {currentSlide > 0 && currentSlide < slides.length - 1 && (
                  <>
                    <div className="flex mb-1">
                      <textarea
                        className="w-60 p-2 border border-gray-300 rounded-md resize-none mr-2"
                        rows={1}
                        placeholder="여기에 키워드를 입력하세요."
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAdd();
                          }
                        }}
                      ></textarea>
                      <button
                        onClick={handleAdd}
                        className="px-2 py-2 font-bold text-white bg-orange-400 rounded hover:bg-orange-300 cursor-pointer disabled:cursor-not-allowed"
                        disabled={!currentInput.trim()}
                      >
                        추가
                      </button>
                    </div>
                    <div className="mt-1 p-2 rounded-md bg-gray-50 overflow-y-auto">
                      {slides[currentSlide].addedItems.length > 0 ? (
                        <div className="flex flex-wrap">
                          {currentSlide === 1 && slides[currentSlide].addedItems.length > 0 && (
                            <span className="text-lg mr-2">역할 :</span>
                          )}
                          {slides[currentSlide].addedItems.map((item, index) => (
                            <div key={index} className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">
                              <span className="whitespace-nowrap">{item}</span>
                              <button
                                onClick={() => {
                                  const newSlides = [...slides];
                                  newSlides[currentSlide].addedItems.splice(index, 1);
                                  setSlides(newSlides);
                                }}
                                className="ml-1.5 -mr-0.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-orange-300 text-gray-50 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
                          >
                                <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">입력된 키워드가 없습니다.</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        {/* 버튼 영역 */}
        <div className="sticky bottom-5 bg-[#FAF9F6] pt-4 mt-4">
          <div className="mb-2 text-2xl text-right">
            <span className="text-gray-600">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="px-4 py-2 mr-2 font-bold text-white bg-orange-400 rounded disabled:bg-gray-400 hover:bg-orange-300 cursor-pointer"
            >
              이전
            </button>
            {currentSlide === 6 ? (
              <button
                onClick={handleCreateFairytale}
                className="px-4 py-2 font-bold text-white bg-orange-600 rounded hover:bg-orange-500 cursor-pointer"
              >
                동화 만들기
              </button>
            ) : (
              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="px-4 py-2 font-bold text-white bg-orange-400 rounded disabled:bg-gray-400 hover:bg-orange-300 cursor-pointer"
              >
                다음
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
