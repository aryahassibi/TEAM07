import './ReviewAdminPage.css'; // Import the CSS for styling

const ReviewAdminPage = () => {
    return (
        <div className="review-admin-container">
            <h1 className="review-admin-title">Review Management</h1>
            <p className="review-admin-description">
                Approve or reject user reviews for better product experiences.
            </p>
            <div className="review-list">
                <div className="review-item">
                    <h3 className="review-title">Review by John Doe</h3>
                    <p className="review-content">
                        This product is amazing! Highly recommend it to everyone.
                    </p>
                    <div className="review-actions">
                        <button className="accept-button">Accept</button>
                        <button className="reject-button">Reject</button>
                    </div>
                </div>
                <div className="review-item">
                    <h3 className="review-title">Review by Jane Smith</h3>
                    <p className="review-content">
                        The product didn&apos;t meet my expectations.
                    </p>
                    <div className="review-actions">
                        <button className="accept-button">Accept</button>
                        <button className="reject-button">Reject</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewAdminPage;
