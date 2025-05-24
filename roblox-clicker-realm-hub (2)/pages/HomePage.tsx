
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateContent } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
// Fix: Changed NAV_ITEMS to BASE_NAV_ITEMS to match the exported constant name
import { BASE_NAV_ITEMS, HomeIcon } from '../constants'; // Explicit import
import PageHeader from '../components/PageHeader';

const HomePage: React.FC = () => {
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      setIsLoading(true);
      const prompt = "Generate a vibrant and exciting welcome message (2-3 sentences) for 'Clicker Realm Hub', the official community website for a super popular Roblox Clicker Simulator game. Mention exploring updates, sharing creations, and connecting with other players.";
      const message = await generateContent(prompt);
      setWelcomeMessage(message);
      setIsLoading(false);
    };
    fetchWelcomeMessage();
  }, []);

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Welcome to Clicker Realm Hub!" icon={<HomeIcon className="w-10 h-10" />} />

      {isLoading ? (
        <LoadingSpinner text="Crafting your welcome..." />
      ) : (
        <div className="text-center p-8 bg-surface rounded-lg shadow-xl">
          <p className="text-xl md:text-2xl text-textPrimary mb-8 leading-relaxed">{welcomeMessage}</p>
          <div className="flex justify-center">
            <img src={`https://picsum.photos/seed/robloxgame/800/400`} alt="Roblox Game Banner" className="rounded-lg shadow-lg mb-8 max-w-full md:max-w-2xl" />
          </div>
          <p className="text-textSecondary mb-6">
            Dive into the world of your favorite Clicker Simulator! Get the latest news, showcase your amazing in-game creations, 
            and connect with a passionate community of players.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fix: Changed NAV_ITEMS to BASE_NAV_ITEMS to use the correctly imported constant */}
            {BASE_NAV_ITEMS.filter(item => item.path !== '/').map(item => (
              <Link key={item.path} to={item.path}>
                <Button variant="secondary" size="lg" className="w-full transform hover:scale-105">
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;