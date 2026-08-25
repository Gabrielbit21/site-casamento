"use client";

import {
  useEffect,
  useState,
} from "react";

import styles from "./WeddingCountdown.module.css";

const WEDDING_DATE =
  new Date(
    "2027-08-28T15:30:00-03:00"
  );

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(): TimeLeft {
  const difference =
    WEDDING_DATE.getTime() -
    new Date().getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    ),

    hours: Math.floor(
      (difference /
        (1000 * 60 * 60)) %
        24
    ),

    minutes: Math.floor(
      (difference /
        (1000 * 60)) %
        60
    ),

    seconds: Math.floor(
      (difference / 1000) %
        60
    ),
  };
}

function formatNumber(
  value: number
) {
  return String(value).padStart(
    2,
    "0"
  );
}

export default function WeddingCountdown() {
  const [
    timeLeft,
    setTimeLeft,
  ] = useState<TimeLeft | null>(
    null
  );

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(
        calculateTimeLeft()
      );
    };

    updateCountdown();

    const interval =
      window.setInterval(
        updateCountdown,
        1000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  const finished =
    timeLeft &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (finished) {
    return (
      <div className={styles.finished}>
        É hoje.
      </div>
    );
  }

  const items = [
    {
      value:
        timeLeft?.days ?? "--",
      label: "Dias",
    },
    {
      value:
        timeLeft
          ? formatNumber(
              timeLeft.hours
            )
          : "--",
      label: "Horas",
    },
    {
      value:
        timeLeft
          ? formatNumber(
              timeLeft.minutes
            )
          : "--",
      label: "Min",
    },
    {
      value:
        timeLeft
          ? formatNumber(
              timeLeft.seconds
            )
          : "--",
      label: "Seg",
    },
  ];

  return (
    <div
      className={styles.wrapper}
      aria-label="Contagem regressiva para o casamento"
    >
      <p className={styles.eyebrow}>
        FALTAM
      </p>

      <div className={styles.countdown}>
        {items.map(
          (item, index) => (
            <div
              key={item.label}
              className={
                styles.item
              }
            >
              <strong>
                {item.value}
              </strong>

              <span>
                {item.label}
              </span>

              {index <
                items.length -
                  1 && (
                <i
                  className={
                    styles.separator
                  }
                  aria-hidden="true"
                />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}