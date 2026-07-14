/**
 * Seed hardcoded career.bitnbolt.in roles into MongoDB as CareerJob documents.
 *
 * Usage (from bitnbolt.in):
 *   npm run seed-career-jobs
 *
 * Safe to re-run: upserts by slug.
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

const careerJobSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    type: String,
    category: String,
    department: String,
    location: String,
    description: String,
    responsibilities: [String],
    requirements: [String],
    duration: String,
    stipend: String,
    openings: Number,
    applicationDeadline: Date,
    isPublished: Boolean,
    isOpen: Boolean,
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: 'careerjobs' }
);

const CareerJob =
  mongoose.models.CareerJob || mongoose.model('CareerJob', careerJobSchema);

const now = () => new Date();

const roles = [
  {
    title: 'Embedded Systems Interns (ESI)',
    slug: 'embedded-systems',
    type: 'internship',
    category: 'Embedded Systems',
    department: 'Firmware & Hardware',
    location: 'Bengaluru',
    duration: '3–6 months',
    description:
      'Our Embedded Systems internship is designed for students and early-career engineers who want hands-on experience with microcontrollers, sensors, and real hardware in the lab. You will work alongside firmware and hardware teams on client IoT projects — from driver development to board bring-up.\n\nInterns are assigned to squads based on skills and project needs. You will receive mentorship, structured reviews, and exposure to production-grade development practices used in industrial and smart-device deployments.',
    responsibilities: [
      'Embedded firmware development',
      'Sensor & peripheral driver engineering',
      'Hardware lab bring-up & validation',
      'RTOS integration (FreeRTOS / Zephyr)',
      'Communication protocol implementation',
      'Prototype testing & documentation',
    ],
    requirements: [
      'Interest in embedded engineering and lab hardware work',
      'Academic background in ECE / EEE / related fields preferred',
      'Selection via application, technical assessment, and interview',
    ],
  },
  {
    title: 'Firmware Engineering Interns (FEI)',
    slug: 'firmware',
    type: 'internship',
    category: 'Firmware',
    department: 'Firmware & RTOS',
    location: 'Bengaluru',
    duration: '3–6 months',
    description:
      'Firmware interns at BitnBolt focus on C/C++ development for ARM-based MCUs, protocol stacks, and device lifecycle features such as OTA updates and secure boot paths.\n\nYou will contribute to code that ships on real products — not classroom demos — while learning how firmware teams collaborate with PCB design, cloud, and QA.',
    responsibilities: [
      'Bare-metal & RTOS firmware',
      'MQTT / Modbus / BLE stack work',
      'OTA & device provisioning',
      'Power profiling & optimization',
      'Unit testing for embedded modules',
      'Code review & CI for firmware repos',
    ],
    requirements: [
      'Comfortable with C and basic electronics',
      'Shortlisted candidates complete a coding exercise and technical interview with the firmware lead',
    ],
  },
  {
    title: 'Hardware & PCB Design Interns (HPI)',
    slug: 'hardware-pcb',
    type: 'internship',
    category: 'Hardware & PCB',
    department: 'Hardware Engineering',
    location: 'Bengaluru',
    duration: '3–6 months',
    description:
      'This track is for interns interested in schematic design, PCB layout, DFM, and hardware validation for custom IoT boards and industrial controllers.\n\nYou will support senior hardware engineers on multi-layer designs, component selection, fab coordination, and lab validation using standard test equipment.',
    responsibilities: [
      'Schematic capture & library management',
      'Multi-layer PCB layout',
      'DFM / DFT review support',
      'Prototype assembly coordination',
      'EMI-aware layout practices',
      'Hardware test & defect reporting',
    ],
    requirements: [
      'Portfolio or academic projects involving PCB design strongly preferred',
      'Selection includes a portfolio review and interview with the hardware engineering team',
    ],
  },
  {
    title: 'IoT Platform Engineering Interns (IPI)',
    slug: 'iot-platform',
    type: 'internship',
    category: 'IoT Platform',
    department: 'IoT Platform',
    location: 'Bengaluru',
    duration: '3–6 months',
    description:
      'Platform interns work on device management, telemetry pipelines, alerting, and integrations that connect edge devices to cloud backends for enterprise clients.\n\nIdeal for CS/IT students who enjoy backend systems, APIs, and data — with curiosity about how physical devices interact with software at scale.',
    responsibilities: [
      'REST API & webhook development',
      'Device lifecycle & provisioning tools',
      'Time-series telemetry pipelines',
      'Dashboard & internal tooling',
      'Integration testing & documentation',
      'Cloud IoT services (AWS / Azure)',
    ],
    requirements: [
      'Familiarity with Python or TypeScript and HTTP/MQTT basics expected',
      'Selection includes application review, practical exercise, and interview',
    ],
  },
  {
    title: 'Software Engineering Interns (SEI)',
    slug: 'software',
    type: 'internship',
    category: 'Software',
    department: 'Software',
    location: 'Bengaluru',
    duration: '3–6 months',
    description:
      'Software interns build operator dashboards, customer-facing web applications, and tools that visualize real-time device data for industrial and smart-building use cases.\n\nYou will work with modern React/Next.js stacks, collaborate with backend engineers, and learn how UX decisions affect field operators and client stakeholders.',
    responsibilities: [
      'React / Next.js UI development',
      'Real-time charts & data visualization',
      'API integration & WebSocket clients',
      'Component design & accessibility',
      'Frontend testing & performance',
      'Internal tools & admin panels',
    ],
    requirements: [
      'Work samples or GitHub links preferred',
      'Shortlisted candidates complete a UI or API exercise followed by a team interview',
    ],
  },
  {
    title: 'Graduate Trainee Internship (GTE)',
    slug: 'graduate-trainee',
    type: 'trainee',
    category: 'Graduate Trainees',
    department: 'Engineering',
    location: 'Bengaluru',
    duration: '12 months',
    description:
      'Our Graduate Trainee internship is a structured 12-month program for recent B.Tech graduates in ECE, EEE, or CS with an embedded or IoT focus. Rotations span firmware, hardware lab, and platform teams.\n\nTrainee interns receive dedicated mentorship, technical workshops, and increasing ownership on R&D and client delivery work throughout the program.',
    responsibilities: [
      'Rotational firmware & hardware exposure',
      'Internal R&D project contribution',
      'Structured C / RTOS training',
      'Lab skills & debugging practice',
      'Cross-team design reviews',
      'Client project support (supervised)',
    ],
    requirements: [
      'Open to 2025/2026 graduates',
      'Selection involves application screening, aptitude and technical tests, and panel interviews with engineering and HR',
    ],
  },
  {
    title: 'Career Accelerator Program (CAP)',
    slug: 'cap',
    type: 'cap',
    category: 'CAP',
    department: 'Full-Stack IoT',
    location: 'Bengaluru',
    duration: '24 weeks',
    description:
      'A high-impact Career Accelerator Program (CAP) for IoT Project Development bridges the gap between academic theory and production-grade engineering.\n\nCAP is cohort-based and builds competencies across hardware, low-level programming, cloud architecture, and data visualization — moving from raw components to an enterprise-ready, data-driven ecosystem.',
    responsibilities: [
      'Work through a defined full-stack IoT curriculum with cohort milestones',
      'Contribute to live engineering work across firmware, hardware, cloud, and delivery',
      'Complete a capstone project with documentation and version control',
      'Participate in design reviews and mentor check-ins',
    ],
    requirements: [
      'Recent B.Tech/M.Tech graduates in ECE, EEE, CS, IT, or related fields — or final-year students with strong portfolios',
      'Commitment to a full-time, on-site program in Bengaluru for the cohort duration',
      'Technical evaluation and interviews for shortlisted applicants',
    ],
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let created = 0;
  let updated = 0;

  for (const role of roles) {
    const existing = await CareerJob.findOne({ slug: role.slug });
    const doc = {
      ...role,
      isPublished: true,
      isOpen: true,
      updatedAt: now(),
    };

    if (existing) {
      await CareerJob.updateOne({ _id: existing._id }, { $set: doc });
      updated++;
      console.log(`Updated: ${role.slug}`);
    } else {
      await CareerJob.create({
        ...doc,
        createdAt: now(),
      });
      created++;
      console.log(`Created: ${role.slug}`);
    }
  }

  console.log(`\nDone. Created ${created}, updated ${updated}. Total roles: ${roles.length}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
