// src/pages/CheckoutPage.jsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import OrderSummary from "../components/Cart/OrderSummary";
import { useCart } from "../hooks/useCart";
import Navbar from "../components/Navbar";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { clearServerCart, fetchServerCart } from "../features/cart/cartThunks";
import { useDispatch } from "react-redux";

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const { darkMode } = useTheme();
  const { items, totalItems, totalPrice, clearServerCart } = useCart();
  const navigate = useNavigate();

  const theme = {
    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    textMain: darkMode ? "text-gray-100" : "text-gray-900",
    textSub: darkMode ? "text-gray-400" : "text-gray-600",
    accent: "text-indigo-500",
    buttonBg: "bg-indigo-600 hover:bg-indigo-700",
    hoverBg: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100",
  };

  return (
    <Elements stripe={stripePromise}>
      <Navbar />
      <InnerCheckout
        totalItems={totalItems}
        totalPrice={totalPrice}
        theme={theme}
        darkMode={darkMode}
        
      />
    </Elements>
  );
}

/* ------------------------------------------------------------------ */
/*                         INNER CHECKOUT LOGIC                        */
/* ------------------------------------------------------------------ */
function InnerCheckout({ totalItems, totalPrice, theme, darkMode }) {
  const { isAuthenticated } = useAuth();
  let dispatch = useDispatch()
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // ---------- UI State ----------
  const [step, setStep] = useState(1);               // 1 = address+method, 2 = card
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingAddress, setShippingAddress] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------- Create PaymentIntent (only for card) ----------
  useEffect(() => {
    if (!totalPrice || totalItems <= 0 || !isAuthenticated) {
      navigate("/");
      return;
    }

    const createIntent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/create-payment-intent`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Math.round(totalPrice * 100) }),
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (e) {
        setError("Payment server error");
      } finally {
        setLoading(false);
      }
    };

    // We always create the intent (Stripe requires it for card flow)
    createIntent();
  }, [totalPrice, totalItems, isAuthenticated, navigate]);

  // ---------- Proceed to step 2 ----------
  const goToPayment = (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }
    if (paymentMethod === "card" && !clientSecret) {
      toast.error("Card gateway not ready");
      return;
    }
    setStep(2);
  };

  // ---------- Final submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    try {
      // ---- CARD PATH ----
      if (paymentMethod === "card") {
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: { card: elements.getElement(CardElement) } }
        );

        if (stripeError) throw new Error(stripeError.message);

        // ---- CREATE ORDER (both paths) ----
        await createOrder(paymentIntent.id);
      } else {
        // ---- CASH PATH (no Stripe) ----
        await createOrder(null);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  // ---- Helper: create order on backend ----
  const createOrder = async (paymentIntentId) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/create-order`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId,
        paymentMethod,
        shippingAddress,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Order creation failed");

    toast.success("Your order has been placed!");
    await dispatch(clearServerCart()).unwrap();
    navigate('/')
    
    setSucceeded(true);
  };

  // ---------- Card UI style ----------
  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: darkMode ? "#e2e8f0" : "#1f2937",
        "::placeholder": { color: darkMode ? "#94a3b8" : "#9ca3af" },
      },
    },
  };

  /* ------------------------------------------------------------------ */
  /*                              RENDERING                              */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Loader2 className={`animate-spin w-12 h-12 ${darkMode ? "text-gray-200" : "text-gray-800"}`} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {/* -------------------- LEFT PANEL -------------------- */}
        <div className={`${theme.cardBg} p-8 rounded-2xl shadow-xl border ${theme.border}`}>
          <h1 className={`text-3xl font-bold mb-8 ${theme.textMain}`}>Checkout</h1>

          {/* SUCCESS */}
          {succeeded ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className={`text-2xl font-bold ${theme.textMain}`}>Order placed successfully!</p>
            </div>
          ) : step === 1 ? (
            /* ---------------- STEP 1: ADDRESS + METHOD ---------------- */
            <form onSubmit={goToPayment} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <label className={`block font-medium mb-2 ${theme.textSub}`}>Shipping Address</label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${theme.border} ${
                    darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Street, city, postal code..."
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className={`block font-medium mb-2 ${theme.textSub}`}>Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {["card", "cash"].map((m) => (
                    <label
                      key={m}
                      className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === m
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
                          : theme.border + " " + theme.hoverBg
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m}
                        checked={paymentMethod === m}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <span className={`capitalize ${theme.textMain}`}>{m === "cash" ? "Cash on Delivery" : "Credit Card"}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${theme.buttonBg}`}
              >
                Proceed to {paymentMethod === "card" ? "Card" : "Confirmation"}
              </button>
            </form>
          ) : (
            /* ---------------- STEP 2: CARD (only if card) ---------------- */
            paymentMethod === "card" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block font-medium mb-2 ${theme.textSub}`}>Card Details</label>
                  <div
                    className={`p-4 rounded-xl border ${
                      darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <CardElement options={cardStyle} />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 rounded-xl font-medium ${theme.hoverBg} ${theme.textMain}`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!stripe || processing || !clientSecret}
                    className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                      processing || !clientSecret ? "bg-gray-400 cursor-not-allowed" : theme.buttonBg
                    }`}
                  >
                    {processing ? "Processing…" : `Pay $${totalPrice}`}
                  </button>
                </div>
              </form>
            ) : (
              /* ---------------- CASH CONFIRMATION ---------------- */
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className={`text-lg ${theme.textMain}`}>
                  You selected <strong>Cash on Delivery</strong>. Click <strong>Confirm Order</strong> to finish.
                </p>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 rounded-xl font-medium ${theme.hoverBg} ${theme.textMain}`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                      processing ? "bg-gray-400 cursor-not-allowed" : theme.buttonBg
                    }`}
                  >
                    {processing ? "Placing…" : "Confirm Order"}
                  </button>
                </div>
              </form>
            )
          )}
        </div>

        {/* -------------------- RIGHT PANEL – ORDER SUMMARY -------------------- */}
        <div>
          <OrderSummary totalItems={totalItems} totalPrice={totalPrice} theme={theme} />
        </div>
      </div>
    </div>
  );
}