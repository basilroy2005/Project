import { createContext, useEffect, useState } from "react";
export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider =  (props) => {

const [all_product,setAll_Product] = useState([]);
const [cartItems,setCartItems] = useState(getDefaultCart());

useEffect(() => {
  fetch('http://localhost:4000/allproducts')
    .then((response) => response.text())
    .then((text) => {
      if (text) {
        setAll_Product(JSON.parse(text));
      } else {
        setAll_Product([]);
      }
    });

  if (localStorage.getItem('auth-token')) {
    fetch('http://localhost:4000/getcart', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'auth-token': `${localStorage.getItem('auth-token')}`,
        'Content-Type': 'application/json',
      },
      body: "",
    })
      .then((response) => response.text())
      .then((text) => {
        if (text) {
          setCartItems(JSON.parse(text));
        } else {
          setCartItems(getDefaultCart());
        }
      });
  }

  // Poll for product updates every 5 seconds
  const interval = setInterval(() => {
    fetch('http://localhost:4000/allproducts')
      .then((response) => response.json())
      .then((data) => setAll_Product(data));
  }, 5000);

  return () => clearInterval(interval);
}, [])


const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
if(localStorage.getItem('auth-token')){
    fetch('http://localhost:4000/addtocart',{
        method:'POST',
        headers:{
            Accept:'application/form-data',
            'auth-token':`${localStorage.getItem('auth-token')}`,
            'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
    })
    .then((response)=>response.json())
    .then((data)=>console.log(data))
}
}

const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
if(localStorage.getItem('auth-token')){
        fetch('http://localhost:4000/removefromcart',{
        method:'POST',
        headers:{
            Accept:'application/form-data',
            'auth-token':`${localStorage.getItem('auth-token')}`,
            'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
    })
    .then((response)=>response.json())
    .then((data)=>console.log(data))

}


}

const updateProduct = async (updatedProduct) => {
    await fetch('http://localhost:4000/updateproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct)
    });
    // Re-fetch products to update everywhere
    const res = await fetch('http://localhost:4000/allproducts');
    const data = await res.json();
    setAll_Product(data);
  };

const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
        if (cartItems[item] > 0) {
            let itemInfo = all_product.find((product) => product.id === Number(item));
                totalAmount += cartItems[item] * itemInfo.new_price;
            }
            
}
return totalAmount;
        }
    
        const getTotalCartItems = () => {
            let totalItems = 0;
            for (const item in cartItems)
                 {
                if (cartItems[item] > 0) {
                    totalItems += cartItems[item];
                }
            }
            return totalItems;
        }
                                                




const contextValue = {getTotalCartItems,getTotalCartAmount,all_product, cartItems ,addToCart,removeFromCart, updateProduct }



    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};
export default ShopContextProvider;
