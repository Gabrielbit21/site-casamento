"use client";

import Image from "next/image";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./InviteOpening.module.css";

type InviteExperienceProps = {
  token: string;
  familyName: string;
  guestCount: number;
};

function Monogram() {
  return (
    <Image
      src="/images/monograma-gl-branco-site.png"
      alt="Monograma de Gabriel e Luana"
      width={70}
      height={70}
      priority
      unoptimized
      className={styles.monogram}
      style={{
        width: "70px",
        height: "70px",
        objectFit: "contain",
      }}
    />
  );
}

function BotanicalBranch({
  side,
}: {
  side: "left" | "right";
}) {
  return (
    <svg
      viewBox="0 0 320 660"
      className={`${styles.botanical} ${
        side === "left"
          ? styles.botanicalLeft
          : styles.botanicalRight
      }`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="
          M156 654
          C135 574 141 504 170 443
          C201 378 222 318 214 252
          C205 178 172 111 117 41
        "
        className={styles.botanicalStem}
      />

      <path
        d="
          M170 448
          C129 429 100 398 82 361
        "
        className={styles.botanicalStem}
      />

      <path
        d="
          M181 416
          C222 402 252 374 273 340
        "
        className={styles.botanicalStem}
      />

      <path
        d="
          M207 328
          C168 312 137 282 116 245
        "
        className={styles.botanicalStem}
      />

      <path
        d="
          M211 284
          C246 269 270 242 286 211
        "
        className={styles.botanicalStem}
      />

      <path
        d="
          M196 207
          C160 193 132 166 113 133
        "
        className={styles.botanicalStem}
      />

      <path
        d="
          M172 450
          C146 425 113 423 89 442
          C110 461 143 465 172 450Z
        "
        className={styles.botanicalLeaf}
      />

      <path
        d="
          M180 417
          C208 391 241 389 267 407
          C246 430 211 434 180 417Z
        "
        className={styles.botanicalLeaf}
      />

      <path
        d="
          M207 328
          C181 301 149 297 122 313
          C142 337 176 343 207 328Z
        "
        className={styles.botanicalLeaf}
      />

      <path
        d="
          M211 284
          C235 255 267 250 294 265
          C276 290 242 298 211 284Z
        "
        className={styles.botanicalLeaf}
      />

      <path
        d="
          M196 207
          C169 180 139 177 114 192
          C133 217 166 223 196 207Z
        "
        className={styles.botanicalLeaf}
      />

      <path
        d="
          M166 145
          C188 119 214 114 238 125
          C222 149 194 157 166 145Z
        "
        className={styles.botanicalLeaf}
      />

      <path
        d="
          M137 77
          C113 57 88 56 68 69
          C84 88 111 93 137 77Z
        "
        className={styles.botanicalLeaf}
      />
    </svg>
  );
}

export default function InviteExperience({
  token,
  familyName,
  guestCount,
}: InviteExperienceProps) {
  const router = useRouter();

  const reduceMotion =
    useReducedMotion();

  const [opened, setOpened] =
    useState(false);

  const [leaving, setLeaving] =
    useState(false);

  const openInvitation = () => {
    if (opened) {
      return;
    }

    setOpened(true);
  };

  const enterSite = () => {
    setLeaving(true);

    window.setTimeout(
      () => {
        router.push(
          `/?convite=${encodeURIComponent(
            token
          )}`
        );
      },
      reduceMotion
        ? 50
        : 750
    );
  };

  return (
    <motion.main
      className={styles.page}
      animate={{
        opacity: leaving
          ? 0
          : 1,

        scale: leaving
          ? 1.012
          : 1,
      }}
      transition={{
        duration:
          reduceMotion
            ? 0
            : 0.7,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
    >
      <div
        className={styles.ambientGlow}
      />

      <BotanicalBranch
        side="left"
      />

      <BotanicalBranch
        side="right"
      />

      <motion.div
        className={styles.intro}
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: -12,
              }
        }
        animate={{
          opacity:
            opened
              ? 0
              : 1,

          y:
            opened
              ? -12
              : 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <p>
          CONVITE PARTICULAR
        </p>

        <span>
          Para
        </span>

        <h1>
          {familyName}
        </h1>
      </motion.div>

      <section
        className={styles.stage}
      >
        <motion.div
          className={
            styles.envelopeScene
          }
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 120,
                  scale: 0.95,
                  rotate: -1.5,
                }
          }
          animate={{
            opacity: 1,

            y:
              opened
                ? 112
                : 0,

            scale:
              opened
                ? 0.94
                : 1,

            rotate: 0,
          }}
          transition={{
            duration:
              opened
                ? 0.95
                : 1.2,

            delay:
              opened
                ? 0
                : 0.12,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <div
            className={`${styles.letterAnchor} ${
              opened
                ? styles.letterAnchorOpen
                : ""
            }`}
          >
            <motion.div
              className={styles.letter}
              initial={false}
              animate={{
                y:
                  opened
                    ? -116
                    : 110,

                scale:
                  opened
                    ? 1
                    : 0.91,

                opacity:
                  opened
                    ? 1
                    : 0,
              }}
              transition={{
                y: {
                  duration:
                    reduceMotion
                      ? 0
                      : 1.05,

                  delay:
                    reduceMotion
                      ? 0
                      : 0.42,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                },

                opacity: {
                  duration: 0.4,

                  delay:
                    reduceMotion
                      ? 0
                      : 0.4,
                },

                scale: {
                  duration:
                    reduceMotion
                      ? 0
                      : 0.9,

                  delay:
                    reduceMotion
                      ? 0
                      : 0.4,
                },
              }}
            >
              <div
                className={
                  styles.letterInner
                }
              >
                <p
                  className={
                    styles.weddingEyebrow
                  }
                >
                  O NOSSO CASAMENTO
                </p>

                <div
                  className={
                    styles.coupleNames
                  }
                >
                  <span>
                    Gabriel
                  </span>

                  <i>&</i>

                  <span>
                    Luana
                  </span>
                </div>

                <div
                  className={
                    styles.weddingDivider
                  }
                >
                  <span />
                  <i />
                  <span />
                </div>

                <div
                  className={
                    styles.dateGroup
                  }
                >
                  <div
                    className={
                      styles.letterDate
                    }
                  >
                    <strong>
                      28
                    </strong>

                    <div>
                      <span>
                        Agosto
                      </span>

                      <small>
                        2027
                      </small>
                    </div>
                  </div>

                  <p
                    className={
                      styles.letterTime
                    }
                  >
                    às 15:30
                  </p>
                </div>

                <p
                  className={
                    styles.letterMessage
                  }
                >
                  Com alegria,
                  convidamos vocês para
                  celebrar conosco o
                  início deste novo
                  capítulo e compartilhar
                  um dos momentos mais
                  especiais das nossas
                  vidas.
                </p>

                <div
                  className={
                    styles.guestReservation
                  }
                >
                  <span>
                    ESTE CONVITE É
                    RESERVADO PARA
                  </span>

                  <strong>
                    {guestCount}{" "}
                    {guestCount === 1
                      ? "PESSOA"
                      : "PESSOAS"}
                  </strong>
                </div>

                <motion.button
                  type="button"
                  className={
                    styles.enterButton
                  }
                  onClick={
                    enterSite
                  }
                  initial={false}
                  animate={{
                    opacity:
                      opened
                        ? 1
                        : 0,

                    y:
                      opened
                        ? 0
                        : 10,
                  }}
                  transition={{
                    duration: 0.55,

                    delay:
                      reduceMotion
                        ? 0
                        : 1.25,
                  }}
                >
                  Entrar no site

                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div
            className={
              styles.envelope
            }
          >
            <div
              className={
                styles.envelopeBack
              }
            />

            <div
              className={
                styles.envelopeFront
              }
            >
              <div
                className={
                  styles.frontLeft
                }
              />

              <div
                className={
                  styles.frontRight
                }
              />

              <div
                className={
                  styles.frontBottom
                }
              />
            </div>

            <motion.div
              className={styles.flap}
              initial={false}
              animate={{
                rotateX:
                  opened
                    ? -180
                    : 0,
              }}
              transition={{
                duration:
                  reduceMotion
                    ? 0
                    : 0.9,

                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            />

            <div
              className={
                styles.sealAnchor
              }
            >
              <motion.button
                type="button"
                className={
                  styles.sealButton
                }
                onClick={
                  openInvitation
                }
                aria-label="Abrir convite"
                initial={false}
                animate={{
                  opacity:
                    opened
                      ? 0
                      : 1,

                  scale:
                    opened
                      ? 0.72
                      : 1,

                  rotate:
                    opened
                      ? 5
                      : 0,
                }}
                whileHover={
                  opened
                    ? undefined
                    : {
                        scale: 1.055,
                        y: -3,
                      }
                }
                whileTap={
                  opened
                    ? undefined
                    : {
                        scale: 0.94,
                      }
                }
                transition={{
                  duration:
                    reduceMotion
                      ? 0
                      : 0.35,
                }}
                style={{
                  pointerEvents:
                    opened
                      ? "none"
                      : "auto",
                }}
              >
                <Monogram />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.div
        className={
          styles.instructions
        }
        animate={{
          opacity:
            opened
              ? 0
              : 1,

          y:
            opened
              ? 5
              : 0,
        }}
        transition={{
          duration: 0.35,
        }}
      >
        <span />

        <p>
          Clique no selo para abrir
        </p>

        <span />
      </motion.div>
    </motion.main>
  );
}