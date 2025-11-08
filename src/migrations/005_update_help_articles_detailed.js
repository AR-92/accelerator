/**
 * Migration: Update help articles with very detailed, comprehensive content
 * Enhances all existing articles with in-depth information and better readability
 */

module.exports = {
  up: async (db) => {
    console.log('Updating help articles with detailed content...');

    // Update Creating Your First Project
    await db.run(`
      UPDATE help_articles SET
        excerpt = 'Start your entrepreneurial journey by creating your first project - a comprehensive guide to getting started',
        content = '<h2>Creating Your First Project: A Complete Guide</h2>
       <p>Welcome to the Accelerator Platform! Creating your first project is the crucial first step in transforming your entrepreneurial vision into reality. This comprehensive guide will walk you through every aspect of project creation, from initial concept to full implementation.</p>

       <h3>Why Projects Matter in Entrepreneurship</h3>
       <p>Projects serve as the foundation of your entrepreneurial journey. They provide structure, help you organize your ideas, and create a roadmap for turning concepts into successful businesses. Each project becomes a container for your business development activities, market research, financial planning, and team collaboration.</p>

       <h3>Step-by-Step Project Creation Process</h3>
       <ol>
         <li><strong>Access the Project Creation Interface</strong><br>Navigate to the sidebar and locate the prominent "New Project" button. This button is strategically placed for easy access and features an intuitive plus icon to indicate creation functionality.</li>
         <li><strong>Choose a Compelling Project Name</strong><br>Your project name should be descriptive yet concise. Consider including key identifiers like your target market, solution type, or unique value proposition. Examples: "Eco-Friendly Meal Delivery Service" or "AI-Powered Fitness Coaching Platform".</li>
         <li><strong>Craft a Detailed Project Description</strong><br>Write a comprehensive description that covers:<br>• The problem you are solving<br>• Your target audience<br>• Your proposed solution<br>• Key benefits and competitive advantages<br>• Market opportunity and potential impact</li>
         <li><strong>Select the Appropriate Industry Category</strong><br>Choose from our extensive list of industry categories including Technology, Healthcare, E-commerce, Education, Finance, Real Estate, Manufacturing, and many more. Selecting the right category ensures your project appears in relevant searches and connects with appropriate mentors.</li>
         <li><strong>Configure Initial Project Settings</strong><br>Set privacy preferences, collaboration options, and notification settings. Decide whether to make your project public for community feedback or keep it private during initial development.</li>
         <li><strong>Finalize and Launch Your Project</strong><br>Review all entered information, then click "Create Project" to officially launch your entrepreneurial venture on the platform.</li>
       </ol>

       <h3>Essential Project Organization Strategies</h3>
       <h4>Naming Conventions That Work</h4>
       <ul>
         <li><strong>Descriptive and Specific:</strong> Instead of "My App," use "Sustainable Urban Farming Mobile App"</li>
         <li><strong>SEO-Friendly:</strong> Include relevant keywords that potential investors might search for</li>
         <li><strong>Memorable:</strong> Create names that are easy to remember and pronounce</li>
         <li><strong>Scalable:</strong> Choose names that can grow with your business expansion</li>
       </ul>

       <h4>Writing Effective Project Descriptions</h4>
       <p>Your project description is often the first impression potential investors, mentors, or collaborators will have of your venture. Make it count:</p>
       <ul>
         <li><strong>Start with the Problem:</strong> Clearly articulate the pain point you are addressing</li>
         <li><strong>Define Your Solution:</strong> Explain how your product or service solves the identified problem</li>
         <li><strong>Quantify the Opportunity:</strong> Include market size, potential revenue, and growth projections</li>
         <li><strong>Highlight Your Unique Value Proposition:</strong> What makes your solution different and better?</li>
         <li><strong>Include Social Proof:</strong> Mention any early validation, beta users, or initial traction</li>
       </ul>

       <h3>Industry Category Selection Guide</h3>
       <p>Choosing the right industry category is crucial for several reasons:</p>
       <ul>
         <li><strong>Targeted Networking:</strong> Connect with mentors and peers in your specific industry</li>
         <li><strong>Relevant Resources:</strong> Access industry-specific templates, case studies, and tools</li>
         <li><strong>Investor Matching:</strong> Get discovered by investors interested in your sector</li>
         <li><strong>Market Intelligence:</strong> Receive AI recommendations tailored to your industry</li>
       </ul>

       <h4>Popular Industry Categories and Considerations</h4>
       <table>
         <thead>
           <tr>
             <th>Industry</th>
             <th>Key Considerations</th>
             <th>Growth Potential</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td><strong>Technology/SaaS</strong></td>
             <td>Scalability, technical expertise, competitive landscape</td>
             <td>High - Recurring revenue model</td>
           </tr>
           <tr>
             <td><strong>E-commerce</strong></td>
             <td>Supply chain, customer acquisition, logistics</td>
             <td>High - Direct-to-consumer trends</td>
           </tr>
           <tr>
             <td><strong>Healthcare</strong></td>
             <td>Regulatory compliance, clinical validation, insurance</td>
             <td>Medium-High - Aging population needs</td>
           </tr>
           <tr>
             <td><strong>Education</strong></td>
             <td>Content quality, accreditation, technology integration</td>
             <td>Medium - Steady demand with innovation opportunities</td>
           </tr>
         </tbody>
       </table>

       <h3>Advanced Project Setup Features</h3>
       <h4>Privacy and Collaboration Settings</h4>
       <ul>
         <li><strong>Public Projects:</strong> Allow community feedback and increase visibility</li>
         <li><strong>Private Projects:</strong> Keep sensitive information confidential during development</li>
         <li><strong>Team Collaboration:</strong> Invite specific team members with different permission levels</li>
         <li><strong>Mentor Access:</strong> Grant read-only access to industry experts</li>
       </ul>

       <h4>Integration and Automation</h4>
       <p>Once your project is created, you can integrate various tools and set up automations:</p>
       <ul>
         <li><strong>Calendar Integration:</strong> Sync project milestones with your personal calendar</li>
         <li><strong>Communication Tools:</strong> Connect Slack, Microsoft Teams, or other collaboration platforms</li>
         <li><strong>Document Storage:</strong> Link Google Drive, Dropbox, or other cloud storage solutions</li>
         <li><strong>Financial Tracking:</strong> Integrate accounting software for expense tracking</li>
       </ul>

       <h3>Common Project Creation Mistakes to Avoid</h3>
       <ol>
         <li><strong>Vague Descriptions:</strong> Be specific about your solution and target market</li>
         <li><strong>Overly Broad Scope:</strong> Start with a focused problem-solution fit</li>
         <li><strong>Ignoring Competition:</strong> Research and acknowledge existing solutions</li>
         <li><strong>Unrealistic Timelines:</strong> Build in buffer time for unexpected challenges</li>
         <li><strong>Lack of Measurable Goals:</strong> Define clear success metrics from day one</li>
       </ol>

       <h3>Next Steps After Project Creation</h3>
       <p>Once your project is live, focus on these immediate next steps:</p>
       <ol>
         <li><strong>Build Your Team:</strong> Identify key roles and start recruiting talent</li>
         <li><strong>Conduct Market Research:</strong> Validate your assumptions with real user data</li>
         <li><strong>Create a Prototype:</strong> Build a minimum viable product to test your concept</li>
         <li><strong>Develop Financial Projections:</strong> Create realistic revenue and expense forecasts</li>
         <li><strong>Network Actively:</strong> Connect with mentors, investors, and potential partners</li>
       </ol>

       <blockquote>
         <p>"The best way to predict the future is to create it." - Peter Drucker</p>
         <p>This quote perfectly captures the essence of project creation on our platform. Every successful business started as a single project, carefully planned and executed with vision and determination.</p>
       </blockquote>

       <h3>Getting Help and Support</h3>
       <p>If you encounter any difficulties during project creation or need guidance on best practices, our support team is here to help. You can:</p>
       <ul>
         <li>Access our comprehensive help documentation</li>
         <li>Contact support through the in-app chat system</li>
         <li>Join community forums for peer advice</li>
         <li>Schedule one-on-one sessions with platform mentors</li>
       </ul>

       <p>Remember, every expert was once a beginner. Your first project is the foundation of your entrepreneurial journey, and we are committed to supporting you every step of the way.</p>',
        read_time_minutes = 12,
        tags = '["getting-started", "projects", "setup", "entrepreneurship", "business-planning"]'
      WHERE slug = 'creating-your-first-project'
    `);

    // Update Navigating the Dashboard
    await db.run(`
      UPDATE help_articles SET
        excerpt = 'Master the Accelerator Platform dashboard - your command center for entrepreneurial success',
        content = '<h2>Mastering the Accelerator Platform Dashboard</h2>
       <p>Your dashboard is the nerve center of your entrepreneurial journey on the Accelerator Platform. This comprehensive guide will transform you from a platform newcomer to a power user, capable of leveraging every feature and tool to accelerate your business growth.</p>

       <h3>The Dashboard Philosophy: Your Entrepreneurial Command Center</h3>
       <p>Think of your dashboard as the bridge of a spaceship, where all critical systems converge. Every element is strategically placed to provide maximum efficiency and insight. Understanding this layout is crucial for maintaining momentum in your entrepreneurial endeavors.</p>

       <h3>Core Dashboard Components: A Detailed Breakdown</h3>

       <h4>1. Global Navigation Sidebar</h4>
       <p>The sidebar is your primary navigation hub, featuring a clean, collapsible design that adapts to your workflow needs.</p>
       <ul>
         <li><strong>Dashboard Overview:</strong> Your personalized home screen with key metrics and recent activity</li>
         <li><strong>Projects Section:</strong> Access all your active ventures and create new ones</li>
         <li><strong>Ideas Generator:</strong> AI-powered ideation tools for business concept development</li>
         <li><strong>AI Assistant:</strong> Intelligent chatbot for business advice and analysis</li>
         <li><strong>Portfolio:</strong> Showcase of your business development progress</li>
         <li><strong>Collaborate:</strong> Team management and communication tools</li>
         <li><strong>Reports:</strong> Advanced analytics and business intelligence</li>
         <li><strong>Settings:</strong> Account management and platform preferences</li>
       </ul>

       <h4>2. Main Content Area: Dynamic and Contextual</h4>
       <p>The main content area transforms based on your current activity, providing contextual information and tools.</p>
       <ul>
         <li><strong>Responsive Grid Layout:</strong> Adapts from single column on mobile to multi-column on desktop</li>
         <li><strong>Widget-Based Design:</strong> Customizable information blocks for personalized insights</li>
         <li><strong>Real-Time Updates:</strong> Live data synchronization across all connected devices</li>
         <li><strong>Progressive Loading:</strong> Fast initial load with content streaming for optimal performance</li>
       </ul>

       <h4>3. Top Navigation Bar: Quick Access and System Controls</h4>
       <ul>
         <li><strong>Search Functionality:</strong> Global search across projects, ideas, and documentation</li>
         <li><strong>Notification Center:</strong> Real-time alerts for important updates and deadlines</li>
         <li><strong>User Profile Menu:</strong> Quick access to account settings and logout</li>
         <li><strong>Help & Support:</strong> Integrated assistance and documentation access</li>
       </ul>

       <h3>Dashboard Customization: Tailoring Your Experience</h3>

       <h4>Widget Management System</h4>
       <p>Personalize your dashboard with widgets that matter most to your workflow:</p>
       <ul>
         <li><strong>Project Progress Tracker:</strong> Visual progress bars for all active projects</li>
         <li><strong>Financial Overview:</strong> Key financial metrics and budget tracking</li>
         <li><strong>Team Activity Feed:</strong> Real-time updates from your collaboration network</li>
         <li><strong>AI Insights Panel:</strong> Latest AI-generated recommendations and analysis</li>
         <li><strong>Market Intelligence:</strong> Industry trends and competitor analysis</li>
         <li><strong>Goal Achievement:</strong> Milestone tracking and objective progress</li>
       </ul>

       <h4>Layout Preferences</h4>
       <ul>
         <li><strong>Compact Mode:</strong> Maximize information density for power users</li>
         <li><strong>Spacious Mode:</strong> Improved readability with generous white space</li>
         <li><strong>Dark/Light Theme:</strong> Eye-strain reduction and personal preference</li>
         <li><strong>Language Settings:</strong> Full internationalization support</li>
       </ul>

       <h3>Advanced Dashboard Features: Power User Capabilities</h3>

       <h4>Keyboard Shortcuts and Power User Features</h4>
       <table>
         <thead>
           <tr>
             <th>Shortcut</th>
             <th>Function</th>
             <th>Use Case</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td><code>Ctrl/Cmd + K</code></td>
             <td>Global Search</td>
             <td>Quick navigation across the platform</td>
           </tr>
           <tr>
             <td><code>Ctrl/Cmd + N</code></td>
             <td>New Project</td>
             <td>Rapid project ideation</td>
           </tr>
           <tr>
             <td><code>Ctrl/Cmd + /</code></td>
             <td>AI Assistant</td>
             <td>Instant AI consultation</td>
           </tr>
           <tr>
             <td><code>Ctrl/Cmd + B</code></td>
             <td>Toggle Sidebar</td>
             <td>Maximize workspace</td>
           </tr>
           <tr>
             <td><code>Ctrl/Cmd + .</code></td>
             <td>Quick Actions</td>
             <td>Contextual command palette</td>
           </tr>
         </tbody>
       </table>

       <h4>Dashboard Analytics and Insights</h4>
       <ul>
         <li><strong>Productivity Metrics:</strong> Track your entrepreneurial activity patterns</li>
         <li><strong>Project Velocity:</strong> Measure development speed and milestone achievement</li>
         <li><strong>Collaboration Index:</strong> Quantify team engagement and communication effectiveness</li>
         <li><strong>AI Utilization Score:</strong> Measure how effectively you leverage platform AI tools</li>
         <li><strong>Network Growth:</strong> Track expansion of your professional and entrepreneurial network</li>
       </ul>

       <h3>Workflow Optimization Strategies</h3>

       <h4>Morning Dashboard Routine</h4>
       <ol>
         <li><strong>Review Key Metrics:</strong> Check overnight progress and system updates</li>
         <li><strong>Prioritize Tasks:</strong> Identify the highest-impact activities for the day</li>
         <li><strong>Check Communications:</strong> Respond to team messages and mentor feedback</li>
         <li><strong>Plan Your Day:</strong> Set specific, measurable goals for the workday</li>
         <li><strong>Activate AI Assistant:</strong> Get daily business insights and recommendations</li>
       </ol>

       <h4>Efficient Navigation Patterns</h4>
       <ul>
         <li><strong>Context Switching:</strong> Use browser tabs for different projects while maintaining dashboard overview</li>
         <li><strong>Bookmark Critical Views:</strong> Save frequently accessed dashboard configurations</li>
         <li><strong>Notification Management:</strong> Configure alerts to match your attention patterns</li>
         <li><strong>Batch Processing:</strong> Group similar tasks for efficient workflow execution</li>
       </ul>

       <h3>Dashboard Maintenance and Best Practices</h3>

       <h4>Regular Cleanup Routines</h4>
       <ul>
         <li><strong>Weekly Review:</strong> Archive completed projects and update active ones</li>
         <li><strong>Monthly Audit:</strong> Comprehensive reviews of systems and processes</li>
         <li><strong>Quarterly Reset:</strong> Evaluate and refresh dashboard configuration</li>
         <li><strong>Performance Monitoring:</strong> Track dashboard load times and optimize as needed</li>
       </ul>

       <h4>Data Management Strategies</h4>
       <ul>
         <li><strong>Regular Backups:</strong> Ensure all project data is safely stored</li>
         <li><strong>Export Capabilities:</strong> Maintain offline copies of critical information</li>
         <li><strong>Data Organization:</strong> Implement consistent naming and tagging conventions</li>
         <li><strong>Privacy Controls:</strong> Manage data sharing permissions appropriately</li>
       </ul>

       <h3>Troubleshooting Common Dashboard Issues</h3>

       <h4>Loading Performance Problems</h4>
       <ul>
         <li><strong>Browser Cache:</strong> Clear cache and cookies for optimal performance</li>
         <li><strong>Widget Optimization:</strong> Remove resource-intensive widgets temporarily</li>
         <li><strong>Network Issues:</strong> Check internet connection and retry</li>
         <li><strong>Browser Updates:</strong> Ensure you are using a supported, updated browser</li>
       </ul>

       <h4>Display and Layout Issues</h4>
       <ul>
         <li><strong>Responsive Design:</strong> Test across different screen sizes and devices</li>
         <li><strong>Theme Conflicts:</strong> Reset to default theme if visual issues occur</li>
         <li><strong>Widget Positioning:</strong> Drag and drop widgets to preferred locations</li>
         <li><strong>Zoom Settings:</strong> Reset browser zoom to 100% for consistent display</li>
       </ul>

       <h3>Future Dashboard Enhancements</h3>
       <p>Our platform continuously evolves based on user feedback and technological advancements. Upcoming dashboard features include:</p>
       <ul>
         <li><strong>Advanced AI Integration:</strong> Predictive analytics and automated insights</li>
         <li><strong>Collaborative Dashboards:</strong> Shared workspaces for team projects</li>
         <li><strong>Mobile Optimization:</strong> Enhanced mobile dashboard experience</li>
         <li><strong>Voice Commands:</strong> Hands-free dashboard interaction</li>
         <li><strong>Augmented Reality:</strong> AR overlays for project visualization</li>
       </ul>

       <blockquote>
         <p>"Your dashboard is not just a tool—it's your entrepreneurial nervous system. Master it, and you'll master your business destiny."</p>
         <p>The most successful entrepreneurs on our platform don't just use the dashboard; they understand it deeply and leverage its full potential to accelerate their growth.</p>
       </blockquote>

       <h3>Getting Expert Help</h3>
       <p>While this guide provides comprehensive dashboard knowledge, sometimes you need personalized assistance. Our expert support team is available through multiple channels:</p>
       <ul>
         <li><strong>Live Chat Support:</strong> Instant assistance for urgent dashboard issues</li>
         <li><strong>Video Tutorials:</strong> Step-by-step visual guides for complex features</li>
         <li><strong>Community Forums:</strong> Peer-to-peer support and best practice sharing</li>
         <li><strong>Personal Coaching:</strong> One-on-one sessions with platform experts</li>
         <li><strong>Documentation Library:</strong> Comprehensive reference materials and FAQs</li>
       </ul>

       <p>Remember, your dashboard is your entrepreneurial command center. Invest time in understanding it thoroughly, and it will serve you faithfully as you build your business empire.</p>',
        read_time_minutes = 15,
        tags = '["dashboard", "navigation", "interface", "productivity", "workflow"]'
      WHERE slug = 'navigating-the-dashboard'
    `);

    console.log('Help articles updated with detailed content successfully');
  },

  down: async (db) => {
    // Revert to original shorter content
    await db.run(`
      UPDATE help_articles SET
        excerpt = 'Start your entrepreneurial journey by creating your first project',
        content = '<h2>Creating Your First Project</h2>
       <p>Start your entrepreneurial journey by creating your first project. This will be the foundation for all your startup activities.</p>

       <h3>Step-by-Step Guide</h3>
       <ol>
         <li>Click the "New Project" button in the sidebar</li>
         <li>Enter a descriptive name for your project</li>
         <li>Add a brief description of your idea</li>
         <li>Choose your industry category</li>
         <li>Click "Create Project" to get started</li>
       </ol>

       <h3>Project Organization Tips</h3>
       <ul>
         <li>Use clear, descriptive names</li>
         <li>Include key details in the description</li>
         <li>Choose the most relevant industry category</li>
         <li>Consider your target audience and market</li>
       </ul>',
        read_time_minutes = 5,
        tags = '["getting-started", "projects", "setup"]'
      WHERE slug = 'creating-your-first-project'
    `);

    await db.run(`
      UPDATE help_articles SET
        excerpt = 'Familiarize yourself with the main areas of our platform',
        content = '<h2>Understanding the Dashboard</h2>
       <p>Familiarize yourself with the main areas of our platform to make the most of your experience.</p>

       <h3>Main Navigation Areas</h3>
       <ul>
         <li><strong>Sidebar:</strong> Access all main features and tools</li>
         <li><strong>Dashboard:</strong> Overview of your projects and progress</li>
         <li><strong>Ideas:</strong> Browse and generate new business ideas</li>
         <li><strong>AI Assistant:</strong> Get AI-powered recommendations</li>
         <li><strong>Portfolio:</strong> Track your business development</li>
       </ul>

       <h3>Quick Start Checklist</h3>
       <ol>
         <li>Complete your profile setup</li>
         <li>Create your first project</li>
         <li>Explore AI-generated ideas</li>
         <li>Build your business model</li>
         <li>Connect with mentors and peers</li>
       </ol>',
        read_time_minutes = 4,
        tags = '["dashboard", "navigation", "interface"]'
      WHERE slug = 'navigating-the-dashboard'
    `);

    console.log('Help articles reverted to original content');
  },
};
