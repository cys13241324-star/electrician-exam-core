"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * 수식 렌더링 컴포넌트.
 *
 * - <InlineMath> · LaTeX 문자열을 인라인 수식으로 렌더 (예: $V = IR$)
 * - <BlockMath>  · 디스플레이 모드(가운데 정렬, 큰 글씨)
 * - <MathText>   · 일반 텍스트 + 인라인 수식($...$) 혼합 렌더
 *                  줄바꿈 \n 도 자동 처리
 */

const RENDER_OPTIONS = {
  throwOnError: false,
  output: "html" as const,
  trust: false,
};

export function InlineMath({ children }: { children: string }) {
  const html = katex.renderToString(children, {
    ...RENDER_OPTIONS,
    displayMode: false,
  });
  return (
    <span
      className="katex-inline align-middle"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function BlockMath({ children }: { children: string }) {
  const html = katex.renderToString(children, {
    ...RENDER_OPTIONS,
    displayMode: true,
  });
  return (
    <div
      className="katex-block my-2 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * 텍스트 안에 $...$ 로 감싼 부분을 수식으로 렌더.
 * 줄바꿈은 자동으로 <br/> 처리.
 *
 * 예시:
 *   "옴의 법칙: $V = IR$ 입니다.\n변형: $I = V/R$"
 */
export function MathText({ children }: { children: string }) {
  const lines = children.split("\n");
  return (
    <>
      {lines.map((line, lineIdx) => {
        const parts = line.split(/(\$[^$]+\$)/g);
        return (
          <span key={lineIdx}>
            {lineIdx > 0 && <br />}
            {parts.map((part, i) => {
              if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
                return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>;
              }
              return <span key={i}>{part}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}
