# GCP Organization Setup — Aksha Digital Foundation

## Multi-Tenant B2B Architecture for aksha-digital-foundation.com

---

## Prerequisites

- Domain: `aksha-digital-foundation.com` (registered)
- Google Workspace account on the domain
- GCP billing account (US credit card / ACH)
- gcloud CLI installed (`brew install --cask google-cloud-sdk`)

---

## Organization Structure

```
Org: aksha-digital-foundation.com
│
├── Folder: Platform
│   ├── Project: aksha-platform-prod       # Shared Artifact Registry, monitoring
│   └── Project: aksha-platform-dev        # Internal dev/testing
│
├── Folder: Clients
│   ├── Folder: NPCWS
│   │   ├── Project: aksha-npcws-prod      # Production
│   │   └── Project: aksha-npcws-dev       # Dev/staging
│   │
│   └── Folder: (future clients go here)
│
└── Folder: Shared
    ├── Project: aksha-billing-mgmt        # Billing exports, budgets
    └── Project: aksha-security-mgmt       # Org audit logs
```

---

## Step 1 — Google Workspace + GCP Organization

1. Go to https://workspace.google.com
2. Set up Google Workspace for `aksha-digital-foundation.com` ($7/user/month)
3. Verify domain ownership (DNS TXT record)
4. GCP Organization is created automatically once Workspace is verified
5. Sign in to https://console.cloud.google.com with `admin@aksha-digital-foundation.com`

---

## Step 2 — Authenticate gcloud CLI

```bash
gcloud auth login
gcloud organizations list
```

Note your `ORGANIZATION_ID` from the output.

```bash
export ORG_ID=<your-organization-id>
```

---

## Step 3 — Create Folder Structure

```bash
# Create top-level folders
gcloud resource-manager folders create \
  --display-name="Platform" \
  --organization=$ORG_ID

gcloud resource-manager folders create \
  --display-name="Clients" \
  --organization=$ORG_ID

gcloud resource-manager folders create \
  --display-name="Shared" \
  --organization=$ORG_ID

# Note the folder IDs from output
export PLATFORM_FOLDER_ID=<platform-folder-id>
export CLIENTS_FOLDER_ID=<clients-folder-id>
export SHARED_FOLDER_ID=<shared-folder-id>

# Create NPCWS client folder under Clients
gcloud resource-manager folders create \
  --display-name="NPCWS" \
  --folder=$CLIENTS_FOLDER_ID

export NPCWS_FOLDER_ID=<npcws-folder-id>
```

---

## Step 4 — Create Projects

```bash
# Platform projects
gcloud projects create aksha-platform-prod \
  --name="Aksha Platform Prod" \
  --folder=$PLATFORM_FOLDER_ID

gcloud projects create aksha-platform-dev \
  --name="Aksha Platform Dev" \
  --folder=$PLATFORM_FOLDER_ID

# NPCWS client projects
gcloud projects create aksha-npcws-prod \
  --name="NPCWS Production" \
  --folder=$NPCWS_FOLDER_ID

gcloud projects create aksha-npcws-dev \
  --name="NPCWS Dev" \
  --folder=$NPCWS_FOLDER_ID

# Shared projects
gcloud projects create aksha-billing-mgmt \
  --name="Aksha Billing" \
  --folder=$SHARED_FOLDER_ID

gcloud projects create aksha-security-mgmt \
  --name="Aksha Security" \
  --folder=$SHARED_FOLDER_ID
```

---

## Step 5 — Link Billing Account

```bash
gcloud billing accounts list

export BILLING_ACCOUNT_ID=<your-billing-account-id>

# Link all projects to billing
for project in aksha-platform-prod aksha-platform-dev aksha-npcws-prod aksha-npcws-dev aksha-billing-mgmt aksha-security-mgmt; do
  gcloud billing projects link $project --billing-account=$BILLING_ACCOUNT_ID
done
```

---

## Step 6 — Enable APIs for NPCWS Production

```bash
gcloud config set project aksha-npcws-prod

gcloud services enable \
  container.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  dns.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com
```

---

## Step 7 — Shared Artifact Registry (Platform Project)

One registry for all client Docker images, tagged per client.

```bash
gcloud config set project aksha-platform-prod

gcloud services enable artifactregistry.googleapis.com

gcloud artifacts repositories create aksha-apps \
  --repository-format=docker \
  --location=asia-south1 \
  --description="Docker images for all Aksha client apps"
```

Image naming convention:
```
asia-south1-docker.pkg.dev/aksha-platform-prod/aksha-apps/npcws-client:v1.0
asia-south1-docker.pkg.dev/aksha-platform-prod/aksha-apps/npcws-server:v1.0
asia-south1-docker.pkg.dev/aksha-platform-prod/aksha-apps/clientb-client:v1.0
```

---

## Step 8 — GKE Autopilot Cluster for NPCWS

```bash
gcloud config set project aksha-npcws-prod

gcloud container clusters create-auto npcws-cluster \
  --region=asia-south1 \
  --release-channel=stable \
  --enable-master-authorized-networks \
  --network=default \
  --subnetwork=default
```

---

## Step 9 — Cloud SQL PostgreSQL for NPCWS

```bash
# Create instance (private IP, no public access)
gcloud sql instances create npcws-db \
  --project=aksha-npcws-prod \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-south1 \
  --availability-type=zonal \
  --storage-size=10GB \
  --storage-auto-increase \
  --no-assign-ip \
  --network=default

# Create database
gcloud sql databases create npcws \
  --instance=npcws-db

# Create application user (replace with a strong password)
gcloud sql users create npcws_app \
  --instance=npcws-db \
  --password=<GENERATE_STRONG_PASSWORD>
```

---

## Step 10 — Store DB Credentials in Secret Manager

```bash
gcloud config set project aksha-npcws-prod

gcloud services enable secretmanager.googleapis.com

# Store credentials
echo -n "npcws" | gcloud secrets create npcws-db-name --data-file=-
echo -n "npcws_app" | gcloud secrets create npcws-db-user --data-file=-
echo -n "<YOUR_DB_PASSWORD>" | gcloud secrets create npcws-db-password --data-file=-
```

---

## Step 11 — Workload Identity Federation (GitHub Actions → GCP)

No JSON key files — GitHub authenticates to GCP via OIDC.

```bash
gcloud config set project aksha-npcws-prod

# Create Workload Identity Pool
gcloud iam workload-identity-pools create github-pool \
  --location=global \
  --display-name="GitHub Actions Pool"

# Create OIDC Provider
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location=global \
  --workload-identity-pool=github-pool \
  --display-name="GitHub OIDC" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Create Service Account for deployments
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions Deployer"

# Grant permissions to deploy to GKE
gcloud projects add-iam-policy-binding aksha-npcws-prod \
  --member="serviceAccount:github-deployer@aksha-npcws-prod.iam.gserviceaccount.com" \
  --role="roles/container.developer"

# Grant permissions to push images to shared Artifact Registry
gcloud projects add-iam-policy-binding aksha-platform-prod \
  --member="serviceAccount:github-deployer@aksha-npcws-prod.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Allow the GitHub repo to impersonate this service account
export PROJECT_NUMBER=$(gcloud projects describe aksha-npcws-prod --format='value(projectNumber)')

gcloud iam service-accounts add-iam-policy-binding \
  github-deployer@aksha-npcws-prod.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/aksha-digital-foundation/npcws-welfare-society"
```

---

## Step 12 — Set GitHub Repository Variables

Go to: https://github.com/aksha-digital-foundation/npcws-welfare-society/settings/variables/actions

| Variable | Value |
|----------|-------|
| `GCP_PROJECT_ID` | `aksha-npcws-prod` |
| `WIF_PROVIDER` | `projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `WIF_SERVICE_ACCOUNT` | `github-deployer@aksha-npcws-prod.iam.gserviceaccount.com` |

---

## Step 13 — Deploy NPCWS to GKE

```bash
# Get GKE credentials
gcloud container clusters get-credentials npcws-cluster \
  --region=asia-south1 \
  --project=aksha-npcws-prod

# Create namespace
kubectl apply -f k8s/base/namespace.yaml

# Create DB credentials secret
kubectl create secret generic npcws-db-credentials \
  --namespace=npcws \
  --from-literal=database=npcws \
  --from-literal=username=npcws_app \
  --from-literal=password=<YOUR_DB_PASSWORD>

# Build and push Docker images
export REGISTRY=asia-south1-docker.pkg.dev/aksha-platform-prod/aksha-apps

docker build -f docker/client.Dockerfile -t $REGISTRY/npcws-client:v1.0 .
docker build -f docker/server.Dockerfile -t $REGISTRY/npcws-server:v1.0 .

docker push $REGISTRY/npcws-client:v1.0
docker push $REGISTRY/npcws-server:v1.0

# Update image tags in manifests
sed -i '' "s|REGION-docker.pkg.dev/PROJECT_ID/npcws/client:latest|$REGISTRY/npcws-client:v1.0|g" k8s/base/client-deployment.yaml
sed -i '' "s|REGION-docker.pkg.dev/PROJECT_ID/npcws/server:latest|$REGISTRY/npcws-server:v1.0|g" k8s/base/server-deployment.yaml
sed -i '' "s|PROJECT_ID:asia-south1:npcws-db|aksha-npcws-prod:asia-south1:npcws-db|g" k8s/base/server-deployment.yaml

# Deploy
kubectl apply -k k8s/overlays/production

# Verify
kubectl get pods -n npcws
kubectl get svc -n npcws
kubectl get gateway -n npcws
```

---

## Step 14 — Run Database Migrations

```bash
# Port-forward to Cloud SQL via a temporary pod
kubectl run migrate --rm -it --restart=Never \
  --namespace=npcws \
  --image=postgres:15-alpine \
  --env="PGPASSWORD=<YOUR_DB_PASSWORD>" \
  -- psql -h <CLOUD_SQL_PRIVATE_IP> -U npcws_app -d npcws

# Then paste contents of:
# db/migrations/001_create_members.sql
# db/migrations/002_create_schemes.sql
# db/migrations/003_create_payments.sql
# db/seeds/001_schemes.sql
```

---

## Step 15 — Domain & TLS

```bash
gcloud config set project aksha-npcws-prod

# Option A: Use a subdomain of aksha-digital-foundation.com
# e.g., npcws.aksha-digital-foundation.com

# Option B: Use client's own domain (e.g., npcws.org)

# Create DNS zone
gcloud dns managed-zones create npcws-zone \
  --dns-name="npcws.aksha-digital-foundation.com." \
  --description="NPCWS DNS zone"

# Create Google-managed TLS certificate
gcloud certificate-manager certificates create npcws-cert \
  --domains="npcws.aksha-digital-foundation.com"

# Create certificate map
gcloud certificate-manager maps create npcws-cert-map

gcloud certificate-manager maps entries create npcws-cert-entry \
  --map=npcws-cert-map \
  --certificates=npcws-cert \
  --hostname="npcws.aksha-digital-foundation.com"

# The Gateway in k8s/base/gateway.yaml references npcws-cert-map
# GKE will automatically attach the TLS cert to the load balancer
```

---

## Step 16 — Budget Alerts

Set up via GCP Console: Billing → Budgets & Alerts → Create Budget

| Project | Monthly Budget | Alert Thresholds |
|---------|---------------|-----------------|
| aksha-npcws-prod | $100 | 50%, 80%, 100% |
| aksha-npcws-dev | $30 | 50%, 80%, 100% |
| aksha-platform-prod | $50 | 50%, 80%, 100% |

---

## Step 17 — Org-Level Security Policies

```bash
# Enable org-wide audit logging
gcloud logging sinks create org-audit-sink \
  storage.googleapis.com/aksha-audit-logs \
  --organization=$ORG_ID \
  --log-filter='logName:"cloudaudit.googleapis.com"'

# Restrict regions (optional — enforce India + US only)
# Create policy.yaml:
cat > /tmp/region-policy.yaml << 'POLICY'
constraint: constraints/gcp.resourceLocations
listPolicy:
  allowedValues:
    - in:asia-south1-locations
    - in:us-central1-locations
POLICY

gcloud resource-manager org-policies set-policy /tmp/region-policy.yaml \
  --organization=$ORG_ID
```

---

## Onboarding a New Client (Repeatable Playbook)

When signing a new B2B client, run these steps:

```bash
export CLIENT_NAME=clientb
export CLIENT_DISPLAY="Client B"

# 1. Create client folder
gcloud resource-manager folders create \
  --display-name="$CLIENT_DISPLAY" \
  --folder=$CLIENTS_FOLDER_ID

export CLIENT_FOLDER_ID=<new-folder-id>

# 2. Create projects
gcloud projects create aksha-${CLIENT_NAME}-prod \
  --name="${CLIENT_DISPLAY} Production" \
  --folder=$CLIENT_FOLDER_ID

gcloud projects create aksha-${CLIENT_NAME}-dev \
  --name="${CLIENT_DISPLAY} Dev" \
  --folder=$CLIENT_FOLDER_ID

# 3. Link billing
gcloud billing projects link aksha-${CLIENT_NAME}-prod \
  --billing-account=$BILLING_ACCOUNT_ID
gcloud billing projects link aksha-${CLIENT_NAME}-dev \
  --billing-account=$BILLING_ACCOUNT_ID

# 4. Enable APIs
gcloud config set project aksha-${CLIENT_NAME}-prod
gcloud services enable \
  container.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  dns.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com

# 5. Create GKE cluster
gcloud container clusters create-auto ${CLIENT_NAME}-cluster \
  --region=asia-south1 \
  --release-channel=stable

# 6. Create Cloud SQL
gcloud sql instances create ${CLIENT_NAME}-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-south1 \
  --availability-type=zonal \
  --storage-size=10GB \
  --no-assign-ip \
  --network=default

# 7. Set up Workload Identity Federation
# (repeat Step 11 with new project + repo)

# 8. Clone app template, customize, deploy
```

---

## Aadhaar Integration (for NPCWS)

### Option A — Aadhaar e-KYC via Licensed ASA/KUA (Recommended)

- Cannot call UIDAI APIs directly — must use a licensed partner
- Partners: Khosla Labs (Syntizen), NSDL e-Gov, eMudhra, Protean
- They provide REST APIs your server calls
- Cost: Rs 2-10 per auth/e-KYC transaction
- Applicant: NPCWS (registered Indian society), Aksha as tech partner

### Option B — DigiLocker / Aadhaar Offline XML

- No ASA/KUA needed
- User downloads Aadhaar XML from DigiLocker or UIDAI site
- Your app parses and verifies the signed XML
- Free, but clunkier user experience

---

## Payment Integration (Razorpay)

- Razorpay merchant account must be held by an **Indian entity** (NPCWS)
- Documents: Society registration certificate, PAN, bank account details
- Aksha Foundation (US LLC) is the technology partner, not the merchant

Integration flow:
```
Browser → Razorpay Checkout (client-side JS)
    ↓
Razorpay processes payment (UPI, cards, netbanking)
    ↓
Webhook → POST /api/payments/webhook (server verifies Razorpay signature)
    ↓
Update payments table → generate PDF receipt
```

---

## Cost Estimate (per client)

| Service | Monthly Cost |
|---------|-------------|
| GKE Autopilot (2 small pods) | $30-50 |
| Cloud SQL PostgreSQL (db-f1-micro) | $10-15 |
| Artifact Registry (shared) | $1-2 |
| Cloud DNS | $1 |
| TLS Certificate | Free (Google-managed) |
| **Total per client** | **$45-70/month** |

---

## IAM Strategy

| Role | Access |
|------|--------|
| Aksha team | Organization Admin — full access to all projects |
| Client stakeholders (e.g., NPCWS officer) | Viewer on their project only |
| GitHub Actions (CI/CD) | Workload Identity — push images + deploy to their project only |

---

## Reference Links

- GCP Console: https://console.cloud.google.com
- Artifact Registry: https://console.cloud.google.com/artifacts
- GKE: https://console.cloud.google.com/kubernetes
- Cloud SQL: https://console.cloud.google.com/sql
- Billing: https://console.cloud.google.com/billing
- Workload Identity Federation: https://cloud.google.com/iam/docs/workload-identity-federation
- Razorpay Docs: https://razorpay.com/docs
- UIDAI Aadhaar: https://uidai.gov.in
