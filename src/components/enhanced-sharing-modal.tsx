"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Copy, Check, MessageCircle, Share2, Sparkles, Heart, Target, Rocket, Users, Gift } from "lucide-react";
import { toast } from "sonner";
import { trackFeatureUsage } from "~/lib/analytics";

interface EnhancedSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectUrl: string;
  projectName: string;
}

export function EnhancedSharingModal({ isOpen, onClose, projectUrl, projectName }: EnhancedSharingModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sharingMessages = [
    {
      icon: <Rocket className="w-4 h-4 text-blue-500" />,
      title: "Exciting Start",
      message: `🚀 My new startup project is ready! What do you think about "${projectName}"? Your feedback is very valuable: ${projectUrl}`
    },
    {
      icon: <Heart className="w-4 h-4 text-red-500" />,
      title: "Warm and Personal",
      message: `❤️ I can finally share the project I've been working on for a long time! Your opinion is very important to me: ${projectUrl}`
    },
    {
      icon: <Target className="w-4 h-4 text-green-500" />,
      title: "Feedback Focused",
      message: `🎯 I'm looking for my first customers and I'm curious about your thoughts! Can you take 2 minutes to look? ${projectUrl}`
    },
    {
      icon: <Users className="w-4 h-4 text-purple-500" />,
      title: "Community Support",
      message: `👥 A new milestone in my entrepreneurial journey! Would you like to be one of my supporters? ${projectUrl}`
    },
    {
      icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
      title: "Inspiring",
      message: `✨ I've brought my dream project to life! I need your energy on this journey too: ${projectUrl}`
    },
    {
      icon: <MessageCircle className="w-4 h-4 text-cyan-500" />,
      title: "Conversation Starter",
      message: `💬 Would you like to chat about my new project? You can take a quick look during your coffee break: ${projectUrl}`
    },
    {
      icon: <Gift className="w-4 h-4 text-pink-500" />,
      title: "Value Emphasis",
      message: `🎁 I've prepared something special for you! This project is for valuable people like you: ${projectUrl}`
    },
    {
      icon: <Share2 className="w-4 h-4 text-indigo-500" />,
      title: "Sharing Encouragement",
      message: `🔄 If you like it, you can also recommend it to your friends! Here's a look at my project: ${projectUrl}`
    },
    {
      icon: <Target className="w-4 h-4 text-orange-500" />,
      title: "Professional Approach",
      message: `🎯 I've brought my business idea to life and I want to get your professional opinion. Your evaluation is important: ${projectUrl}`
    },
    {
      icon: <Rocket className="w-4 h-4 text-emerald-500" />,
      title: "Success Focused",
      message: `🚀 I have big goals with this project! I would really like you to be one of my first supporters: ${projectUrl}`
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      toast.success("Project link copied! 📋");
      await trackFeatureUsage('project_sharing', 'used', { method: 'link_only' });
    } catch (error) {
      toast.error("Link could not be copied");
    }
  };

  const handleCopyMessage = async (message: string, index: number, title: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedIndex(index);
      toast.success(`"${title}" message copied! 📱`);
      await trackFeatureUsage('project_sharing', 'used', { 
        method: 'message_template',
        messageType: title.toLowerCase().replace(' ', '_')
      });
      
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error("Message could not be copied");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 border-lime-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-lime-500" />
            <span className="text-gray-900 dark:text-gray-100">Share Your Project</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            You can use our ready-made messages to share your project effectively.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Direct Link Copy Section */}
          <div className="bg-lime-50 dark:bg-slate-800 rounded-lg p-4 border-2 border-dashed border-lime-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Copy Link Only</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share your project link directly</p>
              </div>
              <Button onClick={handleCopyLink} variant="outline" size="sm" className="border-lime-300 dark:border-slate-600 hover:bg-lime-100 dark:hover:bg-slate-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
            <div className="mt-3 p-2 bg-white dark:bg-slate-700 rounded border border-lime-200 dark:border-slate-600 text-sm text-gray-700 dark:text-gray-300 break-all">
              {projectUrl}
            </div>
          </div>

          {/* Sharing Messages Section */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-lime-500" />
              Ready Sharing Messages
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              You can select and copy one of the messages below. Each message contains your project link.
            </p>

            <div className="grid gap-3">
              {sharingMessages.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {item.title}
                          </h4>
                          <Button
                            onClick={() => handleCopyMessage(item.message, index, item.title)}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-lime-100 dark:hover:bg-slate-700"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3 h-3 mr-1 text-lime-500" />
                                <span className="text-lime-500 text-xs">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                <span className="text-xs">Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-lime-50 dark:bg-slate-800 rounded-lg p-4 border border-lime-200 dark:border-slate-600">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-lime-500" />
              </div>
              <div>
                <h4 className="font-medium text-lime-800 dark:text-lime-400 mb-2">💡 Sharing Tips</h4>
                <ul className="text-sm text-lime-700 dark:text-lime-300 space-y-1">
                  <li>• <strong>WhatsApp</strong> - More personal messages are more effective</li>
                  <li>• <strong>LinkedIn</strong> - Prefer a professional approach</li>
                  <li>• <strong>Email</strong> - Use personal and detailed messages</li>
                  <li>• Share at the right time - business hours give better results</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button onClick={onClose} variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 