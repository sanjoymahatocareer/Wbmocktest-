import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Shield, CheckCircle2, XCircle, AlertTriangle, CreditCard, IndianRupee, User, Check, X, RefreshCw } from 'lucide-react';

interface AdminPaymentSettingsProps {
  onGoBack: () => void;
}

interface PaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  orderId: string;
  amount: number;
  planName: string;
  status: string;
  utr?: string;
  purchaseDate: string;
  expiryDate: string;
  targetExam?: string;
}

export default function AdminPaymentSettings({ onGoBack }: AdminPaymentSettingsProps) {
  const [upiId, setUpiId] = useState('prokashmal799@okhdfcbank');
  const [upiName, setUpiName] = useState('Prokash Mal');
  const [enableUpi, setEnableUpi] = useState(true);
  const [enableCashfree, setEnableCashfree] = useState(true);
  const [cashfreeAppId, setCashfreeAppId] = useState('');
  const [cashfreeSecretKey, setCashfreeSecretKey] = useState('');
  const [cashfreeEnv, setCashfreeEnv] = useState<'SANDBOX' | 'PRODUCTION'>('PRODUCTION');
  const [showSecret, setShowSecret] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [actioningOrderId, setActioningOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
    loadPayments();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/payment-settings');
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
            if (data && typeof data === 'object') {
              setUpiId(data.upiId || 'prokashmal799@okhdfcbank');
              setUpiName(data.upiName || 'Prokash Mal');
              if (data.enableUpi !== undefined) {
                setEnableUpi(data.enableUpi);
              }
              if (data.enableCashfree !== undefined) {
                setEnableCashfree(data.enableCashfree);
              }
              setCashfreeAppId(data.cashfreeAppId || '');
              setCashfreeSecretKey(data.cashfreeSecretKey || '');
              setCashfreeEnv(data.cashfreeEnv || 'PRODUCTION');
            }
        } else {
          console.warn("Expected JSON for payment settings but received", contentType);
        }
      } else {
        console.warn("Error response from payment settings:", response.status, response.statusText);
      }
    } catch (error) {
      console.warn("Error loading payment settings dynamically:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setPayments(Array.isArray(data) ? data : []);
        } else {
          console.warn("Expected JSON for admin payments list but received", contentType);
        }
      } else {
        console.warn("Error response from admin payments list:", response.status, response.statusText);
      }
    } catch (error) {
      console.warn("Error loading admin payments list:", error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handleSave = async () => {
    if (!upiId || !upiName) {
      alert("UPI ID and Payee Name are required.");
      return;
    }
    
    setIsSaving(true);
    try {
      const payload = {
        upiId,
        upiName,
        enableUpi,
        enableCashfree,
        cashfreeAppId,
        cashfreeSecretKey,
        cashfreeEnv,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      alert("UPI payment configuration saved successfully.");
    } catch (error) {
      console.error("Error saving payment settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to APPROVE this payment? This will immediately activate the user's premium plan.")) return;
    setActioningOrderId(orderId);
    try {
      const response = await fetch('/api/admin/approve-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert("Payment approved and plan activated successfully!");
        loadPayments();
      } else {
        alert("Failed to approve payment: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("API error: " + err.message);
    } finally {
      setActioningOrderId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to REJECT this payment?")) return;
    setActioningOrderId(orderId);
    try {
      const response = await fetch('/api/admin/reject-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert("Payment rejected successfully.");
        loadPayments();
      } else {
        alert("Failed to reject payment: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("API error: " + err.message);
    } finally {
      setActioningOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingPayments = payments.filter(p => {
    const s = (p.status || '').toUpperCase();
    return s === 'UPI_PENDING' || s === 'PENDING';
  });
  const completedPayments = payments.filter(p => {
    const s = (p.status || '').toUpperCase();
    return s === 'PAID' || s === 'SUCCESS';
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24 md:pb-6 relative w-full overflow-x-hidden md:max-w-md md:mx-auto md:shadow-2xl">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-8 pb-5 px-5 shadow-md flex items-center gap-3 sticky top-0 z-50">
        <button onClick={onGoBack} className="p-2 -ml-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-black tracking-tight leading-none flex items-center gap-2">
            <span>💳 UPI Payment Settings</span>
          </h1>
          <span className="text-[11px] font-medium text-blue-100 mt-1 opacity-90">Manage Manual UPI & Approvals</span>
        </div>
      </header>

      <main className="p-5 space-y-6">
        
        {/* Status Alert */}
        {enableUpi ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex gap-3 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-emerald-800">✅ Manual UPI Payment Active</h3>
              <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
                Students can buy plans using Google Pay, PhonePe, Paytm QR code scans.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-800">⚠️ UPI is Disabled</h3>
              <p className="text-[11px] font-medium text-amber-700 mt-0.5">
                Enable manual UPI option below to allow users to subscribe.
              </p>
            </div>
          </div>
        )}

        {/* Configuration */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>UPI Account Config</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 ml-1">Payee UPI ID</label>
            <input 
              type="text" 
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. name@upi"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 ml-1">Payee Name</label>
            <input 
              type="text" 
              value={upiName}
              onChange={(e) => setUpiName(e.target.value)}
              placeholder="e.g. Prokash Mal"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">
                💸
              </div>
              <span className="text-xs font-bold text-slate-700">Enable UPI Payments</span>
            </div>
            <button 
              onClick={() => setEnableUpi(!enableUpi)}
              className={`w-11 h-6 rounded-full transition-colors relative ${enableUpi ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${enableUpi ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {/* Cashfree Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">
                💳
              </div>
              <span className="text-xs font-bold text-slate-700">Enable Cashfree PG (Online)</span>
            </div>
            <button 
              onClick={() => setEnableCashfree(!enableCashfree)}
              className={`w-11 h-6 rounded-full transition-colors relative ${enableCashfree ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${enableCashfree ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {/* Dynamic Cashfree Fields */}
          {enableCashfree && (
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4 animate-fadeIn">
              <div className="text-[11px] font-black text-blue-800 uppercase tracking-wider">
                🔐 Cashfree API Credentials
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 flex justify-between items-center">
                  <span>Cashfree App ID (Client ID)</span>
                  <span className="text-[9px] text-blue-600 font-semibold">(Found in Merchant Dashboard)</span>
                </label>
                <input 
                  type="text" 
                  value={cashfreeAppId}
                  onChange={(e) => setCashfreeAppId(e.target.value)}
                  placeholder="Enter Cashfree App ID"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 flex justify-between items-center">
                  <span>Cashfree Secret Key (Client Secret)</span>
                  <button 
                    type="button" 
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-[9px] text-blue-600 font-bold hover:underline"
                  >
                    {showSecret ? "Hide" : "Show"}
                  </button>
                </label>
                <input 
                  type={showSecret ? "text" : "password"} 
                  value={cashfreeSecretKey}
                  onChange={(e) => setCashfreeSecretKey(e.target.value)}
                  placeholder="Enter Cashfree Secret Key"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600">Environment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCashfreeEnv('SANDBOX')}
                    className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${
                      cashfreeEnv === 'SANDBOX'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    TEST (Sandbox)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashfreeEnv('PRODUCTION')}
                    className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${
                      cashfreeEnv === 'PRODUCTION'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    LIVE (Production)
                  </button>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save UPI Config</span>
              </>
            )}
          </button>
        </section>

        {/* UPI Pending Approvals */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>Pending approvals ({pendingPayments.length})</span>
            </h2>
            <button onClick={loadPayments} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPayments ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No pending approvals found 🎉
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {pendingPayments.map((p) => (
                <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-slate-800">{p.userName || 'Student'}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{p.userEmail}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                      PENDING
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-1.5 border-y border-slate-200/60 text-[11px]">
                    <div>
                      <p className="text-slate-400 font-semibold">Plan</p>
                      <p className="font-bold text-slate-700">{p.planName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Amount</p>
                      <p className="font-bold text-slate-800">₹{p.amount}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-blue-600 font-bold leading-none">UTR / Txn ID</p>
                      <p className="text-sm font-black text-blue-950 tracking-wider mt-1">{p.utr || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => handleApprove(p.id)}
                      disabled={actioningOrderId !== null}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Approve
                    </button>
                    <button 
                      onClick={() => handleReject(p.id)}
                      disabled={actioningOrderId !== null}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-700 py-2 px-3 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payment History List */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 mb-10">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>Success Payments ({completedPayments.length})</span>
          </h2>

          {completedPayments.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-bold">
              No success payments found.
            </div>
          ) : (
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {completedPayments.slice(0, 15).map((p) => (
                <div key={p.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <div>
                    <p className="font-bold text-slate-800">{p.userName}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{new Date(p.purchaseDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800">₹{p.amount}</p>
                    <p className="text-[9px] text-emerald-600 font-extrabold uppercase">SUCCESS</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
