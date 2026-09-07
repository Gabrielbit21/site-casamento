"use client";

import Image from "next/image";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./InstallAppPrompt.module.css";

const RSVP_STATE_EVENT =
  "wedding:rsvp:state";

const STORAGE_KEY =
  "wedding_invite_token";

const DISMISSED_AT_KEY =
  "wedding_install_prompt_dismissed_at";

const INSTALLED_KEY =
  "wedding_app_installed";

const DISMISS_FOR_MS =
  7 * 24 * 60 * 60 * 1000;

type RSVPStateDetail = {
  responded: boolean;
};

type InstallChoice = {
  outcome:
    | "accepted"
    | "dismissed";
  platform: string;
};

type BeforeInstallPromptEvent =
  Event & {
    prompt: () =>
      Promise<InstallChoice>;
    userChoice:
      Promise<InstallChoice>;
  };

type InstructionMode =
  | "ios"
  | "browser"
  | null;

function getLocalValue(
  key: string
) {
  try {
    return localStorage.getItem(
      key
    );
  } catch {
    return null;
  }
}

function setLocalValue(
  key: string,
  value: string
) {
  try {
    localStorage.setItem(
      key,
      value
    );
  } catch {
    // A instalação continua disponível pelo navegador.
  }
}

function removeLocalValue(
  key: string
) {
  try {
    localStorage.removeItem(
      key
    );
  } catch {
    // Nada a fazer.
  }
}

function getSessionValue(
  key: string
) {
  try {
    return sessionStorage.getItem(
      key
    );
  } catch {
    return null;
  }
}

function isIOS() {
  const navigatorWithPlatform =
    navigator as Navigator & {
      platform?: string;
    };

  return (
    /iPhone|iPad|iPod/i.test(
      navigator.userAgent
    ) ||
    (navigatorWithPlatform.platform ===
      "MacIntel" &&
      navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  const navigatorWithStandalone =
    navigator as Navigator & {
      standalone?: boolean;
    };

  return (
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    navigatorWithStandalone.standalone ===
      true
  );
}

function isRecentlyDismissed() {
  const rawValue =
    getLocalValue(
      DISMISSED_AT_KEY
    );

  if (!rawValue) {
    return false;
  }

  const timestamp =
    Number(rawValue);

  if (
    !Number.isFinite(timestamp)
  ) {
    removeLocalValue(
      DISMISSED_AT_KEY
    );

    return false;
  }

  return (
    Date.now() - timestamp <
    DISMISS_FOR_MS
  );
}

function persistCurrentInvite() {
  const token =
    getSessionValue(
      STORAGE_KEY
    );

  if (!token) {
    return false;
  }

  setLocalValue(
    STORAGE_KEY,
    token
  );

  return true;
}

export default function InstallAppPrompt() {
  const installEventRef =
    useRef<BeforeInstallPromptEvent | null>(
      null
    );

  const respondedRef =
    useRef(false);

  const [visible, setVisible] =
    useState(false);

  const [instructions, setInstructions] =
    useState<InstructionMode>(null);

  const [installing, setInstalling] =
    useState(false);

  const [
    nativeInstallReady,
    setNativeInstallReady,
  ] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setLocalValue(
        INSTALLED_KEY,
        "true"
      );

      return;
    }

    if (
      getLocalValue(
        INSTALLED_KEY
      ) === "true"
    ) {
      return;
    }

    const maybeShowPrompt = () => {
      if (
        !respondedRef.current ||
        isRecentlyDismissed()
      ) {
        return;
      }

      setVisible(true);
    };

    const handleBeforeInstall = (
      event: Event
    ) => {
      const installEvent =
        event as BeforeInstallPromptEvent;

      installEvent.preventDefault();

      installEventRef.current =
        installEvent;

      setNativeInstallReady(true);

      maybeShowPrompt();
    };

    const handleAppInstalled = () => {
      installEventRef.current =
        null;

      setLocalValue(
        INSTALLED_KEY,
        "true"
      );

      removeLocalValue(
        DISMISSED_AT_KEY
      );

      setNativeInstallReady(false);
      setInstructions(null);
      setVisible(false);
    };

    const handleRSVPState = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<RSVPStateDetail>;

      const responded =
        customEvent.detail
          ?.responded === true;

      respondedRef.current =
        responded;

      if (!responded) {
        return;
      }

      if (!persistCurrentInvite()) {
        return;
      }

      if (isStandalone()) {
        setLocalValue(
          INSTALLED_KEY,
          "true"
        );

        return;
      }

      if (
        getLocalValue(
          INSTALLED_KEY
        ) === "true" ||
        isRecentlyDismissed()
      ) {
        return;
      }

      if (
        isIOS() ||
        installEventRef.current ||
        /Android/i.test(
          navigator.userAgent
        )
      ) {
        setVisible(true);
      }
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    window.addEventListener(
      RSVP_STATE_EVENT,
      handleRSVPState
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );

      window.removeEventListener(
        RSVP_STATE_EVENT,
        handleRSVPState
      );
    };
  }, []);

  const dismissPrompt = () => {
    setLocalValue(
      DISMISSED_AT_KEY,
      String(Date.now())
    );

    setInstructions(null);
    setVisible(false);
  };

  const handleInstall = async () => {
    if (isIOS()) {
      setInstructions("ios");
      return;
    }

    const installEvent =
      installEventRef.current;

    if (!installEvent) {
      setInstructions(
        "browser"
      );
      return;
    }

    setInstalling(true);

    try {
      const choice =
        await installEvent.prompt();

      installEventRef.current =
        null;

      setNativeInstallReady(false);

      if (
        choice.outcome ===
        "accepted"
      ) {
        setLocalValue(
          INSTALLED_KEY,
          "true"
        );

        removeLocalValue(
          DISMISSED_AT_KEY
        );

        setVisible(false);
        return;
      }

      setLocalValue(
        DISMISSED_AT_KEY,
        String(Date.now())
      );

      setVisible(false);
    } finally {
      setInstalling(false);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <aside
      className={styles.prompt}
      aria-label="Adicionar o casamento à tela inicial"
      aria-live="polite"
    >
      <button
        type="button"
        className={styles.closeButton}
        onClick={dismissPrompt}
        aria-label="Agora não"
      >
        ×
      </button>

      <div className={styles.iconShell}>
        <Image
          src="/images/monograma-gl-branco-site.png"
          alt=""
          width={72}
          height={72}
          className={styles.monogram}
        />
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          ACESSO RÁPIDO
        </p>

        <h2>
          Leve nosso casamento
          com você.
        </h2>

        <p>
          Adicione o site à tela inicial e volte quando quiser sem procurar novamente o link do convite.
        </p>
      </div>

      {instructions === "ios" ? (
        <div className={styles.instructions}>
          <strong>
            No iPhone
          </strong>

          <ol>
            <li>
              Toque em Compartilhar no navegador.
            </li>
            <li>
              Escolha “Adicionar à Tela de Início”.
            </li>
            <li>
              Se aparecer a opção “Abrir como App”, mantenha-a ativada.
            </li>
            <li>
              Confirme em “Adicionar”.
            </li>
          </ol>

          <small>
            Se “Adicionar à Tela de Início” não aparecer, abra este site no Safari e repita os passos.
          </small>
        </div>
      ) : null}

      {instructions === "browser" ? (
        <div className={styles.instructions}>
          <strong>
            Pelo menu do navegador
          </strong>

          <p>
            Abra o menu do navegador e escolha “Instalar aplicativo” ou “Adicionar à tela inicial”.
          </p>
        </div>
      ) : null}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.installButton}
          onClick={handleInstall}
          disabled={installing}
        >
          {installing
            ? "Abrindo..."
            : nativeInstallReady
              ? "Adicionar à tela inicial"
              : isIOS()
                ? "Como adicionar"
                : "Adicionar à tela inicial"}
        </button>

        <button
          type="button"
          className={styles.laterButton}
          onClick={dismissPrompt}
        >
          Agora não
        </button>
      </div>
    </aside>
  );
}