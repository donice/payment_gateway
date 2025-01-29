"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const HomeModule = () => {
  const router = useRouter()
  router.back()
  return (
    <div>HomeModule</div>
  )
}

export default HomeModule