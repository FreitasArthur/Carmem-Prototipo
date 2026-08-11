/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  firmName,
  officeAddress,
  officeEmail,
  officePhone,
} from "../site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-inner footer-grid">
        <div>
          <Link className="footer-brand" href="/#inicio">
            <img
              className="footer-symbol"
              src="/logo-carmem-testoni-icone-redondo-transparente.png"
              width={52}
              height={52}
              alt=""
              aria-hidden="true"
            />
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
          <p>Instagram: @carmemtestoni</p>
          <p>OAB/SC 58.578</p>
        </div>

      </div>
      <div className="footer-bottom">
        © 2026 Carmem Testoni | Advogados Associados. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
