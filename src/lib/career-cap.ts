import CareerJob from '@/models/CareerJob';

const CAP_DEFAULTS = {
  title: 'Career Accelerator Program (CAP)',
  slug: 'career-accelerator-program-cap',
  type: 'cap' as const,
  category: 'CAP',
  department: 'Full-Stack IoT',
  location: 'Bengaluru',
  duration: '24 weeks',
  description:
    'Fixed CAP application entry. Program content is displayed on career.bitnbolt.in/cap.',
  responsibilities: [] as string[],
  requirements: [] as string[],
};

/** Find CAP job row used only for applications / open toggle (content is hardcoded on site). */
export async function findCapJobDoc() {
  return (
    (await CareerJob.findOne({ type: 'cap' }).sort({ updatedAt: -1 })) ||
    (await CareerJob.findOne({
      slug: { $in: ['cap', 'career-accelerator-program-cap'] },
    }))
  );
}

/** Ensure a CAP job document exists so applications have a jobId. */
export async function ensureCapJobDoc() {
  let job = await findCapJobDoc();
  if (job) return job;

  job = await CareerJob.create({
    ...CAP_DEFAULTS,
    isPublished: true,
    isOpen: true,
  });
  return job;
}
