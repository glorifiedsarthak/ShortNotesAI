import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, 
  Menu, 
  X, 
  Search, 
  Download, 
  Bookmark, 
  ChevronRight, 
  ArrowLeft,
  Home,
  Atom,
  Calculator,
  Globe,
  PenTool
} from 'lucide-react';

import { SUBJECTS, CHAPTERS } from './constants';
import { Chapter, Subject, SubjectId } from './types';
import { generateNoteContent } from './services/geminiService';
import { getCachedNote, saveNoteToCache, toggleBookmark, getBookmarks } from './services/storageService';
import Loading from './components/Loading';

// --- Icons Mapping ---
const Icons: Record<string, React.FC<any>> = {
  Atom: Atom,
  Calculator: Calculator,
  Globe: Globe,
  BookOpen: BookOpen,
  PenTool: PenTool
};

// --- Components ---

const Header: React.FC<{ 
  toggleSidebar: () => void, 
  title: string,
  showBack?: boolean
}> = ({ toggleSidebar, title, showBack }) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack ? (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500 truncate">
              {title}
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
};

const Sidebar: React.FC<{ 
  isOpen: boolean, 
  close: () => void 
}> = ({ isOpen, close }) => {
  const location = useLocation();
  const activeSubjectId = location.pathname.split('/')[2]; // /subject/:id

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={close}
        />
      )}
      
      {/* Drawer */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl lg:translate-x-0 lg:static lg:shadow-none lg:border-r border-slate-200 lg:h-[calc(100vh-4rem)] lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <span className="font-bold text-slate-800">Menu</span>
          <button onClick={close} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-full pb-20">
          <Link 
            to="/" 
            onClick={close}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>

          <Link 
            to="/bookmarks" 
            onClick={close}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/bookmarks' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Bookmark className="w-5 h-5" />
            My Bookmarks
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Subjects</p>
          </div>

          {SUBJECTS.map(subject => {
            const Icon = Icons[subject.icon] || BookOpen;
            const isActive = activeSubjectId === subject.id;
            
            return (
              <Link
                key={subject.id}
                to={`/subject/${subject.id}`}
                onClick={close}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-200/50 text-indigo-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {subject.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>(getBookmarks());

  // Filter chapters based on search
  const filteredChapters = CHAPTERS.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    SUBJECTS.find(s => s.id === c.subjectId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3 py-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Master Class 10 <span className="text-indigo-600">Smartly</span>
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          AI-generated, exam-ready notes for Science, Math, English, and Social Studies. Updated for NCERT syllabus.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-shadow"
          placeholder="Search for chapters or topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChapters.map(chapter => {
               const subject = SUBJECTS.find(s => s.id === chapter.subjectId);
               return (
                 <Link 
                  key={chapter.id} 
                  to={`/read/${chapter.id}`}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-indigo-200 transition-all group"
                 >
                   <div>
                     <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${subject?.color.replace('bg-', 'bg-opacity-10 text-').replace('500', '700')} bg-slate-100 mb-2 inline-block`}>
                       {subject?.name}
                     </span>
                     <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700">{chapter.title}</h4>
                   </div>
                   <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                 </Link>
               );
            })}
            {filteredChapters.length === 0 && (
              <p className="text-slate-500 col-span-2 text-center py-8">No chapters found matching "{searchTerm}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBJECTS.map(subject => {
            const Icon = Icons[subject.icon] || BookOpen;
            return (
              <Link 
                key={subject.id} 
                to={`/subject/${subject.id}`}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 p-16 -mr-8 -mt-8 rounded-full opacity-5 ${subject.color}`}></div>
                <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-4 ${subject.color} text-white shadow-lg shadow-indigo-500/20`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{subject.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{subject.description}</p>
                
                <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  Explore <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Access Bookmarks on Dashboard if any */}
      {bookmarks.length > 0 && !searchTerm && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
              Your Quick Access
            </h3>
            <Link to="/bookmarks" className="text-sm text-indigo-600 font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHAPTERS.filter(c => bookmarks.slice(0, 3).includes(c.id)).map(chapter => (
              <Link 
                key={chapter.id} 
                to={`/read/${chapter.id}`}
                className="block p-4 bg-amber-50 border border-amber-100 rounded-xl hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-slate-800 truncate">{chapter.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{SUBJECTS.find(s => s.id === chapter.subjectId)?.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SubjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const subject = SUBJECTS.find(s => s.id === id);
  const chapters = CHAPTERS.filter(c => c.subjectId === id);

  if (!subject) return <div className="p-8 text-center text-red-500">Subject not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className={`relative overflow-hidden rounded-2xl p-8 ${subject.color} text-white shadow-lg`}>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">{subject.name}</h2>
          <p className="text-white/90 text-lg">{subject.description}</p>
        </div>
        {/* Background decorative circle */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 px-1">Chapters ({chapters.length})</h3>
        <div className="grid grid-cols-1 gap-3">
          {chapters.map((chapter, idx) => (
            <Link 
              key={chapter.id}
              to={`/read/${chapter.id}`}
              className="group flex items-center p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg text-sm font-bold mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {idx + 1}
              </span>
              <span className="flex-grow font-medium text-slate-700 group-hover:text-slate-900">{chapter.title}</span>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const BookmarksView: React.FC = () => {
  const [bookmarkedIds] = useState<string[]>(getBookmarks());
  const bookmarkedChapters = CHAPTERS.filter(c => bookmarkedIds.includes(c.id));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Bookmark className="w-6 h-6 text-indigo-600" />
        Saved Notes
      </h2>
      
      {bookmarkedChapters.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700">No bookmarks yet</h3>
          <p className="text-slate-500 mt-1">Save important chapters here for quick revision.</p>
          <Link to="/" className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors">
            Browse Subjects
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarkedChapters.map(chapter => {
            const subject = SUBJECTS.find(s => s.id === chapter.subjectId);
            return (
              <Link 
                key={chapter.id}
                to={`/read/${chapter.id}`}
                className="flex flex-col p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-lg hover:border-indigo-300 transition-all group"
              >
                 <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${subject?.color.replace('bg-', 'bg-opacity-10 text-').replace('500', '700')} bg-slate-100`}>
                       {subject?.name}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700">{chapter.title}</h3>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ReadNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const chapter = CHAPTERS.find(c => c.id === id);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!id || !chapter) return;
    
    // Check bookmark status
    setIsBookmarked(getBookmarks().includes(id));

    const loadContent = async () => {
      setLoading(true);
      // Try cache first
      const cached = getCachedNote(id);
      if (cached) {
        setContent(cached.content);
        setLoading(false);
        return;
      }

      // Fetch from Gemini
      const generatedText = await generateNoteContent(chapter);
      setContent(generatedText);
      saveNoteToCache(id, generatedText);
      setLoading(false);
    };

    loadContent();
  }, [id, chapter]);

  const handleBookmark = () => {
    if (!id) return;
    const newState = toggleBookmark(id);
    setIsBookmarked(newState);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!chapter) return <div className="p-8 text-center text-red-500">Chapter not found</div>;

  return (
    <div className="max-w-4xl mx-auto min-h-screen flex flex-col bg-white">
      {/* Tools Bar - Sticky within view, hidden on print */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-3 flex items-center justify-between no-print">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide truncate pr-4">
          {SUBJECTS.find(s => s.id === chapter.subjectId)?.name} / {chapter.title}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-amber-100 text-amber-600' : 'hover:bg-slate-100 text-slate-500'}`}
            title="Bookmark"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save PDF</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-10 lg:p-12">
        {loading ? (
          <Loading />
        ) : (
          <article className="prose prose-slate prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-indigo-600 prose-strong:text-slate-900 lg:prose-lg max-w-none print-only">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || ''}
            </ReactMarkdown>
            
            <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm no-print">
              <p>Generated by AI • ShortNoteX Educational Series</p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

// --- Main Layout Wrapper ---

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
         <Header 
           toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
           title="ShortNoteX" 
         />
         <main className="flex-1 pb-12">
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/subject/:id" element={<SubjectView />} />
             <Route path="/read/:id" element={<ReadNote />} />
             <Route path="/bookmarks" element={<BookmarksView />} />
           </Routes>
         </main>
      </div>
    </div>
  );
};

// --- App Root ---

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

export default App;