import React from 'react';
import { PageHeader } from '../components/common/PageHeader.js';
import { StatCard } from '../components/common/StatCard.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { DollarSign, ShoppingBag, AlertTriangle, Clock, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة التحكم الرئيسية"
        description="نظرة عامة على مؤشرات الأداء، المبيعات اليومية، وحالة المخزون"
        actions={
          <Link to="/pos">
            <Button variant="primary" leftIcon={<ShoppingCart className="w-4 h-4" />}>
              فتح شاشة البيع (POS)
            </Button>
          </Link>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="مبيعات اليوم"
          value="4,850 EGP"
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 12.5, isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="عدد الفواتير المكتملة"
          value="38 فاتورة"
          icon={<ShoppingBag className="w-5 h-5" />}
          trend={{ value: 8.2, isPositive: true }}
          color="cyan"
        />
        <StatCard
          title="نواقص المخزون (Low Stock)"
          value="4 أصناف"
          subtitle="أصناف قاربت على النفاد"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="rose"
        />
        <StatCard
          title="أفق الصلاحية (Near Expiry)"
          value="6 تشغيلات"
          subtitle="تنتهي خلال 90 يوماً"
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Overview Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>أحدث المعاملات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-slate-400 text-sm">
              سيتم عرض الرسم البياني وجدول الفواتير في مرحلة Dashboard المخصصة (F04).
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأدوية الأكثر مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-slate-400 text-sm">
              سيتم عرض قائمة الأصناف الأكثر طلباً ومعدلات الدوران في مرحلة (F04).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
