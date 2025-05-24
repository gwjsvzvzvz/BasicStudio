
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20 animate-fadeIn">
      <PageHeader title="404 - Page Not Found" />
      <img src="https://picsum.photos/seed/404error/500/300" alt="Lost Astronaut" className="mx-auto my-8 rounded-lg shadow-xl w-full max-w-md"/>
      <p className="text-xl text-textSecondary mb-8">
        Oops! The page you're looking for seems to have drifted off into the gaming cosmos.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Return to Home Base
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
