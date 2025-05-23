import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuizzes } from "@/hooks/useQuizzes";
import { generateQuizPDF } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSubjectName } from "@/components/SubjectIcons";
import { 
  BarChart3, 
  FileText, 
  ArrowLeft, 
  Calendar, 
  User,
  Download 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QuizResults = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { quiz, attempts, isLoadingQuiz, isLoadingAttempts, quizError, attemptsError } = useQuizzes(parseInt(id));
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("attempts");

  const handleExportPDF = () => {
    if (!quiz) return;
    
    try {
      const pdfBlob = generateQuizPDF(
        quiz.title,
        getSubjectName(quiz.subject as any),
        quiz.creator,
        quiz.questions as any
      );
      
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quiz.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "تم تصدير الاختبار",
        description: "تم تصدير الاختبار بصيغة PDF بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تصدير الاختبار",
        variant: "destructive",
      });
    }
  };

  if (isLoadingQuiz || isLoadingAttempts) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        <p className="mt-4">جاري تحميل النتائج...</p>
      </div>
    );
  }

  if (quizError || attemptsError || !quiz) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">حدث خطأ أثناء تحميل الاختبار أو النتائج.</p>
        <Button onClick={() => navigate("/quizzes")} className="mt-4">
          العودة إلى الاختبارات
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAverageScore = () => {
    if (!attempts || attempts.length === 0) return 0;
    
    const sum = attempts.reduce((acc, attempt) => acc + attempt.score, 0);
    return (sum / attempts.length).toFixed(1);
  };

  const getSuccessRate = () => {
    if (!attempts || attempts.length === 0) return 0;
    
    const successfulAttempts = attempts.filter(
      attempt => (attempt.score / attempt.maxScore) >= 0.5
    ).length;
    
    return Math.round((successfulAttempts / attempts.length) * 100);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">نتائج الاختبار</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate("/quizzes")}
          className="flex items-center space-x-1 space-x-reverse"
        >
          <ArrowLeft className="h-4 w-4 ml-1" />
          <span>العودة للاختبارات</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500 dark:text-gray-400">
              متوسط النتيجة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{getAverageScore()}</p>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500 dark:text-gray-400">
              عدد الإجابات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{attempts.length}</p>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500 dark:text-gray-400">
              نسبة النجاح
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{getSuccessRate()}%</p>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                المادة: {getSubjectName(quiz.subject as any)} | المنشئ: {quiz.creator}
              </p>
            </div>
            
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="attempts" className="w-full">المحاولات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attempts">
          <Card>
            <CardHeader>
              <CardTitle>محاولات الطلاب</CardTitle>
            </CardHeader>
            <CardContent>
              {attempts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="py-3 px-4 text-right">الاسم</th>
                        <th className="py-3 px-4 text-right">النتيجة</th>
                        <th className="py-3 px-4 text-right">النسبة المئوية</th>
                        <th className="py-3 px-4 text-right">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((attempt) => (
                        <tr key={attempt.id} className="border-b dark:border-gray-700">
                          <td className="py-3 px-4">{attempt.name}</td>
                          <td className="py-3 px-4">
                            {attempt.score} / {attempt.maxScore}
                          </td>
                          <td className="py-3 px-4">
                            {Math.round((attempt.score / attempt.maxScore) * 100)}%
                          </td>
                          <td className="py-3 px-4">
                            {formatDate(attempt.createdAt.toString())}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                  لا توجد محاولات بعد لهذا الاختبار
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>أسئلة الاختبار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array.isArray(quiz.questions) && quiz.questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">السؤال {index + 1}: {question.question}</h3>
                    <ul className="space-y-2 mr-6">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} className="flex items-center">
                          <span className={`inline-block w-5 h-5 rounded-full mr-2 ${
                            optionIndex === question.correctAnswer 
                              ? "bg-green-500" 
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}></span>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizResults;
