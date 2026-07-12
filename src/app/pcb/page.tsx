import type { Metadata } from 'next';
import PcbClient from './PcbClient';

export const metadata: Metadata = {
  title: 'Custom PCB Design | BitnBolt',
  description:
    'Custom PCB design—schematic, layout, and production-ready files. Clear process, deliverables, and FAQ. Prototype builds optional.',
};

export default function PcbPage() {
  return <PcbClient />;
}
