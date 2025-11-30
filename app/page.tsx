import HomeClient from '@/components/HomeClient';
import { Library } from '@/types';
import { headers } from 'next/headers';

async function getLibraries(): Promise<Library[]> {
  try {
    const host = (await headers()).get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const res = await fetch(`${protocol}://${host}/api/libraries`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch libraries:', error);
    return [];
  }
}

export default async function Home() {
  const libraries = await getLibraries();

  return <HomeClient initialLibraries={libraries} />;
}
