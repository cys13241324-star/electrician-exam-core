/**
 * 평문 수식을 LaTeX 로 변환하는 휴리스틱.
 * 사용자가 LaTeX 문법을 몰라도 자연스럽게 입력한 수식을 보기 좋게 만들기 위함.
 *
 * 입력 예 → 출력 예
 *   "V = I * R"      → "V = I \\times R"
 *   "P = V^2 / R"    → "P = V^{2} \\div R"   (혹은 \\dfrac, 옵션에 따라)
 *   "sqrt(2) / 3"    → "\\dfrac{\\sqrt{2}}{3}"
 *   "1/2"            → "\\dfrac{1}{2}"
 *   "x^10"           → "x^{10}"
 *   "pi r^2"         → "\\pi r^{2}"
 *   "alpha + beta"   → "\\alpha + \\beta"
 *   "<=, >=, !="     → "\\le, \\ge, \\ne"
 *   "deg"            → "°"
 *   "ohm"            → "\\Omega"
 *
 * 100 % 완벽한 파서는 아니고 자주 보이는 패턴 위주의 변환이다.
 */

const GREEK: Record<string, string> = {
  alpha: "\\alpha",
  beta: "\\beta",
  gamma: "\\gamma",
  delta: "\\delta",
  Delta: "\\Delta",
  epsilon: "\\epsilon",
  eta: "\\eta",
  theta: "\\theta",
  lambda: "\\lambda",
  mu: "\\mu",
  pi: "\\pi",
  rho: "\\rho",
  sigma: "\\sigma",
  Sigma: "\\Sigma",
  tau: "\\tau",
  phi: "\\phi",
  omega: "\\omega",
  Omega: "\\Omega",
};

const UNITS_SYM: Record<string, string> = {
  ohm: "\\Omega",
  Ohm: "\\Omega",
  deg: "°",
  degC: "°\\text{C}",
};

const COMPARE: Array<[RegExp, string]> = [
  [/<=/g, "\\le "],
  [/>=/g, "\\ge "],
  [/!=/g, "\\ne "],
  [/\+-/g, "\\pm "],
  [/->/g, "\\to "],
  [/=>/g, "\\Rightarrow "],
];

/**
 * 한 토큰(=수식 한 조각) 을 LaTeX 로 변환. `$` 감싸기는 하지 않는다.
 */
export function convertExpression(input: string): string {
  let s = input;

  // 0) 공백 정리는 마지막에. 이미 LaTeX 명령(\foo) 가 들어가 있어도 토큰 단위로
  //    안전하게 치환한다.

  // 1) 비교·연산 기호
  for (const [re, rep] of COMPARE) s = s.replace(re, rep);

  // 2) sqrt(...) → \sqrt{...}
  s = s.replace(/sqrt\s*\(([^()]+)\)/g, (_m, inner) => `\\sqrt{${inner}}`);

  // 3) frac(a, b) → \dfrac{a}{b}  (드물지만 지원)
  s = s.replace(
    /frac\s*\(([^(),]+)\s*,\s*([^()]+)\)/g,
    (_m, a, b) => `\\dfrac{${a}}{${b}}`,
  );

  // 4) 그리스 문자·단위 별칭 (단어 경계로)
  for (const [name, latex] of Object.entries(GREEK)) {
    s = s.replace(new RegExp(`\\b${name}\\b`, "g"), latex);
  }
  for (const [name, latex] of Object.entries(UNITS_SYM)) {
    s = s.replace(new RegExp(`\\b${name}\\b`, "g"), latex);
  }

  // 5) 곱셈 표시
  //    숫자/문자 사이의 ' * ' 또는 ' x ' → \times
  s = s.replace(/(\w)\s*\*\s*(\w)/g, "$1 \\times $2");
  s = s.replace(/(\d)\s*x\s*(\d)/g, "$1 \\times $2");

  // 6) 분수: a/b 패턴 (간단형: 한쪽이 토큰일 때) → \dfrac{a}{b}
  //    먼저 괄호 묶음 (foo)/(bar)
  s = s.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, "\\dfrac{$1}{$2}");
  //    숫자/괄호식 / 숫자/괄호식 (간단 토큰만)
  s = s.replace(
    /(\\[a-zA-Z]+\{[^{}]+\}|\\[a-zA-Z]+|\d+(?:\.\d+)?|[A-Za-z_]+(?:_\{[^}]+\}|_\w)?)\s*\/\s*(\\[a-zA-Z]+\{[^{}]+\}|\\[a-zA-Z]+|\d+(?:\.\d+)?|[A-Za-z_]+(?:_\{[^}]+\}|_\w)?)/g,
    "\\dfrac{$1}{$2}",
  );

  // 7) 지수: x^10, x^abc → x^{...} (이미 중괄호 있으면 건너뜀)
  s = s.replace(/\^\s*([A-Za-z0-9.+\-]{2,})/g, (_m, exp) => `^{${exp}}`);

  // 8) 첨자: x_10 → x_{10}  (이미 중괄호 있으면 건너뜀)
  s = s.replace(/_\s*([A-Za-z0-9]{2,})/g, (_m, sub) => `_{${sub}}`);

  // 9) 공백 정리
  s = s.replace(/\s{2,}/g, " ").trim();

  return s;
}

/**
 * 임의의 텍스트를 받아 "수식처럼 보이는 부분"을 자동으로 `$...$` 로 감싸 LaTeX 변환.
 *
 * 동작:
 *   - 이미 `$...$` 로 감싸진 부분은 그대로 둔다.
 *   - 한 줄에 등호·연산자·수식 토큰 비율이 높으면 그 줄 전체를 변환·감싼다.
 *   - 그렇지 않으면 줄 안에서 수식처럼 생긴 토큰만 골라 변환·감싼다.
 */
export function autoWrapMath(input: string): string {
  // 이미 감싸진 영역을 보호한다.
  const SENTINEL = "";
  const protectedFragments: string[] = [];
  let body = input.replace(/\$[^$]+\$/g, (m) => {
    protectedFragments.push(m);
    return `${SENTINEL}${protectedFragments.length - 1}${SENTINEL}`;
  });

  const lines = body.split("\n").map((line) => {
    if (line.trim() === "") return line;

    // 한 줄이 "거의 전부 수식" 이면 전체를 감싼다.
    if (looksLikeWholeLineMath(line)) {
      const inner = convertExpression(line.trim());
      return `$${inner}$`;
    }

    // 그 외에는 줄 안에서 수식 토큰만 골라 감싼다.
    return wrapInlineMathSegments(line);
  });

  let result = lines.join("\n");

  // 보호 영역 복원
  result = result.replace(
    new RegExp(`${SENTINEL}(\\d+)${SENTINEL}`, "g"),
    (_m, idx) => protectedFragments[Number(idx)] ?? "",
  );

  return result;
}

function looksLikeWholeLineMath(line: string): boolean {
  const t = line.trim();
  if (t.length === 0) return false;
  // 한글이 줄의 30 % 이상이면 전체 변환은 위험 — 인라인 변환으로
  const hangul = t.match(/[가-힣]/g)?.length ?? 0;
  if (hangul / t.length > 0.3) return false;
  // 수식 토큰이 있어야 함 (= ^ _ / * \ √ π Ω) — 일반 한 줄 텍스트와 구분
  return /[=^_/*√πΩ\\]|sqrt|frac|alpha|beta|pi/.test(t);
}

/**
 * 줄 안에서 수식처럼 보이는 연속 토큰을 골라 $...$ 로 감싼다.
 * 한글·공백·일반 한국어 단어와 섞여 있을 때 사용.
 */
function wrapInlineMathSegments(line: string): string {
  // 후보 패턴: 변수/숫자/연산자/기호/그리스이름 의 연속
  // 등호 또는 ^_/√* 등의 수식 토큰이 하나라도 들어 있어야 한다.
  const pattern =
    /[A-Za-z0-9_^*/+\-=√πΩ°²³.,()\\]+(?:\s+[A-Za-z0-9_^*/+\-=√πΩ°²³.,()\\]+)*/g;
  return line.replace(pattern, (m) => {
    if (!/[=^_/*√πΩ\\]/.test(m)) return m; // 수식 토큰이 없으면 그대로
    // 양쪽 끝에 붙은 마침표·쉼표는 분리
    const lead = "";
    const tail = "";
    const inner = convertExpression(m.trim());
    return `${lead}$${inner}$${tail}`;
  });
}

/**
 * 자주 쓰는 기호 팔레트 — 입력 도우미용.
 */
export const SYMBOL_PALETTE: Array<{
  label: string;
  insert: string;
  desc?: string;
}> = [
  { label: "×", insert: "\\times ", desc: "곱하기" },
  { label: "÷", insert: "\\div ", desc: "나누기" },
  { label: "²", insert: "^{2}", desc: "제곱" },
  { label: "³", insert: "^{3}", desc: "세제곱" },
  { label: "√", insert: "\\sqrt{}", desc: "제곱근" },
  { label: "𝑎/𝑏", insert: "\\dfrac{}{}", desc: "분수" },
  { label: "π", insert: "\\pi ", desc: "파이" },
  { label: "Ω", insert: "\\Omega ", desc: "옴" },
  { label: "μ", insert: "\\mu ", desc: "마이크로" },
  { label: "Δ", insert: "\\Delta ", desc: "델타" },
  { label: "Σ", insert: "\\sum ", desc: "시그마" },
  { label: "α", insert: "\\alpha " },
  { label: "β", insert: "\\beta " },
  { label: "θ", insert: "\\theta " },
  { label: "ω", insert: "\\omega " },
  { label: "°", insert: "°" },
  { label: "±", insert: "\\pm " },
  { label: "≤", insert: "\\le " },
  { label: "≥", insert: "\\ge " },
  { label: "≠", insert: "\\ne " },
  { label: "∞", insert: "\\infty " },
  { label: "→", insert: "\\to " },
];
