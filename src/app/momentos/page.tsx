import MomentsUpload from "./MomentsUpload";
import styles from "./MomentsUpload.module.css";

export default function MomentosPage() {
  return (
    <main className={styles.page}>
      <div className={styles.branchTopRight} aria-hidden="true" />
      <div className={styles.branchBottomLeft} aria-hidden="true" />

      <section className={styles.pageContainer}>
        <div className={styles.pageIntro}>
          <span className={styles.pageEyebrow}>MURAL DE MOMENTOS</span>

          <h1 className={styles.pageTitle}>
            Compartilhe um instante especial.
          </h1>

          <p className={styles.pageDescription}>
            Registre uma lembrança da cerimônia ou da recepção e deixe esse
            momento fazer parte do nosso mural coletivo.
          </p>
        </div>

        <MomentsUpload />
      </section>
    </main>
  );
}