import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import { AlertCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Modal, Button, Text } from "@mantine/core";
import Heart from "../../components/Heart/Heart";
import { motion, AnimatePresence } from "framer-motion";
import { useResidencyStore } from "../../store/useResidencyStore";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/authStore";
import useSnackbarStore from "../../store/useSnackbarStore";
import "../../styles/property.css";

const Property = () => {
    const { propertyId: id } = useParams();
    const { fetchResidencyById } = useResidencyStore();
    const { cartItems, toggleCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();
    const { showSnackbar } = useSnackbarStore();
    const [property, setProperty] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();

    const [opened, setOpened] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            setIsFetching(true);
            setHasError(false);
            try {
                const data = await fetchResidencyById(id);
                setProperty(data);
            } catch (error) {
                console.error("Error fetching property:", error);
                setHasError(true);
            } finally {
                setIsFetching(false);
            }
        };

        fetchProperty();
    }, [id, fetchResidencyById]);

    const isInCart = cartItems.some((item) => item._id === id);

    const handleToggleCart = async () => {
        if (!isAuthenticated) {
            showSnackbar("You must be logged in to add to cart", "error");
            return;
        }
        if (!user?.isVerified) {
            showSnackbar("You must be verified to add this to the cart", "error");
            return navigate("/otp-verification");
        }

        if (isToggling) return; // Prevent double clicks

        if (isInCart) {
            setOpened(true);
        } else {
            setIsToggling(true);
            try {
                await toggleCart(id);
            } finally {
                setIsToggling(false);
            }
        }
    };

    const confirmRemoveFromCart = async () => {
        setIsRemoving(true);
        try {
            await toggleCart(id);
            setOpened(false);
        } catch (error) {
            console.error("Error removing from cart:", error);
            showSnackbar("Failed to remove from cart", "error");
        } finally {
            setIsRemoving(false);
        }
    };

    // Loading State
    if (isFetching) {
        return (
            <div className="property-loading-container">
                <PuffLoader color="#27ae60" size={80} aria-label="puff-loading" />
            </div>
        );
    }

    // Error State
    if (hasError || !property) {
        return (
            <motion.div
                className="property-error-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="property-error-box">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <AlertCircle size={64} className="property-error-icon" />
                    </motion.div>
                    <h2 className="property-error-title">Property Not Found</h2>
                    <p className="property-error-message">
                        We couldn't load the property details. The property may have been removed or there was a connection issue.
                    </p>
                    <button
                        onClick={() => navigate("/properties")}
                        className="property-error-btn"
                    >
                        <ArrowLeft size={20} />
                        Back to Properties
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="property-page-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Image Section - Full Width */}
            <section className="property-hero-section">
                <motion.div
                    className="property-image-container"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img src={property.image} alt={property.title} className="property-hero-image" />
                    <div className="hero-overlay" />
                </motion.div>
                <div className="pass-actions">
                    <Heart id={id} />
                </div>
            </section>

            <div className="property-content-wrapper">
                <div className="property-grid">
                    {/* Main Content */}
                    <div className="details-column">
                        {/* Header & Features (Always top) */}
                        <div className="mobile-top-content">
                            <motion.div
                                className="property-header"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="type-badge">{property.type}</div>
                                <h1 className="property-title">{property.title}</h1>
                                <div className="property-address">
                                    <MdLocationPin size={20} className="icon" />
                                    <span>{property.address}, {property.city}, {property.country}</span>
                                </div>
                            </motion.div>

                            <motion.div
                                className="features-strip"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="feature-item">
                                    <MdMeetingRoom size={24} />
                                    <div className="feature-text">
                                        <span className="value">{property.facilities?.bedrooms || 0}</span>
                                        <span className="label">Bedrooms</span>
                                    </div>
                                </div>
                                <div className="feature-divider" />
                                <div className="feature-item">
                                    <FaShower size={24} />
                                    <div className="feature-text">
                                        <span className="value">{property.facilities?.bathrooms || 0}</span>
                                        <span className="label">Bathrooms</span>
                                    </div>
                                </div>
                                <div className="feature-divider" />
                                <div className="feature-item">
                                    <AiTwotoneCar size={24} />
                                    <div className="feature-text">
                                        <span className="value">{property.facilities?.parkings || 0}</span>
                                        <span className="label">Parking</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar-column">
                        <motion.div
                            className="booking-card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="price-header">
                                <span className="label">Price</span>
                                <div className="price-display">
                                    <span className="currency">$</span>
                                    <span className="amount">{property.price?.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="action-stack">
                                <AnimatePresence mode="popLayout">
                                    {isInCart ? (
                                        <motion.button
                                            key="remove"
                                            className="action-btn remove-btn"
                                            onClick={handleToggleCart}
                                            disabled={isToggling}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <ShoppingCart size={18} />
                                            Remove from Cart
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            key="add"
                                            className="action-btn add-btn"
                                            onClick={handleToggleCart}
                                            disabled={isToggling}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <ShoppingCart size={18} />
                                            {isToggling ? "Adding to cart" : "Add to Cart"}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                <button className="action-btn secondary-btn" onClick={() => navigate("/contact")}>
                                    Direct Inquiry
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Description Section - Full Width */}
                <div className="description-full-width">
                    <motion.div
                        className="description-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="section-heading">About this property</h3>
                        <p className="description-content">{property.description}</p>
                    </motion.div>
                </div>
            </div>

            {/* Remove Confirmation Modal */}
            <Modal
                opened={opened}
                onClose={() => !isRemoving && setOpened(false)}
                title="Confirm Remove"
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                closeOnClickOutside={!isRemoving}
                closeOnEscape={!isRemoving}
                withCloseButton={!isRemoving}
                styles={{
                    title: { fontWeight: 700, fontFamily: 'Merriweather, serif' },
                    body: { paddingBottom: '1rem' }
                }}
            >
                <Text size="sm" mb="lg">Are you sure you want to remove this property from your cart?</Text>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button
                        variant="default"
                        onClick={() => setOpened(false)}
                        disabled={isRemoving}
                        className={`modal-cancel-btn ${isRemoving ? "cancel-btn-no-hover" : ""}`}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={confirmRemoveFromCart}
                        disabled={isRemoving}
                        className={isRemoving ? "remove-btn-no-hover" : ""}
                    >
                        {isRemoving ? "Removing..." : "Remove"}
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
};

export default Property;
