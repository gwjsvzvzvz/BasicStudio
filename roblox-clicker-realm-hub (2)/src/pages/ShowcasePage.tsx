import React, { useState, useEffect } from 'react';
import { ShowcaseItem } from '../types';
import { generateJsonContent } from '../services/geminiService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { ShowcaseIcon } from '../constants';
import Button from '../components/Button';

const ShowcasePage: React.FC = () => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Art' | 'Model' | 'Script'>('All');

  const itemTypes: ('Art' | 'Model' | 'Script')[] = ['Art', 'Model', 'Script'];

  useEffect(() => {
    const fetchShowcaseItems = async () => {
      setIsLoading(true);
      setError(null);
      // Generate 6 items: 2 art, 2 models, 2 scripts
      const prompts = itemTypes.map(type => 
        `Generate 2 distinct showcase items for a Roblox clicker game of type '${type}'. Each item should have an id (unique string like item-1), title (creative and short), description (1-2 sentences), and author (a fictional username). For 'Art' and 'Model' types, I will provide an image URL externally. Format as a JSON array of objects.`
      ).join('\nThen combine these arrays into a single JSON array of 6 items total.\n');
      
      const systemInstruction = "You are an AI that generates fictional game asset showcases in JSON format. Ensure IDs are unique. Descriptions should be enthusiastic.";

      try {
        const fetchedItems = await generateJsonContent<ShowcaseItem[]>(prompts, systemInstruction);
        if (fetchedItems && Array.isArray(fetchedItems)) {
          setItems(fetchedItems.map((item, index) => ({
            ...item,
            id: item.id || `showcase-${Date.now()}-${index}`,
            imageUrl: `https://picsum.photos/seed/${(item.title || `item${index}`).replace(/\s+/g, '-')}/400/300`, // Make seed URL-friendly
            type: item.type || itemTypes[index % itemTypes.length] 
          })));
        } else {
          setError("Could not fetch showcase items. Displaying placeholders.");
          // Placeholder data
          const placeholderItems: ShowcaseItem[] = [
            { id: 'art-1', title: 'Cosmic Clicker', description: 'My fan art of the legendary Cosmic Clicker item!', imageUrl: 'https://picsum.photos/seed/cosmic-clicker/400/300', type: 'Art', author: 'PixelPainterX' },
            { id: 'model-1', title: 'Dragon Pet Model', description: 'A 3D model of a new dragon pet concept.', imageUrl: 'https://picsum.photos/seed/dragon-pet-model/400/300', type: 'Model', author: '3DMaster' },
            { id: 'script-1', title: 'Auto-Sell Script', description: 'A handy script to auto-sell items when inventory is full.', imageUrl: 'https://picsum.photos/seed/auto-sell-script/400/300', type: 'Script', author: 'CodeWizard' },
            { id: 'art-2', title: 'Galaxy Background', description: 'A cool background for the game lobby.', imageUrl: 'https://picsum.photos/seed/galaxy-background/400/300', type: 'Art', author: 'SpaceArtist' },
          ];
          setItems(placeholderItems);
        }
      } catch (e) {
        console.error("Error processing showcase items:", e);
        setError("Failed to load showcase items. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShowcaseItems();
  }, []);

  const filteredItems = filter === 'All' ? items : items.filter(item => item.type === filter);

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Community Showcase" subtitle="Discover amazing creations from our talented players!" icon={<ShowcaseIcon className="w-10 h-10" />} />

      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {(['All', ...itemTypes] as const).map(type => (
          <Button
            key={type}
            variant={filter === type ? 'primary' : 'ghost'}
            onClick={() => setFilter(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      {isLoading && <LoadingSpinner text="Loading creations..." />}
      {error && <p className="text-center text-red-400 bg-red-900/30 p-3 rounded-md">{error}</p>}
      
      {!isLoading && !error && filteredItems.length === 0 && (
        <p className="text-center text-textSecondary">No items found for this category. Check back soon!</p>
      )}

      {!isLoading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              title={item.title} 
              imageUrl={item.imageUrl} 
              imageAlt={item.title}
              className="flex flex-col" 
            >
              <div className="flex-grow">
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mb-2 ${
                  item.type === 'Art' ? 'bg-pink-600 text-pink-100' : 
                  item.type === 'Model' ? 'bg-blue-600 text-blue-100' : 
                  'bg-green-600 text-green-100'
                }`}>{item.type}</span>
                <p className="text-sm mb-2">{item.description}</p>
              </div>
              {item.author && <p className="text-xs text-textSecondary mt-2">By: {item.author}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowcasePage;