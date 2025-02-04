import React from "react";

const Header = ({ data }: { data: any }) => {
  return (
    <header className="grid gap-4 py-10">
      {" "}
      <div className="w-full text-left flex items-center gap-8">
        {/* <div className="flex items-center gap-4 w-16 h-16 md:w-24 md:h-24 bg-slate-100 rounded-full relative">
          <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
            <img src="https://abiapay.com/images/landing/Logo.svg" alt="" />
          </div>
        </div> */}
        <div>
          <p className="text-gray-400 text-sm md:text-lg ">{data?.taxpayer_phone ?? ""}</p>
          <h2 className="text-xl md:text-3xl text-gray-800 font-bold">
            {data?.taxpayer_name ?? ""}
          </h2>
        </div>
      </div>
      <div className="border-y-2 border-gray-100 p-4">
        <p className="text-xs md:text-md uppercase font-semibold text-gray-400">Payment Details</p>
        <div className="text-sm md:text-xl grid text-gray-500 gap-2">
          <p className="flex justify-between text-left">
            Amount:{" "}
            <span className="text-gray-900 font-semibold">₦{data?.amount}</span>
          </p>
          <p className="flex justify-between text-left">
            Payment Ref:{" "}
            <span className="text-gray-900 font-semibold">
              {data?.merchant_reference ?? ""}
            </span>
          </p>
          <p className="flex justify-between text-left">
            Revenue Item:
            <span className="text-gray-900 font-semibold max-w-96 text-right">
              {data?.revenue_item ?? ""}
            </span>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
