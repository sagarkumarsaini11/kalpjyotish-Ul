import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PoojaDetails.css";

const PoojaDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pooja, setPooja] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://kalpyotish.onrender.com/api/all-poojas")
            .then(res => res.json())
            .then(data => {
                const list = data.data || data;

                const selected = list.find(item => item._id === id);
                setPooja(selected);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const whatsappNumber = "999999999999"; 
    const handleWhatsAppClick = () => {
        const message = encodeURIComponent("Hello, I want to know more about this pooja.");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    if (loading) return <p>Loading...</p>;
    if (!pooja) return <p>Pooja not found</p>;

    return (
        <div className="pooja-details-container">
            <div className="pooja-details">
                {/* LEFT */}
                <div className="pooja-left">
                    <img src={pooja.image} alt={pooja.name} />
                </div>

                {/* RIGHT */}
                <div className="pooja-right">
                    <h1>{pooja.name}</h1>
                    <p className="description">{pooja.description}</p>
                    <h2 className="price">Price: ₹ {pooja.price}</h2>
                    <button className="inquiry-btn" onClick={handleWhatsAppClick}>
                        Know More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PoojaDetails;
