import { ReactNode } from "react";

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
    <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-500">{title}</span>
        {status && (
          <span className={`text-xs font-semibold ${
            status === 'good' ? 'bg-green-100 text-green-800' : 
            status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          } py-1 px-2 rounded-full`}>
            {status === 'good' ? 'Good' : status === 'warning' ? 'Fair' : 'Attention'}
          </span>
        )}
        {icon && !status && icon}
      </div>
      
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-neutral-800">{value}</span>
        {unit && <span className="ml-1 text-sm text-neutral-500">{unit}</span>}
      </div>
      
      {progress !== undefined && (
        <div className="w-full bg-neutral-200 rounded-full h-2 mt-3">
          <div 
            className={`${
              progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            } h-2 rounded-full`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {link && (
        <div className="flex items-center mt-3 text-xs">
          <a href={link.href} className="text-primary-600 font-medium">{link.label}</a>
          <i className="ri-arrow-right-s-line text-primary-600 ml-1"></i>
        </div>
      )}
    </div>
  );
}
