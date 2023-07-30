import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const categoryId = req.body.categoryId;

  if (!categoryId) {
    return res.status(400).json({ message: "Category ID is required." });
  }

  const config = {
    method: "post",
    url: process.env.BC_URL,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.GQL_API_Key,
    },
    data: JSON.stringify({
      query: `query Category($entityId: Int!, $width:Int!) {
        site {
          category(entityId: $entityId) {
            id
            entityId
            name
            path
            defaultImage {
              urlOriginal
            }
            description
            breadcrumbs(depth: 1) {
              edges {
                node {
                  name
                }
              }
            }
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
                        prices{price
                          {currencyCode
                          value}}
                        defaultImage {
                          url(width: $width)}
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
            seo {
              metaDescription
              metaKeywords
            }
            defaultProductSort
          }
        }
      }`,
      variables: { entityId: categoryId, width: 50 },
    }),
  };

  try {
    const response = await axios.request(config);
    res.setHeader("Access-Control-Allow-Origin", "*");
    const categoryData = response.data.data.site.category;
    const products = categoryData.products.edges.map((edge) => edge.node);
    res.status(200).json({ category: categoryData, products });
    
  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ message: "Internal server error." });
    console.log(error.response.data);
  }
}
