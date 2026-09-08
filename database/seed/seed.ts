import { db, initDatabase, exec, run, transaction } from '../db.js';
import bcrypt from 'bcryptjs';

console.log('🌱 Starting Sethu Hub comprehensive database seeding...');

// Ensure clean schema
initDatabase();

const hashedPassword = bcrypt.hashSync('sethu123', 10);

transaction(() => {
  // Clear existing demo data
  exec(`
    DELETE FROM reputation_logs;
    DELETE FROM user_badges;
    DELETE FROM notifications;
    DELETE FROM audit_logs;
    DELETE FROM knowledge_edges;
    DELETE FROM knowledge_nodes;
    DELETE FROM innovation_opportunities;
    DELETE FROM trends;
    DELETE FROM ai_analyses;
    DELETE FROM ai_embeddings;
    DELETE FROM ai_safety_flags;
    DELETE FROM moderation_actions;
    DELETE FROM reports;
    DELETE FROM event_rsvps;
    DELETE FROM events;
    DELETE FROM poll_votes;
    DELETE FROM poll_options;
    DELETE FROM polls;
    DELETE FROM project_requests;
    DELETE FROM project_members;
    DELETE FROM projects;
    DELETE FROM saves;
    DELETE FROM votes;
    DELETE FROM comments;
    DELETE FROM post_tags;
    DELETE FROM posts;
    DELETE FROM community_members;
    DELETE FROM communities;
    DELETE FROM profiles;
    DELETE FROM users;
    DELETE FROM departments;
    DELETE FROM badges;
  `);

  console.log('Cleared existing tables. Inserting departments...');

  // 1. Departments
  const departments = [
    { code: 'CSD', name: 'Computer Science & Design', description: 'Bridging modern UI/UX design, AI product architecture, and software engineering.' },
    { code: 'CSE', name: 'Computer Science & Engineering', description: 'Core computing, systems, algorithms, and high-performance software.' },
    { code: 'AI_DS', name: 'Artificial Intelligence & Data Science', description: 'Machine learning, deep learning, statistical modeling, and data pipelines.' },
    { code: 'ECE', name: 'Electronics & Communication Engineering', description: 'Embedded systems, VLSI, signal processing, IoT, and communication.' },
    { code: 'EEE', name: 'Electrical & Electronics Engineering', description: 'Power electronics, smart grids, electric vehicles, and renewable systems.' },
    { code: 'MECH', name: 'Mechanical Engineering', description: 'Robotics, thermodynamics, CAD/CAM, and additive manufacturing.' },
    { code: 'CIVIL', name: 'Civil Engineering', description: 'Structural engineering, smart campus infrastructure, and environmental systems.' },
    { code: 'IT', name: 'Information Technology', description: 'Cloud infrastructure, cybersecurity, enterprise web applications.' },
    { code: 'BT', name: 'Biotechnology', description: 'Bioinformatics, bioprocess engineering, and agricultural tech.' },
    { code: 'MBA', name: 'Management Studies', description: 'Tech venture management, product marketing, and operations.' }
  ];

  for (const dept of departments) {
    run('INSERT INTO departments (code, name, description) VALUES (?, ?, ?)', [dept.code, dept.name, dept.description]);
  }

  // 2. Badges
  const badges = [
    { slug: 'problem-solver', name: 'Problem Solver', description: 'Answered 5+ technical questions with accepted answers', icon: 'CheckCircle2', category: 'technical' },
    { slug: 'helpful-contributor', name: 'Helpful Contributor', description: 'Earned 50+ upvotes across helpful comments and solutions', icon: 'ThumbsUp', category: 'community' },
    { slug: 'project-builder', name: 'Project Builder', description: 'Successfully created or contributed to active campus projects', icon: 'Rocket', category: 'collaboration' },
    { slug: 'research-explorer', name: 'Research Explorer', description: 'Published peer-reviewed notes or paper summaries in /c/research', icon: 'BookOpen', category: 'academic' },
    { slug: 'community-leader', name: 'Community Leader', description: 'Actively moderates discussions and maintains community quality', icon: 'Shield', category: 'leadership' },
    { slug: 'mentor', name: 'Faculty Mentor', description: 'Verified faculty member providing guidance to students', icon: 'GraduationCap', category: 'institutional' }
  ];

  for (const b of badges) {
    run('INSERT INTO badges (slug, name, description, icon, category) VALUES (?, ?, ?, ?, ?)', [b.slug, b.name, b.description, b.icon, b.category]);
  }

  // 3. Communities
  const communities = [
    { id: 'c-general', slug: 'general', name: 'General Sethu', description: 'Open town square for all students, faculty, and alumni of Sethu Institute of Technology.', icon_url: '🏫', banner_url: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', is_official: 1 },
    { id: 'c-csd', slug: 'csd', name: 'Computer Science & Design', description: 'Official hub for CSD students: Design systems, frontend architecture, UI/UX, and AI applications.', icon_url: '🎨', banner_url: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)', is_official: 1 },
    { id: 'c-cse', slug: 'cse', name: 'Computer Science & Eng', description: 'Core CSE discussions: Data structures, systems, OS, competitive programming, and algorithms.', icon_url: '💻', banner_url: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', is_official: 1 },
    { id: 'c-ai-ml', slug: 'ai-ml', name: 'AI & Machine Learning', description: 'PyTorch, transformers, LLMs, computer vision, Kaggle, and AI research at SIT.', icon_url: '🤖', banner_url: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)', is_official: 1 },
    { id: 'c-ece', slug: 'ece', name: 'Electronics & Comm', description: 'Embedded systems, STM32, Arduino, VLSI, IoT sensors, and robotics.', icon_url: '⚡', banner_url: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', is_official: 1 },
    { id: 'c-projects', slug: 'projects', name: 'Project Collaboration', description: 'Pitch ideas, form cross-department teams, and recruit developers, designers, and researchers.', icon_url: '🚀', banner_url: 'linear-gradient(135deg, #172554 0%, #1e40af 100%)', is_official: 1 },
    { id: 'c-hackathons', slug: 'hackathons', name: 'Hackathons & Contests', description: 'Smart India Hackathon, internal SIT hackfests, ideathons, team matching, and winning strategies.', icon_url: '🏆', banner_url: 'linear-gradient(135deg, #451a03 0%, #92400e 100%)', is_official: 1 },
    { id: 'c-placements', slug: 'placements', name: 'Placements & Careers', description: 'Interview experiences, off-campus opportunities, aptitude tests, resume reviews, and CTC guides.', icon_url: '💼', banner_url: 'linear-gradient(135deg, #042f2e 0%, #115e59 100%)', is_official: 1 },
    { id: 'c-research', slug: 'research', name: 'Research & Publications', description: 'IEEE/Springer conferences, research paper methodology, patents, and faculty collaboration.', icon_url: '🔬', banner_url: 'linear-gradient(135deg, #311042 0%, #4a044e 100%)', is_official: 1 },
    { id: 'c-clubs', slug: 'clubs', name: 'Clubs & Societies', description: 'IEEE SIT SB, Coding Club, Google Developer Student Group, Robotics Club, Tamil Mandram.', icon_url: '🎪', banner_url: 'linear-gradient(135deg, #1c1917 0%, #44403c 100%)', is_official: 1 },
    { id: 'c-events', slug: 'events', name: 'Campus Events', description: 'Symposiums, technical workshops, sports day, annual cultural fest, and guest lectures.', icon_url: '📅', banner_url: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)', is_official: 1 },
    { id: 'c-campus-life', slug: 'campus-life', name: 'Campus Life & Transport', description: 'Bus routes, cafeteria reviews, library hours, hostel notices, and day-to-day student life.', icon_url: '🚌', banner_url: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', is_official: 1 },
    { id: 'c-open-source', slug: 'open-source', name: 'Open Source SIT', description: 'Contributing to open source, GitHub student packs, Linux ricing, and SIT web projects.', icon_url: '🌐', banner_url: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', is_official: 0 },
    { id: 'c-startups', slug: 'startups', name: 'Startups & Incubation', description: 'SIT NewGen IEDC, MSME incubation funding, student entrepreneurship, and pitch decks.', icon_url: '💡', banner_url: 'linear-gradient(135deg, #581c87 0%, #7e22ce 100%)', is_official: 1 },
    { id: 'c-memes', slug: 'memes', name: 'Sethu Memes & Fun', description: 'Wholesome campus humor, exam week stress busters, and relatable engineering moments.', icon_url: '🎭', banner_url: 'linear-gradient(135deg, #831843 0%, #be185d 100%)', is_official: 0 }
  ];

  for (const c of communities) {
    run(`
      INSERT INTO communities (id, slug, name, description, icon_url, banner_url, rules, member_count, is_official)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      c.id,
      c.slug,
      c.name,
      c.description,
      c.icon_url,
      c.banner_url,
      JSON.stringify(['Be respectful and constructive.', 'No harassment or vulgar content.', 'Share verified academic and project info.', 'Respect SIT code of conduct.']),
      Math.floor(Math.random() * 400) + 120,
      c.is_official
    ]);
  }

  // 4. Users (50+ realistic students & faculty from Sethu Institute of Technology)
  console.log('Inserting 50+ realistic SIT users...');

  const userRoster = [
    // Primary Demo Personas
    { id: 'u-karthik', username: 'karthik_csd', email: 'karthik.csd@sethu.ac.in', role: 'student', name: 'Karthik Raja', dept: 'CSD', year: 3, bio: 'Computer Science & Design 3rd year. Focused on AI agent UX, Next.js, and Smart India Hackathon finalist.', skills: ['Python', 'UI/UX', 'AI Agents', 'React', 'Figma', 'TypeScript'], interests: ['Hackathons', 'AI Products', 'Design Systems', 'Startups'], rep: 420, badges: ['problem-solver', 'project-builder'] },
    { id: 'u-ramanathan', username: 'dr_ramanathan', email: 'ramanathan.cse@sethu.ac.in', role: 'faculty', name: 'Dr. S. Ramanathan', dept: 'CSE', year: 4, bio: 'Professor & HOD, Computer Science. Research interests in Distributed Systems, Knowledge Graphs, and High Performance Computing.', skills: ['Distributed Systems', 'Research Methodology', 'Database Internals', 'Python', 'C++'], interests: ['Research', 'Patents', 'Knowledge Graphs', 'Student Mentoring'], rep: 1250, badges: ['mentor', 'research-explorer'] },
    { id: 'u-priya', username: 'priya_mod', email: 'priya.ece@sethu.ac.in', role: 'moderator', name: 'Priyadharshini M.', dept: 'ECE', year: 4, bio: '4th Year ECE. President of SIT Technical Club & Campus Community Moderator. IoT enthusiast.', skills: ['Embedded C', 'IoT', 'Python', 'Community Building', 'Robotics'], interests: ['Robotics', 'Hardware Hacks', 'Community Growth'], rep: 890, badges: ['community-leader', 'helpful-contributor'] },
    { id: 'u-admin', username: 'admin_sethu', email: 'admin@sethu.ac.in', role: 'admin', name: 'SIT Hub Administrator', dept: 'CSE', year: 4, bio: 'Institutional system administration & technical operations for Sethu Hub.', skills: ['DevOps', 'Security', 'Database Architecture', 'System Administration'], interests: ['Institutional Computing', 'Campus Infrastructure', 'AI Safety'], rep: 2500, badges: ['community-leader'] },

    // Core Active Students
    { id: 'u-deepa', username: 'deepa_ai', email: 'deepa.aids@sethu.ac.in', role: 'student', name: 'Deepa Sundaram', dept: 'AI_DS', year: 3, bio: 'AI & Data Science explorer. Working on PyTorch computer vision models for agricultural crop diagnostics.', skills: ['PyTorch', 'Computer Vision', 'Python', 'TensorFlow', 'Data Science'], interests: ['Deep Learning', 'AgriTech', 'Hackathons'], rep: 380, badges: ['problem-solver'] },
    { id: 'u-vignesh', username: 'vignesh_k', email: 'vignesh.csd@sethu.ac.in', role: 'student', name: 'Vignesh Kumar', dept: 'CSD', year: 3, bio: 'UI/UX Designer & Frontend Craftsman. Obsessed with micro-interactions, Tailwind, and accessibility.', skills: ['Figma', 'UI/UX', 'TailwindCSS', 'React', 'Motion Design'], interests: ['Design Systems', 'Mobile Apps', 'Open Source'], rep: 310, badges: ['project-builder'] },
    { id: 'u-harish', username: 'harish_b', email: 'harish.mech@sethu.ac.in', role: 'student', name: 'Harish Babu', dept: 'MECH', year: 3, bio: 'Robotics & CAD specialist. Building an autonomous quadcopter for agricultural pesticide spraying.', skills: ['ROS', 'SolidWorks', 'Arduino', 'Python', 'Mechatronics'], interests: ['Robotics', 'Drones', 'Hardware Prototypes'], rep: 275, badges: ['project-builder'] },
    { id: 'u-ananya', username: 'ananya_cse', email: 'ananya.cse@sethu.ac.in', role: 'student', name: 'Ananya Sharma', dept: 'CSE', year: 2, bio: 'Competitive programmer (1600+ CodeChef), exploring backend systems with Go and PostgreSQL.', skills: ['C++', 'Data Structures', 'Go', 'Algorithms', 'SQL'], interests: ['Competitive Programming', 'Systems Engineering', 'Hackathons'], rep: 230, badges: ['helpful-contributor'] },
    { id: 'u-suresh', username: 'suresh_ece', email: 'suresh.ece@sethu.ac.in', role: 'student', name: 'Suresh Raina M.', dept: 'ECE', year: 3, bio: 'VLSI & Embedded Systems enthusiast. Working with STM32 and edge AI inference boards.', skills: ['Embedded C', 'Verilog', 'STM32', 'PCB Design', 'Edge AI'], interests: ['Silicon', 'Microcontrollers', 'Smart Vehicles'], rep: 190, badges: ['problem-solver'] },
    { id: 'u-sneha', username: 'sneha_it', email: 'sneha.it@sethu.ac.in', role: 'student', name: 'Sneha Murugan', dept: 'IT', year: 4, bio: 'Final year IT. Interned at Zoho. Guiding juniors on placement aptitude, DSA, and system design rounds.', skills: ['Java', 'Spring Boot', 'System Design', 'Docker', 'AWS'], interests: ['Placements', 'Backend Engineering', 'Mentoring'], rep: 540, badges: ['helpful-contributor', 'problem-solver'] },
    { id: 'u-arun', username: 'arun_csd', email: 'arun.csd@sethu.ac.in', role: 'student', name: 'Arun Mozhi', dept: 'CSD', year: 2, bio: 'Flutter & Fullstack dev. Winner of SIT Internal Mini-Hackathon 2025.', skills: ['Flutter', 'Node.js', 'Dart', 'Firebase', 'UI/UX'], interests: ['Mobile Dev', 'Startups', 'Hackathons'], rep: 210, badges: ['project-builder'] },
    { id: 'u-keerthana', username: 'keerthana_ai', email: 'keerthana.aids@sethu.ac.in', role: 'student', name: 'Keerthana Velu', dept: 'AI_DS', year: 3, bio: 'NLP and LLM evaluation researcher. Analyzing Tamil NLP sentiment and speech processing.', skills: ['NLP', 'HuggingFace', 'Python', 'LangChain', 'FastAPI'], interests: ['Tamil NLP', 'Generative AI', 'Research'], rep: 340, badges: ['research-explorer'] },
    { id: 'u-dr-meena', username: 'dr_meenakshi', email: 'meenakshi.csd@sethu.ac.in', role: 'faculty', name: 'Dr. R. Meenakshi', dept: 'CSD', year: 4, bio: 'Associate Professor in CSD. Specializing in Human-Computer Interaction and UI/UX Ergonomics.', skills: ['Human-Computer Interaction', 'UX Research', 'Design Thinking', 'Python'], interests: ['Inclusive Design', 'Cognitive Ergonomics', 'Student Projects'], rep: 980, badges: ['mentor'] },
    { id: 'u-dr-balaji', username: 'dr_balaji_ece', email: 'balaji.ece@sethu.ac.in', role: 'faculty', name: 'Dr. V. Balaji', dept: 'ECE', year: 4, bio: 'Professor & Convener, SIT NewGen IEDC. Funding and mentoring student hardware startups.', skills: ['Sensors', 'Patents', 'Startup Incubation', 'Grant Writing'], interests: ['Student Startups', 'Hardware Incubation', 'Patents'], rep: 1120, badges: ['mentor'] },

    // Additional Realistic Students (Expanding to 50+ users)
    ...[
      ['naveen_eee', 'Naveen Kumar', 'EEE', 3, ['Power Systems', 'EV Tech', 'MATLAB'], ['Electric Vehicles', 'Renewables']],
      ['swetha_cse', 'Swetha R.', 'CSE', 2, ['Python', 'SQL', 'Web Dev'], ['Coding', 'Hackathons']],
      ['ashok_mech', 'Ashok Pandian', 'MECH', 4, ['Ansys', 'CAD', 'Manufacturing'], ['Formula Student', 'Automotive']],
      ['pavithra_csd', 'Pavithra S.', 'CSD', 3, ['Figma', 'React', 'CSS'], ['Design Systems', 'Frontend']],
      ['mohamed_it', 'Mohamed Rizwan', 'IT', 3, ['Linux', 'Networking', 'Cybersecurity'], ['CTFs', 'InfoSec']],
      ['gayathri_ece', 'Gayathri N.', 'ECE', 2, ['Arduino', 'C', 'Digital Electronics'], ['Robotics', 'Circuits']],
      ['ramesh_civil', 'Ramesh Kannan', 'CIVIL', 4, ['Revit', 'AutoCAD', 'Surveying'], ['Smart Cities', 'Green Buildings']],
      ['kavitha_bt', 'Kavitha Devi', 'BT', 3, ['Bioinformatics', 'Python', 'Biochem'], ['Healthcare AI', 'Genomics']],
      ['dinesh_ai', 'Dinesh Karthik', 'AI_DS', 2, ['Scikit-learn', 'Pandas', 'Python'], ['Machine Learning', 'Kaggle']],
      ['pradeep_cse', 'Pradeep Raj', 'CSE', 3, ['React Native', 'Node.js', 'MongoDB'], ['Fullstack', 'App Development']],
      ['aishwarya_csd', 'Aishwarya M.', 'CSD', 2, ['Adobe XD', 'HTML/CSS', 'JavaScript'], ['UX Design', 'Visual Arts']],
      ['manoj_eee', 'Manoj Prabhakar', 'EEE', 4, ['Embedded Systems', 'IoT', 'Microchip'], ['Solar Power', 'Industrial IoT']],
      ['shalini_ece', 'Shalini B.', 'ECE', 3, ['Signal Processing', 'MATLAB', 'Python'], ['Wireless Comms', 'DSP']],
      ['vinoth_it', 'Vinoth Kumar', 'IT', 2, ['Docker', 'DevOps', 'Bash'], ['Cloud Computing', 'Open Source']],
      ['divya_ai', 'Divya Bharathi', 'AI_DS', 3, ['PyTorch', 'Data Visualization', 'SQL'], ['Data Science', 'Deep Learning']],
      ['santhosh_mech', 'Santhosh S.', 'MECH', 3, ['3D Printing', 'SolidWorks', 'Robotics'], ['Automation', 'Additive Mfg']],
      ['renuka_cse', 'Renuka Devi', 'CSE', 4, ['Java', 'Algorithms', 'Operating Systems'], ['Tech Placements', 'DSA']],
      ['gokul_csd', 'Gokul Nath', 'CSD', 3, ['Three.js', 'WebGL', 'React'], ['Creative Coding', '3D Web']],
      ['saravanan_eee', 'Saravanan T.', 'EEE', 2, ['Circuits', 'Power Electronics', 'Simulink'], ['Drives', 'Battery Tech']],
      ['megha_bt', 'Megha Sundar', 'BT', 4, ['Genetics', 'Python', 'Data Analysis'], ['Computational Biology', 'Research']],
      ['kailash_it', 'Kailash S.', 'IT', 3, ['Go', 'Kubernetes', 'Microservices'], ['Distributed Systems', 'Cloud Native']],
      ['nandhini_cse', 'Nandhini K.', 'CSE', 2, ['C++', 'Competitive Coding', 'Git'], ['Algorithms', 'LeetCode']],
      ['sarath_ece', 'Sarath Babu', 'ECE', 4, ['RF Design', 'Antennas', 'Electronics'], ['Satellite Comms', 'Telecom']],
      ['priyanga_ai', 'Priyanga M.', 'AI_DS', 4, ['Computer Vision', 'YOLO', 'OpenCV'], ['Autonomous Systems', 'Edge AI']],
      ['bhavani_csd', 'Bhavani R.', 'CSD', 3, ['Design Research', 'User Testing', 'Figma'], ['Product Design', 'Accessibility']],
      ['madhavan_mech', 'Madhavan K.', 'MECH', 2, ['Kinematics', 'Fusion 360', 'Python'], ['Robotics', 'Mechatronics']],
      ['subash_cse', 'Subash Chandran', 'CSE', 3, ['Rust', 'WebAssembly', 'Linux'], ['Low Level Systems', 'Performance']],
      ['janani_it', 'Janani P.', 'IT', 4, ['Fullstack', 'GraphQL', 'Next.js'], ['Web Apps', 'FinTech']],
      ['vijay_ai', 'Vijay Sethupathi S.', 'AI_DS', 3, ['Deep Learning', 'PyTorch', 'CUDA'], ['GPU Optimization', 'LLMs']],
      ['lavanya_ece', 'Lavanya C.', 'ECE', 2, ['Sensors', 'Microcontrollers', 'IoT'], ['Smart Campus', 'Home Automation']],
      ['guru_eee', 'Guru Prasath', 'EEE', 3, ['Power Quality', 'PLC', 'SCADA'], ['Industrial Automation', 'Sensors']],
      ['mithra_csd', 'Mithra V.', 'CSD', 2, ['Illustration', 'UI Design', 'CSS'], ['Visual Design', 'Branding']],
      ['raghav_mech', 'Raghavan N.', 'MECH', 4, ['Aerodynamics', 'CFD', 'Ansys'], ['Aero Tech', 'Simulation']],
      ['yamini_cse', 'Yamini Priya', 'CSE', 3, ['Security', 'Ethical Hacking', 'Python'], ['Cyber Defense', 'Auditing']],
      ['kannan_it', 'Kannan Muthu', 'IT', 3, ['PostgreSQL', 'Redis', 'Node.js'], ['Database Tuning', 'Scalability']],
      ['pooja_ai', 'Pooja Lakshman', 'AI_DS', 2, ['Statistics', 'R', 'Machine Learning'], ['Predictive Modeling', 'Analytics']],
      ['vikram_csd', 'Vikramaditya', 'CSD', 4, ['Design Systems', 'Design Tokens', 'React'], ['Enterprise UX', 'Design Ops']]
    ].map(([uName, dName, dDept, dYear, dSkills, dInterests], idx) => ({
      id: `u-extra-${idx + 1}`,
      username: uName as string,
      email: `${uName}@sethu.ac.in`,
      role: 'student' as const,
      name: dName as string,
      dept: dDept as string,
      year: dYear as number,
      bio: `${dDept} ${dYear}th year student at Sethu Institute of Technology. Keen on ${dInterests.join(', ')}.`,
      skills: dSkills as string[],
      interests: dInterests as string[],
      rep: Math.floor(Math.random() * 300) + 40,
      badges: ['helpful-contributor']
    }))
  ];

  for (const user of userRoster) {
    run(`
      INSERT INTO users (id, username, email, password_hash, role, is_verified, reputation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [user.id, user.username, user.email, hashedPassword, user.role, 1, user.rep]);

    run(`
      INSERT INTO profiles (user_id, display_name, avatar_url, bio, department, year, skills, interests)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      user.name,
      `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}&backgroundColor=0f172a,1e1b4b`,
      user.bio,
      user.dept,
      user.year,
      JSON.stringify(user.skills),
      JSON.stringify(user.interests)
    ]);

    // Give badges
    if (user.badges) {
      for (const b of user.badges) {
        run('INSERT OR IGNORE INTO user_badges (user_id, badge_slug) VALUES (?, ?)', [user.id, b]);
      }
    }
  }

  // Join communities
  console.log('Enrolling students into Sethu communities...');
  for (const user of userRoster) {
    // everyone joins general and their department community
    run('INSERT OR IGNORE INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', ['c-general', user.id, 'member']);
    const deptSlug = user.dept.toLowerCase().replace('_', '-');
    const matchedComm = communities.find(c => c.slug === deptSlug);
    if (matchedComm) {
      run('INSERT OR IGNORE INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', [matchedComm.id, user.id, 'member']);
    }
    // Randomly join 2 other communities
    const randomComms = communities.filter(c => c.slug !== 'general' && c.slug !== deptSlug).sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const rc of randomComms) {
      run('INSERT OR IGNORE INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', [rc.id, user.id, 'member']);
    }
  }

  // Set moderators
  run('INSERT OR REPLACE INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', ['c-general', 'u-priya', 'moderator']);
  run('INSERT OR REPLACE INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', ['c-clubs', 'u-priya', 'moderator']);
  run('INSERT OR REPLACE INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', ['c-csd', 'u-dr-meena', 'moderator']);
  run('INSERT OR REPLACE INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', ['c-cse', 'u-ramanathan', 'moderator']);

  // 5. Posts across all 8 Post Types
  console.log('Inserting realistic posts across 8 post types...');

  const postsData = [
    // --- Post 1: Discussion (Signature Killer Demo Post) ---
    {
      id: 'p-killer-demo',
      author_id: 'u-karthik',
      community_id: 'c-projects',
      title: 'I want to build an AI project but I don\'t know who can help me',
      content: 'Hey everyone, I am planning to build an inter-departmental AI assistant for campus problem solving (computer vision for lab equipment checks and smart noticeboards), but I need an AI/ML specialist who knows PyTorch edge deployment and a mechanical/hardware member for camera sensor enclosures. Who wants to team up?',
      post_type: 'project',
      metadata: JSON.stringify({
        problem_statement: 'Students in CSD often have strong design and software skills, but lack embedded hardware and deep ML model optimization teammates from ECE/AI-DS.',
        required_skills: ['PyTorch', 'Embedded C', 'UI/UX', 'React', 'FastAPI'],
        open_roles: [{ role: 'AI/ML Specialist', spots: 1 }, { role: 'Hardware & Enclosure Engineer', spots: 1 }],
        team_size: 3,
        status: 'recruiting'
      }),
      upvotes: 42,
      downvotes: 1,
      comments_count: 5,
      tags: ['AI', 'Collaboration', 'Projects', 'SmartCampus'],
      ai_analysis: {
        topic: 'AI Project Team Formation',
        category: 'collaboration',
        intent: 'collaboration',
        sentiment: 'positive',
        difficulty: 'intermediate',
        department_relevance: ['CSD', 'AI_DS', 'ECE'],
        suggested_tags: ['AI', 'Collaboration', 'PyTorch', 'IoT'],
        collaboration_potential: 1,
        confidence: 0.98,
        summary: 'Student seeking cross-department team members for smart campus edge AI hardware and software prototype.'
      }
    },

    // --- Post 2: Question (StackOverflow Q&A style with Accepted Answer) ---
    {
      id: 'p-question-qa',
      author_id: 'u-ananya',
      community_id: 'c-cse',
      title: 'How do I optimize CUDA memory allocation when training transformers on the SIT GPU server?',
      content: 'I keep getting `CUDA out of memory: Tried to allocate 2.40 GiB` while running LLaMA fine-tuning on our department NVIDIA A100 node with batch size 4. What are the recommended gradient accumulation and LoRA configs for our lab setup?',
      post_type: 'question',
      metadata: JSON.stringify({ difficulty: 'advanced' }),
      upvotes: 28,
      downvotes: 0,
      comments_count: 4,
      is_accepted_answer_set: 1,
      tags: ['CUDA', 'PyTorch', 'LLaMA', 'GPU-Lab'],
      ai_analysis: {
        topic: 'CUDA Memory Optimization',
        category: 'academic',
        intent: 'question',
        sentiment: 'neutral',
        difficulty: 'advanced',
        department_relevance: ['CSE', 'AI_DS'],
        suggested_tags: ['PyTorch', 'CUDA', 'LoRA', 'Optimization'],
        collaboration_potential: 0,
        confidence: 0.95,
        summary: 'Technical inquiry regarding CUDA OOM mitigation during LLM fine-tuning on SIT compute nodes.'
      }
    },

    // --- Post 3: Campus Life / Transportation (Evidence for Idea Mining) ---
    {
      id: 'p-bus-timing',
      author_id: 'u-deepa',
      community_id: 'c-campus-life',
      title: 'Bus timing from Madurai Periyar is completely unpredictable during evening peak hours',
      content: 'Route 14 and Route 22 buses either arrive together or don\'t arrive for 45 minutes after 4:45 PM lab dismissal. Students from Madurai junction are constantly stranded and reaching home after 7:30 PM. Can the transport department share a live GPS feed or real-time departure dashboard?',
      post_type: 'discussion',
      metadata: JSON.stringify({}),
      upvotes: 89,
      downvotes: 2,
      comments_count: 8,
      tags: ['CampusLife', 'Transport', 'MaduraiBus', 'SITBuses'],
      ai_analysis: {
        topic: 'Campus Bus Schedule & Overcrowding',
        category: 'campus-life',
        intent: 'feedback',
        sentiment: 'negative',
        difficulty: 'beginner',
        department_relevance: ['All'],
        suggested_tags: ['Transport', 'BusRoutes', 'CampusLogistics'],
        collaboration_potential: 1,
        confidence: 0.96,
        summary: 'Recurring grievance about unpredictable college bus departure intervals and evening overcrowding on Madurai routes.'
      }
    },

    // --- Post 4: Campus Life / Transportation 2 (Evidence for Idea Mining) ---
    {
      id: 'p-bus-crowd',
      author_id: 'u-suresh',
      community_id: 'c-campus-life',
      title: 'Bus Route 7 from Virudhunagar is overcrowded to dangerous levels',
      content: 'Every morning, more than 85 students cram into a 54-seater bus. Day scholars are forced to stand at the door step. Many students who miss the first bus end up receiving late attendance in 1st period. We desperately need an automated bus capacity tracker or one additional bus dispatched during 7:30 AM peak.',
      post_type: 'discussion',
      metadata: JSON.stringify({}),
      upvotes: 112,
      downvotes: 3,
      comments_count: 11,
      tags: ['Transport', 'Safety', 'VirudhunagarRoute'],
      ai_analysis: {
        topic: 'Campus Bus Schedule & Overcrowding',
        category: 'campus-life',
        intent: 'feedback',
        sentiment: 'negative',
        difficulty: 'beginner',
        department_relevance: ['All'],
        suggested_tags: ['Transport', 'Safety', 'CampusLogistics'],
        collaboration_potential: 1,
        confidence: 0.97,
        summary: 'Student report highlighting severe overcrowding and attendance penalties caused by insufficient bus capacity on Virudhunagar routes.'
      }
    },

    // --- Post 5: Campus Life / Transportation 3 (Evidence for Idea Mining) ---
    {
      id: 'p-bus-waiting',
      author_id: 'u-harish',
      community_id: 'c-campus-life',
      title: 'Students wait too long in the bus bay under the sun without timing displays',
      content: 'During special coaching classes and Saturday lab sessions, there is zero clarity on which buses are operating. Students wait over an hour in the bay asking security guards who also do not have driver phone numbers. A simple web app showing bus departure status would solve 90% of our daily headache.',
      post_type: 'discussion',
      metadata: JSON.stringify({}),
      upvotes: 94,
      downvotes: 1,
      comments_count: 6,
      tags: ['Transport', 'BusBay', 'CampusApp'],
      ai_analysis: {
        topic: 'Campus Bus Schedule & Overcrowding',
        category: 'campus-life',
        intent: 'feedback',
        sentiment: 'negative',
        difficulty: 'beginner',
        department_relevance: ['All'],
        suggested_tags: ['Transport', 'CampusLife', 'InnovationIdea'],
        collaboration_potential: 1,
        confidence: 0.99,
        summary: 'Lack of real-time bus bay visibility and scheduling updates for Saturday coaching sessions.'
      }
    },

    // --- Post 6: Poll (Interactive Reddit-style Poll) ---
    {
      id: 'p-poll-languages',
      author_id: 'u-dr-meena',
      community_id: 'c-csd',
      title: 'Poll: Which programming language should we standardize for 3rd Year Product Lab?',
      content: 'For our upcoming Design & Software Engineering Lab (CSD301), faculty wants student feedback on the primary development stack for fullstack prototyping. Please vote below:',
      post_type: 'poll',
      metadata: JSON.stringify({
        poll_options: ['TypeScript (Node/Next.js)', 'Python (FastAPI / Django)', 'Go (Golang)', 'Java (Spring Boot)']
      }),
      upvotes: 63,
      downvotes: 2,
      comments_count: 5,
      tags: ['Curriculum', 'Poll', 'CSD', 'WebDev'],
      ai_analysis: {
        topic: 'Programming Stack Standardization',
        category: 'academic',
        intent: 'feedback',
        sentiment: 'neutral',
        difficulty: 'beginner',
        department_relevance: ['CSD', 'CSE', 'IT'],
        suggested_tags: ['Curriculum', 'TechStack', 'Poll'],
        collaboration_potential: 0,
        confidence: 0.92,
        summary: 'Faculty inquiry collecting student consensus on modern language stacks for project labs.'
      }
    },

    // --- Post 7: Event (Campus Hackathon Event with RSVP) ---
    {
      id: 'p-event-hackfest',
      author_id: 'u-priya',
      community_id: 'c-events',
      title: 'SIT TechFest & 24-Hour Hackathon 2026: Registrations Now Open!',
      content: 'Get ready for Sethu Institute of Technology\'s flagship 24-hour inter-collegiate hackathon. Over Rs. 1,50,000 in cash prizes across 4 tracks: Smart Campus & IoT, AI for Social Good, FinTech & Web3, and HealthTech. Hardware components and high-speed fiber provided.',
      post_type: 'event',
      metadata: JSON.stringify({
        event_name: 'SIT TechFest 24-Hour Hackathon 2026',
        event_date: '2026-10-15',
        event_time: '09:00 AM IST',
        location: 'SIT Central Auditorium & Innovation Lab',
        organizer: 'SIT Technical Club & IEEE Student Branch',
        registration_link: 'https://sethu.ac.in/techfest2026'
      }),
      upvotes: 145,
      downvotes: 1,
      comments_count: 9,
      tags: ['Hackathon', 'SITTechFest', 'CashPrizes', 'Coding'],
      ai_analysis: {
        topic: 'SIT TechFest 2026 Hackathon',
        category: 'events',
        intent: 'announcement',
        sentiment: 'positive',
        difficulty: 'intermediate',
        department_relevance: ['All'],
        suggested_tags: ['Hackathon', 'Events', 'Prizes'],
        collaboration_potential: 1,
        confidence: 0.99,
        summary: 'Official institutional announcement for the annual 24-hour hackathon with multi-track prize categories.'
      }
    },

    // --- Post 8: Opportunity (Internship & Placement Guide) ---
    {
      id: 'p-opp-internship',
      author_id: 'u-sneha',
      community_id: 'c-placements',
      title: 'Zoho Off-Campus & On-Campus Drive 2026: Comprehensive Interview Experience & Roadmap',
      content: 'I recently cleared the Zoho Developer interview through SIT placements. Here is my breakdown of Round 1 (C/Java Aptitude & Code snippet output), Round 2 (Basic programming - strings & recursion), Round 3 (Advanced DSA - Maze solving & Cache simulation), and Round 4 (HR/Culture). Feel free to ask questions!',
      post_type: 'opportunity',
      metadata: JSON.stringify({
        company: 'Zoho Corporation',
        role: 'Software Developer',
        ctc_range: '6.5 - 8.5 LPA',
        location: 'Chennai / Tenkasi'
      }),
      upvotes: 178,
      downvotes: 0,
      comments_count: 14,
      tags: ['Placements', 'Zoho', 'InterviewExperience', 'Roadmap'],
      ai_analysis: {
        topic: 'Zoho Developer Placement Roadmap',
        category: 'career',
        intent: 'sharing',
        sentiment: 'positive',
        difficulty: 'intermediate',
        department_relevance: ['CSE', 'CSD', 'IT', 'ECE'],
        suggested_tags: ['Placements', 'Zoho', 'DSA', 'InterviewPrep'],
        collaboration_potential: 0,
        confidence: 0.99,
        summary: 'Step-by-step interview experience and strategy guide for SIT students aspiring to clear Zoho technical rounds.'
      }
    },

    // --- Post 9: Showcase (Student Project Demo) ---
    {
      id: 'p-showcase-drone',
      author_id: 'u-harish',
      community_id: 'c-projects',
      title: 'Showcase: Autonomous Drone with YOLOv8 Edge Inference for Pest Detection in Madurai Paddy Fields',
      content: 'Our inter-departmental team (Mechanical + ECE) built a carbon-fiber octocopter powered by a Raspberry Pi 5 and Hailo-8 AI accelerator. It scans 1 acre in 6 minutes and geo-tags pest infestation zones on a real-time OpenStreetMap dashboard. GitHub repo and test flight video below!',
      post_type: 'showcase',
      metadata: JSON.stringify({
        github_url: 'https://github.com/sethu-robotics/agri-drone-yolo',
        tech_stack: ['Raspberry Pi 5', 'Hailo-8', 'YOLOv8', 'ROS2', 'SolidWorks']
      }),
      upvotes: 82,
      downvotes: 1,
      comments_count: 7,
      tags: ['Showcase', 'Robotics', 'AgriTech', 'Drones', 'EdgeAI'],
      ai_analysis: {
        topic: 'Autonomous Agri-Drone Prototype',
        category: 'projects',
        intent: 'sharing',
        sentiment: 'positive',
        difficulty: 'advanced',
        department_relevance: ['MECH', 'ECE', 'AI_DS'],
        suggested_tags: ['Robotics', 'YOLO', 'EdgeAI', 'Showcase'],
        collaboration_potential: 1,
        confidence: 0.96,
        summary: 'Successful inter-departmental hardware project demonstration integrating computer vision with autonomous aerial robotics.'
      }
    },

    // --- Post 10: Official Announcement ---
    {
      id: 'p-announcement-iedc',
      author_id: 'u-dr-balaji',
      community_id: 'c-startups',
      title: 'Call for Proposals: SIT NewGen IEDC Seed Grants (Up to Rs. 2.5 Lakhs per student project)',
      content: 'The NewGen Innovation & Entrepreneurship Development Centre (IEDC) at Sethu Institute of Technology invites pre-final and final year project teams to submit hardware/software commercialization proposals. Shortlisted teams receive up to Rs. 2,50,000 prototype funding, faculty mentorship, and patent filing assistance.',
      post_type: 'announcement',
      metadata: JSON.stringify({
        deadline: '2026-11-30',
        grant_amount: 'Rs. 2,50,000',
        portal: 'https://iedc.sethu.ac.in'
      }),
      upvotes: 120,
      downvotes: 0,
      comments_count: 5,
      is_pinned: 1,
      tags: ['Startups', 'IEDC', 'Funding', 'Patents', 'Innovation'],
      ai_analysis: {
        topic: 'NewGen IEDC Student Startup Grants',
        category: 'academic',
        intent: 'announcement',
        sentiment: 'positive',
        difficulty: 'intermediate',
        department_relevance: ['All'],
        suggested_tags: ['Startups', 'Grants', 'IEDC', 'Patents'],
        collaboration_potential: 1,
        confidence: 0.99,
        summary: 'Official SIT IEDC grant invitation providing up to 2.5L funding for viable student hardware and software innovations.'
      }
    }
  ];

  for (const p of postsData) {
    run(`
      INSERT INTO posts (id, author_id, community_id, title, content, post_type, metadata, upvotes_count, downvotes_count, comments_count, is_accepted_answer_set, is_pinned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id,
      p.author_id,
      p.community_id,
      p.title,
      p.content,
      p.post_type,
      p.metadata,
      p.upvotes,
      p.downvotes,
      p.comments_count,
      p.is_accepted_answer_set ? 1 : 0,
      p.is_pinned ? 1 : 0
    ]);

    // Tags
    for (const tag of p.tags) {
      run('INSERT INTO post_tags (post_id, tag) VALUES (?, ?)', [p.id, tag]);
    }

    // AI Analysis
    if (p.ai_analysis) {
      run(`
        INSERT INTO ai_analyses (id, post_id, topic, category, intent, sentiment, difficulty, department_relevance, suggested_tags, collaboration_potential, confidence, summary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `ai-${p.id}`,
        p.id,
        p.ai_analysis.topic,
        p.ai_analysis.category,
        p.ai_analysis.intent,
        p.ai_analysis.sentiment,
        p.ai_analysis.difficulty,
        JSON.stringify(p.ai_analysis.department_relevance),
        JSON.stringify(p.ai_analysis.suggested_tags),
        p.ai_analysis.collaboration_potential,
        p.ai_analysis.confidence,
        p.ai_analysis.summary
      ]);
    }
  }

  // 6. Specific Details for Post Types: Projects, Polls, Events
  console.log('Attaching project details, poll options, and events...');

  // Project 1 (Killer Demo Post p-killer-demo)
  run(`
    INSERT INTO projects (id, post_id, title, problem_statement, description, required_skills, open_roles, team_size, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'proj-killer-demo',
    'p-killer-demo',
    'AI Campus Problem Solver & Vision Assistant',
    'Lack of centralized AI-driven hardware inspection and intelligent notification network across SIT labs.',
    'Building an edge AI computer vision pipeline coupled with a clean web dashboard for automated lab diagnostics.',
    JSON.stringify(['PyTorch', 'Embedded C', 'UI/UX', 'React', 'FastAPI']),
    JSON.stringify([
      { role: 'AI/ML Specialist', spots: 1 },
      { role: 'Hardware & Enclosure Engineer', spots: 1 }
    ]),
    3,
    'recruiting'
  ]);

  run('INSERT INTO project_members (project_id, user_id, role_name) VALUES (?, ?, ?)', ['proj-killer-demo', 'u-karthik', 'Project Lead & UI/UX']);

  // Poll 1 (p-poll-languages)
  run('INSERT INTO polls (id, post_id, question, expires_at) VALUES (?, ?, ?, ?)', [
    'poll-lang',
    'p-poll-languages',
    'Which programming language should we standardize for 3rd Year Product Lab?',
    '2026-10-30 23:59:59'
  ]);

  const pollOpts = [
    { id: 'opt-ts', text: 'TypeScript (Node/Next.js)', votes: 34 },
    { id: 'opt-py', text: 'Python (FastAPI / Django)', votes: 21 },
    { id: 'opt-go', text: 'Go (Golang)', votes: 8 },
    { id: 'opt-java', text: 'Java (Spring Boot)', votes: 4 }
  ];

  for (const opt of pollOpts) {
    run('INSERT INTO poll_options (id, poll_id, option_text, vote_count) VALUES (?, ?, ?, ?)', [opt.id, 'poll-lang', opt.text, opt.votes]);
  }

  // Event 1 (p-event-hackfest)
  run(`
    INSERT INTO events (id, post_id, event_name, event_date, event_time, location, organizer, registration_link, rsvp_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'event-hackfest',
    'p-event-hackfest',
    'SIT TechFest 24-Hour Hackathon 2026',
    '2026-10-15',
    '09:00 AM IST',
    'SIT Central Auditorium & Innovation Lab',
    'SIT Technical Club & IEEE Student Branch',
    'https://sethu.ac.in/techfest2026',
    48
  ]);

  // RSVPs for event
  run('INSERT INTO event_rsvps (event_id, user_id, status) VALUES (?, ?, ?)', ['event-hackfest', 'u-karthik', 'going']);
  run('INSERT INTO event_rsvps (event_id, user_id, status) VALUES (?, ?, ?)', ['event-hackfest', 'u-deepa', 'going']);
  run('INSERT INTO event_rsvps (event_id, user_id, status) VALUES (?, ?, ?)', ['event-hackfest', 'u-vignesh', 'going']);

  // 7. Comments & Nested Threads
  console.log('Inserting nested comment threads and accepted answers...');

  const commentsData = [
    // Killer demo post comments
    {
      id: 'c-kd-1',
      post_id: 'p-killer-demo',
      author_id: 'u-deepa',
      parent_id: null,
      content: 'I would love to collaborate on the PyTorch edge inference side! I have trained lightweight MobileNet and YOLOv8 models for SIT camera feeds. Let\'s connect after 4 PM at the CSD design lab!',
      upvotes: 14,
      downvotes: 0,
      is_accepted: 0
    },
    {
      id: 'c-kd-2',
      post_id: 'p-killer-demo',
      author_id: 'u-karthik',
      parent_id: 'c-kd-1',
      content: 'Awesome Deepa! That is exactly what we need for the real-time inference latency. I have already designed the dashboard mockups in Figma.',
      upvotes: 8,
      downvotes: 0,
      is_accepted: 0
    },
    {
      id: 'c-kd-3',
      post_id: 'p-killer-demo',
      author_id: 'u-harish',
      parent_id: null,
      content: 'For the sensor enclosures and camera mounting brackets, I can 3D print them in the Mechanical CAD lab using our Ender-3 printers. What dimensions do you need?',
      upvotes: 11,
      downvotes: 0,
      is_accepted: 0
    },
    {
      id: 'c-kd-4',
      post_id: 'p-killer-demo',
      author_id: 'u-ramanathan',
      parent_id: null,
      content: 'Very promising inter-departmental initiative. If your team produces a working prototype before next month, the CSE department can sponsor your Smart India Hackathon internal registration and grant lab server access.',
      upvotes: 26,
      downvotes: 0,
      is_accepted: 0
    },

    // Q&A Question comments (with Accepted Answer)
    {
      id: 'c-qa-1',
      post_id: 'p-question-qa',
      author_id: 'u-ramanathan',
      parent_id: null,
      content: `Here is the verified fix for our SIT NVIDIA A100 node:

1. Enable 4-bit NormalFloat quantization using \`bitsandbytes\`:
\`\`\`python
bnb_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.bfloat16)
\`\`\`
2. Set your per-device batch size to \`1\` and use \`gradient_accumulation_steps=8\`.
3. Enable FlashAttention-2 with \`attn_implementation="flash_attention_2"\`.

This drops VRAM from 28GB down to 9.2GB without losing convergence speed.`,
      upvotes: 35,
      downvotes: 0,
      is_accepted: 1 // ACCEPTED ANSWER
    },
    {
      id: 'c-qa-2',
      post_id: 'p-question-qa',
      author_id: 'u-ananya',
      parent_id: 'c-qa-1',
      content: 'Thank you so much Professor! Implemented gradient accumulation with bfloat16 and training is running smoothly now at 10.4GB peak memory.',
      upvotes: 7,
      downvotes: 0,
      is_accepted: 0
    },

    // Bus timing thread comments
    {
      id: 'c-bus-1',
      post_id: 'p-bus-timing',
      author_id: 'u-vignesh',
      parent_id: null,
      content: 'Agreed 100%. Madurai Periyar route is chaotic on Tuesdays and Thursdays. Driver said they get caught in Thirunagar traffic bottleneck.',
      upvotes: 18,
      downvotes: 0,
      is_accepted: 0
    },
    {
      id: 'c-bus-2',
      post_id: 'p-bus-timing',
      author_id: 'u-priya',
      parent_id: null,
      content: 'Our student council submitted a formal petition to the Transport In-charge last month. An automated GPS tracker app built by students would give us actual data to show management.',
      upvotes: 31,
      downvotes: 0,
      is_accepted: 0
    }
  ];

  for (const c of commentsData) {
    run(`
      INSERT INTO comments (id, post_id, author_id, parent_id, content, upvotes_count, downvotes_count, is_accepted_answer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      c.id,
      c.post_id,
      c.author_id,
      c.parent_id,
      c.content,
      c.upvotes,
      c.downvotes,
      c.is_accepted
    ]);
  }

  // 8. Trends Engine Data (Pre-computed for instant discovery)
  console.log('Seeding detected campus trends...');

  const trendsData = [
    {
      id: 't-ai-projects',
      topic: 'AI Project Team Formation & Compute Access',
      growth_percent: 240,
      post_count: 38,
      user_count: 54,
      department: 'CSD / CSE / AI_DS',
      velocity: 'Rapidly Rising',
      summary: 'Huge spike in students across CSD, CSE, and AI-DS seeking inter-departmental teammates for AI hackathons and lab compute access.',
      related_communities: JSON.stringify(['projects', 'ai-ml', 'hackathons'])
    },
    {
      id: 't-bus-transport',
      topic: 'Campus Bus Departure Schedules & Crowding',
      growth_percent: 185,
      post_count: 42,
      user_count: 89,
      department: 'Campus-wide',
      velocity: 'High Sustained',
      summary: 'Persistent student reports regarding unpredictable Madurai & Virudhunagar bus timings and lack of live tracking.',
      related_communities: JSON.stringify(['campus-life', 'general'])
    },
    {
      id: 't-placements-zoho',
      topic: 'Zoho & TCS Technical Round Preparation',
      growth_percent: 145,
      post_count: 29,
      user_count: 67,
      department: 'CSE / CSD / IT / ECE',
      velocity: 'Rising',
      summary: 'Placement discussions surging as pre-final and final year students exchange DSA questions and aptitude strategies.',
      related_communities: JSON.stringify(['placements', 'cse', 'csd'])
    },
    {
      id: 't-hackfest-sithack',
      topic: 'SIT TechFest 2026 Hackathon Team Formation',
      growth_percent: 320,
      post_count: 51,
      user_count: 94,
      department: 'All Departments',
      velocity: 'Spike',
      summary: 'Immediate registration spike following official TechFest 2026 announcement with teams seeking UI and hardware members.',
      related_communities: JSON.stringify(['hackathons', 'events', 'projects'])
    }
  ];

  for (const t of trendsData) {
    run(`
      INSERT INTO trends (id, topic, growth_percent, post_count, user_count, department, velocity, summary, related_communities)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      t.id,
      t.topic,
      t.growth_percent,
      t.post_count,
      t.user_count,
      t.department,
      t.velocity,
      t.summary,
      t.related_communities
    ]);
  }

  // 9. Idea Mining Agent: Signature Killer Feature (Potential Innovation Opportunities)
  console.log('Seeding AI mined Potential Innovation Opportunities...');

  const innovationData = [
    {
      id: 'inn-1',
      title: 'Real-Time SIT Smart Bus Tracking & Dynamic Route Dispatch System',
      problem_statement: 'Unpredictable evening bus arrivals from Madurai and Virudhunagar cause student overcrowding, long waits in the sun, and missed morning lab attendance.',
      evidence_post_ids: JSON.stringify(['p-bus-timing', 'p-bus-crowd', 'p-bus-waiting']),
      evidence_snippets: JSON.stringify([
        '"Bus timing from Madurai Periyar is completely unpredictable during evening peak hours."',
        '"Every morning, more than 85 students cram into a 54-seater bus."',
        '"Students wait over an hour in the bus bay asking security guards who also do not have driver phone numbers."'
      ]),
      affected_departments: JSON.stringify(['All Departments', 'Transport In-charge']),
      suggested_solutions: JSON.stringify([
        'Low-cost ESP32 + GPS/GSM module mounted on college bus dashboards.',
        'Real-time WebSocket departure status board displayed at central bus bay and in Sethu Hub.',
        'Crowdsourced passenger density reporting via student smartphone BLE beacons.'
      ]),
      required_skills: JSON.stringify(['IoT', 'Embedded C', 'React', 'Node.js', 'WebSockets', 'GPS']),
      status: 'mined'
    },
    {
      id: 'inn-2',
      title: 'Inter-Departmental Hardware & GPU Compute Pooling Platform for SIT Projects',
      problem_statement: 'High-compute GPU resources (NVIDIA A100/RTX nodes) and specialized hardware (3D printers, drone components, Hailo accelerators) are siloed in individual departments while students across CSD, AI-DS, and ECE struggle to find hardware or compute for hackathons.',
      evidence_post_ids: JSON.stringify(['p-killer-demo', 'p-question-qa', 'p-showcase-drone']),
      evidence_snippets: JSON.stringify([
        '"I want to build an AI project but I don\'t know who can help me."',
        '"CUDA out of memory: Tried to allocate 2.40 GiB on department server."',
        '"Our inter-departmental team (Mechanical + ECE) built a carbon-fiber octocopter."'
      ]),
      affected_departments: JSON.stringify(['CSD', 'CSE', 'AI_DS', 'ECE', 'MECH']),
      suggested_solutions: JSON.stringify([
        'Unified Sethu Compute Queue with token-based job scheduling for student AI model training.',
        'Decentralized hardware asset ledger allowing students to borrow testing sensors, boards, and 3D printing slots.'
      ]),
      required_skills: JSON.stringify(['Distributed Systems', 'PyTorch', 'Docker', 'FastAPI', 'UI/UX']),
      status: 'validated'
    }
  ];

  for (const inn of innovationData) {
    run(`
      INSERT INTO innovation_opportunities (id, title, problem_statement, evidence_post_ids, evidence_snippets, affected_departments, suggested_solutions, required_skills, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      inn.id,
      inn.title,
      inn.problem_statement,
      inn.evidence_post_ids,
      inn.evidence_snippets,
      inn.affected_departments,
      inn.suggested_solutions,
      inn.required_skills,
      inn.status
    ]);
  }

  // 10. AI Moderation Flags & Reports
  console.log('Seeding moderation queue and safety flags...');

  run(`
    INSERT INTO reports (id, reporter_id, target_type, target_id, reason, details, ai_risk_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'rep-1',
    'u-ananya',
    'post',
    'p-bus-crowd',
    'other',
    'Discussion is becoming intense regarding morning driver arguments, needs moderator review.',
    0.35,
    'pending'
  ]);

  run(`
    INSERT INTO ai_safety_flags (id, target_type, target_id, risk_score, confidence, category, reasoning, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'flag-1',
    'post',
    'p-bus-crowd',
    0.35,
    0.91,
    'Controversial Campus Feedback',
    'Post expresses student dissatisfaction with logistics. Contains no toxic slurs or personal threats, flagged for advisory administrative visibility.',
    'pending_review'
  ]);

  // 11. Knowledge Graph (Initial Nodes & Edges)
  console.log('Building initial Sethu Knowledge Graph...');

  const graphNodes = [
    { id: 'node-u-karthik', type: 'user', label: 'Karthik Raja (CSD)' },
    { id: 'node-u-deepa', type: 'user', label: 'Deepa S. (AI-DS)' },
    { id: 'node-u-ramanathan', type: 'user', label: 'Dr. Ramanathan (CSE)' },
    { id: 'node-p-killer', type: 'post', label: 'AI Campus Problem Solver' },
    { id: 'node-c-csd', type: 'community', label: '/c/csd' },
    { id: 'node-c-projects', type: 'community', label: '/c/projects' },
    { id: 'node-sk-pytorch', type: 'skill', label: 'PyTorch' },
    { id: 'node-sk-uiux', type: 'skill', label: 'UI/UX' },
    { id: 'node-topic-transport', type: 'topic', label: 'Campus Bus Logistics' },
    { id: 'node-inn-bus', type: 'project', label: 'Smart Bus Tracker' }
  ];

  for (const n of graphNodes) {
    run('INSERT INTO knowledge_nodes (id, node_type, label, metadata) VALUES (?, ?, ?, ?)', [n.id, n.type, n.label, '{}']);
  }

  const graphEdges = [
    { id: 'e1', s: 'node-u-karthik', t: 'node-sk-uiux', r: 'HAS_SKILL' },
    { id: 'e2', s: 'node-u-karthik', t: 'node-p-killer', r: 'AUTHORED' },
    { id: 'e3', s: 'node-p-killer', t: 'node-c-projects', r: 'BELONGS_TO' },
    { id: 'e4', s: 'node-u-deepa', t: 'node-sk-pytorch', r: 'HAS_SKILL' },
    { id: 'e5', s: 'node-u-deepa', t: 'node-p-killer', r: 'COLLABORATES_ON' },
    { id: 'e6', s: 'node-topic-transport', t: 'node-inn-bus', r: 'MINED_INTO' },
    { id: 'e7', s: 'node-u-ramanathan', t: 'node-p-killer', r: 'MENTORS' }
  ];

  for (const e of graphEdges) {
    run('INSERT INTO knowledge_edges (id, source_id, target_id, relation_type, weight) VALUES (?, ?, ?, ?, 1.0)', [e.id, e.s, e.t, e.r]);
  }

  // 12. Notifications
  console.log('Seeding demo notifications...');
  run(`
    INSERT INTO notifications (id, user_id, sender_id, type, title, message, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'notif-1',
    'u-karthik',
    'u-deepa',
    'comment',
    'New Comment on your Project',
    'Deepa Sundaram commented on "I want to build an AI project..."',
    '/post/p-killer-demo',
    0
  ]);

  run(`
    INSERT INTO notifications (id, user_id, sender_id, type, title, message, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'notif-2',
    'u-karthik',
    'u-ramanathan',
    'comment',
    'Faculty Endorsement',
    'Dr. S. Ramanathan commented on your project proposal.',
    '/post/p-killer-demo',
    0
  ]);

  run(`
    INSERT INTO notifications (id, user_id, sender_id, type, title, message, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'notif-3',
    'u-ananya',
    'u-ramanathan',
    'accepted_answer',
    'Answer Accepted',
    'Your answer to CUDA optimization was marked accepted!',
    '/post/p-question-qa',
    1
  ]);

  console.log('🎉 Seeding successfully completed! 50+ users, 15+ communities, posts, comments, trends, and innovation opportunities are live.');
});
