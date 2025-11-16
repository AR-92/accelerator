/**
 * Admin system stats controller handling system statistics API
 */
class AdminSystemStatsController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  /**
   * Get system stats for HTMX polling (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSystemStatsAPI(req, res) {
    try {
      const systemStats = await this.adminService.getSystemStats();

      // Check if this is an HTMX request
      const isHtmx = req.headers['hx-request'] === 'true';

      if (isHtmx) {
        // Return only the dynamic content (main monitoring area) for HTMX
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Content-Type', 'text/html');

        // Render just the main content part
        const content = `
       <!-- Dynamic Header Info -->
       <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6'>
         <div class='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
           <div class='text-sm text-gray-600 dark:text-gray-400'>
             <div>System Info: <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.platform} ${systemStats.system.arch}</span></div>
           </div>
           <div class='text-sm text-gray-600 dark:text-gray-400'>
             <div>Uptime: <span class='font-medium text-gray-900 dark:text-white'>${systemStats.uptime}</span></div>
             <div>Last Updated: <span class='font-medium text-gray-900 dark:text-white'>${systemStats.timestamp}</span></div>
           </div>
         </div>
       </div>

       <!-- Metrics Row -->
       <div class='grid grid-cols-1 lg:grid-cols-3 gap-6'>
         <!-- CPU Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <div class='flex items-center justify-between mb-4'>
             <h2 class='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
               <svg class='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                 <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'></path>
               </svg>
               CPU
             </h2>
             <div class='text-sm text-gray-600 dark:text-gray-400'>
               ${systemStats.cpu.usage}% | ${systemStats.cpu.cores.length} cores
             </div>
           </div>
           <div class='space-y-3'>
             ${systemStats.cpu.cores
               .map(
                 (core, index) => `
             <div class='flex items-center gap-3'>
               <span class='text-sm font-medium text-gray-700 dark:text-gray-300 w-8'>Core ${index}</span>
               <div class='flex-1'>
                 <div class='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                   <div class='h-2 rounded-full transition-all duration-300 ${core.usage > 80 ? 'bg-red-500' : core.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}' style='width: ${core.usage}%'></div>
                 </div>
               </div>
               <span class='text-sm font-medium ${core.usage > 80 ? 'text-red-600' : core.usage > 60 ? 'text-yellow-600' : 'text-green-600'} w-10 text-right'>${core.usage}%</span>
             </div>
             `
               )
               .join('')}
             <div class='pt-3 border-t border-gray-200 dark:border-gray-700'>
               <div class='grid grid-cols-2 gap-4 text-sm'>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>Model:</span>
                   <span class='font-medium text-gray-900 dark:text-white ml-1'>${systemStats.cpu.model}</span>
                 </div>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>Speed:</span>
                   <span class='font-medium text-gray-900 dark:text-white ml-1'>${systemStats.cpu.frequency} GHz</span>
                 </div>
                 <div class='col-span-2'>
                   <span class='text-gray-600 dark:text-gray-400'>Temperature:</span>
                   <span class='font-medium text-gray-900 dark:text-white ml-1'>${systemStats.cpu.temperature ? systemStats.cpu.temperature + '°C' : 'N/A'}</span>
                 </div>
               </div>
             </div>
             <div class='pt-3'>
               <h3 class='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>CPU Usage History</h3>
               <div class='bg-gray-100 dark:bg-gray-700 rounded p-2'>
                 <pre class='text-xs text-gray-800 dark:text-gray-200 font-mono leading-none' style='font-size: 10px; line-height: 10px;'>${systemStats.graphs.cpu}</pre>
               </div>
             </div>
           </div>
         </div>

         <!-- Memory Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01'></path>
             </svg>
             Memory
           </h2>
           <div class='space-y-4'>
             <div>
               <div class='flex justify-between text-sm mb-2'>
                 <span class='text-gray-700 dark:text-gray-300'>RAM Usage</span>
                 <span class='font-medium'>${systemStats.memory.systemUsed} / ${systemStats.memory.systemTotal} MB</span>
               </div>
               <div class='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
                 <div class='h-3 rounded-full ${systemStats.memory.systemUsed / systemStats.memory.systemTotal > 0.8 ? 'bg-red-500' : systemStats.memory.systemUsed / systemStats.memory.systemTotal > 0.6 ? 'bg-yellow-500' : 'bg-green-500'}' style='width: ${Math.round((systemStats.memory.systemUsed / systemStats.memory.systemTotal) * 100)}%'></div>
               </div>
             </div>
             ${
               systemStats.memory.swapTotal
                 ? `
             <div>
               <div class='flex justify-between text-sm mb-2'>
                 <span class='text-gray-700 dark:text-gray-300'>Swap Usage</span>
                 <span class='font-medium'>${systemStats.memory.swapUsed} / ${systemStats.memory.swapTotal} MB</span>
               </div>
               <div class='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
                 <div class='h-3 rounded-full ${systemStats.memory.swapUsed / systemStats.memory.swapTotal > 0.8 ? 'bg-red-500' : 'bg-blue-500'}' style='width: ${Math.round((systemStats.memory.swapUsed / systemStats.memory.swapTotal) * 100)}%'></div>
               </div>
             </div>
             `
                 : ''
             }
             <div class='grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
               <div class='text-sm'>
                 <span class='text-gray-600 dark:text-gray-400'>Used:</span>
                 <span class='font-medium text-blue-600 ml-1'>${systemStats.memory.systemUsed}M</span>
               </div>
               <div class='text-sm'>
                 <span class='text-gray-600 dark:text-gray-400'>Free:</span>
                 <span class='font-medium text-green-600 ml-1'>${systemStats.memory.systemFree}M</span>
               </div>
               <div class='text-sm'>
                 <span class='text-gray-600 dark:text-gray-400'>Shared:</span>
                 <span class='font-medium text-yellow-600 ml-1'>${systemStats.memory.shared}M</span>
               </div>
               <div class='text-sm'>
                 <span class='text-gray-600 dark:text-gray-400'>Buffers:</span>
                 <span class='font-medium text-purple-600 ml-1'>${systemStats.memory.buffers}M</span>
               </div>
             </div>
           </div>
         </div>

         <!-- Network Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'></path>
             </svg>
             Network
           </h2>
           <div class='space-y-3'>
             ${systemStats.network.stats
               .map(
                 (stat) => `
             <div class='border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0'>
               <h3 class='font-medium text-gray-900 dark:text-white mb-2'>${stat.iface}</h3>
               <div class='grid grid-cols-2 gap-4 text-sm'>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>↓ Download:</span>
                   <span class='font-medium text-blue-600 ml-1'>${stat.download.speed}</span>
                 </div>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>↑ Upload:</span>
                   <span class='font-medium text-red-600 ml-1'>${stat.upload.speed}</span>
                 </div>
               </div>
               <div class='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                 Total: ↓ ${stat.download.total} | ↑ ${stat.upload.total}
               </div>
             </div>
             `
               )
               .join('')}
             ${systemStats.network.stats.length === 0 ? "<div class='text-center text-gray-500 dark:text-gray-400 py-4'>No network data available</div>" : ''}
           </div>
         </div>
       </div>

       <!-- Processes Section -->
       <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
         <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
           <svg class='w-5 h-5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
             <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'></path>
           </svg>
           Top Processes
         </h2>
         <div class='overflow-x-auto'>
           <table class='w-full text-sm'>
             <thead>
               <tr class='border-b border-gray-200 dark:border-gray-700'>
                 <th class='text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>PID</th>
                 <th class='text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>Process</th>
                 <th class='text-right py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>CPU %</th>
                 <th class='text-right py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>Memory %</th>
                 <th class='text-right py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>Memory</th>
                 <th class='text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>User</th>
               </tr>
             </thead>
             <tbody>
               ${systemStats.processes
                 .map(
                   (proc) => `
               <tr class='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'>
                 <td class='py-3 px-2 text-blue-600 font-medium'>${proc.pid}</td>
                 <td class='py-3 px-2 text-gray-900 dark:text-white truncate max-w-xs' title='${proc.command}'>${proc.name}</td>
                 <td class='py-3 px-2 text-right ${proc.cpu > 50 ? 'text-red-600' : proc.cpu > 20 ? 'text-yellow-600' : 'text-green-600'} font-medium'>${proc.cpu}%</td>
                 <td class='py-3 px-2 text-right ${proc.memory > 10 ? 'text-red-600' : proc.memory > 5 ? 'text-yellow-600' : 'text-green-600'} font-medium'>${proc.memory}%</td>
                 <td class='py-3 px-2 text-right text-purple-600 font-medium'>${proc.memoryMB}M</td>
                 <td class='py-3 px-2 text-cyan-600 font-medium'>${proc.user}</td>
               </tr>
               `
                 )
                 .join('')}
             </tbody>
           </table>
         </div>
       </div>

       <!-- Bottom Row -->
       <div class='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6'>
         <!-- Disk I/O Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z'></path>
             </svg>
             Disk I/O
           </h2>
           <div class='space-y-3'>
             ${systemStats.disk.io
               .map(
                 (disk) => `
             <div class='border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0'>
               <h3 class='font-medium text-gray-900 dark:text-white mb-2'>${disk.name}</h3>
               <div class='grid grid-cols-2 gap-2 text-sm'>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>Read:</span>
                   <span class='font-medium text-blue-600 ml-1'>${disk.read}</span>
                 </div>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>Write:</span>
                   <span class='font-medium text-red-600 ml-1'>${disk.write}</span>
                 </div>
               </div>
               <div class='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                 I/O: ${disk.io}/s | Util: ${disk.utilization}%
               </div>
             </div>
             `
               )
               .join('')}
             ${systemStats.disk.io.length === 0 ? "<div class='text-center text-gray-500 dark:text-gray-400 py-4'>No disk I/O data</div>" : ''}
           </div>
         </div>

         <!-- Temperatures Card -->
         ${
           systemStats.temperatures && systemStats.temperatures.length > 0
             ? `
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'></path>
             </svg>
             Temperatures
           </h2>
           <div class='space-y-3'>
             ${systemStats.temperatures
               .map(
                 (temp) => `
             <div class='flex justify-between items-center'>
               <span class='text-gray-700 dark:text-gray-300'>${temp.name}</span>
               <span class='font-medium ${temp.value > 80 ? 'text-red-600' : temp.value > 60 ? 'text-yellow-600' : 'text-green-600'}'>${temp.value}°C</span>
             </div>
             `
               )
               .join('')}
           </div>
         </div>
         `
             : ''
         }

         <!-- Battery Card -->
         ${
           systemStats.battery
             ? `
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3.75 18h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v10.5a1.5 1.5 0 001.5 1.5z'></path>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21.75 9h1.5a1.5 1.5 0 010 3h-1.5'></path>
             </svg>
             Battery
           </h2>
           <div class='space-y-4'>
             <div>
               <div class='flex justify-between text-sm mb-2'>
                 <span class='text-gray-700 dark:text-gray-300'>Level</span>
                 <span class='font-medium'>${systemStats.battery.level}%</span>
               </div>
               <div class='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
                 <div class='h-3 rounded-full ${systemStats.battery.level < 20 ? 'bg-red-500' : systemStats.battery.level < 50 ? 'bg-yellow-500' : 'bg-green-500'}' style='width: ${systemStats.battery.level}%'></div>
               </div>
             </div>
             <div class='space-y-2 text-sm'>
               <div class='flex justify-between'>
                 <span class='text-gray-600 dark:text-gray-400'>Status:</span>
                 <span class='font-medium'>${systemStats.battery.status}</span>
               </div>
               ${
                 systemStats.battery.timeRemaining
                   ? `
               <div class='flex justify-between'>
                 <span class='text-gray-600 dark:text-gray-400'>Time remaining:</span>
                 <span class='font-medium'>${systemStats.battery.timeRemaining}</span>
               </div>
               `
                   : ''
               }
             </div>
           </div>
         </div>
         `
             : ''
         }

         <!-- System Info Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6${systemStats.temperatures && systemStats.temperatures.length > 0 && systemStats.battery ? '' : ' xl:col-span-2'}'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-cyan-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
             </svg>
             System Information
           </h2>
           <div class='grid grid-cols-1 gap-3 text-sm'>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Platform:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.platform}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Architecture:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.arch}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Kernel:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.kernel}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Distribution:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.distro}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Model:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.model}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Node.js:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.nodeVersion}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Process ID:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.pid}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Load Average:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.loadAverage[0]}, ${systemStats.loadAverage[1]}, ${systemStats.loadAverage[2]}</span>
             </div>
           </div>
         </div>
       </div>`;

        res.send(content);
      } else {
        // Return JSON for API calls
        res.json({
          success: true,
          systemStats,
        });
      }
    } catch (error) {
      console.error('Error getting system stats for API:', error);

      if (req.headers['hx-request'] === 'true') {
        // Return error HTML for HTMX
        res.status(500).send(`
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <div class="flex items-center">
              <p class="font-bold">Error:</p>
              <p class="ml-2">Failed to retrieve system statistics. Please try again.</p>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to retrieve system statistics',
        });
      }
    }
  }
}

module.exports = AdminSystemStatsController;
