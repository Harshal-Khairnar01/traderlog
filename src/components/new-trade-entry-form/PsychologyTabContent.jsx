
import React from 'react';
import FormField from '../FormField';

export default function PsychologyTabContent({ formData, handleChange, handleCheckboxChange, tradeToEdit }) {
  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold text-gray-100">Psychology & Mindset</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField label="Confidence Level (1-10)" id="confidenceLevel" type="range" min="1" max="10" value={formData.confidenceLevel} onChange={handleChange}>
          <div className="flex justify-between text-xs text-zinc-400 mt-1">
            <span>1 (Low)</span>
            <span className="text-zinc-100 font-bold">{formData.confidenceLevel}</span>
            <span>10 (High)</span>
          </div>
        </FormField>
        <FormField label="Emotions Before Trade" id="emotionsBefore" type="select" options={["Calm", "Greedy", "Fearful", "Overconfident", "Anxious", "Excited", "Neutral"]} value={formData.emotionsBefore} onChange={handleChange} />
        <FormField label="Emotions After Trade" id="emotionsAfter" type="select" options={["Calm", "Satisfied", "Frustrated", "Regretful", "Happy", "Angry", "Neutral"]} value={formData.emotionsAfter} onChange={handleChange} />
      </div>
      
      <h4 className="text-xl font-semibold text-gray-100 mt-6 mb-4">Notes / Learnings</h4>
      <div className="space-y-4">
        <FormField label="Trade Notes / Journal Entry" id="tradeNotes" type="textarea" rows="4" placeholder="Detailed notes about the trade" value={formData.tradeNotes} onChange={handleChange} />
        <FormField label="Mistakes (if any)" id="mistakes" type="textarea" rows="3" placeholder="What went wrong?" value={formData.mistakes} onChange={handleChange} />
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Common Mistakes (Select if any)</label>
          <div className="flex flex-wrap gap-4">
            {["No SL", "FOMO", "Overtrade", "Perfect", "SL Slip", "Ignore R:R", "Greed", "Fear", "Not Follow SelfSetup"].map((mistake) => (
              <label key={mistake} className="flex items-center space-x-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  value={mistake}
                  checked={formData.mistakeChecklist.includes(mistake)}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-4 w-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                />
                <span>{mistake}</span>
              </label>
            ))}
          </div>
        </div>
        <FormField label="What I Did Well?" id="whatDidWell" type="textarea" rows="3" placeholder="What positive actions did I take?" value={formData.whatDidWell} onChange={handleChange} />
      </div>
      
      <h4 className="text-xl font-semibold text-gray-100 mt-6 mb-4">Extras (Optional)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Screenshot Upload (Entry/Exit chart)" id="screenshotUpload" type="file" onChange={handleChange} />
        {tradeToEdit && tradeToEdit.screenshotUpload && (
          <div className="text-sm text-gray-400">Current Screenshot: {tradeToEdit.screenshotUpload}</div>
        )}
        <FormField label="Tags" id="tags" type="text" placeholder="e.g., Overtrading, Perfect Setup" value={formData.tags} onChange={handleChange} />
      </div>
    </div>
  );
}