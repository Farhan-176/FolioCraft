const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. User: John Doe
  const john = await prisma.user.create({
    data: {
      username: "johndoe",
      email: "john@encoderx.dev",
      password: passwordHash,
      fullName: "Johnathan Doe",
      title: "Senior Full Stack & Cloud Architect",
      bio: "Crafting mission-critical web applications with React, Next.js, Node.js, and Distributed Cloud Systems. Passionate about developer tooling, performance engineering, and accessible UI.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      location: "San Francisco, CA / Remote",
      status: "Available for new opportunities",
      themeColor: "cyan",
      socialLinks: JSON.stringify({
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe_dev",
        website: "https://johndoe.dev",
        email: "john@encoderx.dev",
      }),
      projects: {
        create: [
          {
            title: "CloudFlow - Serverless Workflow Orchestrator",
            description: "High-throughput DAG workflow execution engine with real-time telemetry, visual pipeline builder, and automated retries.",
            longDescription: "CloudFlow allows engineering teams to define, execute, and monitor complex distributed workflows. Built with Next.js, TypeScript, Node.js, and Redis streams.",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            demoUrl: "https://cloudflow-demo.vercel.app",
            repoUrl: "https://github.com/johndoe/cloudflow",
            tags: JSON.stringify(["Next.js", "TypeScript", "Node.js", "TailwindCSS", "Redis", "Docker"]),
            order: 1,
            featured: true,
          },
          {
            title: "NexusAI - Real-time Collaborative Canvas",
            description: "Interactive infinite whiteboard enabling distributed teams to brainstorm, diagram architectures, and generate UI mockups with AI.",
            longDescription: "Features multi-cursor sync over WebSockets, SVG path vector rendering, and intelligent layout alignment algorithms.",
            imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
            demoUrl: "https://nexusai-canvas.vercel.app",
            repoUrl: "https://github.com/johndoe/nexus-ai",
            tags: JSON.stringify(["React", "WebSockets", "Canvas API", "TailwindCSS", "PostgreSQL"]),
            order: 2,
            featured: true,
          },
          {
            title: "DevMetrics - Kubernetes Cluster Visualizer",
            description: "Observability dashboard that maps pods, nodes, latency heatmaps, and memory pressure in dynamic 3D representations.",
            longDescription: "Lightweight dashboard connecting directly to Kubernetes metrics API to detect cascading crashes and resource bottlenecks.",
            imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
            demoUrl: "https://devmetrics-k8s.vercel.app",
            repoUrl: "https://github.com/johndoe/devmetrics",
            tags: JSON.stringify(["Next.js", "TypeScript", "Three.js", "Prometheus", "TailwindCSS"]),
            order: 3,
            featured: false,
          },
          {
            title: "PayPulse - Multi-Currency Global Gateway",
            description: "Robust payment orchestration layer unifying Stripe, PayPal, and crypto rails with zero chargeback fraud detection.",
            longDescription: "PCI-compliant webhook dispatcher and reconciliation engine processing 10k+ transactions/sec.",
            imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
            demoUrl: "https://paypulse.vercel.app",
            repoUrl: "https://github.com/johndoe/paypulse",
            tags: JSON.stringify(["Node.js", "Express", "PostgreSQL", "Redis", "Stripe API"]),
            order: 4,
            featured: false,
          },
        ],
      },
      experiences: {
        create: [
          {
            company: "TechNova Labs",
            role: "Lead Full Stack Architect",
            location: "San Francisco, CA",
            startDate: "Jan 2023",
            endDate: "Present",
            current: true,
            description: "Spearheaded the redesign of core cloud dashboards improving p99 render times by 42%. Mentored 8 software engineers and instituted robust automated CI/CD testing pipelines.",
            skillsUsed: JSON.stringify(["Next.js", "TypeScript", "GraphQL", "AWS", "Docker"]),
            order: 1,
          },
          {
            company: "Apex Digital Systems",
            role: "Senior Full Stack Engineer",
            location: "Austin, TX",
            startDate: "Mar 2021",
            endDate: "Dec 2022",
            current: false,
            description: "Architected real-time analytics streaming pipelines handling over 50M daily events. Migrated monolith backend into microservices with zero downtime.",
            skillsUsed: JSON.stringify(["Node.js", "React", "PostgreSQL", "Kafka", "Kubernetes"]),
            order: 2,
          },
          {
            company: "EncoderX Innovations",
            role: "Software Engineering Intern",
            location: "Remote",
            startDate: "Jun 2020",
            endDate: "Feb 2021",
            current: false,
            description: "Engineered responsive frontend components and built RESTful API services. Contributed to open-source developer documentation and unit test suites.",
            skillsUsed: JSON.stringify(["JavaScript", "React", "Express", "MongoDB"]),
            order: 3,
          },
        ],
      },
      skills: {
        create: [
          { name: "React / Next.js", category: "Frontend", level: "Expert", order: 1 },
          { name: "TypeScript", category: "Frontend", level: "Expert", order: 2 },
          { name: "Tailwind CSS", category: "Frontend", level: "Expert", order: 3 },
          { name: "Node.js & Express", category: "Backend", level: "Expert", order: 4 },
          { name: "REST & GraphQL APIs", category: "Backend", level: "Advanced", order: 5 },
          { name: "PostgreSQL & Prisma", category: "Database", level: "Advanced", order: 6 },
          { name: "Redis Caching", category: "Database", level: "Intermediate", order: 7 },
          { name: "Docker & Containers", category: "DevOps", level: "Advanced", order: 8 },
          { name: "CI/CD & GitHub Actions", category: "DevOps", level: "Advanced", order: 9 },
          { name: "Jest & Playwright", category: "Tools", level: "Advanced", order: 10 },
        ],
      },
    },
  });

  // 2. User: Sarah Connor
  const sarah = await prisma.user.create({
    data: {
      username: "sarahdev",
      email: "sarah@encoderx.dev",
      password: passwordHash,
      fullName: "Sarah Connor",
      title: "UI/UX Designer & Creative Frontend Developer",
      bio: "Bridging the gap between human-centric design and pixel-perfect code. Specializing in micro-animations, accessible design systems, and modern web applications.",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      location: "London, UK / Remote",
      status: "Exploring creative collaborations",
      themeColor: "violet",
      socialLinks: JSON.stringify({
        github: "https://github.com/sarahdev",
        linkedin: "https://linkedin.com/in/sarahdev",
        twitter: "https://twitter.com/sarah_designs",
        website: "https://sarahconnor.design",
        email: "sarah@encoderx.dev",
      }),
      projects: {
        create: [
          {
            title: "Aura - Design System & Component Library",
            description: "Accessible, accessible-first design system with 50+ token-driven components and automated dark mode switching.",
            longDescription: "Built with React, Radix UI primitives, Tailwind CSS, and Storybook documentation.",
            imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
            demoUrl: "https://aura-design.vercel.app",
            repoUrl: "https://github.com/sarahdev/aura-ui",
            tags: JSON.stringify(["React", "TailwindCSS", "Radix UI", "Framer Motion", "Storybook"]),
            order: 1,
            featured: true,
          },
          {
            title: "PulseAudio - Web3 Music Streaming Studio",
            description: "Spatial audio web player offering high-fidelity audio rendering, interactive waveform visualizations, and artist royalties.",
            longDescription: "Uses Web Audio API, Canvas rendering, and modern CSS glassmorphism.",
            imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
            demoUrl: "https://pulseaudio-app.vercel.app",
            repoUrl: "https://github.com/sarahdev/pulseaudio",
            tags: JSON.stringify(["Next.js", "Web Audio API", "Three.js", "TailwindCSS"]),
            order: 2,
            featured: true,
          },
        ],
      },
      experiences: {
        create: [
          {
            company: "Studio Zenith",
            role: "Senior Frontend Engineer & Designer",
            location: "London, UK",
            startDate: "Sep 2022",
            endDate: "Present",
            current: true,
            description: "Created award-winning interactive marketing websites and customer dashboards for global tech startups.",
            skillsUsed: JSON.stringify(["React", "Next.js", "Figma", "Framer Motion"]),
            order: 1,
          },
        ],
      },
      skills: {
        create: [
          { name: "Figma & UI Prototyping", category: "Tools", level: "Expert", order: 1 },
          { name: "React & Next.js", category: "Frontend", level: "Expert", order: 2 },
          { name: "Tailwind CSS & Styling", category: "Frontend", level: "Expert", order: 3 },
          { name: "Framer Motion Animations", category: "Frontend", level: "Expert", order: 4 },
          { name: "Accessibility (a11y)", category: "Frontend", level: "Advanced", order: 5 },
        ],
      },
    },
  });

  console.log(`Seeded users: ${john.username}, ${sarah.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
