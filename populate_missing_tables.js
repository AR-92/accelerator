import DatabaseService from './src/services/supabase.js';

const populateMissingTables = async () => {
  try {
    console.log('Starting population of missing table data...');

    // Business Model - Add comprehensive data
    const businessModels = [
      {
        user_id: 501,
        session_id: 'session501',
        status: 'completed',
        current_section: 5,
        overall_progress: 1.0,
        core_function: 'To provide innovative AI solutions for businesses',
        key_activities: 'AI development, Customer support, Market research',
        key_resources: 'AI engineers, Cloud infrastructure, Patents',
        key_partners: 'Tech universities, Cloud providers',
        market_category: 'B2B SaaS',
        target_market: 'Mid-size companies in tech industry',
        target_geographic_area: 'North America, Europe',
        tam_estimate: '50B',
        sam_estimate: '5B',
        som_estimate: '500M',
        key_competitors: 'OpenAI, Google AI, Anthropic',
        competition_level: 'high',
        customer_job: 'Automate business processes with AI',
        customer_pains: 'High operational costs, Manual processes, Slow decision making',
        customer_gains: 'Cost reduction, Efficiency improvement, Better insights',
        solution_components: 'AI platform, API integrations, Dashboard',
        cost_structure: { 'R&D': 2000000, 'Operations': 500000, 'Marketing': 300000 },
        revenue_streams: { 'Subscription': 5000000, 'Enterprise deals': 2000000 },
        monthly_costs_cents: 25000000,
        monthly_revenue_cents: 70000000,
        name: 'AI Solutions Platform',
        description: 'Comprehensive AI platform for business automation',
        business_type: 'SaaS',
        industry: 'Artificial Intelligence',
        tags: 'AI, SaaS, Automation',
        is_public: true,
        validation_score: 85
      },
      {
        user_id: 502,
        session_id: 'session502',
        status: 'draft',
        current_section: 2,
        overall_progress: 0.4,
        core_function: 'To create sustainable energy solutions',
        key_activities: 'Product development, Manufacturing, Distribution',
        key_resources: 'Engineers, Manufacturing facilities, Supply chain',
        key_partners: 'Energy companies, Government agencies',
        market_category: 'B2C',
        target_market: 'Homeowners, Small businesses',
        target_geographic_area: 'Global',
        tam_estimate: '100B',
        sam_estimate: '10B',
        som_estimate: '1B',
        key_competitors: 'Tesla Energy, Sunrun, Vivint Solar',
        competition_level: 'medium',
        customer_job: 'Reduce energy costs and environmental impact',
        customer_pains: 'High energy bills, Environmental concerns',
        customer_gains: 'Cost savings, Sustainability, Energy independence',
        solution_components: 'Solar panels, Battery storage, Smart meters',
        cost_structure: { 'Manufacturing': 1500000, 'R&D': 800000 },
        revenue_streams: { 'Product sales': 3000000, 'Installation services': 1000000 },
        monthly_costs_cents: 20000000,
        monthly_revenue_cents: 40000000,
        name: 'Green Energy Solutions',
        description: 'Sustainable energy products for homes and businesses',
        business_type: 'Hardware',
        industry: 'Clean Energy',
        tags: 'Solar, Sustainability, Energy',
        is_public: false,
        validation_score: 60
      }
    ];

    for (const model of businessModels) {
      await DatabaseService.create('Business Model', model);
    }
    console.log('✅ Populated Business Model table with 2 records');

    // Business Plan - Add detailed plans
    const businessPlans = [
      {
        user_id: 501,
        status: 'completed',
        version: '2.0',
        company_name: 'AI Solutions Inc.',
        company_description: 'Leading provider of AI-powered business solutions',
        founded_date: '2022-01-15',
        location: 'San Francisco, CA',
        legal_structure: 'C-Corporation',
        current_stage: 'Series A',
        mission_statement: 'To democratize AI for businesses of all sizes',
        vision_statement: 'AI in every business process by 2030',
        executive_summary: 'AI Solutions Inc. provides cutting-edge AI tools...',
        projected_revenue_year3: 50000000,
        market_share_target: 0.05,
        funding_required: 10000000,
        industry_overview: 'The AI market is growing rapidly...',
        market_size_current: 50000000000,
        market_size_projected: 200000000000,
        market_cagr: 0.25,
        tam_estimate: 50000000000,
        sam_estimate: 5000000000,
        som_estimate: 500000000,
        market_trends: { trend1: 'Increasing AI adoption', trend2: 'Cloud migration' },
        competitor_analysis: { direct: ['OpenAI', 'Google'], indirect: ['Microsoft'] },
        competitive_landscape: 'Highly competitive with major tech players',
        core_product_offering: 'AI Platform Suite',
        unique_value_proposition: 'Easy-to-use AI tools for non-technical users',
        product_roadmap: { q1_2024: 'Mobile app launch', q2_2024: 'API expansion' },
        marketing_strategy: { channels: ['Content marketing', 'Partnerships'] },
        sales_strategy: { model: 'Direct sales + Channel partners' },
        customer_acquisition_channels: ['Website', 'LinkedIn', 'Industry events'],
        technology_infrastructure: 'AWS cloud infrastructure',
        supply_chain_logistics: 'N/A - Software only',
        operational_metrics: { metric1: 'Monthly active users', metric2: 'API calls' },
        management_team: { ceo: 'John Smith', cto: 'Jane Doe' },
        advisory_board: { advisor1: 'Former Google exec' },
        revenue_projections: { year1: 10000000, year2: 25000000, year3: 50000000 },
        expense_breakdown: { salaries: 8000000, marketing: 2000000 },
        key_financial_metrics: { arr: 12000000, cac: 500, ltv: 5000 },
        customer_acquisition_cost: 500,
        lifetime_value: 5000,
        payback_period_months: 18,
        ebitda_year3: 15000000,
        use_of_funds: { product: 4000000, marketing: 3000000, hiring: 3000000 },
        funding_strategy: { round: 'Series A', amount: 10000000 },
        investment_highlights: 'Strong traction, Experienced team',
        total_funding_sought: 10000000,
        industry: 'Artificial Intelligence',
        tags: 'AI, SaaS, Enterprise',
        is_public: true,
        is_featured: true
      }
    ];

    for (const plan of businessPlans) {
      await DatabaseService.create('Business Plan', plan);
    }
    console.log('✅ Populated Business Plan table with 1 record');

    // Financial Model - Add financial projections
    const financialModels = [
      {
        user_id: 501,
        model_name: 'AI Solutions Financial Model',
        model_description: '5-year financial projections for AI startup',
        model_status: 'completed',
        progress_percentage: 100,
        current_section: 6,
        monthly_revenue: 500000,
        growth_period: '5 years',
        revenue_stage: 'growth',
        revenue_assumptions_completed: true,
        revenue_streams: { subscription: 400000, enterprise: 100000 },
        monthly_cogs: 100000,
        cogs_breakdown: { hosting: 30000, support: 40000, development: 30000 },
        opex_data: { salaries: 200000, marketing: 50000, admin: 25000 },
        total_monthly_opex: 275000,
        total_capex: 500000,
        capex_description: 'Office setup, Equipment',
        amortization_years: 5,
        statement_format: 'standard',
        output_format: 'excel',
        investor_capital: 10000000,
        income_statement: { revenue: 6000000, expenses: 4000000, profit: 2000000 },
        cash_flow_statement: { operating: 1500000, investing: -500000, financing: 10000000 },
        balance_sheet: { assets: 12000000, liabilities: 2000000, equity: 10000000 },
        model_completed: true
      }
    ];

    for (const model of financialModels) {
      await DatabaseService.create('Financial Model', model);
    }
    console.log('✅ Populated Financial Model table with 1 record');

    // Legal - Add legal information
    const legals = [
      {
        company_name: 'AI Solutions Inc.',
        company_type: 'C-Corporation',
        commercial_registration: 'C123456789',
        incorporation_date: '2022-01-15',
        registered_address: '123 Tech Street, San Francisco, CA 94105',
        tax_id: '12-3456789',
        shareholders: [
          { name: 'John Smith', share: 40 },
          { name: 'Jane Doe', share: 30 },
          { name: 'Investor A', share: 20 },
          { name: 'Investor B', share: 10 }
        ],
        directors: [
          { name: 'John Smith', position: 'CEO' },
          { name: 'Jane Doe', position: 'CTO' }
        ],
        compliance_status: 'fully_compliant',
        regulatory_approvals: ['ISO 27001', 'SOC 2 Type II']
      }
    ];

    for (const legal of legals) {
      await DatabaseService.create('Legal', legal);
    }
    console.log('✅ Populated Legal table with 1 record');

    // Marketing - Add marketing strategy
    const marketings = [
      {
        target_audience: { age: '25-45', role: 'Decision makers', industry: 'Technology' },
        unique_value_proposition: 'AI made simple for businesses',
        marketing_objectives: ['Brand awareness', 'Lead generation', 'Customer acquisition'],
        marketing_channels: ['Content Marketing', 'Social Media', 'Email', 'Events'],
        marketing_budget: 500000,
        content_strategy: { blog: true, whitepapers: true, webinars: true },
        brand_guidelines: { primary_color: '#0066CC', fonts: 'Inter, Arial' },
        competitor_analysis: { strengths: 'Strong brand', weaknesses: 'Complex products' },
        market_research: { surveys: true, interviews: true, data_analysis: true }
      }
    ];

    for (const marketing of marketings) {
      await DatabaseService.create('Marketing', marketing);
    }
    console.log('✅ Populated Marketing table with 1 record');

    // PitchDeck - Add pitch deck content
    const pitchDecks = [
      {
        title_slide: { title: 'AI Solutions', subtitle: 'Revolutionizing Business AI' },
        problem_statement: 'Businesses struggle with complex AI implementation and high costs',
        solution_overview: 'Simple, affordable AI platform that anyone can use',
        market_opportunity: { tam: 50000000000, sam: 5000000000, som: 500000000 },
        product_demo: 'https://demo.aisolutions.com',
        business_model: { revenue: 'SaaS subscription + Enterprise deals' },
        traction_metrics: { users: 5000, revenue: 500000, growth: '300% YoY' },
        competitive_advantage: 'User-friendly interface, Lower cost, Faster implementation',
        team_overview: { founders: 2, employees: 15, advisors: 3 },
        financial_projections: { year1: 2000000, year2: 10000000, year3: 50000000 },
        funding_ask: { amount: 5000000, use: 'Product development, Market expansion' },
        contact_info: { email: 'investors@aisolutions.com', website: 'https://aisolutions.com' }
      }
    ];

    for (const deck of pitchDecks) {
      await DatabaseService.create('PitchDeck', deck);
    }
    console.log('✅ Populated PitchDeck table with 1 record');

    // Team - Add team information
    const teams = [
      {
        founders_count: 2,
        employees_count: 15,
        team_structure: 'Flat with specialized roles',
        readiness_score: 9,
        work_mode: 'Hybrid',
        roles: {
          ceo: 'John Smith - 5 years experience',
          cto: 'Jane Doe - 8 years experience',
          'head-of-product': 'Mike Johnson - 6 years experience'
        },
        skills_matrix: { technical: 9, business: 8, design: 7 },
        hiring_plan: { next_6_months: 5, next_year: 10 },
        compensation_structure: { base: 120000, equity: '0.5-1%', bonuses: '20%' },
        performance_metrics: { okr_completion: 85, employee_satisfaction: 4.2 },
        development_plan: { training_budget: 50000, conferences: 2, certifications: 5 }
      }
    ];

    for (const team of teams) {
      await DatabaseService.create('Team', team);
    }
    console.log('✅ Populated Team table with 1 record');

    // Valuation - Add valuation data
    const valuations = [
      {
        valuation_date: '2024-01-15',
        valuation_method: 'dcf',
        enterprise_value: { value: 50000000, method: 'DCF' },
        equity_value: { value: 45000000, method: 'DCF' },
        per_share_value: 10.5,
        key_assumptions: ['Revenue growth 50% YoY', 'Gross margin 70%', 'Discount rate 12%'],
        comparable_companies: [
          { name: 'SimilarCo', valuation: 100000000, revenue: 20000000 },
          { name: 'CompetitorX', valuation: 75000000, revenue: 15000000 }
        ],
        precedent_transactions: [
          { deal: 'AI Startup Acquisition', value: 30000000, date: '2023-06' }
        ],
        dcf_projections: { year1: 10000000, year2: 20000000, year3: 35000000 },
        sensitivity_analysis: { base_case: 50000000, optimistic: 75000000, pessimistic: 30000000 },
        risk_factors: ['Market competition', 'Technology changes', 'Regulatory changes']
      }
    ];

    for (const valuation of valuations) {
      await DatabaseService.create('Valuation', valuation);
    }
    console.log('✅ Populated Valuation table with 1 record');

    // Idea - Add business ideas
    const businessIdeas = [
      {
        title: 'AI-Powered Customer Service Platform',
        description: 'Revolutionary AI chatbot that handles customer inquiries 24/7',
        category: 'SaaS',
        tags: ['AI', 'Customer Service', 'Automation'],
        problem_statement: 'Companies spend millions on customer support while customers wait hours for responses',
        solution_overview: 'AI-powered platform that provides instant, accurate responses to customer inquiries',
        target_market: { size: 100000, demographics: 'B2B companies with 50+ employees' },
        competitive_advantage: 'Natural language processing, Multi-language support, Integration with existing CRM',
        business_model: 'SaaS subscription',
        traction: { users: 500, revenue: 50000, growth: '200% MoM' },
        funding_status: 'seed',
        ip_status: 'patent_pending'
      },
      {
        title: 'Sustainable Packaging Solution',
        description: 'Biodegradable packaging made from agricultural waste',
        category: 'E-commerce',
        tags: ['Sustainability', 'Packaging', 'Green Tech'],
        problem_statement: 'Plastic pollution is destroying our planet, traditional packaging is expensive',
        solution_overview: 'Affordable, biodegradable packaging that reduces environmental impact',
        target_market: { size: 50000, demographics: 'E-commerce businesses, Food industry' },
        competitive_advantage: 'Lower cost than competitors, Fully biodegradable, Customizable',
        business_model: 'B2B sales',
        traction: { pilots: 20, revenue: 25000, partnerships: 5 },
        funding_status: 'pre_seed',
        ip_status: 'trademark_filed'
      }
    ];

    for (const idea of businessIdeas) {
      await DatabaseService.create('Idea', idea);
    }
    console.log('✅ Populated Idea table with 2 records');

    // Landing Page Management - This table only has id and created_at, skipping data population
    console.log('ℹ️  Landing Page Management table only has basic columns, skipping data population');

    // Corporate - This table only has id and created_at, skipping data population
    console.log('ℹ️  Corporate table only has basic columns, skipping data population');

    // Enterprises - Schema cache issues, skipping
    console.log('ℹ️  Enterprises table schema cache issues, skipping data population');

    // Votes Management - Only has basic columns, skipping
    console.log('ℹ️  Votes Management table only has basic columns, skipping data population');

    console.log('🎉 All missing table data populated successfully!');
  } catch (error) {
    console.error('❌ Error during population:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateMissingTables().catch(console.error);
}

export default populateMissingTables;