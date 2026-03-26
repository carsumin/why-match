// 메시지함 페이지

export default function MessagesPage() {
  // 더미 메시지 데이터
  const messages = [
    { id: 1, from: '팀 루나틱', preview: '안녕하세요! 저희 팀에 합류하실 의향이 있으신가요?', status: 'pending', time: '10분 전' },
    { id: 2, from: '코드버스터즈', preview: '지원해주셔서 감사합니다. 검토 후 연락드리겠습니다.', status: 'accepted', time: '1시간 전' },
    { id: 3, from: 'Web3 파이오니어', preview: '이번에는 아쉽게도 함께하기 어려울 것 같습니다.', status: 'rejected', time: '어제' },
  ];

  const statusConfig: Record<string, { label: string; colorClass: string }> = {
    pending: { label: '대기 중', colorClass: 'bg-yellow-100 text-yellow-700' },
    accepted: { label: '수락됨', colorClass: 'bg-green-100 text-green-700' },
    rejected: { label: '거절됨', colorClass: 'bg-red-100 text-red-500' },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">메시지함</h1>
      <p className="text-gray-500 mb-8">팀 지원 현황과 메시지를 확인하세요.</p>

      <div className="space-y-3">
        {messages.map((msg) => {
          const { label, colorClass } = statusConfig[msg.status];
          return (
            <div
              key={msg.id}
              className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer"
            >
              {/* 아바타 */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {msg.from[0]}
              </div>
              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-gray-800 text-sm">{msg.from}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                    {label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
              </div>
              <span className="text-xs text-gray-300 shrink-0">{msg.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
