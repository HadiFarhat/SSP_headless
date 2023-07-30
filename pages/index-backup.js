import Head from "next/head";
import { useState, useEffect } from "react";
import Header from "../components/header.js";
import { CartProvider } from "../context/CartContext.js";
import CategoryCard from '../components/categoryCard';
import Cookies from 'js-cookie';

export async function getServerSideProps() {
    const companyname = "E-commerce Store";
    
    const response = await fetch(process.env.NEXT_PUBLIC_APP_URL+'/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify()
    });
  
    const initialCategories = await response.json();
  
    return { props: {companyname, initialCategories} };
}

export default function Home({ companyname, initialCategories }) {
  const [customer, setCustomer] = useState(Cookies.get('customer') ? JSON.parse(Cookies.get('customer')) : null);
  const [categories, setCategories] = useState(initialCategories);
  const [customerCategories, setCustomerCategories] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('companyname', companyname);
    }

    const fetchCustomerCategories = async () => {
      if (customer) {
        const categoryResponse = await fetch('/api/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId: customer.entityId }),
        });
    
        const customerSpecificCategories = await categoryResponse.json();
        setCustomerCategories(customerSpecificCategories);
      } else {
        setCustomerCategories(initialCategories);
      }
    };

    fetchCustomerCategories();
  }, [customer]);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ height: "5px" }}></div>

      <CartProvider>
        <Header name={companyname} onUserChange={setCustomer}/>

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
