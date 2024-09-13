import React, { useState } from 'react';
import './styles.css'; // Import your CSS file here

const MediaSlider = ({ containerName }) => {
    const [mediaData, setMediaData] = useState({}); // Store media URLs and metadata
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false); // Track if the data has been fetched
    const [error, setError] = useState(null); // Store any fetch errors

    // Fetch media when the button is clicked
    const fetchMedia = async () => {
        setLoading(true); // Start loading
        setError(null); // Clear previous errors
        try {
            const response = await fetch(`http://127.0.0.1:5000/${containerName}/list_blobs`);
            const data = await response.json();
            if (typeof data === 'object') {
                setMediaData(data); // Set the media data (URL and metadata) to state
                setHasFetched(true);  // Indicate that data has been fetched
            } else {
                throw new Error('Invalid data format');
            }
            setLoading(false);  // Stop loading
        } catch (error) {
            console.error('Error fetching media:', error);
            setError('Failed to load media. Please try again later.');
            setLoading(false);  // Stop loading on error
        }
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
            {/* Show error if there's an issue fetching media */}
            {error && <div className="error-message">{error}</div>}

            {/* Render the media grid only if media data is available */}
            {Object.keys(mediaData).length > 0 && !error && (
                <div className="media-grid">
                    {Object.entries(mediaData).map(([url, metadata], index) => {
                        const desc = metadata.desc || "No description available"; // Fallback to default caption
                        
                        return (
                            <div key={index} className="media-item">
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
