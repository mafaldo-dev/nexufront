import Image from "next/image";
import React, { useState, useEffect } from "react";
import image1 from "../assets/image1.avif";
import image2 from "../assets/image2.avif";
import image3 from "../assets/image3.avif";
import image4 from "../assets/image4.avif";

const images = [image1, image2, image3, image4];

export default function RandomBannerImage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const selectRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex].src;
    };

    const checkAndUpdateImage = () => {
      const lastUpdate = localStorage.getItem("lastImageUpdate");
      const now = new Date().toDateString();

      if (lastUpdate !== now) {
        const newImage = selectRandomImage();
        setCurrentImage(newImage);
        localStorage.setItem("currentBannerImage", newImage);
        localStorage.setItem("lastImageUpdate", now);
      } else {
        const savedImage = localStorage.getItem("currentBannerImage");
        if (savedImage) {
          setCurrentImage(savedImage);
        } else {
          const newImage = selectRandomImage();
          setCurrentImage(newImage);
          localStorage.setItem("currentBannerImage", newImage);
        }
      }
    };

    checkAndUpdateImage();

    const intervalId = setInterval(checkAndUpdateImage, 3600000); // Verifica a cada hora

    return () => clearInterval(intervalId);
  }, []);

  if (!currentImage) return null;

  return (
    <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-xl mb-6">
      <Image 
        src={currentImage} 
        alt="Banner de busca" 
        width={1920} // Adicione largura
        height={1080} // Adicione altura
        className="w-full h-full object-cover transition-opacity duration-500"
      />
    </div>
  );
}
