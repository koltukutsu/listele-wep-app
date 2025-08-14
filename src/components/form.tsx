"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { trackConversion } from "~/lib/analytics";

interface FormProps {
  projectId: string;
}

export default function WaitlistForm({ projectId }: FormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      // Simulate API call delay
      setTimeout(async () => {
        // Simulate duplicate email check (10% chance)
        if (Math.random() < 0.1) {
          toast.error("This email is already on the list!");
          setLoading(false);
          return;
        }

        // Track conversion for successful signup
        await trackConversion('waitlist_signup', 1, {
          project_id: projectId,
          email_domain: email.split('@')[1],
          signup_source: 'demo_form'
        });

        toast.success("Thank you for joining the waitlist! 🎉");
        setEmail("");
        setSuccess(true);
        setLoading(false);
        
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [
              "#ff0000",
              "#00ff00",
              "#0000ff",
              "#ffff00",
              "#ff00ff",
              "#00ffff",
            ],
          });
        }, 100);
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again 😢.");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <AnimatePresence>
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={handleChange}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
              >
                {loading ? "Saving..." : "Join List"}
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              We don't send spam. You can unsubscribe anytime.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-4"
          >
            <div className="text-6xl">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900">
              Great! You've joined the list!
            </h3>
            <p className="text-gray-600">
              We'll send important updates via email.
            </p>
            <button
              onClick={resetForm}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Add another email
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
