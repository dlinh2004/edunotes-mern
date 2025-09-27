import React, { useState } from "react";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function NoteList({ notes = [], onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSubject, setEditSubject] = useState("");

  if (!notes.length) return <div className="p-4 text-sm text-slate-500">Chưa có ghi chú.</div>;

  const toggleRead = async (note) => {
    await onUpdate(note._id, { read: !note.read });
  };

  const startEditing = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditSubject(note.subject);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle(""); setEditContent(""); setEditSubject("");
  };

  const saveChanges = async (note) => {
    await onUpdate(note._id, {
      title: editTitle,
      content: editContent,
      subject: editSubject || "General",
      read: note.read
    });
    cancelEditing();
  };

  return (
    <ul className="divide-y">
      {notes.map(note => (
        <li key={note._id} className="p-3 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="flex items-start gap-3 w-full">
            <input type="checkbox" checked={note.read} onChange={() => toggleRead(note)} className="mt-1" />

            <div className="flex-1">
              {editingId === note._id ? (
                <>
                  <input type="text" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} className="w-full border px-2 py-1 rounded mb-2" />
                  <textarea value={editContent} onChange={(e)=>setEditContent(e.target.value)} className="w-full border px-2 py-1 rounded mb-2" rows="3" />
                  <input value={editSubject} onChange={(e)=>setEditSubject(e.target.value)} className="w-full border px-2 py-1 rounded" />
                </>
              ) : (
                <>
                  <div className={`font-medium ${note.read ? "line-through text-slate-400" : ""}`}>{note.title}</div>
                  <div className="text-sm text-slate-600">{note.content}</div>
                  <div className="text-xs text-slate-500 mt-1">Môn: {note.subject} • {new Date(note.createdAt).toLocaleString()}</div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editingId === note._id ? (
              <>
                <button onClick={()=>saveChanges(note)} className="p-1 text-green-600"><FaSave /></button>
                <button onClick={cancelEditing} className="p-1 text-gray-500"><FaTimes /></button>
              </>
            ) : (
              <button onClick={()=>startEditing(note)} className="p-1 hover:text-blue-600"><FaEdit /></button>
            )}

            <button onClick={() => onDelete(note._id)} className="p-1 hover:text-red-600"><FaTrash /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}
