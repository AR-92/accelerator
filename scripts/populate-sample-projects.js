/**
 * Seed script for sample projects and project stages
 * Creates sample projects with different stages
 */

const { db, dbAll, dbRun } = require('../config/database');

async function populateSampleProjects() {
  try {
    console.log('Populating sample projects and stages...');

    // Get user and model IDs
    const users = await dbAll('SELECT id, email FROM users');
    const models = await dbAll('SELECT model_id, model_name FROM ai_models');

    const userMap = {};
    users.forEach((user) => {
      userMap[user.email] = user.id;
    });

    const modelMap = {};
    models.forEach((model) => {
      modelMap[model.model_name] = model.model_id;
    });

    // Create sample projects
    const projects = [
      {
        owner_id: userMap['founder@startupxyz.com'],
        title: 'AI-Powered Health Monitoring App',
        description:
          'A mobile app that uses AI to monitor user health metrics and provide personalized wellness recommendations.',
        visibility: 'public',
      },
      {
        owner_id: userMap['student1@university.edu'],
        title: 'Sustainable Urban Farming Platform',
        description:
          'A platform connecting urban farmers with consumers, promoting sustainable agriculture in cities.',
        visibility: 'public',
      },
      {
        owner_id: userMap['director@innovatelabs.com'],
        title: 'Blockchain Supply Chain Tracker',
        description:
          'A blockchain-based system for transparent supply chain tracking and verification.',
        visibility: 'private',
      },
      {
        owner_id: userMap['student2@university.edu'],
        title: 'Virtual Reality Learning Environment',
        description:
          'An immersive VR platform for interactive education and skill development.',
        visibility: 'public',
      },
      {
        owner_id: userMap['ceo@techcorp.com'],
        title: 'Smart City Infrastructure Management',
        description:
          'IoT-based system for managing and optimizing city infrastructure operations.',
        visibility: 'private',
      },
    ];

    const projectIds = [];

    for (const project of projects) {
      const result = await dbRun(
        `INSERT INTO projects (owner_user_id, title, description, visibility)
         VALUES (?, ?, ?, ?)`,
        [
          project.owner_id,
          project.title,
          project.description,
          project.visibility,
        ]
      );
      const projectId = result.id;
      projectIds.push(projectId);
    }

    // Create project stages for each project
    const projectStages = [
      // Project 1: Health Monitoring App
      {
        project_id: projectIds[0],
        model_id: modelMap['Idea Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[0],
        model_id: modelMap['Business Model'],
        completion_percentage: 75,
      },
      {
        project_id: projectIds[0],
        model_id: modelMap['Financial Model'],
        completion_percentage: 30,
      },
      {
        project_id: projectIds[0],
        model_id: modelMap['Team Model'],
        completion_percentage: 0,
      },

      // Project 2: Urban Farming Platform
      {
        project_id: projectIds[1],
        model_id: modelMap['Idea Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[1],
        model_id: modelMap['Business Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[1],
        model_id: modelMap['Marketing Model'],
        completion_percentage: 60,
      },
      {
        project_id: projectIds[1],
        model_id: modelMap['Financial Model'],
        completion_percentage: 20,
      },

      // Project 3: Blockchain Supply Chain
      {
        project_id: projectIds[2],
        model_id: modelMap['Idea Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[2],
        model_id: modelMap['Business Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[2],
        model_id: modelMap['Financial Model'],
        completion_percentage: 80,
      },
      {
        project_id: projectIds[2],
        model_id: modelMap['Legal Model'],
        completion_percentage: 40,
      },

      // Project 4: VR Learning
      {
        project_id: projectIds[3],
        model_id: modelMap['Idea Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[3],
        model_id: modelMap['Business Model'],
        completion_percentage: 50,
      },
      {
        project_id: projectIds[3],
        model_id: modelMap['Team Model'],
        completion_percentage: 10,
      },

      // Project 5: Smart City
      {
        project_id: projectIds[4],
        model_id: modelMap['Idea Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[4],
        model_id: modelMap['Business Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[4],
        model_id: modelMap['Financial Model'],
        completion_percentage: 100,
      },
      {
        project_id: projectIds[4],
        model_id: modelMap['Funding Model'],
        completion_percentage: 90,
      },
      {
        project_id: projectIds[4],
        model_id: modelMap['Team Model'],
        completion_percentage: 70,
      },
    ];

    for (const stage of projectStages) {
      await dbRun(
        `INSERT INTO project_stages (project_id, model_id, completion_percentage)
         VALUES (?, ?, ?)`,
        [stage.project_id, stage.model_id, stage.completion_percentage]
      );
    }

    // Add some collaborators
    const collaborators = [
      {
        project_id: projectIds[0],
        user_id: userMap['student1@university.edu'],
        role: 'member',
      },
      {
        project_id: projectIds[1],
        user_id: userMap['student2@university.edu'],
        role: 'member',
      },
      {
        project_id: projectIds[2],
        user_id: userMap['founder@startupxyz.com'],
        role: 'admin',
      },
      {
        project_id: projectIds[3],
        user_id: userMap['director@innovatelabs.com'],
        role: 'member',
      },
      {
        project_id: projectIds[4],
        user_id: userMap['manager@nextgen.com'],
        role: 'member',
      },
    ];

    for (const collab of collaborators) {
      await dbRun(
        `INSERT INTO project_collaborators (project_id, user_id, role)
         VALUES (?, ?, ?)`,
        [collab.project_id, collab.user_id, collab.role]
      );
    }

    console.log(
      '✅ Sample projects, stages, and collaborators populated successfully!'
    );
    console.log(
      `Created ${projects.length} projects with associated stages and collaborators.`
    );
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to populate sample projects:', error);
    process.exit(1);
  }
}

populateSampleProjects();
