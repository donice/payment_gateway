"use client";
import { gatewayArr } from "@/lib/gatewayArr";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

declare global {
  interface Window {
    MonnifySDK?: any;
    RmPaymentEngine?: any;
    webpayCheckout?: any;
  }
}

const GateWayModule = ({ payment_ref }: { payment_ref: string }) => {
  const paymentRef = payment_ref;
  const [data, setData] = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState<any>(null);

  const mutateGetPaymentDetails = useMutation({
    mutationKey: ["getPaymentDetails", paymentRef],
    mutationFn: () => {
      return axiosInstance.post(`/payment/payment-ref`, {
        payment_ref: paymentRef,
      });
      // return axiosInstance.post(`/merchant/fetch-merchant-data`, {
      //   merchant_key: paymentRef,
      // });
    },

    onSuccess: (data) => {
      const res = data.data;
      if (res.response_code == "00") {
        setData(res);
      }
    },
  });

  useEffect(() => {
    mutateGetPaymentDetails.mutate();
  }, []);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(); 
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  };

  const onSubmit = () => {
    if (!selectedGateway) {
      alert("Please select a payment gateway");
      return;
    }
    const payFunction = gatewayFunctions[selectedGateway];
    if (payFunction) {
      payFunction();
    } else {
      console.error("Payment gateway does not exist");
    }
  };

  const payWithRemita = async () => {
    await loadScript("https://remitademo.net/payment/v1/remita-pay-inline.bundle.js");
    console.log("Paying with Remita (implement SDK or API logic here)");
    const paymentEngine = window.RmPaymentEngine.init({
      key:process.env.NEXT_PUBLIC_REMITA_KEY,
      transactionId: Math.floor(Math.random()*1101233), 
      customerId: '39832',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mailinator.com',
      amount: 15000,
      narration: 'Essential Walking Shoes',
      onSuccess: function (response:any) {
          console.log('callback Successful Response', response);
      },
      onError: function (response:any) {
          console.log('callback Error Response', response);
      },
      onClose: function () {
          console.log("closed");
      }
  });
   paymentEngine.showPaymentWidget();
  };

  const payWithMonnify = async() => {
    await loadScript("https://sdk.monnify.com/plugin/monnify.js");
    console.log("paying with monnify");
    if (window.MonnifySDK) {
      window.MonnifySDK.initialize({
        amount: 100,
        currency: "NGN",
        reference: new String(new Date().getTime()),
        customerFullName: "Shukuralillahi bakare",
        customerEmail: "shuksbakare@gmail.com",
        apiKey: "MK_TEST_RJ7QWQLJWT",
        contractCode: "3590090140",
        isTestMode: true,
        paymentDescription: "Lahray World",
        metadata: {
          name: "Damilare",
          age: 45,
        },
      
        onLoadStart: () => {
          console.log("loading has started")
        },
        onLoadComplete: () => {
          console.log("SDK is UP")
        },
        onComplete: function (response:any) {
          //Implement what happens when the transaction is completed.
          console.log(response)
        },
        onClose: function (data:any) {
          //Implement what should happen when the modal is closed here
          console.log(data)
        },
      })
    } else {
      console.error("Monnify SDK not loaded");
    }
  };

  const paywithInterswitch = async() => {
    await loadScript("https://newwebpay.qa.interswitchng.com/inline-checkout.js")

    const paymentCallback = (response:any) => {
      console.log('Payment Response:', response);
      alert(`Payment ${response.responseCode === '00' ? 'successful' : 'failed'}. Check the console for details.`);
    }
    let samplePaymentRequest = {
      merchant_code: process.env.NEXT_PUBLIC_INTERSWITCH_MERCHANT_CODE,
      pay_item_id: "Default_Payable_MX19329",
      txn_ref: `txn_${Date.now()}`,
      amount: 100,
      currency: 566, // ISO 4217 numeric code of the currency used
      onComplete: paymentCallback,
      site_redirect_url: "http://localhost:3000/complete",
      mode: "TEST",
    };

    window.webpayCheckout(samplePaymentRequest);
  }

  const gatewayFunctions: { [key: string]: () => void } = {
    Monnify: payWithMonnify,
    Remita: payWithRemita,
    Interswitch: paywithInterswitch
  };


  return (
    <section className="flex flex-col items-center justify-center h-screen p-4 md:p-0">
      <div className="grid gap-4 border-2 border-gray-100 w-full max-w-2xl p-4 md:p-8 rounded-xl shadow-2xl">
        <Header data={data} />

        <div className="grid gap-4">
          <div>
            <p className="text-xs md:text-md uppercase font-semibold text-gray-400">
              Select Gateway
            </p>
          </div>

          <div className="grid gap-4">
            {gatewayArr.map((gateway) => (
              <div
                key={gateway.id}
                className="w-full p-4 border rounded-xl group hover:bg-green-700 ease-linear transition duration-300"
                onClick={() => setSelectedGateway(gateway.name)}
              >
                <a
                  // href={gateway.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-5 group-hover:text-white"
                >
                  <div className="bg-yellow-50 rounded-lg p-3 md:p-4">
                    <img
                      src={gateway.image}
                      alt={gateway.name}
                      className="h-6 w-6 md:h-12 md:w-12"
                    />
                  </div>
                  <p className="text-sm md:text-2xl font-semibold">
                    Pay with {gateway.name}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onSubmit} className="w-full bg-green-500 text-white py-4 md:py-5 rounded-xl text-sm md:text-2xl font-semibold  transition duration-300 hover:bg-green-800 ease-linear">
          Make Payment
        </button>
      </div>
    </section>
  );
};

export default GateWayModule;
