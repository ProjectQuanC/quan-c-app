import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

interface ChallengeProps {
  id: string;
  title: string;
  score: number;
  total_test_case: number;
  tags: string[];
  completionStatus: string; // Prop for completion status
}

const Challenge: React.FC<ChallengeProps> = ({ id, title, tags, score, completionStatus }) => {
  const challengeButton = "Challenge Now";
  const completedButton = "Completed";
  const imageUrl = "https://dicoding-assets.sgp1.cdn.digitaloceanspaces.com/blog/wp-content/uploads/2023/05/Digitalhealth.org_.jpeg";
  const challengeDetailUrl = `/challenge-detail?id=${id}`;
  const leaderboardUrl = `/leaderboard?id=${id}`;

  // Determine the difficulty and associated background color based on the score
  const getDifficulty = (score: number): { label: string; bgColor: string } => {
    if (score <= 10) {
      return { label: 'Easy', bgColor: 'bg-green-600' }; // Green background for Easy
    } else if (score > 10 && score <= 20) {
      return { label: 'Medium', bgColor: 'bg-yellow-500' }; // Yellow background for Medium
    } else {
      return { label: 'Hard', bgColor: 'bg-red-500' }; // Red background for Hard
    }
  };

  const { label: difficulty, bgColor } = getDifficulty(score);

  return (
    <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
      <div className="absolute top-4 left-4">
      </div>
      <a href={challengeDetailUrl}>
        <img className="rounded-t-lg" src={imageUrl} alt={title} />
      </a>
      <div className="p-5">
        <a href={challengeDetailUrl}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </a>
        <div className="mb-3">
          <span className={`inline-block text-white text-sm px-3 me-2 py-1 rounded ${bgColor}`}>
            {difficulty}
          </span>
          {tags.map((tag, index) => (
            <span key={index} className="inline-block bg-blue-400 text-blue-800 text-sm mr-2 px-2.5 py-0.5 rounded dark:text-white">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex space-x-4 mt-2">
          {completionStatus === 'completed' ? (
            <>
              <a href={challengeDetailUrl} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-200">
                {completedButton}
                <IoMdCheckmarkCircleOutline className='ms-2' />
              </a>
              {/* Render View Leaderboards button only if challenge is completed */}
              <a href={leaderboardUrl} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-200">
                View Leaderboards
                <svg className="w-3.5 h-3.5 ms-2 mt-[1px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </a>
            </>
          ) : (
            <a href={challengeDetailUrl} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-200 dark:hover:bg-blue-400 dark:focus:ring-blue-200">
              {challengeButton}
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2 mt-[1px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenge;