// import Image from "next/image";
import HeroBanner from '@/components/homepage/HeroBanner';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold">Welcome to Pharmacon</h1>
        <p className="mt-4 text-lg text-gray-600">
          Your trusted online pharmacy for prescription and over-the-counter medications.
        </p>
      </div>
    </>
  )
}
