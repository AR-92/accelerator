/**
 * Organization Repository
 * Handles database operations for organizations (corporate/enterprise/startup)
 */

class OrganizationRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all organizations with owner information
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT o.*, u.name as owner_name, u.email as owner_email
        FROM organizations o
        LEFT JOIN users u ON o.owner_user_id = u.id
        ORDER BY o.created_at DESC
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get organization by ID with owner and member information
   */
  async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT o.*, u.name as owner_name, u.email as owner_email
        FROM organizations o
        LEFT JOIN users u ON o.owner_user_id = u.id
        WHERE o.id = ?
      `;
      this.db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get organizations by type
   */
  async getByType(orgType) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT o.*, u.name as owner_name, u.email as owner_email
        FROM organizations o
        LEFT JOIN users u ON o.owner_user_id = u.id
        WHERE o.org_type = ?
        ORDER BY o.created_at DESC
      `;
      this.db.all(sql, [orgType], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get organization members (users belonging to the organization)
   */
  async getMembers(organizationId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT u.*, 'member' as role
        FROM users u
        WHERE u.organization_id = ?
        UNION
        SELECT u.*, 'owner' as role
        FROM users u
        JOIN organizations o ON u.id = o.owner_user_id
        WHERE o.id = ?
        ORDER BY role DESC, u.created_at DESC
      `;
      this.db.all(sql, [organizationId, organizationId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get organization projects
   */
  async getProjects(organizationId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, u.name as owner_name
        FROM projects p
        LEFT JOIN users u ON p.owner_user_id = u.id
        WHERE p.organization_id = ?
        ORDER BY p.created_at DESC
      `;
      this.db.all(sql, [organizationId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Create new organization
   */
  async create(organizationData) {
    return new Promise((resolve, reject) => {
      const { name, org_type, owner_user_id } = organizationData;
      const sql = `
        INSERT INTO organizations (name, org_type, owner_user_id)
        VALUES (?, ?, ?)
      `;
      this.db.run(sql, [name, org_type, owner_user_id], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  /**
   * Update organization
   */
  async update(id, organizationData) {
    return new Promise((resolve, reject) => {
      const { name, org_type } = organizationData;
      const sql = `
        UPDATE organizations
        SET name = ?, org_type = ?
        WHERE id = ?
      `;
      this.db.run(sql, [name, org_type, id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Delete organization
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM organizations WHERE id = ?';
      this.db.run(sql, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Get organization statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          COUNT(*) as total_organizations,
          SUM(CASE WHEN org_type = 'corporate' THEN 1 ELSE 0 END) as corporate_count,
          SUM(CASE WHEN org_type = 'enterprise' THEN 1 ELSE 0 END) as enterprise_count,
          SUM(CASE WHEN org_type = 'startup' THEN 1 ELSE 0 END) as startup_count
        FROM organizations
      `;
      this.db.get(sql, [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = OrganizationRepository;
