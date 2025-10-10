import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Code, Folder, GitBranch, Zap, Cpu, Award, Terminal } from 'lucide-react';
// Assuming the import path is correct for your videos
import mockverseVideo from '../assets/mockverse.mp4'; 
import keymateVideo from '../assets/keymate.mp4'; 
import codebaseVideo from '../assets/codebase.mp4'; // <-- UPDATED IMPORT

// --- 1. Project Data (Keep the data structure, ensure mockCode is present) ---
const projectData = [
  {
    id: 1,
    title: "Mock Verse: AI Interview Generator",
    shortDesc: "Automated interview preparation using Gemini API for tailored questions and real-time feedback.",
    longDesc: "A powerful interview simulator that leverages the Gemini API to generate 50+ unique, tailored questions per session. It integrates Webcam and Speech-to-Text capabilities for fast answer capture and provides detailed, actionable feedback, significantly reducing preparation time.",
    techStack: ["React", "Next.js", "Clerk", "Drizzle", "PostgreSQL", "Gemini API"],
    icon: Cpu,
    repoLink: "https://github.com/riddhiJainSDE/MockVerse", 
    image: mockverseVideo, // Project 1 uses mockverse.mp4
    mockCode: `// src/api/generate.ts\nconst generateQuestion = async (topic) => {\n  const prompt = \`Generate a tough question for \${topic}\`;\n  const response = await gemini.generateContent({ prompt });\n  return response.text;\n};`
  },
  {
    id: 2,
    title: "KeyMate: Secure Credential Manager",
    shortDesc: "Secure credential manager with RSA encryption and JWT authentication for private storage.",
    longDesc: "A secure and highly available credential manager that implements robust security protocols, including RSA encryption for data storage and JWT for authentication. It features a responsive React + Redux frontend built with 6+ reusable components, backed by Express.js and MongoDB.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Redux", "RSA Encryption"],
    icon: Zap,
    repoLink: "https://github.com/riddhiJainSDE/KeyMate",
    image: keymateVideo, // Project 2 uses keymate.mp4
    mockCode: `// src/utils/encryption.js\nconst encrypt = (data, publicKey) => {\n  // RSA encryption logic...\n  return encryptedData;\n};`
  },
  {
    id: 3,
    title: "Maatri: Bilingual QA System",
    shortDesc: "Scalable bilingual healthcare QA system fine-tuned to reduce model hallucination.",
    longDesc: "An analytical NLP research project focused on identifying and mitigating gender bias in abstractive text summarization models. Explored fairness metrics and proposed data augmentation techniques to reduce gender stereotype reinforcement in generated summaries.",
    techStack: ["Streamlit", "FastAPI", "Python", "Bi-encoder", "Cross-encoder", "Summarization", "HuggingFace"],
    icon: Award,
    repoLink: "https://github.com/riddhiJainSDE/Maatri",
    image: "https://placehold.co/800x450/1A202C/CBD5E0?text=Maatri+Chat+Interface",
    mockCode: `# app/main.py\n@app.post("/query")\nasync def process_query(text: str):\n    if is_hindi(text):\n        # Use Hindi model...\n    return response_json`
  },
  {
    id: 4,
    title: "FairSumm: Gender Bias Mitigation",
    shortDesc: "NLP project analyzing and mitigating gender bias in text summarization models.",
    longDesc: "An analytical NLP research project focused on identifying and mitigating gender bias in abstractive text summarization models. Explored fairness metrics and proposed data augmentation techniques to reduce gender stereotype reinforcement in generated summaries.",
    techStack: ["Python", "Transformers", "NLP", "Bias Analysis", "PyTorch", "Data Augmentation"],
    icon: GitBranch,
    repoLink: "https://github.com/riddhiJainSDE/fairsumm",
    image: "https://placehold.co/800x450/1A202C/CBD5E0?text=FairSumm+Results",
    mockCode: `# src/metrics/bias.py\ndef calculate_gender_bias(data):\n    # Calculate fairness scores...\n    return score`
  },
  { 
    id: 5, 
    title: "Learnnify (E-Learning Platform)", 
    shortDesc: "Full-stack platform for course creation, management, and video streaming.", 
    longDesc: "Developed a complete E-Learning platform featuring robust course creation tools, payment gateway integration (Stripe/Razorpay mock), and secure video streaming capabilities. Built using the MERN stack with dedicated dashboards for students and instructors.", 
    techStack: ["MERN Stack", "React", "Node.js", "MongoDB", "Video Streaming", "Stripe API"], 
    icon: Folder, 
    repoLink: "https://github.com/riddhiJainSDE/Learnnify", 
    image: "https://placehold.co/800x450/1A202C/CBD5E0?text=Learnnify+E-Learning", 
    mockCode: `// src/components/VideoPlayer.jsx\nconst streamVideo = (url) => { /* logic */ };` 
  },
  { 
    id: 6, 
    title: "Codebase (Code Editor)", 
    shortDesc: "Browser-based code editor with real-time compilation and execution for multiple languages.", 
    longDesc: "A web-based, multi-language code editor built using React. It features a responsive UI and integrates a backend compiler service (like Piston or a custom Node.js execution server) to allow users to write, compile, and execute code in real-time right from the browser.", 
    techStack: ["React", "Monaco Editor", "Express.js", "Code Compilation API", "JavaScript", "HTML/CSS"], 
    icon: Code, 
    repoLink: "https://github.com/riddhiJainSDE/Codebase", 
    image: codebaseVideo, // <-- UPDATED to use codebase.mp4
    mockCode: `// server/compile.js\nconst execute = (code, lang) => { /* call compiler API */ };` 
  },
  { 
    id: 7, 
    title: "Portfolio Website", 
    shortDesc: "My personal professional showcase built with modern React and GitHub/Tailwind aesthetics.", 
    longDesc: "The very portfolio website you are viewing! Designed to be fast, fully responsive, and visually striking using a GitHub dark-mode aesthetic. Features dynamic data loading (like the Coding Profile graphs) and showcases professional history and skills clearly.", 
    techStack: ["React", "Tailwind CSS", "Vite", "Responsive Design", "API Integration", "Figma Design"], 
    icon: Folder, 
    repoLink: "https://github.com/riddhiJainSDE/riddhijain-portfolio", 
    image: "https://placehold.co/800x450/1A202C/CBD5E0?text=Portfolio+Website", 
    mockCode: `// src/pages/Projects.jsx\nconst renderProject = (p) => { /* scroll logic */ };` 
  },
];

// --- 2. Full Project Section Component ---
const FullProjectSection = ({ project }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const videoRef = useRef(null); // Ref for the video element

  // Combine visibility state with video playback control
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        // Only attempt video playback control if the element is a video tag
        if (videoRef.current && videoRef.current.tagName === 'VIDEO') {
          if (isIntersecting) {
            // Start video playback when in view
            videoRef.current.play().catch(error => console.warn("Video playback blocked:", error));
          } else {
            // Pause video when out of view
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.5 } // Triggers when 50% of the video is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const titleTypingClass = isVisible ? 'typing-text is-visible' : 'typing-text';
  const contentFadeClass = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';

  // FIX: Identify all video assets (MP4s) for rendering the <video> tag
  const isVideoAsset = (project.image === mockverseVideo || project.image === keymateVideo || project.image === codebaseVideo); 

  return (
    <div ref={sectionRef} className="py-16 md:py-24 max-w-6xl mx-auto transition-opacity duration-1000 ease-out"
         style={{ opacity: isVisible ? 1 : 0.2 }} // Fade-in effect on scroll
    >
      <div className="card-wrapper shadow-2xl">
        <div className="card-inner p-8 md:p-12">
          
          {/* TOP SECTION: ANIMATED TITLE/STATUS */}
          <div className="mb-8 pb-4 border-b border-github-border/50">
            <p className="text-xl font-mono text-gray-500 dark:text-gray-400 flex items-center mb-4">
                <Terminal className="w-5 h-5 mr-2 text-github-accent" />
                <span className="text-github-accent/80 font-bold">riddhi@portfolio:~$</span>
                <span className="ml-2">load project {project.id}</span>
            </p>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-github-text leading-snug">
                <span className={titleTypingClass}>
                    {project.title} | {project.shortDesc}
                </span>
            </h2>
          </div>

          {/* MAIN CONTENT GRID (Image/Tech on left, Analysis/Code on right) */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 ease-out ${contentFadeClass}`}>
            
            {/* LEFT COLUMN: PROJECT MEDIA, TECH STACK, & REPO LINK */}
            <div className="lg:col-span-1 flex flex-col space-y-6">
                <h3 className="text-xl font-semibold text-github-text border-b border-github-border/50 pb-2">Project Media</h3>
                
                {/* Project Video/Animation or Image */}
                <div className="w-full rounded-xl overflow-hidden border border-github-border/50 shadow-xl">
                    {isVideoAsset ? (
                        <video 
                            ref={videoRef}
                            src={project.image} 
                            alt={`${project.title} animation`} 
                            className="w-full h-auto object-cover max-h-80"
                            autoPlay={false} // Initially false, controlled by observer
                            loop
                            muted
                            playsInline
                            poster="https://placehold.co/800x450/1A202C/CBD5E0?text=Loading+Animation" 
                        >
                            <source src={project.image} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                         <img 
                            src={project.image} 
                            alt={`${project.title} screenshot mock`} 
                            className="w-full h-auto object-cover max-h-80"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/800x450/1A202C/CBD5E0?text=Image+Placeholder";
                            }}
                        />
                    )}
                </div>
                
                {/* Tech Stack below the Image */}
                <h3 className="text-xl font-semibold text-github-text border-b border-github-border/50 pb-2">Full Tech Stack</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-sm font-semibold rounded-full bg-github-accent/10 text-github-accent border border-github-accent/50"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* GitHub Repository Link */}
                <a
                    href={project.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center px-4 py-3 bg-github-accent text-white rounded-lg font-bold hover:bg-github-accent/80 transition duration-200 shadow-md transform hover:scale-[1.02]"
                >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View GitHub Repository
                </a>
            </div>

            {/* RIGHT COLUMN: DETAILED ANALYSIS & CODE SNIPPET */}
            <div className="lg:col-span-1 flex flex-col">
                <h3 className="text-xl font-semibold text-github-text border-b border-github-border/50 pb-2 mb-4">Detailed Analysis</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {project.longDesc}
                </p>
                
                {/* CODE SNIPPET - Unified within the right column's flow */}
                {project.mockCode && (
                    <div className="code-snippet-block p-4 rounded-lg shadow-inner flex-grow">
                        <p className="font-mono text-sm text-gray-500 mb-2 flex items-center">
                            <Code className="w-4 h-4 mr-2 text-github-accent" />
                            Code Snippet:
                        </p>
                        <pre className="font-mono text-xs overflow-x-auto text-github-text">
                            <code className="text-sm">
                                {project.mockCode}
                            </code>
                        </pre>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- 3. Main Projects Page Component ---
const Projects = () => {
  return (
    <div className="p-4 md:p-6 space-y-4">
      
      {/* Page Header - Stays at the top */}
      <h2 className="text-2xl font-bold text-github-text mb-4 border-b border-github-border dark:border-github-border pb-3">
        Featured Projects ({projectData.length})
      </h2>
      
      {/* Scrollable Project Sections */}
      <div className="space-y-16 md:space-y-24">
        {projectData.map((project) => (
          <FullProjectSection
            key={project.id}
            project={project}
          />
        ))}
      </div>
      
      <div className="text-center py-10 text-gray-500">
          — End of Showcase —
      </div>
    </div>
  );
};

export default Projects;