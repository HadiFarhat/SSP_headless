import Head from "next/head";
import { useEffect } from "react";
import { faker } from "@faker-js/faker";
import ProductCard from "../components/productCard.js";
import Header from "../components/header.js";
import { CartProvider } from "../context/CartContext.js";


export async function getServerSideProps() {
  const num = 200;
  const items = 10;
  const companyname = faker.company.name() + "s E-commerce Store";

  const products = Array(num)
    .fill()
    .map(() => ({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      adjective: faker.commerce.productAdjective(),
      material: faker.commerce.productMaterial(),
      description: faker.commerce.productDescription(),
      sku: faker.random.alphaNumeric(15),
    }));

    
  return { props: { products, companyname, items } };
}

export default function Home({ products, companyname }) {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('companyname', companyname);
    }
  }, [companyname]);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ height: "5px" }}></div> {/* Vertical spacer */}
        <CartProvider>
          <Header name={companyname}/>
          <div style={{ height: "40px" }}></div> {/* Vertical spacer */}
          <main className="row">
            {products.map((product, index) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                <ProductCard product={product} />
              </div>
            ))}
          </main>
        </CartProvider>
    </div>
  );
}
