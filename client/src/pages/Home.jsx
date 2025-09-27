import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import Pagination from "../components/Pagination";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(6);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterRead, setFilterRead] = useState(false); // ✅ thêm state lọc đã hoàn thành
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");

  const fetchNotes = async (pageNum = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", pageNum);
      params.set("limit", limit);

      if (filterSubject) params.set("subject", filterSubject.toLowerCase()); // ✅ lowercase
      if (filterFrom) params.set("from", filterFrom);
      if (filterTo) params.set("to", filterTo);
      if (search) params.set("search", search.toLowerCase()); // ✅ lowercase
      if (filterRead) params.set("read", "true"); // ✅ chỉ hiện ghi chú đã hoàn thành

      const res = await api.get(`?${params.toString()}`);
      setNotes(res.data.notes || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes(1);
    fetchStats();
    // eslint-disable-next-line
  }, [filterSubject, filterFrom, filterTo, search, filterRead]);

  const handleAdd = async (payload) => {
    // ✅ tự động lowercase subject khi thêm
    if (payload.subject) {
      payload.subject = payload.subject.toLowerCase();
    }
    await api.post("/", payload);
    await fetchNotes(1);
    await fetchStats();
  };

  const handleUpdate = async (id, data) => {
    if (data.subject) {
      data.subject = data.subject.toLowerCase(); // ✅ lowercase khi update
    }
    await api.put(`/${id}`, data);
    await fetchNotes(page);
    await fetchStats();
  };

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa?")) return;
    await api.delete(`/${id}`);
    await fetchNotes(page);
    await fetchStats();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">EduNotes — Quản lý Ghi chú Học tập</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <NoteForm onAdd={handleAdd} />
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Bộ lọc</h2>

          <div className="mb-3">
            <label className="block text-sm mb-1">Môn học</label>
            <input
              placeholder="Ví dụ: Toán, Lý, Hóa"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">Ngày tạo (từ)</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="w-full p-2 border rounded text-sm" />
            <label className="block text-sm mb-1 mt-2">Ngày tạo (đến)</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="w-full p-2 border rounded text-sm" />
            {(filterFrom || filterTo) && (
              <button className="mt-2 text-xs text-blue-600 underline" onClick={() => { setFilterFrom(""); setFilterTo(""); }}>
                Xóa lọc ngày
              </button>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">Tìm kiếm</label>
            <input
              placeholder="Tìm theo tiêu đề hoặc nội dung"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
          </div>

          {/* ✅ Checkbox lọc ghi chú đã hoàn thành */}
          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              id="filterRead"
              checked={filterRead}
              onChange={() => setFilterRead(!filterRead)}
            />
            <label htmlFor="filterRead" className="text-sm">Đã hoàn thành</label>
          </div>

          <h3 className="font-semibold">Thống kê nhanh</h3>
          <div className="mt-2 text-sm max-h-[200px] overflow-y-auto border p-2 rounded">
            {stats ? (
              <>
                <div>Tổng ghi chú: {stats.total}</div>
                <div className="mt-2">Số ghi chú theo môn:</div>
                {stats.bySubject?.map(s => (
                  <div key={s._id} className="ml-2">{s._id}: {s.count}</div>
                ))}
              </>
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Danh sách ghi chú</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <NoteList notes={notes} onUpdate={handleUpdate} onDelete={handleDelete} />
            <Pagination page={page} pages={pages} onChange={(p) => fetchNotes(p)} />
          </>
        )}
      </div>
    </div>
  );
}
