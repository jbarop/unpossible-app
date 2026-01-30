export interface Quote {
  id: string;
  text: string;
  season: number;
  episode: number;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteCreate {
  text: string;
  season: number;
  episode: number;
}

export interface QuoteUpdate {
  text?: string;
  season?: number;
  episode?: number;
}
