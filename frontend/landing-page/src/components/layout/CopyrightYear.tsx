// "use client";

// import { useEffect, useState } from "react";

// export default function CurrentYear() {
//   const [year, setYear] = useState<number | null>(null);

//   useEffect(() => {
//     setYear(new Date().getFullYear());
//   }, []);

//   return <>{year ?? "2026"}</>;
// }

import { cacheLife } from "next/cache";

export async function CopyrightYear() {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}