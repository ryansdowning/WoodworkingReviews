import { Resource } from "./base";

export type Member = Resource & {
  user: number;
  reddit_username: string;
};
