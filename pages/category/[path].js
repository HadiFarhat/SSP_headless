import ProductCard from "../../components/productCard";
import { useState, useEffect } from "react";
import Filters from "../../components/filters";
import Header from "../../components/header.js";
import cookie from "cookie";
import { CartProvider } from "../../context/CartContext.js";
import { CustomerContext } from "../../context/CustomerContext";
import { useContext } from "react";

export default function Category({ category, initialProducts }) {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [products, setProducts] = useState(initialProducts);

  if (!products) return `Error!`;

  const resetFilters = () => {
    setProducts(initialProducts);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "20px",
        border: "5px solid black",
        borderRadius: "15px",
        boxShadow: "5px 10px 8px #888888",
        background: "lightgray",
        width: "900px",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "white",
          height: "100%",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <CartProvider>
          <Header name="Kiosk Web App" onUserChange={setCustomer} />
          <div style={{ height: "20px" }}></div>
          <h1>{capitalizeFirstLetter(category.path)}</h1>
          <Filters
            categoryId={category.entityId}
            setProducts={setProducts}
            resetFilters={resetFilters}
          />
          <div className="row">
            {products.map((product) => (
              <div
                className="col-lg-4 col-md-4 col-sm-4 col-12 mb-4"
                key={product.id}
                style={{ minHeight: "300px" }} // adjust this value as needed
              >
                <ProductCard key={product.id} product={product} />
              </div>
            ))}
          </div>
        </CartProvider>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { path } = context.params;

  // Check if the cookie header exists
  const cookieHeader = context.req.headers.cookie;
  let entityId;

  if (cookieHeader) {
    const cookies = cookie.parse(cookieHeader);
    if (cookies.pathToEntityId) {
      const pathToEntityId = JSON.parse(cookies.pathToEntityId);
      entityId = pathToEntityId["/" + path + "/"];
    }
  }

  if (!entityId) {
    // Handle the case where the entityId is not found
    console.error("EntityId not found for path: " + path);
    return {
      notFound: true,
    };
  }

  const category = { name: "Example Category", path, entityId };

  // Fetch products from the api based on category id
  const productResponse = await fetch(
    process.env.NEXT_PUBLIC_APP_URL + "/api/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryId: category.entityId }),
    }
  );

  const productData = await productResponse.json();
  //console.log(productData)

  // Check if there were any errors during the fetch
  if (productData.errors) {
    return {
      props: { category },
    };
  }

  return {
    props: { category, initialProducts: productData.products },
  };
}
