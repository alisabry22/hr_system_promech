import { Department } from "./department";

export type SortColumn=keyof Department |"";
export type SortDirection='asc'|'desc'|'';
export interface SortEvent{
  column:SortColumn;
  direction:SortDirection;
}
