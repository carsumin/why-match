// 메시지함 페이지

import MessageTabs from '@/components/messages/MessageTabs';

export default function MessagesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">메시지함</h1>
      <p className="text-gray-400 text-sm mb-8">
        팀 지원 현황을 확인하고 수락·거절 처리하세요.
      </p>
      <MessageTabs />
    </div>
  );
}
