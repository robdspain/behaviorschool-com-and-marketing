'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Mail } from 'lucide-react';

interface NewsletterSignupProps {
  source?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
  variant?: 'default' | 'inline' | 'card';
  showNameField?: boolean;
}

export function NewsletterSignup({
  source = 'website',
  title = 'Subscribe to our newsletter',
  description = 'Get the latest updates on behavior analysis tools and resources.',
  buttonText = 'Subscribe',
  successMessage = 'Successfully subscribed! Check your email for confirmation.',
  className = '',
  variant = 'default',
  showNameField = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/ghost-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: showNameField ? name : undefined,
          source,
          honeypot, // Anti-spam field
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || successMessage);
        setEmail('');
        setName('');
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot field for spam protection (hidden) */}
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />
      
      {showNameField && (
        <Input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      )}
      
      <div className={variant === 'inline' ? 'flex gap-2' : 'space-y-3'}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="flex-1"
        />
        
        <Button
          type="submit"
          disabled={isLoading || status === 'success'}
          className={variant === 'inline' ? '' : 'w-full'}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Subscribed!
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
      </div>
      
      {message && (
        <div
          className={`text-sm flex items-center gap-2 ${
            status === 'error' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {status === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          {message}
        </div>
      )}
    </form>
  );

  if (variant === 'card') {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {formContent}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`${className}`}>
      {variant === 'default' && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      {formContent}
    </div>
  );
}

// Simplified inline version for hero sections
export function NewsletterSignupInline({
  source = 'hero',
  buttonText = 'Get Early Access',
  placeholder = 'Enter your email',
  className = '',
}: {
  source?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ghost-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
        className={`flex-1 ${status === 'error' ? 'border-red-500' : ''}`}
      />
      <Button
        type="submit"
        disabled={isLoading || status === 'success'}
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === 'success' ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
}