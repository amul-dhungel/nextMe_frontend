import React, { useState } from 'react';
import './styles.css'; 

const MediaSlider = ({ containerName }) => {
    const [mediaData, setMediaData] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch media blobs
    const fetchMedia = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://nextme-backend.onrender.com/${containerName}/list_blobs`);
            const data = await response.json();
            if (typeof data === 'object') {
                setMediaData(data);
                setHasFetched(true);
            } else {
                throw new Error('Invalid data format');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching media:', error);
            setError('Failed to load media. Please try again later.');
            setLoading(false);
        }
    };

    // Function to open blob URL in a new tab
    const handleMediaClick = (url) => {
        window.open(url, '_blank'); // Opens the URL in a new tab
    };

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
                        const desc = metadata.desc || "No description available"; // Fallback to default caption
                        
                        return (
                            <div key={index} className="media-item" onClick={() => handleMediaClick(url)}>
                                {url.endsWith('.mp4') ? (
                                    <video controls className="media-video">
                                        <source src={url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img src={url} alt={`media-${index}`} className="media-img" />
                                )}
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
