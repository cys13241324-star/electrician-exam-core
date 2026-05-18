export type Subject = "전기이론" | "전기기기" | "전기설비";

export type SimulatorExample = {
  question: string;
  given: string[];
  solution: string[];
  answer: string;
};

export type SimulatorFormula = {
  name: string;
  expression: string;
  meaning: string;
};

export type Simulator = {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  topic: string;
  status: "available" | "coming_soon";
  htmlPath?: string;
  emoji: string;
  formula?: SimulatorFormula[];
  example?: SimulatorExample;
  examFocus?: { watch: string; why: string };
};

/**
 * 수식은 $...$로 감싸 LaTeX 문법 사용.
 * MathText/InlineMath 컴포넌트가 렌더 처리.
 */

export const simulators: Simulator[] = [
  {
    id: "rlc-resonance",
    title: "RLC 공진 회로",
    description:
      "주파수에 따른 임피던스 변화와 공진점에서의 전류·전압 응답을 그래프로 관찰합니다.",
    subject: "전기이론",
    topic: "교류회로",
    status: "available",
    htmlPath: "/samples/simulator-rlc-resonance.html",
    emoji: "📈",
    formula: [
      {
        name: "공진 주파수",
        expression: "$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$",
        meaning: "$X_L = X_C$ 가 되는 주파수, 임피던스가 R로 최소",
      },
      {
        name: "Q 인자 (선택도)",
        expression: "$Q = \\dfrac{1}{R}\\sqrt{\\dfrac{L}{C}}$",
        meaning: "공진의 날카로움. Q가 클수록 좁고 뾰족한 공진",
      },
      {
        name: "임피던스",
        expression: "$|Z| = \\sqrt{R^2 + (X_L - X_C)^2}$",
        meaning: "$X_L = \\omega L$, $X_C = \\dfrac{1}{\\omega C}$",
      },
    ],
    example: {
      question:
        "$L = 10$ mH, $C = 10\\ \\mu$F인 직렬 RLC 회로의 공진 주파수 $f_0$는 약 몇 Hz인가?",
      given: ["$L = 10 \\times 10^{-3}$ H", "$C = 10 \\times 10^{-6}$ F"],
      solution: [
        "$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$",
        "$LC = 10^{-2} \\times 10^{-5} = 10^{-7}$",
        "$\\sqrt{LC} = 3.16 \\times 10^{-4}$",
        "$f_0 = \\dfrac{1}{2\\pi \\times 3.16 \\times 10^{-4}} \\approx 503$ Hz",
      ],
      answer: "약 503 Hz",
    },
    examFocus: {
      watch:
        "주파수를 올리고 내릴 때 임피던스 곡선이 공진점에서 R까지 푹 꺼지고, 그 순간 전류가 최대로 치솟는 모습을 보세요. R을 바꾸면 Q 인자가 변하며 공진 곡선이 뾰족해지거나 완만해지는 것도 함께 관찰합니다.",
      why: "공진 주파수 $f_0 = 1/(2\\pi\\sqrt{LC})$ 계산과 '공진 시 임피던스 최소·전류 최대' 조건은 전기이론 교류회로에서 단골로 출제됩니다. $X_L = X_C$가 공진 조건이라는 점을 묻는 문제도 자주 나옵니다.",
    },
  },
  {
    id: "circuit-builder",
    title: "회로 종합 분석",
    description:
      "단일·직렬·병렬·직병렬 5가지 회로 패턴에서 옴의 법칙·KCL·KVL·전압분배·전류분배를 한 화면에서 검증하며 학습합니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-circuit-builder.html",
    emoji: "🔧",
    formula: [
      {
        name: "옴의 법칙",
        expression: "$V = I \\cdot R$",
        meaning: "전압·전류·저항 중 둘을 알면 나머지가 결정",
      },
      {
        name: "직렬 합성",
        expression: "$R = R_1 + R_2 + \\cdots$",
        meaning: "전류 동일, 전압 분배",
      },
      {
        name: "병렬 합성",
        expression: "$\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\cdots$",
        meaning: "전압 동일, 전류 분배",
      },
      {
        name: "KCL · KVL",
        expression: "$\\sum I_{in} = \\sum I_{out}, \\quad \\sum V_{loop} = 0$",
        meaning: "분기점·폐회로에서 보존되는 두 법칙",
      },
    ],
    example: {
      question:
        "$V = 12$ V, $R_1 = 10\\ \\Omega$ 직렬 + ($R_2 = 20\\ \\Omega \\parallel R_3 = 30\\ \\Omega$) 회로의 합성저항과 총 전류는?",
      given: [
        "$V = 12$ V",
        "$R_1 = 10\\ \\Omega$ (직렬)",
        "$R_2 = 20\\ \\Omega$, $R_3 = 30\\ \\Omega$ (병렬)",
      ],
      solution: [
        "$R_{23} = \\dfrac{R_2 \\cdot R_3}{R_2 + R_3} = \\dfrac{20 \\times 30}{50} = 12\\ \\Omega$",
        "$R = R_1 + R_{23} = 10 + 12 = 22\\ \\Omega$",
        "$I = \\dfrac{V}{R} = \\dfrac{12}{22} \\approx 0.545$ A",
      ],
      answer: "$R = 22\\ \\Omega$, $I \\approx 0.545$ A",
    },
    examFocus: {
      watch:
        "직병렬 패턴을 바꿔가며 '병렬 부분부터 먼저 합성 → 직렬로 더하기'라는 풀이 순서를 눈으로 따라가 보세요. 같은 화면에서 옴의 법칙·KCL·KVL이 동시에 성립하는지 수치로 검증하는 것이 핵심입니다.",
      why: "합성저항 계산과 전체 전류 구하기는 전기이론 직류회로에서 가장 출제 빈도가 높은 유형입니다. 직렬·병렬 혼합 회로를 단계적으로 줄여 푸는 능력이 곧 점수로 직결됩니다.",
    },
  },
  {
    id: "series-parallel",
    title: "직병렬 회로",
    description:
      "저항을 직렬·병렬로 자유롭게 배치하고 전체 합성 저항과 전류 분배를 즉시 확인합니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-series-parallel.html",
    emoji: "🔀",
    formula: [
      {
        name: "직렬 합성",
        expression: "$R = R_1 + R_2 + R_3$",
        meaning: "전류 동일, 전압 분배",
      },
      {
        name: "병렬 합성",
        expression: "$\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\dfrac{1}{R_3}$",
        meaning: "전압 동일, 전류 분배",
      },
    ],
    example: {
      question:
        "10 Ω과 20 Ω의 저항이 병렬로 연결되어 12 V가 가해질 때 합성저항과 전체 전류는?",
      given: ["$R_1 = 10\\ \\Omega$", "$R_2 = 20\\ \\Omega$", "$V = 12$ V"],
      solution: [
        "$R = \\dfrac{R_1 \\cdot R_2}{R_1 + R_2} = \\dfrac{10 \\times 20}{10 + 20}$",
        "$R = \\dfrac{200}{30} \\approx 6.67\\ \\Omega$",
        "$I = \\dfrac{V}{R} = \\dfrac{12}{6.67} \\approx 1.8$ A",
      ],
      answer: "$R \\approx 6.67\\ \\Omega$, $I \\approx 1.8$ A",
    },
    examFocus: {
      watch:
        "저항을 직렬로 놓으면 합성저항이 단순 합으로 커지고, 병렬로 놓으면 가장 작은 저항보다도 작아진다는 점을 슬라이더로 확인하세요. 동시에 직렬은 전류가 같고 병렬은 전압이 같다는 분배 규칙을 비교 관찰합니다.",
      why: "병렬 합성식 $R = R_1 R_2/(R_1+R_2)$와 '병렬 합성저항은 항상 최소 저항보다 작다'는 성질은 전기이론 직류회로 계산·개념 문제로 빈출됩니다.",
    },
  },
  {
    id: "ohms-law",
    title: "옴의 법칙",
    description:
      "전압·전류·저항 중 두 변수를 잡으면 나머지가 즉시 계산됩니다. 전류 흐름 애니메이션으로 직관 강화.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-ohms-law.html",
    emoji: "⚡",
    formula: [
      {
        name: "옴의 법칙",
        expression: "$V = I \\cdot R$",
        meaning: "$I = V/R$, $R = V/I$ 로 변형 가능",
      },
      {
        name: "전력 공식",
        expression: "$P = V \\cdot I = I^2 R = \\dfrac{V^2}{R}$",
        meaning: "단위는 와트 [W]",
      },
    ],
    example: {
      question: "저항 8 Ω에 24 V의 전압을 가했을 때 흐르는 전류와 소비전력은?",
      given: ["$V = 24$ V", "$R = 8\\ \\Omega$"],
      solution: [
        "$I = \\dfrac{V}{R} = \\dfrac{24}{8} = 3$ A",
        "$P = V \\cdot I = 24 \\times 3 = 72$ W",
      ],
      answer: "$I = 3$ A, $P = 72$ W",
    },
    examFocus: {
      watch:
        "두 변수를 고정하고 나머지 하나가 어떻게 따라 변하는지 보세요. 전압을 2배로 올리면 전류도 2배가 되지만 전력은 4배로 커지는 비선형 관계를 전류 흐름 애니메이션과 함께 체감하는 것이 포인트입니다.",
      why: "옴의 법칙과 전력 공식 $P = VI = I^2 R = V^2/R$의 세 가지 변형은 전기이론 직류회로의 가장 기본이자 거의 모든 계산 문제의 출발점입니다.",
    },
  },
  {
    id: "kirchhoff",
    title: "키르히호프 법칙 (KCL/KVL)",
    description:
      "병렬 회로의 분기점에서 KCL을, 폐회로 합으로 KVL을 동시에 검증합니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-kirchhoff.html",
    emoji: "🔗",
    formula: [
      {
        name: "전류 법칙 (KCL)",
        expression: "$\\sum I_{in} = \\sum I_{out}$",
        meaning: "한 접점에서 들어가는 전류 = 나오는 전류",
      },
      {
        name: "전압 법칙 (KVL)",
        expression: "$\\sum V_{loop} = 0$",
        meaning: "폐회로 한 바퀴 전압 합은 0",
      },
    ],
    example: {
      question:
        "12 V 전압원에 $R_1 = 4\\ \\Omega$, $R_2 = 6\\ \\Omega$이 병렬로 연결되어 있다. 각 분기 전류와 전체 전류는?",
      given: ["$V = 12$ V", "$R_1 = 4\\ \\Omega$, $R_2 = 6\\ \\Omega$"],
      solution: [
        "병렬이므로 $V_{R_1} = V_{R_2} = 12$ V",
        "$I_1 = \\dfrac{V}{R_1} = \\dfrac{12}{4} = 3$ A",
        "$I_2 = \\dfrac{V}{R_2} = \\dfrac{12}{6} = 2$ A",
        "KCL → $I = I_1 + I_2 = 5$ A",
      ],
      answer: "$I_1 = 3$ A, $I_2 = 2$ A, $I = 5$ A",
    },
    examFocus: {
      watch:
        "분기점에서 들어온 전류와 나간 전류의 합이 항상 같은지(KCL), 폐회로를 한 바퀴 돌 때 전압의 합이 0이 되는지(KVL)를 수치로 확인하세요. 저항을 바꿔도 두 법칙이 깨지지 않는 것이 핵심 관찰점입니다.",
      why: "KCL·KVL은 옴의 법칙으로 바로 안 풀리는 다중 분기·다중 폐회로 문제의 기본 도구로, 전기이론 직류회로에서 분기 전류와 전체 전류를 구하는 형태로 자주 출제됩니다.",
    },
  },
  {
    id: "voltage-divider",
    title: "전압분배 법칙",
    description:
      "직렬 저항회로에서 각 저항이 어떻게 전압을 나눠 가지는지 슬라이더로 직접 조작해 확인합니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-voltage-divider.html",
    emoji: "📊",
    formula: [
      {
        name: "전압분배 공식",
        expression: "$V_n = V \\cdot \\dfrac{R_n}{R_1 + R_2 + \\cdots + R_k}$",
        meaning: "특정 저항에 걸리는 전압은 전체 저항 대비 비율만큼 분배",
      },
      {
        name: "두 저항 직렬",
        expression: "$V_1 = V \\cdot \\dfrac{R_1}{R_1 + R_2}$",
        meaning: "가장 자주 나오는 형태. $V_2$는 $R_2$로 치환",
      },
    ],
    example: {
      question:
        "12 V 전압원에 $R_1 = 4\\ \\Omega$과 $R_2 = 8\\ \\Omega$이 직렬로 연결되었을 때 $R_2$ 양단의 전압은?",
      given: ["$V = 12$ V", "$R_1 = 4\\ \\Omega$", "$R_2 = 8\\ \\Omega$"],
      solution: [
        "$V_2 = V \\cdot \\dfrac{R_2}{R_1 + R_2}$",
        "$V_2 = 12 \\times \\dfrac{8}{4 + 8}$",
        "$V_2 = 12 \\times \\dfrac{8}{12} = 8$ V",
      ],
      answer: "$V_2 = 8$ V",
    },
    examFocus: {
      watch:
        "직렬에서 저항이 클수록 그 양단 전압이 더 크게 분배되는 정비례 관계를 슬라이더로 확인하세요. 모든 저항 전압을 더하면 항상 전원 전압이 된다는 점도 함께 관찰합니다.",
      why: "전압분배 공식 $V_n = V \\cdot R_n/(R_1+R_2+\\cdots)$은 합성저항을 거치지 않고 특정 저항 전압을 바로 구하는 빠른 풀이로, 전기이론 직류회로에서 두 저항 직렬 형태로 빈출됩니다.",
    },
  },
  {
    id: "current-divider",
    title: "전류분배 법칙",
    description:
      "병렬회로에서 각 가지로 흐르는 전류 비율을 시각화. 저항이 작은 쪽에 더 많은 전류가 흐른다는 직관을 굳혀줍니다.",
    subject: "전기이론",
    topic: "직류회로",
    status: "available",
    htmlPath: "/samples/simulator-current-divider.html",
    emoji: "🔀",
    formula: [
      {
        name: "두 저항 병렬 분배",
        expression: "$I_1 = I \\cdot \\dfrac{R_2}{R_1 + R_2}$",
        meaning: "주의: 분자에 자신이 아닌 상대 저항이 옴 (반비례 관계)",
      },
      {
        name: "$N$개 병렬 일반식",
        expression: "$I_n = I \\cdot \\dfrac{1/R_n}{\\sum 1/R_k}$",
        meaning: "컨덕턴스 $G = 1/R$에 비례",
      },
    ],
    example: {
      question:
        "전체 전류 6 A가 흐르는 회로에 $R_1 = 2\\ \\Omega$, $R_2 = 4\\ \\Omega$이 병렬일 때 $R_1$에 흐르는 전류는?",
      given: ["$I = 6$ A", "$R_1 = 2\\ \\Omega$", "$R_2 = 4\\ \\Omega$"],
      solution: [
        "$I_1 = I \\cdot \\dfrac{R_2}{R_1 + R_2}$",
        "$I_1 = 6 \\times \\dfrac{4}{2 + 4}$",
        "$I_1 = 6 \\times \\dfrac{4}{6} = 4$ A",
      ],
      answer: "$I_1 = 4$ A",
    },
    examFocus: {
      watch:
        "병렬 가지에서 저항이 작은 쪽으로 더 많은 전류가 흐른다는 반비례 관계를 시각화로 굳히세요. 특히 2저항 공식에서 분자에 '상대 저항'이 온다는 점($I_1$에 $R_2$)을 헷갈리지 않도록 직접 조작해 확인합니다.",
      why: "전류분배 공식은 분자·분모를 거꾸로 쓰는 실수가 잦아 시험에서 함정으로 자주 출제됩니다. 컨덕턴스 $G=1/R$에 비례한다는 일반식도 함께 묻습니다.",
    },
  },
  {
    id: "three-phase-power",
    title: "3상 교류 전력",
    description:
      "Y/Δ 결선 모두에 통용되는 3상 전력 공식과 선간·상 전압·전류 관계를 실시간으로 비교합니다.",
    subject: "전기이론",
    topic: "교류회로",
    status: "available",
    htmlPath: "/samples/simulator-three-phase-power.html",
    emoji: "⚡",
    formula: [
      {
        name: "3상 유효전력",
        expression: "$P = \\sqrt{3}\\, V_L I_L \\cos\\theta$",
        meaning: "결선 방식과 무관 (선간·선전류 기준)",
      },
      {
        name: "3상 무효전력",
        expression: "$Q = \\sqrt{3}\\, V_L I_L \\sin\\theta$",
        meaning: "단위 [var]",
      },
      {
        name: "3상 피상전력",
        expression: "$S = \\sqrt{3}\\, V_L I_L$",
        meaning: "단위 [VA]. $S^2 = P^2 + Q^2$",
      },
    ],
    example: {
      question:
        "3상 380 V 평형 부하에 선전류 20 A, 역률 0.8 (지상)이 흐를 때 유효전력은?",
      given: ["$V_L = 380$ V", "$I_L = 20$ A", "$\\cos\\theta = 0.8$"],
      solution: [
        "$P = \\sqrt{3}\\, V_L I_L \\cos\\theta$",
        "$P = 1.732 \\times 380 \\times 20 \\times 0.8$",
        "$P \\approx 10{,}530$ W $\\approx 10.5$ kW",
      ],
      answer: "$P \\approx 10.5$ kW",
    },
    examFocus: {
      watch:
        "Y결선과 Δ결선을 전환해도 선간전압·선전류 기준 전력 공식 $P = \\sqrt{3}\\,V_L I_L \\cos\\theta$는 그대로라는 점을 확인하세요. 역률($\\cos\\theta$)을 줄이면 같은 전압·전류에서도 유효전력이 줄고 무효전력이 커지는 변화를 관찰합니다.",
      why: "3상 유효·무효·피상전력 공식과 $S^2 = P^2 + Q^2$ 관계, 그리고 $\\sqrt{3}$ 계수는 전기이론 교류회로의 3상 전력 계산 문제로 매우 자주 출제됩니다.",
    },
  },
  {
    id: "thevenin",
    title: "테브난 정리",
    description:
      "복잡한 회로를 등가 전압원과 등가 저항으로 단순화하는 테브난의 정리를 시각화합니다.",
    subject: "전기이론",
    topic: "회로망 정리",
    status: "available",
    htmlPath: "/samples/simulator-thevenin.html",
    emoji: "🧩",
    examFocus: {
      watch:
        "복잡한 원래 회로와 단순화한 등가 회로(등가 전압원 + 등가 저항)에서 부하에 걸리는 전압·전류가 똑같이 나오는지 비교하세요. 부하 저항을 바꿔도 두 회로의 결과가 일치하는 것이 핵심 관찰점입니다.",
      why: "테브난 정리는 부하만 바뀌는 회로를 반복 계산 없이 단번에 푸는 회로망 정리의 대표 기법으로, 전기이론 회로망 정리 단원에서 등가 회로 변환 문제로 출제됩니다.",
    },
  },
  {
    id: "transformer-ratio",
    title: "변압기 권수비",
    description:
      "1차/2차 권수와 부하를 조절하면서 권수비, 변압비, 전류비의 관계를 직관적으로 학습합니다.",
    subject: "전기기기",
    topic: "변압기",
    status: "available",
    htmlPath: "/samples/simulator-transformer-ratio.html",
    emoji: "🔁",
    formula: [
      {
        name: "권수비 / 변압비",
        expression: "$a = \\dfrac{N_1}{N_2} = \\dfrac{V_1}{V_2}$",
        meaning: "1차 권수와 2차 권수의 비",
      },
      {
        name: "전류비",
        expression: "$\\dfrac{I_2}{I_1} = \\dfrac{N_1}{N_2} = a$",
        meaning: "전류는 권수에 반비례",
      },
      {
        name: "임피던스비",
        expression: "$\\dfrac{Z_1}{Z_2} = a^2$",
        meaning: "1차에서 본 부하 임피던스",
      },
    ],
    example: {
      question:
        "1차 권수 $N_1 = 200$, 2차 권수 $N_2 = 100$인 변압기에 1차 220 V를 가했을 때 2차 단자전압은?",
      given: ["$N_1 = 200$", "$N_2 = 100$", "$V_1 = 220$ V"],
      solution: [
        "$a = \\dfrac{N_1}{N_2} = 2$",
        "$V_2 = \\dfrac{V_1}{a} = \\dfrac{220}{2} = 110$ V",
        "($N_1 > N_2$ → 강압)",
      ],
      answer: "$V_2 = 110$ V (강압)",
    },
    examFocus: {
      watch:
        "권수비 $a$를 키우면 2차 전압은 내려가지만(강압) 2차 전류는 반대로 커지는 '전압·전류 반비례' 관계를 확인하세요. 임피던스는 $a^2$에 비례해 더 크게 변하는 것도 함께 관찰합니다.",
      why: "권수비 = 전압비 = 전류비의 역수, 임피던스비 = $a^2$ 관계는 전기기기 변압기 단원에서 단자전압·전류·강압/승압 판별 문제로 빈출됩니다.",
    },
  },
  {
    id: "induction-motor",
    title: "유도전동기 회전 자계",
    description:
      "3상 권선이 만드는 회전 자계와 슬립의 변화에 따른 토크 곡선을 시각화합니다.",
    subject: "전기기기",
    topic: "유도전동기",
    status: "available",
    htmlPath: "/samples/simulator-induction-motor.html",
    emoji: "🌀",
    formula: [
      {
        name: "동기 속도",
        expression: "$N_s = \\dfrac{120 \\cdot f}{P}$",
        meaning: "$f$ [Hz], $P$ 극수, 단위 [rpm]",
      },
      {
        name: "회전자 속도",
        expression: "$N = N_s \\cdot (1 - s)$",
        meaning: "$s$ = 슬립 ($0 < s < 1$)",
      },
      {
        name: "슬립",
        expression: "$s = \\dfrac{N_s - N}{N_s}$",
        meaning: "동기와 실제 회전속도의 차이 비율",
      },
    ],
    example: {
      question:
        "전원 주파수 60 Hz, 4극 유도전동기의 동기속도와 슬립 4%일 때 회전자 속도는?",
      given: ["$f = 60$ Hz", "$P = 4$ 극", "$s = 0.04$"],
      solution: [
        "$N_s = \\dfrac{120 \\times 60}{4} = 1800$ rpm",
        "$N = N_s(1 - s) = 1800 \\times 0.96 = 1728$ rpm",
      ],
      answer: "$N_s = 1800$ rpm, $N = 1728$ rpm",
    },
    examFocus: {
      watch:
        "극수 $P$를 늘리면 동기속도 $N_s$가 반비례로 느려지고, 슬립 $s$가 커질수록 회전자 속도 $N$이 동기속도에서 더 멀어지는 관계를 토크 곡선과 함께 관찰하세요.",
      why: "동기속도 $N_s = 120f/P$, 회전자 속도 $N = N_s(1-s)$, 슬립 정의는 전기기기 유도전동기 단원에서 속도·슬립 계산 문제로 매우 자주 출제되는 핵심 공식입니다.",
    },
  },
  {
    id: "power-factor",
    title: "역률 개선",
    description:
      "유도성 부하의 무효 전력을 콘덴서로 보상하여 역률을 개선합니다. 페이저·전력 삼각형으로 시각화.",
    subject: "전기이론",
    topic: "교류회로",
    status: "available",
    htmlPath: "/samples/simulator-power-factor.html",
    emoji: "📐",
    formula: [
      {
        name: "전력 삼각형",
        expression: "$S = \\sqrt{P^2 + Q^2}$",
        meaning: "P 유효·Q 무효·S 피상",
      },
      {
        name: "콘덴서 무효",
        expression: "$Q_C = V^2 \\omega C$",
        meaning: "콘덴서로 무효 전력 공급",
      },
      {
        name: "개선 후 역률",
        expression: "$\\cos\\varphi' = P / \\sqrt{P^2+(Q_L-Q_C)^2}$",
        meaning: "Q_C가 클수록 cos φ 1에 가까워짐",
      },
    ],
    examFocus: {
      watch:
        "콘덴서 용량을 키워 무효전력 $Q_C$를 보상할수록 전력 삼각형이 납작해지고 역률 $\\cos\\varphi$가 1에 가까워지는 모습을 페이저와 함께 보세요. 유효전력 $P$는 그대로인데 피상전력 $S$만 줄어드는 것이 관찰 포인트입니다.",
      why: "유도성 부하의 무효전력을 콘덴서로 보상해 역률을 개선하는 원리와 전력 삼각형 $S = \\sqrt{P^2+Q^2}$ 관계는 전기이론 교류회로에서 역률 개선 문제로 자주 출제됩니다.",
    },
  },
];

export function getSimulator(id: string): Simulator | undefined {
  return simulators.find((s) => s.id === id);
}

export const SIMULATOR_SUBJECTS: Subject[] = [
  "전기이론",
  "전기기기",
  "전기설비",
];
