import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";

export default function Analytics() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة التحليلات</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات عامة</CardTitle>
          </CardHeader>
          <CardContent>
            <p>عدد الزيارات اليومية</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}