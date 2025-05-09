import { ReactNode } from "react";
import { Link } from "wouter";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status?: "good" | "warning" | "danger";
  icon?: ReactNode;
  progress?: number;
  link?: {
    label: string;
    href: string;
  };
}

export default function StatsCard({ 
  title, 
  value, 
  unit, 
  status,
  icon, 
  progress, 
  link 
}: StatsCardProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
      {/* Subtle gradient accent on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 opacity-80"></div>
      
      {/* Background pattern for depth (subtle) */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjUiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">{title}</span>
          {status && (
            <span className={`text-xs font-bold ${
              status === 'good' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
              status === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            } py-1 px-3 rounded-full flex items-center`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                status === 'good' ? 'bg-green-500' : 
                status === 'warning' ? 'bg-amber-500' : 
                'bg-red-500'
              }`}></span>
              {status === 'good' ? 'Good' : status === 'warning' ? 'Fair' : 'Attention'}
            </span>
          )}
          {icon && !status && (
            <div className="h-9 w-9 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline mb-1">
          <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</span>
          {unit && <span className="ml-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>}
        </div>
        
        {progress !== undefined && (
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
            <div 
              className={`${
                progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                progress >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                'bg-gradient-to-r from-red-400 to-red-500'
              } h-2 rounded-full shadow-inner transition-all duration-500 ease-out`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        {link && (
          <div className="flex items-center mt-4 text-sm">
            <Link 
              href={link.href} 
              className="text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors flex items-center"
            >
              {link.label}
              <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
