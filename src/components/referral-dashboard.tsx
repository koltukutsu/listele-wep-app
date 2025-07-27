"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Users, Gift, TrendingUp, Copy, Check, Share2 } from "lucide-react";
import { getReferralStats } from "~/lib/firestore";
import { trackFeatureUsage } from "~/lib/analytics";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { app } from "~/lib/firebase";
import { APP_URL } from "~/lib/config";

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  bonusProjectsEarned: number;
}

export function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const auth = getAuth(app);
  const user = auth.currentUser;

  const referralCode = user ? `REF_${user.uid.slice(-8).toUpperCase()}` : "";
  const referralLink = `${APP_URL}?ref=${referralCode}`;

  useEffect(() => {
    async function loadReferralStats() {
      if (!user) return;
      
      try {
        const referralStats = await getReferralStats(user.uid);
        setStats(referralStats);
      } catch (error) {
        console.error('Error loading referral stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReferralStats();
  }, [user]);

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success("Referans linkiniz panoya kopyalandı! 🎉");
      await trackFeatureUsage('referral_system', 'used', { action: 'copy_link' });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error("Link kopyalanamadı");
    }
  };

  if (loading) {
    return (
      <Card className="border-lime-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="animate-pulse text-gray-900 dark:text-gray-100">Referans verileri yükleniyor...</div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="border-lime-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="text-gray-500 dark:text-gray-400">Referans verileri yüklenemedi</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-lime-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-lime-500" />
            <span className="text-gray-900 dark:text-gray-100">Referans Programı</span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Arkadaşlarını davet et, ikiz karın! Her başarılı davet için +1 proje hakkı kazan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Referral Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Özel Referans Linkin:</label>
              <div className="flex items-center space-x-2 p-3 bg-lime-50 dark:bg-slate-700 rounded-lg border border-lime-200 dark:border-slate-600">
                <input 
                  type="text" 
                  value={referralLink} 
                  readOnly 
                  className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
                />
                <Button
                  onClick={handleCopyReferralLink}
                  size="sm"
                  variant={copiedLink ? "default" : "outline"}
                  className={copiedLink ? "bg-lime-500 hover:bg-lime-600 text-black" : "border-lime-300 dark:border-slate-600 hover:bg-lime-100 dark:hover:bg-slate-600"}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Kopyala
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-lime-50 dark:bg-slate-800 border border-lime-200 dark:border-slate-600 rounded-lg p-4">
              <h4 className="font-medium text-lime-800 dark:text-lime-400 mb-2">📋 Nasıl Çalışır?</h4>
              <ol className="text-sm text-lime-700 dark:text-lime-300 space-y-1 list-decimal list-inside">
                <li>Referans linkini arkadaşlarınla paylaş</li>
                <li>Arkadaşın linke tıklayıp kaydolur</li>
                <li>İlk projesini oluşturduğunda sen +1 proje hakkı kazanırsın</li>
                <li>Arkadaşın da 1 ay ücretsiz Temel plan kullanır!</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Toplam Davet</CardTitle>
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalReferrals}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Paylaştığın link ile
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Başarılı Davet</CardTitle>
            <TrendingUp className="h-4 w-4 text-lime-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">{stats.successfulReferrals}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Proje oluşturan arkadaş
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Bekleyen</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingReferrals}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Henüz proje oluşturmayan
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Bonus Proje</CardTitle>
            <Gift className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">+{stats.bonusProjectsEarned}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kazandığın ekstra hak
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {stats.successfulReferrals > 0 && (
        <Card className="border-lime-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              🏆 Başarıların
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.successfulReferrals >= 1 && (
                <Badge variant="outline" className="border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200 bg-lime-50 dark:bg-lime-900/50">
                  🌟 İlk Referans
                </Badge>
              )}
              {stats.successfulReferrals >= 5 && (
                <Badge variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/50">
                  🚀 Süper Referanscı (5+)
                </Badge>
              )}
              {stats.successfulReferrals >= 10 && (
                <Badge variant="outline" className="border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200 bg-purple-50 dark:bg-purple-900/50">
                  👑 Referans Ustası (10+)
                </Badge>
              )}
              {stats.successfulReferrals >= 25 && (
                <Badge variant="outline" className="border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/50">
                  🔥 Topluluk Lideri (25+)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Goal */}
      <Card className="border-lime-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            🎯 Sonraki Hedefin
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.successfulReferrals === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                İlk referansını yaparak başla! Arkadaşların sana teşekkür edecek 😊
              </p>
              <Button onClick={handleCopyReferralLink} className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black">
                <Share2 className="w-4 h-4 mr-2" />
                Referans Linkini Paylaş
              </Button>
            </div>
          ) : stats.successfulReferrals < 5 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Süper Referanscı olmak için {5 - stats.successfulReferrals} referans daha!
              </p>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-lime-400 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.successfulReferrals / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : stats.successfulReferrals < 10 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Referans Ustası olmak için {10 - stats.successfulReferrals} referans daha!
              </p>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.successfulReferrals / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-lime-600 dark:text-lime-400">
              <p className="font-medium">🎉 Harikasın! Tüm hedefleri tamamladın!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Referans yapmaya devam et, topluluk seni takdir ediyor!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 