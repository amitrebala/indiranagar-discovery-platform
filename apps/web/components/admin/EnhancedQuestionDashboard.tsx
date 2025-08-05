'use client';

import { useState, useEffect } from 'react';
import { useAdminQuestions } from '@/stores/adminQuestionsStore';
import { 
  Clock, 
  AlertTriangle, 
  Tag, 
  BarChart3,
  MessageSquare,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const EnhancedQuestionDashboard = () => {
  const {
    questions,
    selectedQuestions,
    isLoading,
    error,
    filters,
    fetchQuestions,
    updateQuestion,
    respondToQuestion,
    bulkUpdateStatus,
    deleteQuestion,
    toggleSelection,
    selectAll,
    clearSelection,
    setFilter
  } = useAdminQuestions();

  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    answered: 'bg-green-100 text-green-800',
    published: 'bg-emerald-100 text-emerald-800'
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High</span>;
    if (priority === 'medium') return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Medium</span>;
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Low</span>;
  };

  const filteredQuestions = questions.filter(question => {
    if (filters.status !== 'all' && question.status !== filters.status) return false;
    if (filters.priority !== 'all' && question.priority !== filters.priority) return false;
    if (filters.category !== 'all' && question.category !== filters.category) return false;
    return true;
  });

  const handleRespond = async (id: string) => {
    if (!responseText.trim()) return;
    await respondToQuestion(id, responseText);
    setRespondingTo(null);
    setResponseText('');
  };

  const getStats = () => {
    const total = questions.length;
    const newQuestions = questions.filter(q => q.status === 'new').length;
    const answered = questions.filter(q => q.resolved).length;
    const avgResponseTime = answered > 0 ? 
      questions
        .filter(q => q.response_at)
        .reduce((acc, q) => {
          const created = new Date(q.created_at);
          const responded = new Date(q.response_at!);
          return acc + (responded.getTime() - created.getTime());
        }, 0) / answered / (1000 * 60 * 60 * 24) : 0;
    
    return { total, newQuestions, answered, avgResponseTime };
  };

  const stats = getStats();

  return (
    <div className="enhanced-question-dashboard">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Question Management</h1>
        
        <div className="flex space-x-4">
          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="answered">Answered</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => setFilter('priority', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {selectedQuestions.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => bulkUpdateStatus('answered')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark Answered ({selectedQuestions.length})
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-blue-600">Avg Response Time</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {stats.avgResponseTime ? `${stats.avgResponseTime.toFixed(1)} days` : 'N/A'}
          </p>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-600">New Questions</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">{stats.newQuestions}</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-green-600">Answered</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.answered}</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <Tag className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm text-purple-600">Total Questions</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                    onChange={() => {
                      if (selectedQuestions.length === filteredQuestions.length) {
                        clearSelection();
                      } else {
                        selectAll();
                      }
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="animate-pulse">Loading questions...</div>
                  </td>
                </tr>
              ) : filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No questions found. Enhanced question management system is ready.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => toggleSelection(question.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs">
                        {question.question}
                      </div>
                      {question.response && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Response: {question.response.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs capitalize">
                        {question.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(question.priority)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[question.status]}`}>
                        {question.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(question.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {!question.resolved && (
                          <button
                            onClick={() => setRespondingTo(question.id)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Modal */}
      {respondingTo && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Respond to Question
                </h3>
                <button
                  onClick={() => setRespondingTo(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {questions.find(q => q.id === respondingTo)?.question}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your response..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setRespondingTo(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRespond(respondingTo)}
                  disabled={!responseText.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};