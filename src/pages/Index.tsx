
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, ClipboardCheck, BookOpen } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <BookOpen className="h-12 w-12 text-skyBlue mb-4" />,
      title: "Enhanced Lesson Planning",
      description: "Get AI-powered feedback on your lesson notes to improve clarity, structure, and educational outcomes."
    },
    {
      icon: <ClipboardCheck className="h-12 w-12 text-skyBlue mb-4" />,
      title: "Instant Feedback",
      description: "Receive immediate analysis and suggestions to optimize your teaching materials."
    },
    {
      icon: <GraduationCap className="h-12 w-12 text-skyBlue mb-4" />,
      title: "Student-Focused Insights",
      description: "AI suggestions prioritize student engagement and comprehension for all learning styles."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-section py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  AI-Powered Lesson Note Reviews for <span className="text-skyBlue">Family Care Schools</span>
                </h1>
                <p className="text-xl text-gray-600">
                  Enhance your teaching materials with intelligent feedback. Our AI tool helps primary school teachers create more effective, engaging lesson notes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/review-notes">
                    <Button className="bg-skyBlue hover:bg-skyBlue/90 text-white px-6 py-2 rounded-md">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="border-skyBlue text-skyBlue hover:bg-skyBlue hover:text-white">
                      Teacher Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-skyBlue/10 rounded-lg transform rotate-3"></div>
                  <Card className="relative z-10 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500">AI Review Sample</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                        </div>
                        <h3 className="font-semibold">Mathematics: Fractions Introduction</h3>
                        <div className="space-y-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded-md">
                            <span className="font-medium text-skyBlue">Clarity:</span>
                            <p>Great introduction. Consider adding visual aids to help visual learners.</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-md">
                            <span className="font-medium text-skyBlue">Structure:</span>
                            <p>Well-organized lesson flow. Add a recap section at the end.</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-md">
                            <span className="font-medium text-skyBlue">Content:</span>
                            <p>Excellent examples. Include 1-2 more real-world applications.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI system analyzes your lesson notes and provides actionable feedback to enhance teaching effectiveness.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-skyBlue/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to improve your lesson notes?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join other teachers at Family Care Schools who are already enhancing their teaching materials with AI assistance.
            </p>
            <Link to="/login">
              <Button className="bg-skyBlue hover:bg-skyBlue/90 text-white px-8 py-2 text-lg">
                Start Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
