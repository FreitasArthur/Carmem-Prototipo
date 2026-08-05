import Link from "next/link";
import {
  firmName,
  officeAddress,
  officeEmail,
  officePhone,
  whatsappUrl,
} from "../site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-inner footer-grid">
        <div>
          <Link className="footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              CT
            </span>
            <span>{firmName}</span>
          </Link>
          <p>
            As informações disponibilizadas neste site possuem caráter
            exclusivamente informativo e não substituem uma análise jurídica
            individualizada.
          </p>
        </div>

        <div className="footer-contact">
          <p>{officePhone}</p>
          <p>{officeEmail}</p>
          <p>{officeAddress}</p>
          <p>Instagram: [INSERIR LINK OFICIAL]</p>
          <p>Inscrição da sociedade ou OAB: [INSERIR]</p>
        </div>

        <div className="footer-links">
          <Link href="/#contato">Política de Privacidade</Link>
          <Link href="/#contato">Aviso de Privacidade</Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Carmem Testoni | Advogados Associados. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
