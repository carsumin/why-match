// 공통 카드 래퍼 컴포넌트

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-[#dde4f5] p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-150' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
