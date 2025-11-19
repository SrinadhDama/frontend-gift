import './App.css';
import Home from './Home';
import ProductList from './ProductList';
import CartPage from './CartPage';
import { Routes, Route, useLocation } from 'react-router-dom';
// import ProtectedRoute from "./components/ProtectedRoute";
import GiftMessage from './GiftMessage';
import LandingPage from './LandingPage';
import RegisterPage from './RegisterPage';
import Profile from './Profile';
import GiftDetails from './GiftDetails';
import AddGiftForm from './AddGiftForm';
import EditGiftForm from './EditGiftForm';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./pages/Contact";
import ShippingPolicy from "./pages/ShippingPolicy";
import OrderConfirmation from './OrderConfirmation';
import { ToastContainer } from 'react-toastify';


function App() {
  const location = useLocation(); // get current route

  // Pages where navbar should be hidden
  const hideHeaderPaths = ['/', '/register', '/login'];

  return (
    <>
      {/* Conditionally render navbar */}
      {!hideHeaderPaths.includes(location.pathname)}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productslist" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/giftMessage" element={<GiftMessage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gift/:id" element={<GiftDetails />} />                {/* Details page */}
        <Route path="/add-gift" element={<AddGiftForm />} />
        <Route path="/edit-gift/:id" element={<EditGiftForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

      </Routes>
    </>
  );
}

export default App;
