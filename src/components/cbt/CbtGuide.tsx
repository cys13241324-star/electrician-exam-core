/**
 * CBT 학습 가이드 블록 — "무엇에 집중 / 왜 중요한가"를 간결한 2단 카드로 안내.
 * 시뮬레이터의 examFocus 카드 톤(파랑/앰버 작은 카드)을 따른다.
 * 데이터·라우트와 무관한 순수 표시 컴포넌트.
 */
export default function CbtGuide() {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* 무엇에 집중 — 파랑 */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-blue-800">
          <span aria-hidden>🔎</span> 이렇게 활용하세요
        </p>
        <ul className="mt-3 space-y-1.5 text-sm leading-6 text-blue-900">
          <li>
            <strong>실전처럼</strong> 시간을 재고 한 회차를 끝까지 풀어
            보세요. 시험과 같은 60문항·60분 흐름에 몸을 맞추는 게 먼저예요.
          </li>
          <li>
            채점 직후 <strong>틀린 문항은 바로 복습</strong>하고, 오답노트로
            넘겨 다음 회차 전에 다시 확인하세요.
          </li>
          <li>
            취약 영역이 보이면 <strong>과목별 학습·N회빈출·고난도모음</strong>
            으로 그 부분만 반복해 메우세요.
          </li>
        </ul>
      </div>

      {/* 왜 중요한가 — 앰버 */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-amber-800">
          <span aria-hidden>⭐</span> 왜 중요한가
        </p>
        <ul className="mt-3 space-y-1.5 text-sm leading-6 text-amber-900">
          <li>
            전기기능사 필기는 <strong>CBT(컴퓨터 기반 시험)</strong> 방식이라,
            같은 환경으로 미리 풀어보면 실전 적응도가 올라갑니다.
          </li>
          <li>
            제한 시간 안에 푸는 연습은 <strong>시간 배분 감각</strong>을 길러
            시험장에서 막판에 쫓기는 일을 줄여 줍니다.
          </li>
          <li>
            회차를 반복하면 <strong>약점이 어디인지</strong> 진단되고, 그
            부분을 메우는 학습이 점수로 가장 빨리 이어집니다.
          </li>
        </ul>
      </div>
    </section>
  );
}
