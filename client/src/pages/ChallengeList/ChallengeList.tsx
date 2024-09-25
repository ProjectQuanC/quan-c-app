import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import Challenge from '../../components/Challenge/Challenge';
import { RootState, AppDispatch } from '../../store/store'; // Adjust the import path as necessary
import { fetchChallenges } from '../../store/features/challenge/challengeAction'; // Adjust the import path as necessary
import Pagination from '../../components/Pagination/Pagination'; // Adjust the import path as necessary

interface Tags {
  tag_id: string;
  tag_name: string;
}

interface Challenge {
  challenge_id: string;
  challenge_title: string;
  points: number;
  total_test_Case: number;
  tags: Tags[];
}

const ChallengeList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [completionStatus, setCompletionStatus] = useState<'completed' | 'incomplete' | ''>('incomplete');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | ''>('');

  const dispatch: AppDispatch = useDispatch();
  const { challenges, loading, error, totalPages } = useSelector((state: RootState) => state.challenges);

  const chevron_down = <svg className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
</svg>

  useEffect(() => {
    dispatch(fetchChallenges(currentPage, completionStatus, searchQuery, difficulty));
  }, [dispatch, currentPage, searchQuery, completionStatus, difficulty]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on search query change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCompletionStatusChange = (status: 'completed' | 'incomplete') => {
    setCompletionStatus(status);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const handleDifficultyChange = (level: 'easy' | 'medium' | 'hard' | '') => {
    setDifficulty(level);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  return (
    <div className="my-24 mx-12 flex flex-col self-center">
      <div className="flex gap-80 mb-4">
        <div className="">
          <h1 className="text-6xl text-white">
            Challenge List
          </h1>
        </div>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search Challenges"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 pl-10 text-md rounded-md shadow-md outline-none bg-background-default text-white placeholder-gray-400 border border-white focus:border-cyan-100"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-8 mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="completionStatus" className="text-white">Completion Status:</label>
          <div className="relative flex-1">
            <select
              id="completionStatus"
              value={completionStatus}
              onChange={(e) => handleCompletionStatusChange(e.target.value as 'completed' | 'incomplete')}
              className="block py-2.5 px-4 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer pe-8"
            >
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
            {chevron_down}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="difficulty" className="text-white">Difficulty:</label>
          <div className="relative flex-1">
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard' | '')}
              className="block py-2.5 px-4 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {chevron_down}
          </div>
        </div>
      </div>




      {/* Challenges */}
      <div className="flex flex-wrap gap-8 mt-4">
        {loading && <p className="text-white">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {challenges && challenges.length > 0 ? (
          challenges.map((challenge: Challenge) => (
            <Challenge
              key={challenge.challenge_id}
              id={challenge.challenge_id}
              title={challenge.challenge_title}
              score={challenge.points}
              total_test_case={challenge.total_test_Case}
              tags={challenge.tags.map(tag => tag.tag_name)} 
              completionStatus={completionStatus}
            />
          ))
        ) : (
          <p className="text-white">No challenges found.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ChallengeList;