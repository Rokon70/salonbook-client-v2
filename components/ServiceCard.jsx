import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import ServiceMedia from "@/components/ServiceMedia";
import { money } from "@/lib/utils";

export default function ServiceCard({ service }) {
  return (
    <article className="card-hover group flex flex-col overflow-hidden">
      <ServiceMedia service={service} category={service.category} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-berry-700">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">{service.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-berry-50 pt-4">
          <span className="font-display text-2xl font-semibold text-berry-700">{money(service.price)}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-ink-soft">
            <Clock className="h-3.5 w-3.5 text-berry-500" />{service.duration} min
          </span>
        </div>
        <Link href={`/services/${service._id}`}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-berry-50 py-2.5 text-sm font-semibold text-berry-700 transition-all group-hover:bg-berry-600 group-hover:text-white">
          View details <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
