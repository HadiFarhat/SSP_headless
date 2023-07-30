import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed.'});
  }

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.BC_URL,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': process.env.GQL_API_Key
    },
    data : JSON.stringify({
      query: `query CategoryTree3LevelsDeep {
        site {
          categoryTree {
            ...CategoryFields
            children {
              ...CategoryFields
              children {
                ...CategoryFields
              }
            }
          }
        }
      }
      
      fragment CategoryFields on CategoryTreeItem {
        name
        path
        entityId
        image{url(width:200)}
      }`,
      variables: {}
    })
  };

  const customerId = req.body.customerId;

  if (customerId) {
    config.headers['x-bc-customer-id'] = customerId;
    config.headers['Authorization'] = process.env.CUSTOMER_IMPERSONATION_TOKEN;
  }

  try {
    const response = await axios.request(config);
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(response.data.data.site.categoryTree);
  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({message: 'Internal server error.'});
    console.log(error.response.data)
  }
}
