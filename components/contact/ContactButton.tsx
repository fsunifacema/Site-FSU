"use client";

import type { ComponentPropsWithoutRef } from "react";

import { useContact } from "./ContactProvider";

type ContactButtonProps = Omit<ComponentPropsWithoutRef<"button">, "type" | "onClick"> & { service: string };

export function ContactButton({ service, children, ...props }: ContactButtonProps) {
  const { openContact } = useContact();

  return (
    <button {...props} type="button" aria-haspopup="dialog" onClick={() => openContact(service)}>
      {children}
    </button>
  );
}
