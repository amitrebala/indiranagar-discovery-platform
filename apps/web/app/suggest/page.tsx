import { CommunitySuggestionForm } from '@/components/community/CommunitySuggestionForm';

export default function SuggestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suggest a New Place
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help expand our Indiranagar discovery platform by sharing your favorite hidden gems, 
            restaurants, cafes, and unique spots with the community.
          </p>
        </div>
        
        <CommunitySuggestionForm />
        
        <div className="max-w-2xl mx-auto mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-semibold text-blue-900 mb-2">What happens next?</h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Your suggestion will be reviewed by our curation team</p>
            <p>• You&apos;ll receive email updates on the review progress</p>
            <p>• Community members can vote to prioritize suggestions</p>
            <p>• Approved places will be featured with your attribution</p>
            <p>• You&apos;ll be recognized as a community contributor</p>
          </div>
        </div>
      </div>
    </div>
  );
}