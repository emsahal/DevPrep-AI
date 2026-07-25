<!--LANG:roman-->

# DevOps Interview Questions

## 1. What is CI/CD and why is it important?

**Asaan Urdu mein:**  
CI/CD ka matlab *Continuous Integration* aur *Continuous Delivery/Deployment* hai. Har code change push hone par automatically build aur test hota hai, jis se bugs jaldi pakde jate hain. Delivery stage se code ko staging ya production me deploy karna asaan ho jata hai. Isse release cycle tez hoti hai, manual galtiyan kam hoti hain, aur developers ko fast feedback milta hai.

---

## 2. What is the difference between continuous integration, continuous delivery, and continuous deployment?

**Asaan Urdu mein:**  
- **Continuous Integration (CI)**: Code ko bar‑bar merge karte hain aur har push par automated tests chalate hain.  
- **Continuous Delivery (CD)**: CI ke baad code hamesha deploy‑able state me hota hai, lekin production me jane se pehle manual approval chahiye.  
- **Continuous Deployment**: Tests pass karne ke baad code automatically production me deploy ho jata hai, koi manual gate nahi hota.

---

## 3. What is Docker and how does containerization differ from virtualization?

**Asaan Urdu mein:**  
Docker applications ko unke dependencies ke saath lightweight containers me pack karta hai. Virtual machines poora guest OS chalate hain, jabke containers host OS kernel share karte hain. Isliye containers seconds me start hote hain, kam resources use karte hain, aur development‑to‑production environment me consistency laate hain.

---

## 4. What is a Dockerfile and what are its common instructions?

**Asaan Urdu mein:**  
Dockerfile ek script hoti hai jo Docker image banane ke steps define karti hai. Common instructions me **FROM** (base image), **RUN** (commands chalana), **COPY/ADD** (files add karna), **WORKDIR**, **EXPOSE**, **ENV**, **CMD/ENTRYPOINT**, aur **HEALTHCHECK** shamil hain. Ye instructions sequentially execute hote hain aur final image create karte hain.

---

## 5. What is the difference between a Docker image and a Docker container?

**Asaan Urdu mein:**  
Docker image ek read‑only template hoti hai jo container banane ke liye instructions rakhti hai, jaise class definition. Docker container us image ka runnable instance hota hai, jisme ek writable layer hoti hai. Images registry me store hoti hain, jabke containers runtime pe isolated filesystem ke saath chalti hain.

---

## 6. What is Docker Compose used for?

**Asaan Urdu mein:**  
Docker Compose ek YAML file ke through multi‑container applications ko define aur run karta hai. Isse services, networks, aur volumes ek hi file me configure kar ke `docker compose up` se sab start ho jate hain. Ye local development, testing, aur staging me alag‑alag containers (app, DB, cache) ko asaani se manage karta hai.

---

## 7. What is Kubernetes and what problem does it solve?

**Asaan Urdu mein:**  
Kubernetes (K8s) ek container orchestration platform hai jo deployment, scaling, aur management ko automate karta hai. Ye high availability, load balancing, self‑healing, rolling updates, aur resource allocation jaise challenges ko solve karta hai, taake clusters me applications reliably chal sakein.

---

## 8. What is the difference between a Pod, a Deployment, and a Service in Kubernetes?

**Asaan Urdu mein:**  
- **Pod**: Sabse chhota deployable unit, ek ya zyada containers ka group, temporary hota hai.  
- **Deployment**: Pods ka replica set manage karta hai, scaling, rolling updates, aur self‑healing provide karta hai.  
- **Service**: Pods ke liye stable networking aur load balancing deta hai, unke dynamic IPs ko abstract karta hai.

---

## 9. What is Infrastructure as Code (IaC) and what tools support it (Terraform, CloudFormation)?

**Asaan Urdu mein:**  
IaC infrastructure ko code (machine‑readable files) ke through define karta hai, manual configuration ki jagah. Isse version control, repeatability, aur automation milti hai. Popular tools me **Terraform** (cloud‑agnostic, HCL), **AWS CloudFormation** (AWS‑specific, JSON/YAML), **Pulumi**, aur **Ansible** shamil hain.

---

## 10. What is the difference between horizontal and vertical scaling?

**Asaan Urdu mein:**  
- **Vertical scaling**: Existing machine ki CPU/RAM badhana, limited aur aksar downtime required hoti hai.  
- **Horizontal scaling**: Naye machines/instances add karna, theoretically unlimited, load balancer ke through traffic distribute hota hai, fault tolerance improve hoti hai.

---

## 11. What is a reverse proxy and how does Nginx commonly get used in deployments?

**Asaan Urdu mein:**  
Reverse proxy client requests ko backend servers tak forward karta hai. Nginx iske liye popular hai kyunki wo load balancing, SSL termination, caching, static file serving, aur rate limiting ko efficiently handle karta hai. Isse internal architecture hide hoti hai aur ek single entry point milta hai.

---

## 12. What is blue-green deployment and canary deployment?

**Asaan Urdu mein:**  
**Blue‑green**: Do identical environments (blue = current, green = new) chalate hain, testing ke baad traffic ko instantly green pe switch kar dete hain. Rollback simple hota hai – wapas blue pe switch.  
**Canary**: Naye version ko thode percent traffic (canary) pe gradually roll out karte hain, monitoring ke baad full rollout ya rollback decide karte hain, isse blast radius kam hota hai.

---

## 13. What is the purpose of environment variables and secrets management in deployment pipelines?

**Asaan Urdu mein:**  
Environment variables configuration ko code se alag rakhte hain, taake same code alag‑alag environments (dev, staging, prod) me behave kare. Secrets management sensitive data (API keys, passwords) ko securely store karta hai, hard‑coding se bachata hai, aur rotation, audit, access control enable karta hai.

---

## 14. What is a load balancer and how does it improve availability?

**Asaan Urdu mein:**  
Load balancer incoming traffic ko multiple backend servers me distribute karta hai, jisse koi single server overload nahi hota. Ye server failures detect karke traffic ko healthy instances pe redirect karta hai, isse availability aur fault tolerance improve hoti hai. Algorithms jaise round‑robin, least‑connections, ya IP‑hash use hote hain.

---

## 15. What is monitoring vs logging vs alerting in a production system?

**Asaan Urdu mein:**  
- **Monitoring**: Metrics (CPU, latency, error rate) collect aur visualize karta hai, system health track karta hai.  
- **Logging**: Detailed event records store karta hai, debugging aur audit ke liye useful hota hai.  
- **Alerting**: Pre‑defined thresholds ke against metrics evaluate karta hai aur engineers ko (PagerDuty, Slack) notify karta hai. Ye teeno milke production observability banate hain.

---

## 16. What is the difference between a monolithic architecture and microservices?

**Asaan Urdu mein:**  
- **Monolithic**: Saari functionality ek single codebase aur deployment unit me hoti hai; shuru me simple lekin scale aur maintain karna mushkil hota jata hai.  
- **Microservices**: Application ko independent services me split karta hai, har service apni database aur deployment pipeline rakhti hai, independent scaling aur deployment possible hoti hai, lekin networking, data consistency, aur ops complexity barh jati hai.

---

## 17. What is the purpose of a CI/CD pipeline stage like build, test, and deploy?

**Asaan Urdu mein:**  
- **Build**: Source code ko compile ya Docker image jaise deployable artifact me convert karta hai.  
- **Test**: Unit, integration, aur end‑to‑end tests chalakar code quality ensure karta hai, regressions rokta hai.  
- **Deploy**: Verified artifact ko target environment (staging/production) me push karta hai. Har stage failure hone par agla stage stop ho jata hai, isse safety barhti hai.

---

## 18. What is the role of a reverse proxy/API gateway in a microservices architecture?

**Asaan Urdu mein:**  
API gateway sab client requests ka single entry point hota hai, unhe appropriate microservice tak route karta hai. Ye authentication, rate limiting, request transformation, aggregation, caching, aur protocol translation jaise cross‑cutting concerns handle karta hai, taake har microservice ko in features ko individually implement na karna pade.

---

## 19. What is the difference between staging and production environments?

**Asaan Urdu mein:**  
- **Staging**: Production ka near replica hota hai, final testing ke liye use hota hai, usually scaled‑down resources aur dummy data ke saath.  
- **Production**: Real users ka traffic handle karta hai, full redundancy, monitoring, backup, aur strict access controls hoti hain. Configuration dono me environment variables ke through alag hoti hai.

---

## 20. How would you roll back a failed deployment?

**Asaan Urdu mein:**  
- Kubernetes me `kubectl rollout undo deployment/<name>` se previous revision restore hoti hai.  
- Blue‑green setup me traffic ko wapas old (blue) environment pe switch karte hain.  
- Docker Compose me image tag revert karke services restart karte hain.  
- Rollback ke baad health checks run karte hain aur root cause analysis karte hain.

---

<!--LANG:english-->

# DevOps Interview Questions

## 1. What is CI/CD and why is it important?

- **Continuous Integration (CI)** automatically builds and runs tests on every code push, catching defects early.  
- **Continuous Delivery (CD)** ensures the codebase is always in a deployable state, adding a manual approval step before production.  
- **Continuous Deployment** goes a step further by automatically releasing every successful change to production.  

💡 **Why it matters:** Faster release cycles, reduced manual errors, and immediate feedback for developers.

---

## 2. What is the difference between continuous integration, continuous delivery, and continuous deployment?

| Aspect                     | **Continuous Integration** | **Continuous Delivery** | **Continuous Deployment** |
|----------------------------|----------------------------|--------------------------|---------------------------|
| Goal                       | Merge & test frequently   | Keep code deployable     | Auto‑deploy after tests   |
| Deployment gate            | None (only build)         | Manual approval required| Fully automated           |
| Typical use case          | Early bug detection       | Staging environment ready| Production push on every pass |

---

## 3. What is Docker and how does containerization differ from virtualization?

- **Docker** packages an application with its runtime dependencies into a lightweight, portable **container**.  
- **Virtual machines** run a full guest OS on a hypervisor, while containers share the host kernel and isolate at the process level.  
- Benefits: faster start‑up (seconds vs minutes), lower resource consumption, and consistent environments across dev and prod.

---

## 4. What is a Dockerfile and what are its common instructions?

A **Dockerfile** is a declarative script that defines how to build a Docker **image**. Common directives include:

- `FROM` – base image  
- `RUN` – execute shell commands  
- `COPY` / `ADD` – add files to the image  
- `WORKDIR` – set working directory  
- `EXPOSE` – declare listening ports  
- `ENV` – set environment variables  
- `CMD` / `ENTRYPOINT` – default command to run  
- `HEALTHCHECK` – define container health probe  

These instructions are processed sequentially to produce a reproducible image.

---

## 5. What is the difference between a Docker image and a Docker container?

| Feature                | **Docker Image**                                 | **Docker Container**                               |
|-----------------------|--------------------------------------------------|----------------------------------------------------|
| Nature                | Read‑only template (like a class)               | Writable runtime instance (like an object)        |
| Storage               | Stored in registries (Docker Hub, ECR, etc.)     | Lives on the host with a thin writable layer      |
| Lifecycle             | Built once, versioned, immutable                 | Created from an image, can be started/stopped, deleted |
| Usage                 | Shared across many containers                    | Executes the application code in isolation       |

---

## 6. What is Docker Compose used for?

Docker Compose lets you define **multi‑container** applications in a single `docker‑compose.yml` file. You can configure services, networks, and volumes, then spin up the whole stack with `docker compose up`. It’s ideal for local development, testing, and staging where several inter‑dependent services (app, DB, cache, etc.) must run together.

---

## 7. What is Kubernetes and what problem does it solve?

**Kubernetes (K8s)** is a container orchestration platform that automates:

- **Deployment** of containers across a cluster  
- **Scaling** (horizontal pod autoscaling)  
- **Self‑healing** (restart failed pods, replace unhealthy nodes)  
- **Load balancing** and **rolling updates**  

It abstracts away the underlying infrastructure, ensuring the desired state of applications is maintained even during failures or traffic spikes.

---

## 8. What is the difference between a Pod, a Deployment, and a Service in Kubernetes?

| Object      | Purpose | Lifecycle Management | Networking |
|------------|---------|----------------------|------------|
| **Pod**    | Smallest deployable unit (one or more containers) | Created directly; usually managed by higher‑level objects | Gets its own IP, but is transient |
| **Deployment** | Manages a set of Pods via a ReplicaSet | Handles scaling, rolling updates, and self‑healing | Exposes Pods through a Service or Ingress |
| **Service** | Provides a stable endpoint (IP/ DNS) for a group of Pods | Independent of Pods; updates automatically as Pods change | Load‑balances traffic to the selected Pods |

---

## 9. What is Infrastructure as Code (IaC) and what tools support it (Terraform, CloudFormation)?

**Infrastructure as Code** treats infrastructure (servers, networks, databases) as version‑controlled code. Benefits include repeatable environments, automated provisioning, and easy rollback. Popular IaC tools:

| Tool | Scope | Language |
|------|-------|----------|
| **Terraform** | Multi‑cloud, provider‑agnostic | HCL |
| **AWS CloudFormation** | AWS‑only | JSON / YAML |
| **Pulumi** | Multi‑cloud, uses general‑purpose languages | TypeScript, Python, Go, etc. |
| **Ansible** | Configuration management & provisioning | YAML (Playbooks) |

---

## 10. What is the difference between horizontal and vertical scaling?

| Scaling Type | How it works | Advantages | Limitations |
|--------------|--------------|------------|-------------|
| **Horizontal** (scale‑out) | Add more instances/Pods to a pool | Near‑infinite capacity, fault tolerance, works with load balancers | Requires stateless design or data sharding |
| **Vertical** (scale‑up) | Increase CPU/RAM of an existing machine | Simple to implement for legacy apps | Physical limits, often needs downtime, higher cost per unit |

---

## 11. What is a reverse proxy and how does Nginx commonly get used in deployments?

A **reverse proxy** sits in front of backend servers, forwarding client requests. **Nginx** is frequently used because it can:

- Perform **load balancing** across multiple upstreams  
- Terminate **SSL/TLS** connections  
- Serve **static assets** efficiently  
- Implement **rate limiting**, caching, and request rewriting  

This centralizes entry‑point logic and hides the internal service topology.

---

## 12. What is blue-green deployment and canary deployment?

| Strategy | Traffic Switch | Risk Management | Typical Use |
|----------|----------------|------------------|-------------|
| **Blue‑Green** | Instant DNS or Service selector swap from *blue* (current) to *green* (new) | Zero‑downtime, immediate rollback by switching back | Major releases, database migrations |
| **Canary** | Gradual shift (e.g., 5 % → 100 %) using load balancer or service mesh | Limits blast radius, monitors health before full rollout | Continuous delivery, feature flags |

---

## 13. What is the purpose of environment variables and secrets management in deployment pipelines?

- **Environment variables** decouple configuration from code, allowing the same binary to run with different settings (dev, staging, prod).  
- **Secrets management** stores sensitive data (API keys, passwords) securely, avoiding hard‑coding. It provides rotation, audit logs, and fine‑grained access control.  

Together they enable **12‑factor app** principles and improve security posture.

---

## 14. What is a load balancer and how does it improve availability?

A **load balancer** distributes incoming traffic across multiple backend instances, preventing any single server from becoming a bottleneck. It enhances availability by:

- Performing health checks and routing around failed nodes  
- Supporting SSL termination and session persistence  
- Offering algorithms like **round‑robin**, **least connections**, and **IP hash**  

Result: higher throughput, fault tolerance, and smoother scaling.

---

## 15. What is monitoring vs logging vs alerting in a production system?

- **Monitoring**: Collects quantitative metrics (CPU, latency, error rates) and visualizes them on dashboards.  
- **Logging**: Captures detailed, timestamped event records for debugging and forensic analysis.  
- **Alerting**: Evaluates metrics against thresholds and notifies engineers (PagerDuty, Slack) when anomalies occur.  

These three form the **observability triad**, giving both real‑time insight and post‑mortem data.

---

## 16. What is the difference between a monolithic architecture and microservices?

| Aspect | **Monolithic** | **Microservices** |
|--------|----------------|-------------------|
| **Codebase** | Single repository, tightly coupled | Multiple independent services, each with its own repo |
| **Deployment** | One unit (single binary/container) | Independent deployable units per service |
| **Scaling** | Scale whole app, even if only one part needs it | Scale individual services as needed |
| **Complexity** | Simpler to start, harder to evolve | Higher operational overhead (networking, data consistency) |
| **Fault Isolation** | Failure can bring down entire app | Failures isolated to affected service |

---

## 17. What is the purpose of a CI/CD pipeline stage like build, test, and deploy?

- **Build**: Compiles source code and creates deployable artifacts (e.g., Docker images).  
- **Test**: Executes unit, integration, and end‑to‑end tests to verify functionality and prevent regressions.  
- **Deploy**: Pushes the verified artifact to a target environment (staging or production).  

Each stage acts as a **gate**; a failure stops the pipeline, ensuring only quality code progresses.

---

## 18. What is the role of a reverse proxy/API gateway in a microservices architecture?

An **API gateway** provides a single entry point for client requests and routes them to the appropriate microservice. It centralizes cross‑cutting concerns such as:

- Authentication & authorization  
- Rate limiting & throttling  
- Request/response transformation  
- Service aggregation and caching  

By offloading these responsibilities from individual services, the gateway simplifies service design and improves security.

---

## 19. What is the difference between staging and production environments?

| Feature | **Staging** | **Production** |
|---------|-------------|----------------|
| **Purpose** | Final validation before release | Serves real users |
| **Data** | Synthetic or masked data | Live production data |
| **Scale** | Often smaller, cost‑optimized | Full‑scale, high‑availability setup |
| **Access Controls** | More permissive for testing | Strict, audit‑ready |
| **Configuration** | Separate environment variables (e.g., `NODE_ENV=staging`) | `NODE_ENV=production` with tighter security |

Staging mirrors production as closely as possible to catch issues early.

---

## 20. How would you roll back a failed deployment?

- **Kubernetes**: `kubectl rollout undo deployment/<name>` restores the previous replica set.  
- **Blue‑Green**: Switch the service selector back to the stable (blue) version.  
- **Docker Compose**: Revert the image tag in the compose file and restart services.  
- After rollback, run health checks, verify stability, and investigate the root cause before the next release.

---