import React from 'react';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-secondary-base to-primary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
        <div className="flex flex-col md:grid md:grid-cols-2 h-full">
          {/* Headline - Above image on mobile, left side on desktop */}
          <div className="md:pt-24 pt-16 order-1 md:order-1">
            <h1 className="text-6xl sm:text-7xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-text-dark leading-[1.1]">
              Your Health.
              <br />
              Your Way.
            </h1>
          </div>

          {/* Image - Below headline on mobile, right side on desktop */}
          <div className="relative flex-1 md:flex-none h-[70vh] md:h-full order-2 md:order-2 flex items-end">
            <Image
              src="https://qitxftuzktzxbkacneve.supabase.co/storage/v1/object/sign/imagery/coupleimage%201.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2IyMWZiMzgwLWY3MjQtNGYwMy1iOWZmLWQ2ODQwNTM2NzI0OSJ9.eyJ1cmwiOiJpbWFnZXJ5L2NvdXBsZWltYWdlIDEucG5nIiwiaWF0IjoxNzQ4MDg3NzQ1LCJleHAiOjE3Nzk2MjM3NDV9.MVKhtvnuXRXISdbe7SxFFiF8XJYPEIT28njvb_1Bs7Y"
              alt="Hero"
              fill
              priority
              className="object-contain object-bottom md:object-right-bottom"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 