'use client';

// 해커톤 상세 탭 컴포넌트 — 7개 탭 (개요·평가·일정·상금·팀·제출·리더보드)

import { useState } from 'react';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';
import InfoModal from './InfoModal';
import SubmitModal from './SubmitModal';
import LeaderboardModal from './LeaderboardModal';
import { TagBadge } from '@/components/ui/Badge';
import type { HackathonDetail, HackathonTab, Leaderboard } from '@/types';

interface HackathonTabsProps {
  detail: HackathonDetail;
  status: 'ongoing' | 'ended' | 'upcoming';
  startAt: string;
  submissionDeadlineAt: string;
  leaderboard: Leaderboard | undefined;
}

const TABS: HackathonTab[] = ['개요', '평가', '일정', '상금', '팀', '제출', '리더보드'];

/** 원 단위 포맷 (예: 3000000 → "3,000,000원") */
function formatKRW(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

/** ISO 날짜를 "YYYY.MM.DD HH:MM" 로 포맷 */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

export default function HackathonTabs({
  detail,
  status,
  startAt,
  submissionDeadlineAt,
  leaderboard,
}: HackathonTabsProps) {
  const [activeTab, setActiveTab] = useState<HackathonTab>('개요');
  const [infoModal, setInfoModal] = useState<'rules' | 'faq' | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const { sections } = detail;
  const now = Date.now();

  function handleFieldChange(key: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: false }));
  }

  function handleFileChange(key: string, file: File | undefined) {
    setFileNames((prev) => ({ ...prev, [key]: file?.name ?? '' }));
    setFormErrors((prev) => ({ ...prev, [key]: false }));
  }

  /** 파일 타입 여부 */
  function isFileFormat(format: string) {
    return format === 'zip' || format === 'pdf';
  }

  /** 제출 전 유효성 검사 — 빈 필드 key 반환 */
  function validate(): string[] {
    const keys = sections.submit.submissionItems
      ? sections.submit.submissionItems.map((i) => ({ key: i.key, format: i.format }))
      : sections.submit.allowedArtifactTypes.map((t) => ({ key: t, format: t }));

    return keys
      .filter(({ key, format }) =>
        isFileFormat(format) ? !fileNames[key] : !(fieldValues[key] ?? '').trim()
      )
      .map(({ key }) => key);
  }

  function handleSubmitClick() {
    const invalid = validate();
    if (invalid.length > 0) {
      const errors: Record<string, boolean> = {};
      invalid.forEach((k) => { errors[k] = true; });
      setFormErrors(errors);
      return;
    }
    setSubmitOpen(true);
  }

  /** 제출 모달에 넘길 항목 목록 조합 */
  function buildSubmitItems() {
    if (sections.submit.submissionItems) {
      return sections.submit.submissionItems.map((item) => ({
        key: item.key,
        title: item.title,
        format: item.format,
        value: isFileFormat(item.format)
          ? (fileNames[item.key] ?? '')
          : (fieldValues[item.key] ?? ''),
      }));
    }
    return sections.submit.allowedArtifactTypes.map((type) => ({
      key: type,
      title: type.toUpperCase(),
      format: type,
      value: isFileFormat(type)
        ? (fileNames[type] ?? '')
        : (fieldValues[type] ?? ''),
    }));
  }

  return (
    <div>
      {infoModal && (
        <InfoModal
          type={infoModal}
          rules={sections.overview.infoLinks.rules}
          faq={sections.overview.infoLinks.faq}
          onClose={() => setInfoModal(null)}
        />
      )}

      {submitOpen && (
        <SubmitModal
          hackathonTitle={detail.title}
          items={buildSubmitItems()}
          onClose={() => setSubmitOpen(false)}
        />
      )}

      {leaderboardOpen && (
        <LeaderboardModal
          hackathonTitle={detail.title}
          submissionDeadlineAt={submissionDeadlineAt}
          leaderboard={leaderboard}
          note={sections.leaderboard.note}
          onClose={() => setLeaderboardOpen(false)}
        />
      )}

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 overflow-x-auto border-b border-sky-100 mb-6 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-gray-900 text-gray-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── 탭 1: 개요 ── */}
      {activeTab === '개요' && (
        <div className="space-y-6">
          {/* 카운트다운 — 진행중/예정만 표시 */}
          {status !== 'ended' && (
            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100">
              <p className="text-xs text-gray-400 mb-2">
                {status === 'upcoming' ? '시작까지' : '제출 마감까지'}
              </p>
              <CountdownTimer deadlineIso={status === 'upcoming' ? startAt : submissionDeadlineAt} />
            </div>
          )}

          <div className="p-5 rounded-2xl bg-sky-50">
            <h3 className="text-sm font-bold text-gray-700 mb-2">해커톤 소개</h3>
            <p className="text-sm text-gray-900 leading-relaxed">{sections.overview.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl glass border border-sky-100">
              <p className="text-xs text-gray-400 mb-1">팀 구성</p>
              <p className="text-sm font-semibold text-gray-900">
                {sections.overview.teamPolicy.allowSolo ? '개인 참가 가능' : '팀 필수'}
                &nbsp;·&nbsp;최대 {sections.overview.teamPolicy.maxTeamSize}인
              </p>
            </div>
            <div className="p-4 rounded-2xl glass border border-sky-100">
              <p className="text-xs text-gray-400 mb-1">제출 마감</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDateTime(submissionDeadlineAt)}
              </p>
            </div>
          </div>

          {/* 공지사항 */}
          {sections.overview.notice.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">📢 공지사항</h3>
              <ul className="space-y-2">
                {sections.overview.notice.map((n, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 규정 / FAQ */}
          <div className="flex gap-3">
            <button
              onClick={() => setInfoModal('rules')}
              className="flex-1 text-center py-2.5 rounded-xl border border-sky-100 text-gray-700 text-sm font-semibold hover:bg-sky-50 transition-colors"
            >
              📋 규정 보기
            </button>
            <button
              onClick={() => setInfoModal('faq')}
              className="flex-1 text-center py-2.5 rounded-xl border border-sky-100 text-gray-700 text-sm font-semibold hover:bg-sky-50 transition-colors"
            >
              ❓ FAQ
            </button>
          </div>
        </div>
      )}

      {/* ── 탭 2: 평가 ── */}
      {activeTab === '평가' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl glass border border-sky-100">
            <p className="text-xs text-gray-400 mb-1">평가 지표</p>
            <p className="text-lg font-extrabold text-gray-700">{sections.eval.metricName}</p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50">
            <h3 className="text-sm font-bold text-gray-900 mb-2">평가 방식</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{sections.eval.description}</p>
          </div>

          {/* vote 방식 가중치 breakdown */}
          {sections.eval.scoreSource === 'vote' && sections.eval.scoreDisplay && (
            <div className="p-5 rounded-2xl bg-sky-50">
              <h3 className="text-sm font-bold text-gray-600 mb-3">
                점수 구성 — {sections.eval.scoreDisplay.label}
              </h3>
              <div className="space-y-2">
                {sections.eval.scoreDisplay.breakdown.map((b) => (
                  <div key={b.key} className="flex items-center gap-3">
                    <span className="text-sm text-gray-900 w-28">{b.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-sky-50 overflow-hidden">
                      <div
                        className="h-full bg-sky-300 rounded-full"
                        style={{ width: `${b.weightPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-600 w-10 text-right">
                      {b.weightPercent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 제한 사항 */}
          {sections.eval.limits && (
            <div className="p-5 rounded-2xl bg-orange-50">
              <h3 className="text-sm font-bold text-orange-700 mb-3">⚠️ 제한 사항</h3>
              <ul className="space-y-1 text-sm text-gray-900">
                {sections.eval.limits.maxRuntimeSec !== undefined && (
                  <li>최대 실행 시간: {sections.eval.limits.maxRuntimeSec}초</li>
                )}
                {sections.eval.limits.maxSubmissionsPerDay !== undefined && (
                  <li>일일 최대 제출: {sections.eval.limits.maxSubmissionsPerDay}회</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── 탭 3: 일정 ── */}
      {activeTab === '일정' && (
        <div className="space-y-6">
          {/* 실시간 카운트다운 */}
          <div className="p-5 rounded-2xl bg-sky-50">
            <p className="text-xs text-gray-500 mb-2">제출 마감까지</p>
            <CountdownTimer deadlineIso={submissionDeadlineAt} />
            {/* 미제출 경고 (더미 — 항상 표시) */}
            <p className="mt-3 text-xs text-amber-600 font-medium">
              ⚠️ 아직 제출하지 않았습니다
            </p>
          </div>

          {/* 마일스톤 타임라인 */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">일정 타임라인</h3>
            <ol className="relative border-l-2 border-sky-100 ml-3 space-y-6">
              {sections.schedule.milestones.map((m, i) => {
                const milestoneTime = new Date(m.at).getTime();
                const isPast = milestoneTime < now;
                const isCurrent =
                  i < sections.schedule.milestones.length - 1 &&
                  milestoneTime <= now &&
                  new Date(sections.schedule.milestones[i + 1].at).getTime() > now;

                return (
                  <li key={i} className="ml-5">
                    <span
                      className={`absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                        isCurrent
                          ? 'bg-gray-900'
                          : isPast
                            ? 'bg-white/30'
                            : 'bg-white border-2 border-sky-100'
                      }`}
                    />
                    <p
                      className={`text-sm font-semibold ${
                        isCurrent ? 'text-gray-700' : isPast ? 'text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {m.name}
                      {isCurrent && (
                        <span className="ml-2 text-xs font-bold text-gray-900 bg-sky-100 px-2 py-0.5 rounded-full">
                          현재 단계
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(m.at)}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}

      {/* ── 탭 4: 상금 ── */}
      {activeTab === '상금' && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 mb-4">시상 내역</h3>
          {sections.prize.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-2xl ${
                i === 0
                  ? 'bg-yellow-50 border border-yellow-100'
                  : i === 1
                    ? 'bg-sky-50 border border-sky-100'
                    : 'bg-white border border-sky-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}
                </span>
                <span className="text-sm font-semibold text-gray-900">{item.place}</span>
              </div>
              <span
                className={`text-base font-extrabold ${
                  i === 0
                    ? 'text-yellow-600'
                    : i === 1
                      ? 'text-gray-500'
                      : 'text-gray-700'
                }`}
              >
                {formatKRW(item.amountKRW)}
              </span>
            </div>
          ))}
          <div className="mt-4 p-3 rounded-xl bg-sky-50 text-xs text-gray-700">
            총 상금:{' '}
            <strong>
              {formatKRW(sections.prize.items.reduce((sum, item) => sum + item.amountKRW, 0))}
            </strong>
          </div>
        </div>
      )}

      {/* ── 탭 5: 팀 ── */}
      {activeTab === '팀' && (
        <div className="space-y-5">
          {sections.teams.campEnabled ? (
            <>
              <div className="p-5 rounded-2xl bg-sky-50">
                <p className="text-sm text-gray-900 mb-4">
                  이 해커톤에 참가할 팀원을 찾거나, 팀 합류 신청을 해보세요.
                </p>
                <Link
                  href={sections.teams.listUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
                >
                  👥 팀 목록 보기 →
                </Link>
              </div>

              <div className="p-5 rounded-2xl border border-sky-100 bg-sky-50">
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  어떤 팀이 나에게 맞을지 먼저 확인해보고 싶다면?
                </p>
                <Link
                  href="/camp/simulate"
                  className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-gray-600 hover:underline"
                >
                  🧪 이 해커톤으로 시뮬레이션 해보기 →
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🔒</p>
              <p className="text-sm font-semibold text-gray-600">이 해커톤은 팀 모집이 종료되었습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* ── 탭 6: 제출 ── */}
      {activeTab === '제출' && (
        <div className="space-y-5">
          {/* 제출 가이드 */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">제출 가이드</h3>
            <ul className="space-y-2">
              {sections.submit.guide.map((g, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-gray-700 font-bold">{i + 1}.</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 단계별 제출 폼 */}
          {sections.submit.submissionItems ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 mb-1">제출 항목</h3>
              {sections.submit.submissionItems.map((item, i) => (
                <div key={item.key} className={`p-4 rounded-2xl border glass ${formErrors[item.key] ? 'border-red-300 bg-red-50' : 'border-sky-100'}`}>
                  <p className="text-xs text-gray-400 mb-1">
                    단계 {i + 1} · {item.format.toUpperCase()}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mb-2">{item.title}</p>
                  {item.format === 'zip' && (
                    <input
                      type="file"
                      accept=".zip"
                      onChange={(e) => handleFileChange(item.key, e.target.files?.[0])}
                      className="text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-gray-700 hover:file:bg-sky-50"
                    />
                  )}
                  {(item.format === 'url' || item.format === 'pdf_url') && (
                    <input
                      type="url"
                      value={fieldValues[item.key] ?? ''}
                      onChange={(e) => handleFieldChange(item.key, e.target.value)}
                      placeholder={
                        item.format === 'pdf_url'
                          ? 'PDF URL 또는 구글 드라이브 링크'
                          : 'https://'
                      }
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${formErrors[item.key] ? 'border-red-300 focus:border-red-400' : 'border-sky-100 focus:border-gray-400'}`}
                    />
                  )}
                  {item.format === 'pdf' && (
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(item.key, e.target.files?.[0])}
                      className="text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-gray-700 hover:file:bg-sky-50"
                    />
                  )}
                  {formErrors[item.key] && (
                    <p className="text-xs text-red-500 mt-1.5">필수 항목입니다.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* 단순 제출 폼 */
            <div className="space-y-3">
              {sections.submit.allowedArtifactTypes.map((type) => (
                <div key={type} className={`p-4 rounded-2xl border glass ${formErrors[type] ? 'border-red-300 bg-red-50' : 'border-sky-100'}`}>
                  <p className="text-xs text-gray-400 mb-2">{type.toUpperCase()} 제출</p>
                  {type === 'zip' && (
                    <input
                      type="file"
                      accept=".zip"
                      onChange={(e) => handleFileChange(type, e.target.files?.[0])}
                      className="text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-gray-700 hover:file:bg-sky-50"
                    />
                  )}
                  {type === 'url' && (
                    <input
                      type="url"
                      value={fieldValues[type] ?? ''}
                      onChange={(e) => handleFieldChange(type, e.target.value)}
                      placeholder="https://"
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${formErrors[type] ? 'border-red-300 focus:border-red-400' : 'border-sky-100 focus:border-gray-400'}`}
                    />
                  )}
                  {(type === 'pdf' || type === 'pdf_url') && (
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(type, e.target.files?.[0])}
                      className="text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-gray-700 hover:file:bg-sky-50"
                    />
                  )}
                  {type === 'text_or_url' && (
                    <textarea
                      value={fieldValues[type] ?? ''}
                      onChange={(e) => handleFieldChange(type, e.target.value)}
                      placeholder="텍스트 또는 URL 입력"
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none resize-none ${formErrors[type] ? 'border-red-300 focus:border-red-400' : 'border-sky-100 focus:border-gray-400'}`}
                    />
                  )}
                  {formErrors[type] && (
                    <p className="text-xs text-red-500 mt-1.5">필수 항목입니다.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmitClick}
            className="block w-full text-center py-3 rounded-xl bg-sky-200 text-sky-800 font-bold text-sm hover:bg-sky-300 transition-colors"
          >
            제출하기 →
          </button>
        </div>
      )}

      {/* ── 탭 7: 리더보드 ── */}
      {activeTab === '리더보드' && (
        <div className="space-y-5">
          {leaderboard && leaderboard.entries.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sky-100 text-xs text-gray-400">
                      <th className="pb-3 text-left w-12">순위</th>
                      <th className="pb-3 text-left">팀명</th>
                      <th className="pb-3 text-right">점수</th>
                      <th className="pb-3 text-right hidden sm:table-cell">제출일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leaderboard.entries.map((entry) => (
                      <tr key={entry.rank} className="hover:bg-sky-50 transition-colors">
                        <td className="py-3 text-left">
                          <span
                            className={`font-bold ${
                              entry.rank === 1
                                ? 'text-yellow-600'
                                : entry.rank === 2
                                  ? 'text-gray-400'
                                  : entry.rank === 3
                                    ? 'text-orange-400'
                                    : 'text-gray-600'
                            }`}
                          >
                            {entry.rank === 1
                              ? '🥇'
                              : entry.rank === 2
                                ? '🥈'
                                : entry.rank === 3
                                  ? '🥉'
                                  : `#${entry.rank}`}
                          </span>
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-gray-900">{entry.teamName}</p>
                          {entry.scoreBreakdown && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              참가자 {entry.scoreBreakdown.participant}점 · 심사위원{' '}
                              {entry.scoreBreakdown.judge}점
                            </p>
                          )}
                          {entry.artifacts && (
                            <div className="flex gap-2 mt-1">
                              {entry.artifacts.webUrl && (
                                <a
                                  href={entry.artifacts.webUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-gray-700 hover:underline"
                                >
                                  🔗 웹링크
                                </a>
                              )}
                              {entry.artifacts.pdfUrl && (
                                <a
                                  href={entry.artifacts.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-gray-700 hover:underline"
                                >
                                  📄 {entry.artifacts.planTitle ?? 'PDF'}
                                </a>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-right font-bold text-gray-700">
                          {typeof entry.score === 'number' && entry.score < 2
                            ? entry.score.toFixed(4)
                            : entry.score.toFixed(1)}
                        </td>
                        <td className="py-3 text-right text-xs text-gray-400 hidden sm:table-cell">
                          {new Date(entry.submittedAt).toLocaleDateString('ko-KR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 border-t border-sky-100 pt-3">
                {sections.leaderboard.note}
              </p>
              <button
                onClick={() => setLeaderboardOpen(true)}
                className="w-full py-2.5 rounded-xl border border-sky-100 text-gray-600 text-sm font-semibold hover:bg-sky-50 transition-colors"
              >
                공개 리더보드 보기 →
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm font-semibold text-gray-600">아직 제출된 결과가 없습니다.</p>
              <button
                onClick={() => setLeaderboardOpen(true)}
                className="mt-3 text-sm font-semibold text-gray-600 hover:underline"
              >
                공개 리더보드 보기 →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
