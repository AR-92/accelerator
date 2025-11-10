/**
 * Script to populate billing, rewards, votes, and credits tables with sample data
 */

const { db } = require('../config/database');

// Promisify db.run
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const billingData = [];
for (let i = 1; i <= 20; i++) {
  const userId = (i % 10) + 1; // Cycle through users 1-10
  const packageId = (i % 3) + 1; // Cycle through packages 1-3
  const statuses = ['completed', 'pending', 'processing', 'failed'];
  const payments = ['credit_card', 'paypal', 'bank_transfer', 'crypto'];
  const amounts = [9.99, 29.99, 99.99];
  billingData.push({
    user_id: userId,
    package_id: packageId,
    transaction_id: `txn_${1000000000 + i}`,
    amount: amounts[packageId - 1],
    currency: 'USD',
    status: statuses[i % statuses.length],
    payment_method: payments[i % payments.length],
    description: `Purchase of Package ${packageId}`,
    metadata: JSON.stringify({
      source: 'web',
      campaign: `campaign_${(i % 3) + 1}`,
    }),
    processed_at:
      i % 4 === 0
        ? null
        : `2024-${String((i % 12) + 1).padStart(2, '0')}-15 10:30:00`,
    invoice_url:
      i % 5 === 0
        ? null
        : `https://billing.example.com/invoice/${1000000000 + i}`,
    refund_amount: i % 10 === 0 ? amounts[packageId - 1] * 0.5 : 0,
    refund_reason: i % 10 === 0 ? 'Customer request' : null,
  });
}

const rewardsData = [];
const rewardTypes = [
  'signup_bonus',
  'referral',
  'achievement',
  'monthly_bonus',
  'milestone',
  'contest_win',
];
const rewardTitles = [
  'Welcome Bonus',
  'Referral Reward',
  'First Idea',
  'Monthly Active',
  'Milestone Reached',
  'Contest Winner',
];
const rewardDescriptions = [
  'Bonus for signing up',
  'Credits for referring',
  'Achievement unlocked',
  'Monthly activity bonus',
  'Milestone reward',
  'Contest win prize',
];
const statuses = ['active', 'used', 'expired'];
for (let i = 1; i <= 20; i++) {
  const typeIndex = (i - 1) % rewardTypes.length;
  rewardsData.push({
    user_id: (i % 10) + 1,
    type: rewardTypes[typeIndex],
    title: rewardTitles[typeIndex],
    description: rewardDescriptions[typeIndex],
    credits: Math.floor(Math.random() * 100) + 10,
    status: statuses[i % statuses.length],
    earned_at: `2024-${String((i % 12) + 1).padStart(2, '0')}-01 00:00:00`,
    expires_at: `2024-${String((i % 12) + 2).padStart(2, '0')}-01 00:00:00`,
    metadata: JSON.stringify({
      source: 'system',
      level: Math.floor(Math.random() * 5) + 1,
    }),
    admin_id: i % 5 === 0 ? 1 : null,
  });
}

const votesData = [];
const ideaSlugs = [
  'sample-idea-1',
  'sample-idea-2',
  'sample-idea-3',
  'sample-idea-4',
  'sample-idea-5',
];
for (let i = 1; i <= 20; i++) {
  votesData.push({
    user_id: (i % 10) + 1,
    idea_slug: ideaSlugs[(i - 1) % ideaSlugs.length],
    market_viability: Math.floor(Math.random() * 5) + 1,
    real_world_problem: Math.floor(Math.random() * 5) + 1,
    innovation: Math.floor(Math.random() * 5) + 1,
    technical_feasibility: Math.floor(Math.random() * 5) + 1,
    scalability: Math.floor(Math.random() * 5) + 1,
    market_survival: Math.floor(Math.random() * 5) + 1,
  });
}

const creditsData = [];
for (let i = 1; i <= 20; i++) {
  creditsData.push({
    user_id: i,
    credits: Math.floor(Math.random() * 500) + 50,
  });
}

const packagesData = [
  {
    name: 'Starter Pack',
    description: 'Perfect for getting started with basic features',
    price: 9.99,
    credits: 100,
    features: '["Basic AI assistance", "Community access", "Email support"]',
    status: 'active',
    sort_order: 1,
    is_popular: false,
    is_recommended: false,
  },
  {
    name: 'Professional Pack',
    description: 'Advanced features for growing businesses',
    price: 29.99,
    credits: 500,
    features:
      '["Advanced AI assistance", "Priority support", "Analytics dashboard", "API access"]',
    status: 'active',
    sort_order: 2,
    is_popular: true,
    is_recommended: false,
  },
  {
    name: 'Enterprise Pack',
    description: 'Complete solution for large organizations',
    price: 99.99,
    credits: 2000,
    features:
      '["Unlimited AI assistance", "Dedicated support", "Custom integrations", "White-label options", "Advanced analytics"]',
    status: 'active',
    sort_order: 3,
    is_popular: false,
    is_recommended: true,
  },
  {
    name: 'Basic Pack',
    description: 'Essential features for individuals',
    price: 4.99,
    credits: 50,
    features: '["Basic AI assistance", "Community access"]',
    status: 'active',
    sort_order: 4,
    is_popular: false,
    is_recommended: false,
  },
  {
    name: 'Premium Pack',
    description: 'Premium features for power users',
    price: 49.99,
    credits: 1000,
    features:
      '["Advanced AI assistance", "Priority support", "Analytics dashboard", "API access", "Custom integrations"]',
    status: 'active',
    sort_order: 5,
    is_popular: false,
    is_recommended: true,
  },
];

async function populateSampleData() {
  try {
    console.log('Starting sample data population...');

    // Clear existing data
    console.log('Clearing existing data...');
    await dbRun('DELETE FROM billing');
    await dbRun('DELETE FROM rewards');
    await dbRun('DELETE FROM votes');
    await dbRun('DELETE FROM packages');

    // Insert packages data
    console.log('Inserting packages data...');
    for (const pkg of packagesData) {
      const sql = `
        INSERT INTO packages (
          name, description, price, credits, features, status, sort_order, is_popular, is_recommended
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      try {
        await dbRun(sql, [
          pkg.name,
          pkg.description,
          pkg.price,
          pkg.credits,
          pkg.features,
          pkg.status,
          pkg.sort_order,
          pkg.is_popular,
          pkg.is_recommended,
        ]);
        console.log(`Inserted package: ${pkg.name}`);
      } catch (error) {
        console.error(`Error inserting package ${pkg.name}:`, error);
      }
    }

    // Insert billing data
    console.log('Inserting billing data...');
    for (const billing of billingData) {
      const sql = `
        INSERT INTO billing (
          user_id, package_id, transaction_id, amount, currency, status,
          payment_method, description, metadata, processed_at, invoice_url, refund_amount, refund_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      try {
        await dbRun(sql, [
          billing.user_id,
          billing.package_id,
          billing.transaction_id,
          billing.amount,
          billing.currency,
          billing.status,
          billing.payment_method,
          billing.description,
          billing.metadata,
          billing.processed_at,
          billing.invoice_url,
          billing.refund_amount,
          billing.refund_reason,
        ]);
        console.log(`Inserted billing: ${billing.transaction_id}`);
      } catch (error) {
        console.error(
          `Error inserting billing ${billing.transaction_id}:`,
          error
        );
      }
    }

    // Insert rewards data
    console.log('Inserting rewards data...');
    for (const reward of rewardsData) {
      const sql = `
        INSERT INTO rewards (
          user_id, type, title, description, credits, status, earned_at, expires_at, metadata, admin_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      try {
        await dbRun(sql, [
          reward.user_id,
          reward.type,
          reward.title,
          reward.description,
          reward.credits,
          reward.status,
          reward.earned_at,
          reward.expires_at,
          reward.metadata,
          reward.admin_id,
        ]);
        console.log(`Inserted reward: ${reward.title}`);
      } catch (error) {
        console.error(`Error inserting reward ${reward.title}:`, error);
      }
    }

    // Insert votes data
    console.log('Inserting votes data...');
    for (const vote of votesData) {
      const sql = `
        INSERT INTO votes (
          user_id, idea_slug, market_viability, real_world_problem,
          innovation, technical_feasibility, scalability, market_survival
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      try {
        await dbRun(sql, [
          vote.user_id,
          vote.idea_slug,
          vote.market_viability,
          vote.real_world_problem,
          vote.innovation,
          vote.technical_feasibility,
          vote.scalability,
          vote.market_survival,
        ]);
        console.log(`Inserted vote for idea: ${vote.idea_slug}`);
      } catch (error) {
        console.error(`Error inserting vote for ${vote.idea_slug}:`, error);
      }
    }

    // Update user credits
    console.log('Updating user credits...');
    for (const credit of creditsData) {
      const sql = 'UPDATE users SET credits = ? WHERE id = ?';

      try {
        await dbRun(sql, [credit.credits, credit.user_id]);
        console.log(
          `Updated credits for user ${credit.user_id}: ${credit.credits}`
        );
      } catch (error) {
        console.error(
          `Error updating credits for user ${credit.user_id}:`,
          error
        );
      }
    }

    // Get counts
    const billingCount = await db.get('SELECT COUNT(*) as count FROM billing');
    const rewardsCount = await db.get('SELECT COUNT(*) as count FROM rewards');
    const votesCount = await db.get('SELECT COUNT(*) as count FROM votes');

    console.log(`Total billing records: ${billingCount.count}`);
    console.log(`Total rewards records: ${rewardsCount.count}`);
    console.log(`Total votes records: ${votesCount.count}`);
    console.log('Sample data population completed successfully!');
  } catch (error) {
    console.error('Error populating sample data:', error);
  } finally {
    process.exit(0);
  }
}

populateSampleData();
