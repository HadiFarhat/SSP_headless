import axios from 'axios';

const handler = async (req, res) => {
  const { categoryId } = req.body;

  const query = `
    query ($categoryId: Int!) {
      site {
        search {
          searchProducts(
            filters: {
               categoryEntityId: $categoryId
            }
          ) {
            filters {
              edges {
                node {
                  __typename
                  name
                  ... on ProductAttributeSearchFilter {
                    filterName
                    attributes {
                      edges {
                        node {
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;

  try {
    
    const config = {
        url: process.env.BC_URL,
        method: 'post',
        data: {
          query,
          variables: { categoryId }, // pass categoryId as a variable
        },
        headers: {
          'Authorization': process.env.GQL_API_Key,
          'Content-Type': 'application/json',
        },
      }
    const response = await axios(config);

    if (response.data.errors) {
      return res.status(500).json({ errors: response.data.errors });
    }

    return res.status(200).json({ facets: response.data.data.site.search.searchProducts.filters });
  } catch (error) {
    console.log(error.response.data.errors);
    return res.status(500).json({ error: error.toString() });
  }
}

export default handler;
