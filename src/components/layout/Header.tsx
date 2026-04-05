// 상단 헤더 — 로고 + 네비게이션 링크
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser, CURRENT_USER_KEY } from '@/hooks/useCurrentUser';
import { useMessageContext } from '@/context/MessageContext';
import { useTeamDb } from '@/hooks/useTeamDb';

const navItems = [
  { label: '해커톤', href: '/hackathons' },
  { label: '팀 모집', href: '/camp' },
  { label: '랭킹', href: '/rankings' },
  { label: '쇼케이스', href: '/showcase' },
];

const roleLabel: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  designer: '디자이너',
  pm: 'PM',
  data: '데이터',
  devops: 'DevOps',
};

export default function Header() {
  const pathname = usePathname();
  const { currentUser } = useCurrentUser();
  const [showMenu, setShowMenu] = useState(false);
  const { unreadCount } = useMessageContext();
  const { teams } = useTeamDb();

  const myLeadTeams = currentUser ? teams.filter((t) => t.leaderId === currentUser.id) : [];
  const myJoinedTeams = currentUser
    ? teams.filter((t) => t.memberIds.includes(currentUser.id) && t.leaderId !== currentUser.id)
    : [];

  function handleLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-50 glass-md border-b border-sky-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-sky-300">Why</span><span className="text-pink-300">Match</span>
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 우측 아이콘 */}
        <div className="flex items-center gap-3">
          <Link href="/messages" className="relative text-gray-500 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-400 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* 아바타 + 프로필 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="w-8 h-8 rounded-full bg-sky-300 flex items-center justify-center text-sky-900 text-sm font-bold hover:bg-sky-400 transition-colors"
            >
              {currentUser ? currentUser.name[0] : '?'}
            </button>

            {showMenu && currentUser && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 z-50 w-64 glass-strong rounded-2xl shadow-lg overflow-hidden">
                  {/* 현재 유저 정보 */}
                  <div className="px-4 py-3 border-b border-sky-100">
                    <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-400">
                      {currentUser.roles.map((r) => roleLabel[r] ?? r).join(' · ')}
                    </p>
                  </div>

                  {/* 내가 만든 팀 */}
                  {myLeadTeams.length > 0 && (
                    <div className="px-4 py-2 border-b border-sky-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">내가 만든 팀</p>
                      <div className="space-y-1">
                        {myLeadTeams.map((t) => (
                          <Link
                            key={t.teamCode}
                            href={`/camp/simulate?team=${t.teamCode}&mode=leader`}
                            onClick={() => setShowMenu(false)}
                            className="flex items-center justify-between text-xs text-gray-700 hover:text-sky-700 py-0.5"
                          >
                            <span className="font-medium truncate">{t.name}</span>
                            <span className="ml-2 text-gray-400 shrink-0">{t.memberIds.length}명</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 내가 합류한 팀 */}
                  {myJoinedTeams.length > 0 && (
                    <div className="px-4 py-2 border-b border-sky-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">내가 합류한 팀</p>
                      <div className="space-y-1">
                        {myJoinedTeams.map((t) => (
                          <Link
                            key={t.teamCode}
                            href={`/camp?hackathon=${t.hackathonSlug ?? ''}`}
                            onClick={() => setShowMenu(false)}
                            className="flex items-center justify-between text-xs text-gray-700 hover:text-sky-700 py-0.5"
                          >
                            <span className="font-medium truncate">{t.name}</span>
                            <span className="ml-2 text-gray-400 shrink-0">{t.memberIds.length}명</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 메뉴 */}
                  <div className="py-1">
                    <Link
                      href={`/profile/${currentUser.id}`}
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-900 hover:bg-sky-50 transition-colors"
                    >
                      <span className="text-base">👤</span>
                      내 정보 보기 / 수정
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="text-base">🚪</span>
                      로그아웃
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
