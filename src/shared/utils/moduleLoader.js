/**
 * Module Loader Utility
 *
 * Dynamically loads all modules and collects their routes for mounting.
 */

const fs = require('fs');
const path = require('path');

module.exports = (container) => {
  const modulesDir = path.join(__dirname, '../../modules');
  const modules = {};

  // Load modules
  const moduleNames = fs
    .readdirSync(modulesDir)
    .filter((file) => fs.statSync(path.join(modulesDir, file)).isDirectory());

  for (const moduleName of moduleNames) {
    const modulePath = path.join(modulesDir, moduleName, 'index.js');
    if (fs.existsSync(modulePath)) {
      try {
        const moduleExports = require(modulePath)(container);
        modules[moduleName] = moduleExports;

        // Load routes separately to avoid circular dependency
        const routesDir = path.join(modulesDir, moduleName, 'routes');
        if (fs.existsSync(routesDir)) {
          const loadRoutes = (dir, prefix = '') => {
            const items = fs.readdirSync(dir);
            for (const item of items) {
              const itemPath = path.join(dir, item);
              const stat = fs.statSync(itemPath);
              if (stat.isDirectory()) {
                loadRoutes(itemPath, prefix + item + '/');
              } else if (item === 'index.js') {
                const routeName =
                  prefix
                    .replace(/\//g, '')
                    .replace(/v1/, 'Api')
                    .replace(/pages/, 'Page') + 'Routes';
                try {
                  modules[moduleName][routeName] = require(itemPath);
                } catch (error) {
                  console.error(
                    `Error loading routes for ${moduleName}/${prefix}:`,
                    error
                  );
                }
              }
            }
          };
          loadRoutes(routesDir);
        }
      } catch (error) {
        console.error(`Error loading module ${moduleName}:`, error);
      }
    }
  }

  return modules;
};
