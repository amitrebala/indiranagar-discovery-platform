import PlaceForm from '@/components/admin/PlaceForm';

export default function NewPlacePage() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Place
        </h1>
        <PlaceForm />
      </div>
    </div>
  );
}