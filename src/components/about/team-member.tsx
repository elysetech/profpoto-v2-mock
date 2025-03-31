"use client";

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  image: string;
}

export function TeamMember({ name, role, description, image }: TeamMemberProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img 
          src={image} 
          alt={`Photo de ${name}`} 
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{role}</p>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}
