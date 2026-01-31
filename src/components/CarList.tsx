import { Car } from "../lib/api";
import CarCard from "./CarCard";
import { useRef } from "react";

interface CarListProps {
  cars: Car[];
  isLoading: boolean;
  onBook: (car: Car) => void;
  onChat: (car: Car) => void;
}

export default function CarList({
  cars,
  isLoading,
  onBook,
  onChat,
}: CarListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl h-96 shadow-lg animate-pulse"
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full mt-8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="cars"
      className="py-16 bg-gray-50 dark:bg-gray-900/50"
      ref={scrollRef}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center dark:text-white">
          Featured Vehicles
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Explore our premium fleet suited for every journey. Ask our agent for
          specific details or availability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} onBook={onBook} onChat={onChat} />
          ))}
        </div>
      </div>
    </section>
  );
}
