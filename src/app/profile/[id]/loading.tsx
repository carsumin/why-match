// 프로필 페이지 스켈레톤 로딩 UI

export default function ProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse">
      {/* 헤더 */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-sky-100 shrink-0" />
        <div className="flex-1 min-w-0 pt-1 space-y-2">
          <div className="h-7 w-32 rounded-lg bg-sky-100" />
          <div className="flex gap-1">
            <div className="h-5 w-16 rounded-full bg-sky-50" />
            <div className="h-5 w-16 rounded-full bg-sky-50" />
          </div>
          <div className="h-4 w-48 rounded-lg bg-sky-50" />
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="mb-6">
        <div className="h-4 w-16 rounded bg-sky-50 mb-3" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-sky-50" />
          ))}
        </div>
      </div>

      {/* 활동 정보 */}
      <div className="mb-6">
        <div className="h-4 w-16 rounded bg-sky-50 mb-3" />
        <div className="h-14 rounded-2xl bg-sky-50" />
      </div>

      {/* 포트폴리오 */}
      <div>
        <div className="h-4 w-16 rounded bg-sky-50 mb-3" />
        <div className="flex gap-3">
          <div className="h-9 w-20 rounded-xl bg-sky-50" />
          <div className="h-9 w-24 rounded-xl bg-sky-50" />
        </div>
      </div>
    </div>
  );
}
