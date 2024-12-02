import { useState } from 'react';
import PropTypes from 'prop-types';
import './UserReview.css';

const StarRating = ({ initialRating, onRatingChange }) => {
    const [rating, setRating] = useState(initialRating);

    const handleClick = (newRating) => {
        setRating(newRating);
        onRatingChange(newRating);
    };

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${rating >= star ? 'filled' : ''}`}
                    onClick={() => handleClick(star)}
                    style={{ cursor: 'pointer', fontSize: '30px' }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

StarRating.propTypes = {
    initialRating: PropTypes.number.isRequired,
    onRatingChange: PropTypes.func.isRequired,
};

const ReviewForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        rating: 0,
        comment: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || formData.rating < 1 || !formData.comment) {
            setError('Please fill in all fields.');
            return;
        }
        onSubmit(formData);
        setFormData({ name: '', rating: 0, comment: '' });
        setError('');
    };

    return (
        <div className="review-form">
            <div>
                <label>Your Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Your Rating:</label>
                <StarRating
                    initialRating={formData.rating}
                    onRatingChange={(rating) =>
                        setFormData((prevState) => ({
                            ...prevState,
                            rating,
                        }))
                    }
                />
            </div>

            <div>
                <label>Your Comment:</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={handleSubmit}>Submit Review</button>
        </div>
    );
};

ReviewForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default ReviewForm;
