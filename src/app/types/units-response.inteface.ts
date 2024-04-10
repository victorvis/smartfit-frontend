import { Local } from "./local.interface";

export interface UnitsResponse {
  current_country_id: number,
  locations: Local[]
}