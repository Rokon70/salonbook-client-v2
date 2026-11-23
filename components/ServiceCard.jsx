import Link from "next/link";
import { Clock, Scissors } from "lucide-react";
import { money } from "@/lib/utils";

export default function ServiceCard({ service }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-berry-50">
        {service.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.image} alt={service.serviceName} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-berry-300"><Scissors className="h-10 w-10" /></div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-sage-700">{service.category}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-soft">{service.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-display text-xl font-semibold text-berry-700">{money(service.price)}</span>
          <span className="flex items-center gap-1 text-ink-soft"><Clock className="h-4 w-4" />{service.duration} min</span>
        </div>
        <Link href={`/services/${service._id}`} className="btn-primary mt-4">View details</Link>
      </div>
    </article>
  );
}
