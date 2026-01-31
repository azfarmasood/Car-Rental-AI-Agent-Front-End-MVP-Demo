import { Car } from "../lib/api";
import { Fuel, Gauge, Check } from "lucide-react";
import { cn } from "../lib/utils";
import Image from "next/image";

interface CarCardProps {
  car: Car;
  onBook: (car: Car) => void;
  onChat: (car: Car) => void;
}

export default function CarCard({ car, onBook, onChat }: CarCardProps) {
  // Mock images based on car name for demo
  const getImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("tesla"))
      return "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    if (n.includes("bmw"))
      return "https://images.unsplash.com/photo-1555215695-3004980adade?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    if (n.includes("mercedes"))
      return "https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    if (n.includes("toyota"))
      return "https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    if (n.includes("honda"))
      return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    if (n.includes("ford"))
      return "https://images.unsplash.com/photo-1551830524-07934d2c25fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    return "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getImage(car.name)}
          alt={car.name}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
          {car.category}
        </div>
      </div>

      <div className="p-5 grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
            {car.name}
          </h3>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              ${car.daily_rate}
            </p>
            <p className="text-xs text-gray-500">/day</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Fuel className="w-4 h-4 mr-1 text-gray-400" />
            {car.fuel_type}
          </div>
          {/* Mock mileage/transmission for UI completeness if not in API */}
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-1 text-gray-400" />
            Auto
          </div>
        </div>

        <div className="grow">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Features
          </h4>
          <ul className="text-sm space-y-1 mb-4">
            {car.features.slice(0, 3).map((f, i) => (
              <li
                key={i}
                className="flex items-center text-gray-600 dark:text-gray-400"
              >
                <Check className="w-3 h-3 mr-2 text-green-500" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => onChat(car)}
            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors text-sm"
          >
            Ask Agent
          </button>
          <button
            onClick={() => onBook(car)}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm text-white shadow-md",
              car.available
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                : "bg-gray-400 cursor-not-allowed",
            )}
            disabled={!car.available}
          >
            {car.available ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}
