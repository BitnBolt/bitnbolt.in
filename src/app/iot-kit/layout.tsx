import type { Metadata } from 'next';
import { Outfit, Sora } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-iot-kit-display',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-iot-kit-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IoT Development Kit | Learn C & Python on Real Hardware | BitnBolt',
  description:
    'Hands-on IoT Development Kit with ESP32, onboard sensors, OLED, relay, and more. Learn C and Python programming on real hardware — early-bird seats for students.',
  openGraph: {
    title: 'BitnBolt IoT Development Kit',
    description:
      'Build smarter with a complete ESP32 IoT kit. Learn C & Python, prototype faster, and ship real connected projects.',
    url: 'https://bitnbolt.in/iot-kit',
    siteName: 'BitnBolt',
    type: 'website',
  },
};

export default function IotKitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${outfit.variable} ${sora.variable} font-[family-name:var(--font-iot-kit-body)]`}>
      {children}
    </div>
  );
}
