<div align="center">

# AiO World

### One tab for the things that matter in student life.

**Learn. Build. Discover. Play.**

AiO World is a browser-first platform designed around the everyday life of a student —
from academics and career preparation to campus information, useful tools, opportunities, and time with friends.

**No downloads. No unnecessary friction. Just open the web and get things done.**

<br />

[Explore the Project](#) · [Getting Started](#getting-started) · [Architecture](#architecture) · [Roadmap](#roadmap)

</div>

---

## Why AiO World?

Student life is fragmented.

Important information lives across college websites, PDFs, Moodle, Google Classroom, email, WhatsApp groups, notice boards, career platforms, spreadsheets, and dozens of unrelated websites.

At the same time, students constantly need different things:

* *What changed in my timetable today?*
* *When is my assignment due?*
* *Where is that college notice?*
* *How do I learn DSA?*
* *Which internship should I prepare for?*
* *How do I calculate the attendance I need?*
* *What hackathons are happening?*
* *I have 20 minutes. What can I do?*
* *What can I play with my friends right now?*

AiO World is built around a simple idea:

> **The student should not have to search everywhere for the next thing they need.**

Instead, the platform brings relevant information, tools, opportunities, learning paths, and experiences into one browser-first environment.

---

# What can you do on AiO World?

The platform is organized into a set of focused experiences rather than one overloaded dashboard.

| Experience           | Purpose                                   | Examples                                                               |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| 🎓 **Campus**        | Understand what is happening around you   | Notices, timetable changes, exams, mess, transport, campus events      |
| 📚 **Learn**         | Turn learning goals into actionable paths | DSA, Web Development, Cybersecurity, resources, courses                |
| 🚀 **Career**        | Move from learning to opportunities       | Internships, projects, resume tools, skill gaps, interview preparation |
| 🎯 **Opportunities** | Discover things worth acting on           | Hackathons, competitions, workshops, scholarships, college events      |
| 🧰 **Tools**         | Solve everyday student problems           | Attendance, CGPA/SGPA, planners, calculators and utilities             |
| 🎮 **Play**          | Make the browser useful for fun too       | Guess Who, trivia, multiplayer games, themed experiences               |
| 🌱 **Beyond Campus** | Explore life outside academics            | Hobbies, books, podcasts, fitness, cooking and interests               |

These experiences share the same principle:

> **Give the user the right thing with as little friction as possible.**

---

# 🏫 Campus Intelligence

One of the core ideas behind AiO World is **College Information Archaeology**.

College information is constantly changing and scattered across different systems.

A timetable may change after it was published.
An assignment deadline may be extended.
A bus route may be modified.
A mess menu may be updated.
An important notice may replace an older notice.

AiO World aims to turn these fragmented sources into a structured, time-aware campus information layer.

### Instead of:

> “There is a new PDF.”

We want to eventually tell the student:

> **Your Operating Systems class tomorrow has been moved from 10:00 AM to 2:00 PM.**

With provenance:

```text
Source: Faculty / Moodle
Published: 18 Sept, 08:12
Change: 10:00 AM → 2:00 PM
Status: Current
```

### The long-term campus pipeline

```text
College Sources
      │
      ├── Website
      ├── Moodle
      ├── Email
      ├── Google Classroom
      ├── PDFs
      ├── Academic Calendar
      └── Authorized / Community Sources
                │
                ▼
         Information Ingestion
                │
                ▼
       Extraction & Classification
                │
                ▼
       Change / Version Detection
                │
                ▼
       Campus Knowledge Graph
                │
                ▼
       Student Context & Relevance
                │
                ▼
       Notifications & Experience
```

The goal is not simply to store documents.

The goal is to understand:

> **What changed, when did it change, what replaced it, and who does it affect?**

---

# 🎯 Personalization

AiO World is designed around **student context**, not generic content.

During onboarding, a student may optionally provide information such as:

```text
College
Branch
Year
Courses
Location
Interests
Skills
Career goals
Preferences
```

That context can power different parts of the platform.

For example:

### A CSE student interested in cybersecurity

Instead of showing every campus update:

```text
Your relevant updates

🔴 CSE timetable changed
🟡 Cybersecurity workshop tomorrow
🟢 Cybersecurity internship — applications open
🟢 College hackathon — registration closes Friday
📚 Recommended learning path: Network Security
```

The system should prioritize **relevance over volume**.

Personalization should make the product quieter and more useful — not noisier.

---

# 🔔 Change Detection & Notifications

A major future capability is proactive campus awareness.

The student shouldn't have to repeatedly check:

* Moodle
* Email
* College websites
* Timetables
* Notice boards
* Bus updates
* Event pages

When authorized integrations or reliable sources expose a relevant change, AiO World can identify the event and determine whether it affects the student.

For example:

```text
Original timetable
10:00 AM — Operating Systems

          ↓

Faculty update
"Today's class moved to 2 PM."

          ↓

Change Detection

          ↓

Student Context

CSE · 3rd Year · Section B

          ↓

Notification

🔴 Operating Systems changed

Your class moved:
10:00 AM → 2:00 PM
```

The system should also preserve the history of changes rather than silently overwriting the past.

---

# 🤖 AI — Where It Belongs

AI is a component of AiO World, not the product itself.

We deliberately avoid adding AI simply because it is fashionable.

Potential legitimate uses include:

* extracting structured information from unstructured documents
* understanding changes in notices and messages
* semantic search
* resume analysis
* skill-gap analysis
* personalized recommendations
* classifying and connecting information
* understanding natural-language queries

AI should not be used where deterministic software is more reliable.

For example:

```text
2 classes attended
10 total classes

Attendance = 20%
```

does not require AI.

A calculator is better.

Our principle:

> **Use AI where ambiguity exists. Use normal software where certainty is possible.**

---

# 🎮 Browser-First Experiences

AiO World also explores the browser as a place to have fun — not just a place to work.

The philosophy is simple:

> **Open → choose → play.**

Potential experiences include:

* Guess Who
* Trivia
* Multiplayer mini-games
* Movie and TV themed games
* F1 / football experiences
* Couple and friend games
* Small interactive experiments

The goal is not to become another massive gaming platform.

The goal is to make small, polished experiences that require:

**No download. No complicated setup. No unnecessary friction.**

For multiplayer experiences, the platform may eventually use real-time infrastructure such as WebSockets / Socket.IO.

---

# 🌱 Beyond Campus

Student life does not end at academics and placements.

AiO World may eventually provide an optional space for personal interests:

* 🍳 Easy recipes for students
* 🏃 Fitness and activities
* 📚 Books
* 🎧 Podcasts
* 📝 Blogs and articles
* 🎨 Hobbies
* 🎵 Music
* 🌍 Travel and exploration

Students may optionally choose to make selected interests discoverable and connect with people who share them.

This remains intentionally peripheral to the core product.

**AiO World is not intended to become another social media platform.**

---

# 🧠 Product Principles

### 01 — Value before features

A feature must solve a real problem.

### 02 — Friction is a bug

If something can be useful without an account, don't force authentication.

### 03 — Relevance over volume

More information is not necessarily better information.

### 04 — Source before confidence

Important information should have traceable provenance whenever possible.

### 05 — Current state + history

When information changes, the system should understand both what is true now and what was true before.

### 06 — AI with a job

Every AI component must have a defensible reason to exist.

### 07 — Simple architecture first

We would rather have a well-engineered modular monolith than unnecessary
