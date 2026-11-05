// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { SectionHeading } from "@/components/ui/SectionHeading";
// import { Section } from "@/components/ui/Section";
// import { initials } from "@/lib/format";
// import type { Testimonial } from "@/types";

// /** Quote cards from families and students (shadcn Card + Avatar). */
// export function Testimonials({
//   testimonials,
// }: {
//   testimonials: Testimonial[];
// }) {
//   return (
//     <Section
//       aria-labelledby="testimonials-heading"
//       className="bg-sand mt-16 md:mt-24 lg:mt-28"
//     >
//       <SectionHeading
//         id="testimonials-heading"
//         eyebrow="Our community"
//         title="In their"
//         accent="own words."
//         stacked={false}
//         className="mb-10 md:mb-14"
//       />
//       <ul className="grid gap-5 md:grid-cols-3">
//         {testimonials.map((item) => (
//           <li key={item.name} className="flex">
//             <Card className="w-full rounded-none shadow-none">
//               <CardContent className="flex-1">
//                 <blockquote className="font-serif text-[1.15rem] leading-[1.6] text-[#113b4d] italic">
//                   “{item.quote}”
//                 </blockquote>
//               </CardContent>
//               <CardFooter className="gap-3">
//                 <Avatar className="size-11">
//                   <AvatarFallback className="bg-gold-soft text-sm font-semibold text-[#153c4d]">
//                     {initials(item.name)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="text-ink text-sm font-semibold">{item.name}</p>
//                   <p className="text-xs">{item.role}</p>
//                 </div>
//               </CardFooter>
//             </Card>
//           </li>
//         ))}
//       </ul>
//     </Section>
//   );
// }

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { initials } from "@/lib/format";
import type { Testimonial } from "@/types/content";

/**
 * Quote cards from families and students (shadcn Card + Avatar).
 * Content comes from the admin dashboard; with none, the section is hidden.
 */
export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <Section
      aria-labelledby="testimonials-heading"
      className="bg-sand mt-16 md:mt-24 lg:mt-28"
    >
      <SectionHeading
        id="testimonials-heading"
        eyebrow="Our community"
        title="In their"
        accent="own words."
        stacked={false}
        className="mb-10 md:mb-14"
      />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <li key={item.id} className="flex">
            <Card className="w-full rounded-none shadow-none">
              <CardContent className="flex-1">
                <blockquote className="font-serif text-[1.15rem] leading-[1.6] whitespace-pre-line text-[#113b4d] italic">
                  “{item.description}”
                </blockquote>
              </CardContent>
              <CardFooter className="gap-3">
                <Avatar className="size-11">
                  {item.imageUrl && (
                    <AvatarImage
                      src={item.imageUrl}
                      srcSet={item.srcSet ?? undefined}
                      sizes="44px"
                      alt=""
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-gold-soft text-sm font-semibold text-[#153c4d]">
                    {initials(item.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-ink text-sm font-semibold">{item.name}</p>
                  {item.profession && (
                    <p className="text-xs">{item.profession}</p>
                  )}
                </div>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
