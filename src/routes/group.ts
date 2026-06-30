import { Router } from "express";
import {
  createGroup,
  deleteGroup,
  editGroup,
  getGroup,
  getGroups,
} from "../controllers/group";

const router = Router();

router.get("/", getGroups);
router.post("/", createGroup);
router.get("/:groupId", getGroup);
router.put("/:groupId", editGroup);
router.delete("/:groupId", deleteGroup);

export const groupRouter = router;
