import React, { useState, useEffect } from 'react';
import { Shield, Check } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('maison_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'maison_cookie_consent',
      JSON.stringify({ essential: true, analytics: true, marketing: true, date: new Date().toISOString() })
    );
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      'maison_cookie_consent',
      JSON.stringify({ essential: true, analytics: false, marketing: false, date: new Date().toISOString() })
    );
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'maison_cookie_consent',
      JSON.stringify({ essential: true, analytics: analyticsConsent, marketing: marketingConsent, date: new Date().toISOString() })
    );
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 md:left-8 md:max-w-xl z-50 bg-[#14110e]/95 backdrop-blur-xl border border-[#c9a96e]/30 rounded-sm p-6 shadow-2xl animate-in slide-in-from-bottom-6 duration-300"
    >
      <div className="flex items-start gap-4">
        <Shield className="w-5 h-5 text-[#c9a96e] shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h3 className="font-serif text-lg tracking-wide text-[#f3ede4]">
            Privileged Patron Privacy &amp; Cookies
          </h3>
          <p className="text-xs text-[#8a8278] leading-relaxed">
            The Atelier uses essential cookies to ensure your flacon selections and bespoke monogram engraving persist seamlessly. With your gracious consent, we also utilize privacy-first analytics to refine our olfactory experience.
          </p>
        </div>
      </div>

      {showPreferences && (
        <div className="mt-4 pt-4 border-t border-[#f3ede4]/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#f3ede4]">Strictly Necessary (Bag, Engraving &amp; Security)</span>
            <span className="text-[#c9a96e] text-[10px] uppercase tracking-wider font-semibold">Always Active</span>
          </div>
          <label className="flex items-center justify-between text-xs cursor-pointer">
            <span className="text-[#8a8278]">Performance &amp; 3D WebGL Telemetry</span>
            <input
              type="checkbox"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
              className="accent-[#c9a96e] w-4 h-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between text-xs cursor-pointer">
            <span className="text-[#8a8278]">Bespoke Marketing &amp; Private Invitations</span>
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="accent-[#c9a96e] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      )}

      {/* Button controls with equal weight to comply with GDPR */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {showPreferences ? (
          <button
            onClick={handleSavePreferences}
            className="flex-1 py-2 px-4 bg-[#c9a96e] text-[#0d0b09] text-xs uppercase tracking-[0.15em] font-medium rounded-sm hover:bg-[#d9b97e] transition-colors"
          >
            Save Preferences
          </button>
        ) : (
          <>
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2.5 px-4 bg-[#c9a96e] text-[#0d0b09] text-xs uppercase tracking-[0.15em] font-medium rounded-sm hover:bg-[#d9b97e] transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="flex-1 py-2.5 px-4 bg-transparent text-[#f3ede4] border border-[#f3ede4]/20 text-xs uppercase tracking-[0.15em] rounded-sm hover:bg-[#f3ede4]/5 transition-colors"
            >
              Reject Non-Essential
            </button>
          </>
        )}

        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="text-[11px] text-[#8a8278] hover:text-[#c9a96e] underline underline-offset-4 py-1"
        >
          {showPreferences ? 'Cancel' : 'Manage Preferences'}
        </button>
      </div>
    </div>
  );
};
