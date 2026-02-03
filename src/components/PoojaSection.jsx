// src/components/PoojaSection.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./PoojaSection.css";

const PoojaSection = () => {
  const [poojas, setPoojas] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ NEW STATE (for conditional rendering)
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        const response = await fetch(
          "https://kalpyotish.onrender.com/api/all-poojas",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log("Full API Response:", data);
        console.log("Full API Response in array:", data.data)

        // The API returns data.data as an array, not an object
        let poojaArray = data.data || data;

        // If it's not an array, make it one
        if (!Array.isArray(poojaArray)) {
          console.error("Unexpected data format:", poojaArray);
          throw new Error("Invalid data format from API");
        }

        // Group poojas by category
        const groupedPoojas = poojaArray.reduce((acc, pooja) => {
          // Extract category from the pooja object, or use "All Poojas" as default
          const category = pooja.category || "All Poojas";

          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(pooja);
          return acc;
        }, {});

        console.log("Grouped Poojas:", groupedPoojas);

        setPoojas(groupedPoojas);
        const foundCategories = Object.keys(groupedPoojas);
        setCategories(foundCategories);

        if (foundCategories.length > 0) {
          setActiveTab(foundCategories[0]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch poojas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoojas();
  }, []);

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
    exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.2 } },
  };

  if (error) {
    return (
      <div className="pooja-section">
        <p className="error-message">
          Failed to load Pooja services. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      // ✅ TOP BUTTON
      {!showSection && (
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              textAlign: "center",
              // margin: "20px 0",
              height: "400px",
              width: "400px",
              // border: "2px solid black",
            }}
          >
            <img src="/src/assets/navGarahPujan.webp" alt="NAVGRAH PUJAN"
            style={{height: "300px",
              width: "300px",}}
             />
            <button
              onClick={() => setShowSection((prev) => !prev)}
              style={{
                padding: "10px 20px",
                background: "#ff9800",
                color: "#fff",
                marginTop: "20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              NAVGRAH PUJAN
            </button>
          </div>
        </div>
      )}
      {showSection && (
        <section className="pooja-section">
          <h2 className="pooja-main-title">Online Pooja Services</h2>
          <p className="pooja-subtitle">
            Book online Poojas with our expert Pandits and find spiritual
            solace.
          </p>

          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div>
              {/* Tab Navigation */}
              {categories.length > 0 && (
                <div className="tabs-container">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`tab-button ${activeTab === category ? "active" : ""}`}
                      onClick={() => setActiveTab(category)}
                    >
                      {category}
                      {activeTab === category && (
                        <motion.div
                          className="active-tab-underline"
                          layoutId="active-underline"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Pooja Grid */}
              <motion.div
                className="pooja-grid"
                key={activeTab}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {poojas[activeTab] &&
                  Array.isArray(poojas[activeTab]) &&
                  poojas[activeTab].length > 0 ? (
                    poojas[activeTab].map((pooja) => (
                      <motion.div
                        key={pooja._id}
                        className="pooja-card"
                        variants={cardVariants}
                        exit="exit"
                        whileHover={{
                          y: -8,
                          boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
                        }}
                      >
                        <div className="pooja-image-container">
                          <img
                            src={pooja.image}
                            alt={pooja.name}
                            className="pooja-image"
                          />
                          <div className="pooja-image-overlay"></div>
                        </div>
                        <div className="pooja-content">
                          <h3 className="pooja-name">{pooja.name}</h3>
                          <p className="pooja-description">
                            {pooja.description?.split("\n")[0] ||
                              "No description available"}
                          </p>
                          <Link
                            to={`/pooja/${pooja._id}`}
                            className="pooja-details-button"
                          >
                            View Details
                          </Link>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="no-poojas-message">
                      No poojas available in this category.
                    </p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default PoojaSection;

// src/components/PoojaSection.jsx

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import './PoojaSection.css';

// const PoojaSection = () => {
//   const [poojas, setPoojas] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [activeTab, setActiveTab] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ NEW STATE (for conditional rendering)
//   const [showSection, setShowSection] = useState(false);

//   useEffect(() => {
//     const fetchPoojas = async () => {
//       try {
//         const response = await fetch('https://kalpyotish.onrender.com/api/all-poojas');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();

//         let poojaArray = data.data || data;

//         if (!Array.isArray(poojaArray)) {
//           throw new Error('Invalid data format from API');
//         }

//         const groupedPoojas = poojaArray.reduce((acc, pooja) => {
//           const category = pooja.category || 'All Poojas';

//           if (!acc[category]) {
//             acc[category] = [];
//           }
//           acc[category].push(pooja);
//           return acc;
//         }, {});

//         setPoojas(groupedPoojas);
//         const foundCategories = Object.keys(groupedPoojas);
//         setCategories(foundCategories);

//         if (foundCategories.length > 0) {
//           setActiveTab(foundCategories[0]);
//         }

//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPoojas();
//   }, []);

//   if (error) {
//     return (
//       <div className="pooja-section">
//         <p className="error-message">Failed to load Pooja services. Please try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* ✅ TOP BUTTON */}
//       <div style={{ textAlign: "center", margin: "20px 0" }}>
//         <button
//           onClick={() => setShowSection(prev => !prev)}
//           style={{
//             padding: "10px 20px",
//             background: "#ff9800",
//             color: "#fff",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer"
//           }}
//         >
//           Nav Garh Pujan
//         </button>
//       </div>

//       {/* ✅ CONDITIONAL RENDERING */}
//       {showSection && (
//         <section className="pooja-section">
//           <h2 className="pooja-main-title">Online Pooja Services</h2>
//           <p className="pooja-subtitle">
//             Book online Poojas with our expert Pandits and find spiritual solace.
//           </p>

//           {loading ? (
//             <div className="loader-container"><div className="loader"></div></div>
//           ) : (
//             <>
//               {categories.length > 0 && (
//                 <div className="tabs-container">
//                   {categories.map(category => (
//                     <button
//                       key={category}
//                       className={`tab-button ${activeTab === category ? 'active' : ''}`}
//                       onClick={() => setActiveTab(category)}
//                     >
//                       {category}
//                       {activeTab === category && (
//                         <motion.div className="active-tab-underline" layoutId="active-underline" />
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               <motion.div
//                 className="pooja-grid"
//                 key={activeTab}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//               >
//                 <AnimatePresence>
//                   {poojas[activeTab]?.map(pooja => (
//                     <motion.div key={pooja._id} className="pooja-card">
//                       <div className="pooja-image-container">
//                         <img src={pooya.image} alt={pooya.name} className="pooja-image" />
//                       </div>
//                       <div className="pooja-content">
//                         <h3>{pooya.name}</h3>
//                         <Link to={`/pooja/${pooya._id}`}>View Details</Link>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </motion.div>
//             </>
//           )}
//         </section>
//       )}
//     </>
//   );
// };

// export default PoojaSection;

// src/components/PoojaSection.jsx

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import './PoojaSection.css'; // We will create this file next

// // --- Main Section Component ---
// const PoojaSection = () => {
//   const [poojas, setPoojas] = useState({}); // State to hold poojas grouped by category
//   const [categories, setCategories] = useState([]); // State for tab names
//   const [activeTab, setActiveTab] = useState(''); // State for the currently selected tab
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPoojas = async () => {
//       try {
//         // Updated API endpoint
//         const response = await fetch('https://kalpyotish.onrender.com/api/all-poojas');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         const poojaData = data.data;
//         // console.log('Full API Response:', data);
//         // console.log('data.data:', data.data);

//         setPoojas(poojaData); // Store the entire object { "Category": [...] }
//         const foundCategories = Object.keys(poojaData);
//         setCategories(foundCategories);
//         // Set the first category as the active one by default
//         if (foundCategories.length > 0) {
//           setActiveTab(foundCategories[0]);
//         }

//       } catch (err) {
//         setError(err.message);
//         console.error("Failed to fetch poojas:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPoojas();
//   }, []); // Empty array ensures this runs only once on mount

//   // Animation for the container to stagger children
//   const gridVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
//   };

//   // Animation for each card
//   const cardVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.98 },
//     visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 100 } },
//     exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.2 } }
//   };

//   if (error) {
//     return <div className="pooja-section"><p className="error-message">Failed to load Pooja services. Please try again later.</p></div>;
//   }

//   return (
//     <section className="pooja-section">
//       <h2 className="pooja-main-title">Online Pooja Services</h2>
//       <p className="pooja-subtitle">Book online Poojas with our expert Pandits and find spiritual solace.</p>

//       {loading ? (
//         <div className="loader-container"><div className="loader"></div></div>
//       ) : (
//         <>

//           <div className="tabs-container">
//             {categories.map(category => (
//               <button
//                 key={category}
//                 className={`tab-button ${activeTab === category ? 'active' : ''}`}
//                 onClick={() => setActiveTab(category)}
//               >
//                 {category}
//                 {activeTab === category && (
//                   <motion.div className="active-tab-underline" layoutId="active-underline" />
//                 )}
//               </button>
//             ))}
//           </div>

//           <motion.div
//             className="pooja-grid"
//             key={activeTab} // This makes the grid re-animate when the tab changes
//             variants={gridVariants}
//             initial="hidden"
//             animate="visible"
//           >

//             <AnimatePresence>
//   {poojas[activeTab] && Array.isArray(poojas[activeTab]) ? (
//     poojas[activeTab].map(pooja => (
//       <motion.div
//         key={pooja._id}
//         className="pooja-card"
//         variants={cardVariants}
//         exit="exit"
//         whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}
//       >
//         <div className="pooja-image-container">
//           <img src={pooja.image} alt={pooja.name} className="pooja-image" />
//           <div className="pooja-image-overlay"></div>
//         </div>
//         <div className="pooja-content">
//           <h3 className="pooja-name">{pooja.name}</h3>
//           <p className="pooja-description">
//             {pooja.description.split('\n')[0]}
//           </p>
//           <Link to={`/pooja/${pooja._id}`} className="pooja-details-button">
//             View Details
//           </Link>
//         </div>
//       </motion.div>
//     ))
//   ) : (
//     <p className="no-poojas-message">No poojas available in this category.</p>
//   )}
// </AnimatePresence>
//           </motion.div>
//         </>
//       )}
//     </section>
//   );
// };

// export default PoojaSection;
