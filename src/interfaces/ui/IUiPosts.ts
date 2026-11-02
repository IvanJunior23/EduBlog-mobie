import type { IPost } from "../IPost";

export interface IPostFilterChipsProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
  formatLabel?: (value: string) => string;
}

export interface IPostCoverProps {
  imageUrl?: string | null;
  discipline: string;
}

export interface IPostsFeedbackProps {
  loading?: boolean;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface IPostCardProps {
  post: IPost;
}

export interface IFeaturedCarouselProps {
  posts: IPost[];
}

export interface IPostInformationProps {
  label: string;
  value?: string | null;
}
