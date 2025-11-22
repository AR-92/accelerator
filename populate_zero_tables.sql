-- Populate tables with zero records using raw SQL

-- Enterprises table
INSERT INTO "Enterprises" (user_id, name, description, industry, founded_date, website, status, company_size, revenue, location, created_at)
VALUES
  (501, 'Global Tech Solutions', 'Leading enterprise software solutions provider', 'Enterprise Software', '2015-06-15', 'https://globaltechsolutions.com', 'active', 'enterprise', 500000000, 'Seattle, WA', NOW()),
  (502, 'Innovative Manufacturing Corp', 'Advanced manufacturing technologies and automation', 'Manufacturing', '2010-03-20', 'https://innovativemfg.com', 'active', 'large', 750000000, 'Detroit, MI', NOW()),
  (501, 'Healthcare Systems International', 'Comprehensive healthcare management systems', 'Healthcare Technology', '2008-11-10', 'https://healthcaresystems.com', 'active', 'enterprise', 1200000000, 'Boston, MA', NOW());

-- Landing Page Management table (only has id and created_at)
-- Since it only has auto-generated columns, we'll insert with default values
INSERT INTO "Landing Page Management" DEFAULT VALUES;
INSERT INTO "Landing Page Management" DEFAULT VALUES;
INSERT INTO "Landing Page Management" DEFAULT VALUES;

-- Corporate table (only has id and created_at)
INSERT INTO "Corporate" DEFAULT VALUES;
INSERT INTO "Corporate" DEFAULT VALUES;
INSERT INTO "Corporate" DEFAULT VALUES;

-- Votes Management table (only has id and created_at)
INSERT INTO "Votes Management" DEFAULT VALUES;
INSERT INTO "Votes Management" DEFAULT VALUES;
INSERT INTO "Votes Management" DEFAULT VALUES;
INSERT INTO "Votes Management" DEFAULT VALUES;
INSERT INTO "Votes Management" DEFAULT VALUES;