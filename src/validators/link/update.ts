import { object, url } from "zod";

export const editLinkValidator = object({
  name: url("A valid name is required"),
});
