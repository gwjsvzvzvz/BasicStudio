
import React, { useState, useEffect, useCallback } from 'react';
import { ForumCategory, ForumPost } from '../types';
import { generateJsonContent } from '../services/geminiService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { FORUM_CATEGORIES, CommunityIcon } from '../constants'; // Explicit import
import Button from '../components/Button';

const CommunityPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(FORUM_CATEGORIES[0] || null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostsForCategory = useCallback(async (category: ForumCategory | null) => {
    if (!category) return;
    setIsLoadingPosts(true);
    setError(null);
    const prompt = `Generate 4 engaging forum post titles and one-sentence summaries for a Roblox clicker game community, specifically for the category "${category.name}". Each post should have an id (unique string), title, summary, a fictional author username, a random number of replies (0-100), and views (replies * random(5-20)). Format as a JSON array of objects.`;
    const systemInstruction = "You are an AI that generates fictional forum post data in JSON format. Ensure IDs are unique and data is relevant to the category.";
    
    try {
      const fetchedPosts = await generateJsonContent<ForumPost[]>(prompt, systemInstruction);
      if (fetchedPosts && Array.isArray(fetchedPosts)) {
        setPosts(fetchedPosts.map((p, index) => ({
          ...p, 
          id: p.id || `post-${category.id}-${Date.now()}-${index}`,
          category: category.name
        })));
      } else {
        setError(`Could not fetch posts for ${category.name}. Displaying placeholder info.`);
        setPosts([
          { id: 'ph1', title: `Welcome to ${category.name}!`, summary: 'Introduce yourself and share your thoughts.', category: category.name, author: 'AdminBot', replies: 5, views: 100 },
          { id: 'ph2', title: `Tips for ${category.name}`, summary: 'Share your best tips and tricks here!', category: category.name, author: 'ProPlayer123', replies: 12, views: 250 },
        ]);
      }
    } catch (e) {
      console.error(`Error fetching posts for ${category.name}:`, e);
      setError(`Failed to load posts for ${category.name}.`);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchPostsForCategory(selectedCategory);
    }
  // fetchPostsForCategory is memoized with useCallback, safe to include.
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedCategory, fetchPostsForCategory]);


  return (
    <div className="animate-fadeIn">
      <PageHeader title="Community Hub" subtitle="Connect with fellow players, share ideas, and get help!" icon={<CommunityIcon className="w-10 h-10" />} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Categories Sidebar */}
        <div className="w-full md:w-1/4 bg-surface p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-xl font-semibold mb-4 text-primary">Categories</h2>
          <nav className="space-y-2">
            {FORUM_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory?.id === category.id ? 'primary' : 'ghost'}
                className={`w-full justify-start text-left ${selectedCategory?.id === category.id ? '' : 'text-textSecondary hover:text-textPrimary'}`}
              >
                {/* Fix: Cast category.icon to React.ReactElement<{ className?: string }> to inform TypeScript that className is an acceptable prop. */}
                {category.icon && React.cloneElement(category.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5 mr-2" })}
                {category.name}
              </Button>
            ))}
          </nav>
        </div>

        {/* Posts Display */}
        <div className="w-full md:w-3/4">
          {selectedCategory && (
            <>
              <h2 className="text-2xl font-semibold mb-1 text-secondary">{selectedCategory.name}</h2>
              <p className="text-textSecondary mb-6">{selectedCategory.description}</p>
              
              {isLoadingPosts && <LoadingSpinner text={`Loading posts for ${selectedCategory.name}...`} />}
              {error && <p className="text-center text-red-400 bg-red-900/30 p-3 rounded-md my-4">{error}</p>}
              
              {!isLoadingPosts && !error && posts.length === 0 && (
                 <p className="text-center text-textSecondary py-6">No posts found in this category yet. Why not start a discussion?</p>
              )}

              {!isLoadingPosts && posts.length > 0 && (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} title={post.title} className="hover:shadow-pink-500/30">
                      <p className="text-sm mb-2">{post.summary}</p>
                      <div className="text-xs text-textSecondary flex justify-between items-center">
                        <span>By: {post.author}</span>
                        <div className="flex space-x-3">
                            <span>Replies: {post.replies}</span>
                            <span>Views: {post.views}</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" className="mt-3 w-full md:w-auto">View Thread (Not Implemented)</Button>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
          {!selectedCategory && (
            <p className="text-center text-xl text-textSecondary py-10">Please select a category to view posts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;