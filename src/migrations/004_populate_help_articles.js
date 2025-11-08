/**
 * Migration: Populate help articles with comprehensive content
 * Adds detailed articles for all help categories based on existing templates
 */

module.exports = {
  up: async (db) => {
    // Insert comprehensive articles for Getting Started category
    const insertGettingStartedArticles = `
      INSERT OR IGNORE INTO help_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name, author_bio
      ) VALUES
       (1, 'Creating Your First Project',
        'creating-your-first-project',
        'Start your entrepreneurial journey by creating your first project - a comprehensive guide to getting started',
        '<h2>Creating Your First Project: A Complete Guide</h2>
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
         <li><strong>SEO-Friendly:</strong> Include relevant keywords that potential investors or partners might search for</li>
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
        12, 'beginner', '["getting-started", "projects", "setup", "entrepreneurship", "business-planning"]', 1, 'Support Team', 'Accelerator Platform Support'),

       (1, 'Navigating the Dashboard',
        'navigating-the-dashboard',
        'Master the Accelerator Platform dashboard - your command center for entrepreneurial success',
        '<h2>Mastering the Accelerator Platform Dashboard</h2>
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
         <li><strong>Monthly Audit:</strong> Remove unused widgets and optimize layout</li>
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
        15, 'beginner', '["dashboard", "navigation", "interface", "productivity", "workflow"]', 0, 'Support Team', 'Accelerator Platform Support'),

       (1, 'Setting Up Your Profile',
        'setting-up-your-profile',
        'Create a compelling entrepreneur profile that attracts investors, mentors, and collaborators',
        '<h2>Building Your Entrepreneurial Identity: Complete Profile Setup Guide</h2>
       <p>Your profile is more than just a digital business card—it's your entrepreneurial brand, your credibility statement, and your networking superpower. This comprehensive guide will transform your profile from a basic account into a powerful business development tool that opens doors and creates opportunities.</p>

       <h3>The Strategic Importance of Your Profile</h3>
       <p>In the competitive world of entrepreneurship, your profile serves multiple critical functions beyond mere identification. It acts as your personal brand ambassador, credibility validator, and opportunity magnet. A well-crafted profile can:</p>
       <ul>
         <li><strong>Attract Investment:</strong> Showcase your track record and potential to investors</li>
         <li><strong>Build Credibility:</strong> Demonstrate expertise and commitment to your field</li>
         <li><strong>Network Effectively:</strong> Connect with mentors, partners, and peers</li>
         <li><strong>Access Opportunities:</strong> Get discovered for speaking engagements and collaborations</li>
         <li><strong>Accelerate Growth:</strong> Leverage platform features for faster business development</li>
       </ul>

       <h3>Profile Setup: A Systematic Approach</h3>

       <h4>Phase 1: Foundation - Basic Information Setup</h4>
       <p>Start with the fundamentals that establish your professional identity:</p>

       <h5>Personal Information Configuration</h5>
       <ul>
         <li><strong>Full Legal Name:</strong> Use your complete professional name as it appears on business documents</li>
         <li><strong>Professional Title:</strong> Choose a title that reflects your current role and aspirations (e.g., "Serial Entrepreneur & Tech Innovator" vs. just "Founder")</li>
         <li><strong>Location Details:</strong> Include city, state/province, and country for networking and collaboration opportunities</li>
         <li><strong>Time Zone:</strong> Critical for scheduling meetings and managing global collaborations</li>
         <li><strong>Professional Photo:</strong> Use a high-quality headshot that conveys approachability and professionalism</li>
       </ul>

       <h5>Biography Crafting: Your Elevator Pitch</h5>
       <p>Your bio is your 30-second introduction to the entrepreneurial world. Make it compelling:</p>
       <ul>
         <li><strong>Hook Immediately:</strong> Start with what makes you unique or your biggest achievement</li>
         <li><strong>Establish Credibility:</strong> Include relevant experience, education, and accomplishments</li>
         <li><strong>Show Passion:</strong> Convey genuine enthusiasm for your entrepreneurial journey</li>
         <li><strong>Call to Action:</strong> End with what you are seeking (investment, mentorship, partnerships)</li>
         <li><strong>Keep it Concise:</strong> Aim for 150-200 words that can be read in 30 seconds</li>
       </ul>

       <h4>Phase 2: Expertise - Skills and Specializations</h4>

       <h5>Skills Inventory and Validation</h5>
       <p>Be strategic about the skills you highlight:</p>
       <table>
         <thead>
           <tr>
             <th>Skill Category</th>
             <th>Examples</th>
             <th>Why It Matters</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td><strong>Technical Skills</strong></td>
             <td>Programming, Data Analysis, Product Design</td>
             <td>Demonstrates execution capability</td>
           </tr>
           <tr>
             <td><strong>Business Skills</strong></td>
             <td>Strategy, Finance, Marketing, Operations</td>
             <td>Shows business acumen</td>
           </tr>
           <tr>
             <td><strong>Soft Skills</strong></td>
             <td>Leadership, Communication, Problem-Solving</td>
             <td>Indicates team management potential</td>
           </tr>
           <tr>
             <td><strong>Industry Knowledge</strong></td>
             <td>Healthcare, FinTech, E-commerce, AI/ML</td>
             <td>Establishes domain expertise</td>
           </tr>
         </tbody>
       </table>

       <h5>Experience Documentation</h5>
       <ul>
         <li><strong>Professional Experience:</strong> Include both entrepreneurial ventures and corporate roles</li>
         <li><strong>Educational Background:</strong> Highlight relevant degrees and certifications</li>
         <li><strong>Achievements and Awards:</strong> Showcase recognitions, funding raised, and business milestones</li>
         <li><strong>Publications and Speaking:</strong> Include articles, podcasts, and conference appearances</li>
         <li><strong>Board Positions:</strong> Note advisory roles and board memberships</li>
       </ul>

       <h4>Phase 3: Networking - Professional Connections</h4>

       <h5>Social Media Integration</h5>
       <p>Connect your professional online presence:</p>
       <ul>
         <li><strong>LinkedIn:</strong> Primary professional networking platform</li>
         <li><strong>Twitter:</strong> Industry insights and thought leadership</li>
         <li><strong>GitHub:</strong> Technical projects and open-source contributions</li>
         <li><strong>Personal Website:</strong> Portfolio and detailed project showcases</li>
         <li><strong>YouTube Channel:</strong> Educational content and product demonstrations</li>
       </ul>

       <h5>Platform-Specific Profiles</h5>
       <ul>
         <li><strong>AngelList:</strong> Startup-focused networking and fundraising</li>
         <li><strong>Crunchbase:</strong> Company and people database for due diligence</li>
         <li><strong>Product Hunt:</strong> Tech product launches and community</li>
         <li><strong>Indie Hackers:</strong> Bootstrapper community and revenue sharing</li>
       </ul>

       <h4>Phase 4: Preferences - Personalization and Privacy</h4>

       <h5>Notification Management Strategy</h5>
       <p>Configure notifications to maximize productivity without information overload:</p>
       <ul>
         <li><strong>Project Updates:</strong> High priority - immediate notifications</li>
         <li><strong>Team Messages:</strong> High priority - immediate notifications</li>
         <li><strong>Mentor Feedback:</strong> High priority - immediate notifications</li>
         <li><strong>Platform Announcements:</strong> Medium priority - daily digest</li>
         <li><strong>Community Activity:</strong> Low priority - weekly summary</li>
         <li><strong>Marketing Communications:</strong> Opt-in only - monthly digest</li>
       </ul>

       <h5>Privacy Controls and Data Sharing</h5>
       <ul>
         <li><strong>Profile Visibility:</strong> Choose between public, network-only, or private</li>
         <li><strong>Contact Information:</strong> Control what contact details are publicly visible</li>
         <li><strong>Project Sharing:</strong> Decide which projects to showcase publicly</li>
         <li><strong>Analytics Tracking:</strong> Opt-in/out of platform usage analytics</li>
         <li><strong>Data Export:</strong> Ability to download your data at any time</li>
       </ul>

       <h3>Advanced Profile Optimization Techniques</h3>

       <h4>SEO and Discoverability</h4>
       <ul>
         <li><strong>Keyword Optimization:</strong> Include relevant industry keywords in your bio and skills</li>
         <li><strong>Complete Profile:</strong> Fill out every section to maximize profile completeness score</li>
         <li><strong>Regular Updates:</strong> Keep your profile current with recent achievements</li>
         <li><strong>Cross-Platform Consistency:</strong> Maintain consistent branding across all platforms</li>
       </ul>

       <h4>Profile Analytics and Improvement</h4>
       <p>Track and optimize your profile performance:</p>
       <ul>
         <li><strong>Profile Views:</strong> Monitor who is viewing your profile</li>
         <li><strong>Connection Requests:</strong> Track networking effectiveness</li>
         <li><strong>Project Interest:</strong> Measure which projects attract the most attention</li>
         <li><strong>Response Rates:</strong> Track communication effectiveness</li>
       </ul>

       <h3>Profile Types and Strategies</h3>

       <h4>For Early-Stage Entrepreneurs</h4>
       <ul>
         <li><strong>Focus on Potential:</strong> Emphasize vision, energy, and innovative thinking</li>
         <li><strong>Highlight Education:</strong> Showcase relevant academic achievements</li>
         <li><strong>Demonstrate Initiative:</strong> Include personal projects and self-directed learning</li>
         <li><strong>Show Traction:</strong> Any early validation, users, or revenue</li>
       </ul>

       <h4>For Experienced Entrepreneurs</h4>
       <ul>
         <li><strong>Quantify Success:</strong> Include specific metrics and outcomes</li>
         <li><strong>Showcase Track Record:</strong> Highlight successful exits and funding raised</li>
         <li><strong>Mentor Network:</strong> Display advisory roles and speaking engagements</li>
         <li><strong>Industry Recognition:</strong> Include awards, publications, and board positions</li>
       </ul>

       <h4>For Corporate Intrapreneurs</h4>
       <ul>
         <li><strong>Bridge Experience:</strong> Connect corporate and startup worlds</li>
         <li><strong>Resource Access:</strong> Highlight corporate resources and networks</li>
         <li><strong>Scalability Mindset:</strong> Demonstrate understanding of growth challenges</li>
         <li><strong>Risk Management:</strong> Show balanced approach to innovation</li>
       </ul>

       <h3>Common Profile Mistakes and How to Avoid Them</h3>

       <h4>Content Quality Issues</h4>
       <ol>
         <li><strong>Generic Bios:</strong> Avoid bland descriptions; be specific and compelling</li>
         <li><strong>Incomplete Information:</strong> Fill out every relevant field</li>
         <li><strong>Typos and Errors:</strong> Proofread carefully; consider professional editing</li>
         <li><strong>Outdated Content:</strong> Regularly update with recent achievements</li>
         <li><strong>Overly Salesy Tone:</strong> Be authentic rather than promotional</li>
       </ol>

       <h4>Privacy and Security Concerns</h4>
       <ul>
         <li><strong>Information Overload:</strong> Don not share sensitive personal information</li>
         <li><strong>Contact Information:</strong> Use professional email and phone numbers</li>
         <li><strong>Photo Appropriateness:</strong> Choose professional, appropriate images</li>
         <li><strong>Confidential Information:</strong> Never share proprietary or confidential data</li>
       </ul>

       <h3>Profile Maintenance and Evolution</h3>

       <h4>Regular Update Schedule</h4>
       <ul>
         <li><strong>Weekly:</strong> Add new connections and update project progress</li>
         <li><strong>Monthly:</strong> Review and update skills and experience</li>
         <li><strong>Quarterly:</strong> Conduct comprehensive profile audit and refresh</li>
         <li><strong>Annually:</strong> Major updates for career milestones and achievements</li>
       </ul>

       <h4>Profile Optimization Checklist</h4>
       <ul>
         <li>☐ Professional photo that conveys approachability and competence</li>
         <li>☐ Compelling headline that captures attention</li>
         <li>☐ Detailed bio with clear value proposition</li>
         <li>☐ Comprehensive skills and expertise listing</li>
         <li>☐ Complete experience and education history</li>
         <li>☐ Active social media and professional network connections</li>
         <li>☐ Optimized privacy and notification settings</li>
         <li>☐ Regular performance monitoring and updates</li>
       </ul>

       <blockquote>
         <p>"Your profile is your entrepreneurial currency. Invest in it wisely, maintain it diligently, and it will return dividends in opportunities, connections, and success."</p>
         <p>In the world of entrepreneurship, your profile is often your first impression. Make it count by presenting yourself as the capable, visionary leader you are.</p>
       </blockquote>

       <h3>Getting Profile Setup Assistance</h3>
       <p>Profile optimization is both an art and a science. If you need help crafting the perfect entrepreneurial profile, our platform offers multiple support options:</p>
       <ul>
         <li><strong>Profile Review Service:</strong> Expert analysis and improvement recommendations</li>
         <li><strong>Template Library:</strong> Proven profile templates for different entrepreneurial stages</li>
         <li><strong>Writing Assistance:</strong> Help crafting compelling bios and descriptions</li>
         <li><strong>Photo Optimization:</strong> Professional headshot and branding guidance</li>
         <li><strong>SEO Consulting:</strong> Optimize your profile for discoverability</li>
       </ul>

       <p>Remember, your profile is a living document that evolves with your entrepreneurial journey. Treat it with the care and attention it deserves, and it will serve you faithfully as you build your business empire.</p>',
        18, 'beginner', '["profile", "settings", "privacy", "networking", "personal-branding"]', 0, 'Support Team', 'Accelerator Platform Support'),

       (1, 'Understanding the Workspace',
        'understanding-the-workspace',
        'Master workspace organization for efficient startup development and team collaboration',
        '<h2>Mastering Workspace Organization: Your Startup Development Command Center</h2>
       <p>In the fast-paced world of entrepreneurship, your workspace is more than just a digital folder—it's your strategic advantage, your productivity multiplier, and your collaboration hub. This comprehensive guide will transform how you approach workspace organization, turning chaos into clarity and ideas into execution.</p>

       <h3>The Workspace Philosophy: Structure as Strategy</h3>
       <p>Successful entrepreneurs understand that organization is not about neatness—it's about creating systems that amplify productivity, enhance collaboration, and accelerate decision-making. Your workspace is the operating system of your entrepreneurial venture.</p>

       <h3>Core Workspace Architecture: Building Blocks of Success</h3>

       <h4>1. Project Ecosystem: The Foundation Layer</h4>
       <p>Projects are the atomic units of entrepreneurial activity, each representing a distinct business opportunity or initiative.</p>

       <h5>Project Hierarchy and Structure</h5>
       <ul>
         <li><strong>Primary Projects:</strong> Core business ventures requiring full resource allocation</li>
         <li><strong>Exploratory Projects:</strong> Innovation initiatives and market testing opportunities</li>
         <li><strong>Support Projects:</strong> Infrastructure and capability-building initiatives</li>
         <li><strong>Archived Projects:</strong> Completed ventures maintained for reference and learning</li>
       </ul>

       <h5>Project Lifecycle Management</h5>
       <ol>
         <li><strong>Ideation Phase:</strong> Initial concept capture and validation</li>
         <li><strong>Planning Phase:</strong> Detailed business planning and resource allocation</li>
         <li><strong>Execution Phase:</strong> Active development and market testing</li>
         <li><strong>Optimization Phase:</strong> Performance monitoring and iterative improvement</li>
         <li><strong>Scale Phase:</strong> Growth acceleration and market expansion</li>
         <li><strong>Exit/Transition Phase:</strong> Harvesting value or strategic pivoting</li>
       </ol>

       <h4>2. Task Management System: Breaking Down Big Goals</h4>
       <p>Tasks transform ambitious visions into achievable actions, providing the granularity needed for effective execution.</p>

       <h5>Task Categorization Framework</h5>
       <table>
         <thead>
           <tr>
             <th>Task Type</th>
             <th>Description</th>
             <th>Typical Duration</th>
             <th>Priority Level</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td><strong>Strategic Tasks</strong></td>
             <td>Vision setting, market analysis, partnership development</td>
             <td>1-4 weeks</td>
             <td>High</td>
           </tr>
           <tr>
             <td><strong>Operational Tasks</strong></td>
             <td>Day-to-day execution, customer support, routine maintenance</td>
             <td>Hours to days</td>
             <td>Medium</td>
           </tr>
           <tr>
             <td><strong>Development Tasks</strong></td>
             <td>Product building, feature development, technical implementation</td>
             <td>Days to weeks</td>
             <td>High</td>
           </tr>
           <tr>
             <td><strong>Research Tasks</strong></td>
             <td>Market research, competitor analysis, user interviews</td>
             <td>Days to weeks</td>
             <td>Medium-High</td>
           </tr>
           <tr>
             <td><strong>Administrative Tasks</strong></td>
             <td>Documentation, compliance, financial reporting</td>
             <td>Hours to days</td>
             <td>Low-Medium</td>
           </tr>
         </tbody>
       </table>

       <h5>Task Dependencies and Workflow</h5>
       <ul>
         <li><strong>Sequential Dependencies:</strong> Tasks that must be completed in specific order</li>
         <li><strong>Parallel Processing:</strong> Independent tasks that can be worked simultaneously</li>
         <li><strong>Blocking Dependencies:</strong> Critical path items that halt progress if delayed</li>
         <li><strong>Resource Dependencies:</strong> Tasks requiring specific skills, tools, or approvals</li>
       </ul>

       <h4>3. Collaboration Infrastructure: Team Synergy Engine</h4>
       <p>Modern entrepreneurship is inherently collaborative, requiring sophisticated systems for team coordination and communication.</p>

       <h5>Team Structure Optimization</h5>
       <ul>
         <li><strong>Core Team:</strong> Full-time dedicated members with equity participation</li>
         <li><strong>Extended Team:</strong> Part-time contributors and specialized contractors</li>
         <li><strong>Advisory Network:</strong> External mentors and subject matter experts</li>
         <li><strong>Community Contributors:</strong> Open-source style participation and feedback</li>
       </ul>

       <h5>Communication Architecture</h5>
       <ul>
         <li><strong>Synchronous Channels:</strong> Real-time meetings and instant messaging</li>
         <li><strong>Asynchronous Channels:</strong> Email, documentation, and project updates</li>
         <li><strong>Contextual Communication:</strong> Discussion threads tied to specific tasks or decisions</li>
         <li><strong>Escalation Protocols:</strong> Clear paths for issue resolution and decision-making</li>
       </ul>

       <h4>4. Resource Management: Asset Optimization</h4>
       <p>Effective resource allocation is the difference between sustainable growth and resource starvation.</p>

       <h5>Resource Categories and Management</h5>
       <ul>
         <li><strong>Human Resources:</strong> Team members, contractors, and advisors</li>
         <li><strong>Financial Resources:</strong> Capital, budgets, and funding sources</li>
         <li><strong>Technical Resources:</strong> Tools, software, and infrastructure</li>
         <li><strong>Intellectual Resources:</strong> Knowledge, patents, and proprietary information</li>
         <li><strong>Network Resources:</strong> Partnerships, suppliers, and distribution channels</li>
       </ul>

       <h3>Advanced Workspace Strategies: Scaling Your Organization</h3>

       <h4>Workflow Automation and Efficiency</h4>
       <ul>
         <li><strong>Template Libraries:</strong> Standardized processes for common tasks</li>
         <li><strong>Integration Ecosystems:</strong> Connected tools and seamless data flow</li>
         <li><strong>AI-Powered Assistance:</strong> Automated task prioritization and scheduling</li>
         <li><strong>Predictive Analytics:</strong> Anticipating bottlenecks and resource needs</li>
       </ul>

       <h4>Performance Monitoring and Analytics</h4>
       <ul>
         <li><strong>Productivity Metrics:</strong> Task completion rates and time-to-completion</li>
         <li><strong>Quality Indicators:</strong> Error rates, customer satisfaction, and rework frequency</li>
         <li><strong>Resource Utilization:</strong> Budget burn rates and team capacity analysis</li>
         <li><strong>Innovation Tracking:</strong> New idea generation and implementation success</li>
       </ul>

       <h3>Workspace Culture and Psychology</h3>

       <h4>Creating a Productive Environment</h4>
       <ul>
         <li><strong>Psychological Safety:</strong> Encouraging risk-taking and open communication</li>
         <li><strong>Autonomy with Accountability:</strong> Freedom balanced with clear expectations</li>
         <li><strong>Growth Mindset:</strong> Viewing challenges as learning opportunities</li>
         <li><strong>Recognition Systems:</strong> Celebrating wins and acknowledging contributions</li>
       </ul>

       <h4>Motivation and Engagement Strategies</h4>
       <ul>
         <li><strong>Purpose Alignment:</strong> Connecting daily tasks to larger mission</li>
         <li><strong>Progress Visibility:</strong> Clear indicators of advancement and achievement</li>
         <li><strong>Skill Development:</strong> Opportunities for learning and professional growth</li>
         <li><strong>Work-Life Integration:</strong> Flexible approaches that respect personal needs</li>
       </ul>

       <h3>Common Workspace Pitfalls and Solutions</h3>

       <h4>Organization Anti-Patterns</h4>
       <ol>
         <li><strong>Over-Organization:</strong> Creating complexity that hinders rather than helps</li>
         <li><strong>Under-Organization:</strong> Lack of structure leading to confusion and missed deadlines</li>
         <li><strong>Silo Mentality:</strong> Departments working in isolation rather than collaboration</li>
         <li><strong>Process Rigidity:</strong> Inflexible systems that can't adapt to changing needs</li>
         <li><strong>Information Hoarding:</strong> Knowledge kept private rather than shared organization-wide</li>
       </ol>

       <h4>Scalability Challenges</h4>
       <ul>
         <li><strong>Communication Breakdown:</strong> As teams grow, maintaining clear communication becomes difficult</li>
         <li><strong>Decision Bottlenecks:</strong> Too many decisions requiring executive approval</li>
         <li><strong>Resource Allocation:</strong> Difficulty distributing resources fairly and efficiently</li>
         <li><strong>Culture Dilution:</strong> Maintaining core values as the organization expands</li>
       </ul>

       <h3>Future-Proofing Your Workspace</h3>

       <h4>Emerging Technologies Integration</h4>
       <ul>
         <li><strong>AI and Machine Learning:</strong> Automated task assignment and predictive analytics</li>
         <li><strong>Virtual Reality:</strong> Immersive collaboration environments</li>
         <li><strong>Blockchain:</strong> Decentralized decision-making and transparent record-keeping</li>
         <li><strong>IoT Integration:</strong> Connected devices and real-time environmental monitoring</li>
       </ul>

       <h4>Remote Work Optimization</h4>
       <ul>
         <li><strong>Digital Water Coolers:</strong> Virtual spaces for informal interaction</li>
         <li><strong>Asynchronous Communication:</strong> Systems that work across time zones</li>
         <li><strong>Virtual Team Building:</strong> Online activities that build team cohesion</li>
         <li><strong>Remote Performance Monitoring:</strong> Tools for measuring productivity without micromanagement</li>
       </ul>

       <h3>Workspace Maintenance and Evolution</h3>

       <h4>Regular Health Checks</h4>
       <ul>
         <li><strong>Weekly Reviews:</strong> Quick assessments of current project status</li>
         <li><strong>Monthly Audits:</strong> Comprehensive reviews of systems and processes</li>
         <li><strong>Quarterly Planning:</strong> Strategic adjustments based on performance data</li>
         <li><strong>Annual Transformations:</strong> Major overhauls to accommodate growth</li>
       </ul>

       <h4>Continuous Improvement Methodology</h4>
       <ul>
         <li><strong>Feedback Loops:</strong> Regular input from team members and stakeholders</li>
         <li><strong>Experimentation:</strong> Testing new approaches and measuring results</li>
         <li><strong>Knowledge Sharing:</strong> Documenting lessons learned and best practices</li>
         <li><strong>Technology Updates:</strong> Regularly evaluating and adopting new tools</li>
       </ul>

       <blockquote>
         <p>"Your workspace is the physical manifestation of your entrepreneurial mindset. Keep it organized, keep it flexible, and keep it focused on what matters most: building something extraordinary."</p>
         <p>The most successful entrepreneurs treat their workspace not as a static environment, but as a living system that evolves with their business and adapts to new challenges.</p>
       </blockquote>

       <h3>Expert Workspace Consulting</h3>
       <p>Workspace optimization is both an art and a science requiring deep understanding of organizational dynamics. Our platform provides comprehensive support:</p>
       <ul>
         <li><strong>Workspace Audits:</strong> Professional assessment of your current organizational systems</li>
         <li><strong>Process Design:</strong> Custom workflow development for your specific needs</li>
         <li><strong>Team Training:</strong> Workshops on effective collaboration and communication</li>
         <li><strong>Technology Recommendations:</strong> Tool selection and integration guidance</li>
         <li><strong>Scaling Support:</strong> Guidance for growing organizations</li>
       </ul>

       <p>Your workspace is the foundation of your entrepreneurial success. Invest in its design, maintain its functionality, and evolve it as your business grows. A well-organized workspace is not just tidy—it's a strategic advantage that accelerates your path to success.</p>',
        16, 'intermediate', '["workspace", "organization", "management", "productivity", "collaboration"]', 0, 'Support Team', 'Accelerator Platform Support')
    `;

    // Insert comprehensive articles for AI Assistant category
    const insertAIAssistantArticles = `
      INSERT OR IGNORE INTO help_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name, author_bio
      ) VALUES
      (2, 'How to Use AI Models',
       'how-to-use-ai-models',
       'Our AI assistant uses advanced language models to provide personalized recommendations',
       '<h2>AI Model Usage</h2>
       <p>Our AI assistant uses advanced language models to provide personalized recommendations for your startup.</p>

       <h3>Access Methods</h3>
       <ul>
         <li>Click "AI Assistant" in the sidebar or use the chat widget</li>
         <li>Use natural language to ask questions or request help</li>
         <li>The AI remembers your project details for better responses</li>
         <li>Choose from different AI models based on your needs</li>
       </ul>

       <h3>Effective Prompting</h3>
       <ul>
         <li>Be specific about your goals and constraints</li>
         <li>Provide context about your industry and target market</li>
         <li>Ask follow-up questions to refine results</li>
         <li>Use the AI iteratively to improve ideas</li>
       </ul>',
       6, 'intermediate', '["ai", "assistant", "models"]', 1, 'AI Team', 'AI Development Team'),

      (2, 'Generating Business Ideas',
       'generating-business-ideas',
       'Discover innovative business opportunities tailored to your interests',
       '<h2>Idea Generation Process</h2>
       <p>Discover innovative business opportunities tailored to your interests and market trends.</p>

       <h3>Step-by-Step Process</h3>
       <ol>
         <li>Navigate to the "Ideas" section</li>
         <li>Describe your interests or industry</li>
         <li>Specify your target market or problem to solve</li>
         <li>Review and refine AI-generated ideas</li>
         <li>Save promising ideas to your projects</li>
       </ol>

       <h3>Idea Evaluation</h3>
       <ul>
         <li>Assess market potential and competition</li>
         <li>Consider your skills and resources</li>
         <li>Evaluate technical feasibility</li>
         <li>Check for unique value proposition</li>
       </ul>',
       5, 'beginner', '["ideas", "ai", "generation"]', 0, 'AI Team', 'AI Development Team'),

      (2, 'Creating Business Plans',
       'creating-business-plans',
       'Use AI assistance to develop comprehensive business plans',
       '<h2>AI-Powered Business Planning</h2>
       <p>Use AI assistance to develop comprehensive business plans with market analysis and financial projections.</p>

       <h3>Business Plan Components</h3>
       <ul>
         <li><strong>Executive Summary:</strong> AI generates compelling summaries</li>
         <li><strong>Market Analysis:</strong> Research and competitor insights</li>
         <li><strong>Financial Projections:</strong> Revenue forecasts and cost estimates</li>
         <li><strong>Risk Assessment:</strong> Identify potential challenges</li>
       </ul>

       <h3>AI Assistance Features</h3>
       <ul>
         <li>Automated market research and analysis</li>
         <li>Financial modeling and projections</li>
         <li>Competitor analysis and positioning</li>
         <li>Risk identification and mitigation strategies</li>
       </ul>',
       7, 'intermediate', '["business-plans", "ai", "planning"]', 1, 'AI Team', 'AI Development Team'),

      (2, 'Understanding Recommendations',
       'understanding-recommendations',
       'Learn to interpret and apply AI suggestions effectively',
       '<h2>Interpreting AI Output</h2>
       <p>Learn to interpret and apply AI suggestions effectively for better business decisions.</p>

       <h3>Confidence Scores</h3>
       <p>Higher scores indicate more reliable suggestions based on data quality and market validation.</p>

       <h3>Data Sources</h3>
       <p>AI recommendations are based on market data, industry trends, and successful business patterns.</p>

       <h3>Customization</h3>
       <p>Provide feedback to improve future recommendations and tailor suggestions to your specific needs.</p>

       <h3>Validation</h3>
       <p>Always verify critical business decisions with real market research and expert advice.</p>',
       4, 'intermediate', '["recommendations", "ai", "validation"]', 0, 'AI Team', 'AI Development Team')
    `;

    // Insert comprehensive articles for Account & Billing category
    const insertAccountBillingArticles = `
      INSERT OR IGNORE INTO help_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name, author_bio
      ) VALUES
      (3, 'Managing Your Subscription',
       'managing-your-subscription',
       'Keep track of your subscription status and make changes as needed',
       '<h2>Subscription Management</h2>
       <p>Keep track of your subscription status and make changes as needed.</p>

       <h3>Current Plan Details</h3>
       <ul>
         <li>View your active subscription details</li>
         <li>Monitor your credits and feature usage</li>
         <li>Change your plan at any time</li>
         <li>Monthly or annual payment options</li>
       </ul>

       <h3>Plan Changes</h3>
       <p>You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.</p>',
       4, 'beginner', '["subscription", "billing", "account"]', 1, 'Billing Team', 'Billing and Account Management'),

      (3, 'Payment Methods',
       'payment-methods',
       'Securely manage your payment information and billing preferences',
       '<h2>Payment Management</h2>
       <p>Securely manage your payment information and billing preferences.</p>

       <h3>Supported Methods</h3>
       <ul>
         <li>Support for major credit cards</li>
         <li>Set your preferred payment method</li>
         <li>PCI-compliant payment processing</li>
         <li>Automatic email receipts for all transactions</li>
       </ul>

       <h3>Security Features</h3>
       <ul>
         <li>End-to-end encryption</li>
         <li>Tokenized payment storage</li>
         <li>Fraud detection and prevention</li>
         <li>Regular security audits</li>
       </ul>',
       3, 'beginner', '["payment", "billing", "security"]', 0, 'Billing Team', 'Billing and Account Management'),

      (3, 'Credits and Usage',
       'credits-and-usage',
       'Understand how credits work and monitor your platform usage',
       '<h2>Credit System</h2>
       <p>Understand how credits work and monitor your platform usage.</p>

       <h3>Credit Usage</h3>
       <ul>
         <li>Pay-as-you-go for AI features</li>
         <li>Real-time monitoring of credit consumption</li>
         <li>Purchase additional credits anytime</li>
         <li>Earn credits through platform activities</li>
       </ul>

       <h3>Credit Management</h3>
       <ul>
         <li>View usage history and trends</li>
         <li>Set spending limits and alerts</li>
         <li>Auto-recharge options</li>
         <li>Credit expiration policies</li>
       </ul>',
       4, 'beginner', '["credits", "usage", "billing"]', 1, 'Billing Team', 'Billing and Account Management'),

      (3, 'Updating Profile Settings',
       'updating-profile-settings',
       'Customize your account preferences and personal information',
       '<h2>Profile Customization</h2>
       <p>Customize your account preferences and personal information.</p>

       <h3>Personal Information</h3>
       <ul>
         <li>Update name, bio, and contact details</li>
         <li>Control profile visibility and data sharing</li>
         <li>Manage email and in-app alerts</li>
         <li>Change password and enable two-factor auth</li>
       </ul>

       <h3>Privacy Controls</h3>
       <ul>
         <li>Profile visibility settings</li>
         <li>Data sharing preferences</li>
         <li>Notification preferences</li>
         <li>Account security options</li>
       </ul>',
       3, 'beginner', '["profile", "settings", "privacy"]', 0, 'Billing Team', 'Billing and Account Management')
    `;

    // Insert comprehensive articles for FAQ category
    const insertFAQArticles = `
      INSERT OR IGNORE INTO help_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name, author_bio
      ) VALUES
      (4, 'What is the Accelerator Platform?',
       'what-is-the-accelerator-platform',
       'The Accelerator Platform is an AI-powered tool designed to help entrepreneurs',
       '<h2>Platform Overview</h2>
       <p>The Accelerator Platform is an AI-powered tool designed to help entrepreneurs and startups build, launch, and scale their businesses. Our platform provides AI-driven recommendations, business planning tools, and resources to guide you through every stage of your startup journey.</p>

       <h3>Key Features</h3>
       <ul>
         <li>AI-powered business idea generation</li>
         <li>Automated business plan creation</li>
         <li>Financial modeling and projections</li>
         <li>Market research and competitor analysis</li>
         <li>Team collaboration tools</li>
         <li>Progress tracking and milestones</li>
       </ul>

       <h3>Who Can Use It</h3>
       <p>Our platform is designed for entrepreneurs, startup founders, small business owners, and anyone looking to launch or grow a business venture.</p>',
       3, 'beginner', '["platform", "overview", "faq"]', 1, 'Support Team', 'Accelerator Platform Support'),

      (4, 'How does the AI assistant work?',
       'how-does-the-ai-assistant-work',
       'Our AI assistant uses advanced machine learning models to analyze your project requirements',
       '<h2>AI Assistant Functionality</h2>
       <p>Our AI assistant uses advanced machine learning models to analyze your project requirements and provide tailored recommendations. Simply describe your idea or ask specific questions, and our AI will generate insights, suggest improvements, and help you build various aspects of your business.</p>

       <h3>AI Capabilities</h3>
       <ul>
         <li>Business idea validation and refinement</li>
         <li>Market opportunity identification</li>
         <li>Competitor analysis and positioning</li>
         <li>Financial projections and modeling</li>
         <li>Marketing strategy development</li>
         <li>Team building recommendations</li>
       </ul>

       <h3>How to Get Started</h3>
       <ol>
         <li>Create a project in your dashboard</li>
         <li>Describe your business idea or goals</li>
         <li>Ask specific questions or request help</li>
         <li>Review and iterate on AI suggestions</li>
       </ol>',
       4, 'intermediate', '["ai", "assistant", "faq"]', 0, 'AI Team', 'AI Development Team'),

      (4, 'What are credits and how do they work?',
       'what-are-credits-and-how-do-they-work',
       'Credits are our platform currency system that allows you to access premium AI features',
       '<h2>Credit System Explained</h2>
       <p>Credits are our platform currency system that allows you to access premium AI features and advanced tools. Each credit represents a certain amount of computational resources used for AI processing.</p>

       <h3>Credit Usage</h3>
       <ul>
         <li>Different features consume different amounts of credits</li>
         <li>Free accounts receive a monthly credit allowance</li>
         <li>Premium plans include higher credit limits</li>
         <li>You can purchase additional credits as needed</li>
       </ul>

       <h3>Credit Management</h3>
       <ul>
         <li>Monitor your credit balance in real-time</li>
         <li>View detailed usage history</li>
         <li>Set up automatic credit purchases</li>
         <li>Earn bonus credits through platform activities</li>
       </ul>',
       3, 'beginner', '["credits", "billing", "faq"]', 1, 'Billing Team', 'Billing and Account Management'),

      (4, 'Can I collaborate with others on projects?',
       'can-i-collaborate-with-others-on-projects',
       'Yes! Our platform includes comprehensive collaboration features',
       '<h2>Collaboration Features</h2>
       <p>Yes! Our platform includes comprehensive collaboration features. You can invite team members to your projects, share documents, assign tasks, and work together in real-time.</p>

       <h3>Collaboration Tools</h3>
       <ul>
         <li>Team member invitations and permissions</li>
         <li>Real-time document collaboration</li>
         <li>Task assignment and tracking</li>
         <li>Chat and communication tools</li>
         <li>File sharing and version control</li>
         <li>Progress tracking and reporting</li>
       </ul>

       <h3>Team Management</h3>
       <ul>
         <li>Role-based access control</li>
         <li>Permission levels (owner, editor, viewer)</li>
         <li>Activity monitoring and notifications</li>
         <li>Team performance analytics</li>
       </ul>',
       4, 'beginner', '["collaboration", "teams", "faq"]', 0, 'Support Team', 'Accelerator Platform Support'),

      (4, 'Is my data secure?',
       'is-my-data-secure',
       'Absolutely. We take data security very seriously',
       '<h2>Data Security & Privacy</h2>
       <p>Absolutely. We take data security very seriously. All data is encrypted in transit and at rest using industry-standard encryption protocols.</p>

       <h3>Security Measures</h3>
       <ul>
         <li>End-to-end encryption for all data</li>
         <li>GDPR and privacy regulation compliance</li>
         <li>Regular security audits and penetration testing</li>
         <li>Secure cloud infrastructure with multiple backups</li>
         <li>Access controls and authentication requirements</li>
       </ul>

       <h3>Data Protection</h3>
       <ul>
         <li>We never share personal information without consent</li>
         <li>Data is stored in secure, compliant data centers</li>
         <li>Regular backups with disaster recovery procedures</li>
         <li>Transparent data handling policies</li>
       </ul>',
       3, 'beginner', '["security", "privacy", "faq"]', 1, 'Security Team', 'Platform Security Team'),

      (4, 'What types of businesses can I create?',
       'what-types-of-businesses-can-i-create',
       'Our platform is designed to support entrepreneurs across all industries',
       '<h2>Business Type Support</h2>
       <p>Our platform is designed to support entrepreneurs across all industries and business types. Whether you are building a tech startup, e-commerce business, service-based company, or traditional brick-and-mortar venture, our AI tools can help.</p>

       <h3>Supported Business Models</h3>
       <ul>
         <li>SaaS (Software as a Service)</li>
         <li>E-commerce and marketplace platforms</li>
         <li>Subscription-based services</li>
         <li>Consulting and professional services</li>
         <li>Consumer mobile and web applications</li>
         <li>Traditional retail and service businesses</li>
         <li>Non-profit and social enterprises</li>
       </ul>

       <h3>Industry Agnostic</h3>
       <p>The AI adapts its recommendations based on your industry and target market, providing relevant insights regardless of your business sector.</p>',
       3, 'beginner', '["business-types", "industries", "faq"]', 0, 'Support Team', 'Accelerator Platform Support'),

      (4, 'How accurate are the AI-generated business plans?',
       'how-accurate-are-the-ai-generated-business-plans',
       'Our AI generates comprehensive business plans based on industry data and market trends',
       '<h2>AI Business Plan Accuracy</h2>
       <p>Our AI generates comprehensive business plans based on industry data, market trends, and proven business frameworks. While the AI provides excellent starting points and insights, we always recommend validating the information with real market research and professional advisors.</p>

       <h3>AI Strengths</h3>
       <ul>
         <li>Data-driven market analysis</li>
         <li>Industry benchmark comparisons</li>
         <li>Financial modeling based on historical data</li>
         <li>Comprehensive business framework coverage</li>
         <li>Rapid generation of multiple scenarios</li>
       </ul>

       <h3>Recommended Validation Steps</h3>
       <ol>
         <li>Conduct primary market research</li>
         <li>Consult with industry experts</li>
         <li>Validate financial assumptions</li>
         <li>Test pricing and positioning</li>
         <li>Get feedback from potential customers</li>
       </ol>

       <h3>Best Practices</h3>
       <ul>
         <li>Use AI plans as starting templates</li>
         <li>Customize based on your specific situation</li>
         <li>Combine AI insights with human expertise</li>
         <li>Regularly update and refine your plans</li>
       </ul>',
       5, 'intermediate', '["business-plans", "ai", "accuracy"]', 0, 'AI Team', 'AI Development Team')
    `;

    try {
      await db.run(insertGettingStartedArticles);
      await db.run(insertAIAssistantArticles);
      await db.run(insertAccountBillingArticles);
      await db.run(insertFAQArticles);

      console.log('Help articles populated successfully');
    } catch (error) {
      console.error('Error populating help articles:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Remove all articles except the original sample ones
      await db.run(`
        DELETE FROM help_articles
        WHERE slug IN (
          'creating-your-first-project',
          'navigating-the-dashboard',
          'setting-up-your-profile',
          'understanding-the-workspace',
          'how-to-use-ai-models',
          'generating-business-ideas',
          'creating-business-plans',
          'understanding-recommendations',
          'managing-your-subscription',
          'payment-methods',
          'credits-and-usage',
          'updating-profile-settings',
          'what-is-the-accelerator-platform',
          'how-does-the-ai-assistant-work',
          'what-are-credits-and-how-do-they-work',
          'can-i-collaborate-with-others-on-projects',
          'is-my-data-secure',
          'what-types-of-businesses-can-i-create',
          'how-accurate-are-the-ai-generated-business-plans'
        )
      `);

      console.log('Help articles removed successfully');
    } catch (error) {
      console.error('Error removing help articles:', error);
      throw error;
    }
  },
};
