import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, Code, Terminal } from 'lucide-react'; 
import radarGif from '../assets/radar.gif'; 
const hardSkills = [
    { 
        name: 'Languages', 
        details: ['C++', 'Java', 'Python', 'JavaScript', 'HTML', 'CSS', 'TypeScript'] 
    },
    { 
        name: 'Frontend', 
        details: ['React.js', 'Next.js', 'Tailwind CSS', 'Redux', 'UI/UX'] 
    },
    { 
        name: 'Backend', 
        details: ['Node.js', 'Express.js', 'MongoDB', 'MySQL', 'REST APIs', 'JWT'] 
    },
    { 
        name: 'ML / AI', 
        details: ['Scikit-learn', 'spaCy', 'BERT', 'Gemini API', 'Streamlit', 'FastAPI'] 
    },
    { 
        name: 'Tools / DevOps', 
        details: ['Git', 'Docker', 'AWS', 'Postman', 'Drizzle ORM'] 
    },
];

// Helper to get skill icon
const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
        case 'languages': return <Terminal className="w-5 h-5 mr-2" />;
        case 'frontend': return <Code className="w-5 h-5 mr-2" />;
        case 'backend': return <Lightbulb className="w-5 h-5 mr-2" />;
        case 'ml / ai': return <Lightbulb className="w-5 h-5 mr-2" />;
        case 'tools / devops': return <Terminal className="w-5 h-5 mr-2" />;
        default: return <Code className="w-5 h-5 mr-2" />;
    }
};

const Skills = () => {
    const [highlightedSkill, setHighlightedSkill] = useState(null);
    
    // Randomly highlight a skill every few seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * hardSkills.length);
            setHighlightedSkill(hardSkills[randomIndex].name);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const totalSkillsCount = hardSkills.reduce((sum, skill) => sum + skill.details.length, 0);

    return (
        <div className="relative p-4 md:p-6 pb-20">
            <h2 className="text-2xl font-bold text-github-text mb-8 border-b border-github-border dark:border-github-border pb-3">
                Technical Skills <span className="text-github-accent text-base ml-2">({totalSkillsCount})</span>
            </h2>

            {/* FIX 1: Apply card-wrapper/card-inner only once to the main container */}
            <div className="card-wrapper shadow-xl">
                <div className="card-inner flex flex-col items-center justify-center p-6 md:p-10">
                    
                    {/* The Circle Container for Skills */}
                    {/* Size remains 450x450, centered */}
                    <div className="relative w-[450px] h-[450px] flex items-center justify-center mb-10"> 
                        
                        {/* Central Animated Element */}
                        {/* Size is 350x350 */}
                        <div className="w-[350px] h-[350px] rounded-full overflow-hidden border-4 border-github-accent/30 shadow-2xl">
                            <img src={radarGif} alt="Radar animation" className="w-full h-full object-cover" />
                        </div>

                        {/* Position skills around the circle */}
                        {hardSkills.map((skill, index) => {
                            const angle = (360 / hardSkills.length) * index;
                            // FIX 2: Increased radius to 220 to push tags outwards to the container edge
                            const radius = 220; 
                            const x = Math.cos(angle * (Math.PI / 180)) * radius;
                            const y = Math.sin(angle * (Math.PI / 180)) * radius;

                            return (
                                <div
                                    key={index}
                                    className={`glowing-skill-circle ${skill.name === highlightedSkill ? 'random-glow' : ''}`}
                                    style={{
                                        // Position the center of the skill tag
                                        left: `calc(50% + ${x}px)`,
                                        top: `calc(50% + ${y}px)`,
                                    }}
                                >
                                    <div className="px-4 py-2 text-sm font-semibold rounded-full bg-github-accent/10 text-github-accent border border-github-accent/50 cursor-help transition-all duration-300 hover:scale-110">
                                        {skill.name}
                                        {/* Tooltip implementation: Fixed width and margin for stable positioning */}
                                        <div className="skill-tooltip" style={{ marginLeft: '-100px', width: '200px' }}> 
                                            <div className="flex items-center text-github-accent mb-2">
                                                {getCategoryIcon(skill.name)}
                                                <span className="font-bold">{skill.name} Stack</span>
                                            </div>
                                            {skill.details.map((detail, detailIndex) => (
                                                <span key={detailIndex} className="inline-block bg-github-border/50 text-gray-300 rounded-full px-2 py-0.5 text-xs m-0.5">
                                                    {detail}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* FIX 3: Descriptive text is now correctly positioned below the fixed 450px circle area */}
                    <p className="mt-8 text-center text-gray-500 max-w-lg mx-auto">
                        <span className="font-bold text-github-text">My skills are actively in use</span>—hover over a category to see the detailed tools and frameworks I've worked with.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Skills;
