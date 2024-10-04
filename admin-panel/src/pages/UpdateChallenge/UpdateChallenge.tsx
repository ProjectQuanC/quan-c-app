import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { X, Plus } from 'lucide-react';

interface ChallengeDetail {
  challenge_id: string;
  challenge_title: string;
  repo_link: string;
  points: number;
  total_test_case: number;
  tags: string[];
}

function UpdateChallenge() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [points, setPoints] = useState('');
  const [testCases, setTestCases] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      const accessToken = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);
      try {
        setIsLoading(true);
        const url = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${url}/getChallengeDetails/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const data: ChallengeDetail = response.data.data;
        setTitle(data.challenge_title);
        setUrl(data.repo_link);
        setPoints(data.points.toString());
        setTestCases(data.total_test_case.toString());
        setTags(data.tags);
        setError(null);
      } catch (error) {
        console.error("Error fetching challenge details:", error);
        setError("Failed to fetch challenge details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeDetails();
  }, [id]);

  const handleAddTag = () => {
    setTags([...tags, '']);
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);
    const endpoint_url = process.env.REACT_APP_API_BASE_URL;
    
    let data = JSON.stringify({
      "challengeId": id,
      "title": title,
      "link": url,
      "points": parseInt(points),
      "total_test_case": parseInt(testCases),
      "tags": tags
    });
    
    console.log(data);
  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${endpoint_url}/updateChallenge`,
    headers: { 
      'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    navigate("/");
  })
  .catch((error) => {
    console.log(error);
  });


    // UPDATE API

  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Update Challenge</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Challenge Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Challenge URL</label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">Total Points</label>
              <input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="testCases" className="block text-sm font-medium text-gray-700 mb-1">Total Test Cases</label>
              <input
                id="testCases"
                type="number"
                value={testCases}
                onChange={(e) => setTestCases(e.target.value)}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    placeholder={`Tag ${index + 1}`}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Tag
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Challenge
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateChallenge