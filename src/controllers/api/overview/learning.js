import logger from '../../../utils/logger.js';
import databaseService from '../../../services/supabase.js';


// Learning Categories API
export const getLearningCategories = async (req, res) => {
  try {
    const { search, category_type, is_featured, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = databaseService.supabase
      .from('learning_categories')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (category_type) {
      query = query.eq('category_type', category_type);
    }
    if (is_featured !== undefined) {
      query = query.eq('is_featured', is_featured === 'true');
    }

    query = query
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: categories, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    logger.info(`Fetched ${categories.length} of ${total} learning categories`);

    if (isHtmxRequest(req)) {
      const categoryHtml = categories.map(category => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">${category.icon || '📚'}</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${category.name}</div>
                <div class="text-sm text-gray-500">${category.description?.substring(0, 50)}${category.description?.length > 50 ? '...' : ''}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              category.category_type === 'general' ? 'bg-blue-100 text-blue-800' :
              category.category_type === 'specialized' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }">${category.category_type}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              category.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }">${category.is_featured ? 'Featured' : 'Regular'}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${category.content_count || 0}</td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(category.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('learning-category', ${category.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-learning-category-${category.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <button onclick="editLearningCategory(${category.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Category
                  </button>
                  <button onclick="toggleFeatured(${category.id}, ${category.is_featured})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-star" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"></polygon>
                    </svg>
                    ${category.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button onclick="deleteLearningCategory(${category.id}, '${category.name}')" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

      const paginationHtml = generatePaginationHtml(pageNum, limitNum, total, req.query, 'learning-categories');
      res.send(categoryHtml + paginationHtml);
    } else {
      res.json({ success: true, data: categories, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching learning categories:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading learning categories</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Learning Content API
export const getLearningContent = async (req, res) => {
  try {
    const { search, content_type, difficulty_level, status, category_id, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = databaseService.supabase
      .from('learning_content')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }
    if (content_type) {
      query = query.eq('content_type', content_type);
    }
    if (difficulty_level) {
      query = query.eq('difficulty_level', difficulty_level);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: content, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    logger.info(`Fetched ${content.length} of ${total} learning content items`);

    if (isHtmxRequest(req)) {
      const contentHtml = content.map(item => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">${item.content_type === 'article' ? '📄' : item.content_type === 'video' ? '🎥' : '📚'}</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${item.title}</div>
                <div class="text-sm text-gray-500">${item.excerpt?.substring(0, 50)}${item.excerpt?.length > 50 ? '...' : ''}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              item.content_type === 'article' ? 'bg-blue-100 text-blue-800' :
              item.content_type === 'video' ? 'bg-red-100 text-red-800' :
              item.content_type === 'interactive' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }">${item.content_type}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              item.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
              item.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              item.difficulty_level === 'advanced' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }">${item.difficulty_level}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              item.status === 'published' ? 'bg-green-100 text-green-800' :
              item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }">${item.status}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${item.view_count || 0}</td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(item.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('learning-content', ${item.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-learning-content-${item.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/learning-content/${item.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick="editLearningContent(${item.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Content
                  </button>
                  <button onclick="publishLearningContent(${item.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-send" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                    Publish
                  </button>
                  <button onclick="deleteLearningContent(${item.id}, '${item.title}')" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

      const paginationHtml = generatePaginationHtml(pageNum, limitNum, total, req.query, 'learning-content');
      res.send(contentHtml + paginationHtml);
    } else {
      res.json({ success: true, data: content, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching learning content:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading learning content</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Learning Assessments API
export const getLearningAssessments = async (req, res) => {
  try {
    const { search, assessment_type, difficulty_level, is_active, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = databaseService.supabase
      .from('learning_assessments')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (assessment_type) {
      query = query.eq('assessment_type', assessment_type);
    }
    if (difficulty_level) {
      query = query.eq('difficulty_level', difficulty_level);
    }
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: assessments, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    logger.info(`Fetched ${assessments.length} of ${total} learning assessments`);

    if (isHtmxRequest(req)) {
      const assessmentHtml = assessments.map(assessment => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">${assessment.assessment_type === 'quiz' ? '📝' : assessment.assessment_type === 'exam' ? '📋' : '🧪'}</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${assessment.title}</div>
                <div class="text-sm text-gray-500">${assessment.description?.substring(0, 50)}${assessment.description?.length > 50 ? '...' : ''}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              assessment.assessment_type === 'quiz' ? 'bg-blue-100 text-blue-800' :
              assessment.assessment_type === 'exam' ? 'bg-red-100 text-red-800' :
              'bg-purple-100 text-purple-800'
            }">${assessment.assessment_type}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              assessment.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
              assessment.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              assessment.difficulty_level === 'advanced' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }">${assessment.difficulty_level}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${assessment.passing_score}%</td>
          <td class="px-6 py-4 text-sm text-gray-900">${assessment.max_attempts || 'Unlimited'}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              assessment.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }">${assessment.is_active ? 'Active' : 'Inactive'}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(assessment.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('learning-assessment', ${assessment.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-learning-assessment-${assessment.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <button onclick="editLearningAssessment(${assessment.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Assessment
                  </button>
                  <button onclick="toggleAssessmentStatus(${assessment.id}, ${assessment.is_active})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                      <line x1="12" y1="2" x2="12" y2="12"></line>
                    </svg>
                    ${assessment.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onclick="deleteLearningAssessment(${assessment.id}, '${assessment.title}')" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

      const paginationHtml = generatePaginationHtml(pageNum, limitNum, total, req.query, 'learning-assessments');
      res.send(assessmentHtml + paginationHtml);
    } else {
      res.json({ success: true, data: assessments, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching learning assessments:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading learning assessments</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Learning Analytics API
export const getLearningAnalytics = async (req, res) => {
  try {
    const { user_id, content_id, event_type, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = databaseService.supabase
      .from('learning_analytics')
      .select('*', { count: 'exact' });

    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    if (content_id) {
      query = query.eq('content_id', content_id);
    }
    if (event_type) {
      query = query.eq('event_type', event_type);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: analytics, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    logger.info(`Fetched ${analytics.length} of ${total} learning analytics records`);

    if (isHtmxRequest(req)) {
      const analyticsHtml = analytics.map(record => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4 text-sm text-gray-900">${record.user_id}</td>
          <td class="px-6 py-4 text-sm text-gray-900">${record.content_id}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              record.event_type === 'view' ? 'bg-blue-100 text-blue-800' :
              record.event_type === 'complete' ? 'bg-green-100 text-green-800' :
              record.event_type === 'start' ? 'bg-yellow-100 text-yellow-800' :
              'bg-purple-100 text-purple-800'
            }">${record.event_type}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${record.session_duration_seconds || 0}s</td>
          <td class="px-6 py-4 text-sm text-gray-900">${record.engagement_score ? (record.engagement_score * 100).toFixed(1) + '%' : 'N/A'}</td>
          <td class="px-6 py-4 text-sm text-gray-900">${record.country || 'N/A'}</td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(record.created_at)}</td>
        </tr>
      `).join('');

      const paginationHtml = generatePaginationHtml(pageNum, limitNum, total, req.query, 'learning-analytics');
      res.send(analyticsHtml + paginationHtml);
    } else {
      res.json({ success: true, data: analytics, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching learning analytics:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading learning analytics</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Helper function to generate pagination HTML
const generatePaginationHtml = (page, limit, total, query, endpoint) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const params = Object.keys(query)
    .filter(key => key !== 'page')
    .map(key => `${key}=${encodeURIComponent(query[key])}`)
    .join('&');

  let html = `<div class="flex items-center justify-between mt-4 pt-4 border-t">`;
  if (page > 1) {
    html += `<button hx-get="/api/${endpoint}?page=${page-1}&${params}" hx-target="#${endpoint.replace('-', '')}TableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Previous</button>`;
  } else {
    html += `<span></span>`;
  }

  // Page number buttons
  html += `<div class="flex items-center space-x-2">`;
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === page) {
      html += `<span class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-9 w-9">${i}</span>`;
    } else {
      html += `<button hx-get="/api/${endpoint}?page=${i}&${params}" hx-target="#${endpoint.replace('-', '')}TableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">${i}</button>`;
    }
  }
  html += `</div>`;

  if (page < totalPages) {
    html += `<button hx-get="/api/${endpoint}?page=${page+1}&${params}" hx-target="#${endpoint.replace('-', '')}TableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Next</button>`;
  } else {
    html += `<span></span>`;
  }
  html += `</div>`;
  return html;
};

// Route setup function
export default function learningRoutes(app) {
  app.get('/api/learning/categories', getLearningCategories);
  app.get('/api/learning/content', getLearningContent);
  app.get('/api/learning/assessments', getLearningAssessments);
  app.get('/api/learning/analytics', getLearningAnalytics);
}