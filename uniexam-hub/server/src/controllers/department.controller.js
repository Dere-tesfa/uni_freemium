const { pool } = require('../config/db');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
exports.getAllDepartments = async (req, res) => {
  const result = await pool.query('SELECT * FROM departments ORDER BY name ASC');
  res.json({ success: true, data: result.rows });
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private
exports.getDepartmentById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }

  // Also fetch exams for this department
  const exams = await pool.query('SELECT id, title, description, duration, price FROM exams WHERE department_id = $1', [id]);

  res.json({
    success: true,
    data: {
      ...result.rows[0],
      exams: exams.rows
    }
  });
};

// @desc    Create department (Admin only)
exports.createDepartment = async (req, res) => {
  const { name, description, icon_url } = req.body;
  const result = await pool.query(
    'INSERT INTO departments (name, description, icon_url) VALUES ($1, $2, $3) RETURNING *',
    [name, description, icon_url]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
};

// @desc    Update department
exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, description, icon_url } = req.body;
  const result = await pool.query(
    'UPDATE departments SET name = $1, description = $2, icon_url = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
    [name, description, icon_url, id]
  );
  res.json({ success: true, data: result.rows[0] });
};

// @desc    Delete department
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM departments WHERE id = $1', [id]);
  res.json({ success: true, message: 'Department deleted' });
};
