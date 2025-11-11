/**
 * Organization Service
 * Business logic for organization management
 */

class OrganizationService {
  constructor(organizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  /**
   * Get all organizations with detailed information
   */
  async getAllOrganizations() {
    try {
      const organizations = await this.organizationRepository.getAll();

      // Get additional stats for each organization
      for (const org of organizations) {
        org.memberCount = await this.getMemberCount(org.id);
        org.projectCount = await this.getProjectCount(org.id);
      }

      return organizations;
    } catch (error) {
      throw new Error(`Failed to get organizations: ${error.message}`);
    }
  }

  /**
   * Get organization by ID with full details
   */
  async getOrganizationById(id) {
    try {
      const organization = await this.organizationRepository.getById(id);
      if (!organization) {
        throw new Error('Organization not found');
      }

      // Get related data
      organization.members = await this.organizationRepository.getMembers(id);
      organization.projects = await this.organizationRepository.getProjects(id);
      organization.stats = {
        memberCount: organization.members.length,
        projectCount: organization.projects.length,
      };

      return organization;
    } catch (error) {
      throw new Error(`Failed to get organization: ${error.message}`);
    }
  }

  /**
   * Get organizations by type
   */
  async getOrganizationsByType(orgType) {
    try {
      const validTypes = ['corporate', 'enterprise', 'startup'];
      if (!validTypes.includes(orgType)) {
        throw new Error('Invalid organization type');
      }

      const organizations =
        await this.organizationRepository.getByType(orgType);

      // Add stats
      for (const org of organizations) {
        org.memberCount = await this.getMemberCount(org.id);
        org.projectCount = await this.getProjectCount(org.id);
      }

      return organizations;
    } catch (error) {
      throw new Error(`Failed to get organizations by type: ${error.message}`);
    }
  }

  /**
   * Create new organization
   */
  async createOrganization(organizationData) {
    try {
      const { name, org_type, owner_user_id } = organizationData;

      // Validate required fields
      if (!name || !org_type || !owner_user_id) {
        throw new Error('Name, organization type, and owner are required');
      }

      // Validate organization type
      const validTypes = ['corporate', 'enterprise', 'startup'];
      if (!validTypes.includes(org_type)) {
        throw new Error('Invalid organization type');
      }

      const organizationId = await this.organizationRepository.create({
        name: name.trim(),
        org_type,
        owner_user_id,
      });

      return await this.getOrganizationById(organizationId);
    } catch (error) {
      throw new Error(`Failed to create organization: ${error.message}`);
    }
  }

  /**
   * Update organization
   */
  async updateOrganization(id, organizationData) {
    try {
      const { name, org_type } = organizationData;

      // Validate organization type if provided
      if (org_type) {
        const validTypes = ['corporate', 'enterprise', 'startup'];
        if (!validTypes.includes(org_type)) {
          throw new Error('Invalid organization type');
        }
      }

      const changes = await this.organizationRepository.update(id, {
        name: name?.trim(),
        org_type,
      });

      if (changes === 0) {
        throw new Error('Organization not found');
      }

      return await this.getOrganizationById(id);
    } catch (error) {
      throw new Error(`Failed to update organization: ${error.message}`);
    }
  }

  /**
   * Delete organization
   */
  async deleteOrganization(id) {
    try {
      // Check if organization has members or projects
      const organization = await this.getOrganizationById(id);
      if (organization.members.length > 1) {
        // More than just the owner
        throw new Error('Cannot delete organization with active members');
      }
      if (organization.projects.length > 0) {
        throw new Error('Cannot delete organization with active projects');
      }

      const changes = await this.organizationRepository.delete(id);
      if (changes === 0) {
        throw new Error('Organization not found');
      }

      return { success: true, message: 'Organization deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete organization: ${error.message}`);
    }
  }

  /**
   * Get organization statistics
   */
  async getOrganizationStats() {
    try {
      const stats = await this.organizationRepository.getStats();

      // Add additional computed stats
      stats.membersPerOrg = await this.getAverageMembersPerOrg();
      stats.projectsPerOrg = await this.getAverageProjectsPerOrg();

      return stats;
    } catch (error) {
      throw new Error(`Failed to get organization stats: ${error.message}`);
    }
  }

  /**
   * Helper: Get member count for an organization
   */
  async getMemberCount(organizationId) {
    try {
      const members =
        await this.organizationRepository.getMembers(organizationId);
      return members.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Helper: Get project count for an organization
   */
  async getProjectCount(organizationId) {
    try {
      const projects =
        await this.organizationRepository.getProjects(organizationId);
      return projects.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Helper: Get average members per organization
   */
  async getAverageMembersPerOrg() {
    try {
      const organizations = await this.organizationRepository.getAll();
      if (organizations.length === 0) return 0;

      let totalMembers = 0;
      for (const org of organizations) {
        totalMembers += await this.getMemberCount(org.id);
      }

      return Math.round((totalMembers / organizations.length) * 10) / 10;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Helper: Get average projects per organization
   */
  async getAverageProjectsPerOrg() {
    try {
      const organizations = await this.organizationRepository.getAll();
      if (organizations.length === 0) return 0;

      let totalProjects = 0;
      for (const org of organizations) {
        totalProjects += await this.getProjectCount(org.id);
      }

      return Math.round((totalProjects / organizations.length) * 10) / 10;
    } catch (error) {
      return 0;
    }
  }
}

module.exports = OrganizationService;
