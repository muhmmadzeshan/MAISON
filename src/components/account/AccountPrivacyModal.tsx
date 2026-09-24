import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Shield,
  Download,
  Trash2,
  Package,
  Heart,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const AccountPrivacyModal: React.FC = () => {
  const {
    isPrivacyOpen,
    setIsPrivacyOpen,
    orders,
    wishlist,
    products,
    openPDP,
    formatPrice,
    requestDataExport,
    requestDataDeletion,
    dataRequests,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'privacy'>('orders');
  const [patronEmail, setPatronEmail] = useState('ranazeshaan786456@gmail.com');
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isPrivacyOpen) return null;

  const handleExport = () => {
    requestDataExport(patronEmail);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
  };

  const handleDelete = () => {
    requestDataDeletion(patronEmail);
    setDeletionSuccess(true);
    setConfirmDelete(false);
  };

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0d0b09]/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsPrivacyOpen(false)} aria-hidden="true" />

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#14110e] border border-[#c9a96e]/30 rounded-sm shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#f3ede4]/10 flex items-center justify-between bg-[#16120e]">
          <div>
            <h2 className="font-serif text-2xl text-[#f3ede4]">Patron Sanctuary &amp; Rights</h2>
            <p className="text-xs text-[#8a8278]">{patronEmail}</p>
          </div>

          <button
            onClick={() => setIsPrivacyOpen(false)}
            aria-label="Close patron modal"
            className="text-[#8a8278] hover:text-[#f3ede4] p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#f3ede4]/10 bg-[#100d0a] text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-[#c9a96e] text-[#c9a96e] font-semibold'
                : 'border-transparent text-[#8a8278] hover:text-[#f3ede4]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'wishlist'
                ? 'border-[#c9a96e] text-[#c9a96e] font-semibold'
                : 'border-transparent text-[#8a8278] hover:text-[#f3ede4]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Flacons ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-[#c9a96e] text-[#c9a96e] font-semibold'
                : 'border-transparent text-[#8a8278] hover:text-[#f3ede4]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>GDPR &amp; Data Rights</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-[#8a8278]">
                  <p className="font-serif text-lg text-[#f3ede4]">No flacon acquisitions recorded</p>
                  <p className="text-xs mt-1">Acquisitions will appear here with real-time maceration and tracking logs.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-[#1a1511] border border-[#f3ede4]/10 rounded-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f3ede4]/10 pb-3">
                      <div>
                        <span className="font-serif text-base text-[#f3ede4]">
                          Order #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-[#8a8278] block">
                          Placed on {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30 rounded-sm text-[10px] uppercase tracking-wider font-semibold">
                          {ord.status}
                        </span>
                        <span className="font-serif text-base text-[#c9a96e]">
                          {formatPrice(ord.total, ord.currency)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-[#8a8278]">
                          <div>
                            <span className="text-[#f3ede4] font-medium">{it.productName}</span>
                            <span className="ml-2">({it.variantSize}, qty {it.quantity})</span>
                            {it.engraving && (
                              <span className="block text-[11px] text-[#c9a96e]">
                                Monogram: ❝ {it.engraving} ❞
                              </span>
                            )}
                          </div>
                          <span>{formatPrice(it.price * it.quantity, ord.currency)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#f3ede4]/10 flex items-center justify-between text-[11px] text-[#8a8278]">
                      <span>Carrier: {ord.shippingMethod}</span>
                      <span>To: {ord.shippingAddress.city}, {ord.shippingAddress.country}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {favoriteProducts.length === 0 ? (
                <div className="py-12 text-center text-[#8a8278]">
                  <p className="font-serif text-lg text-[#f3ede4]">Your wishlist is pristine</p>
                  <p className="text-xs mt-1">Tap the heart on any flacon to curate your private favorites collection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 bg-[#1a1511] border border-[#f3ede4]/10 rounded-sm flex items-center gap-4 cursor-pointer hover:border-[#c9a96e]/40 transition-colors"
                      onClick={() => {
                        setIsPrivacyOpen(false);
                        openPDP(p);
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-sm border border-[#f3ede4]/10"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-serif text-base text-[#f3ede4]">{p.name}</h4>
                        <p className="text-[11px] text-[#8a8278]">{p.family}</p>
                        <p className="text-xs font-serif text-[#c9a96e] mt-1">
                          From {formatPrice(p.variants[0].price.USD)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GDPR & CCPA PRIVACY COMPLIANCE */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-[#f3ede4]">
                  Patron Data Sovereignty &amp; Privacy Rights
                </h3>
                <p className="text-xs text-[#8a8278] mt-1 leading-relaxed">
                  In compliance with European GDPR (General Data Protection Regulation) and California CCPA, you possess absolute authority to inspect, export, or permanently erase your personal data records from the Atelier treasury.
                </p>
              </div>

              {/* Data Export Box */}
              <div className="p-5 bg-[#1a1511] border border-[#f3ede4]/15 rounded-sm space-y-3">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-[#c9a96e] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-base text-[#f3ede4]">
                      Right of Access &amp; Portability (Article 15)
                    </h4>
                    <p className="text-xs text-[#8a8278] mt-0.5 leading-relaxed">
                      Download a structured machine-readable JSON archive containing your full purchase history, saved preferences, delivery records, and legal consent timestamp logs.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#8a8278]">Format: application/json</span>
                  <button
                    onClick={handleExport}
                    className="py-2 px-4 bg-[#c9a96e] text-[#0d0b09] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#d9b97e] transition-colors flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Data Archive</span>
                  </button>
                </div>

                {exportSuccess && (
                  <p className="text-xs text-[#7d9a6a] flex items-center gap-1.5 pt-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Archive generated and downloaded to your machine.</span>
                  </p>
                )}
              </div>

              {/* Data Deletion / Anonymization Box */}
              <div className="p-5 bg-[#1a1511] border border-[#c2574a]/40 rounded-sm space-y-3">
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-[#c2574a] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-base text-[#f3ede4]">
                      Right to Erasure / Account Deletion (Article 17)
                    </h4>
                    <p className="text-xs text-[#8a8278] mt-0.5 leading-relaxed">
                      Erase all personally identifiable information (PII) including name, email, addresses, and wishlist. In accordance with fiscal retention statutes, transactional line-items are permanently anonymized to &ldquo;deleted-user&rdquo;.
                    </p>
                  </div>
                </div>

                {deletionSuccess ? (
                  <div className="p-3 bg-[#100d0a] border border-[#7d9a6a]/40 rounded-sm text-xs text-[#7d9a6a] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Account PII successfully anonymized and erased. Audit record completed.</span>
                  </div>
                ) : confirmDelete ? (
                  <div className="p-4 bg-[#100d0a] border border-[#c2574a] rounded-sm space-y-3">
                    <p className="text-xs text-[#f3ede4] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#c2574a] shrink-0" />
                      <span>Are you certain? This action cannot be revoked.</span>
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDelete}
                        className="py-2 px-4 bg-[#c2574a] text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#d66859] transition-colors"
                      >
                        Confirm Permanent Erasure
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="py-2 px-4 border border-[#f3ede4]/20 text-xs text-[#8a8278] hover:text-[#f3ede4] rounded-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 text-right">
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="py-2 px-4 border border-[#c2574a]/50 text-[#c2574a] hover:bg-[#c2574a]/10 text-xs uppercase tracking-wider rounded-sm transition-colors"
                    >
                      Request PII Erasure
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
