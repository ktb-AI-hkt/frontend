export default function Header({ title }) {
  return (
    <div className="sticky top-0 z-10 border-b bg-card px-4 py-4">
      <h1 className="text-center text-lg font-semibold">{title}</h1>
    </div>
  );
}

