/**
 * Migration: Populate learning articles with comprehensive content
 * Adds detailed articles for all learning categories
 */

module.exports = {
  up: async (db) => {
    // Insert comprehensive articles for Getting Started category
    const insertGettingStartedArticles = `
      INSERT OR IGNORE INTO learning_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name, author_bio
      ) VALUES
      (1, 'How to Identify a Problem Worth Solving',
       'how-to-identify-a-problem-worth-solving',
       'Learn systematic approaches to finding real problems that create genuine value for users.',
       '<h2>Understanding Problem Discovery</h2>
       <p>Every successful startup begins with identifying a problem that people actually care about solving. The key is distinguishing between problems that are merely annoying and those that create significant pain points.</p>

       <h3>Types of Problems to Look For</h3>
       <ul>
         <li><strong>Recurring Problems:</strong> Issues that happen frequently in daily life</li>
         <li><strong>Expensive Problems:</strong> Problems that cost time or money to solve</li>
         <li><strong>Emotional Problems:</strong> Issues that cause frustration or stress</li>
         <li><strong>Scalable Problems:</strong> Problems experienced by many people</li>
       </ul>

       <h3>Research Methods</h3>
       <p>Use these systematic approaches to uncover genuine problems:</p>
       <ol>
         <li><strong>Observe People:</strong> Watch how people interact with current solutions</li>
         <li><strong>Interview Users:</strong> Ask open-ended questions about their challenges</li>
         <li><strong>Analyze Trends:</strong> Look at industry reports and market data</li>
         <li><strong>Experience the Problem:</strong> Try to live with the problem yourself</li>
       </ol>

       <h3>Validation Questions</h3>
       <p>Ask yourself these questions to validate if a problem is worth solving:</p>
       <ul>
         <li>Does this problem affect a significant number of people?</li>
         <li>Are people currently paying to solve this problem?</li>
         <li>Would people pay for a better solution?</li>
         <li>Can this problem be solved with technology?</li>
       </ul>',
       8, 'beginner', '["problem-discovery", "market-research", "validation"]', 1, 'Sarah Johnson', 'Entrepreneurship researcher and startup advisor'),

      (1, 'Building Your First Minimum Viable Product',
       'building-your-first-mvp',
       'A step-by-step guide to creating and launching your first MVP without breaking the bank.',
       '<h2>What is an MVP?</h2>
       <p>A Minimum Viable Product (MVP) is the simplest version of your product that allows you to test your core assumptions with real users. It''s not about building a perfect product, but about learning what works.</p>

       <h3>MVP Principles</h3>
       <ul>
         <li><strong>Focus on Core Value:</strong> Identify the single most important feature</li>
         <li><strong>Build Quickly:</strong> Use existing tools and platforms when possible</li>
         <li><strong>Test Assumptions:</strong> Validate your hypotheses with real users</li>
         <li><strong>Iterate Based on Feedback:</strong> Use data to guide improvements</li>
       </ul>

       <h3>MVP Development Process</h3>
       <ol>
         <li><strong>Define Success Metrics:</strong> What will prove your idea works?</li>
         <li><strong>Choose Your Tools:</strong> Select platforms that match your skills</li>
         <li><strong>Build Core Features:</strong> Focus on the essential functionality</li>
         <li><strong>Test with Users:</strong> Get feedback from your target audience</li>
         <li><strong>Measure and Learn:</strong> Analyze results and plan next steps</li>
       </ol>

       <h3>Common MVP Mistakes</h3>
       <p>Avoid these pitfalls when building your first MVP:</p>
       <ul>
         <li>Building too many features</li>
         <li>Not testing with real users</li>
         <li>Ignoring user feedback</li>
         <li>Spending too much time on perfection</li>
       </ul>',
       12, 'intermediate', '["mvp", "product-development", "user-testing"]', 1, 'Mike Chen', 'Product manager and startup founder'),

      (1, 'Customer Discovery and Validation',
       'customer-discovery-and-validation',
       'Master the art of talking to customers and validating your business assumptions.',
       '<h2>The Customer Discovery Process</h2>
       <p>Customer discovery is about understanding your customers'' problems, needs, and behaviors. It''s a systematic process of learning about your market through direct interaction.</p>

       <h3>Customer Discovery Framework</h3>
       <ol>
         <li><strong>State Your Hypotheses:</strong> What do you believe about your customers?</li>
         <li><strong>Design Your Experiments:</strong> How will you test your assumptions?</li>
         <li><strong>Conduct Interviews:</strong> Talk to potential customers</li>
         <li><strong>Analyze Results:</strong> What did you learn?</li>
         <li><strong>Refine Your Understanding:</strong> Update your hypotheses</li>
       </ol>

       <h3>Effective Interview Techniques</h3>
       <ul>
         <li><strong>Ask Open-Ended Questions:</strong> Avoid yes/no questions</li>
         <li><strong>Listen More Than You Talk:</strong> Let customers tell their stories</li>
         <li><strong>Follow Up on Interesting Points:</strong> Dig deeper into insights</li>
         <li><strong>Observe Non-Verbal Cues:</strong> Pay attention to body language</li>
       </ul>

       <h3>Validation Metrics</h3>
       <p>Measure these indicators to validate your business idea:</p>
       <ul>
         <li>Problem recognition rate</li>
         <li>Current solution satisfaction</li>
         <li>Willingness to pay</li>
         <li>Feature prioritization</li>
       </ul>',
       10, 'intermediate', '["customer-discovery", "interviews", "validation"]', 0, 'Lisa Wang', 'Customer research expert and consultant')
    `;

    // Insert comprehensive articles for Courses category
    const insertCoursesArticles = `
      INSERT OR IGNORE INTO learning_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name, author_bio
      ) VALUES
      (2, 'Business Model Canvas: A Strategic Tool',
       'business-model-canvas-strategic-tool',
       'Learn how to use the Business Model Canvas to design, test, and refine your business model.',
       '<h2>Introduction to Business Model Canvas</h2>
       <p>The Business Model Canvas is a strategic management template for developing new or documenting existing business models. It''s a visual chart with elements describing a firm''s value proposition, infrastructure, customers, and finances.</p>

       <h3>The 9 Building Blocks</h3>
       <ol>
         <li><strong>Customer Segments:</strong> Who are your customers?</li>
         <li><strong>Value Propositions:</strong> What value do you deliver?</li>
         <li><strong>Channels:</strong> How do you reach your customers?</li>
         <li><strong>Customer Relationships:</strong> How do you interact with customers?</li>
         <li><strong>Revenue Streams:</strong> How do you make money?</li>
         <li><strong>Key Resources:</strong> What resources do you need?</li>
         <li><strong>Key Activities:</strong> What activities drive your business?</li>
         <li><strong>Key Partnerships:</strong> Who are your partners?</li>
         <li><strong>Cost Structure:</strong> What are your costs?</li>
       </ol>

       <h3>How to Use the Canvas</h3>
       <p>Follow these steps to effectively use the Business Model Canvas:</p>
       <ol>
         <li>Start with customer segments and value propositions</li>
         <li>Fill in the other blocks based on your assumptions</li>
         <li>Test your assumptions with real customers</li>
         <li>Iterate and refine based on feedback</li>
         <li>Use it as a communication tool with your team</li>
       </ol>

       <h3>Common Pitfalls</h3>
       <ul>
         <li>Focusing too much on products instead of customer needs</li>
         <li>Not validating assumptions with real data</li>
         <li>Treating it as a one-time exercise</li>
         <li>Not involving the right stakeholders</li>
       </ul>',
       15, 'intermediate', '["business-model", "strategy", "canvas"]', 1, 'David Rodriguez', 'Business strategist and entrepreneur'),

      (2, 'Financial Planning for Early-Stage Startups',
       'financial-planning-early-stage-startups',
       'Essential financial concepts and planning strategies for startup founders.',
       '<h2>Financial Fundamentals for Startups</h2>
       <p>Understanding startup finances is crucial for making informed decisions and avoiding common pitfalls. This guide covers the essential financial concepts every founder should know.</p>

       <h3>Key Financial Concepts</h3>
       <ul>
         <li><strong>Burn Rate:</strong> How quickly you''re spending money</li>
         <li><strong>Runway:</strong> How long your current funding will last</li>
         <li><strong>Unit Economics:</strong> Revenue and costs per customer</li>
         <li><strong>Customer Acquisition Cost (CAC):</strong> Cost to acquire a customer</li>
         <li><strong>Lifetime Value (LTV):</strong> Total revenue from a customer</li>
       </ul>

       <h3>Creating a Financial Plan</h3>
       <ol>
         <li><strong>Estimate Startup Costs:</strong> Calculate initial expenses</li>
         <li><strong>Project Revenue:</strong> Forecast income streams</li>
         <li><strong>Build Cash Flow Projections:</strong> Predict cash needs</li>
         <li><strong>Plan Funding Strategy:</strong> Determine financing approach</li>
         <li><strong>Create Financial Controls:</strong> Set up monitoring systems</li>
       </ol>

       <h3>Financial Tools and Resources</h3>
       <p>Leverage these tools to manage your startup finances:</p>
       <ul>
         <li>Accounting software (QuickBooks, Xero)</li>
         <li>Financial modeling spreadsheets</li>
         <li>Budgeting and forecasting tools</li>
         <li>Banking and payment platforms</li>
       </ul>',
       18, 'intermediate', '["finance", "planning", "startup-funding"]', 1, 'Robert Kim', 'Financial advisor specializing in startups'),

      (2, 'Building and Leading High-Performance Teams',
       'building-leading-high-performance-teams',
       'Strategies for recruiting, managing, and scaling startup teams effectively.',
       '<h2>The Importance of Team Building</h2>
       <p>Your team is your most valuable asset. Building the right team and creating a high-performance culture can make the difference between success and failure.</p>

       <h3>Team Building Fundamentals</h3>
       <ul>
         <li><strong>Define Roles Clearly:</strong> Everyone should know their responsibilities</li>
         <li><strong>Hire for Cultural Fit:</strong> Skills can be taught, attitude is harder</li>
         <li><strong>Communicate Transparently:</strong> Keep everyone informed and involved</li>
         <li><strong>Recognize Achievements:</strong> Celebrate wins and learn from failures</li>
       </ul>

       <h3>Recruitment Strategies</h3>
       <p>Effective ways to find and attract top talent:</p>
       <ol>
         <li><strong>Define Job Requirements:</strong> Know exactly what you need</li>
         <li><strong>Use Multiple Channels:</strong> Job boards, referrals, networking</li>
         <li><strong>Screen Candidates Carefully:</strong> Multiple interviews and assessments</li>
         <li><strong>Make Competitive Offers:</strong> Salary, equity, and culture matter</li>
       </ol>

       <h3>Leadership Principles</h3>
       <ul>
         <li><strong>Lead by Example:</strong> Demonstrate the behavior you want</li>
         <li><strong>Empower Your Team:</strong> Give autonomy and trust</li>
         <li><strong>Provide Feedback:</strong> Regular, constructive communication</li>
         <li><strong>Foster Growth:</strong> Invest in learning and development</li>
       </ul>

       <h3>Scaling Challenges</h3>
       <p>As your team grows, address these common challenges:</p>
       <ul>
         <li>Maintaining culture during rapid growth</li>
         <li>Managing remote and distributed teams</li>
         <li>Handling conflict and difficult conversations</li>
         <li>Balancing speed and quality</li>
       </ul>',
       14, 'advanced', '["team-building", "leadership", "recruitment"]', 0, 'Jennifer Martinez', 'HR consultant and team building expert')
    `;

    // Insert comprehensive articles for Tutorials category
    const insertTutorialsArticles = `
      INSERT OR IGNORE INTO learning_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name, author_bio
      ) VALUES
      (3, 'Creating Effective Landing Pages',
       'creating-effective-landing-pages',
       'Step-by-step guide to designing landing pages that convert visitors into customers.',
       '<h2>Landing Page Essentials</h2>
       <p>A landing page is a standalone web page created specifically for a marketing or advertising campaign. Its sole purpose is to convert visitors into leads or customers.</p>

       <h3>Key Elements of Effective Landing Pages</h3>
       <ul>
         <li><strong>Clear Headline:</strong> Immediately communicate your value proposition</li>
         <li><strong>Compelling Visuals:</strong> Use high-quality images and videos</li>
         <li><strong>Strong Call-to-Action:</strong> Make it obvious what you want visitors to do</li>
         <li><strong>Social Proof:</strong> Show testimonials and trust indicators</li>
         <li><strong>Simple Form:</strong> Don''t ask for too much information</li>
       </ul>

       <h3>Design Best Practices</h3>
       <ol>
         <li><strong>Keep it Simple:</strong> Remove distractions and focus on conversion</li>
         <li><strong>Use White Space:</strong> Give elements room to breathe</li>
         <li><strong>Choose Contrasting Colors:</strong> Make CTAs stand out</li>
         <li><strong>Optimize for Mobile:</strong> Ensure great mobile experience</li>
         <li><strong>Test Loading Speed:</strong> Fast pages convert better</li>
       </ol>

       <h3>Content Strategy</h3>
       <p>Craft compelling copy that drives action:</p>
       <ul>
         <li>Address visitor pain points</li>
         <li>Highlight benefits over features</li>
         <li>Use persuasive language</li>
         <li>Include urgency and scarcity when appropriate</li>
       </ul>

       <h3>Testing and Optimization</h3>
       <p>Continuously improve your landing pages:</p>
       <ul>
         <li>A/B test different versions</li>
         <li>Track conversion metrics</li>
         <li>Use heatmaps to understand user behavior</li>
         <li>Optimize based on data insights</li>
       </ul>',
       10, 'intermediate', '["landing-pages", "conversion", "design"]', 0, 'Alex Thompson', 'Digital marketing specialist and conversion expert'),

      (3, 'Using AI Tools for Market Research',
       'using-ai-tools-market-research',
       'Leverage artificial intelligence to conduct faster and more effective market research.',
       '<h2>AI-Powered Market Research</h2>
       <p>Artificial intelligence is revolutionizing market research by automating data collection, analysis, and insights generation. Learn how to use AI tools effectively for your startup research.</p>

       <h3>AI Tools for Market Research</h3>
       <ul>
         <li><strong>Data Collection:</strong> Automated web scraping and social listening</li>
         <li><strong>Sentiment Analysis:</strong> Understanding customer opinions at scale</li>
         <li><strong>Trend Analysis:</strong> Identifying emerging market patterns</li>
         <li><strong>Competitor Monitoring:</strong> Tracking competitor activities</li>
         <li><strong>Survey Analysis:</strong> Processing open-ended responses</li>
       </ul>

       <h3>Practical Applications</h3>
       <p>Use AI for these market research tasks:</p>
       <ol>
         <li><strong>Customer Segmentation:</strong> Automatically group customers by behavior</li>
         <li><strong>Competitive Analysis:</strong> Monitor competitor pricing and messaging</li>
         <li><strong>Social Media Insights:</strong> Analyze brand mentions and sentiment</li>
         <li><strong>Survey Processing:</strong> Extract themes from open-ended responses</li>
         <li><strong>Predictive Analytics:</strong> Forecast market trends and demand</li>
       </ol>

       <h3>Best Practices</h3>
       <ul>
         <li>Combine AI insights with human expertise</li>
         <li>Validate AI findings with primary research</li>
         <li>Use multiple AI tools for cross-verification</li>
         <li>Focus on actionable insights over raw data</li>
       </ul>

       <h3>Limitations and Ethics</h3>
       <p>Be aware of AI limitations in market research:</p>
       <ul>
         <li>Data quality affects accuracy</li>
         <li>AI may miss nuanced human insights</li>
         <li>Privacy and data protection concerns</li>
         <li>Need for human oversight and validation</li>
       </ul>',
       12, 'intermediate', '["ai-tools", "market-research", "automation"]', 1, 'Dr. Emily Chen', 'AI researcher and market analyst'),

      (3, 'Collaborative Project Management',
       'collaborative-project-management',
       'Master the art of managing projects with distributed teams using modern collaboration tools.',
       '<h2>Modern Project Management</h2>
       <p>Effective project management in today''s distributed world requires the right tools, processes, and communication strategies. Learn how to manage projects successfully with remote and hybrid teams.</p>

       <h3>Essential Tools</h3>
       <ul>
         <li><strong>Project Planning:</strong> Asana, Trello, Monday.com</li>
         <li><strong>Communication:</strong> Slack, Microsoft Teams, Discord</li>
         <li><strong>Documentation:</strong> Notion, Confluence, Google Workspace</li>
         <li><strong>Version Control:</strong> Git, GitHub, GitLab</li>
         <li><strong>Time Tracking:</strong> Toggl, Harvest, Clockify</li>
       </ul>

       <h3>Project Management Methodologies</h3>
       <p>Choose the right approach for your team:</p>
       <ul>
         <li><strong>Agile:</strong> Iterative development with regular feedback</li>
         <li><strong>Scrum:</strong> Structured framework with sprints and ceremonies</li>
         <li><strong>Kanban:</strong> Visual workflow management</li>
         <li><strong>Waterfall:</strong> Linear approach with defined phases</li>
       </ul>

       <h3>Communication Strategies</h3>
       <ol>
         <li><strong>Establish Clear Processes:</strong> Define how work gets done</li>
         <li><strong>Use Asynchronous Communication:</strong> Respect different time zones</li>
         <li><strong>Schedule Regular Check-ins:</strong> Daily standups and weekly reviews</li>
         <li><strong>Document Everything:</strong> Create a knowledge base</li>
         <li><strong>Celebrate Milestones:</strong> Recognize achievements</li>
       </ol>

       <h3>Common Challenges and Solutions</h3>
       <ul>
         <li><strong>Time Zone Differences:</strong> Use flexible scheduling and async updates</li>
         <li><strong>Cultural Differences:</strong> Foster inclusive communication</li>
         <li><strong>Technical Issues:</strong> Have backup communication channels</li>
         <li><strong>Motivation:</strong> Build team culture and recognition systems</li>
       </ul>',
       11, 'intermediate', '["project-management", "collaboration", "tools"]', 0, 'Mark Johnson', 'Project management consultant and agile coach')
    `;

    // Insert comprehensive articles for Resources category
    const insertResourcesArticles = `
      INSERT OR IGNORE INTO learning_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name, author_bio
      ) VALUES
      (4, 'Startup Legal Checklist: Essential Documents',
       'startup-legal-checklist-essential-documents',
       'A comprehensive guide to the legal documents every startup needs to protect their business.',
       '<h2>Legal Foundations for Startups</h2>
       <p>Having the right legal structure and documents is crucial for protecting your startup and ensuring compliance. This checklist covers the essential legal documents you need.</p>

       <h3>Entity Formation Documents</h3>
       <ul>
         <li><strong>Articles of Organization/Incorporation:</strong> Official formation document</li>
         <li><strong>Operating Agreement:</strong> Internal governance for LLCs</li>
         <li><strong>Bylaws:</strong> Corporate governance rules</li>
         <li><strong>Initial Stock Agreements:</strong> Founder equity distribution</li>
       </ul>

       <h3>Intellectual Property Protection</h3>
       <p>Protect your startup''s most valuable assets:</p>
       <ul>
         <li><strong>Trademark Registration:</strong> Protect your brand name and logo</li>
         <li><strong>Copyright Registration:</strong> Protect original content and designs</li>
         <li><strong>Patent Applications:</strong> Protect inventions and innovations</li>
         <li><strong>NDA Templates:</strong> Protect confidential information</li>
       </ul>

       <h3>Employment and Contractor Documents</h3>
       <ol>
         <li><strong>Employment Agreements:</strong> Terms for full-time employees</li>
         <li><strong>Independent Contractor Agreements:</strong> Terms for freelancers</li>
         <li><strong>Employee Handbooks:</strong> Company policies and procedures</li>
         <li><strong>Stock Option Agreements:</strong> Equity compensation</li>
       </ol>

       <h3>Compliance and Regulatory Documents</h3>
       <ul>
         <li><strong>Privacy Policy:</strong> Data protection compliance</li>
         <li><strong>Terms of Service:</strong> User agreement terms</li>
         <li><strong>Cookie Policy:</strong> Cookie usage disclosure</li>
         <li><strong>GDRP Compliance:</strong> EU data protection requirements</li>
       </ul>

       <h3>When to Consult a Lawyer</h3>
       <p>Know when you need professional legal help:</p>
       <ul>
         <li>Complex financing rounds</li>
         <li>International expansion</li>
         <li>Regulatory compliance issues</li>
         <li>Legal disputes or lawsuits</li>
       </ul>',
       9, 'beginner', '["legal", "startup", "documents"]', 0, 'Attorney Rachel Green', 'Startup lawyer and legal advisor'),

      (4, 'Industry Analysis: Technology Trends 2024',
       'industry-analysis-technology-trends-2024',
       'Comprehensive analysis of emerging technology trends shaping the startup landscape in 2024.',
       '<h2>Technology Trends Shaping 2024</h2>
       <p>The technology landscape is evolving rapidly, creating new opportunities and challenges for startups. Understanding these trends is essential for building future-ready businesses.</p>

       <h3>Artificial Intelligence and Machine Learning</h3>
       <ul>
         <li><strong>Generative AI:</strong> Creating new content and solutions</li>
         <li><strong>AI Automation:</strong> Streamlining business processes</li>
         <li><strong>Computer Vision:</strong> Advanced image and video analysis</li>
         <li><strong>Natural Language Processing:</strong> Human-like text understanding</li>
       </ul>

       <h3>Web3 and Blockchain Technology</h3>
       <p>Decentralized technologies are maturing:</p>
       <ul>
         <li><strong>DeFi Platforms:</strong> Decentralized finance solutions</li>
         <li><strong>NFT Marketplaces:</strong> Digital asset trading platforms</li>
         <li><strong>DAO Governance:</strong> Decentralized autonomous organizations</li>
         <li><strong>Web3 Infrastructure:</strong> Supporting decentralized applications</li>
       </ul>

       <h3>Extended Reality (XR)</h3>
       <ol>
         <li><strong>Virtual Reality:</strong> Immersive training and entertainment</li>
         <li><strong>Augmented Reality:</strong> Enhanced real-world experiences</li>
         <li><strong>Mixed Reality:</strong> Blending digital and physical worlds</li>
         <li><strong>Metaverse Platforms:</strong> Virtual social and commercial spaces</li>
       </ol>

       <h3>Edge Computing and IoT</h3>
       <ul>
         <li><strong>5G Networks:</strong> Enabling real-time connectivity</li>
         <li><strong>Edge AI:</strong> Processing data at the source</li>
         <li><strong>Smart Cities:</strong> Connected urban infrastructure</li>
         <li><strong>Industrial IoT:</strong> Manufacturing optimization</li>
       </ul>

       <h3>Implications for Startups</h3>
       <p>How these trends affect startup strategy:</p>
       <ul>
         <li>Focus on AI integration across products</li>
         <li>Consider blockchain for trust and transparency</li>
         <li>Explore XR for enhanced user experiences</li>
         <li>Leverage edge computing for performance</li>
       </ul>

       <h3>Risk Considerations</h3>
       <ul>
         <li>Regulatory uncertainty in emerging technologies</li>
         <li>High competition in trending areas</li>
         <li>Technical complexity and talent requirements</li>
         <li>Market timing and adoption challenges</li>
       </ul>',
       13, 'advanced', '["technology-trends", "industry-analysis", "innovation"]', 1, 'Dr. James Wilson', 'Technology analyst and futurist'),

      (4, 'Building a Personal Brand as a Founder',
       'building-personal-brand-founder',
       'Strategies for establishing yourself as a thought leader and attracting opportunities.',
       '<h2>The Power of Personal Branding</h2>
       <p>In today''s connected world, your personal brand can be as important as your company''s brand. Learn how to build a compelling personal brand that attracts investors, customers, and talent.</p>

       <h3>Define Your Unique Value Proposition</h3>
       <ul>
         <li><strong>Identify Your Expertise:</strong> What are you uniquely qualified to speak about?</li>
         <li><strong>Clarify Your Mission:</strong> What impact do you want to make?</li>
         <li><strong>Define Your Audience:</strong> Who do you want to reach?</li>
         <li><strong>Craft Your Story:</strong> What makes your journey compelling?</li>
       </ul>

       <h3>Content Creation Strategy</h3>
       <p>Build visibility through consistent, valuable content:</p>
       <ol>
         <li><strong>Choose Your Platforms:</strong> LinkedIn, Twitter, YouTube, blogging</li>
         <li><strong>Develop a Content Calendar:</strong> Plan topics and posting schedule</li>
         <li><strong>Create High-Quality Content:</strong> Focus on depth and value</li>
         <li><strong>Engage with Your Audience:</strong> Respond to comments and messages</li>
       </ol>

       <h3>Networking and Visibility</h3>
       <ul>
         <li><strong>Speak at Conferences:</strong> Share your expertise publicly</li>
         <li><strong>Contribute to Publications:</strong> Write guest articles</li>
         <li><strong>Build Strategic Partnerships:</strong> Collaborate with influencers</li>
         <li><strong>Seek Media Opportunities:</strong> Pitch stories to journalists</li>
       </ul>

       <h3>Measuring Success</h3>
       <p>Track these metrics to evaluate your personal branding efforts:</p>
       <ul>
         <li>Follower growth and engagement rates</li>
         <li>Media mentions and coverage</li>
         <li>Speaking opportunities and invitations</li>
         <li>Partnership and collaboration requests</li>
       </ul>

       <h3>Maintaining Authenticity</h3>
       <ul>
         <li>Stay true to your values and mission</li>
         <li>Be transparent about challenges and failures</li>
         <li>Share both successes and lessons learned</li>
         <li>Build genuine relationships, not just connections</li>
       </ul>

       <h3>Common Pitfalls to Avoid</h3>
       <ul>
         <li>Over-promotion without providing value</li>
         <li>Inconsistent messaging across platforms</li>
         <li>Neglecting personal relationships for online presence</li>
         <li>Focusing on quantity over quality</li>
       </ul>',
       11, 'intermediate', '["personal-branding", "thought-leadership", "marketing"]', 0, 'Sophia Rodriguez', 'Personal branding coach and entrepreneur')
    `;

    try {
      await db.run(insertGettingStartedArticles);
      await db.run(insertCoursesArticles);
      await db.run(insertTutorialsArticles);
      await db.run(insertResourcesArticles);

      console.log('Learning articles populated successfully');
    } catch (error) {
      console.error('Error populating learning articles:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Remove all articles except the original sample ones
      await db.run(`
        DELETE FROM learning_articles
        WHERE slug IN (
          'how-to-identify-a-problem-worth-solving',
          'building-your-first-mvp',
          'customer-discovery-and-validation',
          'business-model-canvas-strategic-tool',
          'financial-planning-for-early-stage-startups',
          'building-and-leading-high-performance-teams',
          'creating-effective-landing-pages',
          'using-ai-tools-market-research',
          'collaborative-project-management',
          'startup-legal-checklist-essential-documents',
          'industry-analysis-technology-trends-2024',
          'building-a-personal-brand-founder'
        )
      `);

      console.log('Learning articles removed successfully');
    } catch (error) {
      console.error('Error removing learning articles:', error);
      throw error;
    }
  },
};
