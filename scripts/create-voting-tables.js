import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function createVotingTables() {
  try {
    console.log('Creating voting and rewards tables...');

    // Create idea_favorites table
    const { error: favError } = await supabase.rpc(
      'create_idea_favorites_table',
      {}
    );
    if (favError && !favError.message.includes('already exists')) {
      console.error('Error creating idea_favorites:', favError);
    } else {
      console.log('✅ idea_favorites table ready');
    }

    // Create idea_likes table (if separate from upvotes)
    const { error: likeError } = await supabase.rpc(
      'create_idea_likes_table',
      {}
    );
    if (likeError && !likeError.message.includes('already exists')) {
      console.error('Error creating idea_likes:', likeError);
    } else {
      console.log('✅ idea_likes table ready');
    }

    // Create idea_copies table
    const { error: copyError } = await supabase.rpc(
      'create_idea_copies_table',
      {}
    );
    if (copyError && !copyError.message.includes('already exists')) {
      console.error('Error creating idea_copies:', copyError);
    } else {
      console.log('✅ idea_copies table ready');
    }

    // Create idea_views table (if separate from view_count)
    const { error: viewError } = await supabase.rpc(
      'create_idea_views_table',
      {}
    );
    if (viewError && !viewError.message.includes('already exists')) {
      console.error('Error creating idea_views:', viewError);
    } else {
      console.log('✅ idea_views table ready');
    }

    // Create idea_ratings table
    const { error: ratingError } = await supabase.rpc(
      'create_idea_ratings_table',
      {}
    );
    if (ratingError && !ratingError.message.includes('already exists')) {
      console.error('Error creating idea_ratings:', ratingError);
    } else {
      console.log('✅ idea_ratings table ready');
    }

    // Create votes table
    const { error: voteError } = await supabase.rpc('create_votes_table', {});
    if (voteError && !voteError.message.includes('already exists')) {
      console.error('Error creating votes:', voteError);
    } else {
      console.log('✅ votes table ready');
    }

    console.log('All tables created or already exist.');
  } catch (error) {
    console.error('Error creating tables:', error);
    console.log('You may need to run the SQL manually in Supabase dashboard.');
  }
}

createVotingTables();
