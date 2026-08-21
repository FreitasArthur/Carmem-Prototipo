"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { privacyNoticeLabel } from "../contact-whatsapp-message.mjs";

type PrivacyNoticeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PrivacyNoticeModal({ isOpen, onClose }: PrivacyNoticeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const documentElement = document.documentElement;
    const body = document.body;
    const previousScrollStyles = {
      documentOverflow: documentElement.style.overflow,
      documentOverscrollBehavior: documentElement.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
    };

    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    dialog?.showModal();
    closeButtonRef.current?.focus();

    return () => {
      if (dialog?.open) dialog.close();
      documentElement.style.overflow = previousScrollStyles.documentOverflow;
      documentElement.style.overscrollBehavior =
        previousScrollStyles.documentOverscrollBehavior;
      body.style.overflow = previousScrollStyles.bodyOverflow;
      body.style.overscrollBehavior = previousScrollStyles.bodyOverscrollBehavior;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      id="privacy-notice-dialog"
      className="privacy-modal"
      ref={dialogRef}
      aria-labelledby="privacy-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="privacy-modal-content">
        <button
          className="privacy-modal-close"
          ref={closeButtonRef}
          type="button"
          aria-label="Fechar aviso de privacidade"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>

        <h2 id="privacy-modal-title">{privacyNoticeLabel}</h2>

        <div className="privacy-modal-copy">
          <p>
            Ao preencher este formulário, você nos fornece: nome e número de
            WhatsApp (e, opcionalmente, mensagem).
          </p>
          <p>
            <strong>Finalidade:</strong> utilizamos esses dados exclusivamente
            para retornar seu contato via WhatsApp e responder à sua solicitação.
          </p>
          <p>
            <strong>Seus direitos:</strong> você pode solicitar acesso, correção
            ou exclusão dos seus dados a qualquer momento, entrando em contato
            pelo e-mail{" "}
            <a href="mailto:contato@carmemtestoni.com">
              contato@carmemtestoni.com.br
            </a>
            
          </p>
        </div>
      </div>
    </dialog>
  );
}
