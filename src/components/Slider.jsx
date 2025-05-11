import React from "react";

const Slider = () => {
  return (
    <div className="relative w-full max-w-[1440px] mx-auto my-4">
      <div className="aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6] bg-gray-50">
        <img
          src="/images/img1.png"
          alt="Banner"
          width={1920}
          height={1080}
          className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
          sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 1440px"
        />
      </div>
    </div>
  );
};

export default Slider;
