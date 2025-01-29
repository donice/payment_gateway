"use client";
import { gatewayArr } from "@/lib/gatewayArr";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const GateWayModule = ({ payment_ref }: { payment_ref: string }) => {
  const paymentRef = payment_ref;
  const [data, setData] = useState<any>(null);

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
              >
                <a
                  href={gateway.url}
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

        <button className="w-full bg-green-500 text-white py-4 md:py-5 rounded-xl text-sm md:text-2xl font-semibold  transition duration-300 hover:bg-green-800 ease-linear">
          Make Payment
        </button>
      </div>
    </section>
  );
};

export default GateWayModule;
