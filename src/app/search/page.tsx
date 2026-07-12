import Header from '@/components/Header';
import SearchRouteBridge from '@/components/search/SearchRouteBridge';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ query?: string }>;
};

export default async function ProductSearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialQuery = (params.query || '').trim();

  return (
    <main className="min-h-screen bg-[#0B1C2D]/20">
      <Header forceWhite />
      <SearchRouteBridge initialQuery={initialQuery} />
    </main>
  );
}
