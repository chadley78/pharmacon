import { Suspense } from 'react'
// import Image from "next/image";
import { HomePage } from './HomePage'

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading homepage...</div>}>
      <HomePage />
    </Suspense>
  )
}
