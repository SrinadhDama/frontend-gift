import "./Home.css";
import Header from "./Header";
import Carousel from "react-bootstrap/Carousel";
import { FaGift, FaHeart, FaTruck } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import gift1 from "./assets/gift1.jpg";
import gift2 from "./assets/gift2.jpg";
import gift3 from "./assets/gift3.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />
      <div style={{ marginTop: "80px" }}>
        {/* Carousel Section */}
        <div className="carousel-section">
          <Carousel
            fade
            interval={2000}
            nextIcon={<BsChevronRight size={30} color="#000" />}
            prevIcon={<BsChevronLeft size={30} color="#000" />}
          >
            {[gift1, gift2, gift3].map((img, idx) => (
              <Carousel.Item key={idx}>
                <div className="carousel-img-container">
                  <img
                    className="d-block carousel-img"
                    src={img}
                    alt={`Gift ${idx + 1}`}
                  />
                  <Carousel.Caption>
                    <h3>Send Love Anytime</h3>
                    <p>Beautiful gifts for your loved ones.</p>
                  </Carousel.Caption>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Shop Now Section */}
        <div className="shop-now-section">
          <h2>Welcome to Our Gift Store</h2>
          <p>
            Explore unique gifts, personalize them, and send love to your special ones.
          </p>
          <button className="shop-button" onClick={() => navigate("/productslist")}>
            Shop Now
          </button>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="feature-card">
            <FaGift size={50} color="#d35400" />
            <h3>Wide Range of Gifts</h3>
            <p>Choose gifts for every occasion and recipient.</p>
          </div>
          <div className="feature-card">
            <FaHeart size={50} color="#d35400" />
            <h3>Personalized Messages</h3>
            <p>Make every gift unique with custom messages.</p>
          </div>
          <div className="feature-card">
            <FaTruck size={50} color="#d35400" />
            <h3>Fast Delivery</h3>
            <p>Reliable delivery service to make your gifts reach on time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
