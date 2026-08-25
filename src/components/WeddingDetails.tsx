import Image from "next/image";

import WeddingCountdown from "@/components/WeddingCountdown";

const mapQuery = encodeURIComponent(
  "Primeira Igreja Metodista Wesleyana Cataguases MG"
);

const mapsEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=driving`;

const calendarTitle =
  encodeURIComponent(
    "Casamento Gabriel e Luana"
  );

const calendarDetails =
  encodeURIComponent(
    "Cerimônia de casamento de Gabriel e Luana. Nos vemos às 15:30 na Primeira Igreja Metodista Wesleyana, em Cataguases - MG."
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
            Cataguases · Minas Gerais
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
              className="wedding-calendar-button"
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
                LOCALIZAÇÃO
              </p>

              <h3>
                Primeira Igreja Metodista Wesleyana
              </h3>

              <p className="wedding-card-text">
                Cataguases · Minas Gerais
              </p>
            </div>

            <div className="wedding-map-frame">
              <iframe
                src={mapsEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa da Primeira Igreja Metodista Wesleyana em Cataguases"
              />
            </div>

            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wedding-route-button"
            >
              <span className="route-icon">
                ↗
              </span>

              Criar rota
            </a>
          </article>

          <article className="wedding-card wedding-photos-card">
            <div className="wedding-card-head">
              <p className="wedding-card-label">
                O LOCAL
              </p>

              <h3>
                Um espaço especial
                <br />
                para o nosso sim.
              </h3>

              <p className="wedding-card-text">
                Por enquanto, estas imagens
                servem como preenchimento
                visual. Depois substituímos
                pelas fotos oficiais da
                igreja.
              </p>
            </div>

            <div className="wedding-photo-grid">
              <div className="wedding-photo wedding-photo-large">
                <Image
                  src="/images/gallery/foto3.jpeg"
                  alt="Imagem de referência para o local do casamento"
                  fill
                  className="wedding-photo-image"
                />
              </div>

              <div className="wedding-photo">
                <Image
                  src="/images/gallery/foto4.jpeg"
                  alt="Imagem complementar de referência"
                  fill
                  className="wedding-photo-image"
                />
              </div>

              <div className="wedding-photo">
                <Image
                  src="/images/gallery/foto5.jpeg"
                  alt="Imagem complementar de referência para a cerimônia"
                  fill
                  className="wedding-photo-image"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}