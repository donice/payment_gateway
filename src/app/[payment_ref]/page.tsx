import GateWayModule from '@/components/GateWayModule'
import React from 'react'

const GateWayPage = ({ params }: any) => {
  return (
    <div>
      <GateWayModule payment_ref={params.payment_ref}/>
    </div>
  )
}

export default GateWayPage