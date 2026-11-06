// import { images } from "@/data/images";
// import type { Blog } from "@/types";

// /**
//  * DUMMY CONTENT. Shown only in development (or when SHOW_DUMMY_CONTENT=true)
//  * while the admin dashboard has no blogs or the API is unreachable.
//  * Real blogs replace these as soon as one exists.
//  */
// export const dummyBlogs: Blog[] = [
//   {
//     id: "dummy-blog-1",
//     name: "Helping children fall in love with reading",
//     slug: "helping-children-fall-in-love-with-reading",
//     shortDescription:
//       "Simple, joyful habits that turn reluctant readers into curious, confident ones, at school and at home.",
//     longDescription:
//       "Children rarely fall in love with reading because they are told to. They fall in love when a story makes them laugh, wonder or feel understood. Our teachers start there: with the story first and the skills close behind.\n\nReading aloud works at every age, not just in the early years. Ten relaxed minutes together, with voices and pauses and questions, shows children that books are something to enjoy.\n\nComics, football biographies and fantasy series all count. Choice builds ownership, and ownership builds the habit. Once a child is reading often, we can gently widen the shelf.",
//     imageUrl: images.about.src,
//     srcSet: null,
//     createdAt: "2026-10-14T00:00:00.000Z",
//     updatedAt: "2026-10-14T00:00:00.000Z",
//   },
//   {
//     id: "dummy-blog-2",
//     name: "What small classes make possible",
//     slug: "what-small-classes-make-possible",
//     shortDescription:
//       "With an average of 18 students per class, teachers can notice, ask and adjust. Here is what that looks like in practice.",
//     longDescription:
//       "A small class is more than a smaller headcount. It changes what a teacher can see: who is quietly puzzled, who is ready for a harder problem, and who simply needs a moment of encouragement.\n\nWhen teachers can talk with every student during a lesson, feedback happens while it still matters. Misunderstandings are fixed early instead of growing into gaps.\n\nIn a class of eighteen, nobody can hide and nobody gets lost. Quieter students learn to speak up, and confident students learn to listen.",
//     imageUrl: images.classroom.src,
//     srcSet: null,
//     createdAt: "2026-09-29T00:00:00.000Z",
//     updatedAt: "2026-09-29T00:00:00.000Z",
//   },
//   {
//     id: "dummy-blog-3",
//     name: "Preparing for your first school tour",
//     slug: "preparing-for-your-first-school-tour",
//     shortDescription:
//       "What to look for, what to ask, and how to see beyond the brochure when you visit a school with your child.",
//     longDescription:
//       "A tour is the best way to find out whether a school feels right for your family. A little preparation helps you get far more from the visit.\n\nWatch the students. How do they speak to teachers and to each other? Do they look engaged? The atmosphere in the corridors says a lot about a school's culture.\n\nAsk about class sizes, how teachers support different learners, how the school communicates with families, and what a typical day looks like. Bring your child if you can.",
//     imageUrl: images.student.src,
//     srcSet: null,
//     createdAt: "2026-09-12T00:00:00.000Z",
//     updatedAt: "2026-09-12T00:00:00.000Z",
//   },
//   {
//     id: "dummy-blog-4",
//     name: "Why we teach through inquiry",
//     slug: "why-we-teach-through-inquiry",
//     shortDescription:
//       "Questions first, answers second: how inquiry-led learning builds deeper understanding and lasting curiosity.",
//     longDescription:
//       "Inquiry-led learning starts with a question worth exploring. Students investigate, test ideas, make mistakes and refine their thinking, with teachers guiding rather than simply telling.\n\nWhen students work out an idea for themselves, they remember it and can apply it in new situations. That is the difference between knowing a fact and understanding a concept.\n\nInquiry builds the habits that last beyond school: asking good questions, weighing evidence, working with others and staying with a hard problem.",
//     imageUrl: images.hero.src,
//     srcSet: null,
//     createdAt: "2026-08-25T00:00:00.000Z",
//     updatedAt: "2026-08-25T00:00:00.000Z",
//   },
// ];

import { images } from "@/data/images";
import type { Blog } from "@/types";

/**
 * DUMMY CONTENT. Shown only in development (or when SHOW_DUMMY_CONTENT=true)
 * while the admin dashboard has no blogs or the API is unreachable.
 * Real blogs replace these as soon as one exists.
 */
export const dummyBlogs: Blog[] = [
  {
    id: "dummy-blog-1",
    name: "Helping children fall in love with reading",
    slug: "helping-children-fall-in-love-with-reading",
    shortDescription:
      "Simple, joyful habits that turn reluctant readers into curious, confident ones, at school and at home.",
    longDescription:
      "Children rarely fall in love with reading because they are told to. They fall in love when a story makes them laugh, wonder or feel understood. Our teachers start there: with the story first and the skills close behind.\n\nReading aloud works at every age, not just in the early years. Ten relaxed minutes together, with voices and pauses and questions, shows children that books are something to enjoy.\n\nComics, football biographies and fantasy series all count. Choice builds ownership, and ownership builds the habit. Once a child is reading often, we can gently widen the shelf.",
    imageUrl: images.about.src,
    srcSet: null,
    createdAt: "2026-10-14T00:00:00.000Z",
    updatedAt: "2026-10-14T00:00:00.000Z",
  },
  {
    id: "dummy-blog-2",
    name: "What small classes make possible",
    slug: "what-small-classes-make-possible",
    shortDescription:
      "With an average of 18 students per class, teachers can notice, ask and adjust. Here is what that looks like in practice.",
    longDescription:
      "A small class is more than a smaller headcount. It changes what a teacher can see: who is quietly puzzled, who is ready for a harder problem, and who simply needs a moment of encouragement.\n\nWhen teachers can talk with every student during a lesson, feedback happens while it still matters. Misunderstandings are fixed early instead of growing into gaps.\n\nIn a class of eighteen, nobody can hide and nobody gets lost. Quieter students learn to speak up, and confident students learn to listen.",
    imageUrl: images.classroom.src,
    srcSet: null,
    createdAt: "2026-09-29T00:00:00.000Z",
    updatedAt: "2026-09-29T00:00:00.000Z",
  },
  {
    id: "dummy-blog-3",
    name: "Preparing for your first school tour",
    slug: "preparing-for-your-first-school-tour",
    shortDescription:
      "What to look for, what to ask, and how to see beyond the brochure when you visit a school with your child.",
    longDescription:
      "A tour is the best way to find out whether a school feels right for your family. A little preparation helps you get far more from the visit.\n\nWatch the students. How do they speak to teachers and to each other? Do they look engaged? The atmosphere in the corridors says a lot about a school's culture.\n\nAsk about class sizes, how teachers support different learners, how the school communicates with families, and what a typical day looks like. Bring your child if you can.",
    imageUrl: images.student.src,
    srcSet: null,
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
  {
    id: "dummy-blog-4",
    name: "Why we teach through inquiry",
    slug: "why-we-teach-through-inquiry",
    shortDescription:
      "Questions first, answers second: how inquiry-led learning builds deeper understanding and lasting curiosity.",
    longDescription:
      "Inquiry-led learning starts with a question worth exploring. Students investigate, test ideas, make mistakes and refine their thinking, with teachers guiding rather than simply telling.\n\nWhen students work out an idea for themselves, they remember it and can apply it in new situations. That is the difference between knowing a fact and understanding a concept.\n\nInquiry builds the habits that last beyond school: asking good questions, weighing evidence, working with others and staying with a hard problem.",
    imageUrl: images.hero.src,
    srcSet: null,
    createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:00:00.000Z",
  },
];
