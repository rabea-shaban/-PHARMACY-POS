import React from 'react';
import { PageHeader } from '../components/common/PageHeader.js';
import { StatCard } from '../components/common/StatCard.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { DollarSign, ShoppingBag, Store, Globe, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة التحكم والعمليات"
        description="نظرة عامة على مؤشرات الأداء، المبيعات اليومية، والطلبات"
        actions={
          <Link to="/pos">
            <Button variant="primary" leftIcon={<ShoppingCart className="w-4 h-4" />}>
              فتح شاشة البيع (POS)
            </Button>
          </Link>
        }
      />

      {/* KPI Cards Grid using Exact Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="إجمالي المبيعات (Total Sales)"
          value="24,850 EGP"
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 12.5, isPositive: true }}
          cardType="totalSales"
        />
        <StatCard
          title="مبيعات الصيدلية (In-Store)"
          value="18,320 EGP"
          icon={<Store className="w-5 h-5" />}
          trend={{ value: 6.4, isPositive: true }}
          cardType="inStore"
        />
        <StatCard
          title="مبيعات الأونلاين (Online Sales)"
          value="6,530 EGP"
          icon={<Globe className="w-5 h-5" />}
          trend={{ value: 18.2, isPositive: true }}
          cardType="online"
        />
        <StatCard
          title="إجمالي الطلبات (Total Orders)"
          value="142 طلب"
          subtitle="متوسط السلة: 175 EGP"
          icon={<ShoppingBag className="w-5 h-5" />}
          cardType="orders"
        />
      </div>

      {/* Overview Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl border-[#D5E6E5] bg-[#F7FCFC]">
          <CardHeader>
            <CardTitle className="text-[#0B3031]">حركة المبيعات الأسبوعية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-10 text-center text-[#557274] text-sm">
              سيتم دمج رسوم Recharts البيانية بألوان (Mint, Coral, Lime, Purple, Cyan) في مرحلة F04.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#D5E6E5] bg-[#F7FCFC]">
          <CardHeader>
            <CardTitle className="text-[#0B3031]">الأدوية الأكثر طلباً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-10 text-center text-[#557274] text-sm">
              سيتم عرض قائمة الأصناف الأكثر مبيعاً ونواقص المخزون في مرحلة F04.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
