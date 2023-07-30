import axios from "axios";

export default async (req, res) => {

  if (req.method === "POST") {
    const { email, password } = req.body;

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.BC_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.GQL_API_Key
      },
      data: JSON.stringify({
        query: `mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              result
              customer {
                entityId
                firstName
                lastName
                email
              }
            }
          }`,
        variables: {
          email,
          password,
        },
      }),
    };

    try {
      console.dir("url:"+ JSON.stringify(config));
      const response = await axios.request(config);
      res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
