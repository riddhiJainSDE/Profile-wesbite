import React from 'react';
import Icon from './ui/Icon.jsx';
// Import your local image file
import profilePhoto from '../assets/riddhi_photo.jpg';

const ProfileSidebar = ({ user }) => (
  <div className="sticky top-16 md:w-full max-w-sm md:max-w-none px-4 md:px-0 mt-4 md:mt-0">
    <div className="relative mb-6">
      <img
        // Use the imported image as the source
        src={profilePhoto}
        alt={user.name}
        className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-gray-300 dark:border-github-border mx-auto md:mx-0 object-cover transform hover:scale-105 transition-transform duration-300 shadow-xl"
        // The onError prop is no longer necessary since you are using a local file
      />
      <div className="absolute bottom-2 right-12 md:bottom-4 md:right-4 bg-green-500 w-6 h-6 rounded-full border-2 border-white dark:border-github-bg flex items-center justify-center text-xs text-white">
        ✓
      </div>
    </div>
    <div className="text-center md:text-left">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-github-text">{user.name}</h1>
      <h2 className="text-xl font-light text-gray-500 dark:text-gray-400 mb-4">{user.id}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">{user.bio}</p>
      <button className="w-full bg-gray-100 dark:bg-github-card text-gray-800 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-300 dark:border-github-border">
        Contact Me
      </button>
      <div className="mt-6 border-t border-gray-200 dark:border-github-border pt-6 space-y-3 text-sm">
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <Icon name="Users" className="mr-2 text-gray-500" />
          <span className="font-semibold text-gray-900 dark:text-github-text">{user.followers}K</span> followers · <span className="ml-1 font-semibold text-gray-900 dark:text-github-text">{user.following}</span> following
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <Icon name="Pin" className="mr-2 text-gray-500" />
          {user.location}
        </p>
        <a href={`mailto:${user.email}`} className="text-blue-600 dark:text-github-accent hover:text-blue-500 dark:hover:text-blue-300 flex items-center">
          <Icon name="Mail" className="mr-2 text-gray-500" />
          {user.email}
        </a>
        <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-github-accent hover:text-blue-500 dark:hover:text-blue-300 flex items-center">
          <Icon name="Github" className="mr-2 text-gray-500" />
          {user.id}
        </a>
      </div>
    </div>
  </div>
);

export default ProfileSidebar;