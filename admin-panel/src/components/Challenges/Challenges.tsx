import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Define the interfaces
interface Tag {
  tag_id: string;
  tag_name: string;
}

interface Challenge {
  challenge_id: string;
  challenge_title: string;
  repo_link: string;
  points: number;
  total_test_Case: number;
  tags: Tag[];
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
}

interface ApiResponse {
  data: Challenge[];
  paginationData: PaginationData;
}

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const fetchChallenges = async (page: number, value: string, searchQuery: string, difficulty: string) => {
    const accessToken = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);

    const data = {
      filter: value,
      search: searchQuery,
      difficulty: difficulty,
      page: page
    };

    try {
      const url = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post<ApiResponse>(`${url}/getChallenges`, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const { data: challengesData } = response.data;
      setChallenges(challengesData); // Set the fetched challenges to state
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  useEffect(() => {
    fetchChallenges(1, '', '', '');
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Unsolved Challenges</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Challenge ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Points</th>
            <th className="border border-gray-300 p-2">Total Test Cases</th>
            <th className="border border-gray-300 p-2">Tags</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((challenge) => (
            <tr key={challenge.challenge_id}>
              <td className="border border-gray-300 p-2">{challenge.challenge_id}</td>
              <td className="border border-gray-300 p-2">{challenge.challenge_title}</td>
              <td className="border border-gray-300 p-2">{challenge.points}</td>
              <td className="border border-gray-300 p-2">{challenge.total_test_Case}</td>
              <td className="border border-gray-300 p-2">
                {challenge.tags.map(tag => tag.tag_name).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Challenges;
