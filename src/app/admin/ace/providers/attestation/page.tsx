'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const attestationSchema = z.object({
  provider_id: z.string().uuid().nonempty('Provider ID is required.'),
  signature: z.string().nonempty('Signature is required.'),
});

type AttestationFormInputs = z.infer<typeof attestationSchema>;

export default function AttestationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<AttestationFormInputs>({
    resolver: zodResolver(attestationSchema),
  });

  const onSubmit = async (data: AttestationFormInputs) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // In a real app, the signature would be captured from a signature pad component.
    // For this example, we'll take the text input and convert it to a base64 string
    // to simulate an image upload.
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText(data.signature, 50, 100);
    }
    const signatureDataUrl = canvas.toDataURL('image/png');
    const signatureBase64 = signatureDataUrl.split(',')[1];

    try {
      const response = await fetch('/api/ace/providers/leadership-attestation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: data.provider_id,
          signature: signatureBase64,
        }),
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
      <h1 className="text-2xl font-bold mb-4">Leadership Attestation</h1>
      <p className="mb-4 text-sm text-gray-600">
        Please provide your digital signature to attest to the validity of the information provided.
        In a real application, this would be a signature pad. For now, please type your name.
      </p>
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
          <label htmlFor="signature" className="block text-sm font-medium text-gray-700">Signature</label>
          <textarea
            id="signature"
            {...register('signature')}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Type your full name"
          />
          {errors.signature && <p className="text-red-500 text-xs mt-1">{errors.signature.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Attestation'}
        </button>
      </form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {success && <div className="mt-4 text-green-600">{success}</div>}
    </div>
  );
}
