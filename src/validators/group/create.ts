import { number, object, string } from "zod";

export const createGroupValidator = object({
  name: string("A name is required"),
  color: string("A color is required").regex(
    /^#?([0-9a-f]{6}|[0-9a-f]{3})$/,
    "The color must be a valid hex"
  ),
  interval: number("An interval in seconds is required").min(
    10,
    "Cannot be less than every 10 seconds"
  ),
  workers: number("Max number of concurrent workers is required"),
  stockIfPresent: string("A string that indicates stock is required"),
  priceLocator: string("A price locator is required"),
});
