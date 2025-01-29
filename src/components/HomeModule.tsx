"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const HomeModule = () => {
  const router = useRouter()

  useEffect(() => {
    router.back()
  }, [router])

  return (
    <div>HomeModule</div>
  )
}

export default HomeModule