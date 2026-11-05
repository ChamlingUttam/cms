import Image from "next/image";

interface CampusPhotoProps {
  image: { src: string; alt: string };
  badge: { value: string; label: string };
}

export function CampusPhoto({ image, badge }: CampusPhotoProps) {
  return (
    <div className="relative h-[420px] md:h-[570px]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="bg-gold absolute right-0 -bottom-[45px] z-10 flex h-[180px] w-[190px] flex-col justify-center p-[30px] md:right-[6%] md:w-[230px] md:p-[35px]">
        <b className="font-serif text-[40px] leading-none font-medium italic md:text-5xl">
          {badge.value}
        </b>
        <span className="mt-2 text-xs leading-normal font-semibold">
          {badge.label}
        </span>
      </div>
    </div>
  );
}
