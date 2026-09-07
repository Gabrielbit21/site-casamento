"use client";

import Image from "next/image";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import {
  useRef,
  useState,
} from "react";

export default function Hero() {
  const heroRef =
    useRef<HTMLElement>(
      null
    );

  const { scrollY } =
    useScroll();

  const {
    scrollYProgress,
  } = useScroll({
    target: heroRef,
    offset: [
      "start start",
      "end end",
    ],
  });

  const [
    experienceStarted,
    setExperienceStarted,
  ] =
    useState(false);

  const [
    headerVisible,
    setHeaderVisible,
  ] =
    useState(false);

  useMotionValueEvent(
    scrollY,
    "change",
    (latest) => {
      setExperienceStarted(
        latest > 10
      );
    }
  );

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (latest) => {
      setHeaderVisible(
        latest >= 0.38 &&
          latest < 0.84
      );
    }
  );

  const mediaScale =
    useTransform(
      scrollYProgress,
      [0.12, 0.82],
      [1, 0.82]
    );

  const mediaRadius =
    useTransform(
      scrollYProgress,
      [0.12, 0.82],
      [
        "0px",
        "26px",
      ]
    );

  const overlayOpacity =
    useTransform(
      scrollYProgress,
      [0.02, 0.24],
      [1, 0.32]
    );

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="hero-scroll"
      style={{
        height: "155vh",
      }}
    >
      <div className="hero-sticky">
        <motion.div
          className="hero-media"
          style={{
            scale:
              mediaScale,

            borderRadius:
              mediaRadius,
          }}
        >
          <div className="hero-background">
            <Image
              src="/images/testes/casal-jardim.jpg"
              alt="Gabriel e Luana"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="hero-image"
            />
          </div>

          <motion.div
            className="hero-overlay"
            style={{
              opacity:
                overlayOpacity,
            }}
          />
        </motion.div>

        <motion.header
          className="wedding-header"
          initial={false}
          animate={{
            opacity:
              headerVisible
                ? 1
                : 0,

            y:
              headerVisible
                ? 0
                : -14,
          }}
          transition={{
            duration: 0.45,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <div className="header-names">
            Gabriel{" "}
            <span>
              &
            </span>{" "}
            Luana
          </div>

          <div className="header-date">
            28 · 08 · 2027
          </div>
        </motion.header>

        <div className="hero-center">
          <motion.div
            className="hero-teaser"
            initial={false}
            animate={{
              opacity:
                experienceStarted
                  ? 0
                  : 1,

              y:
                experienceStarted
                  ? -28
                  : 0,

              scale:
                experienceStarted
                  ? 0.97
                  : 1,
            }}
            transition={{
              duration: 0.42,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <h1>
              Em breve
            </h1>

            <span className="hero-teaser-small">
              GABRIEL & LUANA
            </span>

            <span className="hero-teaser-date">
              28 · 08 · 2027
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}