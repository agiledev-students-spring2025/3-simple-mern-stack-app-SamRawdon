import { useEffect, useState } from 'react';
import './AboutUs.css';
import axios from 'axios'

/**
 * A React component that represents the About Us page of the app.
 * @returns The contents of this component, in JSX form.
 */
const AboutUs = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContent = () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/aboutus`)
            .then(response => {
                setContent(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching content:', error);
                setError(error.message || 'Failed to fetch content');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchContent();
    }, []);

    return (
        <div className="aboutus">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <h2>{content.title}</h2>
                    <p className="description"> {content.description}</p>
                    <img src={content.imageUrl} alt="About Us" className="aboutus-image" />
                </>
            )}
        </div>
    );
};

export default AboutUs;