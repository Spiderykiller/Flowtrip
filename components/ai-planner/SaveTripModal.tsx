'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, MapPin, Clock, DollarSign, FileText, Loader2, CheckCircle } from 'lucide-react';

interface SaveTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pre-extracted values from the conversation */
  defaults: {
    title: string;
    destination: string;
    duration_days: string;
    budget: string;
    notes: string;
  };
  /** Full itinerary text to store as JSON */
  itineraryText: string;
}

type Status = 'idle' | 'saving' | 'saved' | 'error';

export default function SaveTripModal({
  isOpen,
  onClose,
  defaults,
  itineraryText,
}: SaveTripModalProps) {
  const [form, setForm] = useState(defaults);
  const [status, setStatus] = useState<Status>('idle');

  // Reset form whenever modal opens with new defaults
  const handleOpen = () => setForm(defaults);

  async function handleSave() {
    if (!form.title.trim() || !form.destination.trim()) return;
    setStatus('saving');

    try {
      const res = await fetch('/api/user/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: form.title.trim(),
          destination: form.destination.trim(),
          duration_days: form.duration_days.trim() || null,
          budget: form.budget.trim() || null,
          notes: form.notes.trim() || null,
          itinerary: { text: itineraryText },
        }),
      });

      if (res.ok) {
        setStatus('saved');
        setTimeout(() => {
          setStatus('idle');
          onClose();
        }, 1600);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <AnimatePresence onExitComplete={() => setStatus('idle')}>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bookmark className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Save Trip</p>
                    <p className="text-xs text-muted-foreground">Add to your collection</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
              <div className="px-6 py-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Trip title <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. 5 Days in Japan"
                      className={inputCls + ' pl-9'}
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Destination <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.destination}
                      onChange={e => setForm(p => ({ ...p, destination: e.target.value }))}
                      placeholder="e.g. Tokyo, Japan"
                      className={inputCls + ' pl-9'}
                    />
                  </div>
                </div>

                {/* Duration + Budget row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Duration (days)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={form.duration_days}
                        onChange={e => setForm(p => ({ ...p, duration_days: e.target.value }))}
                        placeholder="e.g. 5"
                        className={inputCls + ' pl-9'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Budget
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={form.budget}
                        onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                        placeholder="e.g. $2000"
                        className={inputCls + ' pl-9'}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Any personal notes about this trip…"
                    rows={2}
                    className={inputCls + ' resize-none'}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-destructive bg-destructive/5 rounded-lg px-3 py-2">
                    Failed to save. Make sure you're signed in and try again.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Full itinerary saved automatically
                </p>
                <button
                  onClick={handleSave}
                  disabled={!form.title.trim() || !form.destination.trim() || status === 'saving' || status === 'saved'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[120px] justify-center"
                >
                  {status === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {status === 'saved' && <CheckCircle className="w-4 h-4" />}
                  {status === 'idle' && <Bookmark className="w-4 h-4" />}
                  {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved!' : 'Save trip'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const inputCls = 'w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';