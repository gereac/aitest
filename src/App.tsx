import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="px-4 py-2 rounded border text-sm font-medium transition-colors"
        style={{ borderColor: "var(--border)", color: "var(--fg)" }}
      >
        {theme === "dark" ? "☀ Light mode" : "☾ Dark mode"}
      </button>
      <h1 className="text-2xl font-bold">Hello World Foo</h1>
    </div>
  );
}

export default App;
