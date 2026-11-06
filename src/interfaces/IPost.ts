import { IDiscipline } from "@/interfaces/IDiscipline";
import { IPostStatus } from "@/interfaces/IPostStatus";

export interface IPost {
  _id: string;
  title: string;
  summary: string;
  content: string;

  imageUrl?: string | null;
  series?: string | null;
  semester?: string | null;
  isFeatured?: boolean;

  discipline: Pick<IDiscipline, "_id" | "label" | "order">;

  author: {
    _id?: string;
    name: string;
    email?: string;
    username?: string;
  };

  status: IPostStatus;

  createDate: string;
  updateDate?: string;
}
