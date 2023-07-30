import ProductCard from '../../components/productCard';
import Header from "../../components/header.js";
import Filters from "../../components/filters"; 
import { CartProvider } from "../../context/CartContext.js";
import cookie from 'cookie';
import { CustomerContext } from '../../context/CustomerContext';
import { useContext } from 'react';



export default function Category({ category, products }) {
  const { customer, setCustomer } = useContext(CustomerContext);
  //console.log(products)

  if (!products) return `Error!`;
  return (
    <div className="container">
    <CartProvider>
      <Header name="E-commerce Company" onUserChange={setCustomer}/>
    <div>
      <h1>{category.name}</h1>
      <p>{category.path}</p>
      <Filters categoryId={category.entityId}/> 
      <div className="row">
        {products.map((product) => (
          <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={product.id}>
          <ProductCard key={product.id} product={product} />
          </div>
        ))}
    </div>
    </div>

    </CartProvider>
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
      entityId = pathToEntityId["/"+path+"/"];
    }
  }

  if (!entityId) {
    // Handle the case where the entityId is not found
    console.error("EntityId not found for path: " + path);
    return {
      notFound: true
    }
  }

  const category = { name: 'Example Category', path, entityId };

  // Fetch products from the api based on category id
  const productResponse = await fetch(process.env.NEXT_PUBLIC_APP_URL+'/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryId: category.entityId }),
  });

  const productData = await productResponse.json();
  
  // Check if there were any errors during the fetch
  if (productData.errors) {
    return {
      props: { category },
    };
  }
  
  return {
    props: { category, products: productData.products },
  };
}
