// 팀원 모집 페이지 — 팀 리스트, hackathon 쿼리 필터, 팀 모집글 생성 모달

import { Suspense } from 'react';
import CampPageContent from './CampPageContent';

export default function CampPage() {
  return (
    // useSearchParams를 사용하는 클라이언트 컴포넌트를 Suspense로 감싸야 함
    <Suspense fallback={<CampSkeleton />}>
      <CampPageContent />
    </Suspense>
  );
}

function CampSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-100 rounded-xl w-40 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
