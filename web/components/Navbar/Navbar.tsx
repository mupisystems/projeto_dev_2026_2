type NavbarProps = {
  variant?: "hero" | "admin" | "minimal";
  onLogout?: () => void;
};

export default function Navbar({ variant = "hero", onLogout }: NavbarProps) {
  if (variant === "minimal") {
    return (
      <a href="/" aria-label="Brezelle">
        <img
          className="h-10 w-10 object-contain"
          src="/logo.png"
          alt="Brezelle"
        />
      </a>
    );
  }

  if (variant === "admin") {
    return (
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 lg:px-10">
          <a href="/" aria-label="Brezelle">
            <img
              className="h-10 w-10 object-contain"
              src="/logo.png"
              alt="Brezelle"
            />
          </a>
          <div className="flex items-center gap-6">
            <span className="hidden text-xs text-fog sm:block">
              admin@brezelle.com
            </span>
            <button onClick={onLogout} className="eyebrow text-white">
              Sair ↗
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="absolute left-0 right-0 top-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-12">
      <a href="/" aria-label="Brezelle">
        <img
          className="h-10 w-10 object-contain"
          src="/logo.png"
          alt="Brezelle"
        />
      </a>
      <a href="/admin/login" className="eyebrow text-white">
        Área interna <span className="ml-2">↗</span>
      </a>
    </header>
  );
}
