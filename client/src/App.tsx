// client/src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { GuestOnlyRoute, ProtectedRoute } from './components/RouteGuard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Unsubscribe from './pages/Unsubscribe';
import "./App.css"; // Import your global styles
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import CancellationRefunds from './pages/CancellationRefunds';
import ContactUs from './pages/ContactUs';
import ResetPassword from './pages/ResetPassword'; // Import the ResetPassword component

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Guest-only routes (redirect to /products if logged in) */}
          <Route 
            path="/login" 
            element={
              <GuestOnlyRoute>
                <Login />
              </GuestOnlyRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <GuestOnlyRoute>
                <Register />
              </GuestOnlyRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <GuestOnlyRoute>
                <ResetPassword />
              </GuestOnlyRoute>
            } 
          />
          
          {/* Public routes */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/general-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="cancellations" element={<CancellationRefunds />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          
          {/* Protected routes (require authentication) */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/affiliate" 
            element={
              <ProtectedRoute>
                <AffiliateDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
