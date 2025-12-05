import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Project Detail Page
export const getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Project detail page accessed for project ${id}`);

    // Fetch project from database
    const { data: project, error } = await databaseService.supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !project) {
      logger.error('Error fetching project:', error);
      return res.status(404).render('error', {
        title: 'Project Not Found',
        message: 'The project you are looking for does not exist.',
      });
    }

    // Fetch related data (tasks, team members, etc.)
    const { data: tasks } = await databaseService.supabase
      .from('todos')
      .select('*')
      .eq('project_id', id);

    const { data: team } = await databaseService.supabase
      .from('accounts')
      .select('id, name, email')
      .in('id', project.team_members || []);

    // Transform data for template
    const projectData = {
      id: project.id,
      name: project.title || 'Untitled Project',
      description: project.description || 'No description available',
      category: project.category,
      tags: project.tags,
      views: project.views || 0,
      rating: project.rating || 0,
      status: project.status || 'draft',
      progress: project.progress || 0,
      created_at: project.created_at,
      updated_at: project.updated_at,
      idea_model: project.idea_model,
      business_model: project.business_model,
      business_plan: project.business_plan,
      financial_model: project.financial_model,
      funding_model: project.funding_model,
      legal_model: project.legal_model,
      marketing_model: project.marketing_model,
      pitch_deck: project.pitch_deck,
      team_model: project.team_model,
      valuation: project.valuation,
      tasks: (tasks || []).map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        priority: task.priority,
      })),
      team: team || [],
    };

    // Quick actions for the project
    const quickActions = [
      {
        id: 'edit-project-btn',
        href: `/projects/${id}/edit`,
        text: 'Edit Project',
        icon: 'edit',
      },
      {
        id: 'add-task-btn',
        href: `/projects/${id}/tasks/new`,
        text: 'Add Task',
        icon: 'plus',
      },
      {
        id: 'view-team-btn',
        href: `/projects/${id}/team`,
        text: 'View Team',
        icon: 'users',
      },
    ];

    res.render('projects/project-detail', {
      title: projectData.name,
      description: `Details for ${projectData.name}`,
      section: 'main',
      currentSection: 'main',
      currentPage: 'Project Detail',
      project: projectData,
      quickActions,
      filterLinks: [
        {
          id: 'overview',
          href: `/projects/${id}`,
          text: 'Overview',
          icon: 'bar-chart',
        },
        {
          id: 'pitch-deck',
          href: '/projects/pitch-deck',
          text: 'Pitch Deck',
          icon: 'presentation',
        },
        {
          id: 'business-plan',
          href: '/projects/business-plan',
          text: 'Business Plan',
          icon: 'file-text',
        },
        {
          id: 'valuation',
          href: '/projects/valuation',
          text: 'Valuation',
          icon: 'calculator',
        },
      ],
    });
  } catch (error) {
    logger.error('Error loading project detail page:', error);

    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while loading the project details.',
    });
  }
};
