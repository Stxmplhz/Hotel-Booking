import { SearchBar } from '../components/shared/SearchBar.tsx';
import { SearchResults } from "../components/hotels/SearchResults";

export function Hotels() {
  return (
    <main>
      <SearchBar variant="hotels" />
      <div className="w-full max-w-7xl mx-auto min-h-[90vh]">
        <SearchResults />
      </div>
    </main>
  );
}