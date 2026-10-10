import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Menu, X, ArrowUpRight, Zap, FileText, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenWorkspace: (view?: string) => void;
  activeSection?: string;
  isWorkspaceOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateSection,
  onOpenWorkspace,
  activeSection = 'hero',
  isWorkspaceOpen = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', target: 'hero' },
    { name: 'Analyze Contract', target: 'upload' },
    { name: 'Risk Dashboard', target: 'dashboard' },
    { name: 'Risky Clauses', target: 'clauses' },
    { name: 'How It Works', target: 'how-it-works' },
    { name: 'Security & FAQ', target: 'security' },
  ];

  const handleLinkClick = (target: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(target);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090D]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-600/30 group-hover:shadow-violet-600/50 transition-all">
              <div className="w-full h-full bg-[#08090D] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  ClauseGuard
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-violet-500 to-cyan-400 text-black uppercase tracking-wider">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider block uppercase">
                Contract Risk Intelligence
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#10131B]/80 px-4 py-1.5 rounded-full border border-white/[0.07] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.target;
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.target)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-violet-600/20 text-white border border-violet-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenWorkspace('dashboard')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#141824] hover:bg-[#1a2030] border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contract Workspace</span>
            </button>

            <button
              onClick={() => handleLinkClick('upload')}
              className="relative group px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-lg shadow-violet-600/30 hover:shadow-cyan-500/30 transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span>Start Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => handleLinkClick('upload')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-500"
            >
              Analyze
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 rounded-2xl bg-[#10131B] border border-white/10 p-5 shadow-2xl space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.target)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 text-left transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWorkspace('dashboard');
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#141824] text-slate-200 border border-white/10 text-center"
              >
                Full Workspace
              </button>
              <button
                onClick={() => handleLinkClick('upload')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-center shadow-md shadow-violet-600/30"
              >
                Start Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
