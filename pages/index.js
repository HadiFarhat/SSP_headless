import Head from "next/head";
import { useEffect, useState, useContext } from "react";
import Header from "../components/header.js";
import { CartProvider } from "../context/CartContext.js";
import CategoryCard from "../components/categoryCard";
import { CustomerContext } from "../context/CustomerContext.js";
import client from "./api/contentful.js";

export default function Home() {
  const { customer, setCustomer, fetchCustomerCategories, customerCategories } =
    useContext(CustomerContext);
  const companyname = "Kiosk Web App";

  const [data, setData] = useState(null);

  useEffect(() => {
    client
      .getEntry("7oK63BPfhSDOYGmnX58BIN")
      .then((response) => {
        setData(response.fields);
        console.log(response.fields);
      })
      .catch(console.error);
  }, []);

  const key = customer ? customer.entityId : "initial";

  const handleUserChange = (newCustomer) => {
    setCustomer(newCustomer);
  };

  useEffect(() => {
    fetchCustomerCategories(customer);
  }, [customer]);

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
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <CartProvider>
          <Header name={companyname} onUserChange={handleUserChange} />
          <div style={{ height: "40px" }}></div>
  
          {data && (
            <div>
              <video width="100%" height="auto" autoPlay muted loop>
                <source
                  src={`https:${data.videoEmbed.fields.file.url}`}
                  type="video/mp4"
                />
              </video>
            </div>
          )}
  
          <div style={{ height: "40px" }}></div>
          <h2 style={{ textAlign: "center" }}>Shop Our Categories</h2>
          <div style={{ height: "10px" }}></div>
          <main
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {customerCategories.map((category, index) => (
              <CategoryCard category={category} key={index} />
            ))}
          </main>
        </CartProvider>
      </div>
    </div>
  );
  

}
