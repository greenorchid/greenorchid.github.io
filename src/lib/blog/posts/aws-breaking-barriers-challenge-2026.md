---
title: 'Innovating for Good: The AWS Breaking Barriers Challenge 2026'
date: '2026-01-16'
excerpt: 'Reflecting on a 3-day hackathon helping the Irish Refugee Council build an AI-powered chatbot with AWS Bedrock.'
tags: ['AWS', 'AI', 'Hackathon', 'Social Impact', 'Chatbot', 'Bedrock', 'Breaking Barriers']
aiContributions: 'none'
---

I recently had the privilege of participating in the [AWS Breaking Barriers Challenge 2026](https://aws.amazon.com/events/aws-breaking-barriers-challenge/), a hackathon spanning three locations—Manchester, London, and Dublin—over three intense and rewarding days. The mission was clear: pair tech teams with charities to see if we could deliver real, tangible innovation to support their critical work.

I was fortunate to work with a fantastic team on behalf of the [Irish Refugee Council](https://www.irishrefugee.ie), developing a solution directly aimed at supporting their operational efficiency and service delivery.

## The Challenge

Our goal was to develop a **chatbot** capable of providing deterministic, accurate responses to queries. The key requirement was trust: in a sector dealing with vulnerable individuals and complex legal/support frameworks, accuracy is paramount. We needed a system that would strictly avoid hallucinations.

### The Solution

Using \*\*AWS Bedrock, we implemented a retrieval-augmented, embedding-based assistant grounded exclusively in the charity’s onsite documentation. The system was designed with the following principles:

- **Deterministic Responses**
  We used Bedrock text embeddings to index approved documentation and applied a retrieval-augmented generation (RAG) pattern. User queries are first matched against the embedding store, and the model is prompted to only generate answers from retrieved passages. Prompts explicitly instruct the model to decline responses when no relevant source material is found, reducing hallucinations.

- **Adaptive Multi-lingual Support**
  Queries are embedded and retrieved in a language-agnostic vector space, allowing semantic matching across languages. Prompt templates include dynamic language instructions (e.g. “Respond in the user’s input language”) while maintaining the same underlying source content, enabling consistent and accurate multilingual responses without duplicating documents.

- **Safety & Accuracy**
  We enforced Bedrock Guardrails to restrict unsupported claims, sensitive content, and speculative advice. System prompts reinforce the use of verified sources only, while guardrails and confidence-based refusal patterns ensure the assistant clearly signals uncertainty or redirects users to human support when appropriate.

## Key Learnings

Over the course of the three days, the technical implementation was only half the journey. We learned deeply about:

1.  **The Power of Team Structure:** Leveraging various perspectives and diverse talents within our group was essential to moving fast and building correctly.
2.  **The Charity's Mission:** We gained a firm understanding of the tireless work performed by the Irish Refugee Council and the massive potential for AI to improve efficiency and social engagement for their vulnerable customers.

## Incredible Innovation Across the Board

It wasn't just us; other teams were delivering truly impactful solutions. Some standout projects included:

- Reading assistants for children.
- Risk management and forecasting tools.
- Health documentation and case optimization.
- Comic book descriptions for the visually impaired.

## Reflection

I want to sum up by thanking **AWS** for hosting such a meaningful event and providing the platform and tools to make this possible. A huge thank you also goes to my wonderful team colleagues—it was an honor to build alongside you.

To verify the impact or support their work, please visit the [Irish Refugee Council](https://www.irishrefugee.ie) and check out the [AWS Breaking Barriers Challenge](https://aws.amazon.com/events/aws-breaking-barriers-challenge/).
