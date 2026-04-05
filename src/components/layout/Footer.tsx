// 푸터 컴포넌트

export default function Footer() {
  return (
    <footer className="border-t border-[#dde4f5] bg-[#f0f3fb] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold text-[#4f72c4] tracking-tight">
          WhyMatch
        </span>
        <p className="text-xs text-slate-400">
          © 2026 WhyMatch — 이유 있는 해커톤 팀 매칭
        </p>
      </div>
    </footer>
  );
}
