import { createElement } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpenText,
  Compass,
  FileText,
  FlaskConical,
  School,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";

function BrandMark() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-100 shadow-subtle">
        <Compass size={18} strokeWidth={2} className="text-brand-700" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-lg font-bold text-ink sm:text-xl">PathFinder</span>
        <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Premium Career Guidance
        </span>
      </span>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex min-w-0 items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors ${
          isActive
            ? "bg-white text-brand-700 shadow-subtle"
            : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function FooterLink({ icon, label }) {
  return (
    <li>
      <a
        href="#"
        className="group inline-flex items-center gap-2 leading-6 text-slate-500 transition-colors hover:text-slate-700"
        onClick={(event) => event.preventDefault()}
      >
        {createElement(icon, {
          size: 14,
          strokeWidth: 2,
          className: "shrink-0 text-slate-400 transition-colors group-hover:text-slate-600",
        })}
        <span className="leading-6">{label}</span>
      </a>
    </li>
  );
}

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[#f8f6ef]/90 backdrop-blur-xl">
      <Container className="py-4">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <NavLink to="/" aria-label="PathFinder home" className="min-w-0">
              <BrandMark />
            </NavLink>
            <Button size="sm" className="h-10 px-4 sm:hidden" onClick={() => navigate("/assessment")}>
              Start
            </Button>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
            <NavItem to="/" label="Home" />
            <NavItem to="/assessment" label="Assessment" />
          </nav>

          <div className="hidden sm:block">
            <Button size="sm" className="h-11 px-5" onClick={() => navigate("/assessment")}>
              <Sparkles size={16} strokeWidth={2} />
              Start Now
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-white/70 bg-transparent">
      <Container className="py-12">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <div className="grid items-start gap-10 text-sm text-slate-500 md:grid-cols-3">
            <div className="space-y-4 self-start">
              <BrandMark />
              <p className="max-w-xs leading-relaxed">
                A refined psychometric experience that combines personality, interests, values, and strengths into one
                clear career recommendation.
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                <ArrowUpRight size={14} strokeWidth={2} className="text-brand-600" />
                Guided in under 15 minutes
              </span>
            </div>

            <div className="space-y-3 self-start">
              <p className="font-semibold text-ink">Resources</p>
              <ul className="space-y-2">
                <FooterLink icon={BookOpenText} label="Career Guide" />
                <FooterLink icon={FlaskConical} label="Methodology" />
                <FooterLink icon={School} label="For Schools" />
              </ul>
            </div>

            <div className="space-y-3 self-start">
              <p className="font-semibold text-ink">Legal</p>
              <ul className="space-y-2">
                <FooterLink icon={ShieldCheck} label="Privacy Policy" />
                <FooterLink icon={FileText} label="Terms of Service" />
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200/70 pt-5 text-center text-xs font-medium text-slate-400">
            (c) {new Date().getFullYear()} PathFinder Assessment. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </>
  );
}

export default AppLayout;
