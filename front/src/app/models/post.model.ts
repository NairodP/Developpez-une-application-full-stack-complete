export interface Post {
  id?: number;
  title: string;
  content: string;
  author?: any;
  createdAt?: Date;
  updatedAt?: Date;
  themeId?: number;
  theme?: Theme;
}

export interface Theme {
  id?: number;
  name: string;
  description?: string;
}

export interface Comment {
  id?: number;
  content: string;
  author?: any;
  post?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
