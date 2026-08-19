"use client";

/* eslint-disable @next/next/no-img-element */
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useState } from "react";
import {
  instagramProfileUrl,
  linkedinProfileUrl,
  whatsappUrl,
} from "../site-data";
import { WhatsappIcon } from "./whatsapp-icon";

const navigation = [
  { label: "Escritório", href: "/#escritorio" },
  { label: "Contato", href: "/#contato" },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.34 3.5A1.84 1.84 0 1 1 5.33 7.18 1.84 1.84 0 0 1 5.34 3.5ZM3.75 8.55h3.18V20.5H3.75V8.55Zm5.13 0h3.05v1.63h.04c.43-.8 1.46-1.96 3.01-1.96 3.22 0 3.82 2.12 3.82 4.88v7.4h-3.18v-6.56c0-1.56-.03-3.58-2.18-3.58-2.18 0-2.52 1.71-2.52 3.47v6.67H8.88V8.55Z"
      />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleInternalNavigation(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    closeMenu();

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const destination = new URL(href, window.location.href);

    if (destination.pathname !== pathname) {
      return;
    }

    const targetId = destination.hash.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (targetId && !target) {
      return;
    }

    event.preventDefault();

    const destinationUrl = `${destination.pathname}${destination.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.hash}`;

    if (destinationUrl !== currentUrl) {
      window.history.pushState(null, "", destinationUrl);
    }

    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "auto"
      : "smooth";

    if (target) {
      target.scrollIntoView({ behavior, block: "start" });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior });
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="site-header">
        <nav className="nav-shell" aria-label="Navegação principal">
          <Link
            className="brand"
            href="/"
            onClick={(event) => handleInternalNavigation(event, "/")}
          >
            <img
              className="brand-logo"
              src="/logo-nova-carmem.png"
              width="2172"
              height="724"
              alt="Carmem Testoni"
            />
          </Link>

          <button
            className="menu-toggle"
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="menu-principal"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <div
            className={`nav-links ${isMenuOpen ? "is-open" : ""}`}
            id="menu-principal"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleInternalNavigation(event, item.href)}
              >
                {item.label}
              </Link>
            ))}

            <div className="nav-socials" aria-label="Redes sociais">
              <a
                className="social-link"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Conversar pelo WhatsApp"
                title="WhatsApp"
                onClick={closeMenu}
              >
                <WhatsappIcon />
              </a>
              <a
                className="social-link"
                href={instagramProfileUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Acessar o Instagram da Carmem Testoni"
                title="Instagram"
                onClick={closeMenu}
              >
                <InstagramIcon />
              </a>
              <a
                className="social-link"
                href={linkedinProfileUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Acessar o LinkedIn da Carmem Testoni"
                title="LinkedIn"
                onClick={closeMenu}
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
