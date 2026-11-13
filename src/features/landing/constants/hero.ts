export interface HeroContentConfig {
  eyebrow: string;
  headline: {
    line1: string;
    line2Bold: string;
    line2Muted: string;
  };
  subtext: string;
  cta: {
    primary: {
      label: string;
      href: string;
    };
    secondary: {
      label: string;
      href: string;
    };
  };
  metrics: {
    cluster: string;
    storage: string;
    speed: string;
  };
}

export const HERO_CONTENT: HeroContentConfig = {
  eyebrow: "DATA DISCOVERY & INTELLIGENCE ARCHITECTURE",
  headline: {
    line1: "Discover enterprise data",
    line2Bold: "with intelligent ",
    line2Muted: "and automated precision",
  },
  subtext:
    "DataScope indexes raw data streams into structured intelligence. Search, filter, and inspect complex enterprise datasets with sub-millisecond precision without writing complex pipelines.",
  cta: {
    primary: {
      label: "Get Started",
      href: "/register",
    },
    secondary: {
      label: "Learn More",
      href: "/login",
    },
  },
  metrics: {
    cluster: "Cluster: Distributed Shards",
    storage: "Engine: Hybrid NVMe Core",
    speed: "0.4ms Query Latency",
  },
};
