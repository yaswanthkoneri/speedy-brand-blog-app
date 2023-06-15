export interface Topic {
  id: number;
  category: string;
  name: string;
  keywords: string[];
}

export interface Topics {
  [category: string]: Topic[];
}
