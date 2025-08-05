'use client';

import { useState } from 'react';
import { Clock, AlertTriangle, Tag, BarChart3 } from 'lucide-react';

interface CommunityQuestion {
  id: string;
  question_text: string;
  category: string;
  priority_score: number;
  response_time_sla: number;
  status: 'new' | 'in-progress' | 'answered' | 'published';
  created_at: string;
  analytics: {
    view_count: number;
    helpfulness_rating: number;
  };
}

export const EnhancedQuestionDashboard = () => {
  const [questions] = useState<CommunityQuestion[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'sla'>('priority');

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    answered: 'bg-green-100 text-green-800',
    published: 'bg-emerald-100 text-emerald-800'
  };

  const getPriorityBadge = (score: number) => {
    if (score >= 80) return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High</span>;
    if (score >= 50) return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Medium</span>;
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Low</span>;
  };

  return (
    <div className="enhanced-question-dashboard">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Question Management</h1>
        
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Questions</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="answered">Answered</option>
            <option value="published">Published</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'date' | 'sla')}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="priority">Priority</option>
            <option value="date">Date</option>
            <option value="sla">SLA</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-blue-600">Avg Response Time</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">2.4 days</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-green-600">High Priority</span>
          </div>
          <p className="text-2xl font-bold text-green-900">12</p>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center">
            <Tag className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-600">Categories</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">8</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm text-purple-600">Satisfaction</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">94%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No questions found. Enhanced question management system is ready.
                  </td>
                </tr>
              ) : (
                questions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {question.question_text}
                      </div>
                      <div className="text-xs text-gray-500">
                        Views: {question.analytics.view_count} | Rating: {question.analytics.helpfulness_rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs capitalize">
                        {question.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(question.priority_score)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[question.status]}`}>
                        {question.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {question.response_time_sla}h
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-yellow-600 hover:text-yellow-900 text-sm">
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};