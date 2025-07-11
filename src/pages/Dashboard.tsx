
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoteCard from "@/components/NoteCard";

// Mock data for demonstration
const pendingNotes = [
  {
    id: "note-1",
    title: "Understanding Plants and Animals",
    subject: "Science",
    class: "Primary 3",
    date: "May 15, 2025",
    status: "pending" as const,
  },
  {
    id: "note-2",
    title: "Basic Addition and Subtraction",
    subject: "Mathematics",
    class: "Primary 1",
    date: "May 16, 2025",
    status: "pending" as const,
  },
  {
    id: "note-3",
    title: "Reading Comprehension: Short Stories",
    subject: "English",
    class: "Primary 2",
    date: "May 17, 2025",
    status: "pending" as const,
  },
];

const reviewedNotes = [
  {
    id: "note-4",
    title: "Introduction to Fractions",
    subject: "Mathematics",
    class: "Primary 4",
    date: "May 10, 2025",
    status: "reviewed" as const,
  },
  {
    id: "note-5",
    title: "Parts of Speech",
    subject: "English",
    class: "Primary 3",
    date: "May 11, 2025",
    status: "reviewed" as const,
  },
  {
    id: "note-6",
    title: "Our Solar System",
    subject: "Science",
    class: "Primary 5",
    date: "May 12, 2025",
    status: "reviewed" as const,
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleNoteClick = (id: string, status: "pending" | "reviewed") => {
    if (status === "pending") {
      toast({
        title: "Note submitted",
        description: "Your note has been submitted for AI review.",
      });
    } else {
      toast({
        title: "Feedback opened",
        description: "Viewing AI feedback for this note.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage your lesson notes and AI reviews</p>
          </div>
          <Link to="/lesson-notes">
            <Button className="mt-4 md:mt-0 bg-skyBlue hover:bg-skyBlue/90">
              Create New Note
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-skyBlue data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-skyBlue data-[state=active]:text-white">Pending Notes</TabsTrigger>
            <TabsTrigger value="reviewed" className="data-[state=active]:bg-skyBlue data-[state=active]:text-white">Reviewed Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Notes</CardTitle>
                  <CardDescription>All your lesson notes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-skyBlue">{pendingNotes.length + reviewedNotes.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Review</CardTitle>
                  <CardDescription>Notes waiting for AI feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-amber-500">{pendingNotes.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Reviewed Notes</CardTitle>
                  <CardDescription>Notes with AI feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">{reviewedNotes.length}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest notes and reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...reviewedNotes, ...pendingNotes]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3)
                    .map(note => (
                      <div key={note.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                        <div>
                          <h3 className="font-medium">{note.title}</h3>
                          <p className="text-sm text-gray-500">{note.date} • {note.subject}</p>
                        </div>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            note.status === "reviewed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {note.status === "reviewed" ? "Reviewed" : "Pending"}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  title={note.title}
                  subject={note.subject}
                  class={note.class}
                  date={note.date}
                  status={note.status}
                  onClick={() => handleNoteClick(note.id, note.status)}
                />
              ))}
            </div>
            {pendingNotes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No pending notes found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviewed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  title={note.title}
                  subject={note.subject}
                  class={note.class}
                  date={note.date}
                  status={note.status}
                  onClick={() => handleNoteClick(note.id, note.status)}
                />
              ))}
            </div>
            {reviewedNotes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviewed notes found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
