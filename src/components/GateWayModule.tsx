"use client";
import { gatewayArr } from "@/lib/gatewayArr";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
// import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    MonnifySDK?: any;
    RmPaymentEngine?: any;
    webpayCheckout?: any;
  }
}

const GateWayModule = ({
  payment_ref,
  merchant_key,
}: {
  payment_ref: string;
  merchant_key: string;
}) => {
  console.log(payment_ref, merchant_key);
  const paymentRef = payment_ref;
  const [data, setData] = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState<any>(null);
  const [merchantData, setMerchantData] = useState<any>(null);
  const [merchantVerified, setMerchantVerified] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const router = useRouter();
  const [isPaymentCompleted, setIsPaymentCompleted] = useState<boolean>(false);

  const mutateGenerateAccountNumber = useMutation({
    mutationKey: ["generateAccountNumber", paymentRef],
    mutationFn: () =>
      axiosInstance.post(`/payment/instant-account`, {
        payment_ref: paymentRef,
      }),
    onSuccess: (response) => {
      if (response.data?.response_code === "00") {
        setAccountDetails(response.data);
      } else {
        setErrorMessage("Failed to generate account details. Try again.");
      }
    },
    onError: () => {
      setErrorMessage("Account generation failed. Please try again .");
    },
  });

  const handleTransferPayment = () => {
    setIsTransferModalOpen(true);
    mutateGenerateAccountNumber.mutate();
  };

  const closeModal = () => {
    setIsTransferModalOpen(false);
  };

  const goBack = () => {
    router.back();
  };

  const verifyMerchantKey = useMutation({
    mutationKey: ["verifyMerchantKey", merchant_key],
    mutationFn: () =>
      axiosInstance.post(`/merchant/verify-merchant-key`, {
        merchant_key: merchant_key,
      }),
    onSuccess: (data) => {
      if (data.data.response_code === "00") {
        console.log("merchant data", data.data);
        setMerchantData(data.data.response_data);
        setMerchantVerified(true);
      } else {
        setErrorMessage("Invalid merchant key");
      }
    },
    onError: (error) => {
      setErrorMessage("Merchant key verification failed");
    },
  });

  const { webhook_notification_url, success_url, failure_url } =
    merchantData || {};

  useEffect(() => {
    if (merchant_key) {
      verifyMerchantKey.mutate();
    }
  }, [merchant_key]);

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
      if (res.response_code == "02") {
        setIsPaymentCompleted(true);
        setErrorMessage("Payment has already been made for this reference.");
      }
      if (res.response_code == "01") {
        setErrorMessage("Payment reference not found");
      }
    },
  });

  useEffect(() => {
    verifyMerchantKey.mutate();
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
    if (isPaymentCompleted) {
      alert("Payment has already been made for this reference.");
      return;
    }
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

  const mutateUpdatePaymentStatus = useMutation({
    mutationKey: ["updatePaymentStatus"],
    mutationFn: (statusPayload: any) => {
      return axiosInstance.post(
        `/merchant/update-transaction-status`,
        statusPayload
      );
    },
    onSuccess: (data) => {
      console.log("Payment status updated successfully", data);
    },
    onError: (error) => {
      console.error("Failed to update payment status", error);
    },
  });

  const onGatewaySuccess = (gatewayName: string, response: any) => {
    console.log(`Payment successful for ${gatewayName}`, response);

    const statusPayload = {
      payment_ref: paymentRef,
      transaction_ref: response.transactionReference,
      amount: response.amount || 0 || response.authorizedAmount,
      src: gatewayName,
      merchant_key: merchantData.merchant_key,
      callback_url: "http://localhost:3000/success",
      message: response.message || "Payment completed successfully",
    };

    mutateUpdatePaymentStatus.mutate(statusPayload, {
      onSuccess: () => {
        setIsPaymentCompleted(true);
        console.log("Payment status updated successfully");
      },
    });
  };

  const payWithRemita = async () => {
    await loadScript(
      "https://remitademo.net/payment/v1/remita-pay-inline.bundle.js"
    );
    console.log("Paying with Remita (implement SDK or API logic here)");
    const paymentEngine = window.RmPaymentEngine.init({
      key: process.env.NEXT_PUBLIC_REMITA_KEY,
      transactionId: Math.floor(Math.random() * 1101233),
      customerId: "39832",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@mailinator.com",
      amount: Number(data?.amount),
      narration: "Essential Walking Shoes",
      onSuccess: function (response: any) {
        console.log("callback Successful Response", response);
        onGatewaySuccess("Remita", response);
        window.location.href = success_url;
        // if (response.status === "SUCCESS") {
        //   console.log("monnify", "success");
        //   router.push(`/${paymentRef}/${merchantData.merchant_key}/success`);
        // } else {
        //   console.log("monnify", "failed");
        //   router.push(`/${paymentRef}/${merchantData.merchant_key}/failure`);
        // }
      },
      onError: function (response: any) {
        window.location.href = failure_url;
        console.log("callback Error Response", response);
      },
      onClose: function () {
        console.log("closed");
      },
    });
    paymentEngine.showPaymentWidget();
  };

  const payWithMonnify = async () => {
    await loadScript("https://sdk.monnify.com/plugin/monnify.js");
    console.log("paying with monnify");
    if (window.MonnifySDK) {
      window.MonnifySDK.initialize({
        amount: Number(data?.amount),
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
          console.log("loading has started");
        },
        onLoadComplete: () => {
          console.log("SDK is UP");
        },
        onComplete: function (response: any) {
          console.log("monnify", response);
          onGatewaySuccess("monnify", response);
          if (response.status === "SUCCESS") {
            console.log("monnify", "success");
            router.push(`/${paymentRef}/${merchantData.merchant_key}/success`);
          } else {
            console.log("monnify", "failed");
            router.push(`/${paymentRef}/${merchantData.merchant_key}/failure`);
          }

          if (merchantData.merchant_key == "LFQ6ID8KX3") {
            if (response.status === "SUCCESS") {
              console.log("monnify", "success");
              router.push(
                `/${paymentRef}/${merchantData.merchant_key}/success`
              );
            } else {
              console.log("monnify", "failed");
              router.push(
                `/${paymentRef}/${merchantData.merchant_key}/failure`
              );
            }
          }
        },
        onClose: function (data: any) {
          // history(-1)

          console.log(data);
        },
      });
    } else {
      console.error("Monnify SDK not loaded");
    }
  };

  const paywithInterswitch = async () => {
    await loadScript(
      "https://newwebpay.qa.interswitchng.com/inline-checkout.js"
    );

    const paymentCallback = (response: any) => {
      onGatewaySuccess("Remita", response);
      console.log("Payment Response:", response);
      if (response.responseCode === "00") {
        ("i got here success");
        router.push(`/${paymentRef}/${merchantData.merchant_key}/success`);
        window.location.href = success_url;
      } else {
        ("i got here failed");
        router.push(`/${paymentRef}/${merchantData.merchant_key}/failure`);
        window.location.href = failure_url;
      }

      alert(
        `Payment ${
          response.responseCode === "00" ? "successful" : "failed"
        }. Check the console for details.`
      );
    };
    let samplePaymentRequest = {
      merchant_code: process.env.NEXT_PUBLIC_INTERSWITCH_MERCHANT_CODE,
      pay_item_id: "Default_Payable_MX19329",
      txn_ref: `txn_${Date.now()}`,
      amount: Number(data?.amount) * 100,
      currency: 566, // ISO 4217 numeric code of the currency used
      onComplete: paymentCallback,
      site_redirect_url:
        merchantData?.success_url || "http://localhost:3000/success",
      // Failure URL
      mode: "TEST",
      notification_url: merchantData?.webhook_notification_url,
    };

    window.webpayCheckout(samplePaymentRequest);
  };

  const gatewayFunctions: { [key: string]: () => void } = {
    Monnify: payWithMonnify,
    Remita: payWithRemita,
    Interswitch: paywithInterswitch,
    "Pay with Transfer": handleTransferPayment,
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-4 shadow-lg">
        <div className="flex flex-col">
          <div className="w-full p-4 border-b border-gray-300">
            {isPaymentCompleted ? (
              <>
                <h1 className="text-center text-green-600 font-semibold">
                  Payment Completed
                </h1>
                <p className="text-center text-gray-600 mt-4">
                  Payment has already been successfully completed for this
                  reference.
                </p>
                <button
                  onClick={goBack}
                  className="w-full bg-green-500 text-white py-2 mt-6 hover:bg-green-700 transition"
                >
                  Go Back
                </button>
              </>
            ) : (
              <>
                <h1 className="text-center font-bold text-gray-700 mb-4">
                  {merchantData?.merchant_name}
                </h1>
                <Header data={data} />
                <div className="">
                  {/* <h1 className="text-gray-500 text-xs uppercase bg-white px-3 -mt-4 text-center mb-4">
          Select a Payment Gateway
        </h1> */}
                  <div className="flex flex-col gap-3 mb-3">
                    {gatewayArr.map((gateway) => (
                      <div
                        key={gateway.id}
                        className={`group cursor-pointer flex items-center gap-4 p-3 border shadow-md hover:bg-green-50 transition duration-300 ${
                          selectedGateway === gateway.name
                            ? "border-green-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedGateway(gateway.name)}
                      >
                        <img
                          src={gateway.image}
                          alt={gateway.name}
                          className="w-8 h-8"
                        />
                        <p className="text-sm font-semibold text-gray-500 group-hover:text-gray-900">
                          Pay with {gateway.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  {merchantVerified ? (
                    <button
                      onClick={onSubmit}
                      disabled={!selectedGateway || isPaymentCompleted}
                      className={`w-full bg-green-500 text-white py-3 text-sm font-semibold transition duration-300 ${
                        !selectedGateway || isPaymentCompleted
                          ? "bg-gray-400 cursor-not-allowed"
                          : "hover:bg-green-700"
                      }`}
                    >
                      {isPaymentCompleted
                        ? "Payment Completed"
                        : "Make Payment"}
                    </button>
                  ) : (
                    <div className="text-center text-gray-500">
                      Verifying your merchant key...
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GateWayModule;
