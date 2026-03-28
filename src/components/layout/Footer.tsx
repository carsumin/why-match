// 푸터 컴포넌트

export default function Footer() {
  return (
    <footer className="border-t border-sky-100 bg-sky-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold text-gray-900 tracking-tight">
          WhyMatch
        </span>
        <p className="text-xs text-gray-400">
          © 2025 WhyMatch — 이유 있는 해커톤 팀 매칭
        </p>
      </div>
    </footer>
  );
}
