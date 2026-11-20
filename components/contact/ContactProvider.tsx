"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { ContactModal, type ContactRequest } from "./ContactModal";

type ContactContextValue = { openContact: (source: string) => void };

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContact(): ContactContextValue {
  const context = useContext(ContactContext);
  if (!context) throw new Error("useContact precisa estar dentro de <ContactProvider>.");
  return context;
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ContactRequest | null>(null);

  const openContact = useCallback((source: string) => setRequest({ source }), []);
  const closeContact = useCallback(() => setRequest(null), []);
  const value = useMemo(() => ({ openContact }), [openContact]);

  return (
    <ContactContext value={value}>
      {children}
      <ContactModal request={request} onClose={closeContact} />
    </ContactContext>
  );
}
