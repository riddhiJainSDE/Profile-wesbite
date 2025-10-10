import React from 'react';
import { MessageSquare, Bot } from 'lucide-react';
import ProfileChatbot from '../components/ProfileChatbot.jsx';

const Overview = ({ user }) => (
  <div className="p-4 md:p-6 space-y-10">
    {/* README Card */}
    <div className="card-wrapper">
      <div className="card-inner p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-github-text mb-4 flex items-center">
          <MessageSquare className="mr-2 text-green-500" /> README.md
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          👋 Hi, I'm <strong>{user.name}</strong> — a passionate developer focused on building scalable and secure full-stack applications. 
          I thrive on leveraging <strong>React/Redux</strong> for dynamic frontends and the power of <strong>GenAI (Gemini API)</strong> for intelligent automation. 
          Currently pursuing an Integrated B.Tech + M.Tech in IT.
        </p>

        <div className="mt-4 p-3 bg-github-border/40 rounded-lg text-sm text-gray-200">
          <code className="block text-green-400">
            {'console.log("This profile is built with React, a Redux-like store, and a lot of GitHub love.");'}
          </code>
        </div>
      </div>
    </div>

    {/* AI Chatbot Section */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-github-text border-b border-github-border pb-2 flex items-center">
        <Bot className="mr-2 text-purple-500" /> Ask the Profile Assistant
      </h3>
      <ProfileChatbot />
    </div>
  </div>
);

export default Overview;
