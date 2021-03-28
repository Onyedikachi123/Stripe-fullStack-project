const cors = require("cors");
const express = require("express");
// add a stripe key
const stripe = require("stripe")(
  "sk_test_51IZaejKX8ZuxVcQeXaX3hwi3iCi6SLFsKRNhtSrT2tjUv7bI4QpSSUB8gqIDYvMsY1DUfYfIAuMXMHIxL9SRCUkz005iDEDPxM"
);
const { uuidv4 } = require("uuidv4");

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("IT WORKS AT LEARNCODEONLINE");
});

app.post("/payment", async (req, res) => {
    console.log("Request:", req.body);
  
    let error;
    let status;
    try {
      const { product, token } = req.body;
  
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });
  
      const idempotency_key = uuidv4;
      const charge = await stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased the ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip
            }
          }
        },
        {
          idempotency_key
        }
      );
      console.log("Charge:", { charge });
      status = "success";
    } catch (error) {
      console.error("Error:", error);
      status = "failure";
    }
  
    res.json({ error, status });
  });
//listen

app.listen(8282, () => console.log("LISTENING AT PORT 8282"));
