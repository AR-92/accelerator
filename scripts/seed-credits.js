import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const creditPackages = [
  {
    name: 'Starter Pack',
    description: 'Perfect for trying out premium features',
    credits: 100,
    price_riyals: 1.0,
    price_usd: 0.27,
  },
  {
    name: 'Popular Pack',
    description: 'Most chosen package for regular users',
    credits: 250,
    price_riyals: 2.5,
    price_usd: 0.67,
  },
  {
    name: 'Pro Pack',
    description: 'For power users and small teams',
    credits: 500,
    price_riyals: 5.0,
    price_usd: 1.35,
  },
  {
    name: 'Enterprise Pack',
    description: 'Maximum value for large organizations',
    credits: 1000,
    price_riyals: 10.0,
    price_usd: 2.7,
  },
];

async function seedCreditPackages() {
  try {
    console.log('Seeding credit packages...');

    for (const pkg of creditPackages) {
      // Check if package already exists
      const { data: existing } = await supabase
        .from('credit_packages')
        .select('id')
        .eq('name', pkg.name)
        .single();

      if (existing) {
        console.log('Package already exists:', pkg.name);
        continue;
      }

      const { data, error } = await supabase
        .from('credit_packages')
        .insert(pkg);

      if (error) {
        console.error('Error seeding package:', pkg.name, error);
      } else {
        console.log('Seeded package:', pkg.name);
      }
    }

    console.log('Credit packages seeded successfully!');
  } catch (error) {
    console.error('Error seeding credit packages:', error);
  }
}

seedCreditPackages();
