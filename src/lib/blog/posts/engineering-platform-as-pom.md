---
title: 'Platform Engineering transformed into a Product Orientated Model'
date: '2026-02-23'
excerpt: 'Transforming from DevOps to Platform Engineering, and from SAFe to POM'
tags: ['DevOps', 'Platform Engineering', 'Organisation Structure', 'Engineering Guilds', 'POM']
aiContributions: 'none'
---

# Migrating a Platform Engineering team to a Product Orientated Model

## Preface

We've been scaling out, and migrating from a DevOps-centric team to a wider Platform Engineering team. Our consumers remain the same, however we're now delivering a set of capabilities, and as we control the SDLC end-to-end (from onboarding to post-deployment) we can provide keen insights and observable state as each developer progresses through their lifecycle. In doing this, we realised we're adapting to become a product-orientated team, with delivery and values aligned. We looked to the wider technology focused engineering teams, such as Google and Spotify for inspiration. We considered how we embed SRE functions within the team, maintain compatibility for operating in a tightly-regulated financial industry, and how we carve-up and share capabilities in a tool-agnostic fashion.

## Introduction: Beyond "DevOps" as a Role

The transition from a DevOps-centric approach to a mature Platform Engineering organization is a significant milestone for any scale-up. For years, the term "DevOps" has been stretched to cover everything from Jenkins administration to cloud architecture. However, as organizations grow, the "you build it, you run it" mantra can lead to significant cognitive overload for product developers.

Enter Platform Engineering—not as a rebranding of the operations team, but as a discipline dedicated to building "Internal Developer Platforms" (IDPs). The goal is to provide "Golden Paths"—standardized, self-service sets of tools and workflows that reduce friction and allow developers to focus on application logic. But building a platform is only half the battle; the real transformation lies in how you _run_ the team. This is where the Product Orientated Model (POM) becomes essential.

## The Organisational Blueprint: Platform-as-a-Product

To truly serve the internal developer, the platform must be treated as a product. This means shifting from a "Project" mindset—where we build a tool and move on—to a "Product" mindset, where we continuously evolve capabilities based on user feedback and business outcomes.

Our organizational structure is anchored by three key pillars:

1.  **The Product Council**: This body provides high-level governance and strategic alignment. It ensures that the platform's roadmap is aligned with the wider company goals and ratifies major architectural and investment decisions.
2.  **The Product Trio**: For each platform domain (e.g., Compute, Identity, Data), we establish a "Product Trio" consisting of a Product Owner, an Engineering Manager, and a Solution Designer. This triad is responsible for the "What," "Why," and "How" of their domain.
3.  **Delivery Squads**: These are the cross-functional teams that actually build and maintain the platform. Common squads in our model include:
    - **Internal Developer Portal**: Focusing on the UI and self-service interfaces.
    - **Developer Tooling**: Building the CLI, CI/CD libraries, and local development environments.
    - **Site Reliability & Platform**: Managing the underlying infrastructure, observability, and scaling logic.

## Reimagining Roles: Ownership and Capability

In a Product Orientated Model, roles are redefined to emphasize value delivery over mere technical implementation.

### The Product Owner (PO)

The PO for a platform team treats internal developers as their customers. Their role is to:

- **Define the Roadmap**: Based on developer experience (DevEx) surveys, SLO data, and business requirements.
- **Manage the Backlog**: Prioritizing work that reduces toil and increases developer velocity.
- **Measure Outcomes**: Using metrics like Lead Time for Changes and Deployment Frequency as indicators of platform health.

### The Engineering Manager (EM)

The EM focuses on the health of the engineering team and the quality of the delivery. They are responsible for:

- **Technical Excellence**: Ensuring the code and architecture meet high standards of reliability and maintainability.
- **People Development**: Mentoring engineers and cultivating a culture of continuous learning.
- **Operational Health**: Working with the PO to ensure the team balances new features with technical debt and maintenance.

### The Capability Owner

A novel addition to our structure is the **Capability Owner**. Unlike an EM who manages people, or a PO who manages a product, the Capability Owner owns the _standards_ of a specific domain (e.g., SRE, Engineering, Product).

They define what "good" looks like—setting the reusable patterns, documentation, and enablement content that squads use. They drive technical consistency across the organization without necessarily owning the day-to-day delivery of any single squad.

## Guilds: Driving Excellence Without Friction

One of the primary risks of product-aligned squads is technical fragmentation. If every squad builds their own way of doing things, the "platform" quickly becomes a collection of disconnected tools. To prevent this, we utilize **Guilds**.

Guilds (such as SRE, Engineering, and Product) are communities of practice that cut across squads. Their purpose is to:

- **Set Standards**: Define coding practices, security protocols, and CI/CD patterns.
- **Share Reusable Components**: Ensure that a Terraform module or a pipeline library built by one squad is available to all.
- **Promotion of Culture**: Driving an automation-first mindset and ensuring that knowledge is shared rather than siloed.

## Governance and the "Rules of the Game"

Operating a platform in a regulated financial environment requires a level of rigor that simple Agile squads often lack. We've moved away from the heavy overhead of the Scaled Agile Framework (SAFe) towards a "Rules of the Game" approach—a set of lean ceremonies and working agreements that maintain compliance without sacrificing speed.

Key ceremonies include:

- **Design Clinics**: Weekly sessions where new proposals are peer-reviewed. This ensures that major architectural decisions are discussed and documented in a "decision log."
- **Ops Backlog Reviews**: Daily focus on "toil reduction." Here, we identify recurring service desk tickets and prioritize them for automation.
- **Requirement Reviews**: A weekly forum for the Product Trio to vet new incoming requests, perform gap analysis, and estimate the effort required to onboard new capabilities.

## Working Agreements: Automation First

Our team norms are built on a simple principle: **Automation and Self-Service First.**

Every recurring manual task is a bug. We work to "convert top Service Desk tickets into automation/click-ops," ensuring that our support model scales linearly with our users, not our headcount. This "paved road" approach ensures that even in a highly regulated environment, developers can move fast with the confidence that the platform is handling the "boring" compliance and security details for them.

## Reservations: The Hidden Friction of POM

While the transition to a Product Orientated Model has been overwhelmingly positive, it is important to acknowledge the reservations and challenges we encountered. No model is a silver bullet.

### 1. The Myth of the "Clean" Break

Moving from DevOps to POM isn't an overnight switch. There's a significant "messy middle" where you're running legacy infrastructure while trying to build the new platform. This requires a double-handed approach: keeping the lights on (Ops) while simultaneously building the "Golden Path" (Product). If you don't balance this correctly, the delivery squads will burn out under the weight of "toil" from the old world.

### 2. Governance vs. Speed in Regulated Markets

In financial services, "Agile" often meets "Audit." There is a risk that the Product Trio reviews and Product Council approvals can become just another layer of red tape. To mitigate this, governance must be baked into the platform as code (Policy-as-Code). If the platform can't prove compliance automatically, the "Trio" will spend all their time in meetings instead of building.

### 3. Finding "Product-Minded" Engineers

The biggest hurdle is often cultural. Engineers are traditionally trained to solve technical problems, not user-experience problems. A "Capability Owner" needs to think about documentation, onboarding, and "Time to Hello World" just as much as they think about latency or throughput. Finding—and training—engineers to have this product mindset is a long-term investment.

### 4. Technical Siloing

Even with Guilds, there is a gravitational pull toward squads becoming "mini-kingdoms." If the "Identity" squad and the "Compute" squad don't talk, the developer ends up with two different ways to configure their secrets. Continuous cross-squad alignment is required to ensure the platform feels like a single, cohesive product rather than a frankenstein of disparate tools.

## Conclusion: The Platform as a Force Multiplier

The migration to a Product Orientated Model is ultimately about leverage. By treating our platform as a product, we ensure that every hour of engineering effort we spend on the platform is multiplied across every developer in the organization.

We've moved away from being a "Service Desk" that fulfills tickets, to being a "Product Team" that empowers engineers. It requires a shift in structure, a reimagining of roles, and a relentless focus on automation, but the result is a resilient, scalable, and—most importantly—usable engineering ecosystem. For organizations operating in complex, regulated fields, this model isn't just an option; it's the future of how high-performing teams will scale.

## How did it work for us?

We've just started our journey to POM We're learning, and we're growing, and we're getting better. I'll push an article up in six months time to share our experiences, and to show how we've done!

---
