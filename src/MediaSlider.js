import React, { useState, useCallback, useRef } from "react";
import "./styles.css";

const PDF_ICON = "https://cdn-icons-png.flaticon.com/512/337/337946.png";

// Set this to your live API base (no trailing slash)
const MEDIA_BASE =
  process.env.REACT_APP_MEDIA_BASE ||
  "https://precious-census-address-pubs.trycloudflare.com";

const MediaSlider = ({ containerName = "achievements" }) => {
  const [items, setItems] = useState([]); // [{ name, mime, url, ... }]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const isFetchingRef = useRef(false);

  // Build absolute URL from absolute/relative pieces
  const abs = (u) => {
    if (!u) return "";
    try {
      // already absolute?
      new URL(u);
      return u;
    } catch {
      return `${MEDIA_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
    }
  };

  const listEndpoint = `${MEDIA_BASE}/${encodeURIComponent(
    containerName
  )}/list_blobs`;

  const fetchMedia = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(listEndpoint);
      if (!res.ok) throw new Error(`Failed to load ${containerName} media`);

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid media list format. Expected an array from /<container>/list_blobs."
        );
      }

      // Expected item shape from backend:
      // { name, mime, url: "/media/<container>/<blob_path>", size, last_modified, ... }
      setItems(data);
      setHasFetched(true);
    } catch (e) {
      setError(e.message || "Failed to load media. Please try again later.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [containerName, listEndpoint]);

  // Convert a private API URL -> Blob URL -> open/preview
  const openViaBlob = useCallback(async (apiUrl, mime) => {
    const res = await fetch(abs(apiUrl));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const fixed = mime ? new Blob([blob], { type: mime }) : blob;
    const url = URL.createObjectURL(fixed);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }, []);

  const renderCard = (item, index) => {
    // Prefer API-provided streaming URL; fallback to legacy id shape if present
    const apiUrl =
      item.url ||
      (item.id ? `/api/media/${item.id}` : `/media/${containerName}/${item.name}`);

    const mime = String(item.mime || "").toLowerCase();
    const isImg = mime.startsWith("image/");
    const isVideo = mime.startsWith("video/");
    const isPdf =
      mime === "application/pdf" || item.name?.toLowerCase().endsWith(".pdf");

    let preview = null;

    if (isImg) {
      // For images, preview inline by fetching to blob on click (keeps storage private)
      preview = (
        <div
          className="media-img-wrapper"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            openViaBlob(apiUrl, mime);
          }}
        >
          {/* Lightweight thumbnail: if you want true inline thumb without opening,
             either add a separate thumbnail endpoint or stream directly as <img src={abs(apiUrl)} />.
             Keeping private via blob: we open in a new tab for clarity. */}
          <img
            src={PDF_ICON /* placeholder icon look—replace with your own thumbnail if available */}
            alt={item.name || `media-${index}`}
            className="media-img"
            loading="lazy"
          />
        </div>
      );
    } else if (isVideo) {
      // Button to open video via blob (supports Range under the hood on the API)
      preview = (
        <div className="media-video-cta">
          <button
            className="material-button"
            onClick={(e) => {
              e.stopPropagation();
              openViaBlob(apiUrl, mime || "video/mp4");
            }}
          >
            Play Video
          </button>
        </div>
      );
    } else if (isPdf) {
      preview = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 180,
          }}
        >
          <img
            src={PDF_ICON}
            alt="PDF icon"
            style={{ width: 48, height: 48, marginBottom: 8, opacity: 0.85 }}
          />
          <button
            className="media-pdf-btn"
            onClick={(e) => {
              e.stopPropagation();
              openViaBlob(apiUrl, "application/pdf");
            }}
          >
            Preview PDF
          </button>
        </div>
      );
    } else {
      // Generic file: open via blob
      preview = (
        <div
          className="media-generic"
          onClick={(e) => {
            e.stopPropagation();
            openViaBlob(apiUrl, item.mime || "application/octet-stream");
          }}
          role="button"
          tabIndex={0}
        >
          <div className="media-generic__name">{item.name || "File"}</div>
          <div className="media-generic__mime">
            {item.mime || "application/octet-stream"}
          </div>
        </div>
      );
    }

    return (
      <div key={item.name || item.id || index} className="media-item" tabIndex={0}>
        {preview}
        <p className="media-caption">{item.name || "Untitled"}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="material-button-container">
        <button
          onClick={fetchMedia}
          disabled={loading}
          className="material-button"
          style={{ marginBottom: 20 }}
        >
          {loading ? "Loading..." : hasFetched ? "Reload Media" : "Load Media"}
        </button>
      </div>

      <div className="media-grid-container">
        {error && <div className="error-message">{error}</div>}
        {!error && items.length > 0 && (
          <div className="media-grid">{items.map(renderCard)}</div>
        )}
        {!error && hasFetched && items.length === 0 && (
          <div className="note">No media found in “{containerName}”.</div>
        )}
      </div>
    </div>
  );
};

export default MediaSlider;
