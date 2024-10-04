import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<Challenge[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<string | null>(null);

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

  const fetchSolvedChallenges = async (page: number, value: string, searchQuery: string, difficulty: string) => {
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
      setSolvedChallenges(challengesData); // Set the fetched challenges to state
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleUpdateChallenge = (challenge_id: string) => {
    navigate(`/challenge-id/${challenge_id}`);
  }

  const handleDeleteChallenge = async (challenge_id: string) => {
    const accessToken = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);
    let data = JSON.stringify({
      "challengeId": challenge_id
    });

    const url = process.env.REACT_APP_API_BASE_URL;
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${url}/deleteChallenge`,
      headers: { 
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const confirmDeleteChallenge = (challenge_id: string) => {
    setChallengeToDelete(challenge_id);
    setShowModal(true);
  }

  const handleConfirmDelete = () => {
    if (challengeToDelete) {
      handleDeleteChallenge(challengeToDelete);
    }
    setShowModal(false);
    setChallengeToDelete(null);
  }

  useEffect(() => {
    fetchChallenges(1, '', '', '');
    fetchSolvedChallenges(1, 'completed', '', '');
  }, []);

  // Function to render the challenge table
  const renderChallengeTable = (challenges: Challenge[], title: string, isSolved: boolean) => {
    return (
      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Challenge ID</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Points</th>
              <th className="border border-gray-300 p-2">Total Test Cases</th>
              <th className="border border-gray-300 p-2">Tags</th>
              <th className="border border-gray-300 p-2">Action</th>
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
                <td className="border border-gray-300 p-2">
                  {/* Update button */}
                  <button
                    onClick={() => handleUpdateChallenge(challenge.challenge_id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Update
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => confirmDeleteChallenge(challenge.challenge_id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {renderChallengeTable(challenges, "Unsolved Challenges", false)}
      {renderChallengeTable(solvedChallenges, "Solved Challenges", true)}

      {/* Modal for delete confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this challenge?</p>
            <div className="mt-4">
              <button 
                onClick={handleConfirmDelete} 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
