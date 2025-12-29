import Link from "next/link";
import { Service } from "@/src/types";
import { Clock, MapPin } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.$id}`}>
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all hover:shadow-2xl cursor-pointer h-full flex flex-col">
        {/* Service Image Placeholder */}
        <div className="w-full h-48 bg-linear-to-r from-neutral-800 to-neutral-900 flex items-center justify-center">
          <span className="text-6xl">🔧</span>
        </div>

        {/* Service Info */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              {service.title}
            </h3>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{service.duration} min</span>
              </div>
              {service.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">
                by {service.providerName}
              </span>
              <span className="text-2xl font-bold text-white">
                ₹{service.price}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <span className="inline-block bg-neutral-800/50 text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10">
              {service.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
