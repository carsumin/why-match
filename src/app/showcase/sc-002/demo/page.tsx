'use client';

// EduBot 데모 페이지

import { useState } from 'react';
import Link from 'next/link';

const QUIZ = [
  {
    subject: '수학',
    question: '이차방정식 x² - 5x + 6 = 0의 두 근의 합은?',
    options: ['3', '5', '6', '11'],
    answer: 1,
    explanation: '이차방정식 ax² + bx + c = 0에서 두 근의 합은 -b/a입니다. 여기서 a=1, b=-5이므로 두 근의 합 = -(-5)/1 = 5입니다.',
  },
  {
    subject: '코딩',
    question: "파이썬에서 리스트 [1, 2, 3, 4, 5]의 마지막 요소를 가져오는 가장 올바른 방법은?",
    options: ['list[5]', 'list[-1]', 'list.last()', 'list.get(-1)'],
    answer: 1,
    explanation: '파이썬에서 음수 인덱스를 사용하면 리스트 끝에서부터 접근할 수 있습니다. list[-1]은 마지막 요소, list[-2]는 끝에서 두 번째 요소입니다.',
  },
];

const SUBJECTS = ['수학', '코딩'];

export default function EduBotDemoPage() {
  const [subject, setSubject] = useState('수학');
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);

  const quiz = QUIZ.find((q) => q.subject === subject) ?? QUIZ[0];

  function handleSelect(idx: number) {
    if (showResult) return;
    setSelected(idx);
  }

  function handleSubmit() {
    if (selected === null) return;
    setShowResult(true);
    if (selected === quiz.answer) {
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  }

  function handleNext() {
    setSelected(null);
    setShowResult(false);
    setSubject(subject === '수학' ? '코딩' : '수학');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="bg-white border-b border-pink-100 px-4 py-3 flex items-center gap-3">
        <Link href="/showcase" className="text-gray-400 hover:text-gray-700 text-sm">← 쇼케이스</Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-bold text-gray-900">EduBot <span className="text-xs font-normal text-gray-400 ml-1">데모</span></span>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
        {/* 학습 현황 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '정답 수', value: correct, icon: '✅' },
            { label: '연속 정답', value: streak, icon: '🔥' },
            { label: '진도율', value: `${Math.min(correct * 34, 100)}%`, icon: '📈' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-pink-100 p-3 text-center">
              <p className="text-lg">{stat.icon}</p>
              <p className="text-base font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 과목 선택 */}
        <div className="flex gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => { setSubject(s); setSelected(null); setShowResult(false); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                subject === s
                  ? 'bg-pink-300 text-white'
                  : 'bg-white border border-pink-100 text-gray-600 hover:bg-pink-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* 문제 카드 */}
        <div className="bg-white rounded-2xl border border-pink-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">{quiz.subject}</span>
            <span className="text-xs text-gray-400">AI 맞춤 문제</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-relaxed">{quiz.question}</p>

          <div className="space-y-2">
            {quiz.options.map((opt, idx) => {
              let style = 'border-gray-100 bg-white text-gray-700';
              if (showResult) {
                if (idx === quiz.answer) style = 'border-green-300 bg-green-50 text-green-800 font-bold';
                else if (idx === selected) style = 'border-red-300 bg-red-50 text-red-700';
              } else if (selected === idx) {
                style = 'border-pink-300 bg-pink-50 text-pink-800 font-semibold';
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${style}`}
                >
                  <span className="mr-2 font-bold text-gray-400">{['①','②','③','④'][idx]}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* 해설 */}
          {showResult && (
            <div className={`rounded-xl p-4 text-sm ${selected === quiz.answer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-bold mb-1">{selected === quiz.answer ? '정답입니다! 🎉' : '아쉽네요 😅'}</p>
              <p className="leading-relaxed text-xs">{quiz.explanation}</p>
            </div>
          )}
        </div>

        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="w-full py-3.5 rounded-2xl bg-pink-400 text-white font-bold text-sm hover:bg-pink-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            제출하기
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl bg-pink-400 text-white font-bold text-sm hover:bg-pink-500 transition-colors"
          >
            다음 문제 →
          </button>
        )}
      </div>
    </div>
  );
}
