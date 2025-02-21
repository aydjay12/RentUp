import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useResidencyStore } from "../../store/useResidencyStore";
import styles from "./CreateResidencyForm.module.scss"; // Fixed SCSS import

const residencyTypes = [
  "Apartment",
  "Condo",
  "Family House",
  "Villa",
  "Office & Studio",
];

const cityToCountryMap = {
  Liverpool: "England",
  "New Orleans": "US",
  Montreal: "Canada",
  California: "US",
  Jersey: "US",
};

const CreateResidencyForm = ({ residency, onSave, isEditMode }) => {
  const [newResidency, setNewResidency] = useState({
    title: "",
    status: "",
    address: "",
    city: "",
    country: "",
    description: "",
    bathrooms: "",
    parkings: "",
    bedrooms: "",
    price: "",
    type: "",
    image: "",
  });

  const [imageError, setImageError] = useState(false); // New state for image validation

  useEffect(() => {
    if (isEditMode && residency) {
      setNewResidency({
        title: residency.title,
        status: residency.status,
        address: residency.address,
        city: residency.city,
        country: residency.country,
        description: residency.description,
        bathrooms: residency.facilities?.bathrooms || "",
        parkings: residency.facilities?.parkings || "",
        bedrooms: residency.facilities?.bedrooms || "",
        price: residency.price,
        type: residency.type,
        image: residency.image,
      });
    }
  }, [residency, isEditMode]);

  const { createResidency, loading } = useResidencyStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newResidency.image) {
      setImageError(true);
      return;
    }

    setImageError(false);

    const formattedResidency = {
      ...newResidency,
      facilities: {
        bathrooms: newResidency.bathrooms,
        parkings: newResidency.parkings,
        bedrooms: newResidency.bedrooms,
      },
    };

    try {
      if (isEditMode) {
        await onSave(formattedResidency); // Call update function instead of create
      } else {
        await createResidency(formattedResidency); // Only create if it's not edit mode
      }

      setNewResidency({
        title: "",
        status: "",
        address: "",
        city: "",
        country: "",
        description: "",
        bathrooms: "",
        parkings: "",
        bedrooms: "",
        price: "",
        type: "",
        image: "",
      });
    } catch (error) {
      console.error("Error processing residency:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResidency((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "city" && { country: cityToCountryMap[value] || "" }),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewResidency((prev) => ({ ...prev, image: reader.result }));
        setImageError(false); // Clear error when an image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className={styles.createResidencyForm}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2>{isEditMode ? "" : "Create New Residency"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Residency Details */}
        <div className={styles.inputContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newResidency.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={newResidency.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>
        </div>

        {/* Address Section */}
        <div className={styles.inputContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={newResidency.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={newResidency.city}
              onChange={handleInputChange}
              required
            >
              <option value="">Select City</option>
              {Object.keys(cityToCountryMap).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={newResidency.description}
            onChange={handleInputChange}
            rows="6"
            required
          />
        </div>

        {/* Features */}
        <div className={styles.inputContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={newResidency.bathrooms}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="parkings">Parkings</label>
            <input
              type="number"
              id="parkings"
              name="parkings"
              value={newResidency.parkings}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={newResidency.bedrooms}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Price & Type */}
        <div className={styles.inputContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={newResidency.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a Type</option>
              {residencyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={newResidency.price}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className={styles.uploadSection}>
          <div>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="image">
              <Upload className="h-5 w-5 inline-block mr-2" />
              Upload Image
            </label>
            {newResidency.image && (
              <span className={styles.uploadedImage}>Image uploaded</span>
            )}
          </div>
          {imageError && <p className={styles.errorMessage}>Image Required</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton}>
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              <PlusCircle />
              {isEditMode ? "Save Changes" : "Create Residency"}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateResidencyForm;
