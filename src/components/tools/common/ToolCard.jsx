
import { ChevronRight } from "lucide-react";
import React from "react";

const ToolCard = ({ title, description, icon: IconComponent, onClick }) => {
  return (
    <div className="relative bg-zinc-800 hover:bg-zinc-700 rounded-lg p-6 flex flex-col items-start text-left transition-colors duration-200  shadow-md border border-zinc-700">
      <div className="flex items-center mb-4">
        {IconComponent && (
          <div className="text-blue-500 mr-4">
            <IconComponent size={40} />
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
      </div>

      <p className="text-sm text-gray-300 mb-6 flex-grow">{description}</p>

      <div className="flex justify-between items-center w-full mt-auto">
        <button
          onClick={onClick}
          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center text-sm ml-auto cursor-pointer"
        >
          Explore{" "}
          <span className="ml-1 text-lg leading-none">
            <ChevronRight size={16} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ToolCard;
