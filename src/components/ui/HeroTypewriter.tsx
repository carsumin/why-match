'use client';

import { useState, useEffect } from 'react';

const LINE2 = '해커톤 팀을 찾아드립니다';

export default function HeroTypewriter() {
  const [line2, setLine2] = useState('');
  const [done, setDone] = useState(false);
  const [cursor, setCursor] = useState(true);

  // 첫째 줄은 즉시 표시, 둘째 줄만 타이핑
  useEffect(() => {
    if (done) return;
    if (line2.length < LINE2.length) {
      const t = setTimeout(
        () => setLine2(LINE2.slice(0, line2.length + 1)),
        75,
      );
      return () => clearTimeout(t);
    } else {
      setDone(true);
    }
  }, [line2, done]);

  // 커서 깜빡임
  useEffect(() => {
    const t = setInterval(() => setCursor((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  const showCursor = !done || cursor;

  return (
    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
      {/* 첫째 줄 — 애니메이션 없이 즉시 표시 */}
      <span className="block text-sky-300 animate-fade-in-up">이유 있는 매칭</span>
      {/* 둘째 줄 — 타이핑 애니메이션 */}
      <span className="block text-pink-300 min-h-[1.2em]">
        {line2}
        <span
          className={`inline-block w-[3px] h-[0.85em] ml-0.5 align-middle rounded-sm bg-pink-300 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 0.1s' }}
        />
      </span>
    </h1>
  );
}
