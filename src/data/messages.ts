// 메시지함 더미 데이터

import type { Message } from '@/types';

/** UI 렌더링용 확장 타입 (더미 데이터 전용) */
export interface MessageDisplay extends Message {
  fromUserName: string;
  fromUserRole: string;
  teamName: string;
  contactUrl?: string; // accepted 상태일 때 이동할 팀 contact.url
  isRead: boolean;       // 팀장(받은 메시지)이 읽었는지
  resultRead?: boolean;  // 지원자(보낸 메시지)가 결과를 확인했는지
}

/** 받은 메시지 — 다른 유저가 내 팀(T-HANDOVER-01)에 지원 */
export const inboxMessages: MessageDisplay[] = [
  {
    id: 'msg-001',
    fromUserId: 'u-002',
    fromUserName: '이수아',
    fromUserRole: 'Backend',
    teamCode: 'T-HANDOVER-01',
    teamName: '404found',
    hackathonSlug: 'daker-handover-2026-03',
    message: '안녕하세요! 백엔드 포지션으로 지원합니다. Node.js와 Spring Boot 경험이 있어요.',
    status: 'pending',
    isRead: false,
    createdAt: '2026-03-29T14:30:00+09:00',
    contactUrl: 'https://open.kakao.com/o/example3',
  },
  {
    id: 'msg-002',
    fromUserId: 'u-003',
    fromUserName: '박민준',
    fromUserRole: 'Designer',
    teamCode: 'T-HANDOVER-01',
    teamName: '404found',
    hackathonSlug: 'daker-handover-2026-03',
    message: 'Figma로 디자인 시스템 잡아드릴 수 있습니다. 함께하고 싶어요!',
    status: 'accepted',
    isRead: true,
    createdAt: '2026-03-28T09:10:00+09:00',
    contactUrl: 'https://open.kakao.com/o/example3',
  },
  {
    id: 'msg-003',
    fromUserId: 'u-005',
    fromUserName: '최예린',
    fromUserRole: 'PM',
    teamCode: 'T-HANDOVER-01',
    teamName: '404found',
    hackathonSlug: 'daker-handover-2026-03',
    message: '기획 포지션으로 지원드립니다. 해커톤 경험 3회 있습니다.',
    status: 'rejected',
    isRead: false,
    createdAt: '2026-03-27T18:55:00+09:00',
  },
];

/** 보낸 메시지 — 내가 다른 팀에 지원 */
export const sentMessages: MessageDisplay[] = [
  {
    id: 'msg-101',
    fromUserId: 'u-001',
    fromUserName: '김지훈',
    fromUserRole: 'Frontend',
    teamCode: 'T-ALPHA',
    teamName: 'Team Alpha',
    hackathonSlug: 'aimers-8-model-lite',
    message: 'React / Next.js로 프론트엔드 담당 가능합니다. 합류하고 싶습니다!',
    status: 'accepted',
    isRead: true,
    createdAt: '2026-02-21T11:00:00+09:00',
    contactUrl: 'https://open.kakao.com/o/example1',
  },
  {
    id: 'msg-102',
    fromUserId: 'u-001',
    fromUserName: '김지훈',
    fromUserRole: 'Frontend',
    teamCode: 'T-BETA',
    teamName: 'PromptRunners',
    hackathonSlug: 'monthly-vibe-coding-2026-02',
    message: '프론트엔드 포지션으로 지원합니다. Tailwind CSS 익숙합니다.',
    status: 'pending',
    isRead: false,
    createdAt: '2026-02-22T16:45:00+09:00',
  },
  {
    id: 'msg-103',
    fromUserId: 'u-001',
    fromUserName: '김지훈',
    fromUserRole: 'Frontend',
    teamCode: 'T-HANDOVER-02',
    teamName: 'LGTM',
    hackathonSlug: 'daker-handover-2026-03',
    message: '팀 합류 희망합니다. 프론트 작업 맡을 수 있습니다.',
    status: 'rejected',
    isRead: true,
    createdAt: '2026-03-06T10:20:00+09:00',
  },
];
