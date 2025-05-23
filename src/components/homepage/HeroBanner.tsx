import React from 'react';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="w-full bg-accent-highlight pb-0">
      {/* Inner hero content with bottom rounded corners */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 rounded-b-[40px] pt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
          {/* Left Column */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <div className="text-hero md:text-hero-lg font-extrabold text-primary-base leading-none mb-4">
              Pharmacy Delivered, Fast & Easy
            </div>
            <div className="text-lg md:text-xl leading-relaxed max-w-md text-primary-base/90 mb-6">
              Get your prescriptions and pharmacy essentials delivered right to your doorstep with Medicare Pharmacy. Quick, reliable, and always genuine.
            </div>
            {/* Add CTA and features here */}
          </div>
          {/* Right Column */}
          <div className="flex-1 flex flex-col justify-end items-center min-h-hero md:min-h-hero-lg">
            <Image
              src="https://qitxftuzktzxbkacneve.supabase.co/storage/v1/object/sign/imagery/imagedelivery%201.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2IyMWZiMzgwLWY3MjQtNGYwMy1iOWZmLWQ2ODQwNTM2NzI0OSJ9.eyJ1cmwiOiJpbWFnZXJ5L2ltYWdlZGVsaXZlcnkgMS5wbmciLCJpYXQiOjE3NDc3NTczMjAsImV4cCI6MTc3OTI5MzMyMH0.CelTa5uUBSHTPG2V4GrGHp96zGI8PUtuQqOxzU2gbYs"
              alt="Delivery Person"
              width={320}
              height={480}
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 