import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";

interface FeatureSplitProps {
  image: { src: string; alt: string };
  badge: { value: string; label: string };
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  highlights: string[];
  cta: { label: string; href: string };
}

export function FeatureSplit({
  image,
  badge,
  eyebrow,
  title,
  accent,
  text,
  highlights,
  cta,
}: FeatureSplitProps) {
  return (
    <section className="grid lg:min-h-[650px] lg:grid-cols-2">
      <div className="relative min-h-[420px] md:min-h-[560px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="bg-gold absolute right-5 bottom-[50px] z-10 flex size-[145px] items-center justify-center gap-2 rounded-full lg:-right-[42px]">
          <b className="text-[46px] leading-none">{badge.value}</b>
          <small className="text-[10px] leading-[1.3] uppercase">
            {badge.label}
          </small>
        </div>
      </div>

      <div className="bg-sand flex flex-col items-start justify-center px-5 py-16 md:px-10 md:py-20 lg:px-[9vw] lg:py-[100px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-[clamp(2.25rem,5vw,4.7rem)]">
          {title} <em className="block">{accent}</em>
        </h2>
        <p className="mt-[30px] mb-[22px] max-w-[520px]">{text}</p>
        <ul className="mb-[30px] grid gap-[11px] text-sm font-semibold">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <Icon name="check" size={18} className="text-[#d89d1d]" />
              {item}
            </li>
          ))}
        </ul>
        <ButtonLink href={cta.href} variant="link" arrow>
          {cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}
