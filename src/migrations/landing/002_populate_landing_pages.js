/**
 * Migration: Populate landing pages with sample data
 * Adds sample landing page sections for demonstration
 */

module.exports = {
  up: async (db) => {
    const sampleData = [
      {
        section_type: 'hero',
        title: 'Welcome to Accelerator Platform',
        subtitle: 'Empowering Innovation and Collaboration',
        content:
          'Join thousands of entrepreneurs, startups, and corporations building the future together. Our platform provides the tools, resources, and community you need to accelerate your success.',
        image_url: '/images/accelerator_logo.svg',
        button_text: 'Get Started',
        button_url: '/auth/register',
        order: 1,
        is_active: 1,
        metadata: JSON.stringify({
          background_color: '#ffffff',
          text_color: '#000000',
          hero_style: 'centered',
        }),
      },
      {
        section_type: 'features',
        title: 'Why Choose Accelerator?',
        subtitle: 'Everything you need to build and scale',
        content:
          "Our comprehensive platform offers cutting-edge tools for ideation, collaboration, funding, and growth. From concept to market leader, we've got you covered.",
        image_url: null,
        button_text: 'Learn More',
        button_url: '/learn',
        order: 2,
        is_active: 1,
        metadata: JSON.stringify({
          features: [
            {
              icon: 'Lightbulb',
              title: 'Idea Generation',
              description: 'AI-powered tools to spark innovation',
            },
            {
              icon: 'Users',
              title: 'Team Collaboration',
              description: 'Connect with like-minded entrepreneurs',
            },
            {
              icon: 'TrendingUp',
              title: 'Growth Analytics',
              description: 'Track your progress with detailed insights',
            },
          ],
          layout: 'grid',
        }),
      },
      {
        section_type: 'testimonials',
        title: 'What Our Users Say',
        subtitle: 'Success stories from our community',
        content:
          'Hear from entrepreneurs who have transformed their ideas into thriving businesses using our platform.',
        image_url: null,
        button_text: 'Join the Community',
        button_url: '/auth/register',
        order: 3,
        is_active: 1,
        metadata: JSON.stringify({
          testimonials: [
            {
              name: 'Sarah Johnson',
              role: 'Founder, TechStart Inc.',
              company: 'TechStart Inc.',
              content:
                'Accelerator Platform helped us go from idea to Series A funding in just 18 months. The community and tools are incredible.',
              avatar: '/images/placeholder.svg',
            },
            {
              name: 'Michael Chen',
              role: 'CEO, GreenTech Solutions',
              company: 'GreenTech Solutions',
              content:
                "The collaboration features connected us with the perfect co-founder and investors. We couldn't have done it without this platform.",
              avatar: '/images/placeholder.svg',
            },
            {
              name: 'Emily Rodriguez',
              role: 'Founder, EduLearn',
              company: 'EduLearn',
              content:
                'From MVP to market leader - Accelerator provided the resources and network we needed at every stage of our journey.',
              avatar: '/images/placeholder.svg',
            },
          ],
          display_style: 'carousel',
        }),
      },
      {
        section_type: 'cta',
        title: 'Ready to Accelerate Your Success?',
        subtitle: 'Join thousands of innovators today',
        content:
          'Start your journey with Accelerator Platform. Create your account, share your ideas, and connect with a community ready to help you succeed.',
        image_url: null,
        button_text: 'Start Your Journey',
        button_url: '/auth/register',
        order: 4,
        is_active: 1,
        metadata: JSON.stringify({
          background_color: '#f8fafc',
          button_style: 'primary',
          urgency_text:
            'Limited time offer: Free premium access for the first 100 users!',
        }),
      },
      {
        section_type: 'about',
        title: 'About Accelerator Platform',
        subtitle: 'Building the future of entrepreneurship',
        content:
          'Founded in 2024, Accelerator Platform is the leading ecosystem for entrepreneurs, startups, and corporations. Our mission is to democratize innovation and provide every idea with the resources it needs to succeed.',
        image_url: '/images/accelerator_logo.svg',
        button_text: 'Our Story',
        button_url: '/about',
        order: 5,
        is_active: 1,
        metadata: JSON.stringify({
          stats: [
            { number: '10,000+', label: 'Active Users' },
            { number: '2,500+', label: 'Successful Startups' },
            { number: '500M+', label: 'Funding Raised' },
            { number: '50+', label: 'Countries' },
          ],
          mission:
            'To empower every innovator with the tools, community, and resources needed to turn ideas into reality.',
        }),
      },
      {
        section_type: 'pricing',
        title: 'Choose Your Plan',
        subtitle: 'Flexible pricing for every stage of your journey',
        content:
          "Whether you're just starting out or scaling to millions, we have a plan that fits your needs and budget.",
        image_url: null,
        button_text: 'View All Plans',
        button_url: '/pricing',
        order: 6,
        is_active: 1,
        metadata: JSON.stringify({
          plans: [
            {
              name: 'Starter',
              price: '$0',
              period: 'month',
              features: [
                'Basic ideation tools',
                'Community access',
                '5 projects',
                'Email support',
              ],
              popular: false,
              button_text: 'Get Started',
            },
            {
              name: 'Professional',
              price: '$29',
              period: 'month',
              features: [
                'Advanced AI tools',
                'Priority support',
                'Unlimited projects',
                'Team collaboration',
                'Analytics dashboard',
              ],
              popular: true,
              button_text: 'Start Free Trial',
            },
            {
              name: 'Enterprise',
              price: '$99',
              period: 'month',
              features: [
                'Everything in Professional',
                'Custom integrations',
                'Dedicated success manager',
                'Advanced security',
                'White-label options',
              ],
              popular: false,
              button_text: 'Contact Sales',
            },
          ],
          highlight_popular: true,
        }),
      },
      {
        section_type: 'contact',
        title: 'Get in Touch',
        subtitle: "We'd love to hear from you",
        content:
          'Have questions about our platform? Need help getting started? Our team is here to support your success.',
        image_url: null,
        button_text: 'Contact Us',
        button_url: '/contact',
        order: 7,
        is_active: 1,
        metadata: JSON.stringify({
          contact_info: {
            email: 'hello@acceleratorplatform.com',
            phone: '+1 (555) 123-4567',
            address: '123 Innovation Drive, Tech City, TC 12345',
          },
          social_links: [
            { platform: 'twitter', url: 'https://twitter.com/accelerator' },
            {
              platform: 'linkedin',
              url: 'https://linkedin.com/company/accelerator',
            },
            { platform: 'github', url: 'https://github.com/accelerator' },
          ],
          support_hours: 'Monday - Friday, 9 AM - 6 PM EST',
        }),
      },
    ];

    try {
      for (const item of sampleData) {
        const sql = `
          INSERT INTO landing_pages (
            section_type, title, subtitle, content, image_url,
            button_text, button_url, "order", is_active, metadata
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.run(sql, [
          item.section_type,
          item.title,
          item.subtitle,
          item.content,
          item.image_url,
          item.button_text,
          item.button_url,
          item.order,
          item.is_active,
          item.metadata,
        ]);
      }

      console.log('Sample landing page data inserted successfully');
    } catch (error) {
      console.error('Error inserting sample landing page data:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run(
        'DELETE FROM landing_pages WHERE section_type IN (?, ?, ?, ?, ?, ?, ?)',
        [
          'hero',
          'features',
          'testimonials',
          'cta',
          'about',
          'pricing',
          'contact',
        ]
      );

      console.log('Sample landing page data removed successfully');
    } catch (error) {
      console.error('Error removing sample landing page data:', error);
      throw error;
    }
  },
};
