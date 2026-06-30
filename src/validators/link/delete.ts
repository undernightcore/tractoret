import { array, number } from "zod";

export const deleteLinksValidator = array(
  number("A list of links is required"),
  "A list of links is required"
).min(1, "At least 1 link is required");
