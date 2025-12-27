import Link from "next/link";
import { Service } from "@/src/types";
import { Card } from "@/src/components/ui/Card";
import { Clock, MapPin } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.$id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex flex-col h-full">
          {/* Service Image Placeholder */}
          <div className="w-full h-48 bg-linear-to-r from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-4xl">🔧</span>
          </div>

          {/* Service Info */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {service.title}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                by {service.providerName}
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{service.price}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
              {service.category}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
