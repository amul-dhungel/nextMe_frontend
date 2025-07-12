import React, { useState, useCallback, useRef } from 'react';
import './styles.css'; 

const PDF_ICON = "https://cdn-icons-png.flaticon.com/512/337/337946.png"; // CDN for PDF icon

const MediaSlider = ({ containerName }) => {
    const [mediaData, setMediaData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    // To avoid duplicate requests
    const isFetchingRef = useRef(false);

    // Function to fetch media blobs
    const fetchMedia = useCallback(async () => {
        if (isFetchingRef.current) return;
        setLoading(true);
        setError(null);
        isFetchingRef.current = true;
        try {
            const response = await fetch(`https://api.amuldhungel.com.np/${containerName}/list_blobs`);
            if (!response.ok) throw new Error('Failed to load data');
            const data = await response.json();
            if (typeof data === 'object') {
                setMediaData(data);
                setHasFetched(true);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            setError('Failed to load media. Please try again later.');
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [containerName]);

    // Event handler for clicking on media
    const handleMediaClick = useCallback((url, e) => {
        e.stopPropagation();
        window.open(url, '_blank');
    }, []);

    return (
        <div>
            <div className='material-button-container'>
                <button
                    onClick={fetchMedia}
                    disabled={loading}
                    className="material-button"
                    style={{ marginBottom: '20px' }}
                >
                    {loading ? 'Loading...' : hasFetched ? 'Reload Media' : 'Load Media'}
                </button>
            </div>
            <div className="media-grid-container">
                {error && <div className="error-message">{error}</div>}
                {Object.keys(mediaData).length > 0 && !error && (
                    <div className="media-grid">
                        {Object.entries(mediaData).map(([url, metadata], index) => {
                            const desc = metadata?.desc || "No description available";
                            let content = null;
                            if (url.endsWith('.mp4')) {
                                content = (
                                    <video controls className="media-video">
                                        <source src={url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                );
                            } else if (url.endsWith('.pdf')) {
                                content = (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "180px"
                                        }}
                                    >
                                        <img
                                            src={PDF_ICON}
                                            alt="PDF icon"
                                            style={{ width: 48, height: 48, marginBottom: 8, opacity: 0.8 }}
                                        />
                                        <button
                                            className="media-pdf-btn"
                                            onClick={(e) => handleMediaClick(url, e)}
                                        >
                                            Preview PDF
                                        </button>
                                    </div>
                                );
                            } else {
                                content = (
                                    <img src={url} alt={`media-${index}`} className="media-img" loading="lazy" />
                                );
                            }
                            return (
                                <div key={index} className="media-item" tabIndex={0}>
                                    <div onClick={(e) => handleMediaClick(url, e)}>{content}</div>
                                    <p className="media-caption">{desc}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaSlider;
