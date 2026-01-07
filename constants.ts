import { Subject, Chapter, SubjectId } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: SubjectId.SCIENCE,
    name: 'Science',
    icon: 'Atom',
    color: 'bg-blue-500',
    description: 'Physics, Chemistry, and Biology fundamentals.'
  },
  {
    id: SubjectId.MATHS,
    name: 'Mathematics',
    icon: 'Calculator',
    color: 'bg-emerald-500',
    description: 'Formulas, theorems, and problem-solving.'
  },
  {
    id: SubjectId.SOCIAL_SCIENCE,
    name: 'Social Science',
    icon: 'Globe',
    color: 'bg-amber-500',
    description: 'History, Geography, Civics, and Economics.'
  },
  {
    id: SubjectId.ENGLISH,
    name: 'English',
    icon: 'BookOpen',
    color: 'bg-rose-500',
    description: 'Literature, grammar, and comprehension.'
  }
];

// A curated list of standard Class 10 NCERT Chapters
export const CHAPTERS: Chapter[] = [
  // SCIENCE
  { id: 'sci-01', title: 'Chemical Reactions and Equations', subjectId: SubjectId.SCIENCE },
  { id: 'sci-02', title: 'Acids, Bases and Salts', subjectId: SubjectId.SCIENCE },
  { id: 'sci-03', title: 'Metals and Non-metals', subjectId: SubjectId.SCIENCE },
  { id: 'sci-04', title: 'Carbon and its Compounds', subjectId: SubjectId.SCIENCE },
  { id: 'sci-05', title: 'Life Processes', subjectId: SubjectId.SCIENCE },
  { id: 'sci-06', title: 'Control and Coordination', subjectId: SubjectId.SCIENCE },
  { id: 'sci-07', title: 'How do Organisms Reproduce?', subjectId: SubjectId.SCIENCE },
  { id: 'sci-08', title: 'Heredity', subjectId: SubjectId.SCIENCE },
  { id: 'sci-09', title: 'Light – Reflection and Refraction', subjectId: SubjectId.SCIENCE },
  { id: 'sci-10', title: 'The Human Eye and the Colourful World', subjectId: SubjectId.SCIENCE },
  { id: 'sci-11', title: 'Electricity', subjectId: SubjectId.SCIENCE },
  { id: 'sci-12', title: 'Magnetic Effects of Electric Current', subjectId: SubjectId.SCIENCE },
  { id: 'sci-13', title: 'Our Environment', subjectId: SubjectId.SCIENCE },

  // MATHS
  { id: 'math-01', title: 'Real Numbers', subjectId: SubjectId.MATHS },
  { id: 'math-02', title: 'Polynomials', subjectId: SubjectId.MATHS },
  { id: 'math-03', title: 'Pair of Linear Equations in Two Variables', subjectId: SubjectId.MATHS },
  { id: 'math-04', title: 'Quadratic Equations', subjectId: SubjectId.MATHS },
  { id: 'math-05', title: 'Arithmetic Progressions', subjectId: SubjectId.MATHS },
  { id: 'math-06', title: 'Triangles', subjectId: SubjectId.MATHS },
  { id: 'math-07', title: 'Coordinate Geometry', subjectId: SubjectId.MATHS },
  { id: 'math-08', title: 'Introduction to Trigonometry', subjectId: SubjectId.MATHS },
  { id: 'math-09', title: 'Some Applications of Trigonometry', subjectId: SubjectId.MATHS },
  { id: 'math-10', title: 'Circles', subjectId: SubjectId.MATHS },
  { id: 'math-11', title: 'Areas Related to Circles', subjectId: SubjectId.MATHS },
  { id: 'math-12', title: 'Surface Areas and Volumes', subjectId: SubjectId.MATHS },
  { id: 'math-13', title: 'Statistics', subjectId: SubjectId.MATHS },
  { id: 'math-14', title: 'Probability', subjectId: SubjectId.MATHS },

  // SOCIAL SCIENCE
  { id: 'sst-h-01', title: 'The Rise of Nationalism in Europe', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-h-02', title: 'Nationalism in India', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-h-03', title: 'The Making of a Global World', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-h-04', title: 'The Age of Industrialisation', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-g-01', title: 'Resources and Development', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-g-02', title: 'Forest and Wildlife Resources', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-g-03', title: 'Water Resources', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-g-04', title: 'Agriculture', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-g-05', title: 'Minerals and Energy Resources', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-c-01', title: 'Power Sharing', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-c-02', title: 'Federalism', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-c-03', title: 'Gender, Religion and Caste', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-e-01', title: 'Development', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-e-02', title: 'Sectors of the Indian Economy', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-e-03', title: 'Money and Credit', subjectId: SubjectId.SOCIAL_SCIENCE },
  { id: 'sst-e-04', title: 'Globalisation and the Indian Economy', subjectId: SubjectId.SOCIAL_SCIENCE },

  // ENGLISH
  { id: 'eng-01', title: 'A Letter to God', subjectId: SubjectId.ENGLISH },
  { id: 'eng-02', title: 'Nelson Mandela: Long Walk to Freedom', subjectId: SubjectId.ENGLISH },
  { id: 'eng-03', title: 'Two Stories about Flying', subjectId: SubjectId.ENGLISH },
  { id: 'eng-04', title: 'From the Diary of Anne Frank', subjectId: SubjectId.ENGLISH },
  { id: 'eng-05', title: 'Glimpses of India', subjectId: SubjectId.ENGLISH },
  { id: 'eng-06', title: 'Mijbil the Otter', subjectId: SubjectId.ENGLISH },
  { id: 'eng-07', title: 'Madam Rides the Bus', subjectId: SubjectId.ENGLISH },
  { id: 'eng-08', title: 'The Sermon at Benares', subjectId: SubjectId.ENGLISH },
  { id: 'eng-09', title: 'The Proposal', subjectId: SubjectId.ENGLISH },
];