
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <CheckCircle className="w-24 h-24 mx-auto text-emerald-500 mb-8" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Congratulations & Welcome!
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-12">
          You&apos;ve made a fantastic decision to join the Transformation Program. We are thrilled to have you on board and can&apos;t wait to see you achieve amazing results.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-2xl px-8 sm:px-10 h-14 sm:h-16 text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          <Link href="https://buy.stripe.com/bJe00i82o6Ss72seBw6Vq00">
            Proceed to Checkout
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
