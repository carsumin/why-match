'use client';

// 앱 진입 시 미로그인 상태면 사용자 선택 화면을 표시

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { users } from '@/data/teams';
import { CURRENT_USER_KEY } from '@/hooks/useCurrentUser';

const roleLabel: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  designer: '디자이너',
  pm: 'PM',
  data: '데이터',
  devops: 'DevOps',
};

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved && users.find((u) => u.id === saved)) {
      setLoggedIn(true);
    }
    setReady(true);
  }, []);

  function handleSelect(id: string) {
    localStorage.setItem(CURRENT_USER_KEY, id);
    window.location.href = '/';
  }

  // hydration 전 — 빈 화면 (레이아웃 깜빡임 방지)
  if (!ready) return null;

  if (!loggedIn) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f7f8ff] px-6">
        {/* 로고 */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-extrabold tracking-tight">
            <span className="text-[#4f72c4]">Why</span><span className="text-[#10b981]">Match</span>
          </span>
          <p className="text-sm text-slate-500 mt-2">이유 있는 해커톤 팀 매칭</p>
        </div>

        <div className="w-full max-w-sm glass rounded-2xl shadow-sm border border-[#dde4f5] p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">내 프로필로 시작하기</h2>
          <p className="text-xs text-slate-400 mb-5">나로 로그인할 사용자를 선택하세요.</p>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSelect(u.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#dde4f5] hover:border-[#4f72c4] hover:bg-[#eef1fb] transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#4f72c4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {u.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {u.roles.map((r) => roleLabel[r] ?? r).join(' · ')}
                    {u.bio ? ` — ${u.bio}` : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
