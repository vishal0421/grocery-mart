import api from "./api";

export const paymentService = {

 createPayment:
 async (data)=>{

   const response =
   await api.post(
    "/api/payment/create-payment",
    data
   );

   return response.data;
 }

};