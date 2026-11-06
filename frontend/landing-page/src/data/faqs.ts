// import { Faq } from "@/types/content";
// export const dummyFaqs: Faq[] = [
//   {
//     id: "dummy-1",
//     question: "How do I apply?",
//     answer:
//       "Send us an enquiry using the form on this page. Our admissions team will reply with the next steps, key dates and the application form.",
//   },
//   {
//     id: "dummy-3",
//     question: "Can I visit the campus before applying?",
//     answer:
//       "Absolutely. Campus tours run Tuesday through Friday. Choose “Campus tour” in the enquiry form and we will find a time that suits you.",
//   },
//   {
//     id: "dummy-3",
//     question: "When is the admissions office open?",
//     answer:
//       "The admissions office is open Monday–Friday, 8:00am–4:30pm. You can also email us at any time and we will reply during office hours.",
//   },
//   {
//     id: "dummy-4",
//     question: "How quickly will I hear back?",
//     answer:
//       "We aim to reply to every enquiry within two working days. If your question is urgent, call the office during opening hours.",
//   },
// ];

import type { Faq } from "@/types";

/** DUMMY CONTENT: shown only while the admin dashboard has no FAQs (or the API is unreachable). */

export const programFaqs: Faq[] = [
  {
    id: "dummy-program-1",
    question: "What ages does Brightwood teach?",
    answer:
      "We welcome students from ages 5 to 18 across four stages: Early Years (5–7), Primary (8–11), Middle (12–14) and Senior School (15–18).",
  },
  {
    id: "dummy-program-2",
    question: "How large are the classes?",
    answer:
      "Our average class size is 18, with a student–teacher ratio of 12:1, so every teacher knows each learner's strengths and questions.",
  },
  {
    id: "dummy-program-3",
    question: "Can my child join part-way through the school year?",
    answer:
      "Yes, when a place is available. Contact admissions and we will arrange a conversation and a short visit so the move feels comfortable for your child.",
  },
  {
    id: "dummy-program-4",
    question: "Do you offer support for different learning needs?",
    answer:
      "Every student follows an individual learning pathway, supported by specialist teachers and mentors. Tell us about your child's needs when you enquire and we will explain how we can help.",
  },
  {
    id: "dummy-program-5",
    question: "What activities are available outside lessons?",
    answer:
      "Students choose from 32 clubs and activities across arts, sports and STEM, from drama and music to robotics and team sports.",
  },
];

export const contactFaqs: Faq[] = [
  {
    id: "dummy-contact-1",
    question: "How do I apply?",
    answer:
      "Send us an enquiry using the form on this page. Our admissions team will reply with the next steps, key dates and the application form.",
  },
  {
    id: "dummy-contact-2",
    question: "Can I visit the campus before applying?",
    answer:
      "Absolutely. Campus tours run Tuesday through Friday. Choose “Campus tour” in the enquiry form and we will find a time that suits you.",
  },
  {
    id: "dummy-contact-3",
    question: "When is the admissions office open?",
    answer:
      "The admissions office is open Monday–Friday, 8:00am–4:30pm. You can also email us at any time and we will reply during office hours.",
  },
  {
    id: "dummy-contact-4",
    question: "How quickly will I hear back?",
    answer:
      "We aim to reply to every enquiry within two working days. If your question is urgent, call the office during opening hours.",
  },
];
