"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getMomentClientKey,
} from "@/lib/browserId";

import { supabase } from "@/lib/supabase";

import styles from "./MomentsFeed.module.css";

const BUCKET_NAME =
  "wedding-moments";

type MomentPost = {
  id: string;
  image_path: string;
  message: string | null;
  created_at: string;
  likes_count: number;
};

type LikeResult = {
  liked?: boolean;
  likes_count?: number;
};

function formatMomentDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      timeZone:
        "America/Sao_Paulo",
    }
  ).format(
    new Date(value)
  );
}

export default function MomentsFeed() {
  const [
    posts,
    setPosts,
  ] =
    useState<
      MomentPost[]
    >([]);

  const [
    likedPostIds,
    setLikedPostIds,
  ] =
    useState<
      Set<string>
    >(
      new Set()
    );

  const [
    likingPostIds,
    setLikingPostIds,
  ] =
    useState<
      Set<string>
    >(
      new Set()
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const loadPosts =
    useCallback(
      async () => {
        const {
          data,
          error:
            postsError,
        } =
          await supabase
            .from(
              "moment_posts"
            )
            .select(
              "id, image_path, message, created_at, likes_count"
            )
            .eq(
              "is_visible",
              true
            )
            .order(
              "created_at",
              {
                ascending:
                  false,
              }
            )
            .limit(30);

        if (
          postsError
        ) {
          setError(
            "Não foi possível carregar os momentos agora."
          );

          setLoading(
            false
          );

          return;
        }

        const loadedPosts =
          (
            data ?? []
          ) as MomentPost[];

        setPosts(
          loadedPosts
        );

        try {
          const clientKey =
            getMomentClientKey();

          const {
            data:
              likedData,
          } =
            await supabase.rpc(
              "get_moment_liked_posts",
              {
                p_client_key:
                  clientKey,
              }
            );

          const ids =
            Array.isArray(
              likedData
            )
              ? likedData.filter(
                  (
                    value
                  ): value is string =>
                    typeof value ===
                    "string"
                )
              : [];

          setLikedPostIds(
            new Set(ids)
          );
        } catch {
          setLikedPostIds(
            new Set()
          );
        }

        setError(null);

        setLoading(
          false
        );
      },
      []
    );

  useEffect(() => {
    loadPosts();

    const channel =
      supabase
        .channel(
          "wedding-moments-feed"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "moment_posts",
          },
          () => {
            loadPosts();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [loadPosts]);

  const cards =
    useMemo(
      () =>
        posts.map(
          (post) => {
            const {
              data,
            } =
              supabase.storage
                .from(
                  BUCKET_NAME
                )
                .getPublicUrl(
                  post.image_path
                );

            return {
              ...post,

              publicUrl:
                data.publicUrl,
            };
          }
        ),
      [posts]
    );

  const toggleLike =
    async (
      postId: string
    ) => {
      if (
        likingPostIds.has(
          postId
        )
      ) {
        return;
      }

      setLikingPostIds(
        (current) => {
          const next =
            new Set(
              current
            );

          next.add(
            postId
          );

          return next;
        }
      );

      try {
        const clientKey =
          getMomentClientKey();

        const {
          data,
          error:
            likeError,
        } =
          await supabase.rpc(
            "toggle_moment_like",
            {
              p_post_id:
                postId,

              p_client_key:
                clientKey,
            }
          );

        if (
          likeError
        ) {
          throw likeError;
        }

        const result =
          data as
            | LikeResult
            | null;

        const liked =
          Boolean(
            result?.liked
          );

        const likesCount =
          typeof result?.likes_count ===
          "number"
            ? result.likes_count
            : 0;

        setLikedPostIds(
          (current) => {
            const next =
              new Set(
                current
              );

            if (liked) {
              next.add(
                postId
              );
            } else {
              next.delete(
                postId
              );
            }

            return next;
          }
        );

        setPosts(
          (current) =>
            current.map(
              (post) =>
                post.id ===
                postId
                  ? {
                      ...post,

                      likes_count:
                        likesCount,
                    }
                  : post
            )
        );
      } catch (
        likeFailure
      ) {
        console.error(
          "Erro ao curtir momento:",
          likeFailure
        );
      } finally {
        setLikingPostIds(
          (current) => {
            const next =
              new Set(
                current
              );

            next.delete(
              postId
            );

            return next;
          }
        );
      }
    };

  const downloadMoment =
    async (
      publicUrl: string,
      postId: string
    ) => {
      try {
        const response =
          await fetch(
            publicUrl
          );

        if (
          !response.ok
        ) {
          throw new Error(
            "Download indisponível."
          );
        }

        const blob =
          await response.blob();

        const objectUrl =
          URL.createObjectURL(
            blob
          );

        const anchor =
          document.createElement(
            "a"
          );

        anchor.href =
          objectUrl;

        anchor.download =
          `momento-gabriel-luana-${postId.slice(
            0,
            8
          )}.jpg`;

        document.body.appendChild(
          anchor
        );

        anchor.click();

        anchor.remove();

        URL.revokeObjectURL(
          objectUrl
        );
      } catch {
        window.open(
          publicUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }
    };

  const shareMoment =
    async (
      publicUrl: string,
      post: MomentPost
    ) => {
      const shareText =
        post.message?.trim() ||
        "Um momento do casamento de Gabriel & Luana.";

      try {
        const response =
          await fetch(
            publicUrl
          );

        const blob =
          response.ok
            ? await response.blob()
            : null;

        if (
          blob &&
          typeof navigator.share ===
            "function"
        ) {
          const file =
            new File(
              [blob],
              "momento-gabriel-luana.jpg",
              {
                type:
                  blob.type ||
                  "image/jpeg",
              }
            );

          const canShareFile =
            typeof navigator.canShare ===
              "function"
              ? navigator.canShare(
                  {
                    files: [
                      file,
                    ],
                  }
                )
              : false;

          if (
            canShareFile
          ) {
            await navigator.share(
              {
                title:
                  "Gabriel & Luana",
                text:
                  shareText,
                files: [
                  file,
                ],
              }
            );

            return;
          }
        }

        if (
          typeof navigator.share ===
          "function"
        ) {
          await navigator.share(
            {
              title:
                "Gabriel & Luana",
              text:
                shareText,
              url:
                publicUrl,
            }
          );

          return;
        }

        window.open(
          publicUrl,
          "_blank",
          "noopener,noreferrer"
        );
      } catch (
        shareFailure
      ) {
        if (
          shareFailure instanceof
            DOMException &&
          shareFailure.name ===
            "AbortError"
        ) {
          return;
        }

        console.error(
          "Erro ao compartilhar:",
          shareFailure
        );

        window.open(
          publicUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }
    };

  return (
    <section
      className={
        styles.section
      }
    >
      <div
        className={
          styles.heading
        }
      >
        <p className="section-label">
          MOMENTOS
        </p>

        <h2>
          O casamento pelo olhar
          <br />
          de quem viveu com a
          gente.
        </h2>

        <p
          className={
            styles.intro
          }
        >
          Durante a celebração,
          cada registro enviado
          pelos nossos convidados
          aparece aqui como uma
          lembrança compartilhada.
        </p>

        <Link
          href="/momentos"
          className={
            styles.uploadLink
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
              strokeWidth="1.4"
              strokeLinejoin="round"
            />

            <circle
              cx="12"
              cy="13"
              r="3.1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>

          Compartilhar um
          momento
        </Link>
      </div>

      {loading ? (
        <div
          className={
            styles.grid
          }
          aria-hidden="true"
        >
          <div
            className={
              styles.skeleton
            }
          />

          <div
            className={
              styles.skeleton
            }
          />
        </div>
      ) : error ? (
        <div
          className={
            styles.state
          }
        >
          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              loadPosts
            }
          >
            Tentar novamente
          </button>
        </div>
      ) : cards.length ===
        0 ? (
        <div
          className={
            styles.empty
          }
        >
          <div
            className={
              styles.emptyIcon
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

          <h3>
            Os primeiros
            momentos ainda vão
            chegar.
          </h3>

          <p>
            No dia do casamento,
            as fotos
            compartilhadas pelos
            convidados vão
            aparecer aqui em
            tempo real.
          </p>
        </div>
      ) : (
        <div
          className={
            styles.grid
          }
        >
          {cards.map(
            (post) => {
              const liked =
                likedPostIds.has(
                  post.id
                );

              const liking =
                likingPostIds.has(
                  post.id
                );

              return (
                <article
                  key={
                    post.id
                  }
                  className={
                    styles.card
                  }
                >
                  <div
                    className={
                      styles.photoFrame
                    }
                  >
                    <img
                      src={
                        post.publicUrl
                      }
                      alt="Momento compartilhado por um convidado"
                      loading="lazy"
                      className={
                        styles.photo
                      }
                    />
                  </div>

                  <div
                    className={
                      styles.actions
                    }
                  >
                    <button
                      type="button"
                      disabled={
                        liking
                      }
                      onClick={() =>
                        toggleLike(
                          post.id
                        )
                      }
                      className={`${styles.actionButton} ${
                        liked
                          ? styles.liked
                          : ""
                      }`}
                      aria-label={
                        liked
                          ? "Remover curtida"
                          : "Curtir este momento"
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 20.2C10.8 19.1 5 14.8 5 9.4C5 6.8 6.8 5.1 9.1 5.1C10.5 5.1 11.5 5.8 12 6.7C12.5 5.8 13.5 5.1 14.9 5.1C17.2 5.1 19 6.8 19 9.4C19 14.8 13.2 19.1 12 20.2Z"
                          fill={
                            liked
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="1.45"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <span>
                        {
                          post.likes_count
                        }
                      </span>
                    </button>

                    <div
                      className={
                        styles.actionRight
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          shareMoment(
                            post.publicUrl,
                            post
                          )
                        }
                        className={
                          styles.iconButton
                        }
                        aria-label="Compartilhar foto"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 15.5V4.5M8.5 8L12 4.5L15.5 8M6 11.5V18.5H18V11.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.45"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          downloadMoment(
                            post.publicUrl,
                            post.id
                          )
                        }
                        className={
                          styles.iconButton
                        }
                        aria-label="Baixar foto"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 4.5V15M8.5 11.5L12 15L15.5 11.5M6 18.5H18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.45"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div
                    className={
                      styles.caption
                    }
                  >
                    {post.message ? (
                      <p>
                        {
                          post.message
                        }
                      </p>
                    ) : null}

                    <time
                      dateTime={
                        post.created_at
                      }
                    >
                      {formatMomentDate(
                        post.created_at
                      )}
                    </time>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}