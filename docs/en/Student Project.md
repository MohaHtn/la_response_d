The project consists of developing an **MVP (Minimum Viable Product)** of an online digital library.

During the course, we will form **heterogeneous pairs** (associating students with different skills and backgrounds) and work on the different stages of **design** and **development**.  
The objective is for each pair to take charge of a part of the project autonomously and responsibly.

In turn, the pairs will also have the task of **evaluating others' work**. This **cross-evaluation** exercise will not only develop a critical and constructive perspective, but also draw lessons to improve their own practices and the quality of their deliverables.  
Peer evaluation will be fully part of the **final grade**.

For this, we will follow the principles of the **[Agile Unified Process](https://en.wikipedia.org/wiki/Agile_unified_process) (AUP)** method, proposed by Scott Ambler.  
This approach constitutes a **fusion between agile methods and the Y-cycle**, combining the rigor of object-oriented modeling with the flexibility of short and incremental iterations.  
It also encourages collaborative practices such as **Pair Programming**, promoting code quality, knowledge diffusion and error reduction.

It is imperative to rely on the excerpts from my course on [**Software Architecture**](https://github.com/michaellaunay/NotesPubliques/blob/master/cours/Architecture%20des%20logiciels.md) provided in appendices.

# Subject: Design and architecture of a decentralized digital library

## General Presentation

The project consists of developing a library of digitized works. Each library user can propose digital files and request their sharing. For example, works can be scanned books in PDF format, which raises the problem of intellectual property which will then be **resolved** by moderation from librarians.

For compatibility reasons with existing systems, the development language **imposed by the client is Python**.

The **web framework** chosen on the server side is **Pyramid**, and the template language used is **TAL/METAL** (inherited from Zope/Plone, ensuring compatibility with history).

On the client side, the choice is left to developers:

- either **SolidJS**, a modern "React-like" framework based on JSX, performant and flexible,
- or **Bootstrap**, a more traditional ("old school") solution but simple to implement and quick for prototyping.

The documents **managed** by the application must be managed through a Git repository and not a traditional **database** for the reason that ultimately an application must be developed allowing terminals (computer or mobile phone) to have texts in the form of a file **tree**. For those who are not comfortable with Git, there is a series of free training courses: [https://www.youtube.com/watch?v=0sGQgfUdCAY](https://www.youtube.com/watch?v=0sGQgfUdCAY)

However, it is required that **each functionality be developed in a modular way**, independent of the rest of the system, and can be **used and tested on the command line** to facilitate continuous integration and unit validation.

Given the deadlines, the use of **artificial intelligence** is **strongly recommended**, but it must be **fully documented and traceable**. Conversations (prompts) will be the subject of class debates. To prepare for this, students must, before class, watch and understand the video: [**The 4 steps to train an LLM**](https://www.youtube.com/watch?v=YcIbZGTRMjI).

This project serves as educational support to address the concepts of **object-oriented software architecture**, **UML modeling**, **design patterns**, and **documentation**.

During the course, students will work in **heterogeneous pairs** (different skills and backgrounds). Each pair will have the mission of taking charge of part of the design and development, then presenting and justifying their choices.

It is imperative to respect the **excerpts from the Software Architecture course** given in appendices (architect roles, OO design, quality attributes, architectural views, documentation, importance of naming, etc.).

---

### Project Context

The **CultureDiffusion** association wishes to create a **decentralized digital library**.

#### Functional Objectives:

- Allow each member to digitize works in PDF format and propose them for loan.
- Enable text recognition of digitized works via several AIs (Gemini, Pixtral).
- Offer free access to public domain works.
- Allow rental of "digital" copyrighted works for a period of two weeks.
- Automatically distribute works that have become copyright-free to all members with shared disk space.
- Allow downloading of works in Markdown format.
- Manage the process allowing librarians to ensure **moderation** of works deposited on the platform by members (verification, metadata enrichment, validation or rejection).
- Manage rights and copies according to current legislation.

#### Library repository structure (directory metaphor):

- `fond_commun`: copyright-free works made available by the association.
- `emprunts`: borrowed copyrighted works, encrypted with the member's key.
- `sequestre`: copyrighted works pending, managed by the association, with restricted access.
- `a_moderer`: works proposed by members, awaiting validation by a librarian.

#### Work Classification:

- **Books**: Comics, Novels, Youth, Technical, Education, Culture, Health, etc.
- **Music**: Classical, Jazz, Pop, Metal, etc.
- **Videos**: SF, History, Series, Documentaries, etc.
- **Articles**.  
    A work can belong to several categories simultaneously.

### Required Work

#### Part 1: Analysis and glossary

1. Identify the **concepts** (entities, roles, actions, properties) in the specifications.
2. Develop a **business glossary** and a **technical glossary** (clear definitions, alphabetically sorted).
3. Justify your vocabulary choices in relation to the importance of **names and naming conventions (5.5)**.

#### Part 2: UML Modeling

- Create the global **use case diagram**.
- List the **fundamental scenarios** of the application, add if necessary.
    - Example: application installation, becoming a member, borrowing a work, proposing a work, recognizing text and diagrams of a work, moderating a work, consulting the common fund, exporting a work to Markdown format.
- Sort scenarios by order of importance.
- Produce **at least 4 system sequence diagrams** of the main scenarios, including 2 that will not have been proposed by any other pair.
- Create **5 class diagrams** associated with the most critical scenarios.
- Produce a **global class diagram** detailing associations and their cardinalities.
- Provide **activity diagrams** to understand documentary processes (workflows).

#### Part 3: Architecture choices

1. Describe the chosen **software architecture** (e.g. layered architecture, service-oriented, simplified micro-services).
2. Justify your choices with regard to **quality attributes** (performance, security, maintainability, modularity, scalability).
3. Identify the **design patterns** used (e.g. Singleton, Factory, Observer, Strategy) and justify their relevance in this project.
4. Explain how **documentation** (chapter 3 of appendices) will be integrated into the project workflow (use of Markdown, Git, integrated UML diagrams).

#### Part 4: Naming and quality

1. Define a **naming guide** adapted to the project (inspired by §5.5: consistency, conventions, readability).
2. Verify consistency between:
    
    - the business glossary,
    - UML classes and modules,
    - scenarios,
    - documentation.
        
3. Propose the use of **automatic tools** (linters, formatting rules, CI/CD for documentation) to reinforce quality.
    

---

### Constraints

- Use **PlantUML** or **Mermaid** or **D2** for your diagrams (AI can do diagram conversion, but you must verify the produced semantics).
- Respect the principles of **object-oriented design** (encapsulation, inheritance, polymorphism).
- Explicitly integrate the concepts of **architectural views** (logical, process, development, physical).
- Document your choices in a **structured Git repository** (see chapter 5 of appendices).

---

### Expected Deliverables

1. Business and technical glossary (Markdown).
2. Use case diagram + detailed scenarios (Markdown + PlantUML).
3. Sequence diagrams (PlantUML).
4. Class diagrams (scenarios and global).
5. Document justifying architecture and design pattern choices.
6. Naming guide (Markdown).
7. Documented Git repository with tree structure compliant with course recommendations.
8. Summary implementation of main functionalities as independent scripts that can be integrated into a whole or used independently (plan for .env usage for configuring keys to query AIs).
9. Unit tests
10. Integration tests.
11. Validation tests

---

# Appendices

----

**1.3 Roles and responsibilities of the software architect**

A software architect plays a crucial role in the development of software systems. Their responsibilities are vast and varied, ranging from technical design to coordinating development teams. Let's examine some of these roles and responsibilities in more detail.

**System architecture design**: The main role of the software architect is to design the system architecture. This involves understanding system requirements, both functional and non-functional, and designing a structure that meets these requirements while considering technical constraints and trade-offs.

**Making architectural decisions**: The software architect is responsible for making key architectural decisions that influence the structure and behavior of the system. This includes technology selection, interface definition, system division into components, and defining how these components interact.

**Architecture documentation**: The software architect is responsible for documenting the system architecture. This documentation provides a system overview and serves as a guide for developers and other stakeholders. It describes system components, their interactions, architectural decisions made, and the reasons for these decisions.

**Communication with other development team members**: The software architect must communicate effectively with other development team members. This includes explaining the architecture, facilitating team understanding of the architecture, resolving architectural problems and coordinating development efforts.

**Architectural quality control**: The architect is also responsible for ensuring that the software architecture is properly implemented and maintained over time. This involves evaluating the architecture to ensure it meets quality standards, identifying and resolving architectural problems and ensuring that system modifications remain compliant with the architecture.

**Technology planning and management**: The software architect must also consider technological evolution. This involves staying up to date on new technologies and methodologies, planning the integration of new technologies into existing architecture and managing system architecture evolution over time.

## 1.5 Relationship between software architecture and object-oriented design

Object-oriented design (OOD) is a software design and development method that uses "objects" - instances of classes, which are often representations of real-world things. OOD integrates concepts such as encapsulation, inheritance and polymorphism, to promote more natural and logical code structuring. This design method has a significant impact on software architecture, as it provides the building blocks for implementing system architecture.

**Implementing software architecture with OOD**: Software architecture defines the high-level structure of a system, while OOD provides the mechanisms to realize this structure. For example, architectural components can be mapped to classes or groups of classes in an object-oriented system. Interfaces, which define how components communicate, can be mapped to interfaces or abstract classes in OOD. Additionally, architecture patterns can be easily implemented using object-oriented design patterns.

**Influence of OOD concepts on software architecture**: Key concepts of OOD, such as encapsulation, inheritance and polymorphism, can greatly influence software architecture design. For example, encapsulation, which is hiding the internal details of an object and only exposing an interface to interact with that object, promotes decoupling between components and makes the system more modular. Inheritance allows creating component hierarchies and promoting code reuse. Polymorphism, which allows an object to be used as an instance of multiple types, can be used to make the system more extensible and flexible.

See [[Design patterns]]

## 1.6 Quality attributes in software architecture

Quality attributes are non-functional characteristics of a system that determine how it behaves. They are crucial in software architecture design, as they influence architectural decisions and have a direct impact on the quality of the final system. Here are some quality attributes commonly used in software architecture:

### 1.6.1 Performance

Performance refers to how quickly a system responds to a request or set of requests. It is often measured in terms of response time, throughput or resource utilization. A good architect must design the system to meet performance requirements, while considering available resources.

### 1.6.2 Security

Security is a system's ability to resist malicious attacks and protect the data and services it provides. This involves designing the system to minimize vulnerabilities and resist attacks, while allowing rapid recovery in case of security breach.

### 1.6.3 Maintainability

Maintainability is the ease with which a system can be modified to correct defects, improve its performance, or adapt the system to a modified environment. This requires clear and understandable design, use of consistent coding conventions, good documentation and adequate testing.

#### 1.6.4 Modularity

Modularity is the degree to which a system can be divided into independent modules. A modular system facilitates maintainability, scalability and code reuse. It also allows developing and testing individual modules, which can improve development team productivity.

### 1.6.5 Scalability

Scalability is a system's ability to handle an increase in workload. For example, a system can be designed to be scalable by adding more hardware resources, or by allowing more features or modules to be added over time.

### 1.6.6 Conclusion on quality

Quality attributes are essential considerations in software architecture design. They guide architectural decisions and influence overall system quality. A good architect must understand these quality attributes, know how to balance them and make informed decisions that promote achieving these quality objectives.

## 1.8 Architectural views
