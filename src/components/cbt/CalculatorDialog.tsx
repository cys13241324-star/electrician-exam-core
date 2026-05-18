"use client";

import { useState } from "react";

const KEYS = [
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "−"],
  ["0", ".", "=", "+"],
];

export default function CalculatorDialog({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(true);

  function inputDigit(d: string) {
    if (overwrite) {
      setDisplay(d === "." ? "0." : d);
      setOverwrite(false);
    } else {
      if (d === "." && display.includes(".")) return;
      setDisplay(display + d);
    }
  }

  function compute(a: number, b: number, op: string): number {
    switch (op) {
      case "+":
        return a + b;
      case "−":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? 0 : a / b;
      default:
        return b;
    }
  }

  function handleOperator(op: string) {
    const current = parseFloat(display);
    if (previous !== null && operator && !overwrite) {
      const result = compute(previous, current, operator);
      setDisplay(String(result));
      setPrevious(result);
    } else {
      setPrevious(current);
    }
    setOperator(op);
    setOverwrite(true);
  }

  function handleEquals() {
    const current = parseFloat(display);
    if (previous !== null && operator) {
      const result = compute(previous, current, operator);
      setDisplay(String(result));
      setPrevious(null);
      setOperator(null);
      setOverwrite(true);
    }
  }

  function handleClear() {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  }

  function handleKey(key: string) {
    if (/[0-9.]/.test(key)) inputDigit(key);
    else if (key === "=") handleEquals();
    else handleOperator(key);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-72 rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-bold text-zinc-900">계산기</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-zinc-500 hover:text-zinc-900"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <div className="mb-3 rounded-md bg-zinc-900 px-3 py-3 text-right font-mono text-2xl text-white">
            {display}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="col-span-4 rounded-md bg-zinc-200 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-300"
            >
              C
            </button>
            {KEYS.flat().map((key) => {
              const isOperator = ["+", "−", "×", "÷", "="].includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKey(key)}
                  className={`rounded-md py-2 text-sm font-semibold transition ${
                    isOperator
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
