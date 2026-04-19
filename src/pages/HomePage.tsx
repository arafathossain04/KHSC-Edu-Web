import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import HomeOverview from '../components/home/HomeOverview';
import ReviewSection from '../components/home/ReviewSection';
import DocumentarySection from '../components/home/DocumentarySection';
import MapSection from '../components/home/MapSection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <HomeOverview />
      <ReviewSection />
      <DocumentarySection />
      <MapSection />
    </main>
  );
}
