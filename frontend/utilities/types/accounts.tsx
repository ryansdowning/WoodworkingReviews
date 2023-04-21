import { Resource } from "./base";

export const MEMBER_ROLES = { 1: "USER", 2: "MODERATOR" };
export const MEMBER_ROLE_NAMES = Object.entries(MEMBER_ROLES).reduce((obj, pair) => {
  obj[pair[1]] = parseInt(pair[0]);
  return obj;
}, Object());

export type Member = Resource & {
  user: number;
  role: number;
  reddit_username: string;
};
