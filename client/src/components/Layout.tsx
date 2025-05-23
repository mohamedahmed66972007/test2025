
import React, { useState, ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { NavIcons } from "./SubjectIcons";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "./AdminLogin";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, logout } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const getCurrentSection = (): string => {
    if (location === "/" || location.startsWith("/files")) return "files";
    if (location.startsWith("/exams")) return "exams";
    if (location.startsWith("/quizzes") || location.startsWith("/quiz")) return "quizzes";
    return "files";
  };

  const currentSection = getCurrentSection();

  const NavLinks = () => (
    <nav className="flex flex-col gap-2">
      {isAdmin && (
        <Link href="/analytics" className={`px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          currentSection === "analytics" 
            ? "bg-primary/10 text-primary dark:text-primary" 
            : "text-gray-500 dark:text-gray-400"
        }`}>
          <span className="flex items-center space-x-3 space-x-reverse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            <span>التحليلات</span>
          </span>
        </Link>
      )}
      <Link href="/files" onClick={() => setOpenMobile(false)} className={`px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          currentSection === "files" 
            ? "bg-primary/10 text-primary dark:text-primary" 
            : "text-gray-500 dark:text-gray-400"
        }`}>
          <span className="flex items-center space-x-3 space-x-reverse">
            <NavIcons.files className="text-xl" />
            <span>الملفات</span>
          </span>
      </Link>

      <Link href="/exams" onClick={() => setOpenMobile(false)} className={`px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          currentSection === "exams" 
            ? "bg-primary/10 text-primary dark:text-primary" 
            : "text-gray-500 dark:text-gray-400"
        }`}>
          <span className="flex items-center space-x-3 space-x-reverse">
            <NavIcons.exams className="text-xl" />
            <span>جدول الاختبارات</span>
          </span>
      </Link>

      <Link href="/quizzes" onClick={() => setOpenMobile(false)} className={`px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          currentSection === "quizzes" 
            ? "bg-primary/10 text-primary dark:text-primary" 
            : "text-gray-500 dark:text-gray-400"
        }`}>
          <span className="flex items-center space-x-3 space-x-reverse">
            <NavIcons.quizzes className="text-xl" />
            <span>اختبارات الكترونية</span>
          </span>
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl sm:text-2xl font-bold text-primary dark:text-primary-foreground">دفعة 2026</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="تبديل الوضع الليلي"
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {!isAdmin ? (
              <Button onClick={() => setShowAdminLogin(true)} className="flex items-center space-x-1 space-x-reverse">
                <User className="h-4 w-4 ml-2" />
                <span className="hidden sm:inline">تسجيل دخول المشرف</span>
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={logout} 
                className="flex items-center space-x-1 space-x-reverse"
              >
                <LogOut className="h-4 w-4 ml-2" />
                <span className="hidden sm:inline">تسجيل خروج</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-l dark:border-gray-700 p-4">
          <NavLinks />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Admin Login Modal */}
      <AdminLogin 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
      />
    </div>
  );
};

export default Layout;
