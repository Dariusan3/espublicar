"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/useCart";
import useOrders, { OrderItem, ShippingAddress } from "@/hooks/useOrders";
import { toast } from "react-toastify";

export default function Checkout() {
  const router = useRouter();
  const { cart, clearMyCart } = useCart();
  const { createOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [contact, setContact] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderNotes, setOrderNotes] = useState("");

  const cartProducts = cart.items;
  const totalPrice = cart.totalAmount;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartProducts.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Validate required fields
    if (
      !contact ||
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.zipCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order items
      const orderItems: OrderItem[] = cartProducts.map((item) => ({
        productId: item.productId,
        title: item.productTitle || "Product",
        price: item.productPrice || 0,
        quantity: item.quantity,
        imgSrc: item.productImage,
      }));

      // Create order
      const result = await createOrder(
        orderItems,
        totalPrice,
        shippingAddress,
        paymentMethod,
        orderNotes,
      );

      if (result.success) {
        // Clear cart after successful order
        await clearMyCart();

        // Redirect to order confirmation
        router.push(`/order-details?orderId=${result.data.id}`);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar next" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link href={`/shop-cart`} className="link body-text-3">
                Shopping Cart
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link
                href={`/checkout`}
                className="text-secondary link body-text-3"
              >
                Shopping &amp; Checkout
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <span className="link body-text-3">Confirmation</span>
            </div>
          </div>
        </div>
        <form
          onSubmit={handlePlaceOrder}
          className="tf-checkout-wrap flex-lg-nowrap"
        >
          <div className="page-checkout">
            <div className="wrap">
              <h5 className="title has-account">
                <span className="fw-semibold">Contact</span>
                <span className="body-text-3">
                  Have an account?
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="body-text-3 text-secondary link"
                  >
                    Login
                  </a>
                </span>
              </h5>
              <div className="form-checkout-contact">
                <label className="body-md-2 fw-semibold">Email or Phone</label>
                <input
                  className="def"
                  type="text"
                  placeholder="Your contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
                <p className="caption text-main-2 font-2">
                  Order information will be sent to your email
                </p>
              </div>
            </div>
            <div className="wrap">
              <h5 className="title fw-semibold">Delivery</h5>
              <div className="def">
                <fieldset>
                  <label>Country/Region</label>
                  <div className="tf-select">
                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your Country/Region</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </fieldset>
                <div className="cols">
                  <fieldset>
                    <label>First name *</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="e.g. John"
                      value={shippingAddress.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                  <fieldset>
                    <label>Last name *</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="e.g. Doe"
                      value={shippingAddress.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                </div>
                <div className="cols">
                  <fieldset>
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. New York"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                  <fieldset>
                    <label>State</label>
                    <div className="tf-select">
                      <select
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="CA">California</option>
                        <option value="GA">Georgia</option>
                        <option value="NY">New York</option>
                        <option value="WA">Washington</option>
                      </select>
                    </div>
                  </fieldset>
                  <fieldset>
                    <label>ZIP code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="e.g. 83254"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                </div>
                <fieldset>
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Your detailed address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                <fieldset>
                  <label>Order note</label>
                  <textarea
                    placeholder="Note on your order"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </fieldset>
              </div>
            </div>
            <div className="wrap">
              <h5 className="title">Payment</h5>
              <div className="form-payment">
                <div className="payment-box" id="payment-box">
                  <div
                    className={`payment-item ${paymentMethod === "card" ? "active" : ""}`}
                  >
                    <label
                      htmlFor="credit-card-method"
                      className="payment-header"
                      onClick={() => setPaymentMethod("card")}
                    >
                      <span className="body-md-2 fw-semibold title">
                        Credit/Debit Card
                      </span>
                      <input
                        type="radio"
                        name="payment-method"
                        className="d-none tf-check-rounded"
                        id="credit-card-method"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                    </label>
                    {paymentMethod === "card" && (
                      <div className="payment-body">
                        <fieldset>
                          <label>Credit Card number</label>
                          <input
                            type="text"
                            className="number-credit-card"
                            placeholder="xxxx xxxx xxxx xxxx"
                          />
                        </fieldset>
                        <div className="cols">
                          <fieldset>
                            <label>Expiration date</label>
                            <input type="text" placeholder="MM/YY" />
                          </fieldset>
                          <fieldset>
                            <label>CVV</label>
                            <input type="text" placeholder="xxx" />
                          </fieldset>
                        </div>
                        <fieldset>
                          <label>Name on card</label>
                          <input type="text" placeholder="e.g. JOHN DOE" />
                        </fieldset>
                      </div>
                    )}
                  </div>
                  <div
                    className={`payment-item ${paymentMethod === "cash" ? "active" : ""}`}
                  >
                    <label
                      htmlFor="delivery-method"
                      className="payment-header radio-item"
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        className="tf-check-rounded"
                        id="delivery-method"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                      />
                      <span className="body-text-3">Cash on delivery</span>
                    </label>
                  </div>
                </div>
                <div className="box-btn">
                  <button
                    type="submit"
                    className="tf-btn w-100"
                    disabled={isSubmitting || cartProducts.length === 0}
                  >
                    <span className="text-white">
                      {isSubmitting ? "Placing Order..." : "Place Order"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flat-sidebar-checkout">
            <div className="sidebar-checkout-content">
              <h5 className="fw-semibold">Order Summary</h5>
              {cartProducts.length ? (
                <ul className="list-product">
                  {cartProducts.map((item, i) => (
                    <li key={i} className="item-product">
                      <a href="#" className="img-product">
                        <Image
                          alt=""
                          src={item.productImage || "/images/placeholder.jpg"}
                          width={500}
                          height={500}
                        />
                      </a>
                      <div className="content-box">
                        <a
                          href="#"
                          className="link-secondary body-md-2 fw-semibold"
                        >
                          {item.productTitle || "Product"}
                        </a>
                        <p className="price-quantity price-text fw-semibold">
                          ${(item.productPrice || 0).toFixed(2)}
                          <span className="body-md-2 text-main-2 fw-normal">
                            X{item.quantity}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4">
                  <div className="col-4">
                    Your Cart is empty. Start adding favorite products to cart!
                  </div>
                  <Link
                    className="tf-btn mt-2 mb-3 text-white"
                    style={{ width: "fit-content" }}
                    href="/shop-default"
                  >
                    Explore Products
                  </Link>
                </div>
              )}
              <div className="">
                <p className="body-md-2 fw-semibold sub-type">Discount code</p>
                <div className="ip-discount-code style-2">
                  <input type="text" className="def" placeholder="Your code" />
                  <button type="button" className="tf-btn btn-gray-2">
                    <span>Apply</span>
                  </button>
                </div>
              </div>
              <ul className="sec-total-price">
                <li>
                  <span className="body-text-3">Sub total</span>
                  <span className="body-text-3">${totalPrice.toFixed(2)}</span>
                </li>
                <li>
                  <span className="body-text-3">Shipping</span>
                  <span className="body-text-3">Free shipping</span>
                </li>
                <li>
                  <span className="body-md-2 fw-semibold">Total</span>
                  <span className="body-md-2 fw-semibold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
