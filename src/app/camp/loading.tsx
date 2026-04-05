export default function CampLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 glass rounded-xl w-40 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 glass rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
