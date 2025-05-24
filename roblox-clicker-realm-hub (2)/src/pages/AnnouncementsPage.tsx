
import React, { useState, useEffect } from 'react';
import { Announcement } from '../types';
import { generateJsonContent } from '../services/geminiService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { AnnouncementIcon } from '../constants';

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      setError(null);
      const prompt = `Generate 3 detailed announcements for a Roblox clicker game. Each announcement should have an id (unique string), title, content (2-3 sentences), and date (e.g., "October 26, 2023"). Format as a JSON array of objects.`;
      const systemInstruction = "You are an AI that generates game announcements in JSON format. Ensure the 'id' is a unique string for each announcement (e.g., 'announcement-1', 'announcement-2').";
      
      try {
        const fetchedAnnouncements = await generateJsonContent<Announcement[]>(prompt, systemInstruction);
        if (fetchedAnnouncements && Array.isArray(fetchedAnnouncements)) {
          setAnnouncements(fetchedAnnouncements.map((a, index) => ({...a, id: a.id || `ann-${Date.now()}-${index}`})));
        } else {
          console.warn("Gemini did not return a valid array for announcements. Using placeholder data.");
          setAnnouncements([
            { id: 'fallback-1', title: 'Major Update v2.0 Live!', content: 'Explore new worlds, discover epic pets, and enjoy a revamped UI! This update is packed with features requested by the community.', date: 'November 5, 2023' },
            { id: 'fallback-2', title: 'Weekend Bonus XP Event!', content: 'Get double XP all weekend long! Level up faster and unlock new abilities. Event starts Friday 6 PM PST and ends Sunday 11:59 PM PST.', date: 'November 2, 2023' },
          ]);
          setError("Could not fetch latest announcements. Showing default entries.");
        }
      } catch (e) {
        console.error("Error processing announcements:", e);
        setError("Failed to load announcements. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Latest Announcements" subtitle="Stay updated with the newest game changes and events!" icon={<AnnouncementIcon className="w-10 h-10" />} />
      
      {isLoading && <LoadingSpinner text="Fetching latest news..." />}
      {error && <p className="text-center text-red-400 bg-red-900/30 p-3 rounded-md">{error}</p>}
      
      {!isLoading && !error && announcements.length === 0 && (
        <p className="text-center text-textSecondary">No announcements found at the moment. Check back soon!</p>
      )}

      {!isLoading && announcements.length > 0 && (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} title={announcement.title} className="bg-surface hover:shadow-secondary/50">
              <p className="text-sm text-textSecondary mb-2">{announcement.date}</p>
              <p>{announcement.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
