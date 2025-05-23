import React, { useState } from "react";
import { useQuizzes } from "@/hooks/useQuizzes";
import QuizCard from "@/components/QuizCard";
import CreateQuizModal from "@/components/CreateQuizModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";

const Quizzes: React.FC = () => {
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { quizzes, isLoading, error, searchQuizByCode } = useQuizzes();
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchQuizByCode(searchQuery);
    } else {
      // If search is empty, fetch all quizzes
      searchQuizByCode("");
    }
  };
  
  // Handle real-time search as user types
  React.useEffect(() => {
    // Add a small delay to avoid too many requests while typing
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);
    
    // Clear timeout on cleanup
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">الاختبارات التفاعلية</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Quiz */}
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="ابحث عن اختبار بالرمز"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            <Search className="h-4 w-4 absolute right-3 text-muted-foreground" />
          </div>
          
          {/* Create Quiz Button */}
          <Button 
            variant="default" 
            className="bg-secondary hover:bg-secondary/90 flex items-center space-x-1 space-x-reverse"
            onClick={() => setShowCreateQuizModal(true)}
          >
            <PlusIcon className="h-4 w-4 ml-2" />
            <span>إنشاء اختبار جديد</span>
          </Button>
        </div>
      </div>
      
      {/* Quizzes Grid */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="mt-4">جاري تحميل الاختبارات...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">
          <p>حدث خطأ أثناء تحميل الاختبارات. يرجى المحاولة مرة أخرى.</p>
        </div>
      ) : quizzes && quizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">لا توجد اختبارات متاحة حالياً</p>
          <Button onClick={() => setShowCreateQuizModal(true)} variant="outline" className="mt-4">
            إنشاء اختبار جديد
          </Button>
        </div>
      )}
      
      {/* Create Quiz Modal */}
      <CreateQuizModal 
        isOpen={showCreateQuizModal} 
        onClose={() => setShowCreateQuizModal(false)} 
      />
    </div>
  );
};

export default Quizzes;
