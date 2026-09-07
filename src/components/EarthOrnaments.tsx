import styles from "./EarthOrnaments.module.css";

type EarthOrnamentsProps = {
  variant:
    | "gallery"
    | "transition"
    | "mural"
    | "gifts";
};

export default function EarthOrnaments({
  variant,
}: EarthOrnamentsProps) {
  return (
    <div
      className={`${styles.root} ${styles[variant]}`}
      aria-hidden="true"
    >
      <span
        className={`${styles.branch} ${styles.branchA}`}
      />

      <span
        className={`${styles.branch} ${styles.branchB}`}
      />
    </div>
  );
}
