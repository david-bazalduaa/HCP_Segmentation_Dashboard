# HCP Segmentation Dashboard

An interactive, business-focused dashboard for analyzing Healthcare Professional (HCP) prescribing behavior, engagement, and market opportunity in the Ulcerative Colitis (UC) space. 

This project integrates deep behavioral analytics from a 191-column dataset (`hcp_analysis_clean.parquet`), translating complex machine learning outputs into actionable insights for commercial teams.

## Live Demo
You can access the interactive dashboard here: [davidbazaldua.github.io/HCP_Segmentation_Dashboard/](https://david-bazalduaa.github.io/HCP_Segmentation_Dashboard/)

## Features & Architecture

### 1. Unified Chart.js Engine
The dashboard is entirely built using **Chart.js**, ensuring a consistent, fast, and responsive user experience without heavy dependencies. Features include:
- Executive summary donuts and funnels.
- Normalized metric bar charts for comparing features on vastly different scales.
- Interactive, multi-axis longitudinal tracking of HCP prescribing behavior and marketing engagement.
- Opportunity scatter plots capable of rendering thousands of HCP data points efficiently.

### 2. Business Intelligence Tabs
The dashboard is organized into 7 strategic tabs:
1. **Executive Summary:** High-level segment distribution and normalized metric comparisons.
2. **Segment Deep-Dive:** Interactive timelines profiling key HCP personas (e.g., Traditional, Relational, Didactic).
3. **Brand Adoption:** Funnel analysis of HCP progression from "Never Tried" to "Active" prescribing.
4. **Competitive Intelligence:** Pfizer market share vs. Brand2 across segments.
5. **Rep Engagement:** Measuring the efficiency of marketing channels (Details/Rx ratios).
6. **Unlabeled Opportunity:** An interactive scatter plot identifying high-value HCPs with low/no rep visits (≤5). Clicking an HCP reveals their specific ID and KPIs for outreach prioritization.
7. **Specialty Mix:** Stacked views of HCP specialties driving segment volume.

### 3. Data Integration
The frontend is completely decoupled from the data extraction layer. 
- Real aggregated KPIs (Pfizer TRx, UC TRx, Details per Rx, etc.) are embedded directly.
- The Opportunity Scatter pulls exact, real-world HCP IDs and metrics dynamically via JSON (`opportunity_data.json`), reflecting true market distributions.

## Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge).
- A local web server (e.g., Python's built-in `http.server`) to bypass CORS restrictions when loading local JSON files.

### Running Locally
1. Clone the repository and navigate to the root directory.
2. Start a local server:
   ```bash
   python3 -m http.server 8099
   ```
3. Open your browser and go to `http://localhost:8099`.

### File Structure
- `index.html`: The main dashboard structure and layout.
- `styles.css`: The styling system utilizing Pfizer brand colors and modern UI components.
- `app.js`: The core logic for tab navigation, Chart.js initialization, and interactivity.
- `opportunity_data.json`: Extracted dataset containing real Unlabeled HCP metrics for the interactive scatter plot.
- `hcp_analysis_clean.parquet`: The root aggregated data source (not directly loaded by the browser, but used for extraction).
- `column_dictionary_new.md`: A comprehensive guide to the 191 columns and business logic within the parquet file.

## Design System

The application uses a custom design system based on CSS variables, heavily prioritizing Pfizer's corporate color palette (`#0051a5`, `#00a3e0`, `#0d009d`) mixed with modern dashboard aesthetics (slate grays, soft borders, interactive hovers).

## Customization

To update the dashboard with fresh data:
1. Run analysis on the updated `.parquet` file.
2. Extract the new aggregated distributions.
3. Update the constants in `app.js` and generate a new `opportunity_data.json`.
