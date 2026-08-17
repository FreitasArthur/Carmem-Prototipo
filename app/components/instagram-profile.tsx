"use client";

/* eslint-disable @next/next/no-img-element */
import { Images, Play } from "lucide-react";
import { useEffect, useState } from "react";
import {
  firmName,
  instagramFallbackBio,
  instagramFeedUrl,
  instagramProfileUrl,
  instagramUsername,
} from "../site-data";

type FeedStatus = "configuration" | "loading" | "ready" | "error";

type InstagramPost = {
  id: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  isReel?: boolean;
  altText?: string;
  caption?: string;
  sizes: {
    medium: {
      mediaUrl: string;
    };
  };
};

type InstagramFeed = {
  username: string;
  biography: string;
  profilePictureUrl: string;
  posts: InstagramPost[];
};

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isInstagramPost(value: unknown): value is InstagramPost {
  if (!isRecord(value) || !isRecord(value.sizes) || !isRecord(value.sizes.medium)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.permalink === "string" &&
    value.permalink.startsWith("https://www.instagram.com/") &&
    (value.mediaType === "IMAGE" ||
      value.mediaType === "VIDEO" ||
      value.mediaType === "CAROUSEL_ALBUM") &&
    typeof value.sizes.medium.mediaUrl === "string" &&
    value.sizes.medium.mediaUrl.startsWith("https://")
  );
}

function parseInstagramFeed(value: unknown): InstagramFeed | null {
  if (!isRecord(value) || !Array.isArray(value.posts)) {
    return null;
  }

  const posts = value.posts.filter(isInstagramPost).slice(0, 4);

  if (posts.length === 0) {
    return null;
  }

  return {
    username:
      typeof value.username === "string" && value.username.trim()
        ? value.username.trim()
        : instagramUsername,
    biography: typeof value.biography === "string" ? value.biography.trim() : "",
    profilePictureUrl:
      typeof value.profilePictureUrl === "string" &&
      value.profilePictureUrl.startsWith("https://")
        ? value.profilePictureUrl
        : "",
    posts,
  };
}

function PostTypeIcon({ post }: { post: InstagramPost }) {
  if (post.mediaType === "CAROUSEL_ALBUM") {
    return <Images aria-hidden="true" />;
  }

  if (post.mediaType === "VIDEO" || post.isReel) {
    return <Play aria-hidden="true" />;
  }

  return null;
}

export function InstagramProfile() {
  const [feed, setFeed] = useState<InstagramFeed | null>(null);
  const [status, setStatus] = useState<FeedStatus>(
    instagramFeedUrl ? "loading" : "configuration",
  );

  useEffect(() => {
    if (!instagramFeedUrl) {
      return;
    }

    const controller = new AbortController();

    async function loadFeed() {
      try {
        const response = await fetch(instagramFeedUrl, {
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Instagram feed returned ${response.status}`);
        }

        const parsedFeed = parseInstagramFeed(await response.json());
        if (!parsedFeed) {
          throw new Error("Instagram feed returned invalid data");
        }

        setFeed(parsedFeed);
        setStatus("ready");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setStatus("error");
      }
    }

    void loadFeed();
    return () => controller.abort();
  }, []);

  const username = feed?.username || instagramUsername;
  const biography = feed?.biography || instagramFallbackBio;
  const profilePictureUrl =
    feed?.profilePictureUrl || "/logo-carmem-testoni-icone-redondo-transparente.png";
  const posts = feed?.posts ?? [];
  const placeholderCount = Math.max(0, 4 - posts.length);

  return (
    <section
      className="section instagram-section"
      id="instagram"
      aria-labelledby="instagram-title"
    >
      <div className="section-inner instagram-shell" data-reveal>
        <header className="instagram-profile-header">
          <a
            className="instagram-avatar-link"
            href={instagramProfileUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir o perfil @${username} no Instagram`}
          >
            <img
              className="instagram-avatar"
              src={profilePictureUrl}
              alt={`Foto do perfil @${username}`}
              width="96"
              height="96"
              loading="lazy"
            />
          </a>

          <div className="instagram-profile-copy">
            <p className="eyebrow">Instagram</p>
            <h2 id="instagram-title">{firmName}</h2>
            <a
              className="instagram-handle"
              href={instagramProfileUrl}
              target="_blank"
              rel="noreferrer"
            >
              @{username}
            </a>
            <p className="instagram-biography">{biography}</p>
          </div>

          <a
            className="button instagram-follow-button"
            href={instagramProfileUrl}
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon />
            Seguir
          </a>
        </header>

        {status === "configuration" ? (
          <p className="instagram-feed-message" role="status">
            A conexão automática do Instagram está pronta para receber a autorização da conta.
          </p>
        ) : null}

        {status === "error" ? (
          <p className="instagram-feed-message" role="status">
            As publicações estão temporariamente indisponíveis. Acesse o perfil pelo botão
            acima.
          </p>
        ) : null}

        <div
          className={`instagram-post-grid ${status === "ready" ? "is-ready" : "is-loading"}`}
          aria-busy={status === "loading"}
        >
          {posts.map((post) => (
            <a
              className="instagram-post"
              href={post.permalink}
              key={post.id}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ver publicação de @${username} no Instagram`}
            >
              <img
                src={post.sizes.medium.mediaUrl}
                alt={post.altText || post.caption || `Publicação de @${username} no Instagram`}
                loading="lazy"
              />
              <span className="instagram-post-type">
                <PostTypeIcon post={post} />
              </span>
              <span className="instagram-post-overlay" aria-hidden="true">
                <InstagramIcon />
                Ver publicação
              </span>
            </a>
          ))}

          {Array.from({ length: placeholderCount }, (_, index) => (
            <div className="instagram-post-placeholder" aria-hidden="true" key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
