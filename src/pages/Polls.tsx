import React, { useState } from 'react';
import { BarChart3, Plus, Clock, Users, TrendingUp } from 'lucide-react';

interface Poll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  hasVoted: boolean;
  userVote?: string;
}

const Polls: React.FC = () => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'my-polls'>('trending');

  const mockPolls: Poll[] = [
    {
      id: '1',
      question: 'Who will win the Champions League this season?',
      options: [
        { id: '1', text: 'Manchester City', votes: 245 },
        { id: '2', text: 'Real Madrid', votes: 189 },
        { id: '3', text: 'Barcelona', votes: 156 },
        { id: '4', text: 'Bayern Munich', votes: 134 },
      ],
      totalVotes: 724,
      createdBy: 'John Doe',
      createdAt: '2024-01-15T10:00:00Z',
      expiresAt: '2024-01-22T10:00:00Z',
      hasVoted: true,
      userVote: '1',
    },
    {
      id: '2',
      question: 'Best Premier League signing this season?',
      options: [
        { id: '1', text: 'Erling Haaland', votes: 312 },
        { id: '2', text: 'Darwin Nunez', votes: 198 },
        { id: '3', text: 'Gabriel Jesus', votes: 145 },
        { id: '4', text: 'Kalvin Phillips', votes: 89 },
      ],
      totalVotes: 744,
      createdBy: 'Sarah Wilson',
      createdAt: '2024-01-14T15:30:00Z',
      expiresAt: '2024-01-21T15:30:00Z',
      hasVoted: false,
    },
    {
      id: '3',
      question: 'Which team has the best defense in Europe?',
      options: [
        { id: '1', text: 'Liverpool', votes: 167 },
        { id: '2', text: 'Chelsea', votes: 143 },
        { id: '3', text: 'Atletico Madrid', votes: 128 },
        { id: '4', text: 'Inter Milan', votes: 95 },
      ],
      totalVotes: 533,
      createdBy: 'Mike Rodriguez',
      createdAt: '2024-01-13T12:00:00Z',
      expiresAt: '2024-01-20T12:00:00Z',
      hasVoted: true,
      userVote: '1',
    },
  ];

  const [polls, setPolls] = useState(mockPolls);

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId && !poll.hasVoted) {
        const updatedOptions = poll.options.map(option => 
          option.id === optionId 
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
          hasVoted: true,
          userVote: optionId,
        };
      }
      return poll;
    }));
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPollQuestion.trim() && newPollOptions.every(option => option.trim())) {
      const newPoll: Poll = {
        id: Date.now().toString(),
        question: newPollQuestion,
        options: newPollOptions.map((text, index) => ({
          id: (index + 1).toString(),
          text,
          votes: 0,
        })),
        totalVotes: 0,
        createdBy: 'You',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        hasVoted: false,
      };
      setPolls([newPoll, ...polls]);
      setNewPollQuestion('');
      setNewPollOptions(['', '']);
      setShowCreatePoll(false);
    }
  };

  const addOption = () => {
    if (newPollOptions.length < 6) {
      setNewPollOptions([...newPollOptions, '']);
    }
  };

  const removeOption = (index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(newPollOptions.filter((_, i) => i !== index));
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Expired';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Polls</h1>
          <p className="text-gray-600">Vote on sports topics and create your own polls</p>
        </div>
        <button
          onClick={() => setShowCreatePoll(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Poll</span>
        </button>
      </div>

      {/* Create Poll Modal */}
      {showCreatePoll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Poll</h2>
            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="What's your question?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  {newPollOptions.map((option, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updated = [...newPollOptions];
                          updated[index] = e.target.value;
                          setNewPollOptions(updated);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {newPollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {newPollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add option
                  </button>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePoll(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'trending', label: 'Trending', icon: TrendingUp },
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'my-polls', label: 'My Polls', icon: Users },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Polls List */}
      <div className="space-y-6">
        {polls.map((poll) => (
          <div key={poll.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Poll Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{poll.question}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>by {poll.createdBy}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeRemaining(poll.expiresAt)}</span>
                  </div>
                </div>
              </div>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            {/* Poll Options */}
            <div className="space-y-3">
              {poll.options.map((option) => {
                const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                const isUserVote = poll.userVote === option.id;
                
                return (
                  <div key={option.id} className="relative">
                    <button
                      onClick={() => handleVote(poll.id, option.id)}
                      disabled={poll.hasVoted}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        poll.hasVoted
                          ? isUserVote
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-gray-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      } ${poll.hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className={`font-medium ${isUserVote ? 'text-blue-700' : 'text-gray-900'}`}>
                          {option.text}
                        </span>
                        {poll.hasVoted && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{option.votes}</span>
                            <span className={`text-sm font-medium ${isUserVote ? 'text-blue-700' : 'text-gray-700'}`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {poll.hasVoted && (
                        <div className="absolute inset-0 bg-gray-200 rounded-lg overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isUserVote ? 'bg-blue-200' : 'bg-gray-300'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Poll Footer */}
            {poll.hasVoted && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  You voted for "{poll.options.find(o => o.id === poll.userVote)?.text}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No polls yet</h3>
          <p className="text-gray-500 mb-4">Be the first to create a poll and get the community's opinion!</p>
          <button
            onClick={() => setShowCreatePoll(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Poll
          </button>
        </div>
      )}
    </div>
  );
};

export default Polls;