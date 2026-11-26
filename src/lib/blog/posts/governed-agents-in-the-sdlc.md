---
title: 'Giving AI Agents the Keys? Not Just Yet.'
date: '2026-11-26'
excerpt: 'Some thoughts from ongoing engineering-platform work on secure agent execution, the SDLC bottlenecks nobody wants to inherit, and why governance is easier to build in than bolt on.'
tags: ['AI', 'FinOS', 'SDLC', 'Governance', 'Agentic AI', 'Platform Engineering']
aiContributions: 'partial'
blueskyUri: 'at://did:plc:oo4sqwem2prw2yebqexllrx3/app.bsky.feed.post/3n3atbpdlua27'
---

# Giving AI Agents the Keys? Not Just Yet.

There's a fair bit of excitement about AI agents writing code, fixing defects and raising pull requests while the rest of us get on with something more interesting. Grand. I'm interested too.

But much of my day-to-day work involves the less glamorous parts of engineering: how platforms fit together, how developers get things done, who is allowed to do what, and how we demonstrate that the controls actually worked. Particularly in a regulated environment, that's where an exciting demo meets a rather awkward set of questions.

I've been doing some research and ongoing design work around what it would take to introduce agents into an existing software delivery lifecycle (SDLC) without turning the whole thing upside down. These are my own thoughts, not a description of any particular organisation's architecture or plans. The question isn't whether an agent can change a line of code. We've seen that. It's whether we can safely let one take on a _bounded engineering task_, produce something useful, and leave a trail that somebody else can understand and trust.

And here's the other thing: if agents make it easy to produce more changes, who is going to test, review, attest to and release them? There's no point building a faster road straight into a traffic jam.

## An agent is another actor in the SDLC

We've spent years building delivery pipelines with approvals, testing, dependency checks, security gates, version control and an audit trail. They're not always pretty, but they exist for reasons.

A new actor shouldn't get to skip them because it happens to be made of software.

When the actor is an agent rather than a developer, a few things change. The agent may work unattended for a while. It can invoke tools, fetch information, run commands and propose changes. It may also misread an instruction, encounter hostile repository content or confidently head down the wrong path. A sensible design assumes those things _can_ happen, and limits the consequences.

I find it useful to separate the problem into a few capabilities rather than shopping for one enormous 'agent platform'. We need somewhere to submit and classify work; a way to supply relevant context; an isolated place to execute; controlled access to tools; established checks on the proposed result; and proper records of what happened. Identity, policy, cost and observability should span the lot.

![A vendor-neutral view of the capabilities needed for governed agentic engineering](/images/blog/governed-agents-in-the-sdlc/agentic-stack.png)

_The boxes are a way of organising responsibilities, not a suggestion that governance and telemetry happen only at the end. They need to apply throughout._

It's tempting to begin with the clever model and work out the other bits afterwards. I'd start with the boundaries. Less glamorous, perhaps, but you'd want the brakes sorted before taking the car onto the motorway.

## Give it a job, not your badge

Here's a fairly ordinary example. A developer asks an agent to update an approved dependency in one repository, run the tests and prepare a pull request.

That sounds like reasonable work to delegate. It does **not** mean the agent needs the developer's credentials, access to every repository in the organisation, or permission to deploy to production. Far from it.

Instead, the agent should receive a task-specific identity, a known source revision, the relevant coding standards, the allowed tools, and an explicit statement of what 'done' means. Access to one repository should mean one repository. Permission to run one validation job should not quietly become permission to operate the entire build system.

I think of this as a _capability envelope_: an enforceable description of what the task may read, call, change and submit. It should have a short lifetime and a default-deny posture. The agent can suggest a wider scope if it gets stuck, but shouldn't be able to grant that scope to itself.

There's a small but important distinction here. Restricting which network addresses a workspace can reach isn't the same as authorising what it can do when it gets there. An approved gateway still needs to check the identity, resource and action on every request. Likewise, telling a model in a prompt not to use a credential is not a security boundary. That's a polite request, not a control.

## A fresh workspace, every time

The execution environment deserves as much thought as the model. Perhaps more.

For a bounded task, my preference is a clean, disposable workspace containing only the source, tools and approved context required. No inherited developer home directory. No persistent credentials. No convenient shared cache full of surprises from last Tuesday. When the job finishes, or fails, the workspace goes away.

**Does that mean a container is enough?** Sometimes, for lower-risk, read-only tasks. But not automatically. If the agent runs untrusted code, installs arbitrary dependencies or has access to sensitive internal services, stronger isolation may be warranted. A short-lived virtual machine or microVM is one option. The right boundary depends on the workload and threat model, not on which product has the tidiest marketing diagram.

A broker sitting outside the workspace can set up that boundary, give the task its limited permissions and tear everything down afterwards. A separate tool gateway can mediate calls to source control, build services, package repositories or documentation. Proposed writes to protected systems can pass through a further gate that checks them before taking action.

That last point matters. For an initial deployment, let the agent **propose** a change; don't let it silently make one in a protected place.

## Keep the boring controls. Make them more useful.

Once an agent has prepared a change, the existing engineering controls should still decide whether it's acceptable. Tests, security scans, dependency policies, licence checks, provenance, branch protections and human review are not old-fashioned simply because the author isn't human.

What _can_ change is the feedback loop. Instead of dumping a wall of red pipeline logs onto someone's desk, return structured failures to the agent: which test failed, which policy was breached, what evidence is missing. The agent can attempt a correction within its original permissions. If it needs an exception or a wider remit, that's a new decision for a person or an authorised policy process.

![How a bounded agent task can produce a reviewed change without bypassing the normal release path](/images/blog/governed-agents-in-the-sdlc/agentic-change-flow.png)

This is the kind of workflow I'd aim to prove first: a well-defined request, scoped identity and context, disposable execution, a proposed change, deterministic checks, and human acceptance before the ordinary promotion path continues.

Notice what _isn't_ in that picture. An agent deciding for itself that a failed control probably doesn't matter. Nor is there a magical 'AI approved' sticker replacing evidence. We have enough of those sorts of shortcuts already, thanks very much.

## Faster code means more work somewhere else

This is the part I think gets too little airtime.

Suppose we make code generation and routine fixes dramatically quicker. Lovely. We may also generate more pull requests, more builds, more test executions, more dependency decisions, more security findings and more requests for sign-off. If those downstream activities stay manual and unchanged, we'll simply move the queue.

AI will reduce engineering workload in some places, absolutely. Across the whole lifecycle? Not by default.

The response shouldn't be to wave through more changes. It should be to improve the work _around_ the change as well. For example:

- **Pull-request review:** agents can summarise changes, point out risky areas and check conformance to standards, leaving reviewers to focus on intent and judgement.
- **Testing and UAT:** they can propose test cases from acceptance criteria, identify coverage gaps, prepare test data within approved boundaries, and assist testers with repeatable scenarios. A real business acceptance decision still needs a clear owner.
- **Evidence and attestations:** they can assemble traceable evidence from builds, tests, controls and approvals, and flag what's missing. That is different from allowing an agent to attest to its _own_ work without independent verification.
- **Operations and remediation:** they can investigate a finding, gather context and suggest a bounded fix, with the same identity, execution and review controls as any other task.

None of that is free. We need capacity planning for runners, registries, scanners, test environments, review queues and the people who own exceptions. We also need to measure rework rather than congratulating ourselves on the number of pull requests raised. A hundred half-baked changes isn't progress; it's a hundred jobs for somebody else.

## Governance: before every tool grows its own little kingdom

There's an old bit of Irish wisdom about not building your house on a bog. You'd think it was fairly obvious, but we've a remarkable talent in technology for putting up the walls before checking the foundations.

I suspect we're in danger of doing much the same with AI. Every platform, vendor and their dog is introducing AI capabilities, each with its own controls, permissions and way of measuring consumption. All grand individually. But who's keeping an eye on the bigger picture?

Most engineering organisations already use a mix of internal platforms and external services. More and more of those tools are adding AI features. On their own, many are useful. Across an entire SDLC, the picture can become messy fairly quickly.

One service counts requests. Another reports tokens. A third has its own audit events, policy settings and approval model. Some can attribute usage to a project; others can barely tell you which team ran up the bill. Before long, you're trying to answer simple questions by stitching together five dashboards and a spreadsheet. A right dog's dinner.

**Do we need to build every AI capability ourselves?** No. That's not the argument. I'd much rather use good tools than reinvent them. But I'd want shared _rules of engagement_ wherever possible: identity, authorisation, access boundaries, audit records, usage and cost attribution, model and tool policy, and a common way to describe a task.

There is a trade-off. Central governance can become a bottleneck if every integration needs a committee and six months of paperwork. The trick is to establish a small, usable platform contract early: how an agent identifies itself, what a permitted tool call looks like, what evidence gets captured, and who can approve a change. Products can plug into that contract without every product team inventing its own version of governance.

It's usually easier to agree those foundations now than to retrofit them across a dozen isolated AI-enabled services later. Easier doesn't mean easy, mind you. But when someone eventually comes knocking, wanting to know who did what, which controls were applied and where the money went, I'd rather have a few decent foundations to show them than explain how we managed to build ourselves a very expensive house in the middle of a bog.

## Observability is about more than tokens

If an agent works on a task, I want to be able to answer a few straightforward questions afterwards.

Who requested it? Which agent and model were used? What source revision and policy applied? What context did it receive? Which tools did it call, and which calls were refused? What changed? Which checks passed or failed? Who accepted the result? What did it cost?

That calls for a proper _activity record_, going well beyond standard application logging. It needs enough structure to connect a request to its execution, tool calls, proposed changes, approvals and outcome. Sensitive inputs and secrets shouldn't be sprayed into logs along the way, of course. Evidence needs its own access and retention controls.

Cost belongs here too. Not only model spend, but compute, repeated test runs, tool calls, storage and the human time spent reviewing or fixing the output. The cheapest model invocation may be a very expensive engineering task if it takes three attempts and half a day to untangle.

And if a platform can't tell whether the resulting work was accepted, reverted or reopened, it can't tell us much about actual productivity.

## Don't jump straight to the self-driving release train

![Four stages of maturity within an agentic engineering platform](/images/blog/governed-agents-in-the-sdlc/four-stages-agentic-engineering-maturity.png)

I've found it helpful to think about maturity in four broad stages. First, a developer uses AI as an assistant. Next, a person delegates a bounded task and checks the result. Then selected signals (say, a well-understood dependency or security finding) can start a governed task. Finally, for narrowly defined and demonstrably safe change classes, policy may allow greater autonomy.

That last stage gets the headlines. The second stage is where I'd spend my time.

Stopping at bounded delegation for now tests nearly everything that matters: task definition, identity, context quality, tool permissions, disposable execution, control feedback, provenance, human acceptance and cost. Better still, it tests those things without asking anyone to hand over release authority on day one.

A practical proof of value could use a handful of non-critical repositories and several different jobs: a dependency update, a small defect fix, a test improvement and a straightforward code change. Let more than one agent product attempt the same classes of work under equivalent constraints. Keep the evaluation focused on the _platform boundary_ as much as the quality of the generated patch.

Did it stay inside scope? Did the controls catch deliberate attempts to stray? Was the pull request useful? How much human effort did it really save? Could we reconstruct the run from its evidence? Those answers are worth more to me than an impressive demo where everything went perfectly first time.

## Where I'd go next

There's real opportunity in agents, particularly in the repetitive work that eats into engineering time. But an agent should join an existing delivery system as an accountable, limited actor, not as a special exception that gets to hop the fence.

The platform work is where much of the value will be won or lost: consistent task boundaries, secure execution, governed access, structured feedback, and telemetry that explains both the engineering outcome and the bill. Get those pieces right and we can change models, products and workflows without rebuilding our safeguards every time.

The trick, as with plenty of things in engineering, is not to put the cart before the horse. Make bounded delegation repeatable. Help the rest of the SDLC absorb the extra throughput. Then earn the right to automate more.

There's no great hurry to give the robot the keys to production. It can start by showing us a decent pull request.
