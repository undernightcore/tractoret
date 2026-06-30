import { object, url } from "zod";

export const createLinkValidator = object({
  url: url("A valid url is required"),
});
