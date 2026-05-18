import type { Flashcard } from "./types";
import { theoryCards } from "./cards/theory";
import { machineCards } from "./cards/machine";
import { facilityCards } from "./cards/facility";
import { extraCards } from "./cards/extras";

/**
 * 수식은 $...$로 감싸 LaTeX 문법 사용.
 * MathText 컴포넌트가 텍스트 + 수식을 자동 렌더.
 */

const presetCardsBase: Flashcard[] = [
  // 전기이론 — 직류회로
  {
    id: "p-ohm",
    front: "옴의 법칙은?",
    back: "$V = I \\times R$\n전압은 전류와 저항의 곱.\n변형: $I = \\dfrac{V}{R}$, $R = \\dfrac{V}{I}$",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    hint: "V·I·R 관계식",
    example: {
      question: "8 Ω의 저항에 24 V를 가했을 때 흐르는 전류와 소비전력은?",
      solution: [
        "$I = \\dfrac{V}{R} = \\dfrac{24}{8} = 3\\ \\text{A}$",
        "$P = V \\times I = 24 \\times 3 = 72\\ \\text{W}$",
      ],
      answer: "$I = 3\\ \\text{A},\\ P = 72\\ \\text{W}$",
    },
  },
  {
    id: "p-power",
    front: "전력 P를 구하는 3가지 식?",
    back: "$P = V \\times I$\n$P = I^2 \\times R$\n$P = \\dfrac{V^2}{R}$\n단위는 와트 [W]",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω 저항에 2 A의 전류가 흐를 때 소비전력은?",
      solution: ["$P = I^2 \\times R = 2^2 \\times 10$", "$P = 4 \\times 10 = 40\\ \\text{W}$"],
      answer: "$P = 40\\ \\text{W}$",
    },
  },
  {
    id: "p-kcl",
    front: "키르히호프 전류 법칙(KCL)?",
    back: "한 접점에 들어오는 전류의 합 = 나가는 전류의 합.\n$\\sum I_{in} = \\sum I_{out}$",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question:
        "한 접점에 5 A가 들어오고 두 가지로 분기되어 한 쪽으로 2 A가 흐를 때, 나머지 분기의 전류는?",
      solution: ["KCL: $I_{in} = I_{out}$", "$5 = 2 + I_2$", "$I_2 = 5 - 2 = 3\\ \\text{A}$"],
      answer: "$I_2 = 3\\ \\text{A}$",
    },
  },
  {
    id: "p-kvl",
    front: "키르히호프 전압 법칙(KVL)?",
    back: "폐회로 한 바퀴 돌 때 전압의 합 = 0.\n$\\sum V_{loop} = 0$",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question:
        "12 V 전원에 $R_1 = 4\\ \\Omega$, $R_2 = 8\\ \\Omega$이 직렬로 연결되어 있다. 각 저항에 걸리는 전압은?",
      solution: [
        "$R = R_1 + R_2 = 4 + 8 = 12\\ \\Omega$",
        "$I = \\dfrac{V}{R} = \\dfrac{12}{12} = 1\\ \\text{A}$",
        "$V_{R_1} = I \\cdot R_1 = 1 \\cdot 4 = 4\\ \\text{V}$",
        "$V_{R_2} = I \\cdot R_2 = 1 \\cdot 8 = 8\\ \\text{V}$",
        "검증: $V_{R_1} + V_{R_2} = 12\\ \\text{V}$ ✓ (KVL)",
      ],
      answer: "$V_{R_1} = 4\\ \\text{V},\\ V_{R_2} = 8\\ \\text{V}$",
    },
  },
  {
    id: "p-series",
    front: "직렬 회로의 합성 저항?",
    back: "$R = R_1 + R_2 + R_3 + \\cdots$\n전류는 모든 저항에서 동일, 전압은 분배.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω, 20 Ω, 30 Ω이 직렬로 연결되었을 때 합성저항은?",
      solution: ["$R = R_1 + R_2 + R_3$", "$R = 10 + 20 + 30 = 60\\ \\Omega$"],
      answer: "$R = 60\\ \\Omega$",
    },
  },
  {
    id: "p-parallel",
    front: "병렬 회로의 합성 저항?",
    back: "$\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\cdots$\n전압은 모든 저항에서 동일, 전류는 분배.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "10 Ω과 20 Ω이 병렬로 연결되었을 때 합성저항은?",
      solution: [
        "두 저항 병렬: $R = \\dfrac{R_1 \\cdot R_2}{R_1 + R_2}$",
        "$R = \\dfrac{10 \\times 20}{10 + 20}$",
        "$R = \\dfrac{200}{30} \\approx 6.67\\ \\Omega$",
      ],
      answer: "$R \\approx 6.67\\ \\Omega$",
    },
  },
  // 전기이론 — 교류회로
  {
    id: "p-rlc-resonance",
    front: "RLC 직렬 공진 주파수?",
    back: "$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$\n공진점에서 $X_L = X_C$, 임피던스 $|Z| = R$로 최소.",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "$L = 10\\ \\text{mH}$, $C = 10\\ \\mu\\text{F}$인 직렬 RLC 회로의 공진 주파수는 약 몇 Hz인가?",
      solution: [
        "$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$",
        "$LC = 10^{-2} \\times 10^{-5} = 10^{-7}$",
        "$\\sqrt{LC} = 3.16 \\times 10^{-4}$",
        "$f_0 = \\dfrac{1}{2\\pi \\times 3.16 \\times 10^{-4}} \\approx 503\\ \\text{Hz}$",
      ],
      answer: "약 503 Hz",
    },
  },
  {
    id: "p-impedance",
    front: "RLC 직렬 회로의 임피던스 |Z|?",
    back: "$|Z| = \\sqrt{R^2 + (X_L - X_C)^2}$\n$X_L = \\omega L$, $X_C = \\dfrac{1}{\\omega C}$, $\\omega = 2\\pi f$",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "$R = 6\\ \\Omega$, $X_L = 12\\ \\Omega$, $X_C = 4\\ \\Omega$인 직렬 RLC 회로의 임피던스는?",
      solution: [
        "$|Z| = \\sqrt{R^2 + (X_L - X_C)^2}$",
        "$|Z| = \\sqrt{6^2 + (12 - 4)^2}$",
        "$|Z| = \\sqrt{36 + 64} = \\sqrt{100}$",
        "$|Z| = 10\\ \\Omega$",
      ],
      answer: "$|Z| = 10\\ \\Omega$",
    },
  },
  {
    id: "p-q-factor",
    front: "Q 인자(품질계수)는?",
    back: "$Q = \\dfrac{1}{R}\\sqrt{\\dfrac{L}{C}}$\n공진의 날카로움. Q가 클수록 좁고 뾰족한 공진.",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question:
        "$R = 10\\ \\Omega$, $L = 100\\ \\text{mH}$, $C = 100\\ \\mu\\text{F}$인 회로의 Q 인자는?",
      solution: [
        "$Q = \\dfrac{1}{R}\\sqrt{\\dfrac{L}{C}}$",
        "$\\dfrac{L}{C} = \\dfrac{0.1}{10^{-4}} = 1000$",
        "$\\sqrt{1000} \\approx 31.6$",
        "$Q = \\dfrac{1}{10} \\times 31.6 = 3.16$",
      ],
      answer: "$Q \\approx 3.16$",
    },
  },
  {
    id: "p-3phase-power",
    front: "3상 전력 공식은?",
    back: "$P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos\\varphi$\n$V_L$ 선간전압, $I_L$ 선전류, $\\cos\\varphi$ 역률",
    subject: "전기이론",
    topic: "3상 교류",
    source: "preset",
    example: {
      question:
        "선간전압 380 V, 선전류 10 A, 역률 0.8인 3상 부하의 유효전력은?",
      solution: [
        "$P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos\\varphi$",
        "$P = 1.732 \\times 380 \\times 10 \\times 0.8$",
        "$P \\approx 5{,}265\\ \\text{W} \\approx 5.27\\ \\text{kW}$",
      ],
      answer: "약 5.27 kW",
    },
  },
  // 전기이론 — 전자기
  {
    id: "p-coulomb",
    front: "쿨롱의 법칙은?",
    back: "$F = k \\cdot \\dfrac{Q_1 \\cdot Q_2}{r^2}$\n$k = 9 \\times 10^9\\ \\text{N·m}^2/\\text{C}^2$\n같은 부호 → 반발, 다른 부호 → 흡인",
    subject: "전기이론",
    topic: "정전기",
    source: "preset",
    example: {
      question:
        "거리 0.1 m 떨어진 $Q_1 = 2\\ \\mu\\text{C}$, $Q_2 = 3\\ \\mu\\text{C}$ 사이에 작용하는 정전기력은?",
      solution: [
        "$F = k \\cdot \\dfrac{Q_1 \\cdot Q_2}{r^2}$",
        "$F = 9 \\times 10^9 \\times \\dfrac{2 \\times 10^{-6} \\cdot 3 \\times 10^{-6}}{0.1^2}$",
        "$F = 9 \\times 10^9 \\times \\dfrac{6 \\times 10^{-12}}{0.01}$",
        "$F = 5.4\\ \\text{N}$",
      ],
      answer: "$F = 5.4\\ \\text{N}$",
    },
  },
  {
    id: "p-mutual",
    front: "상호 유도란?",
    back: "한 코일(1차)의 전류 변화 → 자속 변화 → 인접 코일(2차)에 전압 유도.\n$e = M \\cdot \\dfrac{di}{dt}$\n변압기·유도전동기의 원리.",
    subject: "전기이론",
    topic: "전자기 유도",
    source: "preset",
    example: {
      question:
        "상호 인덕턴스 $M = 0.5\\ \\text{H}$, 1차 전류 변화율 $\\dfrac{di}{dt} = 10\\ \\text{A/s}$일 때 2차 유도 기전력은?",
      solution: ["$e = M \\cdot \\dfrac{di}{dt}$", "$e = 0.5 \\times 10 = 5\\ \\text{V}$"],
      answer: "$e = 5\\ \\text{V}$",
    },
  },
  {
    id: "p-parallel-wire",
    front: "평행도선 단위 길이당 자기력?",
    back: "$\\dfrac{F}{L} = \\dfrac{\\mu_0 \\cdot I_1 \\cdot I_2}{2\\pi \\cdot d}$\n$\\mu_0 = 4\\pi \\times 10^{-7}\\ \\text{H/m}$\n같은 방향 → 흡인, 반대 → 반발",
    subject: "전기이론",
    topic: "자기·자기회로",
    source: "preset",
    example: {
      question:
        "거리 0.5 m, 같은 방향으로 각각 10 A씩 흐르는 두 평행 도선의 단위 길이당 힘은?",
      solution: [
        "$\\dfrac{F}{L} = \\dfrac{\\mu_0 \\cdot I_1 \\cdot I_2}{2\\pi \\cdot d}$",
        "$\\dfrac{F}{L} = \\dfrac{4\\pi \\times 10^{-7} \\times 10 \\times 10}{2\\pi \\times 0.5}$",
        "$\\dfrac{F}{L} = 4 \\times 10^{-5}\\ \\text{N/m}$ (흡인)",
      ],
      answer: "$\\dfrac{F}{L} = 4 \\times 10^{-5}\\ \\text{N/m}$ (흡인)",
    },
  },
  // 전기기기 — 변압기
  {
    id: "p-trans-ratio",
    front: "변압기 권수비·변압비·전류비 관계?",
    back: "권수비 $a = \\dfrac{N_1}{N_2}$\n$\\dfrac{V_2}{V_1} = \\dfrac{N_2}{N_1}$\n$\\dfrac{I_2}{I_1} = \\dfrac{N_1}{N_2}$\n임피던스비 $\\dfrac{Z_1}{Z_2} = a^2$",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question:
        "1차 권수 $N_1 = 200$, 2차 권수 $N_2 = 100$인 변압기에 1차 220 V를 가했을 때 2차 단자전압은?",
      solution: [
        "$a = \\dfrac{N_1}{N_2} = \\dfrac{200}{100} = 2$",
        "$V_2 = \\dfrac{V_1}{a} = \\dfrac{220}{2}$",
        "$V_2 = 110\\ \\text{V}$ (강압)",
      ],
      answer: "$V_2 = 110\\ \\text{V}$",
    },
  },
  {
    id: "p-y-delta",
    front: "Y 결선의 선간전압·선전류 관계?",
    back: "Y 결선: $V_L = \\sqrt{3} \\cdot V_p$, $I_L = I_p$\nΔ 결선: $V_L = V_p$, $I_L = \\sqrt{3} \\cdot I_p$",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question: "Y 결선 3상 변압기의 상전압이 220 V일 때 선간전압은?",
      solution: [
        "$V_L = \\sqrt{3} \\cdot V_p$",
        "$V_L = 1.732 \\times 220$",
        "$V_L \\approx 381\\ \\text{V}$",
      ],
      answer: "$V_L \\approx 381\\ \\text{V}$",
    },
  },
  {
    id: "p-trans-loss",
    front: "변압기 손실 2가지?",
    back: "1. 무부하손(철손): 자속에 의한 히스테리시스+와전류 손실\n2. 부하손(동손): 권선 저항에 의한 $I^2 R$ 손실",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    example: {
      question:
        "변압기의 1차 권선 저항이 0.5 Ω일 때, 1차 전류 10 A에서의 동손은?",
      solution: [
        "$P_c = I^2 \\times R$",
        "$P_c = 10^2 \\times 0.5$",
        "$P_c = 100 \\times 0.5 = 50\\ \\text{W}$",
      ],
      answer: "동손 = 50 W",
    },
  },
  // 전기기기 — 회전기
  {
    id: "p-sync-speed",
    front: "유도전동기 동기속도 $N_s$?",
    back: "$N_s = \\dfrac{120 \\cdot f}{P}$ [rpm]\n$f$ 주파수, $P$ 극수",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
    example: {
      question: "전원 주파수 60 Hz, 4극 유도전동기의 동기속도는?",
      solution: [
        "$N_s = \\dfrac{120f}{P}$",
        "$N_s = \\dfrac{120 \\times 60}{4}$",
        "$N_s = 1800\\ \\text{rpm}$",
      ],
      answer: "$N_s = 1800\\ \\text{rpm}$",
    },
  },
  {
    id: "p-slip",
    front: "슬립 s의 정의?",
    back: "$s = \\dfrac{N_s - N}{N_s}$\n$N_s$ 동기속도, $N$ 회전자속도\n$0 < s < 1$, 슬립 0이면 토크도 0",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
    example: {
      question: "동기속도 1800 rpm, 회전자 속도 1728 rpm일 때 슬립은?",
      solution: [
        "$s = \\dfrac{N_s - N}{N_s}$",
        "$s = \\dfrac{1800 - 1728}{1800}$",
        "$s = \\dfrac{72}{1800} = 0.04\\ (4\\%)$",
      ],
      answer: "$s = 0.04\\ (4\\%)$",
    },
  },
  {
    id: "p-dc-emf",
    front: "직류기 유도 기전력?",
    back: "$e = B \\cdot L \\cdot v \\cdot \\sin\\theta$ (한 변 도체)\n정류자가 매 반회전마다 극성을 뒤집어 직류로 출력",
    subject: "전기기기",
    topic: "직류기",
    source: "preset",
    example: {
      question:
        "$B = 1.2\\ \\text{T}$ 자기장 속에서 길이 0.1 m 도체가 2 m/s, 자기장과 수직($\\theta = 90°$)으로 움직일 때 유도 기전력은?",
      solution: [
        "$e = B \\cdot L \\cdot v \\cdot \\sin\\theta$",
        "$e = 1.2 \\times 0.1 \\times 2 \\times 1$",
        "$e = 0.24\\ \\text{V}$",
      ],
      answer: "$e = 0.24\\ \\text{V}$",
    },
  },
  {
    id: "p-sync-power",
    front: "동기기 출력 전력?",
    back: "$P = \\dfrac{E \\cdot V}{X_s} \\cdot \\sin\\delta$\n$E$ 유기기전력, $V$ 단자전압, $X_s$ 동기임피던스, $\\delta$ 부하각\n최대 $P_{max}$는 $\\delta = 90°$에서",
    subject: "전기기기",
    topic: "동기기",
    source: "preset",
    example: {
      question:
        "$E = 220\\ \\text{V}$, $V = 200\\ \\text{V}$, $X_s = 5\\ \\Omega$, 부하각 $\\delta = 30°$일 때 동기기 출력 전력은?",
      solution: [
        "$P = \\dfrac{E \\cdot V}{X_s} \\cdot \\sin\\delta$",
        "$P = \\dfrac{220 \\times 200}{5} \\times \\sin 30°$",
        "$P = 8800 \\times 0.5$",
        "$P = 4400\\ \\text{W} = 4.4\\ \\text{kW}$",
      ],
      answer: "$P = 4.4\\ \\text{kW}$",
    },
  },
  // 전기설비
  {
    id: "p-grounding-rod",
    front: "봉형 접지 저항 공식?",
    back: "$R = \\dfrac{\\rho}{2\\pi L} \\cdot \\ln\\dfrac{4L}{d}$\n$\\rho$ 토양 저항률, $L$ 길이, $d$ 직경",
    subject: "전기설비",
    topic: "접지",
    source: "preset",
    example: {
      question:
        "$\\rho = 100\\ \\Omega \\cdot \\text{m}$, 길이 2 m, 직경 14 mm 봉형 접지 전극의 접지 저항은?",
      solution: [
        "$R = \\dfrac{\\rho}{2\\pi L} \\cdot \\ln\\dfrac{4L}{d}$",
        "$R = \\dfrac{100}{12.57} \\cdot \\ln\\dfrac{8}{0.014}$",
        "$R \\approx 7.96 \\times \\ln(571)$",
        "$R \\approx 7.96 \\times 6.35 \\approx 50.5\\ \\Omega$",
      ],
      answer: "$R \\approx 50.5\\ \\Omega$",
    },
  },
  {
    id: "p-grounding-grade",
    front: "전기 접지 등급 3가지?",
    back: "제1종: 10 Ω 이하 (고압·특고압)\n제2종: 100 Ω 이하 (변압기)\n제3종: 100 Ω 이하 (저압)",
    subject: "전기설비",
    topic: "접지",
    source: "preset",
    example: {
      question:
        "측정한 접지 저항이 75 Ω이고, 제2종 접지 시설일 때 합격 여부는?",
      solution: [
        "제2종 접지 한도: 100 Ω 이하",
        "측정값 75 Ω < 100 Ω",
        "→ 합격",
      ],
      answer: "합격 (75 Ω ≤ 100 Ω)",
    },
  },
  {
    id: "p-circuit-breaker",
    front: "차단기 역시간 특성?",
    back: "$t = \\dfrac{K}{(I/I_n)^2 - 1}$\n전류가 커질수록 트립 시간이 짧아짐.\n단락 시(8배 이상): 즉시 차단 ($t \\leq 0.02\\ \\text{s}$)",
    subject: "전기설비",
    topic: "차단기·보호장치",
    source: "preset",
    example: {
      question:
        "정격 전류 20 A인 MCCB에 60 A (3배)의 과전류가 흐를 때 트립 예상 시간은? ($K = 60$)",
      solution: [
        "$t = \\dfrac{K}{(I/I_n)^2 - 1}$",
        "$\\dfrac{I}{I_n} = \\dfrac{60}{20} = 3$",
        "$t = \\dfrac{60}{3^2 - 1} = \\dfrac{60}{8}$",
        "$t = 7.5\\ \\text{초}$",
      ],
      answer: "$t = 7.5\\ \\text{초}$",
    },
  },
  {
    id: "p-elcb",
    front: "누전차단기(ELCB) 동작 원리?",
    back: "정상 시: 들어가는 전류 = 나오는 전류 (영상전류 0)\n누전 시: 차이 발생 → 영상전류 검출 → 차단",
    subject: "전기설비",
    topic: "차단기·보호장치",
    source: "preset",
    example: {
      question:
        "정격 감도 30 mA의 ELCB에서, 인입 전류 10.000 A, 인출 전류 9.985 A일 때 동작 여부는?",
      solution: [
        "$\\Delta I = 10.000 - 9.985 = 0.015\\ \\text{A} = 15\\ \\text{mA}$",
        "정격 감도 30 mA보다 작음",
        "→ 미동작 (정상 범위)",
      ],
      answer: "미동작 (영상전류 15 mA < 30 mA)",
    },
  },
  {
    id: "p-wire-size",
    front: "전선 굵기 선정 기준?",
    back: "1. 허용전류 (열적 허용)\n2. 전압강하 (3 % 이하 권장)\n3. 기계적 강도",
    subject: "전기설비",
    topic: "전선·케이블",
    source: "preset",
    example: {
      question:
        "220 V 회로에서 6.6 V 이하의 전압 강하를 허용한다면 전압 강하율은?",
      solution: [
        "전압 강하율 $= \\dfrac{V_{drop}}{V_n} \\times 100\\%$",
        "$= \\dfrac{6.6}{220} \\times 100 = 3\\%$",
      ],
      answer: "3 % (권장 한도)",
    },
  },
  {
    id: "p-conduit",
    front: "금속관 공사 vs 합성수지관 공사 차이?",
    back: "금속관: 기계적 강도 강, 부식 가능, 접지 필요\n합성수지관: 절연성 좋고 부식 X, 기계적 강도 약, 옥내·노출에 적합",
    subject: "전기설비",
    topic: "배선공사",
    source: "preset",
    example: {
      question:
        "공장 외부의 노출 배관 공사로 가장 적합한 것은? (부식·기계 강도 고려)",
      solution: [
        "외부 노출 → 부식·기계 충격 위험 모두 존재",
        "금속관: 강도 강하지만 부식 우려 → 도금 처리 필요",
        "합성수지관: 부식 X, 강도는 약함",
        "→ 일반적으로 부식 방지된 금속관(스틸제) 또는 합성수지관 두꺼운 것",
      ],
      answer: "강도 우선이면 금속관(부식방지), 부식 우려가 크면 합성수지관",
    },
  },
  // 전기이론 — 직류회로 보강
  {
    id: "p-wye-delta",
    front: "Y-Δ 변환 (Y → Δ) 공식?",
    back: "$R_{ab} = \\dfrac{R_a R_b + R_b R_c + R_c R_a}{R_c}$\n분자는 두 저항씩 곱한 합, 분모는 마주보는 저항.\n등저항이면 $R_\\Delta = 3 R_Y$.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    hint: "분자 공통, 분모만 바뀜",
    example: {
      question: "Y결선에서 각 변 저항이 모두 5 Ω일 때, 등가 Δ 결선의 변 저항은?",
      solution: [
        "등저항 변환: $R_\\Delta = 3 R_Y$",
        "$R_\\Delta = 3 \\times 5 = 15\\ \\Omega$",
      ],
      answer: "$R_\\Delta = 15\\ \\Omega$",
    },
  },
  {
    id: "p-current-divider",
    front: "전류 분배 법칙 (2저항 병렬)?",
    back: "$I_1 = I \\cdot \\dfrac{R_2}{R_1 + R_2}$\n$I_2 = I \\cdot \\dfrac{R_1}{R_1 + R_2}$\n작은 저항 쪽으로 더 많은 전류.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    hint: "분자에 '반대편' 저항",
    example: {
      question: "병렬 회로에 총 6 A가 흐른다. $R_1 = 4\\ \\Omega$, $R_2 = 8\\ \\Omega$일 때 $R_1$에 흐르는 전류는?",
      solution: [
        "$I_1 = I \\cdot \\dfrac{R_2}{R_1 + R_2}$",
        "$I_1 = 6 \\times \\dfrac{8}{4 + 8} = 6 \\times \\dfrac{8}{12}$",
        "$I_1 = 4\\ \\text{A}$",
      ],
      answer: "$I_1 = 4\\ \\text{A}$",
    },
  },
  {
    id: "p-rc-transient",
    front: "RC 회로 시정수 τ는?",
    back: "$\\tau = R \\cdot C$ [초]\n충전 전압 $v_C(t) = V(1 - e^{-t/\\tau})$\n$t = 5\\tau$에서 약 99 % 도달.",
    subject: "전기이론",
    topic: "직류회로",
    source: "preset",
    example: {
      question: "$R = 10\\ \\text{k}\\Omega$, $C = 100\\ \\mu\\text{F}$인 RC 회로의 시정수는?",
      solution: [
        "$\\tau = R \\cdot C$",
        "$\\tau = 10^4 \\times 10^{-4} = 1\\ \\text{초}$",
      ],
      answer: "$\\tau = 1\\ \\text{초}$",
    },
  },
  // 전기이론 — 정전기 보강
  {
    id: "p-capacitor-energy",
    front: "콘덴서에 저장되는 에너지?",
    back: "$W = \\dfrac{1}{2} C V^2 = \\dfrac{Q^2}{2C} = \\dfrac{1}{2} Q V$\n단위: 줄 [J]",
    subject: "전기이론",
    topic: "정전기",
    source: "preset",
    example: {
      question: "$C = 100\\ \\mu\\text{F}$ 콘덴서에 200 V를 인가했을 때 저장 에너지는?",
      solution: [
        "$W = \\dfrac{1}{2} C V^2$",
        "$W = \\dfrac{1}{2} \\times 10^{-4} \\times 200^2$",
        "$W = \\dfrac{1}{2} \\times 10^{-4} \\times 40000 = 2\\ \\text{J}$",
      ],
      answer: "$W = 2\\ \\text{J}$",
    },
  },
  {
    id: "p-capacitor-combo",
    front: "콘덴서 직렬·병렬 합성?",
    back: "직렬: $\\dfrac{1}{C} = \\dfrac{1}{C_1} + \\dfrac{1}{C_2} + \\cdots$ (저항 병렬과 같은 형태)\n병렬: $C = C_1 + C_2 + \\cdots$ (저항 직렬과 같은 형태)",
    subject: "전기이론",
    topic: "정전기",
    source: "preset",
    hint: "저항과 반대 — 직렬일수록 작아짐",
    example: {
      question: "$C_1 = 6\\ \\mu\\text{F}$, $C_2 = 3\\ \\mu\\text{F}$가 직렬일 때 합성용량은?",
      solution: [
        "$\\dfrac{1}{C} = \\dfrac{1}{6} + \\dfrac{1}{3} = \\dfrac{1}{6} + \\dfrac{2}{6} = \\dfrac{3}{6}$",
        "$C = 2\\ \\mu\\text{F}$",
      ],
      answer: "$C = 2\\ \\mu\\text{F}$",
    },
  },
  // 전기이론 — 자기·자기회로 보강
  {
    id: "p-solenoid-H",
    front: "솔레노이드 내부 자계 H?",
    back: "$H = n \\cdot I$ [AT/m]\n$n$ 단위 길이당 권수, $I$ 전류\n자속밀도 $B = \\mu_0 \\mu_r H$",
    subject: "전기이론",
    topic: "자기·자기회로",
    source: "preset",
    example: {
      question: "길이 0.5 m, 권수 1000회 솔레노이드에 2 A가 흐를 때 내부 자계는?",
      solution: [
        "$n = \\dfrac{N}{L} = \\dfrac{1000}{0.5} = 2000$ [회/m]",
        "$H = n \\cdot I = 2000 \\times 2$",
        "$H = 4000\\ \\text{AT/m}$",
      ],
      answer: "$H = 4000\\ \\text{AT/m}$",
    },
  },
  // 전기이론 — 전자기 유도 보강
  {
    id: "p-self-inductance",
    front: "자기 인덕턴스 L의 에너지?",
    back: "$W = \\dfrac{1}{2} L I^2$ [J]\n유도 기전력: $e = -L \\cdot \\dfrac{di}{dt}$",
    subject: "전기이론",
    topic: "전자기 유도",
    source: "preset",
    example: {
      question: "$L = 0.2\\ \\text{H}$ 코일에 10 A가 흐를 때 자기 에너지는?",
      solution: [
        "$W = \\dfrac{1}{2} L I^2$",
        "$W = \\dfrac{1}{2} \\times 0.2 \\times 10^2$",
        "$W = 0.1 \\times 100 = 10\\ \\text{J}$",
      ],
      answer: "$W = 10\\ \\text{J}$",
    },
  },
  // 전기이론 — 교류회로 보강
  {
    id: "p-rms-avg",
    front: "정현파 실효값·평균값 관계?",
    back: "최댓값 $V_m$ 기준\n실효값 $V_{rms} = \\dfrac{V_m}{\\sqrt{2}} \\approx 0.707 V_m$\n평균값 $V_{avg} = \\dfrac{2 V_m}{\\pi} \\approx 0.637 V_m$\n파형률 $= \\dfrac{V_{rms}}{V_{avg}} \\approx 1.11$",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    example: {
      question: "최댓값 311 V인 정현파의 실효값은?",
      solution: [
        "$V_{rms} = \\dfrac{V_m}{\\sqrt{2}}$",
        "$V_{rms} = \\dfrac{311}{1.414} \\approx 220\\ \\text{V}$",
      ],
      answer: "$V_{rms} \\approx 220\\ \\text{V}$ (한국 상용전압)",
    },
  },
  {
    id: "p-power-factor",
    front: "역률 cos φ와 피상·유효·무효 전력?",
    back: "유효전력 $P = V I \\cos\\varphi$ [W]\n무효전력 $Q = V I \\sin\\varphi$ [Var]\n피상전력 $S = V I = \\sqrt{P^2 + Q^2}$ [VA]\n역률 $\\cos\\varphi = \\dfrac{P}{S}$",
    subject: "전기이론",
    topic: "교류회로",
    source: "preset",
    hint: "전력 삼각형 (P, Q, S)",
    example: {
      question: "$P = 800\\ \\text{W}$, $Q = 600\\ \\text{Var}$일 때 피상전력과 역률은?",
      solution: [
        "$S = \\sqrt{P^2 + Q^2} = \\sqrt{800^2 + 600^2}$",
        "$S = \\sqrt{640000 + 360000} = \\sqrt{1000000} = 1000\\ \\text{VA}$",
        "$\\cos\\varphi = \\dfrac{P}{S} = \\dfrac{800}{1000} = 0.8$",
      ],
      answer: "$S = 1000\\ \\text{VA},\\ \\cos\\varphi = 0.8$",
    },
  },
  // 전기이론 — 3상 교류 보강
  {
    id: "p-3phase-yd-current",
    front: "3상 Δ결선 선전류·상전류 관계?",
    back: "Δ 결선: $I_L = \\sqrt{3} \\cdot I_p$, $V_L = V_p$\nY 결선과 정반대.\n선전류 위상은 상전류보다 30° 지상.",
    subject: "전기이론",
    topic: "3상 교류",
    source: "preset",
    example: {
      question: "Δ 결선 3상 부하의 상전류가 10 A일 때 선전류는?",
      solution: [
        "$I_L = \\sqrt{3} \\cdot I_p$",
        "$I_L = 1.732 \\times 10 \\approx 17.3\\ \\text{A}$",
      ],
      answer: "$I_L \\approx 17.3\\ \\text{A}$",
    },
  },
  // 전기이론 — 비정현파 교류 (빈 챕터, 2장)
  {
    id: "p-fourier-basic",
    front: "비정현파의 푸리에 급수 표현?",
    back: "임의 주기파 = 직류분 + 기본파 + 고조파 합\n$f(t) = a_0 + \\sum_{n=1}^{\\infty}(a_n \\cos n\\omega t + b_n \\sin n\\omega t)$\n$n = 1$: 기본파, $n \\geq 2$: 고조파 (n차)",
    subject: "전기이론",
    topic: "비정현파 교류",
    source: "preset",
    hint: "어떤 파형이든 정현파의 합으로",
    example: {
      question: "주파수 60 Hz의 기본파에 대해 3고조파의 주파수는?",
      solution: [
        "n차 고조파 주파수 $= n \\times f_0$",
        "3고조파: $f_3 = 3 \\times 60$",
        "$f_3 = 180\\ \\text{Hz}$",
      ],
      answer: "$f_3 = 180\\ \\text{Hz}$",
    },
  },
  {
    id: "p-thd",
    front: "왜형률(THD) 정의?",
    back: "$\\text{THD} = \\dfrac{\\sqrt{V_2^2 + V_3^2 + \\cdots}}{V_1} \\times 100\\,\\%$\n$V_1$ 기본파 실효값, $V_n$ n차 고조파 실효값\n작을수록 정현파에 가까움.",
    subject: "전기이론",
    topic: "비정현파 교류",
    source: "preset",
    example: {
      question: "기본파 100 V, 3고조파 30 V, 5고조파 40 V인 비정현파의 왜형률은?",
      solution: [
        "$\\sqrt{V_3^2 + V_5^2} = \\sqrt{30^2 + 40^2} = \\sqrt{900+1600}$",
        "$= \\sqrt{2500} = 50$",
        "$\\text{THD} = \\dfrac{50}{100} \\times 100 = 50\\,\\%$",
      ],
      answer: "$\\text{THD} = 50\\,\\%$",
    },
  },
  // 전기이론 — 회로망 정리 (빈 챕터, 3장)
  {
    id: "p-thevenin",
    front: "테브난 등가 회로?",
    back: "복잡한 능동 회로 → 한 개의 전압원 $V_{Th}$ + 직렬 저항 $R_{Th}$\n$V_{Th}$: 부하 제거 후 단자 개방전압\n$R_{Th}$: 전원 소거(전압원 단락, 전류원 개방) 후 단자에서 본 저항",
    subject: "전기이론",
    topic: "회로망 정리",
    source: "preset",
    hint: "복잡 회로 단순화의 핵심",
    example: {
      question:
        "12 V 전원에 $R_1 = 4\\ \\Omega$ 직렬, $R_2 = 6\\ \\Omega$이 부하단에 병렬일 때 부하단에서 본 $V_{Th}$, $R_{Th}$은?",
      solution: [
        "$V_{Th} = 12 \\times \\dfrac{R_2}{R_1 + R_2} = 12 \\times \\dfrac{6}{10} = 7.2\\ \\text{V}$",
        "전압원 단락 후: $R_{Th} = R_1 \\parallel R_2 = \\dfrac{4 \\times 6}{4+6}$",
        "$R_{Th} = 2.4\\ \\Omega$",
      ],
      answer: "$V_{Th} = 7.2\\ \\text{V},\\ R_{Th} = 2.4\\ \\Omega$",
    },
  },
  {
    id: "p-max-power",
    front: "최대 전력 전달 조건?",
    back: "부하 저항 $R_L$이 등가 내부 저항 $R_{Th}$와 같을 때 최대 전력 전달.\n$R_L = R_{Th}$ 일 때 $P_{max} = \\dfrac{V_{Th}^2}{4 R_{Th}}$",
    subject: "전기이론",
    topic: "회로망 정리",
    source: "preset",
    hint: "임피던스 정합",
    example: {
      question: "$V_{Th} = 20\\ \\text{V}$, $R_{Th} = 5\\ \\Omega$일 때 최대 전력은?",
      solution: [
        "조건: $R_L = R_{Th} = 5\\ \\Omega$",
        "$P_{max} = \\dfrac{V_{Th}^2}{4 R_{Th}} = \\dfrac{20^2}{4 \\times 5}$",
        "$P_{max} = \\dfrac{400}{20} = 20\\ \\text{W}$",
      ],
      answer: "$P_{max} = 20\\ \\text{W}$",
    },
  },
  {
    id: "p-superposition",
    front: "중첩의 원리?",
    back: "여러 독립 전원이 있는 선형 회로에서, 각 전원이 단독으로 작용할 때의 응답을 모두 더한 값 = 전체 응답.\n전원 소거: 전압원 → 단락, 전류원 → 개방.\n전력 계산엔 사용 불가 (비선형).",
    subject: "전기이론",
    topic: "회로망 정리",
    source: "preset",
    example: {
      question: "10 V 전원만 동작 시 부하 전류 2 A, 5 V 전원만 동작 시 -0.5 A. 두 전원 동시 동작 시 부하 전류는?",
      solution: [
        "중첩의 원리: 각 응답을 부호 그대로 합산",
        "$I_{total} = 2 + (-0.5) = 1.5\\ \\text{A}$",
      ],
      answer: "$I_{total} = 1.5\\ \\text{A}$",
    },
  },
  // 전기기기 — 변압기 보강
  {
    id: "p-trans-efficiency",
    front: "변압기 효율 계산?",
    back: "$\\eta = \\dfrac{P_{out}}{P_{out} + P_i + P_c} \\times 100\\,\\%$\n$P_i$ 철손(고정), $P_c = (I/I_n)^2 \\cdot P_{cn}$ 동손\n최대 효율 조건: $P_i = P_c$",
    subject: "전기기기",
    topic: "변압기",
    source: "preset",
    hint: "철손=동손에서 최대",
    example: {
      question: "출력 10 kW, 철손 200 W, 동손 200 W인 변압기의 효율은?",
      solution: [
        "$\\eta = \\dfrac{10000}{10000 + 200 + 200} \\times 100$",
        "$\\eta = \\dfrac{10000}{10400} \\times 100$",
        "$\\eta \\approx 96.2\\,\\%$",
      ],
      answer: "$\\eta \\approx 96.2\\,\\%$",
    },
  },
  // 전기기기 — 유도전동기 보강
  {
    id: "p-im-torque",
    front: "유도전동기 토크-슬립 특성?",
    back: "$T \\propto \\dfrac{s \\cdot V^2 \\cdot r_2}{r_2^2 + (s x_2)^2}$\n슬립 0에서 토크 0, 슬립 1(기동)에서 기동토크.\n최대 토크 슬립 $s_T = \\dfrac{r_2}{x_2}$.\n토크는 전압의 제곱에 비례.",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
    example: {
      question: "유도전동기에 인가되는 전압이 정격의 80 %로 떨어졌을 때 토크는 정격 대비 몇 %?",
      solution: [
        "$T \\propto V^2$",
        "$T' = (0.8)^2 \\times T = 0.64 T$",
        "→ 64 %",
      ],
      answer: "64 % (전압의 제곱에 비례)",
    },
  },
  {
    id: "p-im-proportional",
    front: "유도전동기 비례 추이 (권선형)?",
    back: "권선형 유도전동기에서 2차 저항 $r_2$를 증가시키면 최대 토크 슬립이 비례해서 증가, 최대 토크 크기는 불변.\n→ 외부 저항기로 기동토크 증가·기동전류 감소.",
    subject: "전기기기",
    topic: "유도전동기",
    source: "preset",
    hint: "토크-슬립 곡선이 수평 이동",
    example: {
      question: "2차 저항을 2배로 늘렸을 때 최대 토크가 발생하는 슬립은? (원래 0.05)",
      solution: [
        "비례 추이: $s_T \\propto r_2$",
        "$s_T' = 2 \\times 0.05 = 0.1$",
      ],
      answer: "$s_T = 0.1$",
    },
  },
  // 전기기기 — 정류·전력변환 (빈 챕터, 3장)
  {
    id: "p-rectifier-half",
    front: "단상 반파 정류 회로의 직류 출력?",
    back: "$V_{dc} = \\dfrac{V_m}{\\pi} \\approx 0.318 V_m$\n$V_m$ 교류 최댓값.\n맥동률 약 121 %, 효율 약 40.6 %.",
    subject: "전기기기",
    topic: "정류·전력변환",
    source: "preset",
    example: {
      question: "최댓값 200 V 정현파를 반파 정류 했을 때 직류 평균값은?",
      solution: [
        "$V_{dc} = \\dfrac{V_m}{\\pi}$",
        "$V_{dc} = \\dfrac{200}{3.14} \\approx 63.7\\ \\text{V}$",
      ],
      answer: "$V_{dc} \\approx 63.7\\ \\text{V}$",
    },
  },
  {
    id: "p-rectifier-full",
    front: "단상 전파 정류 회로의 직류 출력?",
    back: "$V_{dc} = \\dfrac{2 V_m}{\\pi} \\approx 0.637 V_m$\n반파의 2배. 맥동률 약 48 %, 효율 약 81.2 %.\n브리지 정류 또는 중간탭 변압기 사용.",
    subject: "전기기기",
    topic: "정류·전력변환",
    source: "preset",
    hint: "반파의 정확히 2배",
    example: {
      question: "실효값 100 V 정현파를 전파 정류 했을 때 직류 평균값은?",
      solution: [
        "$V_m = \\sqrt{2} \\times 100 \\approx 141.4\\ \\text{V}$",
        "$V_{dc} = \\dfrac{2 V_m}{\\pi} = \\dfrac{2 \\times 141.4}{3.14}$",
        "$V_{dc} \\approx 90\\ \\text{V}$",
      ],
      answer: "$V_{dc} \\approx 90\\ \\text{V}$",
    },
  },
  {
    id: "p-smoothing",
    front: "평활 회로의 역할?",
    back: "정류 후 남은 맥동을 줄여 평탄한 직류 만들기.\n커패시터 입력형: 충방전으로 평활, 첨두 부하 큼\nL입력형: 인덕터로 전류 평활, 부하 변동에 강함\n맥동률 $\\gamma = \\dfrac{V_{ripple,rms}}{V_{dc}}$",
    subject: "전기기기",
    topic: "정류·전력변환",
    source: "preset",
    example: {
      question: "직류 100 V 위에 실효값 5 V 리플이 있을 때 맥동률은?",
      solution: [
        "$\\gamma = \\dfrac{V_{ripple,rms}}{V_{dc}} \\times 100$",
        "$\\gamma = \\dfrac{5}{100} \\times 100 = 5\\,\\%$",
      ],
      answer: "맥동률 = 5 %",
    },
  },
  // 전기기기 — 제어기기 (빈 챕터, 2장)
  {
    id: "p-scr",
    front: "SCR(사이리스터)의 동작 원리?",
    back: "PNPN 4층 반도체. 게이트에 트리거 펄스를 주면 도통(ON).\n한번 도통되면 게이트 신호와 무관, 양극 전류가 유지전류 이하로 떨어져야 OFF.\n위상 제어로 전력 조절 가능.",
    subject: "전기기기",
    topic: "제어기기",
    source: "preset",
    hint: "ON은 게이트, OFF는 전류차단",
    example: {
      question: "SCR을 OFF시키는 방법은?",
      solution: [
        "게이트로는 OFF 불가 (래치업)",
        "양극(애노드) 전류를 유지전류 이하로 감소",
        "→ 자연전류영점(AC) 또는 강제전류차단(DC) 활용",
      ],
      answer: "양극 전류를 유지전류 이하로 (자연전류영점 또는 강제전류차단)",
    },
  },
  {
    id: "p-igbt",
    front: "IGBT의 특징과 용도?",
    back: "Insulated Gate Bipolar Transistor.\n입력: MOSFET처럼 절연 게이트(전압 구동) → 구동 손실 작음\n출력: BJT처럼 큰 전류 / 낮은 도통 전압\n→ 인버터, UPS, 전기차 모터 드라이브에 주력.",
    subject: "전기기기",
    topic: "제어기기",
    source: "preset",
    hint: "MOSFET 입력 + BJT 출력",
    example: {
      question: "다음 중 인버터에 가장 많이 쓰이는 전력 반도체는?",
      solution: [
        "고속 스위칭 + 대전류 + 저구동전력 → IGBT",
        "SCR은 자기소호 불가, MOSFET은 대전류에서 손실 큼",
      ],
      answer: "IGBT (가전·산업용 인버터의 표준)",
    },
  },
  // 전기기기 — 특수기기 (빈 챕터, 2장)
  {
    id: "p-stepper",
    front: "스테퍼 모터의 특징?",
    back: "디지털 펄스 입력으로 일정 각도(스텝)씩 회전.\n위치 피드백 없이 정확한 위치 제어 가능 (개루프).\n스텝각 $\\theta_s = \\dfrac{360°}{n \\cdot P}$ ($n$ 상수, $P$ 회전자 극수)\n프린터, CNC, 카메라 줌에 활용.",
    subject: "전기기기",
    topic: "특수기기",
    source: "preset",
    example: {
      question: "1 스텝각이 1.8°인 스테퍼 모터가 1회전 하려면 몇 펄스가 필요한가?",
      solution: [
        "1회전 = 360°",
        "$N = \\dfrac{360°}{1.8°} = 200\\ \\text{펄스}$",
      ],
      answer: "200 펄스",
    },
  },
  {
    id: "p-bldc",
    front: "BLDC 모터의 특징?",
    back: "Brushless DC. 영구자석 회전자 + 고정자 전자석.\n브러시·정류자 없음 → 마모 X, 수명 길고 효율 높음.\n인버터로 전자식 정류 수행. 위치 검출에 홀센서 또는 센서리스 방식.\n드론, EV, PC팬에 광범위.",
    subject: "전기기기",
    topic: "특수기기",
    source: "preset",
    hint: "브러시 없는 DC, 실제는 동기기",
    example: {
      question: "BLDC 모터에서 브러시를 대체하는 것은?",
      solution: [
        "회전자 위치를 검출(홀센서 등)",
        "인버터가 적절한 권선에 전류를 흘려 전자식 정류",
        "→ 기계적 브러시 불필요",
      ],
      answer: "전자식 정류 (인버터 + 위치센서)",
    },
  },
  // 전기기기 — 시험·정격 (빈 챕터, 2장)
  {
    id: "p-insulation-test",
    front: "절연 저항 시험 기준?",
    back: "메거(절연저항계)로 측정. KEC 기준 (저압):\n- SELV/PELV: DC 250 V로 측정, 0.5 MΩ 이상\n- FELV·500 V 이하: DC 500 V, 1.0 MΩ 이상\n- 500 V 초과: DC 1000 V, 1.0 MΩ 이상",
    subject: "전기기기",
    topic: "시험·정격",
    source: "preset",
    hint: "KEC 개정 — 모두 1 MΩ 이상 (저전압 제외)",
    example: {
      question: "380 V 회로의 절연 저항을 측정하니 0.8 MΩ이 나왔다. KEC 기준 합격 여부는?",
      solution: [
        "380 V → FELV·500 V 이하 범주",
        "기준: 1.0 MΩ 이상",
        "측정값 0.8 MΩ < 1.0 MΩ → 불합격",
      ],
      answer: "불합격 (0.8 MΩ < 1.0 MΩ)",
    },
  },
  {
    id: "p-machine-efficiency",
    front: "회전기 효율의 종류?",
    back: "1. 실측 효율 = (출력/입력) × 100  (직접 측정)\n2. 규약 효율 = $\\dfrac{P_{out}}{P_{out} + \\Sigma\\text{손실}} \\times 100$\n3. 발전기 vs 전동기: 발전기 $\\eta = \\dfrac{P_o}{P_o + 손실}$, 전동기 $\\eta = \\dfrac{P_i - 손실}{P_i}$",
    subject: "전기기기",
    topic: "시험·정격",
    source: "preset",
    example: {
      question: "입력 20 kW, 출력 18 kW인 전동기의 효율은?",
      solution: [
        "$\\eta = \\dfrac{P_{out}}{P_{in}} \\times 100$",
        "$\\eta = \\dfrac{18}{20} \\times 100 = 90\\,\\%$",
      ],
      answer: "$\\eta = 90\\,\\%$",
    },
  },
  // 전기설비 — 전선·케이블 보강
  {
    id: "p-wire-color",
    front: "KEC 전선 색상 식별?",
    back: "L1(R) 갈색, L2(S) 흑색, L3(T) 회색\n중성선 N: 청색\n보호도체 PE: 녹/황 띠 (절대 다른 용도로 X)",
    subject: "전기설비",
    topic: "전선·케이블",
    source: "preset",
    hint: "녹/황 띠는 무조건 PE만",
    example: {
      question: "KEC에서 보호도체(PE)에 사용해야 하는 색상은?",
      solution: [
        "L상: 갈/흑/회",
        "N상: 청색",
        "PE: 녹색-노랑 줄무늬 전용",
      ],
      answer: "녹색-노랑 줄무늬 (Green-Yellow)",
    },
  },
  // 전기설비 — 배선재료·공구 (빈 챕터, 2장)
  {
    id: "p-pvc-vs-steel",
    front: "PVC관 vs 강제전선관(스틸)?",
    back: "PVC관(경질비닐): 절연·내식성 우수, 가벼움. 기계 충격·고온에 약함. 옥내·습기 장소 적합.\n강제전선관: 기계 강도 큼, 방화에 강함. 부식 가능 → 도금 필요. 접지 필수.",
    subject: "전기설비",
    topic: "배선재료·공구",
    source: "preset",
    hint: "PVC=절연,경량 / 스틸=강도",
    example: {
      question: "지중매설 배관에서 부식 우려가 가장 적은 관은?",
      solution: [
        "지중매설 → 습기·부식 환경",
        "강제관은 도금 필요, 시간 지나면 부식",
        "PVC관(경질비닐관)은 부식 X",
      ],
      answer: "PVC관(경질비닐관) — 부식에 강함",
    },
  },
  {
    id: "p-tools-basic",
    front: "전기 공사 기본 공구 용도?",
    back: "와이어 스트리퍼: 전선 피복 벗기기 (굵기별 홈)\n압착 펜치(터미널): 단자 압착\n니퍼: 전선 절단\n드라이버: 단자 조임\n검전기: 전압 유무 확인 (비접촉식)\n클램프 미터: 전류 비절단 측정",
    subject: "전기설비",
    topic: "배선재료·공구",
    source: "preset",
    example: {
      question: "활선 상태에서 분전반의 전압 유무를 확인할 때 사용하는 공구는?",
      solution: [
        "활선 접촉은 위험",
        "비접촉식 검전기로 전압 유무 확인",
        "→ 점멸·소리·표시로 활선 여부 안내",
      ],
      answer: "검전기 (비접촉식 네온/디지털)",
    },
  },
  // 전기설비 — 옥내배선 (빈 챕터, 2장)
  {
    id: "p-branch-circuit",
    front: "옥내 분기회로 구성 원칙?",
    back: "주개폐기에서 분기 → 분기 차단기 → 부하.\n분기 길이 3 m 초과 시 분기점 차단기 필요(허용전류 비율 조건).\n전등 회로와 콘센트 회로는 분리 권장.\n분기 전선 굵기는 분기 차단기 정격에 맞춰 선정.",
    subject: "전기설비",
    topic: "옥내배선",
    source: "preset",
    example: {
      question: "주차단기 50 A 회로에서 8 m 길이 분기를 낼 때 분기 차단기 설치 여부는?",
      solution: [
        "분기 길이 3 m 초과 → 분기점에 차단기 원칙",
        "허용전류 비율 조건 미충족 시 반드시 설치",
      ],
      answer: "분기점 차단기 설치 필요 (3 m 초과)",
    },
  },
  {
    id: "p-outlet-circuit",
    front: "주택 콘센트 회로 분리 원칙?",
    back: "전등 회로와 콘센트 회로 분리 (정전 영향 최소화).\n주방·세탁실·욕실 등 부하 큰 곳은 전용 회로(분전반에서 별도 분기).\n욕실 등 습기 장소 콘센트: ELB(누전차단기) 분기 필수.",
    subject: "전기설비",
    topic: "옥내배선",
    source: "preset",
    hint: "전용회로 + 누전차단",
    example: {
      question: "주택 욕실용 콘센트 분기에서 반드시 설치해야 하는 보호장치는?",
      solution: [
        "욕실 = 습기·물 접촉 가능",
        "감전 위험 → 누전차단기(ELB) 의무",
        "정격 감도 15 mA / 동작시간 0.03 초 이하 권장",
      ],
      answer: "고감도 누전차단기(ELB)",
    },
  },
  // 전기설비 — 피뢰·보호 (빈 챕터, 2장)
  {
    id: "p-lightning-rod",
    front: "피뢰침 보호 각도?",
    back: "수뢰부(피뢰침) 정점을 중심으로 한 보호 원뿔.\nKEC: 보호 등급별 보호각 다름 (등급 I 약 25°, IV 약 55°, 높이별 변동).\n회전구체법·메쉬법 등으로도 보호범위 산정.",
    subject: "전기설비",
    topic: "피뢰·보호",
    source: "preset",
    hint: "보호각·회전구체·메쉬",
    example: {
      question: "높이 10 m 피뢰침의 보호각이 45°일 때 지면에서 보호 반경은?",
      solution: [
        "보호 반경 $r = h \\cdot \\tan\\theta$",
        "$r = 10 \\times \\tan 45° = 10 \\times 1$",
        "$r = 10\\ \\text{m}$",
      ],
      answer: "$r = 10\\ \\text{m}$",
    },
  },
  {
    id: "p-spd",
    front: "서지 보호기(SPD) 등급?",
    back: "Type 1(클래스 I): 외부 낙뢰 직접유입 대비 (인입부)\nType 2(클래스 II): 유도 서지 대비 (분전반)\nType 3(클래스 III): 부하 직전 미세 서지 (콘센트)\n다단계 협조 보호 — 상위에서 큰 에너지 흡수, 하위에서 잔류 제한.",
    subject: "전기설비",
    topic: "피뢰·보호",
    source: "preset",
    example: {
      question: "아파트 세대 분전반에 설치하는 SPD의 적절한 등급은?",
      solution: [
        "건물 인입부 ↓ 세대 분전반",
        "유도 서지 대비 단계 → Type 2 (Class II)",
      ],
      answer: "Type 2 (Class II)",
    },
  },
  // 전기설비 — 차단기·보호장치 보강
  {
    id: "p-mcb-vs-mccb",
    front: "MCB vs MCCB 차이?",
    back: "MCB(소형 배선용): 정격전류 ~125 A, 비조정형, 가정·소규모용.\nMCCB(배선용 차단기, 성형): 정격전류 수백~수천 A, 트립 특성 조정 가능, 산업·대용량 분전반.\n둘 다 과전류·단락 보호. 누전 보호는 ELB/ELCB 별도.",
    subject: "전기설비",
    topic: "차단기·보호장치",
    source: "preset",
    example: {
      question: "용량 250 A의 분전반 메인 차단기로 적합한 것은?",
      solution: [
        "MCB는 보통 125 A 이하",
        "250 A → MCCB 영역",
      ],
      answer: "MCCB (Molded Case Circuit Breaker)",
    },
  },
  // 전기설비 — 변전·배전 (빈 챕터, 2장)
  {
    id: "p-substation",
    front: "변전소의 주요 구성?",
    back: "1. 차단기·단로기: 회로 개폐\n2. 변압기: 전압 변환\n3. 보호계전기: 사고 검출\n4. 모선·부스: 전력 분배\n5. 피뢰기(LA): 서지 보호\n6. 계기용 변성기(PT·CT): 계측·보호",
    subject: "전기설비",
    topic: "변전·배전",
    source: "preset",
    hint: "차단·변환·보호·분배",
    example: {
      question: "변전소에서 사고전류를 검출하여 차단기에 트립 신호를 보내는 장치는?",
      solution: [
        "전류·전압을 PT·CT로 받아 판단",
        "판단 후 트립 명령 → 보호계전기(Relay)",
      ],
      answer: "보호계전기",
    },
  },
  {
    id: "p-distribution-voltage",
    front: "한국 송·배전 전압 체계?",
    back: "송전: 765 kV, 345 kV, 154 kV (특고압)\n배전: 22.9 kV-Y (중성점 다중접지, 가공·지중)\n수용가: 380/220 V (3상 4선식) 또는 220 V 단상\n가공배전: 비용↓, 사고 가시성↑ / 지중배전: 미관·안전↑, 비용·복구↑",
    subject: "전기설비",
    topic: "변전·배전",
    source: "preset",
    example: {
      question: "일반 주택가의 전봇대에 가설된 배전선로의 전압은?",
      solution: [
        "한국 표준 배전 전압",
        "주상변압기 1차측 = 22.9 kV-Y",
      ],
      answer: "22.9 kV-Y (중성점 다중접지)",
    },
  },
];

/**
 * 프리셋 카드 = 기존 63장(base) + 과목별 확장 + 보강 카드.
 * 보강 카드는 src/lib/flashcards/cards/extras.ts (공식 변형·단위·기호·기준 위주).
 */
export const presetCards: Flashcard[] = [
  ...presetCardsBase,
  ...theoryCards,
  ...machineCards,
  ...facilityCards,
  ...extraCards,
];

