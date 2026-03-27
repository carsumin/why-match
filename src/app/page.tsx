// 메인 페이지 — 카운트다운 배너, CTA 3개, 진행 중 해커톤 미리보기

import Link from 'next/link';
import { hackathonList, getNearestOngoingHackathon } from '@/data/hackathons';
import CountdownBanner from '@/components/hackathon/CountdownBanner';
import { TagBadge, DdayBadge } from '@/components/ui/Badge';

export default function HomePage() {
  const nearestOngoing = getNearestOngoingHackathon();
  const ongoingHackathons = hackathonList.filter((h) => h.status === 'ongoing');

  return (
    <div className="flex flex-col">
      {/* 카운트다운 배너 */}
      {nearestOngoing && <CountdownBanner hackathon={nearestOngoing} />}

      {/* 히어로 섹션 */}
      <section className="max-w-6xl mx-auto w-full px-4 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            이유 있는 매칭
          </span>
          <br />
          <span className="text-gray-800">해커톤 팀을 찾아드립니다</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
          기술 태그 · 역할 · 활동 시간을 분석해 <strong>점수와 이유</strong>를 함께 보여주는
          해커톤 팀 매칭 서비스입니다.
        </p>

        {/* CTA 3개 카드 */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Link
            href="/hackathons"
            className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <span className="text-4xl">🏆</span>
            <span>해커톤 보러가기</span>
            <span className="text-sm font-normal opacity-80">진행 중·예정 해커톤 확인</span>
          </Link>
          <Link
            href="/camp"
            className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            <span className="text-4xl">👥</span>
            <span>팀 찾기</span>
            <span className="text-sm font-normal opacity-80">팀원 모집·합류 신청</span>
          </Link>
          <Link
            href="/rankings"
            className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
          >
            <span className="text-4xl">📊</span>
            <span>랭킹 보기</span>
            <span className="text-sm font-normal opacity-80">글로벌 참가자 순위</span>
          </Link>
        </div>
      </section>

      {/* 진행 중인 해커톤 미리보기 */}
      {ongoingHackathons.length > 0 && (
        <section className="w-full bg-white border-t border-gray-100 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              🔥 지금 진행 중인 해커톤
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ongoingHackathons.map((hackathon) => (
                <Link
                  key={hackathon.slug}
                  href={hackathon.links.detail}
                  className="block p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">
                      {hackathon.title}
                    </h3>
                    <DdayBadge deadline={hackathon.period.submissionDeadlineAt} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hackathon.tags.map((tag) => (
                      <TagBadge key={tag} label={tag} />
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-400">
                    마감:{' '}
                    {new Date(hackathon.period.submissionDeadlineAt).toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 매칭 공식 소개 */}
      <section className="w-full bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">왜 "이유 있는" 매칭인가요?</h2>
          <p className="text-sm text-gray-500 mb-8">숫자만 보여주는 매칭은 이제 그만</p>
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

      {/* 데이터 없음 상태 (진행 중 해커톤 0개인 경우 대체 메시지) */}
      {ongoingHackathons.length === 0 && (
        <section className="w-full border-t border-gray-100 py-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">현재 진행 중인 해커톤이 없습니다.</p>
            <Link href="/hackathons" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">
              전체 해커톤 보기 →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
