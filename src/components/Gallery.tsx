"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const photos = [
  {
    src: "/images/testes/foto1.jpeg",
    alt: "Gabriel e Luana juntos",
  },
  {
    src: "/images/testes/foto2.jpeg",
    alt: "Gabriel e Luana em um momento especial",
  },
  {
    src: "/images/testes/foto3.jpeg",
    alt: "Gabriel e Luana sorrindo juntos",
  },
  {
    src: "/images/testes/foto4.jpeg",
    alt: "Gabriel e Luana em um momento descontraído",
  },
  {
    src: "/images/testes/foto5.jpeg",
    alt: "Gabriel e Luana juntos em mais uma memória especial",
  },

  /*
   * Quando adicionarmos novas fotos,
   * continuaremos colocando aqui.
   *
   * Exemplo:
   *
   * {
   *   src: "/images/testes/foto6.jpeg",
   *   alt: "Gabriel e Luana",
   * },
   */
];

const INITIAL_VISIBLE_PHOTOS = 6;

export default function Gallery() {
  const [showAll, setShowAll] = useState(false);

  const [selectedPhoto, setSelectedPhoto] =
    useState<number | null>(null);

  const visiblePhotos = showAll
    ? photos
    : photos.slice(0, INITIAL_VISIBLE_PHOTOS);

  const currentPhoto =
    selectedPhoto !== null
      ? photos[selectedPhoto]
      : null;

  const hasMorePhotos =
    photos.length > INITIAL_VISIBLE_PHOTOS;

  const openPhoto = (index: number) => {
    setSelectedPhoto(index);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const showPreviousPhoto = () => {
    if (selectedPhoto === null) {
      return;
    }

    setSelectedPhoto(
      selectedPhoto === 0
        ? photos.length - 1
        : selectedPhoto - 1
    );
  };

  const showNextPhoto = () => {
    if (selectedPhoto === null) {
      return;
    }

    setSelectedPhoto(
      selectedPhoto === photos.length - 1
        ? 0
        : selectedPhoto + 1
    );
  };

  useEffect(() => {
    if (selectedPhoto === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closePhoto();
      }

      if (event.key === "ArrowLeft") {
        showPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        showNextPhoto();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedPhoto]);

  return (
    <>
      <section className="gallery-section">
        <div className="gallery-heading">
          <p className="section-label">
            NOSSOS MOMENTOS
          </p>

          <h2>
            Memórias que
            <br />
            trouxeram a gente até aqui.
          </h2>

          <p>
            Entre encontros, viagens, risadas e
            pequenos instantes, fomos escrevendo
            uma história que agora nos conduz ao
            nosso grande dia.
          </p>
        </div>

        <div className="gallery-grid">
          {visiblePhotos.map(
            (photo, index) => (
              <button
                type="button"
                className="gallery-item"
                key={photo.src}
                onClick={() =>
                  openPhoto(index)
                }
                aria-label={`Abrir fotografia ${
                  index + 1
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="
                    (max-width: 600px) 100vw,
                    (max-width: 1000px) 50vw,
                    33vw
                  "
                  className="gallery-image"
                />

                <span className="gallery-hover">
                  <span>Ver foto</span>
                </span>
              </button>
            )
          )}
        </div>

        {hasMorePhotos && (
          <div className="gallery-more-wrapper">
            <button
              type="button"
              className="gallery-more"
              onClick={() =>
                setShowAll(
                  (current) => !current
                )
              }
            >
              {showAll
                ? "Ver menos"
                : "Ver mais"}
            </button>
          </div>
        )}
      </section>

      {currentPhoto && (
        <div
          className="gallery-lightbox"
          onClick={closePhoto}
        >
          <button
            type="button"
            className="gallery-close"
            onClick={closePhoto}
            aria-label="Fechar fotografia"
          >
            ×
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-navigation gallery-navigation-left"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousPhoto();
                }}
                aria-label="Fotografia anterior"
              >
                ←
              </button>

              <button
                type="button"
                className="gallery-navigation gallery-navigation-right"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextPhoto();
                }}
                aria-label="Próxima fotografia"
              >
                →
              </button>
            </>
          )}

          <div
            className="gallery-lightbox-image"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Image
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              fill
              sizes="95vw"
              quality={95}
              className="gallery-image-full"
            />
          </div>

          <div className="gallery-counter">
            {selectedPhoto !== null &&
              `${selectedPhoto + 1} / ${
                photos.length
              }`}
          </div>
        </div>
      )}
    </>
  );
}