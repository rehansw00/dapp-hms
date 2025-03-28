import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-primary">MediChain</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login?role=doctor">
              <Button variant="outline">Doctor Login</Button>
            </Link>
            <Link href="/login?role=patient">
              <Button variant="outline">Patient Login</Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-col md:flex-row items-center justify-between gap-12 py-12">
          <div className="md:w-1/2">
            <h2 className="text-5xl font-bold mb-6 text-primary">Blockchain-Powered Healthcare Management</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Secure, transparent, and efficient hospital management system built on blockchain technology. Empowering
              doctors and patients with decentralized healthcare records.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button size="lg">Register as Patient</Button>
              </Link>
              <Link href="/login?role=doctor">
                <Button variant="outline" size="lg">
                  Doctor Login with MetaMask
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Hospital Management System"
              className="rounded-lg shadow-xl"
            />
          </div>
        </main>

        <section id="features" className="py-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Secure Patient Records"
              description="Patient data securely stored on the blockchain, ensuring privacy and immutability."
              icon="🔒"
            />
            <FeatureCard
              title="Doctor Management"
              description="Efficient doctor onboarding and management through admin dashboard."
              icon="👨‍⚕️"
            />
            <FeatureCard
              title="MetaMask Authentication"
              description="Secure blockchain-based authentication using MetaMask wallet."
              icon="🔑"
            />
            <FeatureCard
              title="AI-Powered Chatbot"
              description="Intelligent chatbot to guide patients and doctors through the platform."
              icon="🤖"
            />
            <FeatureCard
              title="Decentralized Storage"
              description="Medical records stored on blockchain for transparency and security."
              icon="📊"
            />
            <FeatureCard
              title="Role-Based Access"
              description="Customized dashboards for patients, doctors, and administrators."
              icon="👥"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

