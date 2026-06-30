import { Router } from "express";
import {
  createLink,
  deleteLink,
  deleteLinks,
  editLink,
  getLink,
  getLinks,
} from "../controllers/link";

const router = Router({ mergeParams: true });

router.get("/", getLinks);
router.post("/", createLink);
router.get("/:linkId", getLink);
router.put("/:linkId", editLink);
router.delete("/:linkId", deleteLink);
router.delete("/", deleteLinks);

export const linkRouter = router;
