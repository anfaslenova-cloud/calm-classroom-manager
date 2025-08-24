import { useEffect, useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Allow fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center gradient-hero transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center text-white animate-splash">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <GraduationCap className="w-16 h-16 mb-2" />
            <BookOpen className="absolute -bottom-2 -right-2 w-8 h-8 text-accent" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-2">
          CLASS TRACK
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 font-medium">
          Professional Classroom Management
        </p>
        
        <div className="mt-8">
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;