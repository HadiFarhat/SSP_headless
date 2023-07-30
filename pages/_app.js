import { CustomerProvider } from "../context/CustomerContext.js";
import { CartProvider } from "../context/CartContext.js";
import 'bootstrap/dist/css/bootstrap.min.css';
//import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <CustomerProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </CustomerProvider>
  );
}

export default MyApp;
