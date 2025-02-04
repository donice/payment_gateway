
import GateWayModule from '@/components/GateWayModule';
import React from 'react';

type Props = {
  params: {
    payment_ref: string;
    merchant_key: string;
  };
};

const GateWayPage = ({ params }: Props) => {
  
  return (
    <div>
      <GateWayModule payment_ref={params.payment_ref} merchant_key={params.merchant_key} />
    </div>
  );
};

export default GateWayPage;
