
import React from 'react';
import { NavItem, ForumCategory } from './types';

// API_KEY will be injected by Vite from .env files (e.g. VITE_API_KEY)
export const API_KEY = import.meta.env.VITE_API_KEY;

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

// SVG Icons
export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const AnnouncementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 3.071.86 9.403a1.051 1.051 0 000 1.862l9.48 6.333c.25.167.533.25.817.25.283 0 .566-.083.817-.25l9.48-6.333a1.051 1.051 0 000-1.862l-9.48-6.333a1.605 1.605 0 00-1.634 0zM10.34 3.071V15.93L1.86 9.403m8.48 6.529l8.48-5.653-8.48-5.653v11.306z" />
  </svg>
);

export const ShowcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

export const CommunityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.247-3.135A11.952 11.952 0 0112 10.5c-2.796 0-5.403.832-7.604 2.308m15.208-2.308c.396-.082.788-.192 1.174-.337m-14.08 0c.386.145.778.255 1.174.337M3.75 12h-.75A9.75 9.75 0 002.25 21H3.5c1.01 0 1.907-.454 2.5-1.2M21.75 12h.75a9.75 9.75 0 011.5 9h-1.25c-1.01 0-1.907-.454-2.5-1.2M12 15V3.75m0 11.25A2.25 2.25 0 0014.25 12.75 2.25 2.25 0 0012 10.5m0 2.25a2.25 2.25 0 01-2.25-2.25A2.25 2.25 0 0112 10.5m0 0V3.75m0 6.75a2.25 2.25 0 00-2.25 2.25m2.25-2.25a2.25 2.25 0 012.25 2.25M12 3.75a2.25 2.25 0 012.25 2.25m-4.5 0A2.25 2.25 0 0112 3.75m0 0V3m0 .75H9.75m2.25 0h2.25" />
  </svg>
);

export const AdminIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);

export const LoginIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

export const RegisterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>
);

export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m-3-3H9" />
  </svg>
);


export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);


export const BASE_NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
  { name: 'Announcements', path: '/announcements', icon: <AnnouncementIcon className="w-5 h-5 mr-2" /> },
  { name: 'Showcase', path: '/showcase', icon: <ShowcaseIcon className="w-5 h-5 mr-2" /> },
  { name: 'Community', path: '/community', icon: <CommunityIcon className="w-5 h-5 mr-2" /> },
  // Admin Panel is now conditional in Navbar.tsx
];

export const FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'general', name: 'General Discussion', description: 'Talk about anything related to the game.', icon: <CommunityIcon className="w-6 h-6 text-primary" /> },
  { id: 'scripting', name: 'Scripting Help', description: 'Get help or share your scripts.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg> },
  { id: 'building', name: 'Building Show-off', description: 'Showcase your amazing builds.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 7.5h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12M3 3v2.25M3 3l11.25 11.25" /></svg> },
  { id: 'art', name: 'Art Corner', description: 'Share your game-related artwork.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.543A14.975 14.975 0 0010.36 10.36m0 0H8.342m1.928 0l-2.829 2.829m11.314-11.314l1.264 1.264A1.5 1.5 0 0118.25 6.5h-1.5a1.5 1.5 0 01-1.5-1.5v-1.5c0-.398.158-.78.439-1.061l1.264-1.264m-.628 14.376l-1.264-1.264A1.5 1.5 0 015.75 17.5h1.5a1.5 1.5 0 011.5 1.5v1.5c0 .398-.158.78-.439 1.061L8.623 22.5m8.128-8.121l-1.264 1.264A1.5 1.5 0 0114.75 16h-1.5a1.5 1.5 0 01-1.5-1.5v-1.5c0-.398.158-.78.439-1.061l1.264-1.264A1.5 1.5 0 0113.25 10h1.5a1.5 1.5 0 011.5 1.5v1.5c0 .398-.158-.78-.439 1.061z" /></svg> },
];
