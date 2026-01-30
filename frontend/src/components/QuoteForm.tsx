import { useState } from "react";

export interface QuoteFormData {
  text: string;
  season: number;
  episode: number;
}

interface QuoteFormProps {
  initialData?: QuoteFormData;
  onSubmit: (data: QuoteFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function QuoteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: QuoteFormProps) {
  const [text, setText] = useState(initialData?.text ?? "");
  const [season, setSeason] = useState(initialData ? String(initialData.season) : "");
  const [episode, setEpisode] = useState(initialData ? String(initialData.episode) : "");
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof QuoteFormData, string>> = {};

    if (!text.trim()) {
      newErrors.text = "Quote text is required";
    } else if (text.length > 1000) {
      newErrors.text = "Quote text is too long (max 1000 characters)";
    }

    const seasonNum = parseInt(season, 10);
    if (!season || isNaN(seasonNum) || seasonNum < 1) {
      newErrors.season = "Valid season number is required";
    }

    const episodeNum = parseInt(episode, 10);
    if (!episode || isNaN(episodeNum) || episodeNum < 1) {
      newErrors.episode = "Valid episode number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      text: text.trim(),
      season: parseInt(season, 10),
      episode: parseInt(episode, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="quote-text" className="block text-sm font-medium mb-2">
          Quote Text
        </label>
        <textarea
          id="quote-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-simpsons-yellow focus:border-transparent outline-none transition-all ${
            errors.text ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          }`}
          placeholder="Enter the quote..."
          disabled={isLoading}
        />
        {errors.text && (
          <p className="text-red-500 text-sm mt-1">{errors.text}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          {text.length}/1000 characters
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quote-season" className="block text-sm font-medium mb-2">
            Season
          </label>
          <input
            id="quote-season"
            type="number"
            min="1"
            value={season}
            onChange={(e) => {
              setSeason(e.target.value);
            }}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-simpsons-yellow focus:border-transparent outline-none transition-all ${
              errors.season ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="1"
            disabled={isLoading}
          />
          {errors.season && (
            <p className="text-red-500 text-sm mt-1">{errors.season}</p>
          )}
        </div>

        <div>
          <label htmlFor="quote-episode" className="block text-sm font-medium mb-2">
            Episode
          </label>
          <input
            id="quote-episode"
            type="number"
            min="1"
            value={episode}
            onChange={(e) => {
              setEpisode(e.target.value);
            }}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-simpsons-yellow focus:border-transparent outline-none transition-all ${
              errors.episode ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="1"
            disabled={isLoading}
          />
          {errors.episode && (
            <p className="text-red-500 text-sm mt-1">{errors.episode}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary px-6 py-2 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : initialData ? "Update Quote" : "Create Quote"}
        </button>
      </div>
    </form>
  );
}
