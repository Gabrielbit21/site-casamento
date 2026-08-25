"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  /*
   * ========================================
   * ESTADOS
   * ========================================
   */

  const [experienceStarted, setExperienceStarted] =
    useState(false);

  const [headerVisible, setHeaderVisible] =
    useState(false);

  /*
   * ========================================
   * ABERTURA
   * ========================================
   *
   * "Em breve" existe somente enquanto
   * estamos praticamente no topo.
   */

  useMotionValueEvent(
    scrollY,
    "change",
    (latest) => {
      setExperienceStarted(latest > 10);
    }
  );

  /*
   * ========================================
   * CABEÇALHO
   * ========================================
   *
   * Aparece quando o Hero está chegando
   * ao enquadramento final e desaparece
   * antes da cena verde assumir a tela.
   */

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (latest) => {
      setHeaderVisible(
        latest >= 0.42 &&
        latest < 0.63
      );
    }
  );

  /*
   * ========================================
   * MÍDIA
   * ========================================
   */

  const mediaScale = useTransform(
    scrollYProgress,
    [0.12, 0.48],
    [1, 0.82]
  );

  const mediaRadius = useTransform(
    scrollYProgress,
    [0.12, 0.48],
    ["0px", "26px"]
  );

  /*
   * ========================================
   * OVERLAY
   * ========================================
   */

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.18],
    [1, 0.32]
  );

  /*
   * ========================================
   * PAINEL VERDE
   * ========================================
   *
   * 56% → 72%
   *
   * O painel sobe por inteiro antes
   * do texto começar a aparecer.
   *
   * Depois de chegar ao topo,
   * permanece nessa posição até
   * o final da cena.
   */

  const storyY = useTransform(
    scrollYProgress,
    [0.56, 0.72, 1],
    ["100%", "0%", "0%"],
    {
      clamp: true,
    }
  );

  const storyScaleX = useTransform(
    scrollYProgress,
    [0.56, 0.72, 1],
    [0.96, 1, 1],
    {
      clamp: true,
    }
  );

  const storyRadius = useTransform(
    scrollYProgress,
    [0.56, 0.72, 1],
    [36, 0, 0],
    {
      clamp: true,
    }
  );

  /*
   * ========================================
   * TEXTO DA HISTÓRIA
   * ========================================
   *
   * 75% → 83%
   *
   * O texto aparece somente depois
   * que o verde já ocupou a tela.
   *
   * De 83% até 100%, a opacidade
   * permanece obrigatoriamente em 1.
   */

  const storyContentOpacity = useTransform(
    scrollYProgress,
    [0.75, 0.83, 1],
    [0, 1, 1],
    {
      clamp: true,
    }
  );

  const storyContentY = useTransform(
    scrollYProgress,
    [0.75, 0.83, 1],
    [38, 0, 0],
    {
      clamp: true,
    }
  );

  return (
    <section
      ref={heroRef}
      className="hero-scroll"
    >
      <div className="hero-sticky">

        {/* ===================================
            FOTO PROVISÓRIA / FUTURO VÍDEO
        ==================================== */}

        <motion.div
          className="hero-media"
          style={{
            scale: mediaScale,
            borderRadius: mediaRadius,
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
              opacity: overlayOpacity,
            }}
          />
        </motion.div>

        {/* ===================================
            CABEÇALHO
        ==================================== */}

        <motion.header
          className="wedding-header"
          initial={false}
          animate={{
            opacity: headerVisible ? 1 : 0,
            y: headerVisible ? 0 : -14,
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="header-names">
            Gabriel <span>&</span> Luana
          </div>

          <div className="header-date">
            28 · 08 · 2027
          </div>
        </motion.header>

        {/* ===================================
            ABERTURA
        ==================================== */}

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
              ease: [0.22, 1, 0.36, 1],
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

        {/* ===================================
            NOSSA HISTÓRIA
        ==================================== */}

        <motion.section
          className="story-panel"
          style={{
            y: storyY,
            scaleX: storyScaleX,
            borderRadius: storyRadius,
          }}
        >
          <motion.div
            className="story-content"
            style={{
              opacity:
                storyContentOpacity,

              y:
                storyContentY,
            }}
          >
            <p className="story-label">
              NOSSA HISTÓRIA
            </p>

            <h2>
              Um novo capítulo
              <br />
              começa aqui.
            </h2>

            <p className="story-text">
              Algumas histórias são escritas
              aos poucos. Entre encontros,
              escolhas, planos e sonhos,
              chegamos ao momento de celebrar
              aquilo que construímos juntos.
            </p>
          </motion.div>
        </motion.section>

      </div>
    </section>
  );
}