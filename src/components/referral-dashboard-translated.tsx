"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Gift, 
  Copy, 
  Check,
  Share2,
  ExternalLink 
} from "lucide-react";
import { toast } from "sonner";

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  creditsEarned: number;
  referralCode: string;
}

interface ReferralDashboardProps {
  stats: ReferralStats;
}

export default function ReferralDashboard({ stats }: ReferralDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReferralLink(`${window.location.origin}?ref=${stats.referralCode}`);
    }
  }, [stats.referralCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Launch List',
          text: 'Create professional landing pages in minutes!',
          url: referralLink,
        });
      } catch (err) {
        // Fallback to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#D8FF00]/10 to-[#D8FF00]/5 dark:from-[#D8FF00]/20 dark:to-[#D8FF00]/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D8FF00] flex items-center justify-center">
              <Gift className="w-6 h-6 text-black" />
            </div>
            <div>
              <CardTitle className="text-xl text-black dark:text-white">Referral Program</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Invite friends, win together! Get +1 project credit for every successful invitation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Referral Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-black dark:text-white">Your Referral Link</label>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-black dark:text-white"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={shareReferralLink}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg p-4">
              <h4 className="font-medium text-black dark:text-white mb-2">📋 How It Works?</h4>
              <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                <li>Share your referral link with friends</li>
                <li>Your friend clicks the link and signs up</li>
                <li>When they create their first project, you earn +1 project credit</li>
                <li>Your friend also gets 1 month of free Basic plan!</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Invites</CardTitle>
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black dark:text-white">{stats.totalReferrals}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Shared via your link
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Successful Invites</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#D8FF00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#D8FF00]">{stats.successfulReferrals}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Friends who created projects
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingReferrals}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Haven't created projects yet
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Credits Earned</CardTitle>
            <Gift className="h-4 w-4 text-[#D8FF00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#D8FF00]">+{stats.creditsEarned}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Extra project credits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-black dark:text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your latest referral activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.successfulReferrals > 0 ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Great job! You've earned {stats.creditsEarned} project credits
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {stats.successfulReferrals} friends have created their first projects
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                  Active
                </Badge>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-black dark:text-white mb-1">
                  Start inviting friends
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Share your referral link to start earning project credits
                </p>
                <Button
                  onClick={shareReferralLink}
                  size="sm"
                  className="bg-[#D8FF00] hover:bg-[#B8E000] text-black"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card className="border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
        <CardContent className="pt-6">
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Credits are awarded when your referred friend creates their first project</p>
            <p>• Each successful referral gives you +1 project credit</p>
            <p>• Your friend gets 1 month free Basic plan upon creating their first project</p>
            <p>• Credits can be used to create additional projects beyond your plan limit</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}