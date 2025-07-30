"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 모든 슬라이드 객체의 타입을 명확하게 정의하기위한 인터페이스
interface Slide {
  title: string;
  content: string;
  image: string;
  name?: string; // 주인공 슬라이드에만 존재
  role?: string; // 주인공 슬라이드에만 존재
  addedItems?: string[]; // 키워드 슬라이드에만 존재
}

export default function FairytaleCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // useState에 Slide[] 타입을 명시적으로 적용합니다.
  const [slides, setSlides] = useState<Slide[]>([
    {
      title: "아이와 함께 아이만의 동화를 만들어주세요!",
      content:
        "아래 슬라이드들을 따라가며 키워드를 입력해 주세요.\n주인공: 이름과 역할을 하나씩 입력해요.\n등장인물 / 장소 / 분위기 / 교훈: 각 항목에 맞는 키워드를 자유롭게 입력할 수 있어요.\n마지막 슬라이드에서는 입력한 내용을 확인하고, 동화 만들기 버튼을 눌러 나만의 동화를 완성할 수 있어요!",
      image: "",
    },
    {
      title: "주인공",
      content: "주인공의 이름과 역할을 적어주세요.",
      image: "",
      name: "",
      role: "",
    },
    {
      title: "등장인물",
      content: "동화에 등장할 사람이나 동물을 적어주세요.",
      image: "",
      addedItems: [],
    },
    {
      title: "장소",
      content: "동화에 등장할 장소를 적어주세요.",
      image: "",
      addedItems: [],
    },
    {
      title: "분위기",
      content: "동화의 분위기를 적어주세요.",
      image: "",
      addedItems: [],
    },
    {
      title: "교훈",
      content: "동화의 교훈을 적어주세요.",
      image: "",
      addedItems: [],
    },
    {
      title: "입력 내용 확인",
      content:
        "아이와 함께 고른 키워드들이 잘 들어갔는지 마지막으로 체크해볼까요?",
      image: "",
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [slide1NameInput, setSlide1NameInput] = useState("");
  const [showSlide1NameInput, setShowSlide1NameInput] = useState(true);
  const [slide1RoleInput, setSlide1RoleInput] = useState("");
  const [showSlide1RoleInput, setShowSlide1RoleInput] = useState(true);

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
      const slide = newSlides[currentSlide];
      // addedItems 속성이 있는지 확인하여 안전하게 접근합니다.
      if (slide && slide.addedItems) {
        slide.addedItems.push(currentInput.trim());
        setSlides(newSlides);
        setCurrentInput("");
      }
    }
  };

  const handleSaveName = () => {
    if (slide1NameInput.trim()) {
      const newSlides = [...slides];
      const slide = newSlides[1];
      if (slide) {
        slide.name = slide1NameInput.trim();
        setSlides(newSlides);
        setShowSlide1NameInput(false);
      }
    }
  };

  const handleResetName = () => {
    setShowSlide1NameInput(true);
    setSlide1NameInput("");
    const newSlides = [...slides];
    const slide = newSlides[1];
    if (slide) {
      slide.name = "";
      setSlides(newSlides);
    }
  };

  const handleSaveRole = () => {
    if (slide1RoleInput.trim()) {
      const newSlides = [...slides];
      const slide = newSlides[1];
      if (slide) {
        slide.role = slide1RoleInput.trim();
        setSlides(newSlides);
        setShowSlide1RoleInput(false);
      }
    }
  };

  const handleResetRole = () => {
    setShowSlide1RoleInput(true);
    setSlide1RoleInput("");
    const newSlides = [...slides];
    const slide = newSlides[1];
    if (slide) {
      slide.role = "";
      setSlides(newSlides);
    }
  };

  const handleCreateFairytale = async () => {
    setIsLoading(true);
    // 옵셔널 체이닝(?.)과 null 병합 연산자(??)로 안전하게 데이터에 접근합니다.
    const fairytaleCreateRequest = {
      childName: slides[1]?.name ?? "",
      childRole: slides[1]?.role ?? "",
      characters: slides[2]?.addedItems?.join(", ") ?? "",
      place: slides[3]?.addedItems?.join(", ") ?? "",
      mood: slides[4]?.addedItems?.join(", ") ?? "",
      lesson: slides[5]?.addedItems?.join(", ") ?? "",
    };

    try {
      const response = await fetch("http://localhost:8080/fairytales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fairytaleCreateRequest),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Fairytale created successfully:", result);
      router.push(`/fairytale/get/${result.id}`);
    } catch (error) {
      console.error("Failed to create fairytale:", error);
      alert("동화 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="text-white text-2xl">동화가 자라나는 중...</div>
        </div>
      )}
      <div className="relative w-full h-full p-8 bg-[#FAF9F6] rounded-lg shadow-lg flex flex-col">
        <div className="flex-grow p-4">
          {currentSlide === slides.length - 1 ? (
            // 리뷰 슬라이드
            <div className="flex flex-row space-x-4 h-full">
              <div className="flex-1 flex flex-col items-center">
                <div className="mb-4 w-150 h-150 flex items-center justify-center bg-orange-100 text-gray-500 relative">
                  {slides[currentSlide]?.image ? (
                    <img
                      src={slides[currentSlide]?.image}
                      alt="Slide Image"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    "이미지 삽입 공간"
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h2 className="text-3xl font-bold mb-2">
                  {slides[currentSlide]?.title}
                </h2>
                <p className="text-gray-500 text-lg">
                  {slides[currentSlide]?.content}
                </p>
                <div className="mb-2">
                  {slides.slice(1, -1).map((slide, index) => (
                    <div key={index} className="p-4">
                      <h3 className="text-xl font-semibold mb-2 text-orange-500">
                        {slide.title}
                      </h3>
                      {/* name, role, addedItems 속성이 있는지 확인 후 렌더링 */}
                      {slide.name && (
                        <div className="mb-2">
                          <span className="text-lg">이름 : </span>
                          <div className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2">
                            <span className="whitespace-nowrap">
                              {slide.name}
                            </span>
                          </div>
                        </div>
                      )}
                      {slide.role && (
                        <div>
                          <span className="text-lg">역할 : </span>
                          <div className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2">
                            <span className="whitespace-nowrap">
                              {slide.role}
                            </span>
                          </div>
                        </div>
                      )}
                      {slide.addedItems && slide.addedItems.length > 0 && (
                        <div className="flex items-center flex-wrap">
                          {slide.addedItems.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2"
                            >
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
            // 일반 슬라이드
            <div className="flex flex-row space-x-4 h-full">
              <div className="flex-1 flex flex-col items-center">
                <div className="mb-4 w-150 h-150 flex items-center justify-center bg-orange-100 text-gray-500 relative">
                  {slides[currentSlide]?.image ? (
                    <img
                      src={slides[currentSlide]?.image}
                      alt="Slide Image"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    "이미지 삽입 공간"
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h2 className="text-3xl font-bold mb-2">
                  {slides[currentSlide]?.title}
                </h2>
                <p
                  className="text-gray-500 mb-2 text-lg"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {slides[currentSlide]?.content}
                </p>

                {currentSlide === 1 && (
                  <div className="mb-2">
                    {showSlide1NameInput ? (
                      <div className="flex mb-1">
                        <textarea
                          className="w-60 p-2 border border-gray-300 rounded-md resize-none mr-2"
                          rows={1}
                          placeholder="여기에 이름을 입력하세요."
                          value={slide1NameInput}
                          onChange={(e) => setSlide1NameInput(e.target.value)}
                        ></textarea>
                        <button
                          onClick={handleSaveName}
                          className="px-2 py-2 font-bold text-white bg-orange-400 rounded hover:bg-orange-300 cursor-pointer disabled:cursor-not-allowed"
                          disabled={!slide1NameInput.trim()}
                        >
                          저장
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xl">이름 : </span>
                        <div className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">
                          <p className="whitespace-nowrap">{slides[1]?.name}</p>
                          <button
                            onClick={handleResetName}
                            className="ml-1.5 -mr-0.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-orange-300 text-gray-50 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
                          >
                            <svg
                              className="w-2 h-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                    <div className="mt-4">
                      {showSlide1RoleInput ? (
                        <div className="flex mb-1">
                          <textarea
                            className="w-60 p-2 border border-gray-300 rounded-md resize-none mr-2"
                            rows={1}
                            placeholder="여기에 역할을 입력하세요."
                            value={slide1RoleInput}
                            onChange={(e) => setSlide1RoleInput(e.target.value)}
                          ></textarea>
                          <button
                            onClick={handleSaveRole}
                            className="px-2 py-2 font-bold text-white bg-orange-400 rounded hover:bg-orange-300 cursor-pointer disabled:cursor-not-allowed"
                            disabled={!slide1RoleInput.trim()}
                          >
                            저장
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xl">역할 : </span>
                          <div className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">
                            <p className="whitespace-nowrap">
                              {slides[1]?.role}
                            </p>
                            <button
                              onClick={handleResetRole}
                              className="ml-1.5 -mr-0.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-orange-300 text-gray-50 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
                            >
                              <svg
                                className="w-2 h-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {currentSlide > 1 && currentSlide < slides.length - 1 && (
                  <>
                    <div className="flex mb-1">
                      <textarea
                        className="w-60 p-2 border border-gray-300 rounded-md resize-none mr-2"
                        rows={1}
                        placeholder="여기에 키워드를 입력하세요."
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
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
                      {slides[currentSlide]?.addedItems &&
                      slides[currentSlide].addedItems.length > 0 ? (
                        <div className="flex flex-wrap">
                          {slides[currentSlide].addedItems.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="inline-flex items-center bg-orange-400 text-gray-50 text-xl font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2"
                              >
                                <span className="whitespace-nowrap">
                                  {item}
                                </span>
                                <button
                                  onClick={() => {
                                    const newSlides = [...slides];
                                    const slide = newSlides[currentSlide];
                                    if (slide && slide.addedItems) {
                                      slide.addedItems.splice(index, 1);
                                      setSlides(newSlides);
                                    }
                                  }}
                                  className="ml-1.5 -mr-0.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-orange-300 text-gray-50 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
                                >
                                  <svg
                                    className="w-2 h-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          입력된 키워드가 없습니다.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
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
