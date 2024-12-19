
import './MainAdminPage.css'; // Import the CSS for styling

const MainAdminPage = () => {
    const role = localStorage.getItem("role"); // Retrieve role from localStorage

    const handleRestrictedAccess = () => {
        alert("You are not authorized to access this section.");
    };

    return (
        <div className="main-admin-container">
            <h1>Admin Panel</h1>
            <p>Welcome to the admin panel. Use the navigation to manage the application.</p>
            <div className="admin-actions">
                
                {role === "product_manager" ? (
                    <button
                        className="admin-button"
                        onClick={() => window.location.href = '/admin/product_management'}
                    >
                        Product Manager
                    </button>
                ) : (
                    <button className="admin-button" onClick={handleRestrictedAccess}>
                        Product Manager
                    </button>
                )}
                {role === "sales_manager" ? (
                    <button
                        className="admin-button"
                        onClick={() => window.location.href = '/admin/sales_management'}
                    >
                        Sales Manager
                    </button>
                ) : (
                    <button className="admin-button" onClick={handleRestrictedAccess}>
                        Sales Manager
                    </button>
                )}
            </div>
        </div>
    );
};


export default MainAdminPage;
