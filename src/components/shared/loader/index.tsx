"use client";
import { RotatingLines } from "react-loader-spinner";
import React from "react";

export const Loader = () => (
  <div className="loader-div">
    <RotatingLines
      visible={true}
      width="22"
      strokeColor="white"
      strokeWidth="5"
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
    />
  </div>
);
