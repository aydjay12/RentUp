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

const CreateResidencyForm = ({ residency, onSave, isEditMode, inModal }) => {
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
  const [imageChanged, setImageChanged] = useState(false); // Track if image was changed during edit

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

  const { createResidency, mutationLoading } = useResidencyStore();

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
      setImageChanged(false);
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
        setImageChanged(true); // Mark as changed
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className={`${styles.createResidencyForm} ${inModal ? styles.inModal : ""}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {!isEditMode && <h2>Property Details</h2>}

      <form onSubmit={handleSubmit}>
        {/* Core Information */}
        <div className={styles.inputContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Property Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Modern Villa with Pool"
              value={newResidency.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="status">Listing Status</label>
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

        {/* Location Information */}
        <div className={styles.inputContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="address">Full Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="123 Real Estate St."
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

        {/* Property Description */}
        <div className={styles.formGroup}>
          <label htmlFor="description">Detailed Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell us about the property features, neighborhood, etc."
            value={newResidency.description}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Facilities Section */}
        <div className={styles.inputContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              min="0"
              value={newResidency.bathrooms}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="parkings">Parking Spaces</label>
            <input
              type="number"
              id="parkings"
              name="parkings"
              min="0"
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
              min="0"
              value={newResidency.bedrooms}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Pricing & Category */}
        <div className={styles.inputContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="type">Property Type</label>
            <select
              id="type"
              name="type"
              value={newResidency.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {residencyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="0.00"
              value={newResidency.price}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className={styles.uploadSection}>
          <div>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="image">
              <Upload size={20} />
              {newResidency.image ? "Change Property Image" : "Upload Property Image"}
            </label>
            {newResidency.image && (
              <span className={styles.uploadedImage}>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  ✓ {isEditMode && imageChanged ? "Image changed successfully" : "Image selected successfully"}
                </motion.span>
              </span>
            )}
            {!newResidency.image && <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>PNG, JPG or JPEG (Max. 5MB)</p>}
          </div>
          {imageError && <p className={styles.errorMessage}>Please upload a property image to continue</p>}
        </div>

        {/* Form Actions */}
        <button type="submit" className={styles.submitButton} disabled={mutationLoading}>
          {mutationLoading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <>
              {isEditMode ? "Save Changes" : <><PlusCircle size={20} /> Create Residency</>}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateResidencyForm;
