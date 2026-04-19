---
title: 'The “Fourth Pillar” of Observability (That Wasn’t Really Missing)'
date: '2026-04-19'
excerpt: 'Continuous profiling is having a moment, but is it really the fourth pillar of observability, or just something we are finally using properly?'
tags: ['observability', 'continuous-profiling', 'distributed-systems']
aiContributions: 'none'
blueskyUri: 'at://did:plc:oo4sqwem2prw2yebqexllrx3/app.bsky.feed.post/3mjupqtofle25'
---

# The “Fourth Pillar” of Observability (That Wasn’t Really Missing)

I have blogged about our journey [Migrating a Platform Engineering team to a Product Orientated Model](./engineering-platform-as-pom) before. A question came up regarding which is what should be the most important measurement to have in an engineering platform, and the perspectives around the room were widely varied and **very** interesting. As I was researching the topic for an upcoming blog article (_teaser :P_), I touched on observability trends.

Anyone who knows me, knows I have a bit of a soft spot for observability, after a previous life having worked from startup to enterprise-vendor for the best part of a decade... so I ended up down this rabbit hole in the usual way. One link led to another, a quick skim turned into a proper read, and before long I was halfway through a Hacker News thread I had no real intention of opening.

Somewhere in the middle of it all, I kept seeing the same idea repeated. "_Continuous profiling_", it said, is the fourth pillar of observability. It is a tidy, marketing-friendly way of putting things.

For years, observability has been explained through three pillars: metrics, logs, and traces. It is a helpful model, especially when you are trying to get a team aligned or decide what to instrument. It's also a favourite interview question of mine ;-) Metrics show you _when_ something changes. Logs give you a record of _what_ happened. Traces let you _follow_ a request as it moves through a system.

In practice, though, things are rarely that clean. You might notice a spike in latency in your metrics, follow it through a trace, and still not have a clear answer for why anything is actually slow. At some point you end up staring at one or more service(s) and wondering what the code is doing under the hood. That is where continuous profiling comes in, and why it is getting attention again.

Profiling itself is not new. Most developers have used a profiler at some point, usually in a local environment or when something has already gone wrong. Historically, that was for a reason. Traditional profilers often relied on heavy instrumentation or frequent interrupts, which introduced noticeable overhead and could distort the very behaviour you were trying to measure. Running them in production was risky at best and often avoided altogether.

What has changed is how the data is collected. Modern profilers tend to use sampling rather than full instrumentation, taking lightweight snapshots of the call stack at regular intervals instead of tracing every function call. On top of that, kernel-level technologies such as eBPF make it possible to gather these samples without modifying the application itself. The profiling logic runs safely within a sandboxed environment inside the kernel, while still being able to observe both user-space code and kernel activity. The profiler can attach to a running process, collect stack traces across user space and kernel space, and do so with a relatively small performance impact.

In practice, this means you can leave profiling turned on all the time. The overhead is low enough to be acceptable, and the data you get is representative of real workloads rather than a staged reproduction. That shift, more than anything, is what makes <ins>continuous</ins> profiling feel like something new.

Instead of capturing a snapshot at a single moment, you collect samples over time. Those samples build up a picture of how your application is actually spending its time. You can see which functions are hot, where CPU is being burned, and how memory usage evolves under real workloads. It is less about catching a problem in the act and more about having a record that lets you understand it after the fact.

Some of the confusion comes from the way this is described. Because profiling captures stack traces, it is easy to think of it as a kind of tracing. It looks similar at first glance, especially when visualised.

But it answers a different question. Tracing follows a request through a system. Profiling shows what the process is doing at any given moment. One gives you the path a request takes, the other shows you where the machine is actually spending its effort. They fit together quite nicely, but they are not interchangeable. Profiling runs continuously and independently, but it becomes far more useful when you can line it up with traces. One shows you that a request is slow, the other shows you what the process was doing at the time.

Another reason this feels like a new development is where profiling now lives. It is no longer something you only run locally. Modern tools can sit alongside your services or even operate below them, using techniques like eBPF to observe what is happening without requiring changes to the application itself. That opens the door to a much broader view of the system, across languages and layers, without a lot of extra work.

If you look at the discussion [here](https://news.ycombinator.com/item?id=46500900), you can see this playing out in real time. Some people are convinced this fills a long-standing gap. Others are more sceptical of the "fourth pillar" label and see it as another round of rebranding. Both views have a point.

Continuous profiling does add something important. It gives you a way to understand behaviour at the level of actual code execution, which has always been a bit awkward to get from metrics, logs, or traces alone.

At the same time, the idea of pillars has always been a (marketing-powered) simplification. Systems do not organise themselves that way, and neither do the questions we ask about them. It is often more useful to think in terms of signals and how they fit together than to try to slot everything into a fixed set of categories.

What has really changed is not that a new pillar has appeared, but that profiling has become practical to use all the time, in real systems, without much friction. That makes it far more valuable than it used to be.

In the end, whether or not you call it a fourth pillar does not matter much. What matters is that it helps close the gap between noticing that something is wrong and understanding exactly what the code is doing when it happens. And that's what helps our SREs, Developers, and everyone else on the team to do their job better.

## References

- https://news.ycombinator.com/item?id=46500900
- https://grafana.com/blog/2022/11/02/what-is-continuous-profiling/
- https://pyroscope.io/blog/what-is-continuous-profiling/
- https://www.datadoghq.com/blog/continuous-profiling-fourth-pillar/
- https://charity.wtf/2019/07/15/on-the-meaning-of-observability/

---
