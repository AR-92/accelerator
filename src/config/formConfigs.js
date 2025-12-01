export default {
  problemDefinition: {
    fields: [
      {
        type: 'textarea',
        label: 'Problem Description',
        name: 'problem_description',
        rows: 4,
        placeholder: 'Describe the specific problem...',
        resize: true,
      },
      {
        type: 'select',
        label: 'Scale',
        name: 'problem_scale',
        buttons: [{ text: 'Small' }, { text: 'Medium' }, { text: 'Large' }],
        options: [
          { value: '', text: 'Select scale' },
          { value: 'small', text: 'Small' },
          { value: 'medium', text: 'Medium' },
          { value: 'large', text: 'Large' },
        ],
      },
      {
        type: 'select',
        label: 'Urgency',
        name: 'problem_urgency',
        buttons: [{ text: 'Low' }, { text: 'Medium' }, { text: 'High' }],
        options: [
          { value: '', text: 'Select urgency' },
          { value: 'low', text: 'Low' },
          { value: 'medium', text: 'Medium' },
          { value: 'high', text: 'High' },
        ],
      },
      {
        type: 'dynamic-list',
        label: 'Concrete Examples',
        containerId: 'examples-container',
        itemName: 'example',
        placeholder: 'Add an example...',
        initialItems: [{}],
      },
    ],
    submitText: 'Submit Problem Definition',
  },
  targetAudience: {
    fields: [
      {
        type: 'grid',
        subfields: [
          {
            label: 'Age Range',
            inputType: 'text',
            name: 'age_range',
            placeholder: 'e.g., 25-45',
          },
          {
            label: 'Location',
            inputType: 'text',
            name: 'location',
            placeholder: 'e.g., Urban areas',
          },
        ],
      },
      {
        type: 'checkbox-group',
        label: 'Characteristics',
        name: 'characteristics[]',
        options: [
          { value: 'tech-savvy', text: 'Tech-savvy' },
          { value: 'busy', text: 'Busy' },
          { value: 'professional', text: 'Professional' },
          { value: 'other', text: 'Other' },
        ],
      },
      {
        type: 'textarea',
        label: 'Pain Points',
        name: 'pain_points',
        rows: 3,
        placeholder: 'Describe main pain points...',
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Impact on Productivity/Finances',
        name: 'impact',
        rows: 3,
        placeholder: 'How does this affect them...',
        resize: true,
      },
    ],
    submitText: 'Submit Target Audience',
  },
  keyAssumptions: {
    fields: [
      {
        type: 'dynamic-list',
        label: 'Key Assumptions',
        containerId: 'assumptions-container',
        itemName: 'Assumption',
        subfields: [
          {
            type: 'grid',
            gridCols: 2,
            subfields: [
              {
                label: 'Assumption',
                inputType: 'text',
                name: 'assumption[]',
                placeholder: 'State the assumption...',
              },
              {
                type: 'select',
                label: 'Risk Level',
                name: 'risk[]',
                buttons: [
                  { text: 'Low' },
                  { text: 'Medium' },
                  { text: 'High' },
                ],
                options: [
                  { value: 'low', text: 'Low' },
                  { value: 'medium', text: 'Medium' },
                  { value: 'high', text: 'High' },
                ],
              },
            ],
          },
          {
            type: 'textarea',
            label: 'Explanation & Evidence',
            name: 'explanation[]',
            rows: 3,
            placeholder: 'Why do you believe this? What evidence?',
            resize: true,
          },
        ],
        initialItems: [{}],
      },
    ],
    submitText: 'Submit Key Assumptions',
  },
  competitiveAnalysis: {
    fields: [
      {
        type: 'dynamic-list',
        label: 'Competitors',
        containerId: 'competitors-container',
        itemName: 'Competitor',
        subfields: [
          {
            type: 'grid',
            gridCols: 2,
            subfields: [
              {
                label: 'Competitor Name',
                inputType: 'text',
                name: 'competitor_name[]',
                placeholder: 'e.g., Asana',
              },
              {
                type: 'select',
                label: 'Type',
                name: 'type[]',
                options: [
                  { value: 'direct', text: 'Direct' },
                  { value: 'indirect', text: 'Indirect' },
                ],
              },
            ],
          },
          {
            type: 'grid',
            gridCols: 3,
            subfields: [
              {
                label: 'Market Position',
                inputType: 'text',
                name: 'market_position[]',
                placeholder: 'Leader, Challenger...',
              },
              {
                label: 'Pricing Strategy',
                inputType: 'text',
                name: 'pricing[]',
                placeholder: 'Freemium, Subscription...',
              },
              {
                label: 'Market Share',
                inputType: 'text',
                name: 'market_share[]',
                placeholder: 'e.g., 15%',
              },
            ],
          },
          {
            type: 'textarea',
            label: 'Key Features, Strengths, Weaknesses',
            name: 'analysis[]',
            rows: 4,
            placeholder: 'Analyze features, strengths, weaknesses...',
          },
        ],
        initialItems: [{}],
      },
    ],
    submitText: 'Submit Competitive Analysis',
  },
  solutionTitle: {
    fields: [
      {
        type: 'text',
        label: 'Proposed Solution Title',
        name: 'solution_title',
        maxlength: 50,
        placeholder: 'Enter a compelling title...',
        helper: 'Max 50 characters',
      },
    ],
    submitText: 'Submit Solution Title',
  },
  solutionDescription: {
    fields: [
      {
        type: 'textarea',
        label: 'Comprehensive Solution Description',
        name: 'solution_description',
        rows: 6,
        placeholder: 'Describe how it works, key features, user workflows...',
        resize: true,
      },
      {
        type: 'grid',
        subfields: [
          {
            label: 'Key Features',
            inputType: 'textarea',
            name: 'key_features',
            rows: 4,
            placeholder: 'List main features...',
            resize: true,
          },
          {
            label: 'Technical Details (if applicable)',
            inputType: 'textarea',
            name: 'technical_details',
            rows: 4,
            placeholder: 'API, integrations, etc.',
            resize: true,
          },
        ],
      },
      {
        type: 'textarea',
        label: 'How it Differs from Alternatives',
        name: 'differentiation',
        rows: 3,
        placeholder: 'Unique aspects...',
        resize: true,
      },
    ],
    submitText: 'Submit Solution Description',
  },
  targetCustomers: {
    fields: [
      {
        type: 'text',
        label: 'Customer Persona Name',
        name: 'persona_name',
        placeholder: 'e.g., Busy Professional',
      },
      {
        type: 'grid',
        subfields: [
          {
            label: 'Demographics',
            inputType: 'textarea',
            name: 'demographics',
            rows: 3,
            placeholder: 'Age, gender, income...',
            resize: true,
          },
          {
            label: 'Psychographics',
            inputType: 'textarea',
            name: 'psychographics',
            rows: 3,
            placeholder: 'Values, interests...',
            resize: true,
          },
        ],
      },
      {
        type: 'textarea',
        label: 'Behaviors & Needs',
        name: 'behaviors_needs',
        rows: 3,
        placeholder: 'How they use products, motivations...',
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Pain Points & Frustrations',
        name: 'pain_points',
        rows: 3,
        placeholder: 'Specific challenges...',
        resize: true,
      },
    ],
    submitText: 'Submit Target Customers',
  },
  keyMetrics: {
    fields: [
      {
        type: 'dynamic-list',
        label: 'Key Metrics',
        containerId: 'metrics-container',
        itemName: 'Metric',
        subfields: [
          {
            type: 'grid',
            gridCols: 3,
            subfields: [
              {
                label: 'Metric Name',
                inputType: 'text',
                name: 'metric_name[]',
                placeholder: 'e.g., Monthly Active Users',
              },
              {
                type: 'select',
                label: 'Category',
                name: 'category[]',
                options: [
                  { value: 'acquisition', text: 'Acquisition' },
                  { value: 'retention', text: 'Retention' },
                  { value: 'revenue', text: 'Revenue' },
                  { value: 'engagement', text: 'Engagement' },
                  { value: 'performance', text: 'Performance' },
                ],
              },
              {
                label: 'Benchmark',
                inputType: 'text',
                name: 'benchmark[]',
                placeholder: 'e.g., 10,000 users',
              },
            ],
          },
          {
            type: 'textarea',
            label: 'Tracking Method',
            name: 'tracking[]',
            rows: 2,
            placeholder: 'How will you measure this?',
          },
        ],
        initialItems: [{}],
      },
    ],
    submitText: 'Submit Key Metrics',
  },
  earlyAdopters: {
    fields: [
      {
        type: 'textarea',
        label: 'Early Adopter Profile',
        name: 'early_adopter_profile',
        rows: 4,
        placeholder: 'Who will be your first customers?',
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Adopter Characteristics',
        name: 'adopter_characteristics',
        rows: 3,
        placeholder: 'What makes them willing to try new solutions?',
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Finding Early Adopters',
        name: 'finding_adopters',
        rows: 3,
        placeholder: 'Where can you find these customers?',
        resize: true,
      },
    ],
    submitText: 'Submit Early Adopters',
  },
  customerRelationships: {
    fields: [
      {
        type: 'textarea',
        label: 'Customer Acquisition Strategy',
        name: 'acquisition_strategy',
        rows: 3,
        placeholder: 'How will you attract new customers?',
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Onboarding Process',
        name: 'onboarding_process',
        rows: 3,
        placeholder: 'How will you help customers get started?',
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Support & Service',
        name: 'support_mechanisms',
        rows: 3,
        placeholder: 'How will you support your customers?',
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Retention Strategy',
        name: 'retention_strategy',
        rows: 3,
        placeholder: 'How will you keep customers long-term?',
        resize: true,
      },
    ],
    submitText: 'Submit Customer Relationships',
  },
  brandIdentity: {
    fields: [
      {
        type: 'textarea',
        label: 'Mission, Vision, Core Values',
        name: 'mission_vision',
        rows: 4,
        placeholder: "Describe your brand's purpose...",
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Personality & Positioning',
        name: 'personality',
        rows: 3,
        placeholder: 'How you want to be perceived...',
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Brand Voice & Visual Elements',
        name: 'voice_visual',
        rows: 3,
        placeholder: 'Tone, colors, etc...',
        resize: true,
      },
    ],
    submitText: 'Submit Brand Identity',
  },
  brandStatement: {
    fields: [
      {
        type: 'textarea',
        label: 'Brand Statement',
        name: 'brand_statement',
        rows: 4,
        placeholder: 'Craft your compelling brand statement...',
        resize: true,
      },
    ],
    submitText: 'Submit Brand Statement',
  },
  customerName: {
    fields: [
      {
        type: 'text',
        label: 'Customer Name',
        name: 'customer_name',
        maxlength: 50,
        placeholder: 'What should customers call you?',
      },
    ],
    submitText: 'Submit Customer Name',
  },
  brandSlogan: {
    fields: [
      {
        type: 'textarea',
        label: 'Brand Slogan/Tagline',
        name: 'brand_slogan',
        rows: 3,
        placeholder: 'Create a memorable slogan...',
        resize: true,
      },
    ],
    submitText: 'Submit Brand Slogan',
  },
  ipProtectionDetails: {
    fields: [
      {
        type: 'textarea',
        label: 'IP Protection Details',
        name: 'ip_protection_details',
        rows: 6,
        placeholder:
          'Describe your intellectual property protection measures...',
        resize: true,
      },
    ],
    submitText: 'Submit IP Protection Details',
  },
  domainRegistration: {
    fields: [
      {
        type: 'text',
        label: 'Primary Domain',
        name: 'primary_domain',
        placeholder: 'yourcompany.com',
      },
      {
        type: 'textarea',
        label: 'Alternative Domains',
        name: 'alternative_domains',
        rows: 3,
        placeholder: "List backup domains you've registered...",
        resize: true,
      },
      {
        type: 'textarea',
        label: 'Domain Strategy',
        name: 'domain_strategy',
        rows: 3,
        placeholder: 'How does your domain support branding?',
        resize: true,
      },
    ],
    submitText: 'Submit Domain Registration',
  },
  ipProtectionElements: {
    fields: [
      {
        type: 'textarea',
        label: 'IP Protection Elements',
        name: 'ip_elements',
        rows: 6,
        placeholder: 'Detail your intellectual property elements...',
        resize: true,
      },
    ],
    submitText: 'Submit IP Protection Elements',
  },
  highLevelConcept: {
    fields: [
      {
        type: 'textarea',
        label: 'High-Level Solution Concept',
        name: 'high_level_concept',
        rows: 4,
        placeholder: 'Describe your solution at a high level...',
        resize: true,
      },
    ],
    submitText: 'Submit High-Level Concept',
  },
  unfairAdvantage: {
    fields: [
      {
        type: 'textarea',
        label: 'Unfair Advantage',
        name: 'unfair_advantage',
        rows: 4,
        placeholder: 'What gives you an unbeatable edge?',
        resize: true,
      },
    ],
    submitText: 'Submit Unfair Advantage',
  },
  uniqueValueProposition: {
    fields: [
      {
        type: 'textarea',
        label: 'Unique Value Proposition',
        name: 'value_proposition',
        rows: 4,
        placeholder: 'What makes your solution uniquely valuable?',
        resize: true,
      },
    ],
    submitText: 'Submit Unique Value Proposition',
  },
  distributionChannels: {
    fields: [
      {
        type: 'textarea',
        label: 'Distribution Channels',
        name: 'distribution_channels',
        rows: 4,
        placeholder: 'How will customers discover and purchase your solution?',
        resize: true,
      },
    ],
    submitText: 'Submit Distribution Channels',
  },
  existingAlternatives: {
    fields: [
      {
        type: 'dynamic-list',
        label: 'Existing Alternatives',
        containerId: 'alternatives-container',
        itemName: 'Alternative',
        initialItems: [{}],
        subfields: [
          {
            type: 'text',
            label: 'Alternative Name',
            name: 'alternative_name[]',
            placeholder: 'e.g., Asana',
          },
          {
            type: 'select',
            label: 'Type',
            name: 'type[]',
            buttons: [
              { text: 'Direct Competitor' },
              { text: 'Indirect Alternative' },
            ],
            options: [
              { value: '', text: 'Select type' },
              { value: 'direct', text: 'Direct Competitor' },
              { value: 'indirect', text: 'Indirect Alternative' },
            ],
          },
          {
            type: 'text',
            label: 'Strengths',
            name: 'strengths[]',
            placeholder: 'Comma-separated',
          },
          {
            type: 'text',
            label: 'Weaknesses',
            name: 'weaknesses[]',
            placeholder: 'Comma-separated',
          },
          {
            type: 'text',
            label: 'Pricing',
            name: 'pricing[]',
            placeholder: 'e.g., $10/month',
          },
          {
            type: 'textarea',
            label: 'User Adoption & Why Not Solved',
            name: 'adoption[]',
            rows: 3,
            placeholder: 'Describe adoption and limitations...',
            resize: true,
          },
        ],
      },
    ],
    submitText: 'Submit Existing Alternatives',
  },
  brandApplication: {
    fields: [
      {
        type: 'upload',
        description: 'Upload a brand application guide below.',
        uploadTitle: 'Upload Application Guide',
        supportedFormats: 'PDF, DOC, DOCX formats supported',
        accept: '.pdf,.doc,.docx',
        multiple: false,
        sectionTitle: 'Brand Application Guide',
        sectionDescription:
          "Include do's and don'ts, approved usage examples, prohibited modifications, and guidelines for maintaining brand consistency across all mediums.",
        supportedLabel: 'Supported: PDF, DOC, DOCX',
        maxSizeLabel: 'Max size: 20MB',
        chooseText: 'File',
        typingText: 'User is typing...',
      },
    ],
    noSubmit: true,
  },
  brandGuidelines: {
    fields: [
      {
        type: 'upload',
        description:
          'Upload your comprehensive brand guidelines document below.',
        uploadTitle: 'Upload Brand Guidelines',
        supportedFormats: 'PDF, DOC, DOCX formats supported',
        accept: '.pdf,.doc,.docx',
        multiple: false,
        sectionTitle: 'Brand Guidelines',
        sectionDescription: '',
        supportedLabel: 'Supported: PDF, DOC, DOCX',
        maxSizeLabel: 'Max size: 20MB',
        chooseText: 'File',
        typingText: 'User is typing...',
      },
    ],
    noSubmit: true,
  },
  brandVoice: {
    fields: [
      {
        type: 'upload',
        description:
          'Upload a document describing your brand voice and tone guidelines below.',
        uploadTitle: 'Upload Brand Voice Document',
        supportedFormats: 'PDF, DOC, DOCX formats supported',
        accept: '.pdf,.doc,.docx',
        multiple: false,
        sectionTitle: 'Brand Voice',
        sectionDescription: '',
        supportedLabel: 'Supported: PDF, DOC, DOCX',
        maxSizeLabel: 'Max size: 20MB',
        chooseText: 'File',
        typingText: 'User is typing...',
      },
    ],
    noSubmit: true,
  },
  ipDocumentation: {
    fields: [
      {
        type: 'upload',
        description:
          'Please upload relevant documents to support your IP protection claims below.',
        uploadTitle: 'Upload IP Documents',
        supportedFormats: 'PDF, DOC, DOCX formats supported',
        accept: '.pdf,.doc,.docx',
        multiple: true,
        sectionTitle: 'IP Protection Documents',
        sectionDescription:
          'Include patent applications, trademark registrations, copyright certificates, non-disclosure agreements, licensing agreements, or other legal documents.',
        supportedLabel: 'Supported: PDF, DOC, DOCX',
        maxSizeLabel: 'Max size: 50MB',
        chooseText: 'Files',
        typingText: 'User is typing...',
      },
    ],
    noSubmit: true,
  },
  logoDesign: {
    fields: [
      {
        type: 'text',
        label: 'Test',
        name: 'test',
        placeholder: 'test',
      },
      {
        type: 'upload',
        description: 'Please upload your logo design files below.',
        uploadTitle: 'Upload Logo Files',
        supportedFormats: 'Image formats supported',
        accept: '.png,.jpg,.jpeg,.svg',
        multiple: true,
        sectionTitle: 'Logo Design',
        sectionDescription: '',
        supportedLabel: 'Supported: PNG, JPG, JPEG, SVG',
        maxSizeLabel: 'Max size: 10MB',
        chooseText: 'Files',
        typingText: 'User is typing...',
      },
    ],
    noSubmit: true,
  },
  visualLanguage: {
    fields: [
      {
        type: 'upload',
        description:
          'Upload your visual language or style guide document below.',
        uploadTitle: 'Upload Visual Language Document',
        supportedFormats: 'PDF, DOC, DOCX formats supported',
        accept: '.pdf,.doc,.docx',
        multiple: false,
        sectionTitle: 'Visual Language',
        sectionDescription: '',
        supportedLabel: 'Supported: PDF, DOC, DOCX',
        maxSizeLabel: 'Max size: 20MB',
        chooseText: 'File',
        typingText: 'User is typing...',
      },
    ],
    noSubmit: true,
  },
};
