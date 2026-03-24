const Footer = () => (
  <footer className="border-t border-surface-border bg-surface-card/50 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-surface-muted">
        © {new Date().getFullYear()} <span className="text-brand-400 font-semibold">UniExam Hub</span> — All rights reserved.
      </p>
      <div className="flex items-center gap-6 text-sm text-surface-muted">
        <a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-slate-200 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-slate-200 transition-colors">Support</a>
      </div>
    </div>
  </footer>
);

export default Footer;
