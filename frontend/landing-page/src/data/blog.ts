import { images } from "@/data/images";
import type { BlogPost } from "@/types";

/**
 * Sample posts for the template. Replace with your own articles and photos.
 * Newest first. To add a post, add an object here; the page, sitemap entry
 * and structured data are generated automatically.
 */
export const posts: BlogPost[] = [
  {
    slug: "helping-children-fall-in-love-with-reading",
    title: "Helping children fall in love with reading",
    excerpt:
      "Simple, joyful habits that turn reluctant readers into curious, confident ones, at school and at home.",
    date: "2026-10-14",
    category: "Learning",
    author: "Brightwood Learning Team",
    readTime: 4,
    image: images.about,
    body: [
      {
        type: "paragraph",
        text: "Children rarely fall in love with reading because they are told to. They fall in love when a story makes them laugh, wonder or feel understood. Our teachers start there: with the story first and the skills close behind.",
      },
      { type: "heading", text: "Make reading a shared moment" },
      {
        type: "paragraph",
        text: "Reading aloud works at every age, not just in the early years. Ten relaxed minutes together, with voices and pauses and questions, shows children that books are something to enjoy.",
      },
      { type: "heading", text: "Let them choose" },
      {
        type: "paragraph",
        text: "Comics, football biographies and fantasy series all count. Choice builds ownership, and ownership builds the habit. Once a child is reading often, we can gently widen the shelf.",
      },
      {
        type: "paragraph",
        text: "At Brightwood, our learning commons is designed to be a place students want to be: light-filled, quiet and full of invitations to pick something up.",
      },
    ],
  },
  {
    slug: "what-small-classes-make-possible",
    title: "What small classes make possible",
    excerpt:
      "With an average of 18 students per class, teachers can notice, ask and adjust. Here is what that looks like in practice.",
    date: "2026-09-29",
    category: "School life",
    author: "Brightwood Learning Team",
    readTime: 3,
    image: images.classroom,
    body: [
      {
        type: "paragraph",
        text: "A small class is more than a smaller headcount. It changes what a teacher can see: who is quietly puzzled, who is ready for a harder problem, and who simply needs a moment of encouragement.",
      },
      { type: "heading", text: "Feedback that arrives in time" },
      {
        type: "paragraph",
        text: "When teachers can talk with every student during a lesson, feedback happens while it still matters. Misunderstandings are fixed early instead of growing into gaps.",
      },
      { type: "heading", text: "Every voice in the room" },
      {
        type: "paragraph",
        text: "In a class of eighteen, nobody can hide and nobody gets lost. Quieter students learn to speak up, and confident students learn to listen.",
      },
    ],
  },
  {
    slug: "preparing-for-your-first-school-tour",
    title: "Preparing for your first school tour",
    excerpt:
      "What to look for, what to ask, and how to see beyond the brochure when you visit a school with your child.",
    date: "2026-09-12",
    category: "Admissions",
    author: "Admissions Office",
    readTime: 3,
    image: images.student,
    body: [
      {
        type: "paragraph",
        text: "A tour is the best way to find out whether a school feels right for your family. A little preparation helps you get far more from the visit.",
      },
      { type: "heading", text: "Watch the students" },
      {
        type: "paragraph",
        text: "How do students speak to teachers and to each other? Do they look engaged? The atmosphere in the corridors says a lot about a school's culture.",
      },
      { type: "heading", text: "Questions worth asking" },
      {
        type: "paragraph",
        text: "Ask about class sizes, how teachers support different learners, how the school communicates with families, and what a typical day looks like for a child your child's age.",
      },
      {
        type: "paragraph",
        text: "Bring your child if you can. Their reaction to the space often tells you what no list of facts can.",
      },
    ],
  },
  {
    slug: "why-we-teach-through-inquiry",
    title: "Why we teach through inquiry",
    excerpt:
      "Questions first, answers second: how inquiry-led learning builds deeper understanding and lasting curiosity.",
    date: "2026-08-25",
    category: "Learning",
    author: "Brightwood Learning Team",
    readTime: 5,
    image: images.hero,
    body: [
      {
        type: "paragraph",
        text: "Inquiry-led learning starts with a question worth exploring. Students investigate, test ideas, make mistakes and refine their thinking, with teachers guiding rather than simply telling.",
      },
      { type: "heading", text: "Understanding that lasts" },
      {
        type: "paragraph",
        text: "When students work out an idea for themselves, they remember it and can apply it in new situations. That is the difference between knowing a fact and understanding a concept.",
      },
      { type: "heading", text: "Skills for life" },
      {
        type: "paragraph",
        text: "Inquiry builds the habits that last beyond school: asking good questions, weighing evidence, working with others and staying with a hard problem.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, count = 2): BlogPost[] {
  return posts.filter((post) => post.slug !== slug).slice(0, count);
}
