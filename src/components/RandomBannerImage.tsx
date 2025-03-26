import Image from "next/image";
import React, { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1610018556010-6a11691bc905?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611077544917-1c6ab938e2f8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1200&auto=format&fit=crop"
];

export default function RandomBannerImage() {
  const [currentImage, setCurrentImage] = useState("");
  
  useEffect(() => {
    // Função para escolher uma imagem aleatória
    const selectRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImage(images[randomIndex]);
    };

    // Verificar a data atual e comparar com a última atualização
    const checkAndUpdateImage = () => {
      const lastUpdate = localStorage.getItem("lastImageUpdate");
      const now = new Date().toDateString();
      
      if (lastUpdate !== now) {
        // Se for um novo dia, atualizar a imagem
        selectRandomImage();
        localStorage.setItem("lastImageUpdate", now);
      } else {
        // Se for o mesmo dia, usar a imagem salva ou escolher uma nova
        const savedImage = localStorage.getItem("currentBannerImage");
        if (savedImage && images.includes(savedImage)) {
          setCurrentImage(savedImage);
        } else {
          selectRandomImage();
        }
      }
    };
    
    checkAndUpdateImage();
    
    // Salvar a imagem atual no localStorage quando mudar
    if (currentImage) {
      localStorage.setItem("currentBannerImage", currentImage);
    }
    
    // Configurar um temporizador para verificar a cada hora
    const intervalId = setInterval(checkAndUpdateImage, 3600000); // 1 hora
    
    return () => clearInterval(intervalId);
  }, [currentImage]);
  
  if (!currentImage) return null;
  
  return (
    <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-xl mb-6">
      <Image 
        src={currentImage} 
        alt="Banner de busca" 
        className="w-full h-full object-cover transition-opacity duration-500"
      />
    </div>
  );
}