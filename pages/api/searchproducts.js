import axios from 'axios';

export default async (req, res) => {
  const { categoryId, selectedAttributes } = req.body;
  const width = 50;
  
  // Use reduce to create a map of attributes by facetName
let attributeMap = selectedAttributes.reduce((map, attribute) => {
    if (!map[attribute.facetName]) {
      map[attribute.facetName] = [];
    }
    map[attribute.facetName].push(attribute.attributeValue);
    return map;
  }, {});
  
  // Convert the map to the desired array format
  const productAttributes = Object.keys(attributeMap).map(facetName => ({
    attribute: facetName,
    values: attributeMap[facetName],
  }));
  

  //console.log(productAttributes)

  const query= `
  query SearchCategory($width: Int!, $categoryId: Int!, $productAttributes: [ProductAttributeSearchFilterInput!]!) {
    site {
      search {
        searchProducts(
          filters: {
            categoryEntityId: $categoryId,
            productAttributes: $productAttributes
          }
        ) {
          products {
            edges {
              node {
                id
                entityId
                name
                sku
                path
                variants {
                  edges {
                    node {
                      entityId
                      sku
                      prices {
                        price {
                          currencyCode
                          value
                        }
                      }
                      defaultImage {
                        url(width: $width)
                      }
                      options {
                        edges {
                          node {
                            displayName
                            entityId
                            values {
                              edges {
                                node {
                                  entityId
                                  label
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                prices {
                  price {
                    currencyCode
                    value
                  }
                }
                brand {
                  name
                }
                defaultImage {
                  urlOriginal
                }
              }
            }
          }
        }
      }
    }
  }`;


  const variables = {
    categoryId,
    productAttributes,
    width
  };

  try {
    
    let config = {
        url: process.env.BC_URL, // replace with your GraphQL endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.GQL_API_Key
        },
        data: {
          query,
          variables,
        },
      }
      //console.dir(config, { depth: null })
    const response = await axios(config);

    if (response.status === 200) {
      const products = response.data.data.site.search.searchProducts.products.edges.map(edge => edge.node);
      res.status(200).json({ products });
    } else {
        console.log(error.response.data.errors);
      res.status(500).json({ error: 'An error occurred while fetching products' });
    }
  } catch (error) {
    console.log(error.response.data.errors);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};
