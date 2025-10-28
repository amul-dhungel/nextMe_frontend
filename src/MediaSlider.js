import React, { useState, useCallback, useRef } from "react";
import "./styles.css";

const PDF_ICON =
  "https://cdn-icons-png.flaticon.com/512/337/337946.png";

// You can override this with REACT_APP_MEDIA_BASE in a .env file
const MEDIA_BASE =
  process.env.REACT_APP_MEDIA_BASE ||
  "https://fabrics-reasonably-essentials-saves.trycloudflare.com";

const MediaSlider = ({ containerName = "achievements" }) => {
  const [items, setItems] = useState([]); // [{id, name, mime, created_at, category}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const isFetchingRef = useRef(false);

  const fetchMedia = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const listUrl = `${MEDIA_BASE}/api/media/${encodeURIComponent(
        containerName
      )}/list`;
      const res = await fetch(listUrl);
      if (!res.ok) throw new Error(`Failed to load ${containerName} media`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid media list format");
      }

      setItems(data);
      setHasFetched(true);
    } catch (e) {
      setError(e.message || "Failed to load media. Please try again later.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [containerName]);

  const handleOpen = useCallback((url, e) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const renderCard = (item, index) => {
    const fileUrl = `${MEDIA_BASE}/api/media/${item.id}`;
    const mime = String(item.mime || "").toLowerCase();
    const isImg = mime.startsWith("image/");
    const isVideo = mime.startsWith("video/");
    const isPdf = mime === "application/pdf" || item.name?.toLowerCase().endsWith(".pdf");

    let preview = null;

    if (isImg) {
      preview = (
        <img
          src={fileUrl}
          alt={item.name || `media-${index}`}
          className="media-img"
          loading="lazy"
        />
      );
    } else if (isVideo) {
      preview = (
        <video className="media-video" controls preload="metadata">
          <source src={fileUrl} type={mime || "video/mp4"} />
          Your browser does not support the video tag.
        </video>
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
          <button className="media-pdf-btn" onClick={(e) => handleOpen(fileUrl, e)}>
            Preview PDF
          </button>
        </div>
      );
    } else {
      // generic file card
      preview = (
        <div
          className="media-generic"
          onClick={(e) => handleOpen(fileUrl, e)}
          role="button"
          tabIndex={0}
        >
          <div className="media-generic__name">{item.name || "File"}</div>
          <div className="media-generic__mime">{item.mime || "application/octet-stream"}</div>
        </div>
      );
    }

    return (
      <div key={item.id || index} className="media-item" tabIndex={0}>
        <div onClick={(e) => handleOpen(fileUrl, e)}>{preview}</div>
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
