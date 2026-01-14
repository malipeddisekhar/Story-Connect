// Helper function to convert MySQL query results to PostgreSQL format
// PostgreSQL returns: { rows: [], rowCount: number, ... }
// This helper extracts rows for easier migration
const query = async (text, params = []) => {
  const result = await pool.query(text, params);
  return result.rows;
};

// Helper to convert MySQL INSERT result to PostgreSQL
const queryWithInsertId = async (text, params = []) => {
  const result = await pool.query(text + ' RETURNING *', params);
  return result.rows[0];
};
