'use client';

// 유저 프로필 페이지 — 조회 + 편집 (localStorage 저장)

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getUserById } from '@/data/teams';
import { TagBadge } from '@/components/ui/Badge';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { User, UserRole } from '@/types';

const PROFILE_STORAGE_KEY = 'whymatch_profiles';

const roleLabel: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  designer: '디자이너',
  pm: 'PM',
  data: '데이터',
  devops: 'DevOps',
};

const ALL_ROLES: UserRole[] = ['frontend', 'backend', 'designer', 'pm', 'data', 'devops'];

function loadOverride(id: string): Partial<User> {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw)[id] ?? {};
  } catch {
    return {};
  }
}

function saveOverride(id: string, data: Partial<User>) {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[id] = data;
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { currentUser } = useCurrentUser();

  const baseUser = getUserById(id);
  const isMe = currentUser?.id === id;

  if (!baseUser) {
    notFound();
    return null;
  }

  const [user, setUser] = useState<User>(baseUser);
  const [editing, setEditing] = useState(false);

  // 편집 폼 상태
  const [form, setForm] = useState({
    name: '',
    bio: '',
    roles: [] as UserRole[],
    tagInput: '',   // 쉼표 구분 입력
    activeHours: 0,
    githubUrl: '',
    portfolioUrl: '',
  });

  // localStorage 오버라이드 패치 (변경분 있을 때만 재렌더)
  useEffect(() => {
    const override = loadOverride(id);
    if (Object.keys(override).length === 0) return;
    setUser((prev) => ({ ...prev, ...override }));
  }, [id]);

  function startEdit() {
    if (!user) return;
    setForm({
      name: user.name,
      bio: user.bio ?? '',
      roles: [...user.roles],
      tagInput: user.tags.join(', '),
      activeHours: user.activeHours,
      githubUrl: user.githubUrl ?? '',
      portfolioUrl: user.portfolioUrl ?? '',
    });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveEdit() {
    if (!user) return;
    const newTags = form.tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: User = {
      ...user,
      name: form.name.trim() || user.name,
      bio: form.bio.trim() || undefined,
      roles: form.roles.length > 0 ? form.roles : user.roles,
      tags: newTags.length > 0 ? newTags : user.tags,
      activeHours: Number(form.activeHours) || user.activeHours,
      githubUrl: form.githubUrl.trim() || undefined,
      portfolioUrl: form.portfolioUrl.trim() || undefined,
    };

    const override: Partial<User> = {
      name: updated.name,
      bio: updated.bio,
      roles: updated.roles,
      tags: updated.tags,
      activeHours: updated.activeHours,
      githubUrl: updated.githubUrl,
      portfolioUrl: updated.portfolioUrl,
    };

    saveOverride(id, override);
    setUser(updated);
    setEditing(false);
  }

  function toggleRole(role: UserRole) {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  }

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-extrabold text-gray-900">프로필 수정</h1>
          <button onClick={cancelEdit} className="text-sm text-gray-400 hover:text-gray-600">
            취소
          </button>
        </div>

        <div className="space-y-5">
          {/* 이름 */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[#dde4f5] text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* 소개 */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">한 줄 소개</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={2}
              placeholder="간단히 자신을 소개해주세요"
              className="w-full px-3 py-2 rounded-xl border border-[#dde4f5] text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          {/* 역할 */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">역할</label>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    form.roles.includes(role)
                      ? 'bg-[#dde4f5] text-gray-900'
                      : 'bg-[#eef1fb] text-gray-600 hover:bg-[#eef1fb]'
                  }`}
                >
                  {roleLabel[role]}
                </button>
              ))}
            </div>
          </div>

          {/* 기술 스택 */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              기술 스택 <span className="font-normal text-gray-400">(쉼표로 구분)</span>
            </label>
            <input
              type="text"
              value={form.tagInput}
              onChange={(e) => setForm((p) => ({ ...p, tagInput: e.target.value }))}
              placeholder="React, TypeScript, Node.js"
              className="w-full px-3 py-2 rounded-xl border border-[#dde4f5] text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* 활동 시간 */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              하루 평균 활동 시간 (h)
            </label>
            <input
              type="number"
              min={0}
              max={24}
              value={form.activeHours}
              onChange={(e) => setForm((p) => ({ ...p, activeHours: Number(e.target.value) }))}
              className="w-28 px-3 py-2 rounded-xl border border-[#dde4f5] text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">GitHub URL</label>
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 rounded-xl border border-[#dde4f5] text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* 포트폴리오 */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">포트폴리오 URL</label>
            <input
              type="url"
              value={form.portfolioUrl}
              onChange={(e) => setForm((p) => ({ ...p, portfolioUrl: e.target.value }))}
              placeholder="https://notion.so/..."
              className="w-full px-3 py-2 rounded-xl border border-[#dde4f5] text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          <button
            onClick={saveEdit}
            className="w-full py-3 rounded-xl bg-sky-200 text-sky-800 font-bold text-sm hover:bg-sky-300 transition-colors"
          >
            저장하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 프로필 헤더 */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-sky-300 flex items-center justify-center text-sky-900 text-3xl font-extrabold shrink-0">
          {user.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900">{user.name}</h1>
            {isMe && (
              <button
                onClick={startEdit}
                className="text-xs font-semibold text-gray-700 border border-[#dde4f5] px-2.5 py-1 rounded-full hover:bg-[#eef1fb] transition-colors"
              >
                수정
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.roles.map((role) => (
              <span
                key={role}
                className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#eef1fb] text-gray-600"
              >
                {roleLabel[role] ?? role}
              </span>
            ))}
          </div>
          {user.bio && <p className="text-sm text-gray-500 mt-2">{user.bio}</p>}
        </div>
      </div>

      {/* 기술 스택 */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">기술 스택</h2>
        <div className="flex flex-wrap gap-2">
          {user.tags.map((tag) => (
            <TagBadge key={tag} label={tag} className="text-sm px-3 py-1" />
          ))}
        </div>
      </section>

      {/* 활동 시간 */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">활동 정보</h2>
        <div className="p-4 glass rounded-2xl border border-[#dde4f5]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">하루 평균 활동 시간</span>
            <span className="font-bold text-gray-700">{user.activeHours}h/day</span>
          </div>
        </div>
      </section>

      {/* 링크 */}
      {(user.githubUrl || user.portfolioUrl) && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">포트폴리오</h2>
          <div className="flex flex-wrap gap-3">
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-[#dde4f5] text-sm font-medium text-gray-900 hover:border-gray-400 transition-colors"
              >
                GitHub
              </a>
            )}
            {user.portfolioUrl && (
              <a
                href={user.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-[#dde4f5] text-sm font-medium text-gray-900 hover:border-gray-400 transition-colors"
              >
                포트폴리오
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
