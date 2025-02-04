import React from "react";

const Header = ({ data }: { data: any }) => {
  return (
    <header className="grid gap-4 py-4">
      <div className="w-full text-left flex items-start gap-8">
        <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 bg-slate-100 relative">
          <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          <img src="https://abiapay.com/fav.png" alt="Logo" className="w-full h-full object-cover" />
        </div>

      
        <div className="flex flex-col justify-between">
          <div className="mb-2">
            <p className="text-gray-400 text-xs md:text-sm">{data?.taxpayer_phone ?? ""}</p>
            <h2 className="text-sm md:text-xl text-gray-800 font-bold">
              {data?.taxpayer_name ?? ""}
            </h2>
          </div>
          <div className="border-t-2 border-gray-100 pt-2">
            <p className="text-[10px] md:text-xs uppercase font-semibold text-gray-400">Payment Details</p>
            <div className="text-[10px] md:text-sm grid text-gray-500 gap-1">
              <p className="flex justify-between">
                Amount: <span className="text-gray-900 font-semibold">₦{data?.amount}</span>
              </p>
              <p className="flex justify-between">
                Payment Ref: <span className="text-gray-900 font-semibold">{data?.merchant_reference ?? ""}</span>
              </p>
              <p className="flex justify-between">
                Revenue Item: <span className="text-gray-900 font-semibold text-right max-w-96">{data?.revenue_item ?? ""}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;