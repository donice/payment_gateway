import GateWayModule from '@/components/GateWayModule'
import React from 'react'

const GateWayPage = ({ params }: { params: { payment_ref: string } }) => {
  return (
    <div>
      <GateWayModule payment_ref={params.payment_ref}/>
    </div>
  )
}

export default GateWayPage