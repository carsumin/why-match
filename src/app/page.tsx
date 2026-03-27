// 메인 페이지 — 카운트다운 배너 + CTA 3개

import Link from 'next/link';
import { getNearestDeadlineHackathon } from '@/data/hackathons';
import { DdayBadge } from '@/components/ui/Badge';

export default function HomePage() {
  // 가장 임박한 해커톤 마감 정보
  const nearestHackathon = getNearestDeadlineHackathon();

  return (
    <div className="flex flex-col items-center">
      {/* 카운트다운 배너 */}
      {nearestHackathon && (
        <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-medium">
              ⏰ <strong>{nearestHackathon.title}</strong> 팀 모집 마감 임박!
            </p>
            <div className="flex items-center gap-2">
              <DdayBadge deadline={nearestHackathon.deadline} />
              <Link
                href={`/hackathons/${nearestHackathon.slug}`}
                className="text-xs underline underline-offset-2 hover:opacity-80"
              >
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 히어로 섹션 */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            이유 있는 매칭
          </span>
          <br />
          <span className="text-gray-800">해커톤 팀을 찾아드립니다</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
          기술 태그 · 역할 · 활동 시간을 분석해 <strong>점수와 이유</strong>를 함께 보여주는
          해커톤 팀 매칭 서비스입니다.
        </p>

        {/* CTA 3개 */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/camp"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            팀원 찾기 →
          </Link>
          <Link
            href="/hackathons"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            해커톤 둘러보기
          </Link>
          <Link
            href="/camp/simulate"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            팀 시뮬레이터
          </Link>
        </div>
      </section>

      {/* 매칭 공식 소개 섹션 */}
      <section className="w-full bg-white border-t border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">왜 "이유 있는" 매칭인가요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-indigo-50">
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">40%</div>
              <div className="font-semibold text-gray-700">태그 일치</div>
              <p className="text-sm text-gray-500 mt-1">보유 기술 스택이 팀과 얼마나 맞는지</p>
            </div>
            <div className="p-6 rounded-2xl bg-purple-50">
              <div className="text-4xl font-extrabold text-purple-600 mb-2">40%</div>
              <div className="font-semibold text-gray-700">역할 필요도</div>
              <p className="text-sm text-gray-500 mt-1">팀이 필요로 하는 역할과 일치하는지</p>
            </div>
            <div className="p-6 rounded-2xl bg-green-50">
              <div className="text-4xl font-extrabold text-green-600 mb-2">20%</div>
              <div className="font-semibold text-gray-700">활동 시간</div>
              <p className="text-sm text-gray-500 mt-1">하루 평균 참여 가능 시간이 맞는지</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
