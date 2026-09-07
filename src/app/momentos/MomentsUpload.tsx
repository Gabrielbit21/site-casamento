"use client";

import Link from "next/link";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createBrowserId,
} from "@/lib/browserId";

import { supabase } from "@/lib/supabase";

import styles from "./MomentsUpload.module.css";

const BUCKET_NAME =
  "wedding-moments";

const MAX_SOURCE_SIZE =
  20 * 1024 * 1024;

const MAX_UPLOAD_SIZE =
  8 * 1024 * 1024;

const MAX_MESSAGE_LENGTH = 280;

type UploadState =
  | "idle"
  | "uploading"
  | "success";

function loadImage(
  file: File
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      const url =
        URL.createObjectURL(
          file
        );

      image.onload = () => {
        URL.revokeObjectURL(
          url
        );

        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          url
        );

        reject(
          new Error(
            "Não foi possível abrir esta imagem."
          )
        );
      };

      image.src = url;
    }
  );
}

async function prepareImage(
  file: File
): Promise<Blob> {
  const image =
    await loadImage(file);

  const maxDimension =
    1800;

  const largestSide =
    Math.max(
      image.naturalWidth,
      image.naturalHeight
    );

  const scale =
    Math.min(
      1,
      maxDimension /
        largestSide
    );

  const width =
    Math.max(
      1,
      Math.round(
        image.naturalWidth *
          scale
      )
    );

  const height =
    Math.max(
      1,
      Math.round(
        image.naturalHeight *
          scale
      )
    );

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = width;
  canvas.height =
    height;

  const context =
    canvas.getContext(
      "2d"
    );

  if (!context) {
    throw new Error(
      "Não foi possível preparar esta imagem."
    );
  }

  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  const blob =
    await new Promise<Blob>(
      (
        resolve,
        reject
      ) => {
        canvas.toBlob(
          (result) => {
            if (!result) {
              reject(
                new Error(
                  "Não foi possível preparar esta imagem."
                )
              );

              return;
            }

            resolve(
              result
            );
          },
          "image/jpeg",
          0.84
        );
      }
    );

  if (
    blob.size >
    MAX_UPLOAD_SIZE
  ) {
    throw new Error(
      "A foto ficou muito grande mesmo após a otimização. Escolha outra imagem."
    );
  }

  return blob;
}

export default function MomentsUpload() {
  const cameraInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const galleryInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    file,
    setFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState<
      string | null
    >(null);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    state,
    setState,
  ] =
    useState<UploadState>(
      "idle"
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    return () => {
      if (
        previewUrl
      ) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (
      state !==
      "success"
    ) {
      return;
    }

    const timeout =
      window.setTimeout(
        () => {
          window.location.href =
            "/#momentos";
        },
        2200
      );

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [state]);

  const chooseFile = (
    selectedFile:
      | File
      | null
  ) => {
    setError(null);

    if (
      !selectedFile
    ) {
      return;
    }

    if (
      !selectedFile.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Escolha um arquivo de imagem."
      );

      return;
    }

    if (
      selectedFile.size >
      MAX_SOURCE_SIZE
    ) {
      setError(
        "A foto original pode ter no máximo 20 MB."
      );

      return;
    }

    if (
      previewUrl
    ) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setFile(
      selectedFile
    );

    setPreviewUrl(
      URL.createObjectURL(
        selectedFile
      )
    );
  };

  const handleInput = (
    event:
      ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target
        .files?.[0] ??
      null;

    chooseFile(
      selectedFile
    );

    event.target.value =
      "";
  };

  const submitMoment =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (!file) {
        setError(
          "Escolha ou tire uma foto antes de publicar."
        );

        return;
      }

      setState(
        "uploading"
      );

      setError(null);

      try {
        const preparedImage =
          await prepareImage(
            file
          );

        const dateFolder =
          new Date()
            .toISOString()
            .slice(
              0,
              10
            );

        const uploadId =
          createBrowserId()
            .toLowerCase();

        const imagePath =
          `uploads/${dateFolder}/${uploadId}.jpg`;

        const validPath =
          /^uploads\/[0-9]{4}-[0-9]{2}-[0-9]{2}\/[0-9a-f-]{36}[.]jpg$/;

        if (
          !validPath.test(
            imagePath
          )
        ) {
          throw new Error(
            "Não foi possível gerar um identificador válido para a foto."
          );
        }

        const {
          error:
            uploadError,
        } =
          await supabase.storage
            .from(
              BUCKET_NAME
            )
            .upload(
              imagePath,
              preparedImage,
              {
                cacheControl:
                  "31536000",

                contentType:
                  "image/jpeg",

                upsert:
                  false,
              }
            );

        if (
          uploadError
        ) {
          throw uploadError;
        }

        const {
          error:
            postError,
        } =
          await supabase.rpc(
            "create_moment_post",
            {
              p_image_path:
                imagePath,

              p_message:
                message.trim() ||
                null,
            }
          );

        if (
          postError
        ) {
          throw postError;
        }

        setState(
          "success"
        );
      } catch (
        uploadFailure
      ) {
        console.error(
          "Erro ao publicar momento:",
          uploadFailure
        );

        if (
          uploadFailure &&
          typeof uploadFailure ===
            "object" &&
          "message" in
            uploadFailure &&
          typeof (
            uploadFailure as {
              message?: unknown;
            }
          ).message ===
            "string"
        ) {
          setError(
            (
              uploadFailure as {
                message: string;
              }
            ).message
          );
        } else {
          setError(
            "Não foi possível publicar esta foto agora. Tente novamente."
          );
        }

        setState(
          "idle"
        );
      }
    };

  if (
    state ===
    "success"
  ) {
    return (
      <main
        className={
          styles.page
        }
      >
        <div
          className={
            styles.successCard
          }
        >
          <div
            className={
              styles.successIcon
            }
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M5 12.5L9.2 16.5L19 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p
            className={
              styles.successMessage
            }
          >
            Sua foto já foi
            enviada e pode ser
            visualizada no Mural
            de Momentos.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <header
        className={
          styles.header
        }
      >
        <Link
          href="/"
          className={
            styles.brand
          }
        >
          Gabriel
          <span>
            &
          </span>
          Luana
        </Link>

        <Link
          href="/#momentos"
          className={
            styles.backLink
          }
        >
          Ver momentos
        </Link>
      </header>

      <section
        className={
          styles.content
        }
      >
        <div
          className={
            styles.intro
          }
        >
          <p
            className={
              styles.eyebrow
            }
          >
            NOSSO CASAMENTO ·
            28.08.2027
          </p>

          <h1>
            Compartilhe o seu
            olhar.
          </h1>

          <p>
            Tire uma foto,
            escreva uma mensagem
            se quiser e deixe
            esse momento fazer
            parte do nosso mural
            coletivo.
          </p>
        </div>

        <form
          onSubmit={
            submitMoment
          }
          className={
            styles.card
          }
        >
          <input
            ref={
              cameraInputRef
            }
            type="file"
            accept="image/*"
            capture="environment"
            onChange={
              handleInput
            }
            className={
              styles.hiddenInput
            }
          />

          <input
            ref={
              galleryInputRef
            }
            type="file"
            accept="image/*"
            onChange={
              handleInput
            }
            className={
              styles.hiddenInput
            }
          />

          {!previewUrl ? (
            <div
              className={
                styles.chooseArea
              }
            >
              <div
                className={
                  styles.cameraIcon
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
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="12"
                    cy="13"
                    r="3.1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </div>

              <h2>
                Registre este
                momento
              </h2>

              <p>
                No celular,
                você pode abrir
                a câmera agora
                ou escolher uma
                foto que já
                esteja na
                galeria.
              </p>

              <div
                className={
                  styles.chooseActions
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    cameraInputRef.current?.click()
                  }
                  className={
                    styles.primaryButton
                  }
                >
                  Tirar uma foto
                </button>

                <button
                  type="button"
                  onClick={() =>
                    galleryInputRef.current?.click()
                  }
                  className={
                    styles.secondaryButton
                  }
                >
                  Escolher da
                  galeria
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className={
                  styles.previewCard
                }
              >
                <img
                  src={
                    previewUrl
                  }
                  alt="Pré-visualização da foto escolhida"
                  className={
                    styles.previewImage
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    galleryInputRef.current?.click()
                  }
                  className={
                    styles.changePhoto
                  }
                >
                  Trocar foto
                </button>
              </div>

              <div
                className={
                  styles.messageComposer
                }
              >
                <textarea
                  aria-label="Escreva uma mensagem"
                  value={
                    message
                  }
                  onChange={(
                    event
                  ) =>
                    setMessage(
                      event
                        .target
                        .value
                    )
                  }
                  maxLength={
                    MAX_MESSAGE_LENGTH
                  }
                  rows={3}
                  placeholder="Escreva uma mensagem..."
                />

                <div
                  className={
                    styles.composerMeta
                  }
                >
                  <small>
                    Opcional ·
                    aparecerá
                    abaixo da
                    foto.
                  </small>

                  <span>
                    {
                      message.length
                    }
                    /
                    {
                      MAX_MESSAGE_LENGTH
                    }
                  </span>
                </div>
              </div>

              {error ? (
                <div
                  className={
                    styles.errorBox
                  }
                  role="alert"
                >
                  {error}
                </div>
              ) : null}

              <div
                className={
                  styles.publishArea
                }
              >
                <p>
                  Ao publicar,
                  a foto pode
                  aparecer no
                  mural de
                  Momentos do
                  casamento.
                </p>

                <button
                  type="submit"
                  disabled={
                    state ===
                    "uploading"
                  }
                  className={
                    styles.publishButton
                  }
                >
                  {state ===
                  "uploading" ? (
                    <>
                      <span
                        className={
                          styles.spinner
                        }
                        aria-hidden="true"
                      />

                      Enviando...
                    </>
                  ) : (
                    "Publicar este momento"
                  )}
                </button>
              </div>
            </>
          )}

          {!previewUrl &&
          error ? (
            <div
              className={
                styles.errorBox
              }
              role="alert"
            >
              {error}
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}