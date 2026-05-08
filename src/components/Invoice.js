import React from "react";

const Invoice = ({ invoiceData }) => {
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md text-gray-800">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold">Invoice</h2>
        <p className="text-sm text-gray-500">Invoice #: {invoiceData.invoiceNumber}</p>
        <p className="text-sm text-gray-500">Date: {invoiceData.date}</p>
      </div>

      {/* Customer Info */}
      {/* <div className="mb-6">
        <p><span className="font-semibold">Customer:</span> {invoiceData.customerName}</p>
        <p><span className="font-semibold">Email:</span> {invoiceData.email}</p>
      </div> */}

      {/* Items */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Items:</h4>
        <ul className="space-y-2">
          {invoiceData.items.map((item, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total and Payment */}
      <div className="text-right mb-4">
        <p className="text-lg font-bold">Total: ₹{invoiceData.total}</p>
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-xs text-gray-500 text-center">
        Thank you for your purchase!
      </div>
    </div>
  );
};

export default Invoice;


// <div className="max-w-2xl mx-auto border p-6 rounded-xl shadow-lg bg-white text-gray-800 font-sans">
//   <div className="flex justify-between items-center mb-6">
//     <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
//     <div>
//       <p className="text-sm">Invoice #: <strong>INV-1001</strong></p>
//       <p className="text-sm">Date: <strong>2025-07-29</strong></p>
//     </div>
//   </div>

//   <div className="mb-6">
//     <h2 className="text-lg font-semibold">Billed To:</h2>
//     <p className="text-sm">Saurabh Tambolkar</p>
//     <p className="text-sm">saurabh@example.com</p>
//     <p className="text-sm">Payment Method: <strong>Credit Card</strong></p>
//   </div>

//   <table className="w-full text-sm mb-6 border-t border-b">
//     <thead>
//       <tr className="text-left border-b">
//         <th className="py-2">Item</th>
//         <th className="py-2">Qty</th>
//         <th className="py-2">Price</th>
//         <th className="py-2 text-right">Total</th>
//       </tr>
//     </thead>
//     <tbody>
//       {[
//         { name: "Veggie Delight Pizza", quantity: 2, price: 299 },
//         { name: "Choco Lava Cake", quantity: 1, price: 129 },
//         { name: "Coca-Cola (500ml)", quantity: 3, price: 50 },
//       ].map((item, idx) => (
//         <tr key={idx} className="border-b">
//           <td className="py-2">{item.name}</td>
//           <td className="py-2">{item.quantity}</td>
//           <td className="py-2">₹{item.price}</td>
//           <td className="py-2 text-right">₹{item.quantity * item.price}</td>
//         </tr>
//       ))}
//     </tbody>
//   </table>

//   <div className="flex justify-end text-sm">
//     <div className="w-1/2">
//       <div className="flex justify-between py-2 border-t">
//         <span className="font-semibold">Subtotal</span>
//         <span>₹876</span>
//       </div>
//       <div className="flex justify-between py-2">
//         <span className="font-semibold">Tax (5%)</span>
//         <span>₹43.80</span>
//       </div>
//       <div className="flex justify-between py-2 border-t font-bold text-gray-900 text-base">
//         <span>Total</span>
//         <span>₹919.80</span>
//       </div>
//     </div>
//   </div>

//   <p className="mt-8 text-xs text-center text-gray-500">
//     Thank you for your order! If you have any questions, contact support@example.com.
//   </p>
// </div>
