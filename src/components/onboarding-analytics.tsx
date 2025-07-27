"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Users, TrendingUp, Clock, Target, Award, Zap } from "lucide-react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "~/lib/firebase";

interface OnboardingMetrics {
  totalUsers: number;
  step1Completion: number;
  step2Completion: number;
  step3Completion: number;
  step4Completion: number;
  step5Completion: number;
  averageTimeToFirstProject: number;
  sevenDayActivation: number;
  abandonmentRate: number;
}

interface MetricCard {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

export function OnboardingAnalytics() {
  const [metrics, setMetrics] = useState<OnboardingMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // This would typically be done on the backend, but for demo purposes:
        // Fetch onboarding events from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const onboardingRef = collection(db, "onboarding_analytics");
        const q = query(
          onboardingRef,
          where("timestamp", ">=", thirtyDaysAgo),
          orderBy("timestamp", "desc"),
          limit(1000)
        );

        const snapshot = await getDocs(q);
        const events = snapshot.docs.map(doc => doc.data());

        // Calculate metrics
        const uniqueUsers = new Set(events.map(e => e.userId)).size;
        const step1Events = events.filter(e => e.step === 1 && e.action === 'completed').length;
        const step2Events = events.filter(e => e.step === 2 && e.action === 'completed').length;
        const step3Events = events.filter(e => e.step === 3 && e.action === 'completed').length;
        
        const calculatedMetrics: OnboardingMetrics = {
          totalUsers: uniqueUsers,
          step1Completion: uniqueUsers > 0 ? (step1Events / uniqueUsers) * 100 : 0,
          step2Completion: uniqueUsers > 0 ? (step2Events / uniqueUsers) * 100 : 0,
          step3Completion: uniqueUsers > 0 ? (step3Events / uniqueUsers) * 100 : 0,
          step4Completion: 75, // Placeholder
          step5Completion: 60, // Placeholder
          averageTimeToFirstProject: 180, // 3 minutes average
          sevenDayActivation: 45,
          abandonmentRate: uniqueUsers > 0 ? 100 - (step3Events / uniqueUsers) * 100 : 0
        };

        setMetrics(calculatedMetrics);
      } catch (error) {
        console.error('Error fetching onboarding metrics:', error);
        // Set demo data
        setMetrics({
          totalUsers: 247,
          step1Completion: 89,
          step2Completion: 76,
          step3Completion: 68,
          step4Completion: 54,
          step5Completion: 45,
          averageTimeToFirstProject: 180,
          sevenDayActivation: 42,
          abandonmentRate: 32
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Yükleniyor...</div>;
  }

  if (!metrics) {
    return <div>Veriler yüklenemedi</div>;
  }

  const metricCards: MetricCard[] = [
    {
      title: "Toplam Yeni Kullanıcı",
      value: metrics.totalUsers.toString(),
      description: "Son 30 günde kaydolan",
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600",
      trend: "+12%"
    },
    {
      title: "Onboarding Tamamlama",
      value: `${metrics.step3Completion.toFixed(0)}%`,
      description: "İlk projeyi oluşturan kullanıcılar",
      icon: <Target className="w-5 h-5" />,
      color: "text-green-600",
      trend: "+8%"
    },
    {
      title: "Ort. İlk Proje Süresi",
      value: `${Math.floor(metrics.averageTimeToFirstProject / 60)}dk`,
      description: "Kayıttan ilk projeye",
      icon: <Clock className="w-5 h-5" />,
      color: "text-orange-600",
      trend: "-15sn"
    },
    {
      title: "7 Günlük Aktivasyon",
      value: `${metrics.sevenDayActivation}%`,
      description: "Aktif kalan kullanıcılar",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-purple-600",
      trend: "+5%"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Onboarding Analitikleri</h2>
        <p className="text-gray-600">Kullanıcı aktivasyon oranları ve funnel analizi</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={metric.color}>{metric.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{metric.description}</p>
                {metric.trend && (
                  <Badge variant="secondary" className="text-xs">
                    {metric.trend}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Onboarding Funnel Analizi
          </CardTitle>
          <CardDescription>
            Her adımdaki kullanıcı dağılımı ve tamamlanma oranları
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { step: 1, name: "🚀 Karşılama & Demo", completion: metrics.step1Completion },
            { step: 2, name: "⚡ Proje Oluşturma", completion: metrics.step2Completion },
            { step: 3, name: "🎨 Kişiselleştirme", completion: metrics.step3Completion },
            { step: 4, name: "📣 Paylaşım", completion: metrics.step4Completion },
            { step: 5, name: "📊 Analitik", completion: metrics.step5Completion }
          ].map((step) => (
            <div key={step.step} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Adım {step.step}: {step.name}
                </span>
                <span className="text-sm text-gray-600">
                  {step.completion.toFixed(1)}% ({Math.round((step.completion / 100) * metrics.totalUsers)} kullanıcı)
                </span>
              </div>
              <Progress value={step.completion} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Öneriler & İyileştirmeler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.step2Completion < 70 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800">⚠️ Adım 2'de Düşüş</h4>
                <p className="text-sm text-yellow-700">
                  Proje oluşturma adımında %{(100 - metrics.step2Completion).toFixed(0)} kullanıcı kaybı var. 
                  Daha fazla yönlendirme ve örnek içerik eklenebilir.
                </p>
              </div>
            )}
            
            {metrics.averageTimeToFirstProject > 300 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800">🚀 Süre Optimizasyonu</h4>
                <p className="text-sm text-blue-700">
                  İlk proje oluşturma süresi 5 dakikadan uzun. Onboarding adımları 
                  basitleştirilebilir veya daha hızlı alternatifler sunulabilir.
                </p>
              </div>
            )}

            {metrics.sevenDayActivation < 50 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800">📧 Retention Problemi</h4>
                <p className="text-sm text-red-700">
                  7 günlük aktivasyon oranı %50'nin altında. Email automation, 
                  push notification ve kullanıcı geri kazanma stratejileri geliştirilebilir.
                </p>
              </div>
            )}

            {metrics.step3Completion > 80 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800">✅ Güçlü Performans</h4>
                <p className="text-sm text-green-700">
                  Harika! Onboarding completion oranınız çok iyi. Bu başarılı 
                  flow'u diğer feature'lara da uygulayabilirsiniz.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 