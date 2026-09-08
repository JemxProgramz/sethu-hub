import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MessageSquare, Briefcase, Zap, Shield, GitPullRequest, Code, Terminal, Layers } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDED] font-sans selection:bg-[#333] selection:text-white">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-[#1A1A1A]">
        <div className="mx-auto max-w-[1200px] px-6 h-14 flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-semibold text-white tracking-tight flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
              Sethu Hub
            </Link>
            <div className="hidden md:flex items-center gap-6 text-[#888888]">
              <a href="#features" className="hover:text-[#EDEDED] transition-colors">Features</a>
              <a href="#methodology" className="hover:text-[#EDEDED] transition-colors">Methodology</a>
              <a href="#customers" className="hover:text-[#EDEDED] transition-colors">Customers</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[#888888] hover:text-[#EDEDED] transition-colors hidden sm:block">
              Log in
            </Link>
            <Link to="/register" className="bg-white text-black px-3 py-1.5 rounded-sm font-medium hover:bg-[#EAEAEA] transition-colors flex items-center gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="mx-auto max-w-[1200px] text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#222] bg-[#111] text-xs font-medium text-[#888] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#EDEDED]"></span>
            Sethu Hub 2.0 is now available
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white max-w-3xl leading-[1.1] mb-6">
            The central nervous system for your campus.
          </h1>
          <p className="text-lg md:text-xl text-[#888888] max-w-2xl mb-10 leading-relaxed font-light">
            Sethu Hub replaces fragmented chat groups and isolated email threads with a unified, high-performance knowledge network. Designed specifically for institutional collaboration.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/register" className="bg-white text-black px-5 py-2.5 rounded-sm font-medium hover:bg-[#EAEAEA] transition-colors flex items-center gap-2 text-sm">
              Start building <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/home" className="bg-transparent border border-[#333] text-white px-5 py-2.5 rounded-sm font-medium hover:bg-[#111] transition-colors text-sm">
              View live demo
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase (Realistic UI representation) */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="w-full aspect-[16/10] sm:aspect-video rounded-lg border border-[#222] bg-[#0A0A0A] shadow-2xl overflow-hidden flex flex-col">
            {/* Fake Browser Header */}
            <div className="h-10 border-b border-[#222] flex items-center px-4 gap-2 bg-[#050505]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              </div>
              <div className="mx-auto w-1/3 h-5 bg-[#111] rounded-sm border border-[#222] flex items-center justify-center">
                <span className="text-[10px] text-[#666] font-mono">hub.sethu.ac.in</span>
              </div>
            </div>
            {/* Fake App Body */}
            <div className="flex-1 flex text-sm">
              {/* Sidebar */}
              <div className="w-48 border-r border-[#222] bg-[#0A0A0A] p-4 hidden md:flex flex-col gap-6">
                <div className="space-y-1">
                  <div className="h-6 w-24 bg-[#222] rounded-sm mb-4"></div>
                  <div className="flex items-center gap-2 text-[#888] py-1.5"><Layers className="w-3.5 h-3.5"/> Home</div>
                  <div className="flex items-center gap-2 text-[#050505] bg-[#EDEDED] px-2 py-1.5 rounded-sm -mx-2"><Zap className="w-3.5 h-3.5"/> Feed</div>
                  <div className="flex items-center gap-2 text-[#888] py-1.5"><MessageSquare className="w-3.5 h-3.5"/> Discussions</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-[#555] font-semibold mb-2">Departments</div>
                  <div className="flex items-center gap-2 text-[#888] py-1"><div className="w-1.5 h-1.5 rounded-full bg-[#555]"></div> Computer Science</div>
                  <div className="flex items-center gap-2 text-[#888] py-1"><div className="w-1.5 h-1.5 rounded-full bg-[#555]"></div> Electronics</div>
                  <div className="flex items-center gap-2 text-[#888] py-1"><div className="w-1.5 h-1.5 rounded-full bg-[#555]"></div> Mechanical</div>
                </div>
              </div>
              {/* Main Content */}
              <div className="flex-1 bg-[#050505] p-6 lg:p-10 flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#222] pb-6">
                  <div className="h-8 w-48 bg-[#222] rounded-sm"></div>
                  <div className="h-8 w-24 bg-[#111] border border-[#333] rounded-sm"></div>
                </div>
                <div className="flex-1 space-y-4">
                  {/* Post 1 */}
                  <div className="p-4 border border-[#222] rounded-sm bg-[#0A0A0A]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-sm bg-[#333]"></div>
                      <div>
                        <div className="h-3 w-32 bg-[#444] rounded-sm mb-1.5"></div>
                        <div className="h-2 w-20 bg-[#222] rounded-sm"></div>
                      </div>
                    </div>
                    <div className="h-4 w-3/4 bg-[#222] rounded-sm mb-2"></div>
                    <div className="h-4 w-1/2 bg-[#222] rounded-sm"></div>
                  </div>
                  {/* Post 2 */}
                  <div className="p-4 border border-[#222] rounded-sm bg-[#0A0A0A]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-sm bg-[#333]"></div>
                      <div>
                        <div className="h-3 w-24 bg-[#444] rounded-sm mb-1.5"></div>
                        <div className="h-2 w-16 bg-[#222] rounded-sm"></div>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-[#222] rounded-sm mb-2"></div>
                    <div className="h-4 w-2/3 bg-[#222] rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Problem & Capabilities */}
      <section id="features" className="py-24 border-t border-[#111] bg-[#0A0A0A]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 md:w-2/3">
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Escape the noise.</h2>
            <p className="text-[#888] text-lg leading-relaxed font-light">
              Legacy communication tools optimize for interruption. Sethu Hub is designed for async alignment, institutional memory, and deep work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-[#222] rounded-sm bg-[#050505]">
              <MessageSquare className="w-5 h-5 text-white mb-4" />
              <h3 className="text-white font-medium mb-2">Structured Discussions</h3>
              <p className="text-[#888] text-sm leading-relaxed">
                Move away from ephemeral chat. Threaded, categorized, and searchable discussions that act as a permanent knowledge base.
              </p>
            </div>
            <div className="p-6 border border-[#222] rounded-sm bg-[#050505]">
              <GitPullRequest className="w-5 h-5 text-white mb-4" />
              <h3 className="text-white font-medium mb-2">Cross-department Collaboration</h3>
              <p className="text-[#888] text-sm leading-relaxed">
                Break down silos. Discover projects, share resources, and form interdisciplinary teams without friction.
              </p>
            </div>
            <div className="p-6 border border-[#222] rounded-sm bg-[#050505]">
              <Shield className="w-5 h-5 text-white mb-4" />
              <h3 className="text-white font-medium mb-2">Institutional Moderation</h3>
              <p className="text-[#888] text-sm leading-relaxed">
                Built-in role-based access control, faculty oversight, and automated content moderation to maintain academic standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Demonstration (Alternating layout) */}
      <section className="py-32 border-t border-[#111] overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-6 space-y-32">
          
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6">
              <div className="inline-block text-xs font-mono text-[#888] border border-[#222] px-2 py-1 rounded-sm bg-[#111]">01 / Knowledge Graph</div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Understand your network.</h2>
              <p className="text-[#888] text-base leading-relaxed">
                Visualize how ideas, students, and departments connect. The built-in knowledge graph maps out expertise across the entire institution, making it trivial to find the right collaborator for your next project.
              </p>
              <ul className="space-y-3 pt-4 text-sm text-[#888]">
                <li className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-white"></div> Discover subject matter experts</li>
                <li className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-white"></div> Identify emerging tech trends</li>
                <li className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-white"></div> Trace the origin of campus initiatives</li>
              </ul>
            </div>
            <div className="flex-1 w-full aspect-square md:aspect-[4/3] border border-[#222] bg-[#0A0A0A] rounded-sm relative overflow-hidden flex items-center justify-center">
              {/* Mock Graph UI */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)]" style={{ backgroundSize: '24px 24px' }}></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute w-32 h-[1px] bg-[#444] rotate-45"></div>
                <div className="absolute w-24 h-[1px] bg-[#444] -rotate-12 translate-x-12 translate-y-8"></div>
                <div className="absolute w-40 h-[1px] bg-[#444] rotate-75 -translate-x-10 translate-y-10"></div>
                
                <div className="absolute w-12 h-12 bg-[#111] border border-[#333] rounded-full z-10 flex items-center justify-center text-[10px] text-white">AI</div>
                <div className="absolute w-10 h-10 bg-[#0A0A0A] border border-[#222] rounded-full z-10 flex items-center justify-center text-[8px] text-[#888] translate-x-16 translate-y-16">Robotics</div>
                <div className="absolute w-14 h-14 bg-[#050505] border border-[#444] rounded-full z-10 flex items-center justify-center text-[10px] text-[#EDEDED] -translate-x-14 -translate-y-14">Data Sci</div>
                <div className="absolute w-8 h-8 bg-[#111] border border-[#222] rounded-full z-10 flex items-center justify-center text-[8px] text-[#666] translate-x-20 -translate-y-4">IoT</div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6">
              <div className="inline-block text-xs font-mono text-[#888] border border-[#222] px-2 py-1 rounded-sm bg-[#111]">02 / Intelligent Search</div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Information at your fingertips.</h2>
              <p className="text-[#888] text-base leading-relaxed">
                A lightning-fast, typo-tolerant search engine that indexes everything: from project repositories and community discussions to faculty directories. Stop asking where things are. Just search.
              </p>
              <div className="pt-4">
                <Link to="/search" className="text-sm text-white font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Try the search engine <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full aspect-square md:aspect-[4/3] border border-[#222] bg-[#0A0A0A] rounded-sm relative overflow-hidden flex flex-col p-6">
               <div className="w-full bg-[#111] border border-[#333] rounded-sm p-3 flex items-center gap-3 text-[#888] text-sm mb-6 shadow-xl">
                 <Search className="w-4 h-4 text-[#666]" />
                 <span className="font-mono text-xs">Machine learning datasets...</span>
                 <div className="ml-auto flex items-center gap-1">
                   <kbd className="px-1.5 py-0.5 bg-[#222] border border-[#333] rounded-[2px] text-[10px]">⌘</kbd>
                   <kbd className="px-1.5 py-0.5 bg-[#222] border border-[#333] rounded-[2px] text-[10px]">K</kbd>
                 </div>
               </div>
               <div className="flex-1 border border-[#222] bg-[#050505] rounded-sm p-4 space-y-4">
                 <div className="flex items-start gap-3 opacity-50">
                   <div className="w-6 h-6 rounded-sm bg-[#222]"></div>
                   <div>
                     <div className="w-32 h-3 bg-[#333] rounded-sm mb-2"></div>
                     <div className="w-48 h-2 bg-[#111] rounded-sm"></div>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-sm bg-[#444]"></div>
                   <div>
                     <div className="w-40 h-3 bg-[#EDEDED] rounded-sm mb-2"></div>
                     <div className="w-56 h-2 bg-[#333] rounded-sm"></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Social Proof */}
      <section id="customers" className="py-24 border-t border-[#111] bg-[#0A0A0A] text-center px-6">
        <div className="mx-auto max-w-[800px]">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-12">Trusted by engineering departments</h2>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale">
             {/* Abstract minimalist logos built with divs to simulate actual client logos without using external SVGs */}
             <div className="flex items-center gap-2 font-mono font-bold text-lg"><Code className="w-6 h-6"/> CSE Dept</div>
             <div className="flex items-center gap-2 font-sans font-black text-xl tracking-tighter"><Zap className="w-6 h-6 fill-current"/> EEE Hub</div>
             <div className="flex items-center gap-2 font-serif font-bold text-lg italic"><Briefcase className="w-6 h-6"/> M.B.A</div>
             <div className="flex items-center gap-2 font-sans font-semibold text-xl tracking-widest"><Terminal className="w-6 h-6"/> IT SOC</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-[#111] px-6">
        <div className="mx-auto max-w-[600px] text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-white mb-6">Ready to align your campus?</h2>
          <p className="text-[#888] text-lg mb-10 font-light">
            Join the students and faculty already using Sethu Hub to centralize their knowledge and streamline collaboration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-sm font-medium hover:bg-[#EAEAEA] transition-colors text-sm">
              Create an account
            </Link>
            <Link to="/docs" className="w-full sm:w-auto bg-transparent border border-[#333] text-white px-6 py-3 rounded-sm font-medium hover:bg-[#111] transition-colors text-sm">
              Read the documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-[#1A1A1A] bg-[#050505] pt-16 pb-8 px-6 text-sm">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2">
              <div className="font-semibold text-white tracking-tight flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                Sethu Hub
              </div>
              <p className="text-[#666] max-w-xs leading-relaxed text-xs">
                The unified knowledge network for academic institutions. Designed for clarity, speed, and focus.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 text-xs">Product</h4>
              <ul className="space-y-3 text-[#666] text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#customers" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 text-xs">Company</h4>
              <ul className="space-y-3 text-[#666] text-xs">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#111] text-[#555] text-xs">
            <p>© 2026 Sethu Institute of Technology. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#888] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#888] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
