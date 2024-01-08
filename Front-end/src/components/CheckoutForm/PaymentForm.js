import React, { useEffect, useState } from "react";
import { Typography, Button, Divider } from "@material-ui/core";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSnackbar } from "../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../constants";
import { getData } from "../../utils/localStorage";
import Review from "./Review";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({
  checkoutToken,
  nextStep,
  backStep,
  shippingData,
  onCaptureCheckout,
}) => {
  const { openSnackbar } = useSnackbar();
  const token = getData("token");
  const [cart, setCart] = useState({
    id: null,
    lineItems: [],
    totalItems: 0,
    totalUniqueItems: 0,
    subTotal: 0,
  });
  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:8889/api/shopping-cart-items", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      const data = await res.json();
      if (data?.statusCode === "00000") {
        const cartItems = data?.data;
        let totalItems = 0;
        let subTotal = 0;
        cartItems.forEach((ct) => {
          totalItems = totalItems + ct.quantity;
          subTotal = subTotal + ct.quantity * ct.sellingPrice;
        });
        const cart = {
          id: null,
          lineItems: cartItems,
          totalItems,
          totalUniqueItems: cartItems?.length,
          subTotal,
        };
        setCart(cart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      const orderData = {
        line_items: checkoutToken?.live?.line_items,
        customer: {
          firstname: shippingData.firstName,
          lastname: shippingData.lastName,
          email: shippingData.email,
        },
        shipping: {
          name: "International",
          street: shippingData.address1,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry,
        },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: "stripe",
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };

      onCaptureCheckout(checkoutToken.id, orderData);

      nextStep();
    }
  };

  const handleCreateOrder = async () => {
    const payload = {
      ...shippingData,
    };
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    try {
      await fetch(`http://localhost:8889/api/orders`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      openSnackbar(SNACKBAR.SUCCESS, "Create order successfully");
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Create order failed");
    }
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} cart={cart} />
      <Divider />
      {/* <Typography variant="h6" gutterBottom style={{ margin: "20px 0" }}>
        Payment method
      </Typography> */}
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              {/* <CardElement /> */}
              <br /> <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={backStep}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!stripe}
                  style={{ backgroundColor: "#1C2331", color: "#FFFF" }}
                  onClick={handleCreateOrder}
                >
                  {/* Pay {cart?.subTotal} */}
                  Order
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
