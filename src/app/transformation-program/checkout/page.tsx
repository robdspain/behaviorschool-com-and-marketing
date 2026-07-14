import type { Metadata } from 'next';
import { TransformationCheckoutClient } from './TransformationCheckoutClient';

export const metadata: Metadata = {
  title: 'Transformation Program Checkout | Behavior School',
  description: 'Private checkout access for the School BCBA Transformation Program.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <TransformationCheckoutClient />;
}
