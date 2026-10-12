import { JobPosting, JobApplication, NotificationItem, JavaApiLog, UserAccount } from '../types';

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: 'job-101',
    title: 'Senior Java & Spring Boot Engineer',
    company: 'Apex Financial Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    department: 'Core Banking Engineering',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryMin: 145000,
    salaryMax: 185000,
    currency: 'USD',
    description: 'We are seeking an experienced Java backend engineer to lead our microservices transaction platform. You will build high-throughput, low-latency REST and gRPC services using Spring Boot 3, Kafka, and PostgreSQL, ensuring high compliance and zero-downtime reliability.',
    responsibilities: [
      'Architect and scale Spring Boot 3 enterprise microservices',
      'Optimize database queries and transactional consistency across distributed clusters',
      'Collaborate with frontend architects and QA teams for end-to-end integration',
      'Mentor mid-level engineers and conduct code reviews according to clean architecture'
    ],
    requirements: [
      '5+ years of production experience with Java (Java 17 or 21) & Spring Framework',
      'Deep understanding of JPA/Hibernate, connection pooling, and multi-threaded concurrency',
      'Experience with Kafka, Docker, and Kubernetes deployment pipelines',
      'Strong grasp of RESTful API design standards and security protocols (OAuth2/JWT)'
    ],
    skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kafka', 'Microservices'],
    postedByEmail: 'recruiting@apexfintech.com',
    postedAt: '2026-10-09T09:30:00Z',
    deadline: '2026-11-15',
    status: 'APPROVED',
    applicantsCount: 3
  },
  {
    id: 'job-102',
    title: 'Staff Distributed Systems Architect',
    company: 'CloudScale Infrastructure',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    department: 'Cloud Platform',
    location: 'Remote (US/Canada)',
    type: 'Remote',
    experienceLevel: 'Lead',
    salaryMin: 190000,
    salaryMax: 240000,
    currency: 'USD',
    description: 'Lead the architectural evolution of our multi-region distributed storage engine. You will be responsible for defining technical roadmaps, fault-tolerant replication models, and enterprise Java virtual machine tuning.',
    responsibilities: [
      'Design fault-tolerant data ingestion pipelines handling over 100k events/sec',
      'Set engineering standards for asynchronous reactive streaming in Java & Go',
      'Partner with Product Management to deliver resilient enterprise SLAs'
    ],
    requirements: [
      '8+ years in systems architecture with extensive hands-on Java / JVM internals',
      'Deep familiarity with Raft consensus algorithms and distributed consensus systems',
      'Proven track record in SOC2-compliant enterprise SaaS infrastructure'
    ],
    skills: ['Java', 'Distributed Systems', 'Kubernetes', 'gRPC', 'Cassandra', 'System Design'],
    postedByEmail: 'careers@cloudscale.io',
    postedAt: '2026-10-11T14:15:00Z',
    deadline: '2026-11-30',
    status: 'PENDING_APPROVAL',
    applicantsCount: 0
  },
  {
    id: 'job-103',
    title: 'Lead Full Stack Engineer (React & Java)',
    company: 'Nova Commerce Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=80',
    department: 'Merchant Experience',
    location: 'Austin, TX (On-site)',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryMin: 135000,
    salaryMax: 170000,
    currency: 'USD',
    description: 'Nova Commerce powers omni-channel checkout for 1,200+ global brands. We need a Full Stack leader who bridges rich React single-page frontends with dependable Spring Boot Java microservices.',
    responsibilities: [
      'Develop frictionless checkout flows in React 19 and Tailwind CSS',
      'Build robust payment orchestration endpoints backed by Spring Security and Redis',
      'Drive performance audits to keep Time to Interactive under 1.2s globally'
    ],
    requirements: [
      '4+ years of React/TypeScript plus 3+ years of Java/Spring Boot development',
      'Demonstrated expertise in building resilient RESTful integration APIs',
      'Experience with Redis caching, ElasticSearch, and CI/CD pipelines'
    ],
    skills: ['React', 'TypeScript', 'Java', 'Spring Boot', 'Redis', 'Tailwind CSS'],
    postedByEmail: 'recruiting@apexfintech.com',
    postedAt: '2026-10-08T11:00:00Z',
    deadline: '2026-11-20',
    status: 'APPROVED',
    applicantsCount: 2
  },
  {
    id: 'job-104',
    title: 'Junior Automation & QA Engineer',
    company: 'Quantum Health Analytics',
    companyLogo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&auto=format&fit=crop&q=80',
    department: 'Quality Assurance',
    location: 'Chicago, IL (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Entry-level',
    salaryMin: 78000,
    salaryMax: 95000,
    currency: 'USD',
    description: 'Join our mission-critical clinical data platform team. You will write automated end-to-end integration tests using Java, Selenium, and RestAssured, validating healthcare data pipelines.',
    responsibilities: [
      'Implement API automated test suites using Java, JUnit 5, and RestAssured',
      'Participate in daily standups and execute regression suites for weekly releases',
      'Document defect reports and track resolution in Jira'
    ],
    requirements: [
      'Degree in Computer Science or equivalent hands-on coding coursework',
      'Working knowledge of Java core fundamentals (collections, OOP, exceptions)',
      'Familiarity with Git, Postman, and CI/CD test automation concepts'
    ],
    skills: ['Java', 'Selenium', 'JUnit 5', 'REST APIs', 'Git', 'Test Automation'],
    postedByEmail: 'hr@quantumhealth.org',
    postedAt: '2026-10-12T10:00:00Z',
    deadline: '2026-11-10',
    status: 'PENDING_APPROVAL',
    applicantsCount: 0
  },
  {
    id: 'job-105',
    title: 'Product Designer (Design Systems)',
    company: 'Loomis Digital Studio',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    department: 'Design',
    location: 'San Francisco, CA (Remote)',
    type: 'Remote',
    experienceLevel: 'Mid-level',
    salaryMin: 115000,
    salaryMax: 145000,
    currency: 'USD',
    description: 'We are creating the next standard of accessible design tokens and component libraries. You will partner with engineers and product strategists to create thoughtful, highly usable tools.',
    responsibilities: [
      'Maintain and expand our cross-platform design token architecture',
      'Conduct user testing sessions with enterprise B2B customers',
      'Create high-fidelity interactive prototypes in Figma'
    ],
    requirements: [
      '3+ years of digital product design with proven enterprise component work',
      'Fluency in WCAG 2.1 AA accessibility guidelines and token methodologies',
      'Strong portfolio showcasing design systems from concept to delivery'
    ],
    skills: ['Figma', 'Design Systems', 'WCAG Accessibility', 'UX Research', 'Prototyping'],
    postedByEmail: 'talent@loomisstudio.design',
    postedAt: '2026-10-06T15:40:00Z',
    deadline: '2026-11-05',
    status: 'APPROVED',
    applicantsCount: 1
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-501',
    jobId: 'job-101',
    jobTitle: 'Senior Java & Spring Boot Engineer',
    company: 'Apex Financial Technologies',
    candidateId: 'cand-alex',
    candidateName: 'Alex Mercer',
    candidateEmail: 'alex.mercer.dev@gmail.com',
    candidatePhone: '+1 (555) 349-2810',
    candidateAvatar: '/src/assets/images/avatar_candidate_seeker_1791836579280.jpg',
    candidateHeadline: 'Senior Backend Engineer · 6 Yrs Java / Spring / Cloud',
    yearsExperience: 6,
    skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kafka', 'Redis'],
    resumeFileName: 'Alex_Mercer_Senior_Java_Engineer.pdf',
    resumeSummary: 'Experienced backend specialist with 6+ years designing scalable Java microservices for financial trading platforms. Built transaction logging subsystems processing 45k ops/sec. Proven expertise in Spring Boot, Kafka, and PostgreSQL indexing.',
    portfolioUrl: 'https://github.com/alexmercer-dev',
    coverNote: 'I have worked extensively with high-frequency financial ledgers using Spring Boot and Java 21 virtual threads. I am very enthusiastic about Apex Financial Technologies mission and would love to bring my distributed systems experience to your team.',
    appliedAt: '2026-10-10T11:20:00Z',
    status: 'SHORTLISTED',
    employerNotes: 'Strong background in high-throughput transactional systems. Resume and references look stellar. Recommended for Technical round.',
    interviewDetails: {
      date: '2026-10-18',
      time: '14:00 EST',
      type: 'Technical Screen',
      linkOrLocation: 'https://meet.google.com/hpr-apex-tech',
      notes: 'Please prepare to discuss Java memory management, JPA caching layers, and Kafka partition strategies.'
    },
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-10T11:20:00Z', note: 'Application received via WorkSpark Portal' },
      { status: 'UNDER_REVIEW', timestamp: '2026-10-11T09:15:00Z', note: 'Recruiter screened credentials and Github portfolio' },
      { status: 'SHORTLISTED', timestamp: '2026-10-12T08:45:00Z', note: 'Marked as top tier candidate by Engineering Manager' }
    ]
  },
  {
    id: 'app-502',
    jobId: 'job-101',
    jobTitle: 'Senior Java & Spring Boot Engineer',
    company: 'Apex Financial Technologies',
    candidateId: 'cand-sarah',
    candidateName: 'Sarah Lin, MSc',
    candidateEmail: 'sarah.lin.cloud@outlook.com',
    candidatePhone: '+1 (555) 782-9904',
    candidateHeadline: 'Cloud Solutions & Java Backend Developer',
    yearsExperience: 4,
    skills: ['Java', 'Spring Boot', 'AWS', 'PostgreSQL', 'Docker'],
    resumeFileName: 'Sarah_Lin_Resume_2026.pdf',
    resumeSummary: 'Full lifecycle backend engineer specializing in cloud migration of legacy Java monoliths into Spring Boot containers on AWS ECS. Certified AWS Solutions Architect.',
    coverNote: 'Excited by the challenge of zero-downtime microservices. I recently led our payment gateway modernization from Spring 4 to Spring Boot 3.',
    appliedAt: '2026-10-11T16:30:00Z',
    status: 'UNDER_REVIEW',
    employerNotes: 'Good cloud migration experience. Reviewing AWS certification and code samples.',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-11T16:30:00Z', note: 'Application received' },
      { status: 'UNDER_REVIEW', timestamp: '2026-10-12T10:00:00Z', note: 'Under preliminary hiring committee review' }
    ]
  },
  {
    id: 'app-503',
    jobId: 'job-103',
    jobTitle: 'Lead Full Stack Engineer (React & Java)',
    company: 'Nova Commerce Solutions',
    candidateId: 'cand-david',
    candidateName: 'David K. Rossi',
    candidateEmail: 'david.rossi@codeworks.dev',
    candidatePhone: '+1 (555) 412-6721',
    candidateHeadline: 'Full Stack Tech Lead · React 19 & Spring Cloud',
    yearsExperience: 7,
    skills: ['React', 'TypeScript', 'Java', 'Spring Boot', 'Tailwind CSS', 'Redis'],
    resumeFileName: 'David_Rossi_Lead_FullStack.pdf',
    resumeSummary: 'Architected eCommerce checkout interfaces serving over 3 million monthly active users. High proficiency in React state optimization and resilient Spring REST architectures.',
    coverNote: 'I have spent the last 4 years unifying frontend design systems with Java microservices. Ready to make an impact on Day 1.',
    appliedAt: '2026-10-09T18:10:00Z',
    status: 'INTERVIEW_SCHEDULED',
    employerNotes: 'Interview confirmed for technical architecture discussion.',
    interviewDetails: {
      date: '2026-10-16',
      time: '11:00 EST',
      type: 'Panel Interview',
      linkOrLocation: 'https://meet.google.com/nova-eng-david',
      notes: 'Full team panel covering both React component architecture and backend API security.'
    },
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-10-09T18:10:00Z', note: 'Application submitted' },
      { status: 'UNDER_REVIEW', timestamp: '2026-10-10T10:00:00Z', note: 'Reviewed by Tech Lead' },
      { status: 'SHORTLISTED', timestamp: '2026-10-11T14:00:00Z', note: 'Passed technical resume bar' },
      { status: 'INTERVIEW_SCHEDULED', timestamp: '2026-10-12T09:00:00Z', note: 'Interview scheduled for Oct 16' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    targetRole: 'admin',
    title: 'New Job Pending Approval',
    message: 'Staff Distributed Systems Architect posted by CloudScale Infrastructure requires compliance review.',
    timestamp: '2026-10-11T14:15:00Z',
    read: false,
    linkJobId: 'job-102'
  },
  {
    id: 'notif-2',
    targetRole: 'employer',
    title: 'New Candidate Applied',
    message: 'Alex Mercer submitted an application for Senior Java & Spring Boot Engineer.',
    timestamp: '2026-10-10T11:20:00Z',
    read: true,
    linkJobId: 'job-101'
  },
  {
    id: 'notif-3',
    targetRole: 'seeker',
    title: 'Interview Scheduled!',
    message: 'Nova Commerce Solutions scheduled a Panel Interview for Oct 16, 11:00 EST.',
    timestamp: '2026-10-12T09:00:00Z',
    read: false,
    linkJobId: 'job-103'
  }
];

export const INITIAL_JAVA_LOGS: JavaApiLog[] = [
  {
    id: 'log-1',
    timestamp: '13:20:14',
    method: 'GET',
    endpoint: '/api/v1/jobs/approved',
    springController: 'JobPostingController.getApprovedJobs()',
    statusCode: 200,
    durationMs: 14,
    responsePayload: '{"status":"SUCCESS","total":3,"data":[...]}'
  },
  {
    id: 'log-2',
    timestamp: '13:21:05',
    method: 'POST',
    endpoint: '/api/v1/jobs',
    springController: 'JobPostingController.createJobPosting(@Valid @RequestBody JobRequestDto dto)',
    statusCode: 201,
    durationMs: 38,
    requestPayload: '{"title":"Junior Automation & QA Engineer","status":"PENDING_APPROVAL"}',
    responsePayload: '{"status":"PENDING_APPROVAL","id":"job-104","message":"Dispatched to AdminModerationService"}'
  },
  {
    id: 'log-3',
    timestamp: '13:22:42',
    method: 'PATCH',
    endpoint: '/api/v1/applications/app-501/status',
    springController: 'ApplicationController.updateApplicationStatus(@PathVariable String id, @RequestBody StatusUpdateDto dto)',
    statusCode: 200,
    durationMs: 22,
    requestPayload: '{"status":"SHORTLISTED","notes":"Top tier candidate"}',
    responsePayload: '{"applicationId":"app-501","status":"SHORTLISTED","emailDispatched":true}'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-1',
    name: 'Alex Mercer',
    email: 'alex.mercer.dev@gmail.com',
    role: 'seeker',
    avatar: '/src/assets/images/avatar_candidate_seeker_1791836579280.jpg',
    companyOrHeadline: 'Senior Java & Spring Cloud Engineer',
    location: 'New York, NY',
    joinedAt: '2026-08-14',
    status: 'ACTIVE'
  },
  {
    id: 'user-2',
    name: 'Sarah Lin, MSc',
    email: 'sarah.lin.cloud@outlook.com',
    role: 'seeker',
    companyOrHeadline: 'Cloud Solutions & Java Backend Developer',
    location: 'Chicago, IL',
    joinedAt: '2026-09-02',
    status: 'ACTIVE'
  },
  {
    id: 'user-3',
    name: 'David K. Rossi',
    email: 'david.rossi@codeworks.dev',
    role: 'seeker',
    companyOrHeadline: 'Full Stack Tech Lead · React & Java',
    location: 'Austin, TX',
    joinedAt: '2026-07-28',
    status: 'ACTIVE'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    email: 'recruiting@apexfintech.com',
    role: 'employer',
    avatar: '/src/assets/images/avatar_employer_hiring_1791836567991.jpg',
    companyOrHeadline: 'Apex Financial Technologies',
    location: 'New York, NY',
    joinedAt: '2026-06-10',
    status: 'ACTIVE'
  },
  {
    id: 'user-5',
    name: 'Marcus Vance',
    email: 'careers@cloudscale.io',
    role: 'employer',
    companyOrHeadline: 'CloudScale Infrastructure',
    location: 'San Francisco, CA',
    joinedAt: '2026-07-15',
    status: 'ACTIVE'
  },
  {
    id: 'user-6',
    name: 'System Administrator',
    email: 'admin@workspark.com',
    role: 'admin',
    companyOrHeadline: 'WorkSpark Platform Trust & Safety',
    location: 'Global Head Office',
    joinedAt: '2026-01-01',
    status: 'ACTIVE'
  }
];

