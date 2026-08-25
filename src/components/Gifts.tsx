"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
} from "react";

import styles from "./Gifts.module.css";

type GiftStatus =
  | "available"
  | "reserved"
  | "paid";

type Gift = {
  id: number;
  name: string;
  category: string;
  value: number;
  initials: string;
  image?: string;
  status: GiftStatus;
};

const gifts: Gift[] = [
  {
    id: 1,
    name: "Sanduicheira",
    category: "Cozinha",
    value: 189.9,
    initials: "S",
    status: "reserved",
  },
  {
    id: 2,
    name: "Jogo de Panelas",
    category: "Cozinha",
    value: 449.9,
    initials: "JP",
    status: "available",
  },
  {
    id: 3,
    name: "Cafeteira",
    category: "Café",
    value: 249.9,
    initials: "C",
    status: "available",
  },
  {
    id: 4,
    name: "Jogo de Taças",
    category: "Mesa posta",
    value: 199.9,
    initials: "JT",
    status: "available",
  },
  {
    id: 5,
    name: "Aspirador Vertical",
    category: "Casa",
    value: 399.9,
    initials: "AV",
    status: "available",
  },
  {
    id: 6,
    name: "Jogo de Cama",
    category: "Quarto",
    value: 349.9,
    initials: "JC",
    status: "available",
  },
  {
    id: 7,
    name: "Air Fryer",
    category: "Cozinha",
    value: 549.9,
    initials: "AF",
    status: "available",
  },
  {
    id: 8,
    name: "Mixer",
    category: "Cozinha",
    value: 169.9,
    initials: "M",
    status: "available",
  },
];

const INITIAL_VISIBLE_GIFTS = 6;

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  ).format(value);
}

export default function Gifts() {
  const [showAll, setShowAll] =
    useState(false);

  const [
    selectedGift,
    setSelectedGift,
  ] = useState<Gift | null>(null);

  const visibleGifts = showAll
    ? gifts
    : gifts.slice(
        0,
        INITIAL_VISIBLE_GIFTS
      );

  useEffect(() => {
    if (!selectedGift) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setSelectedGift(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedGift]);

  return (
    <>
      <section
        id="presentes"
        className={styles.section}
      >
        <div className={styles.heading}>
          <p className={styles.label}>
            LISTA DE PRESENTES
          </p>

          <h2 className={styles.title}>
            Um pedacinho
            <br />
            da nossa nova casa.
          </h2>

          <p
            className={
              styles.description
            }
          >
            Para quem quiser fazer parte
            desse novo começo, escolhemos
            alguns presentes que estarão
            presentes na nossa vida a dois.
          </p>

          <p className={styles.pixInfo}>
            O valor de cada presente será
            enviado diretamente via Pix.
          </p>
        </div>

        <div className={styles.grid}>
          {visibleGifts.map((gift) => {
            const unavailable =
              gift.status !== "available";

            return (
              <article
                key={gift.id}
                className={`${styles.card} ${
                  unavailable
                    ? styles.cardUnavailable
                    : ""
                }`}
              >
                <div
                  className={
                    styles.imageArea
                  }
                >
                  {gift.image ? (
                    <Image
                      src={gift.image}
                      alt={gift.name}
                      fill
                      sizes="
                        (max-width: 650px) 90vw,
                        (max-width: 1000px) 45vw,
                        300px
                      "
                      className={
                        styles.image
                      }
                    />
                  ) : (
                    <div
                      className={
                        styles.placeholder
                      }
                    >
                      <span
                        className={
                          styles.initials
                        }
                      >
                        {gift.initials}
                      </span>

                      <span
                        className={
                          styles.placeholderCategory
                        }
                      >
                        {gift.category}
                      </span>
                    </div>
                  )}

                  {unavailable && (
                    <div
                      className={
                        styles.unavailableOverlay
                      }
                    >
                      <span
                        className={
                          styles.unavailableBadge
                        }
                      >
                        {gift.status ===
                        "paid"
                          ? "Presente recebido"
                          : "Indisponível"}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={
                    styles.cardContent
                  }
                >
                  <p
                    className={
                      styles.category
                    }
                  >
                    {gift.category}
                  </p>

                  <h3
                    className={
                      styles.giftName
                    }
                  >
                    {gift.name}
                  </h3>

                  <div
                    className={
                      styles.cardFooter
                    }
                  >
                    <div
                      className={
                        styles.priceBlock
                      }
                    >
                      <span
                        className={
                          styles.priceLabel
                        }
                      >
                        Valor
                      </span>

                      <strong
                        className={
                          styles.price
                        }
                      >
                        {formatCurrency(
                          gift.value
                        )}
                      </strong>
                    </div>

                    <button
                      type="button"
                      disabled={unavailable}
                      onClick={() =>
                        setSelectedGift(
                          gift
                        )
                      }
                      className={`${styles.giftButton} ${
                        unavailable
                          ? styles.giftButtonUnavailable
                          : ""
                      }`}
                    >
                      {unavailable
                        ? "Escolhido"
                        : "Presentear"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {gifts.length >
          INITIAL_VISIBLE_GIFTS && (
          <div
            className={
              styles.moreWrapper
            }
          >
            <button
              type="button"
              className={
                styles.moreButton
              }
              onClick={() =>
                setShowAll(
                  (current) =>
                    !current
                )
              }
            >
              {showAll
                ? "Ver menos"
                : "Ver todos os presentes"}
            </button>
          </div>
        )}
      </section>

      {selectedGift && (
        <div
          className={styles.modalBackdrop}
          onClick={() =>
            setSelectedGift(null)
          }
        >
          <div
            className={styles.modal}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className={
                styles.modalHeader
              }
            >
              <div>
                <p
                  className={
                    styles.modalLabel
                  }
                >
                  PRESENTEAR
                </p>

                <h3
                  className={
                    styles.modalTitle
                  }
                >
                  {selectedGift.name}
                </h3>
              </div>

              <button
                type="button"
                className={
                  styles.modalClose
                }
                onClick={() =>
                  setSelectedGift(
                    null
                  )
                }
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div
              className={
                styles.modalDivider
              }
            />

            <div
              className={
                styles.modalValue
              }
            >
              <span>
                Valor do presente
              </span>

              <strong>
                {formatCurrency(
                  selectedGift.value
                )}
              </strong>
            </div>

            <p
              className={
                styles.modalText
              }
            >
              Nesta etapa estamos
              finalizando apenas a
              experiência visual. Quando
              conectarmos o Supabase,
              este fluxo fará a reserva
              exclusiva do presente e
              exibirá o pagamento via Pix.
            </p>

            <button
              type="button"
              className={
                styles.modalButton
              }
              onClick={() =>
                setSelectedGift(null)
              }
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}