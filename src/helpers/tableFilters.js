// Helper functions for dynamic table filtering
import { getTableConfig } from '../config/tableFilters.js';

/**
 * Apply search and status filters to a Supabase query
 * @param {Object} query - Supabase query object
 * @param {string} tableName - Name of the table
 * @param {Object} reqQuery - Request query parameters
 * @returns {Object} Modified query
 */
const applyTableFilters = (query, tableName, reqQuery) => {
  const config = getTableConfig(tableName);
  if (!config) return query;

  const { search, status } = reqQuery;

  // Apply search filter
  if (search && search.trim() && config.searchableFields?.length) {
    const searchTerm = search.trim();
    const searchConditions = config.searchableFields.map(field =>
      `${field}.ilike.%${searchTerm}%`
    );
    query = query.or(searchConditions.join(','));
  }

  // Apply status filter
  if (status && config.statusOptions) {
    const statusOption = config.statusOptions.find(opt => opt.value === status);
    if (statusOption?.filter) {
      // Custom filter logic for complex status mappings
      query = applyCustomFilter(query, statusOption.filter);
    } else if (config.statusField) {
      query = query.eq(config.statusField, status);
    }
  }

  return query;
};

/**
 * Apply search and status filters to an array of data (client-side filtering)
 * @param {Array} data - Array of data objects
 * @param {Object} reqQuery - Request query parameters
 * @param {Object} tableConfig - Table configuration object
 * @returns {Object} Object with filteredData and statusCounts
 */
const applyTableFiltersToArray = (data, reqQuery, tableConfig) => {
  if (!data || !Array.isArray(data)) return { filteredData: [], statusCounts: {} };

  const { search, status } = reqQuery;
  let filteredData = [...data];

  // Apply search filter
  if (search && search.trim() && tableConfig.searchableFields?.length) {
    const searchTerm = search.toLowerCase().trim();
    filteredData = filteredData.filter(item => {
      return tableConfig.searchableFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchTerm);
      });
    });
  }

  // Apply status filter
  if (status && tableConfig.statusField) {
    const statusOption = tableConfig.statusOptions?.find(opt => opt.value === status);
    if (statusOption?.filter) {
      // Custom filter logic for complex status mappings
      filteredData = applyCustomFilterToArray(filteredData, statusOption.filter, tableConfig.statusField);
    } else {
      filteredData = filteredData.filter(item => item[tableConfig.statusField] === status);
    }
  }

  // Calculate status counts from original data
  const statusCounts = {};
  if (tableConfig.statusField && tableConfig.statusOptions) {
    data.forEach(item => {
      const statusValue = item[tableConfig.statusField];
      if (statusValue !== null && statusValue !== undefined) {
        statusCounts[statusValue] = (statusCounts[statusValue] || 0) + 1;
      }
    });
  }

  return { filteredData, statusCounts };
};

/**
 * Apply custom filter logic to an array for complex status mappings
 * @param {Array} data - Array of data objects
 * @param {string} filterString - Custom filter string (e.g., "is_verified.eq.true")
 * @param {string} statusField - The status field name
 * @returns {Array} Filtered array
 */
const applyCustomFilterToArray = (data, filterString, statusField) => {
  // Parse filter string like "field.operator.value"
  const parts = filterString.split('.');
  if (parts.length === 3) {
    const [field, operator, value] = parts;
    const targetValue = value === 'true' ? true : value === 'false' ? false : value;

    switch (operator) {
      case 'eq':
        return data.filter(item => item[field] === targetValue);
      case 'neq':
        return data.filter(item => item[field] !== targetValue);
      default:
        return data;
    }
  }
  return data;
};

/**
 * Apply custom filter logic for complex status mappings
 * @param {Object} query - Supabase query object
 * @param {string} filterString - Custom filter string (e.g., "is_verified.eq.true")
 * @returns {Object} Modified query
 */
const applyCustomFilter = (query, filterString) => {
  // Parse filter string like "field.operator.value"
  const parts = filterString.split('.');
  if (parts.length === 3) {
    const [field, operator, value] = parts;
    switch (operator) {
      case 'eq':
        return query.eq(field, value === 'true' ? true : value === 'false' ? false : value);
      case 'neq':
        return query.neq(field, value === 'true' ? true : value === 'false' ? false : value);
      case 'gt':
        return query.gt(field, value);
      case 'gte':
        return query.gte(field, value);
      case 'lt':
        return query.lt(field, value);
      case 'lte':
        return query.lte(field, value);
      default:
        return query;
    }
  }
  return query;
};

/**
 * Get status counts for filter buttons
 * @param {string} tableName - Name of the table
 * @param {Object} databaseService - Database service instance
 * @returns {Object} Status counts object
 */
const getStatusCounts = async (tableName, databaseService) => {
  const config = getTableConfig(tableName);
  if (!config || !config.statusOptions?.length) return {};

  try {
    // Handle special table name mappings
    let actualTableName = tableName.replace('-', '_'); // Convert kebab-case to snake_case
    if (tableName === 'users') {
      actualTableName = 'Accounts';
    }

    // Check if any status options have custom filters
    const hasCustomFilters = config.statusOptions.some(option => option.filter);

    if (hasCustomFilters) {
      // For tables with custom filters, count each status separately
      const counts = {};
      for (const option of config.statusOptions) {
        if (option.filter) {
          // Parse custom filter like "is_verified.eq.true"
          const parts = option.filter.split('.');
          if (parts.length === 3) {
            const [field, operator, value] = parts;
            let query = databaseService.supabase
              .from(actualTableName)
              .select(field, { count: 'exact' });

            // Apply the filter condition
            switch (operator) {
              case 'eq':
                query = query.eq(field, value === 'true' ? true : value === 'false' ? false : value);
                break;
              case 'neq':
                query = query.neq(field, value === 'true' ? true : value === 'false' ? false : value);
                break;
              // Add other operators as needed
            }

            const { count, error } = await query;
            if (!error) {
              counts[option.value] = count || 0;
            }
          }
        }
      }
      return counts;
    } else {
      // Standard counting for tables without custom filters
      const { data, error } = await databaseService.supabase
        .from(actualTableName)
        .select(config.statusField);

      if (error) {
        console.error(`Error fetching status counts for ${tableName}:`, error);
        return {};
      }

      // Count occurrences of each status
      const counts = {};
      data.forEach(item => {
        const statusValue = item[config.statusField];
        if (statusValue !== null && statusValue !== undefined) {
          counts[statusValue] = (counts[statusValue] || 0) + 1;
        }
      });

      return counts;
    }
  } catch (error) {
    console.error(`Error in getStatusCounts for ${tableName}:`, error);
    return {};
  }
};

/**
 * Get filter counts formatted for template rendering
 * @param {string} tableName - Name of the table
 * @param {Object} statusCounts - Raw status counts
 * @returns {Object} Formatted filter counts
 */
const getFilterCounts = (tableName, statusCounts = {}) => {
  const config = getTableConfig(tableName);
  if (!config) return {};

  const counts = { all: Object.values(statusCounts).reduce((sum, count) => sum + count, 0) };

  // Add individual status counts
  if (config.statusOptions) {
    config.statusOptions.forEach(option => {
      counts[option.value] = statusCounts[option.value] || 0;
    });
  }

  return counts;
};

export {
  applyTableFilters,
  applyTableFiltersToArray,
  applyCustomFilter,
  getStatusCounts,
  getFilterCounts
};