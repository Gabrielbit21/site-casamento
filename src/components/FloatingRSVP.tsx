"use client";

import {
  useEffect,
  useState,
} from "react";

import styles from "./FloatingRSVP.module.css";

type FloatingRSVPProps = {
  confirmed?: boolean;
};

export default function FloatingRSVP({
  confirmed = false,
}: FloatingRSVPProps) {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const showAfter =
        window.innerHeight * 1.1;

      setVisible(
        window.scrollY >
          showAfter
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const goToRSVP = () => {
    const rsvpButton =
      document.getElementById(
        "confirmar-presenca"
      );

    rsvpButton?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <button
      type="button"
      onClick={goToRSVP}
      aria-label={
        confirmed
          ? "Presença confirmada. Clique para revisar."
          : "Ir para confirmação de presença"
      }
      className={`${styles.button} ${
        visible
          ? styles.visible
          : styles.hidden
      } ${
        confirmed
          ? styles.confirmed
          : ""
      }`}
    >
      <span className={styles.icon}>
        {confirmed ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M5 12.5L9.2 16.5L19 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M7.5 4.5V7M16.5 4.5V7M5 9H19M6.5 6H17.5C18.3284 6 19 6.67157 19 7.5V18C19 18.8284 18.3284 19.5 17.5 19.5H6.5C5.67157 19.5 5 18.8284 5 18V7.5C5 6.67157 5.67157 6 6.5 6Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>

      <span className={styles.content}>
        <strong>
          {confirmed
            ? "Presença confirmada"
            : "Confirmar presença"}
        </strong>

        <small>
          {confirmed
            ? "Revisar confirmação"
            : "28 · 08 · 2027"}
        </small>
      </span>
    </button>
  );
}