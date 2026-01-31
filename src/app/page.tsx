"use client";

import ChatInterface from "@/components/ChatInterface";
import { Car, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-600">
              Asghar Autos
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Experience the future of car rental. Chat with our AI agent to
              find your perfect ride in seconds. Secure, fast, and fully
              automated.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Features */}
            <div className="space-y-8 mt-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Car className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Premium Fleet</h3>
                  <p className="text-muted-foreground">
                    From Economy to Luxury, choose from our wide range of
                    maintained vehicles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Verified & Secure</h3>
                  <p className="text-muted-foreground">
                    AI-powered identity verification ensures a safe and trusted
                    community.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Instant Booking</h3>
                  <p className="text-muted-foreground">
                    No paperwork, no waiting lines. Book instantly through our
                    intelligent chat.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="w-full">
              <ChatInterface />
            </div>
          </div>
        </div>

        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
      </section>
    </main>
  );
}
