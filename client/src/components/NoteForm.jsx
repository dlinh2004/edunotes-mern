import React, { useState } from "react";

export default function NoteForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Tiêu đề không được để trống");
    await onAdd({ title: title.trim(), content: content || "", subject: subject || "General" });
    setTitle(""); setContent(""); setSubject("");
  };

  return (
    <form onSubmit={submit} className="p-4 border rounded">
      <div className="mb-2">
        <label className="block text-sm">Tiêu đề</label>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-2 border rounded" placeholder="Tiêu đề ghi chú" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nội dung</label>
        <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="w-full p-2 border rounded" rows="4" placeholder="Nhập nội dung ghi chú..." />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Môn học</label>
        <input value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full p-2 border rounded" placeholder="Ví dụ: Toán" />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">Thêm</button>
      </div>
    </form>
  );
}
