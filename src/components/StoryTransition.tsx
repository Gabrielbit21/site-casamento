"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";

import {
  useRef,
} from "react";

import styles from "./StoryTransition.module.css";

export default function StoryTransition() {
  const sectionRef =
    useRef<HTMLElement>(
      null
    );

  const {
    scrollYProgress,
  } = useScroll({
    target: sectionRef,

    offset: [
      "start start",
      "end end",
    ],
  });

  const panelY =
    useTransform(
      scrollYProgress,
      [
        0.06,
        0.55,
        1,
      ],
      [
        "100%",
        "0%",
        "0%",
      ],
      {
        clamp: true,
      }
    );

  const panelScaleX =
    useTransform(
      scrollYProgress,
      [
        0.06,
        0.55,
        1,
      ],
      [
        0.96,
        1,
        1,
      ],
      {
        clamp: true,
      }
    );

  const panelRadius =
    useTransform(
      scrollYProgress,
      [
        0.06,
        0.55,
        1,
      ],
      [
        36,
        0,
        0,
      ],
      {
        clamp: true,
      }
    );

  const contentOpacity =
    useTransform(
      scrollYProgress,
      [
        0.57,
        0.76,
        1,
      ],
      [
        0,
        1,
        1,
      ],
      {
        clamp: true,
      }
    );

  const contentY =
    useTransform(
      scrollYProgress,
      [
        0.57,
        0.76,
        1,
      ],
      [
        38,
        0,
        0,
      ],
      {
        clamp: true,
      }
    );

  return (
    <section
      ref={sectionRef}
      className={
        styles.transition
      }
    >
      <div
        className={
          styles.sticky
        }
      >
        <motion.section
          className="story-panel"
          style={{
            y: panelY,

            scaleX:
              panelScaleX,

            borderRadius:
              panelRadius,
          }}
        >
          <motion.div
            className="story-content"
            style={{
              opacity:
                contentOpacity,

              y:
                contentY,
            }}
          >
            <p className="story-label">
              NOSSA HISTÓRIA
            </p>

            <h2>
              Um novo capítulo
              <br />
              está prestes a
              iniciar.
            </h2>
          </motion.div>
        </motion.section>
      </div>
    </section>
  );
}