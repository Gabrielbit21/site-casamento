"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./FloatingMenu.module.css";

const RSVP_OPEN_EVENT =
  "wedding:rsvp:open";

const RSVP_STATE_EVENT =
  "wedding:rsvp:state";

type RSVPStateDetail = {
  responded: boolean;
};

const navigationItems = [
  {
    label: "Início",
    target: "inicio",
  },
  {
    label: "Nossas fotos",
    target: "fotos",
  },
  {
    label: "O casamento",
    target: "casamento",
  },
  {
    label: "Momentos",
    target: "momentos",
  },
  {
    label:
      "Lista de presentes",
    target: "presentes",
  },
];

export default function FloatingMenu() {
  const [
    visible,
    setVisible,
  ] =
    useState(false);

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    responded,
    setResponded,
  ] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(
      null
    );

  useEffect(() => {
    const handleScroll =
      () => {
        const showAfter =
          window.innerHeight *
          0.75;

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

  useEffect(() => {
    const handleRSVPState =
      (
        event: Event
      ) => {
        const customEvent =
          event as
            CustomEvent<RSVPStateDetail>;

        if (
          typeof customEvent
            .detail
            ?.responded ===
          "boolean"
        ) {
          setResponded(
            customEvent
              .detail
              .responded
          );
        }
      };

    window.addEventListener(
      RSVP_STATE_EVENT,
      handleRSVPState
    );

    return () => {
      window.removeEventListener(
        RSVP_STATE_EVENT,
        handleRSVPState
      );
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown =
      (
        event:
          MouseEvent
      ) => {
        const target =
          event.target as Node;

        if (
          !containerRef
            .current
            ?.contains(
              target
            )
        ) {
          setOpen(false);
        }
      };

    const handleKeyDown =
      (
        event:
          KeyboardEvent
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  const scrollToSection =
    (
      target: string
    ) => {
      const element =
        document.getElementById(
          target
        );

      if (!element) {
        return;
      }

      setOpen(false);

      element.scrollIntoView({
        behavior:
          "smooth",

        block:
          "start",
      });
    };

  const openRSVP =
    () => {
      setOpen(false);

      window.dispatchEvent(
        new CustomEvent(
          RSVP_OPEN_EVENT
        )
      );
    };

  const openMomentsUpload =
    () => {
      window.location.href =
        "/momentos";
    };

  return (
    <div
      ref={containerRef}
      className={`${styles.wrapper} ${
        visible
          ? styles.visible
          : styles.hidden
      }`}
    >
      <div
        className={`${styles.panel} ${
          open
            ? styles.panelOpen
            : ""
        }`}
        aria-hidden={
          !open
        }
      >
        <div
          className={
            styles.panelHeader
          }
        >
          <span>
            Guia rápido
          </span>

          <small>
            Gabriel & Luana
          </small>
        </div>

        <nav
          className={
            styles.navigation
          }
          aria-label="Navegação rápida"
        >
          {navigationItems.map(
            (item) => (
              <button
                key={
                  item.target
                }
                type="button"
                onClick={() =>
                  scrollToSection(
                    item.target
                  )
                }
                className={
                  styles.navigationItem
                }
              >
                <span>
                  {
                    item.label
                  }
                </span>

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M8 12H16M13 9L16 12L13 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )
          )}
        </nav>

        <div
          className={
            styles.actions
          }
        >
          <button
            type="button"
            onClick={
              openRSVP
            }
            className={
              styles.secondaryAction
            }
          >
            <span
              className={
                styles.actionIcon
              }
            >
              {responded
                ? "✓"
                : "○"}
            </span>

            <span>
              <strong>
                {responded
                  ? "Presença confirmada"
                  : "Confirmar presença"}
              </strong>

              <small>
                {responded
                  ? "Revisar respostas"
                  : "Responder convite"}
              </small>
            </span>
          </button>

          <button
            type="button"
            onClick={
              openMomentsUpload
            }
            className={
              styles.primaryAction
            }
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M4.5 8.5H7L8.3 6.5H15.7L17 8.5H19.5V18.5H4.5V8.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />

              <circle
                cx="12"
                cy="13"
                r="3.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>

            <span>
              Enviar um momento
            </span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setOpen(
            (
              current
            ) =>
              !current
          )
        }
        aria-label={
          open
            ? "Fechar menu"
            : "Abrir menu"
        }
        aria-expanded={
          open
        }
        className={`${styles.trigger} ${
          open
            ? styles.triggerOpen
            : ""
        }`}
      >
        <span
          className={
            styles.menuIcon
          }
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
        </span>

        <span
          className={
            styles.triggerText
          }
        >
          Menu
        </span>
      </button>
    </div>
  );
}