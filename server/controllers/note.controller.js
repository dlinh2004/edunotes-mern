import Note from "../models/Note.js";

// Tạo ghi chú mới
export const createNote = async (req, res) => {
  try {
    const { title, content, subject } = req.body;
    const note = await Note.create({
      title,
      content,
      subject: subject?.toLowerCase() || "general", // ✅ lowercase
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách ghi chú (có lọc, tìm kiếm, phân trang)
// Lấy danh sách ghi chú (có lọc, tìm kiếm, phân trang)
export const getNotes = async (req, res) => {
  try {
    let { page = 1, limit = 6, subject, from, to, search, read } = req.query;
    const filter = {};

    if (subject) filter.subject = subject.toLowerCase(); // ✅ không phân biệt hoa thường

    if (from || to) {
  filter.createdAt = {};
  if (from) filter.createdAt.$gte = new Date(from);
  if (to) {
    const endOfDay = new Date(to);
    endOfDay.setHours(23, 59, 59, 999); // ✅ fix lỗi không lấy hết ngày
    filter.createdAt.$lte = endOfDay;
  }
}


    if (search) {
      const regex = new RegExp(search, "i"); // ✅ không phân biệt hoa/thường
      filter.$or = [
        { title: regex },
        { content: regex },
        { subject: regex } // ✅ Thêm tìm kiếm theo môn học
      ];
    }

    if (read === "true") {
      filter.read = true; // ✅ lọc ghi chú đã hoàn thành
    }

    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      notes,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Lấy 1 ghi chú theo ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Không tìm thấy ghi chú" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật ghi chú
export const updateNote = async (req, res) => {
  try {
    const data = req.body;
    if (data.subject) {
      data.subject = data.subject.toLowerCase(); // ✅ lowercase khi cập nhật
    }
    const note = await Note.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!note) return res.status(404).json({ message: "Không tìm thấy ghi chú" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa ghi chú
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Không tìm thấy ghi chú" });
    res.json({ message: "Đã xóa ghi chú" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Thống kê ghi chú theo môn
export const getStats = async (req, res) => {
  try {
    const total = await Note.countDocuments();
    const bySubject = await Note.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ total, bySubject });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
