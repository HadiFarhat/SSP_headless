import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";


export default function Filters({ categoryId, setProducts, resetFilters }) {
  const [facets, setFacets] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  useEffect(() => {
    const fetchFacets = async () => {
      try {
        const res = await fetch("/api/facets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryId }), // pass categoryId in the body
        });

        const data = await res.json();

        if (res.ok) {
          setFacets(data.facets.edges); // directly access the facets key
        } else {
          console.error(data.errors || data.error);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFacets();
  }, [categoryId]);

  const handleCheck = (facetName, attributeValue) => {
    setSelectedAttributes((prev) => {
      const index = prev.findIndex(
        (item) =>
          item.facetName === facetName && item.attributeValue === attributeValue
      );

      if (index > -1) {
        // Attribute was unselected, remove it from the array
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      } else {
        // Attribute was selected, add it to the array
        return [...prev, { facetName, attributeValue }];
      }
    });
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/searchproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId, selectedAttributes }), // pass selectedAttributes in the body
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data.products)
        setProducts(data.products); // Update the products in the Category component
      } else {
        console.error(data.errors || data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedAttributes.length > 0) {
      fetchProducts();
    }
  }, [selectedAttributes]);

  if (!facets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-between align-items-center py-5">
      <DeleteSweepIcon 
        style={{cursor: "pointer", color: "#333"}} 
        onClick={resetFilters} 
      />

      <div className="d-flex justify-content-end">
        {facets.map((facet, index) => {
          if (facet.node.__typename === "ProductAttributeSearchFilter") {
            return (
              <DropdownButton
                id={`dropdown-basic-button-${index}`}
                title={facet.node.name}
                key={index}
                className="align-self-center ml-3"
              >
                {facet.node.attributes.edges.map((attribute, idx) => (
                  <Dropdown.Item as="div" key={idx}>
                    <Form.Check
                      type="checkbox"
                      id={`checkbox-${index}-${idx}`}
                      label={attribute.node.value}
                      onChange={() =>
                        handleCheck(facet.node.name, attribute.node.value)
                      } // Call handleCheck on change
                    />
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

