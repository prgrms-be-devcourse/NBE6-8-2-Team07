'use client';

export default function IntroductionPage() {
  return (
    <>
        <section className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">
                내 아이만을 위한 AI 동화와 함께 아이의 상상력을 펼쳐주세요!
            </div>
            <div className="text-2xl font-bold">
                동화공방은 사용자가 입력한 키워드를 바탕으로  
                AI가 창의적인 이야기를 만들어주는 맞춤형 동화 생성 서비스입니다.
            </div>
            <div className="text-2xl font-bold">
                동화공방은 아이의 상상력을 키우고, 동화를 통해 이야기를 풀어내는 과정에서 
                아이의 창의적인 사고력과 언어 능력을 향상시키는 데 도움을 줍니다.
            </div>
        </section>
        <section>
            <div className="text-2xl font-bold">
                주요 기능
            </div>
            <ul className="list-disc list-inside">
                <li>키워드 기반 AI 동화 자동 생성</li>
                <li>아이 이름, 성격, 관심사를 반영한 캐릭터 생성</li>
                <li>장소, 분위기, 교훈을 직접 설정 가능</li>
                <li>생성된 동화 저장 및 다시보기 기능</li>
            </ul>
        </section>
        <section>
            <div className="text-2xl font-bold">
                내 아이가 동화 속 주인공이 된다면 어떨까요?<br/>
            </div>
            <div className="text-2xl font-bold">
                지금 바로 새로운 이야기를 시작해보세요.
            </div>
        </section>
    </>
  );
}