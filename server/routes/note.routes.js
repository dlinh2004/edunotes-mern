import express from "express";
import {
  createNote, getNotes, getNoteById,
  updateNote, deleteNote, getStats
} from "../controllers/note.controller.js";

const router = express.Router();

router.post("/", createNote);
router.get("/stats", getStats);
router.get("/:id", getNoteById);
router.get("/", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
