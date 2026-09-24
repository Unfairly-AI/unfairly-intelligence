---
name: find-company-playbook
description: Find and apply an approved company playbook when an employee asks how the organization handles a task, wants a reusable workflow, or starts work that may match an existing method.
---

# Find a company playbook

Search the company's approved methods before inventing a new workflow: use the Unfairly connector's `find_skill` tool (then `run_skill` to load one), or `unfairly intelligence playbooks --query "<employee goal>"` if the Unfairly CLI is installed. Prefer a published playbook; label a pilot-ready playbook as a pilot.

Show the employee the playbook title, intended outcome, owner, source requirements, and ordered steps. Ask before taking consequential actions. When the playbook is used, preserve its identifier and version in Unfairly Intelligence workflow context so reuse and downstream outcomes can be measured.

Never expose another employee's prompts, responses, files, source code, or private session history. If no playbook matches, complete the work normally and offer to propose the successful method as a new learning.
