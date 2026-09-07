import WeddingCountdown from "@/components/WeddingCountdown";

import styles from "./WeddingDetails.module.css";

/* ========================================
   CERIMÔNIA
======================================== */

const ceremonyMapQuery =
  encodeURIComponent(
    "Primeira Igreja Metodista Wesleyana Cataguases MG"
  );

const ceremonyMapsEmbedUrl =
  `https://www.google.com/maps?q=${ceremonyMapQuery}&output=embed`;

const ceremonyDirectionsUrl =
  `https://www.google.com/maps/dir/?api=1&destination=${ceremonyMapQuery}&travelmode=driving`;

/* ========================================
   RECEPÇÃO
======================================== */

const receptionAddress =
  "R. Amílton Schelb, 10 - Pampulha, Cataguases - MG, 36774-778";

const receptionMapQuery =
  encodeURIComponent(
    `Espaço de Festas Nete Titoneli, ${receptionAddress}`
  );

const receptionMapsEmbedUrl =
  `https://www.google.com/maps?q=${receptionMapQuery}&output=embed`;

const receptionDirectionsUrl =
  `https://www.google.com/maps/dir/?api=1&destination=${receptionMapQuery}&travelmode=driving`;

/* ========================================
   GOOGLE AGENDA
======================================== */

const calendarTitle =
  encodeURIComponent(
    "Casamento Gabriel e Luana"
  );

const calendarDetails =
  encodeURIComponent(
    [
      "Casamento de Gabriel e Luana.",
      "",
      "Cerimônia às 15:30 na Primeira Igreja Metodista Wesleyana, em Cataguases - MG.",
      "",
      "Após a cerimônia, a recepção acontecerá no Espaço de Festas Nete Titoneli.",
      receptionAddress,
    ].join("\n")
  );

const calendarLocation =
  encodeURIComponent(
    "Primeira Igreja Metodista Wesleyana, Cataguases, Minas Gerais"
  );

const calendarDates =
  "20270828T153000/20270828T183000";

const googleCalendarUrl =
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarDates}&details=${calendarDetails}&location=${calendarLocation}&ctz=America/Sao_Paulo`;

export default function WeddingDetails() {
  return (
    <section
      id="casamento"
      className="wedding-section"
    >
      <div className="wedding-shell">
        <div className="wedding-intro">
          <div className="wedding-date-layout">
            <span className="wedding-date-day">
              28
            </span>

            <div className="wedding-date-meta">
              <span className="wedding-date-month">
                Agosto
              </span>

              <span className="wedding-date-year">
                2027
              </span>
            </div>
          </div>

          <p className="wedding-time-title">
            às 15:30
          </p>

          <p className="wedding-intro-copy">
            Primeira Igreja Metodista Wesleyana
            <br />
            Cerimônia · Cataguases · Minas Gerais
          </p>

          <div
            className="wedding-top-actions"
            style={{
              gap: "0.8rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`wedding-calendar-button ${styles.calendarAccent}`}
            >
              Adicionar ao Google Agenda
            </a>

            <button
              id="confirmar-presenca"
              type="button"
              className="wedding-rsvp-button"
            >
              Confirmar presença
            </button>
          </div>

          <WeddingCountdown />
        </div>

        <div className="wedding-main-grid">
          <article className="wedding-card wedding-map-card">
            <div className="wedding-card-head">
              <p className="wedding-card-label">
                CERIMÔNIA
              </p>

              <h3>
                Primeira Igreja Metodista Wesleyana
              </h3>
            </div>

            <div className="wedding-map-frame">
              <iframe
                src={ceremonyMapsEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa da Primeira Igreja Metodista Wesleyana em Cataguases"
              />
            </div>

            <a
              href={ceremonyDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`wedding-route-button ${styles.routeAccent}`}
            >
              <span className="route-icon">
                ↗
              </span>

              Criar rota
            </a>
          </article>

          <article className="wedding-card wedding-map-card">
            <div className="wedding-card-head">
              <p className="wedding-card-label">
                RECEPÇÃO
              </p>

              <h3>
                Espaço de Festas
                <br />
                Nete Titoneli
              </h3>

              <p className="wedding-card-text">
                <strong>
                  Importante:
                </strong>{" "}
                o espaço da recepção será
                liberado somente após a
                realização da cerimônia.
              </p>
            </div>

            <div className="wedding-map-frame">
              <iframe
                src={receptionMapsEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa do Espaço de Festas Nete Titoneli em Cataguases"
              />
            </div>

            <a
              href={receptionDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`wedding-route-button ${styles.routeAccent}`}
            >
              <span className="route-icon">
                ↗
              </span>

              Criar rota
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}