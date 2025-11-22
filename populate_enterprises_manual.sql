-- Manual SQL to populate Enterprises table
-- Run this in your Supabase SQL Editor

INSERT INTO "Enterprises" (user_id, name, description, industry, founded_date, website, status, company_size, revenue, location, created_at)
VALUES
  (501, 'Global Tech Solutions LLC', 'A leading technology company specializing in enterprise solutions and digital transformation.', 'Technology', '2015-03-15', 'https://globaltechsolutions.com', 'active', 'enterprise', 2500000000, 'New York, NY', NOW()),
  (502, 'Advanced Healthcare Systems Inc', 'Innovative healthcare technology company providing comprehensive patient management solutions.', 'Healthcare', '2012-08-20', 'https://advancedhealthcare.com', 'active', 'large', 1800000000, 'Boston, MA', NOW()),
  (501, 'Premier Financial Group Corp', 'Established financial services company offering comprehensive banking and investment solutions.', 'Finance', '2008-11-10', 'https://premierfinancial.com', 'active', 'enterprise', 5000000000, 'Chicago, IL', NOW()),
  (502, 'NextGen Manufacturing Ltd', 'Dynamic manufacturing company specializing in smart factory automation and IoT solutions.', 'Manufacturing', '2018-01-25', 'https://nextgenmfg.com', 'active', 'large', 1200000000, 'Detroit, MI', NOW()),
  (501, 'Elite Retail Solutions Inc', 'Growing retail technology company providing omnichannel commerce platforms.', 'Retail', '2016-06-12', 'https://eliteretail.com', 'active', 'medium', 800000000, 'Austin, TX', NOW()),
  (502, 'Smart Energy Corporation', 'Established energy company focused on renewable energy solutions and smart grid technology.', 'Energy', '2010-04-18', 'https://smartenergy.com', 'active', 'enterprise', 3200000000, 'Denver, CO', NOW()),
  (501, 'Future Transportation Systems', 'Innovative transportation technology company developing autonomous vehicle solutions.', 'Transportation', '2019-09-05', 'https://futuretransport.com', 'active', 'medium', 600000000, 'San Francisco, CA', NOW()),
  (502, 'Global Education Platform Inc', 'Comprehensive education technology platform serving millions of learners worldwide.', 'Education', '2014-12-01', 'https://globaleducation.com', 'active', 'large', 950000000, 'Seattle, WA', NOW()),
  (501, 'Advanced Consulting Group', 'Premier management consulting firm specializing in digital transformation and strategy.', 'Consulting', '2005-07-22', 'https://advancedconsulting.com', 'active', 'medium', 450000000, 'Los Angeles, CA', NOW()),
  (502, 'Innovative Real Estate Corp', 'Technology-driven real estate company providing proptech solutions and smart building management.', 'Real Estate', '2017-02-14', 'https://innovativere.com', 'active', 'large', 1500000000, 'Miami, FL', NOW());