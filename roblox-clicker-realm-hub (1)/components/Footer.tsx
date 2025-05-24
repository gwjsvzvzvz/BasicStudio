
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface text-textSecondary text-center p-6 shadow-top mt-auto">
      <p>&copy; {new Date().getFullYear()} Roblox Clicker Realm Hub. All rights reserved.</p>
      <p className="text-xs mt-1">A community site for your favorite Clicker Simulator game!</p>
    </footer>
  );
};

export default Footer;
    