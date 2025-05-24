
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="mb-8 text-center md:text-left border-b border-gray-700 pb-6">
      <div className="flex items-center justify-center md:justify-start">
        {icon && <div className="mr-4 text-primary">{React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-10 h-10" })}</div>}
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          {title}
        </h1>
      </div>
      {subtitle && <p className="mt-2 text-lg text-textSecondary">{subtitle}</p>}
    </div>
  );
};

export default PageHeader;
