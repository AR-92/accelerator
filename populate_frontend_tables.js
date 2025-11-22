import DatabaseService from './src/services/supabase.js';

const populateFrontendTables = async () => {
  try {
    console.log('Populating tables needed for frontend display...');

    // Populate landing_pages table
    console.log('Populating landing_pages table...');
    const landingPages = [
      {
        section_type: 'hero',
        title: 'Welcome to Accelerator',
        subtitle: 'Build and scale your startup with our comprehensive platform',
        content: 'Accelerator provides everything you need to launch, grow, and manage your business. From business planning to financial modeling, we have you covered.',
        button_text: 'Get Started',
        button_url: '/register',
        sort_order: 1,
        is_active: true
      },
      {
        section_type: 'features',
        title: 'Powerful Features',
        subtitle: 'Everything you need to succeed',
        content: 'Our platform includes business planning, financial modeling, team management, and investor relations tools.',
        sort_order: 2,
        is_active: true
      },
      {
        section_type: 'testimonials',
        title: 'What Our Users Say',
        subtitle: 'Join thousands of successful entrepreneurs',
        content: 'Accelerator helped me turn my idea into a successful business. The tools are comprehensive and easy to use.',
        sort_order: 3,
        is_active: true
      },
      {
        section_type: 'cta',
        title: 'Ready to Get Started?',
        subtitle: 'Join the accelerator community today',
        content: 'Start building your business plan and financial model with our expert guidance.',
        button_text: 'Start Free Trial',
        button_url: '/register',
        sort_order: 4,
        is_active: true
      },
      {
        section_type: 'footer',
        title: 'Contact Us',
        content: 'Have questions? Get in touch with our team.',
        sort_order: 5,
        is_active: true
      }
    ];

    for (const page of landingPages) {
      await DatabaseService.create('landing_pages', page);
    }
    console.log('✅ Populated landing_pages table with 5 records');

    // Populate collaborations table
    console.log('Populating collaborations table...');
    const collaborations = [
      {
        project_id: 1,
        collaborator_user_id: 502,
        role: 'editor',
        status: 'accepted'
      },
      {
        project_id: 1,
        collaborator_user_id: 501,
        role: 'viewer',
        status: 'pending'
      },
      {
        project_id: 2,
        collaborator_user_id: 502,
        role: 'admin',
        status: 'accepted'
      },
      {
        project_id: 2,
        collaborator_user_id: 501,
        role: 'editor',
        status: 'accepted'
      },
      {
        project_id: 1,
        collaborator_user_id: 503,
        role: 'viewer',
        status: 'pending'
      }
    ];

    for (const collab of collaborations) {
      await DatabaseService.create('collaborations', collab);
    }
    console.log('✅ Populated collaborations table with 5 records');

    // Populate messages table (for project communication)
    console.log('Populating messages table...');
    const messages = [
      {
        project_id: 1,
        user_id: 501,
        body: 'Welcome to the Accelerator Platform project! Let\'s build something amazing together.'
      },
      {
        project_id: 1,
        user_id: 502,
        body: 'Thanks for the invite! I\'m excited to collaborate on this project.'
      },
      {
        project_id: 2,
        user_id: 502,
        body: 'I\'ve updated the business plan with the latest financial projections.'
      },
      {
        project_id: 2,
        user_id: 501,
        body: 'Great work! The projections look solid. Let\'s schedule a review meeting.'
      }
    ];

    for (const message of messages) {
      await DatabaseService.create('messages', message);
    }
    console.log('✅ Populated messages table with 4 records');

    // Populate project_collaborators table
    console.log('Populating project_collaborators table...');
    const projectCollaborators = [
      {
        project_id: 1,
        user_id: 502,
        role: 'member'
      },
      {
        project_id: 1,
        user_id: 501,
        role: 'owner'
      },
      {
        project_id: 2,
        user_id: 502,
        role: 'owner'
      },
      {
        project_id: 2,
        user_id: 501,
        role: 'member'
      }
    ];

    for (const collab of projectCollaborators) {
      await DatabaseService.create('project_collaborators', collab);
    }
    console.log('✅ Populated project_collaborators table with 4 records');

    console.log('🎉 All frontend tables populated successfully!');

    // Verification
    console.log('\nVerifying populated data...');
    const tables = ['landing_pages', 'collaborations', 'messages', 'project_collaborators'];
    for (const table of tables) {
      try {
        const { count, error } = await DatabaseService.supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`${table}: Error - ${error.message}`);
        } else {
          console.log(`${table}: ${count} records`);
        }
      } catch (e) {
        console.log(`${table}: Exception`);
      }
    }

  } catch (error) {
    console.error('❌ Error during frontend table population:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateFrontendTables().catch(console.error);
}

export default populateFrontendTables;