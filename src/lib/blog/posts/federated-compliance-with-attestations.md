---
title: 'Federated CI/CD Compliance: Attestation and Verification Approach'
date: '2025-12-15'
excerpt: 'Ensuring application provenance and attestation in a platform with implicit Distributed Trust.'
tags: ['Attestations', 'SLSA', 'Secure Software Supply Chain', 'Platform Engineering']
aiContributions: 'considerable'
---

# Federated CI/CD Compliance: Attestation and Verification Approach

## Preface

Modern platforms are evolving to grant developers greater autonomy, offering a la carte capabilities tailored to their needs. In highly regulated environments, this shift towards distributed trust creates a paradox with the centralized, enforced controls of previous template-driven approaches. This article delves into deployable methods aligned with the Supply-chain Levels for Software Artifacts (SLSA) framework, where builds are signed and attestations/provenance are centrally verified to ensure compliance with security and control standards. Multiple AI agents were consulted during the research for this article.

## Introduction

In modern software development, ensuring compliance in continuous integration and continuous deployment (CI/CD) pipelines is crucial. Traditional centralized governance models often rely on rigid templates that limit developer autonomy. This article explores a shift towards a federated approach using attestation and verification to maintain compliance while empowering teams to build their own pipelines.

## Executive Summary

We're transitioning from centralized CI/CD governance to an engineering platform that enables teams to create their own pipelines. The governance requirements remain unchanged: we must reliably report compliance across security scans, test coverage, licensing, and source controls. The proposed solution is a decoupled attestation service that verifies evidence emitted by pipelines, regardless of the CI system or specific scanning tools used, as no all-encompassing commercial solution currently exists.

## Key Findings

- Verifiable evidence is more reliable than template enforcement. Signed artifacts and signed provenance/attestations provide cryptographic proof of integrity and origin, enabling policy checks at release promotion and pull request gates.
- Software Bill of Materials (SBOMs) should focus on inventory and link to provenance/attestations, not embed all compliance details. External references keep SBOMs clean while providing dereference paths to signed evidence and tool reports.
- Decoupled verification enables tool choice. The attestation service validates signed predicates and queries external systems via their APIs, making scanners and CI systems swappable without changing the verifier.

## Recommendations

- Adopt a signed attestation approach for all releases; generate in-toto/SLSA predicates and sign with a suitable tool.
- Keep SBOMs (CycloneDX or SPDX) as inventory and link to provenance and scanner reports via external references.
- Implement a decoupled Attestation Service with an Ingest API, signature verification, policy evaluation, evidence storage, and reporting.
- Enforce promotion and pull request gates using branch protection and a single Compliance check that summarizes the attestation.

## Problem Statement

We need to verify that developer-authored pipelines satisfy mandatory governance controls while avoiding rigid, centralized templates. Developers can skip steps if not enforced; therefore, trust must shift from pipeline shape to verifiable evidence and independent verification.

These verifications must be both automated and retrospectively reviewed in accordance with governance guidelines and reporting obligations.

## Architecture Overview

The attestation service acts as a central, tool-agnostic verifier. Pipelines produce artifacts, SBOMs, and a signed attestation (provenance + control outcomes). The service verifies signatures, evaluates policy thresholds, and records results. Promotion and merges are gated on compliance.

### Logical Components

- Pipelines (Jenkins, GitHub Actions) produce build outputs, run scanners, generate SBOMs, and publish signed attestations.
- Attestation Service: REST ingest, signature verification, policy evaluation, evidence store, reporting UI/API.
- Repository and SBOM store: Hosts artifacts, SBOMs, and metadata; APIs expose summary metrics and SBOM exports.
- Pull request and promotion gates: Branch protection requires Compliance checks; the Checks API provides detailed feedback.

### System Flows

- Build and scan: run security scans; produce SBOM; assemble predicate with outcomes.
- Sign and publish: sign artifacts and attestations; push to repository; include SBOM external references to attestations and relevant reports.
- Ingest and verify: pipeline posts summary; service verifies signatures, validates predicates against policies, and queries tool APIs to confirm thresholds.
- Gate and report: promotion or merge proceeds only if verified; dashboards read evidence store and repository metadata.

### Decoupling Strategy

Decoupling tactics:

- Use a standard predicate schema (e.g., in-toto/SLSA).
- Use SBOM external references to connect inventory to reports and attestations.
- Implement verification adapters that call scanner APIs to resolve summaries; policies evaluate generic metrics (critical/high counts, coverage percentages, license compliance).

The verification lookups are explicitly decoupled from specific tools and CI systems. The service consumes standard inputs and performs lookups via well-defined API adapters, enabling swapping scanners or CI platforms without altering verification logic.

### Comparative Assessment

| Aspect                      | Template-based enforcement                         | Attestation service (decoupled verification)                                |
| --------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| Control assurance           | High, but only within template boundaries          | High when signatures and independent verification are enforced              |
| Developer autonomy          | Lower                                              | Higher                                                                      |
| Tool flexibility            | Lower; templates often encode specific steps/tools | Higher; scanners and CI systems can be swapped as long as evidence conforms |
| Auditability                | Moderate; infer from template usage                | Strong; cryptographically verifiable evidence and independent checks        |
| Scalability across CI tools | Moderate                                           | Strong                                                                      |
| Reporting ease              | Moderate                                           | Strong; metadata plus dereference to signed artifacts                       |

## Evidence Schema

### Predicate (example fields; tool-agnostic)

```json
{
	"_type": "https://in-toto.io/Statement/v1",
	"subject": {
		"name": "ghcr.io/org/service-a",
		"digest": { "sha256": "REPLACE_WITH_DIGEST" }
	},
	"predicateType": "https://slsa.dev/provenance/v1",
	"predicate": {
		"buildDefinition": {
			"buildType": "https://github.com/Attestations/GitHubActionsWorkflow@v1",
			"externalParameters": {
				"source": "git+https://github.com/org/repo",
				"configSource": {
					"uri": "git+https://github.com/org/repo",
					"digest": { "sha256": "REPLACE_WITH_COMMIT" },
					"entryPoint": ".github/workflows/build.yml"
				}
			},
			"resolvedDependencies": [
				{
					"uri": "git+https://github.com/org/repo",
					"digest": { "sha256": "REPLACE_WITH_COMMIT" },
					"name": "org/repo"
				}
			]
		},
		"runDetails": {
			"builder": {
				"id": "https://github.com/actions/runner"
			},
			"metadata": {
				"invocationId": "https://github.com/org/repo/actions/runs/1234567890",
				"startedOn": "2023-01-01T00:00:00Z",
				"finishedOn": "2023-01-01T01:00:00Z"
			},
			"byproducts": [
				{
					"uri": "https://repository.example.com/artifacts/service-a/1.0.0/sbom.json",
					"digest": { "sha256": "REPLACE_WITH_SBOM_DIGEST" },
					"mediaType": "application/vnd.cyclonedx+json"
				}
			]
		}
	}
}
```

### Vulnerability Predicate Body (example for scanners)

```json
{
	"_type": "https://in-toto.io/Statement/v1",
	"subject": {
		"name": "ARTIFACT_NAME",
		"digest": { "sha256": "REPLACE_WITH_SCA_ATTESTATION_DIGEST" }
	},
	"predicateType": "https://example.com/vulnerability/v1",
	"predicate": {
		"scanner": {
			"uri": "SCANNER_URI",
			"version": "SCANNER_VERSION",
			"db": {
				"uri": "VULN_DB_URI",
				"version": "DB_VERSION",
				"last_update": "ISO8601_TIMESTAMP"
			}
		},
		"result": [
			{
				"id": "VULN_IDENTIFIER",
				"severity": [
					{ "method": "nvd", "score": 7.5 },
					{ "method": "cvss_v3", "score": 8.1 }
				],
				"annotations": {
					"package": "AFFECTED_PACKAGE",
					"current_version": "VERSION",
					"fixed_version": "VERSION_OR_EMPTY"
				}
			}
		]
	}
}
```

## Notes

Recommended next steps to prepare for SLSA v1.0 provenance:

- Publish buildType references for each build workflow.
- Create internal document defining buildTypes for reusable workflows, including structure of externalParameters and meaning of resolvedDependencies. This makes downstream verification deterministic.
- Move scanner outcomes into separate predicates.
- Use additional predicate types for scanner results, sign them, and link from SBOM external references and from SLSA byproducts. Verifier should not embed verification logic in SLSA predicate at runtime.
- Keep SLSA provenance lean; treat SLSA provenance as trusted description of how security controls align with SLSA's guidance on separating provenance from verification logic.

## Policies and Gates

Example policy logic (illustrative):

```
default allow := false

criticalok(ctrl) { ctrl.critical == 0 }

coverageok(ctrl) { ctrl.coveragePct >= ctrl.threshold }

mandatorycontrolspresent(p) {
  p.controls.sast.executed
  p.controls.sca.executed
  p.controls.containerscan.executed
  p.controls.tests.executed
  p.controls.tests.coveragePct
}

allow {
  mandatorycontrolspresent(input.predicate)
  criticalok(input.predicate.controls.sast)
  criticalok(input.predicate.controls.sca)
  criticalok(input.predicate.controls.containerscan)
  coverageok(input.predicate.controls.tests)
}
```

### Promotion Gate

Verify signatures on artifact and attestation; evaluate policy; only promote if compliant. Can be controlled via dedicated templated/reusable pipelines/workflows.

### Pull Request Gate

Use branch protection to require the compliance status check; optionally publish a richer Checks API entry summarizing controls and thresholds.

## Tool-Specific Verification

### SAST with Static Analysis Tool

Pipelines run static analysis and upload results. Attestation fields include executed flag and critical/high counts.

### SCA with Software Composition Analysis Tool

Scans builds/artifacts and exposes summaries and allow SBOM export. Attestation fields include severity counts and a summary link.

### Container Image Scanning with Container Scanner

Sensor scans image and generates reports. Attestation fields include vulnerability counts.

### Source Repository and Pull Request Controls

Branch protection enforces required status checks and merge requirements. The Checks API can publish annotated results.

### Reporting Model

Where evidence is stored:

- Signed attestation and SBOM next to the artifact: SBOM external references for quick access.
- Mirror key aggregates to repository metadata for quick filtering; treat signed attestation as source of truth and dereference this metadata for ingestion to dashboards.

### Tamper Resistance

Accept only trusted identities for signatures; fail closed if any signature or lookup is missing or invalid. Use append-only logs or immutability controls for audit trails.

## Implementation Roadmap

1. Generate SBOMs consistently and store alongside artifact.
2. Add signing of artifacts and attestations; prefer short-lived identities for reduced key management overhead.
3. Build Attestation Service MVP: signature verification, policy evaluation, evidence store, minimal reports.
4. Integrate tool adapters.
5. Enforce gates: Branch protection with required compliance check; promotion blocked on verification failure.
6. Roll out dashboards: Query evidence store and repository metadata; link to signed SBOM/attestation references.

## Jenkins Integration Example

Jenkinsfile (illustrative):

```groovy
@Library('platform-compliance') _

pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps { sh './build.sh' }
    }
    stage('SAST') {
      steps {
        sastScanAndUpload project: 'service-a', version: 'BUILDNUMBER'
        sh 'python scripts/sastsummary.py --project service-a --version BUILDNUMBER --output sast.json'
      }
    }
    stage('SCA') {
      steps {
        sh 'jf rt build-publish service-a BUILDNUMBER'
        sh 'jf xr scan-build service-a BUILDNUMBER --fail false'
        sh 'python scripts/scasummary.py --build service-a --number BUILDNUMBER --output sca.json'
      }
    }
    stage('Container Scan') {
      steps {
        sh 'docker build -t registry.example.com/service-a:BUILDNUMBER'
        sh 'python scripts/containerscan.py --image registry.example.com/service-a:BUILDNUMBER --output container.json'
      }
    }
    stage('SBOM') {
      steps {
        sh 'python scripts/generatesbom.py --output sbom.json'
      }
    }
    stage('Sign & Attest') {
      steps {
        sh 'cosign sign registry.example.com/service-a:BUILDNUMBER'
        sh 'cosign attest --predicate sast.json registry.example.com/service-a:BUILDNUMBER'
        sh 'cosign attest --predicate sca.json registry.example.com/service-a:BUILDNUMBER'
        sh 'cosign attest --predicate container.json registry.example.com/service-a:BUILDNUMBER'
        sh 'curl -X POST -H "Authorization: Bearer TOKEN" -d @sbom.json https://attestation.example.com/ingest'
      }
    }
    stage('Verify') {
      steps {
        sh 'curl -X POST https://attestation.example.com/verify -d "artifact=registry.example.com/service-a:BUILDNUMBER"'
      }
    }
  }
}
```

## GitHub Actions Integration

GitHub workflow (illustrative):

```yaml
name: build-and-attest
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
  id-token: write
  checks: write
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: ./build.sh
      - name: SAST
        run: ./sastscan.sh --output sast.json
      - name: SCA
        run: ./scascan.sh --output sca.json
      - name: Container Scan
        run: docker build -t registry.example.com/app:${{ github.run_number }}
      - name: Generate SBOM
        run: ./sbom.sh > sbom.json
      - name: Sign artifact
        run: cosign sign registry.example.com/app:${{ github.run_number }}
      - name: Attest SAST
        run: cosign attest --predicate sast.json registry.example.com/app:${{ github.run_number }}
      - name: Attest SCA
        run: cosign attest --predicate sca.json registry.example.com/app:${{ github.run_number }}
      - name: Post attestation
        run: curl -X POST https://attestation.example.com/ingest -d @sbom.json
      - name: Publish compliance check
        run: ./publishcheckrun.sh
```

Using native GitHub Actions attestations:

```yaml
name: build-and-attest
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
  id-token: write
  attestations: write
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: ./build.sh
      - name: SAST Scan
        run: ./sastscan.sh --output sast-results.json
      - name: SCA Scan
        run: ./scascan.sh --output sca-results.json
      - name: Container Scan
        run: ./containerscan.sh --output container-results.json
      - name: Generate SBOM
        run: ./sbom.sh > sbom.json
      - name: Attest build provenance
        uses: actions/attest-build-provenance@v1
        with:
          subject-path: dist/app.tar.gz
      - name: Attest SAST results
        uses: actions/attest@v1
        with:
          subject-path: dist/app.tar.gz
          predicate-type: 'https://in-toto.io/attestation/test-result/v0.1'
          predicate-path: 'sast-results.json'
      - name: Attest SCA results
        uses: actions/attest@v1
        with:
          subject-path: dist/app.tar.gz
          predicate-type: 'https://in-toto.io/attestation/vuln-scan/v0.1'
          predicate-path: 'sca-results.json'
      - name: Publish compliance check
        if: github.event_name == 'pull_request'
        run: ./publish_check_run.sh
```

## Risks and Mitigations

- **Evidence falsification risk**: Mitigation: verify signatures from trusted CI identities; store attestations and SBOMs in append-only logs; fail closed.
- **Tool/API dependency risk**: Mitigation: maintain thin adapters per scanner; keep predicate fields generic; use standard external references in SBOM to avoid tight coupling.
- **Operational complexity**: Mitigation: ship shared libraries and reusable workflows; centralize policy evaluation in the attestation service.

## SLSA Framework

SLSA is a security framework with standards and controls to prevent tampering, improve integrity, and secure packages and infrastructure. It helps organizations progress from baseline security to optimal resilience across the supply chain.

### Attestation Model & Terminology

- **Artifact**: Immutable blob of data described by an attestation, identified by cryptographic digest.
- **Attestation**: Authenticates claims about artifacts.
- **Envelope**: Authenticates the message content.
- **Statement**: Binds the attestation to a set of artifacts.
- **Subject**: Identifies artifacts the predicate applies to.
- **Predicate**: Metadata about the subject.
- **Link**: Reference to a related artifact as build dependency.
- **Bundle**: Collection of attestations.
- **Storage/Lookup**: Convention for placing and finding attestations.

## Architecture Diagram

```
Security & Compliance
CI/CD Pipeline Functions Attestation Service

SAST: Static Analysis Tool
SCA: Software Composition Analysis Tool
Container Scan: Container Scanner

Pipelines (Jenkins, GitHub Actions)

Build Artifacts (images, jars)

SBOM (CycloneDX/SPDX) with external references

Evidence Store: attestations, SBOMs, decisions

Release & Governance

Branch Protection, Checks API

Promotion Gate: verify signatures & policies

Artifact Repository

Reports & API: dashboards, compliance dashboard
```

## Conclusion

A decoupled attestation service provides defensible compliance verification while preserving developer autonomy. Signed provenance, standard SBOMs with external references, and independent policy evaluation mean we can swap scanners or CI systems without altering verification logic. Gates at promotion and pull request merge ensure non-compliant artifacts do not proceed. The specific tools referenced here are suggestions; any equivalent vendor/tool can replace them provided they produce verifiable evidence and expose queryable summaries.

## References

1. Operational Policies
2. Sigstore / Cosign documentation
3. Verifying in-toto attestations
4. Governance Process
5. SLSA GitHub generator
6. Use case for predicates
7. CycloneDX specification
8. SPDX specification
9. Scanner REST APIs
10. Static Analysis Tool plugin
11. Static Analysis Tool REST API
12. Container Scanner API guide
13. Branch protection and Checks API
14. OIDC keyless signing guidance</content>
    <parameter name="filePath">/home/marc/Documents/greenorchid/behan.dev-svelte/article.md
