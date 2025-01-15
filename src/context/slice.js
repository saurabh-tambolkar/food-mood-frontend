// import { createSlice } from "@reduxjs/toolkit";

// const cartInLocalStorage = JSON.parse(localStorage.getItem("cartFoodMood")) || []

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: cartInLocalStorage,
//   reducers: {
//     addProduct(state, action) {
//       const existingProduct = state.find((product) => product.id === action.payload.id && product.size === action.payload.size);
//       if(existingProduct){
//         existingProduct.quantity += action.payload.quantity;
//         existingProduct.price +=action.payload.price
//       } 
//       else{
//         state.push({
//           ...action.payload,
//           quantity: action.payload.quantity || 1,
//         }); 
//       }
//       localStorage.setItem("cartFoodMood",JSON.stringify(state))
//     },
//     removeProduct(state, action) {
//       const existingProduct = state.find(
//         (product) => product.id === action.payload.id && product.size === action.payload.size
//       );
    
//       if (existingProduct) {
//         existingProduct.quantity -= action.payload.quantity;
//         existingProduct.price -= action.payload.price;
    
//         // If quantity drops to 0 or below, remove the product from the cart
//         if (existingProduct.quantity <= 0) {
//           const index = state.indexOf(existingProduct);
//           if (index !== -1) {
//             state.splice(index, 1);
//           }
//         }
//         localStorage.setItem("cartFoodMood", JSON.stringify(state));
//       }
//     },        
//     updateItem: (state, action) => {
//         const item = state.find((food) => food.id === action.payload.id);
//         if (item) {
//           item.quantity += parseInt(action.payload.quantity);
//           item.price += action.payload.price;
//         }
//     },
//     dropCart:()=>{
//       localStorage.removeItem("cartFoodMood");
//         return []
//     }
//   },
// });

// export const {addProduct,removeProduct,updateProduct,dropCart} = cartSlice.actions;

// export default cartSlice.reducer    ;
