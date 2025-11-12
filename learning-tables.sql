-- LEARNING CATEGORIES - Created standalone
CREATE TABLE learning_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(7) DEFAULT '#3B82F6',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  parent_category_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- LEARNING ARTICLES - Created after learning_categories
CREATE TABLE learning_articles (
  id SERIAL PRIMARY KEY,
  category_id INTEGER,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  read_time_minutes INTEGER DEFAULT 5,
  difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  tags JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  author_name VARCHAR(255),
  author_bio TEXT,
  author_image VARCHAR(500),
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP
);

-- Add foreign key constraints for learning tables
ALTER TABLE learning_categories
  ADD CONSTRAINT learning_categories_parent_category_id_fkey
  FOREIGN KEY (parent_category_id) REFERENCES learning_categories(id) ON DELETE SET NULL;

ALTER TABLE learning_articles
  ADD CONSTRAINT learning_articles_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES learning_categories(id) ON DELETE SET NULL;

-- Add indexes for learning tables
CREATE INDEX idx_learning_categories_slug ON learning_categories(slug);
CREATE INDEX idx_learning_categories_is_active ON learning_categories(is_active);
CREATE INDEX idx_learning_categories_sort_order ON learning_categories(sort_order);
CREATE INDEX idx_learning_articles_category_id ON learning_articles(category_id);
CREATE INDEX idx_learning_articles_slug ON learning_articles(slug);
CREATE INDEX idx_learning_articles_is_published ON learning_articles(is_published);
CREATE INDEX idx_learning_articles_is_featured ON learning_articles(is_featured);
CREATE INDEX idx_learning_articles_difficulty_level ON learning_articles(difficulty_level);