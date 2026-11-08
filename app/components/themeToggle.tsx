export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  return (
    <button onClick={toggle} className="rounded border px-3 py-1">
      <span className="dark:hidden">🌙 Темна</span>
      <span className="hidden dark:inline">☀️ Світла</span>
    </button>
  );
}
