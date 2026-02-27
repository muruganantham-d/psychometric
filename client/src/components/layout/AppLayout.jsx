import { createElement } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Compass,
  BookOpenText,
  FlaskConical,
  School,
  ShieldCheck,
  FileText,
} from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
        <Compass size={16} strokeWidth={2} className="text-brand-600" />
      </span>
      <span className="text-xl font-bold text-ink">PathFinder</span>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
          isActive ? "text-brand-600" : "text-slate-500 hover:text-slate-800"
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
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
      <Container className="flex h-[72px] items-center justify-between">
        <NavLink to="/" aria-label="PathFinder home">
          <BrandMark />
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavItem to="/" label="Home" />
          <NavItem to="/assessment" label="Assessment" />
          <Button size="sm" onClick={() => navigate("/assessment")}>
            Start Now
          </Button>
        </nav>
      </Container>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-slate-50">
      <Container className="py-12">
        <div className="grid items-start gap-10 text-sm text-slate-500 md:grid-cols-3">
          <div className="space-y-3 self-start">
            <BrandMark />
            <p className="max-w-xs leading-relaxed">
              Discover your true potential through our scientific career assessment. Merging personality psychology,
              interests, and strengths.
            </p>
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

        <div className="mt-10 border-t border-slate-200/70 pt-6 text-center text-xs text-slate-400">
          (c) {new Date().getFullYear()} PathFinder Assessment. All rights reserved.
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
