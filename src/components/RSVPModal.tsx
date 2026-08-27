"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import styles from "./RSVPModal.module.css";

const RSVP_OPEN_EVENT =
  "wedding:rsvp:open";

const RSVP_STATE_EVENT =
  "wedding:rsvp:state";

const STORAGE_KEY =
  "wedding_invite_token";

type RSVPStatus =
  | "pending"
  | "confirmed"
  | "declined";

type Guest = {
  id: string;
  name: string;
  is_placeholder: boolean;
  rsvp_status: RSVPStatus;
  dietary_restrictions:
    | string
    | null;
};

type InviteData = {
  found: boolean;
  display_name?: string;
  rsvp_deadline?: string;
  can_edit?: boolean;
  message?: string;
  guests?: Guest[];
};

type GuestResponse = {
  status: RSVPStatus;
  dietaryRestrictions: string;
};

type ResponsesState = Record<
  string,
  GuestResponse
>;

type LoadStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error";

function hasEveryGuestResponded(
  guests: Guest[]
) {
  if (guests.length === 0) {
    return false;
  }

  return guests.every(
    (guest) =>
      guest.rsvp_status ===
        "confirmed" ||
      guest.rsvp_status ===
        "declined"
  );
}

function getTokenFromPath() {
  const match =
    window.location.pathname.match(
      /^\/convite\/([^/]+)/
    );

  if (!match?.[1]) {
    return null;
  }

  try {
    return decodeURIComponent(
      match[1]
    );
  } catch {
    return match[1];
  }
}

function resolveInviteToken() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const queryToken =
    params.get("convite");

  if (queryToken) {
    sessionStorage.setItem(
      STORAGE_KEY,
      queryToken
    );

    return queryToken;
  }

  const pathToken =
    getTokenFromPath();

  if (pathToken) {
    sessionStorage.setItem(
      STORAGE_KEY,
      pathToken
    );

    return pathToken;
  }

  return (
    sessionStorage.getItem(
      STORAGE_KEY
    ) || null
  );
}

function formatDeadline(
  value?: string
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  const formatted =
    new Intl.DateTimeFormat(
      "pt-BR",
      {
        timeZone:
          "America/Sao_Paulo",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);

  return formatted.replace(
    ",",
    " às"
  );
}

export default function RSVPModal() {
  const [open, setOpen] =
    useState(false);

  const [token, setToken] =
    useState<string | null>(
      null
    );

  const [invite, setInvite] =
    useState<InviteData | null>(
      null
    );

  const [responses, setResponses] =
    useState<ResponsesState>({});

  const [loadStatus, setLoadStatus] =
    useState<LoadStatus>("idle");

  const [submitting, setSubmitting] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const guests =
    invite?.guests ?? [];

  const responded =
    useMemo(
      () =>
        hasEveryGuestResponded(
          guests
        ),
      [guests]
    );

  const dispatchRSVPState =
    useCallback(
      (value: boolean) => {
        window.dispatchEvent(
          new CustomEvent(
            RSVP_STATE_EVENT,
            {
              detail: {
                responded: value,
              },
            }
          )
        );
      },
      []
    );

  const fillResponses =
    useCallback(
      (
        guestList: Guest[]
      ) => {
        const nextResponses:
          ResponsesState = {};

        guestList.forEach(
          (guest) => {
            nextResponses[
              guest.id
            ] = {
              status:
                guest.rsvp_status,

              dietaryRestrictions:
                guest
                  .dietary_restrictions ??
                "",
            };
          }
        );

        setResponses(
          nextResponses
        );
      },
      []
    );

  const loadInvite =
    useCallback(
      async (
        inviteToken: string
      ) => {
        setLoadStatus(
          "loading"
        );

        setErrorMessage("");

        const {
          data,
          error,
        } =
          await supabase.rpc(
            "get_invite_by_token",
            {
              p_token:
                inviteToken,
            }
          );

        if (error) {
          console.error(
            "Erro ao carregar convite:",
            error
          );

          setInvite(null);

          setErrorMessage(
            "Não foi possível carregar os dados do convite. Tente novamente."
          );

          setLoadStatus(
            "error"
          );

          dispatchRSVPState(
            false
          );

          return;
        }

        const result =
          data as InviteData;

        if (
          !result ||
          !result.found
        ) {
          setInvite(
            result ?? {
              found: false,
            }
          );

          setLoadStatus(
            "ready"
          );

          dispatchRSVPState(
            false
          );

          return;
        }

        const loadedGuests =
          result.guests ??
          [];

        setInvite(result);

        fillResponses(
          loadedGuests
        );

        setLoadStatus(
          "ready"
        );

        dispatchRSVPState(
          hasEveryGuestResponded(
            loadedGuests
          )
        );
      },
      [
        dispatchRSVPState,
        fillResponses,
      ]
    );

  const openRSVP =
    useCallback(() => {
      setOpen(true);

      setErrorMessage("");

      setSuccessMessage("");

      const currentToken =
        resolveInviteToken();

      if (!currentToken) {
        setToken(null);
        return;
      }

      setToken(
        currentToken
      );

      if (
        currentToken !==
          token ||
        !invite
      ) {
        void loadInvite(
          currentToken
        );
      }
    }, [
      invite,
      loadInvite,
      token,
    ]);

  useEffect(() => {
    const inviteToken =
      resolveInviteToken();

    setToken(
      inviteToken
    );

    if (inviteToken) {
      void loadInvite(
        inviteToken
      );
    }
  }, [loadInvite]);

  useEffect(() => {
    const handleDocumentClick = (
      event: MouseEvent
    ) => {
      const target =
        event.target;

      if (
        !(
          target instanceof
          Element
        )
      ) {
        return;
      }

      const button =
        target.closest(
          "#confirmar-presenca"
        );

      if (!button) {
        return;
      }

      event.preventDefault();

      openRSVP();
    };

    const handleOpenEvent =
      () => {
        openRSVP();
      };

    document.addEventListener(
      "click",
      handleDocumentClick
    );

    window.addEventListener(
      RSVP_OPEN_EVENT,
      handleOpenEvent
    );

    return () => {
      document.removeEventListener(
        "click",
        handleDocumentClick
      );

      window.removeEventListener(
        RSVP_OPEN_EVENT,
        handleOpenEvent
      );
    };
  }, [openRSVP]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  const updateStatus = (
    guestId: string,
    status:
      | "confirmed"
      | "declined"
  ) => {
    if (
      !invite?.can_edit
    ) {
      return;
    }

    setSuccessMessage("");

    setErrorMessage("");

    setResponses(
      (current) => ({
        ...current,

        [guestId]: {
          status,

          dietaryRestrictions:
            status ===
            "confirmed"
              ? current[
                  guestId
                ]
                  ?.dietaryRestrictions ??
                ""
              : "",
        },
      })
    );
  };

  const updateDietaryRestrictions =
    (
      guestId: string,
      value: string
    ) => {
      if (
        !invite?.can_edit
      ) {
        return;
      }

      setSuccessMessage("");

      setResponses(
        (current) => ({
          ...current,

          [guestId]: {
            status:
              current[
                guestId
              ]?.status ??
              "pending",

            dietaryRestrictions:
              value,
          },
        })
      );
    };

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !token ||
        !invite?.found ||
        !invite.can_edit
      ) {
        return;
      }

      setErrorMessage("");

      setSuccessMessage("");

      const unanswered =
        guests.filter(
          (guest) => {
            const status =
              responses[
                guest.id
              ]?.status;

            return (
              status !==
                "confirmed" &&
              status !==
                "declined"
            );
          }
        );

      if (
        unanswered.length >
        0
      ) {
        if (
          unanswered.length ===
          1
        ) {
          setErrorMessage(
            `Falta informar a presença de ${unanswered[0].name}.`
          );
        } else {
          setErrorMessage(
            `Ainda faltam ${unanswered.length} pessoas para responder.`
          );
        }

        return;
      }

      setSubmitting(true);

      const payload =
        guests.map(
          (guest) => {
            const response =
              responses[
                guest.id
              ];

            return {
              guest_id:
                guest.id,

              status:
                response.status,

              dietary_restrictions:
                response.status ===
                "confirmed"
                  ? response
                      .dietaryRestrictions
                  : "",
            };
          }
        );

      const {
        error,
      } =
        await supabase.rpc(
          "submit_rsvp",
          {
            p_token:
              token,

            p_responses:
              payload,
          }
        );

      if (error) {
        console.error(
          "Erro ao salvar RSVP:",
          error
        );

        setSubmitting(false);

        setErrorMessage(
          error.message ||
            "Não foi possível salvar a confirmação."
        );

        return;
      }

      const {
        data:
          refreshedData,

        error:
          refreshedError,
      } =
        await supabase.rpc(
          "get_invite_by_token",
          {
            p_token:
              token,
          }
        );

      if (
        !refreshedError &&
        refreshedData
      ) {
        const refreshedInvite =
          refreshedData as InviteData;

        const refreshedGuests =
          refreshedInvite.guests ??
          [];

        setInvite(
          refreshedInvite
        );

        fillResponses(
          refreshedGuests
        );

        dispatchRSVPState(
          hasEveryGuestResponded(
            refreshedGuests
          )
        );
      } else {
        dispatchRSVPState(
          true
        );
      }

      setSubmitting(false);

      setSuccessMessage(
        "As respostas foram salvas com sucesso."
      );
    };

  if (!open) {
    return null;
  }

  const deadlineText =
    formatDeadline(
      invite?.rsvp_deadline
    );

  return (
    <div
      className={
        styles.overlay
      }
      role="presentation"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          setOpen(false);
        }
      }}
    >
      <section
        id="rsvp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
        className={
          styles.modal
        }
      >
        <button
          type="button"
          className={
            styles.closeButton
          }
          aria-label="Fechar confirmação de presença"
          onClick={() =>
            setOpen(false)
          }
        >
          <span />
          <span />
        </button>

        <div
          className={
            styles.header
          }
        >
          <p
            className={
              styles.eyebrow
            }
          >
            RSVP
          </p>

          <h2
            id="rsvp-title"
          >
            Confirmação
            <br />
            de presença
          </h2>

          <div
            className={
              styles.headerDivider
            }
          >
            <span />
            <i />
            <span />
          </div>
        </div>

        {!token && (
          <div
            className={
              styles.messageState
            }
          >
            <p
              className={
                styles.stateLabel
              }
            >
              CONVITE INDIVIDUAL
            </p>

            <h3>
              Acesse pelo seu
              link de convite
            </h3>

            <p>
              A confirmação de
              presença é vinculada
              ao convite de cada
              família. Utilize o
              link individual que
              foi enviado a você.
            </p>

            <button
              type="button"
              className={
                styles.secondaryButton
              }
              onClick={() =>
                setOpen(false)
              }
            >
              Entendi
            </button>
          </div>
        )}

        {token &&
          loadStatus ===
            "loading" && (
            <div
              className={
                styles.loadingState
              }
            >
              <span
                className={
                  styles.spinner
                }
              />

              <p>
                Carregando seu
                convite...
              </p>
            </div>
          )}

        {token &&
          loadStatus ===
            "error" && (
            <div
              className={
                styles.messageState
              }
            >
              <p
                className={
                  styles.stateLabel
                }
              >
                NÃO FOI POSSÍVEL
                CARREGAR
              </p>

              <h3>
                Tivemos um
                problema
              </h3>

              <p>
                {errorMessage}
              </p>

              <button
                type="button"
                className={
                  styles.secondaryButton
                }
                onClick={() => {
                  if (token) {
                    void loadInvite(
                      token
                    );
                  }
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}

        {token &&
          loadStatus ===
            "ready" &&
          invite &&
          !invite.found && (
            <div
              className={
                styles.messageState
              }
            >
              <p
                className={
                  styles.stateLabel
                }
              >
                CONVITE NÃO
                ENCONTRADO
              </p>

              <h3>
                Este link não é
                válido
              </h3>

              <p>
                Verifique se o
                endereço recebido
                está completo e
                tente acessá-lo
                novamente.
              </p>
            </div>
          )}

        {token &&
          loadStatus ===
            "ready" &&
          invite?.found && (
            <>
              <div
                className={
                  styles.familyIntro
                }
              >
                <p>
                  CONVITE DE
                </p>

                <h3>
                  {
                    invite.display_name
                  }
                </h3>

                <p
                  className={
                    styles.familyText
                  }
                >
                  Confirme
                  individualmente
                  a presença de
                  cada pessoa
                  incluída neste
                  convite.
                </p>
              </div>

              {!invite.can_edit && (
                <div
                  className={
                    styles.closedNotice
                  }
                >
                  <strong>
                    Prazo encerrado
                  </strong>

                  <span>
                    As respostas
                    abaixo não
                    podem mais ser
                    alteradas.
                  </span>
                </div>
              )}

              {successMessage && (
                <div
                  className={
                    styles.successMessage
                  }
                  role="status"
                >
                  <span
                    className={
                      styles.successIcon
                    }
                  >
                    ✓
                  </span>

                  <div>
                    <strong>
                      Confirmação
                      registrada
                    </strong>

                    <p>
                      {
                        successMessage
                      }
                    </p>
                  </div>
                </div>
              )}

              <form
                className={
                  styles.form
                }
                onSubmit={
                  handleSubmit
                }
              >
                <div
                  className={
                    styles.guestList
                  }
                >
                  {guests.map(
                    (
                      guest,
                      index
                    ) => {
                      const response =
                        responses[
                          guest.id
                        ] ?? {
                          status:
                            "pending" as RSVPStatus,

                          dietaryRestrictions:
                            "",
                        };

                      const confirmed =
                        response.status ===
                        "confirmed";

                      const declined =
                        response.status ===
                        "declined";

                      return (
                        <article
                          key={
                            guest.id
                          }
                          className={
                            styles.guestCard
                          }
                        >
                          <div
                            className={
                              styles.guestHeader
                            }
                          >
                            <span
                              className={
                                styles.guestNumber
                              }
                            >
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <div>
                              <p>
                                CONVIDADO
                              </p>

                              <h4>
                                {
                                  guest.name
                                }
                              </h4>
                            </div>
                          </div>

                          <div
                            className={
                              styles.choiceGrid
                            }
                          >
                            <button
                              type="button"
                              disabled={
                                !invite.can_edit
                              }
                              aria-pressed={
                                confirmed
                              }
                              className={`${styles.choiceButton} ${
                                confirmed
                                  ? styles.choiceSelected
                                  : ""
                              }`}
                              onClick={() =>
                                updateStatus(
                                  guest.id,
                                  "confirmed"
                                )
                              }
                            >
                              <span
                                className={
                                  styles.choiceCircle
                                }
                              >
                                {confirmed
                                  ? "✓"
                                  : ""}
                              </span>

                              <span>
                                <strong>
                                  Sim
                                </strong>

                                <small>
                                  Estarei
                                  presente
                                </small>
                              </span>
                            </button>

                            <button
                              type="button"
                              disabled={
                                !invite.can_edit
                              }
                              aria-pressed={
                                declined
                              }
                              className={`${styles.choiceButton} ${
                                declined
                                  ? styles.choiceSelected
                                  : ""
                              }`}
                              onClick={() =>
                                updateStatus(
                                  guest.id,
                                  "declined"
                                )
                              }
                            >
                              <span
                                className={
                                  styles.choiceCircle
                                }
                              >
                                {declined
                                  ? "✓"
                                  : ""}
                              </span>

                              <span>
                                <strong>
                                  Não
                                </strong>

                                <small>
                                  Não poderei
                                  comparecer
                                </small>
                              </span>
                            </button>
                          </div>

                          {confirmed && (
                            <div
                              className={
                                styles.dietaryField
                              }
                            >
                              <label
                                htmlFor={`dietary-${guest.id}`}
                              >
                                Restrição
                                alimentar

                                <span>
                                  opcional
                                </span>
                              </label>

                              <input
                                id={`dietary-${guest.id}`}
                                type="text"
                                maxLength={
                                  180
                                }
                                disabled={
                                  !invite.can_edit
                                }
                                value={
                                  response.dietaryRestrictions
                                }
                                placeholder="Ex.: intolerância à lactose, glúten..."
                                onChange={(
                                  event
                                ) =>
                                  updateDietaryRestrictions(
                                    guest.id,
                                    event
                                      .target
                                      .value
                                  )
                                }
                              />
                            </div>
                          )}
                        </article>
                      );
                    }
                  )}
                </div>

                {errorMessage && (
                  <p
                    className={
                      styles.formError
                    }
                    role="alert"
                  >
                    {
                      errorMessage
                    }
                  </p>
                )}

                <div
                  className={
                    styles.formFooter
                  }
                >
                  {deadlineText && (
                    <p
                      className={
                        styles.deadline
                      }
                    >
                      <span>
                        PRAZO PARA
                        CONFIRMAÇÃO
                      </span>

                      <strong>
                        {
                          deadlineText
                        }
                      </strong>
                    </p>
                  )}

                  {invite.can_edit ? (
                    <button
                      type="submit"
                      disabled={
                        submitting
                      }
                      className={
                        styles.submitButton
                      }
                    >
                      {submitting
                        ? "Salvando..."
                        : responded
                        ? "Salvar alterações"
                        : "Enviar confirmação"}

                      {!submitting && (
                        <span>
                          ↗
                        </span>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={
                        styles.secondaryButton
                      }
                      onClick={() =>
                        setOpen(
                          false
                        )
                      }
                    >
                      Fechar
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
      </section>
    </div>
  );
}