export function LoadingState({ message = "Chargement..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#0b1020] via-[#0a0f1a] to-[#05060a] text-[#e5e7ff] px-4">
      <div className="text-xl font-semibold text-[#cbd5ff] drop-shadow">{message}</div>
    </div>
  );
}
