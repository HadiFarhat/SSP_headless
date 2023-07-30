import { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(Cookies.get('customer') ? JSON.parse(Cookies.get('customer')) : null);
  const [initialCategories, setInitialCategories] = useState(null);
  const [customerCategories, setCustomerCategories] = useState([]);

  const fetchInitialCategories = async () => {
    const response = await fetch('/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify()
    });

    const data = await response.json();
    setInitialCategories(data);
  };

  const fetchCustomerCategories = async (customer) => {
    if (customer) {
      const categoryResponse = await fetch('/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: customer.entityId }),
      });

      const categoryData = await categoryResponse.json();
      setCustomerCategories(categoryData);

      const pathToEntityId = (categoryData || []).reduce((acc, category) => {
        acc[category.path] = category.entityId;
        return acc;
      }, {});

      Cookies.set('pathToEntityId', JSON.stringify(pathToEntityId));
    } else {
      setCustomerCategories(initialCategories || []);

      // In case you want to update the 'pathToEntityId' cookie when there is no customer
      const pathToEntityId = (initialCategories || []).reduce((acc, category) => {
        acc[category.path] = category.entityId;
        return acc;
      }, {});

      Cookies.set('pathToEntityId', JSON.stringify(pathToEntityId));
    }
  };



  useEffect(() => {
    fetchInitialCategories();
  }, []);

  useEffect(() => {
    fetchCustomerCategories(customer);
  }, [customer, initialCategories]);

  return (
    <CustomerContext.Provider value={{ 
      customer, 
      setCustomer, 
      setCustomerCategories, 
      fetchCustomerCategories, 
      initialCategories, 
      customerCategories 
  }}>
      {children}
  </CustomerContext.Provider>
  
  );
};


