/**
 * Admin AI Controller
 * Handles admin operations for AI models and workflows
 */

class AdminAIController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  /**
   * Show AI models list
   */
  async showAIModels(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';

      const result = await this.adminService.getAIModels({
        page,
        limit,
        search,
      });

      const workflowSteps = await this.adminService.getAllWorkflowSteps();

      res.render('pages/admin/ai-models', {
        title: 'AI Models - Admin Panel',
        layout: 'admin',
        activeAIModels: true,
        mainPadding: 'py-8',
        user: req.user,
        aiModels: result.models,
        workflowSteps,
        pagination: result.pagination,
        filters: result.filters,
        stats: await this.adminService.getAIModelStats(),
      });
    } catch (error) {
      console.error('Error showing AI models:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'main',
        message: 'Failed to load AI models',
      });
    }
  }

  /**
   * Show AI workflows list
   */
  async showAIWorkflows(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';
      const modelId = req.query.modelId || '';

      const result = await this.adminService.getAIWorkflows({
        page,
        limit,
        search,
        modelId,
      });

      res.render('pages/admin/ai-workflows', {
        title: 'AI Workflows - Admin Panel',
        layout: 'admin',
        activeAIWorkflows: true,
        mainPadding: 'py-8',
        user: req.user,
        aiWorkflows: result.workflows,
        pagination: result.pagination,
        filters: result.filters,
        stats: await this.adminService.getAIWorkflowStats(),
      });
    } catch (error) {
      console.error('Error showing AI workflows:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'main',
        message: 'Failed to load AI workflows',
      });
    }
  }

  /**
   * Show AI workflow details
   */
  async showAIWorkflowDetails(req, res) {
    try {
      const { workflowId } = req.params;
      const workflow = await this.adminService.getAIWorkflowById(workflowId);

      if (!workflow) {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Not Found - Admin Panel',
          layout: 'main',
          message: 'AI Workflow not found',
        });
      }

      // Get workflow executions and outputs
      const executions =
        await this.adminService.getWorkflowExecutionsByWorkflow(workflowId);
      const outputs =
        await this.adminService.getWorkflowOutputsByExecution(workflowId);
      const feedback =
        await this.adminService.getWorkflowFeedbackByExecution(workflowId);

      res.render('pages/admin/ai-workflows', {
        title: `${workflow.model_name} Workflow - Admin Panel`,
        layout: 'admin',
        activeAIWorkflows: true,
        mainPadding: 'py-8',
        user: req.user,
        workflow,
        executions,
        outputs,
        feedback,
      });
    } catch (error) {
      console.error('Error showing AI workflow details:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'main',
        message: 'Failed to load AI workflow details',
      });
    }
  }
}

module.exports = AdminAIController;
