'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const verifySchema = z.object({
  provider_id: z.string().uuid().nonempty('Provider ID is required.'),
  ein: z.instanceof(FileList).refine(files => files.length > 0, 'EIN document is required.'),
  incorporation_doc: z.instanceof(FileList).refine(files => files.length > 0, 'Incorporation document is required.'),
});

type VerifyFormInputs = z.infer<typeof verifySchema>;

export default function VerifyProviderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyFormInputs>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: VerifyFormInputs) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('provider_id', data.provider_id);
    formData.append('ein', data.ein[0]);
    formData.append('incorporation_doc', data.incorporation_doc[0]);

    try {
      const response = await fetch('/api/ace/providers/verify-entity', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unexpected error occurred.');
      }

      setSuccess(result.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Verify Provider Entity</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="provider_id" className="block text-sm font-medium text-gray-700">Provider ID</label>
          <input
            id="provider_id"
            type="text"
            {...register('provider_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.provider_id && <p className="text-red-500 text-xs mt-1">{errors.provider_id.message}</p>}
        </div>
        <div>
          <label htmlFor="ein" className="block text-sm font-medium text-gray-700">EIN Document</label>
          <input
            id="ein"
            type="file"
            {...register('ein')}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {errors.ein && <p className="text-red-500 text-xs mt-1">{errors.ein.message}</p>}
        </div>
        <div>
          <label htmlFor="incorporation_doc" className="block text-sm font-medium text-gray-700">Incorporation Document</label>
          <input
            id="incorporation_doc"
            type="file"
            {...register('incorporation_doc')}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {errors.incorporation_doc && <p className="text-red-500 text-xs mt-1">{errors.incorporation_doc.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Uploading...' : 'Upload and Verify'}
        </button>
      </form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {success && <div className="mt-4 text-green-600">{success}</div>}
    </div>
  );
}
