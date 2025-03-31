"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends Omit<ButtonProps, 'variant'> {
  hoverText?: string;
  variant?: "primary" | "secondary" | "white";
}

export function AnimatedButton({
  children,
  className,
  hoverText,
  variant = "primary",
  ...props
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);
  
  // Effet de particules lors du clic
  useEffect(() => {
    if (isPressed) {
      const newSparkles = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: 1
      }));
      
      setSparkles(newSparkles);
      
      const timer = setTimeout(() => {
        setSparkles([]);
        setIsPressed(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isPressed]);
  
  // Définir les styles en fonction de la variante
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          default: "bg-blue-600 text-white",
          hover: "bg-blue-700 border-blue-300",
          sparkleColor: "bg-blue-200"
        };
      case "secondary":
        return {
          default: "bg-purple-600 text-white",
          hover: "bg-purple-700 border-purple-300",
          sparkleColor: "bg-purple-200"
        };
      case "white":
        return {
          default: "bg-white text-blue-600 border-2 border-blue-100 font-bold",
          hover: "bg-gray-100 text-blue-700 border-2 border-blue-200 font-bold",
          sparkleColor: "bg-blue-100"
        };
      default:
        return {
          default: "bg-blue-600 text-white",
          hover: "bg-blue-700 border-blue-300",
          sparkleColor: "bg-blue-200"
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-md",
        variantStyles.default,
        isHovered ? variantStyles.hover : "",
        "font-bold px-6 py-3 rounded-lg",
        isPressed ? "scale-95" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      <div className="relative z-10">
        <span className={cn(
          "block transition-all duration-300",
          isHovered && hoverText ? "transform -translate-y-10 opacity-0" : "transform translate-y-0 opacity-100"
        )}>
          {children}
        </span>
        
        {hoverText && (
          <span className={cn(
            "absolute top-0 left-0 right-0 transition-all duration-300",
            isHovered ? "transform translate-y-0 opacity-100" : "transform translate-y-10 opacity-0"
          )}>
            {hoverText}
          </span>
        )}
      </div>
      
      {/* Effet de brillance */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-opacity duration-300",
        isHovered ? "opacity-10" : ""
      )}></div>
      
      {/* Effet de particules */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={cn("absolute rounded-full animate-ping", variantStyles.sparkleColor)}
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            opacity: sparkle.opacity,
          }}
        />
      ))}
    </Button>
  );
}
