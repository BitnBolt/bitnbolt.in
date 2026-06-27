import Footer from '@/components/Footer';
import Header from '@/components/Header';

type AuthPageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AuthPageShell({ children, className = 'min-h-screen bg-gray-100' }: AuthPageShellProps) {
  return (
    <main className={className}>
      <Header forceWhite />
      {children}
      <Footer />
    </main>
  );
}
