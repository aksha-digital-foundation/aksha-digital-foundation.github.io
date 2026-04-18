import {
  Sparkles,
  Target,
  Eye,
  Heart,
  Lightbulb,
  Users,
  HandHeart,
  Shield,
  Brain,
  Globe,
  Code,
  ArrowRight,
  Mail,
} from 'lucide-react'

function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-label">
            <Sparkles size={14} />
            AI for Social Good
          </div>
          <h1>
            Democratizing{' '}
            <span className="hero-accent">AI &amp; Digital Technology</span>{' '}
            for Underserved Communities
          </h1>
          <p>
            We build purpose-driven digital solutions that empower community
            organizations, welfare societies, and nonprofits across India.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Partner with Us
              <ArrowRight size={18} />
            </a>
            <a href="#mission" className="btn btn-ghost">
              Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="section section-alt" id="mission">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <Target size={16} />
              Who We Are
            </div>
            <h2 className="section-title">Mission &amp; Vision</h2>
          </div>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="card-icon icon-blue">
                <Target size={24} />
              </div>
              <h3>Our Mission</h3>
              <p>
                Democratize the power of AI and digital technology for
                underserved communities — making modern tools accessible to
                those who need them most, regardless of geography or resources.
              </p>
            </div>
            <div className="mission-card">
              <div className="card-icon icon-teal">
                <Eye size={24} />
              </div>
              <h3>Our Vision</h3>
              <p>
                A world where AI and digital technology are forces for
                universal equity — where every community organization has
                access to the same powerful tools as large enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <Heart size={16} />
              What Drives Us
            </div>
            <h2 className="section-title">Core Values</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Shield size={24} />
              </div>
              <h4>Equity &amp; Inclusion</h4>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Lightbulb size={24} />
              </div>
              <h4>Empowerment</h4>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Brain size={24} />
              </div>
              <h4>Innovation with Purpose</h4>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Users size={24} />
              </div>
              <h4>Community First</h4>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <HandHeart size={24} />
              </div>
              <h4>Volunteerism</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section section-alt" id="services">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <Code size={16} />
              What We Build
            </div>
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              End-to-end digital solutions for community organizations — from
              portals and member management to AI-powered automation.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <Globe size={24} />
              </div>
              <h3>Community Portals</h3>
              <p>
                Modern, mobile-first websites for welfare societies, nonprofits,
                and community organizations with member-facing features.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Users size={24} />
              </div>
              <h3>Member Management</h3>
              <p>
                Registration, verification, tiered memberships, and digital
                certificates — integrated with Aadhaar and payment gateways.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Brain size={24} />
              </div>
              <h3>AI Agents</h3>
              <p>
                Intelligent agents for document verification, eligibility
                checks, query resolution, and automated member support.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Shield size={24} />
              </div>
              <h3>Identity &amp; Payments</h3>
              <p>
                Aadhaar e-KYC integration, Razorpay/UPI payments, and secure
                document handling for Indian organizations.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Code size={24} />
              </div>
              <h3>Cloud Infrastructure</h3>
              <p>
                GCP-native architecture — GKE, Cloud SQL, automated CI/CD
                pipelines — built for reliability and scale.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Mail size={24} />
              </div>
              <h3>SMS &amp; Notifications</h3>
              <p>
                Automated SMS reminders, email notifications, and communication
                workflows for member engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section className="section" id="portfolio">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <Sparkles size={16} />
              Our Work
            </div>
            <h2 className="section-title">Portfolio</h2>
            <p className="section-subtitle">
              Real solutions for real communities.
            </p>
          </div>
          <div className="portfolio-card">
            <div className="portfolio-info">
              <span className="portfolio-tag">Live Project</span>
              <h3>NPCWS Welfare Society</h3>
              <p>
                Digital portal for the Nagarampalem Police Children Welfare
                Society in Guntur, Andhra Pradesh — serving 500+ police
                families with housing, health, and education schemes.
              </p>
              <div className="portfolio-tech">
                <span>React</span>
                <span>Express</span>
                <span>PostgreSQL</span>
                <span>GCP</span>
                <span>Docker</span>
                <span>Kubernetes</span>
              </div>
            </div>
            <div className="portfolio-preview">
              <div className="portfolio-preview-inner">
                <Shield size={48} className="preview-icon" />
                <p>npcws.aksha-digital-foundation.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" id="contact">
        <div className="container">
          <div className="cta-card">
            <h2>Build Something Meaningful Together</h2>
            <p>
              If your community organization needs a digital presence, member
              management, or AI-powered tools — let&apos;s talk.
            </p>
            <a
              href="mailto:hello@aksha-digital-foundation.com"
              className="btn btn-primary"
            >
              <Mail size={18} />
              hello@aksha-digital-foundation.com
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
