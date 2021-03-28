import React, {useState} from 'react';
import Car from './assets/Car.png';
import './App.css';
import StripeCheckout from "react-stripe-checkout"
import axios from 'axios'
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


toast.configure();

function App() {

const [product, setProduct] = useState({
  name: "Lamborghini",
  price: 605000, 
  productBy: "Lamborghini"
})

async function makePayment(token) {
  const response = await axios.post('http://localhost:8282/payment', {
    token,
    product
  });
  const { status } = response.data
  if (status === 'success') {
    toast('Success! Check emails for details', {
      type: 'success'
    })
  }else {
    toast('Something went wrong', {
      type: 'error'
    })
  }
}

// const makePayment = token => {
//   const body = {
//     token,
//     product
//   }
//   const headers = {
//     "Content-Type": "application/json"
//   }

//   return fetch(`http://localhost:8282/payment`, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(body)
//   }).then(response => {
//     console.log("RESPONSE ", response)
//     const {status} = response;
//     console.log("STATUS", status);
//   })
//   .catch(error => console.log(error));
// }

  return (
    <div className="App">
      <header className="App-header">
      <h4>Lamborghini Car</h4>
      <p>$ {product.price}</p>
        <img src={Car} className="App-car" alt="Car" />
     
       <StripeCheckout 
       stripeKey="pk_test_51IZaejKX8ZuxVcQezudX2esce99F0dC4oMKQfRSrgjEtnDHWTzEgth0Q8I6qt2TI34Q2x0tYlgS0bLYbQg0mwyQl00j9SneiQN"
       token={makePayment}
       name="Lamborghini"
       amount={product.price * 100}
       shippingAddress
       billingAddress
       >
       <button className="btn-large pink">Buy Now for {product.price} $</button>
       </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
