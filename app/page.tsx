import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center p-10 max-w-md mx-auto w-full">
        <div className="space-y-16">
          {/* Logo Mark */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-xl blur-xl"></div>
              <div className="relative w-full h-full border border-blue-400 rounded-xl flex items-center justify-center">
                <span className="text-blue-400 text-xl font-light">M</span>
              </div>
            </div>
            <h1 className="text-2xl font-light tracking-widest">MONITOOR</h1>
          </div>

          {/* Value Props */}
          <div className="space-y-8 text-center">
            <div>
              <div className="text-6xl font-thin text-blue-400 mb-2">•</div>
              <p className="text-sm text-gray-400 font-light">Ten curated projects</p>
            </div>
            <div>
              <div className="text-6xl font-thin text-blue-400 mb-2">••</div>
              <p className="text-sm text-gray-400 font-light">AI-powered filtering</p>
            </div>
            <div>
              <div className="text-6xl font-thin text-blue-400 mb-2">•••</div>
              <p className="text-sm text-gray-400 font-light">Instant notifications</p>
            </div>
          </div>

          {/* CTA */}
          <Link 
            href="/explore"
            className="block w-full bg-blue-500 bg-opacity-10 border border-blue-500 text-blue-400 py-4 font-light backdrop-blur text-center hover:bg-opacity-20 transition-all"
          >
            Start Monitoring
          </Link>
        </div>
      </div>
    </div>
  );
}