import Head from "next/head";
import { useEffect, useContext } from "react";
import Header from "../components/header.js";
import { CartProvider } from "../context/CartContext.js";
import CategoryCard from "../components/categoryCard";
import { CustomerContext } from "../context/CustomerContext.js";

export default function Home() {
  const { customer, setCustomer, fetchCustomerCategories, customerCategories } =
    useContext(CustomerContext);
  const companyname = "E-commerce Store";

  const key = customer ? customer.entityId : "initial";

  const handleUserChange = (newCustomer) => {
    setCustomer(newCustomer);
  };

  useEffect(() => {
    fetchCustomerCategories(customer);
  }, [customer]);

  return (
    <div className="container" key={key}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ height: "5px" }}></div>

      <CartProvider>
        <Header name={companyname} onUserChange={handleUserChange} />

        <div style={{ height: "40px" }}></div>

        <main className="row">
          {customerCategories.map((category, index) => (
            <CategoryCard category={category} key={index} />
          ))}
        </main>
      </CartProvider>
    </div>
  );
}
