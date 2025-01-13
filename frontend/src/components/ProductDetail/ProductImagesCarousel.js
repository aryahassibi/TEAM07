import PropTypes from "prop-types";
import "./ProductImagesCarousel.css";

const ProductImagesCarousel = ({ images, currentImageIndex, setCurrentImageIndex }) => {

    console.log(`This is the picture path: ${images[currentImageIndex].url} `)
    const defaultImage = {
        url: "/assets/images/products/default_mockup.png",
        alt: "Default Mockup Image"
    };

    if (!images || images.length === 0) {
        images = [defaultImage];
    }

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handleImageError = (event) => {
        console.log("Image error: ", event.target.src);
        // IF THE the iamge does not start with https  then we will add the localhost:5001
        if (!defaultImage.url.startsWith("http")) {
            event.target.src = `http://localhost:5001${defaultImage.url}`;
        } else {
            event.target.src = defaultImage.url;
        }

        event.target.alt = defaultImage.alt;
    };

    return (
        <div className="image-carousel">
            <div className="main-image">

                <img
                    src={images[currentImageIndex].url.startsWith("http") ? images[currentImageIndex].url : `http://localhost:5001${images[currentImageIndex].url}`}
                    alt={images[currentImageIndex].alt || "Product Image"}
                    onError={handleImageError}
                />
                <button
                    className="nav-button left"
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                >
                    &#10094;
                </button>
                <button
                    className="nav-button right"
                    onClick={handleNextImage}
                    aria-label="Next Image"
                >
                    &#10095;
                </button>
            </div>
            <div className="dots-container">
                {images.map((image, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentImageIndex ? "active" : ""}`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`View image ${index + 1}`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

ProductImagesCarousel.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            url: PropTypes.string.isRequired,
            alt: PropTypes.string,
        })
    ).isRequired,
    currentImageIndex: PropTypes.number.isRequired,
    setCurrentImageIndex: PropTypes.func.isRequired,
};

export default ProductImagesCarousel;
