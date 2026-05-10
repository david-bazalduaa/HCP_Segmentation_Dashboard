# Column Dictionary — `hcp_analysis_clean` (191 columns)

Generated from `VELSIPITY_raw_database.csv` (1,800,066 rows × 86 weeks × 20,931 HCPs).  
Each row in the clean dataset represents **one HCP** (one-row-per-HCP aggregation).  
Index: `NUEVO_ID` — the unique Pfizer customer identifier.

---

## Block A — Identity & Static Attributes

These columns are derived from the first observed value per HCP (all are static across the 86-week panel).

| Column | Type | Formula / Logic | Raw Source Columns | Notes |
|--------|------|-----------------|-------------------|-------|
| `SPECIALTY` | string | Decoded from one-hot specialty flags using first observed row per HCP | `SPEC_GE`, `SPEC_GPFM`, `SPEC_IM`, `SPEC_NRP`, `SPEC_OTHER_SPEC`, `SPEC_PHA` | Values: `Gastroenterology`, `GP/Family Med`, `Internal Medicine`, `Neuro/Rheum/Pulm`, `Other Spec`, `Pharmacy`, `Unknown` |
| `STATE` | string | Decoded from one-hot state/territory flags | `STATE_1`–`STATE_8`, `STS_OTHER_STS` | Returns the column name of the active flag (e.g. `STATE_1`). `Unknown` if all flags = 0 |
| `AGE_COHORT` | string | Decoded from one-hot birth-year range flags | `(1940, 1960]`, `(1960, 1980]`, `(1980, 2000]`, `(2000, 2020]`, `(2020, 2030]` | Values: `1940-1960`, `1960-1980`, `1980-2000`, `2000-2020`, `2020-2030`, `Unknown`. 3,726 HCPs have all age flags = 0 → `Unknown` |
| `ATSEG_LABEL` | string / NaN | `mode()` of `ATSEG` across 86 weeks per HCP | `ATSEG` | Psychographic segment ground truth. `SEG_A` = status quo; `SEG_B` = relational/progressive; `SEG_C` = didactic/protocol-driven. Null for 9,032 unlabeled HCPs |
| `IS_LABELED` | int (0/1) | `1` if `ATSEG_LABEL` is not null | `ATSEG` | Flag for modeling — labeled HCPs are those profiled by field reps |
| `SEGMENT_DISPLAY` | string | `ATSEG_LABEL.fillna("No Clasificado")` | `ATSEG_LABEL` | Display-ready segment label; unlabeled HCPs show `No Clasificado` |

---

## Block B — Prescribing Volume (Level)

For each base metric column `X`, four aggregations are computed over all 86 weeks.  
**Formula:** `X_mean = mean(X)`, `X_total = sum(X)`, `X_max = max(X)`, `X_std = std(X)`

**Base metrics covered (14 columns × 4 stats = 56 columns):**

| Prefix | Raw Column | Domain Description |
|--------|-----------|-------------------|
| `UC_TRX` | `UC_TRX` | Total prescriptions for Ulcerative Colitis (all brands) |
| `ORAL_TRX` | `ORAL_TRX` | Total prescriptions for oral medications in UC |
| `IL23_TRX` | `IL23_TRX` | Total prescriptions for IL-23 inhibitor biologics |
| `BRAND1_TRX` | `BRAND1_TRX` | Total prescriptions for Brand1 (Velsipity / Pfizer) |
| `BRAND2_TRX` | `BRAND2_TRX` | Total prescriptions for Brand2 (main competitor) |
| `UC_NRX` | `UC_NRX` | New prescriptions (first-time patients) in UC |
| `ORAL_NRX` | `ORAL_NRX` | New prescriptions for oral UC medications |
| `IL23_NRX` | `IL23_NRX` | New prescriptions for IL-23 inhibitors |
| `BRAND1_NRX` | `BRAND1_NRX` | New prescriptions for Brand1 |
| `BRAND2_NRX` | `BRAND2_NRX` | New prescriptions for Brand2 |
| `BRAND1_NBRX` | `BRAND1_NBRX` | New-to-brand prescriptions for Brand1 (patient never on Brand1 before) |
| `BRAND2_NBRX` | `BRAND2_NBRX` | New-to-brand prescriptions for Brand2 |
| `ORAL_NBRX` | `ORAL_NBRX` | New-to-brand prescriptions for oral UC medications |
| `IL23_NBRX` | `IL23_NBRX` | New-to-brand prescriptions for IL-23 inhibitors |

> **Why NBRx > NRx at launch:** `NRx` includes restarts and continued scripts. `NBRx` captures only patients who have *never* been on that brand — a truer measure of new patient acquisition.

---

## Block C — Activity & Consistency

Computed per HCP over all 86 weeks.

| Column | Formula | Raw Source | Notes |
|--------|---------|-----------|-------|
| `UC_TRX_active_weeks` | `count(weeks where UC_TRX > 0)` | `UC_TRX` | Number of weeks with any UC prescriptions |
| `UC_TRX_active_pct` | `UC_TRX_active_weeks / 86` | `UC_TRX` | Fraction of weeks active in UC |
| `UC_TRX_cv` | `std(UC_TRX) / mean(UC_TRX)` if mean > 0, else 0 | `UC_TRX` | Coefficient of variation — higher = more volatile prescribing pattern |
| `UC_TRX_longest_streak` | Max consecutive weeks with `UC_TRX > 0` | `UC_TRX` | Sustained prescribing signal |
| `BRAND1_TRX_active_weeks` | `count(weeks where BRAND1_TRX > 0)` | `BRAND1_TRX` | Weeks with any Brand1 prescriptions |
| `BRAND1_TRX_active_pct` | `BRAND1_TRX_active_weeks / 86` | `BRAND1_TRX` | Fraction of weeks with Brand1 activity |
| `BRAND1_TRX_cv` | `std(BRAND1_TRX) / mean(BRAND1_TRX)` if mean > 0, else 0 | `BRAND1_TRX` | Coefficient of variation for Brand1 |
| `BRAND1_TRX_longest_streak` | Max consecutive weeks with `BRAND1_TRX > 0` | `BRAND1_TRX` | Key signal for sustained adoption |
| `BRAND1_NBRX_active_weeks` | `count(weeks where BRAND1_NBRX > 0)` | `BRAND1_NBRX` | Weeks with new Brand1 patients |
| `BRAND1_NBRX_active_pct` | `BRAND1_NBRX_active_weeks / 86` | `BRAND1_NBRX` | Fraction of weeks acquiring new Brand1 patients |
| `BRAND1_NBRX_cv` | `std(BRAND1_NBRX) / mean(BRAND1_NBRX)` if mean > 0, else 0 | `BRAND1_NBRX` | Volatility of new patient acquisition |
| `BRAND1_NBRX_longest_streak` | Max consecutive weeks with `BRAND1_NBRX > 0` | `BRAND1_NBRX` | Sustained new-patient acquisition |

---

## Block D — Trend & Trajectory

The 86 weeks per HCP are split into three temporal terciles:
- **Tercile 0 (T1):** Weeks 1–28 (first third)
- **Tercile 1 (T2):** Weeks 29–56 (middle third)
- **Tercile 2 (T3):** Weeks 57–86 (last third)

For each trend column `X` ∈ {`UC_TRX`, `BRAND1_TRX`, `BRAND1_NBRX`, `ORAL_NBRX`}:

| Column | Formula | Notes |
|--------|---------|-------|
| `X_trend_ratio` | `min(mean(T3) / mean(T1), 5.0)`; sentinel `2.0` if T1=0 and T3>0; `0.0` if both=0 | Cap at 5.0 prevents outlier inflation. Sentinel 2.0 marks new adopters. >1 = growing |
| `X_trend_delta` | `mean(T3) − mean(T1)` | Absolute change. Can be negative |
| `X_is_growing` | `1` if `mean(T3) > mean(T1) × 1.1` | Binary: >10% growth from first to last tercile |
| `X_is_declining` | `1` if `mean(T3) < mean(T1) × 0.9` | Binary: >10% decline |
| `X_is_new_adopter` | `1` if `mean(T1) = 0` AND `mean(T3) > 0` | Started prescribing during the observation window |
| `X_is_lapsed` | `1` if `mean(T1) > 0` AND `mean(T3) = 0` | Was prescribing, now silent |

**Linear slope** (over all 86 weeks, via `scipy.stats.linregress`):

| Column | Formula | Notes |
|--------|---------|-------|
| `UC_TRX_slope` | OLS slope of `UC_TRX` over time | Positive = growing UC prescriber overall |
| `BRAND1_TRX_slope` | OLS slope of `BRAND1_TRX` over time | Positive = growing Brand1 prescriber |
| `BRAND1_NBRX_slope` | OLS slope of `BRAND1_NBRX` over time | Positive = accelerating new patient acquisition |

**Recency** (last 8 weeks vs. 86-week average):

| Column | Formula | Notes |
|--------|---------|-------|
| `UC_TRX_recent8_mean` | `mean(last 8 weeks of UC_TRX)` | Current UC prescribing level |
| `UC_TRX_recent8_vs_avg` | `recent8_mean / (overall_mean + ε)` | >1 = recently more active than average |
| `BRAND1_TRX_recent8_mean` | `mean(last 8 weeks of BRAND1_TRX)` | Current Brand1 prescribing level |
| `BRAND1_TRX_recent8_vs_avg` | `recent8_mean / (overall_mean + ε)` | >1 = recently more active |
| `BRAND1_NBRX_recent8_mean` | `mean(last 8 weeks of BRAND1_NBRX)` | Recent new patient acquisition |
| `BRAND1_NBRX_recent8_vs_avg` | `recent8_mean / (overall_mean + ε)` | >1 = recently accelerating new patients |

**Details trend:**

| Column | Formula | Notes |
|--------|---------|-------|
| `details_trend_ratio` | `min(mean_details(T3) / mean_details(T1), 5.0)`; same sentinel/cap logic | Is rep engagement increasing? >1 = growing |

> **Why trajectory beats volume:** A prescriber at 0.001 TRX/week and growing is more valuable than one at 0.010 TRX/week and stable. The growing HCP is in active adoption. `BRAND1_TRX_is_growing` separates SEG_B from SEG_A by **10.7×**.

---

## Block E — Market Share & Ratios

All ratios use `sum()` over the full 86-week horizon. `ε = 1e-6` guards against division by zero.

| Column | Formula | Raw Sources | Notes |
|--------|---------|------------|-------|
| `brand1_share_of_uc` | `BRAND1_TRX_total / (UC_TRX_total + ε)` | `BRAND1_TRX`, `UC_TRX` | Brand1 penetration of total UC market for this HCP. Mean ~0.4% across all HCPs |
| `brand1_nbrx_share_oral` | `BRAND1_NBRX_total / (ORAL_NBRX_total + ε)` | `BRAND1_NBRX`, `ORAL_NBRX` | Brand1 share of new oral prescriptions |
| `brand1_nrx_to_uc_nrx` | `BRAND1_NRX_total / (UC_NRX_total + ε)` | `BRAND1_NRX`, `UC_NRX` | Brand1 share of new patient scripts in UC |
| `nrx_to_trx_ratio` | `UC_NRX_total / (UC_TRX_total + ε)` | `UC_NRX`, `UC_TRX` | New-vs-total ratio for UC. Higher = HCP actively acquiring new patients |
| `comp_brand2_share_uc` | `BRAND2_TRX_total / (UC_TRX_total + ε)` | `BRAND2_TRX`, `UC_TRX` | Competitor (Brand2) penetration of this HCP's UC market |
| `oral_share_of_uc` | `ORAL_TRX_total / (UC_TRX_total + ε)` | `ORAL_TRX`, `UC_TRX` | Fraction of UC prescriptions that are oral |
| `il23_share_of_uc` | `IL23_TRX_total / (UC_TRX_total + ε)` | `IL23_TRX`, `UC_TRX` | Fraction of UC prescriptions that are IL-23 biologics |
| `brand1_share_trend` | `share(T3) − share(T1)` | `BRAND1_TRX`, `UC_TRX` | **Delta** (not ratio). Positive = gaining share. Negative = losing share. Range: [−1, +1]. Values outside [0,1] are correct and expected |

**Pre-built growth index features** (computed in raw data, aggregated here — last, mean, max over 86 weeks):

| Prefix | Raw Column | Description |
|--------|-----------|-------------|
| `UC_TRX_R4_16SUM` | `UC_TRX_R4_16SUM` | Rolling 4-week sum of UC TRX, weeks 4–16 window indicator |
| `ORAL_NBRX_R4_29SUM` | `ORAL_NBRX_R4_29SUM` | Rolling sum of Oral NBRx, weeks 4–29 window |
| `IL23_NBRX_R4_29SUM` | `IL23_NBRX_R4_29SUM` | Rolling sum of IL-23 NBRx, weeks 4–29 window |
| `BRAND1_NTB_GIDX` | `BRAND1_NTB_GIDX` | Brand1 new-to-brand growth index |
| `BRAND2_NTB_GIDX` | `BRAND2_NTB_GIDX` | Brand2 new-to-brand growth index |
| `BRAND1_T_GIDX` | `BRAND1_T_GIDX` | Brand1 total TRx growth index |
| `BRAND2_T_GIDX` | `BRAND2_T_GIDX` | Brand2 total TRx growth index |

Each produces three columns: `_last`, `_mean`, `_max`.

---

## Block F — Claims & Patient Flow

Medicare claims data. `CLM` = claim = patient request for a prescription drug benefit.  
`NEW_TO_BRAND` claims = patient's first-ever claim for that brand.  
`_NEW` (source of business) = new/restart scripts (broader than NTB).

All base columns produce `_total` (sum) and `_mean` (average per week) variants.

| Column | Raw Source | Description |
|--------|-----------|-------------|
| `N_CLMBRAND1_total` / `_mean` | `N_CLMBRAND1` | Total/avg weekly Brand1 (Pfizer) claims |
| `N_CLMBRAND2_total` / `_mean` | `N_CLMBRAND2` | Total/avg weekly Brand2 claims |
| `N_CLMBRAND3_total` / `_mean` | `N_CLMBRAND3` | Total/avg weekly Brand3 claims |
| `N_CLMBRAND4_total` / `_mean` | `N_CLMBRAND4` | Total/avg weekly Brand4 claims |
| `N_CLMOTHERS_total` / `_mean` | `N_CLMOTHERS` | Total/avg weekly other-brand claims |
| `N_CLMBRAND1_NEW_TO_BRAND_total` / `_mean` | `N_CLMBRAND1_NEW_TO_BRAND` | Brand1 new-to-brand claims (patient never on Brand1 before) |
| `N_CLMBRAND2_NEW_TO_BRAND_total` / `_mean` | `N_CLMBRAND2_NEW_TO_BRAND` | Brand2 new-to-brand claims |
| `N_CLMBRAND3NEW_TO_BRAND_total` / `_mean` | `N_CLMBRAND3NEW_TO_BRAND` | Brand3 new-to-brand claims |
| `N_CLMOTHERS_NEW_TO_BRAND_total` / `_mean` | `N_CLMOTHERS_NEW_TO_BRAND` | Other brands new-to-brand claims |
| `N_CLMBRAND1_NEW_total` / `_mean` | `N_CLMBRAND1_NEW` | Brand1 new/restart source-of-business scripts |
| `N_CLMBRAND2_NEW_total` / `_mean` | `N_CLMBRAND2_NEW` | Brand2 new/restart scripts |
| `N_CLMBRAND3_NEW_total` / `_mean` | `N_CLMBRAND3_NEW` | Brand3 new/restart scripts |
| `N_CLMOTHERS_NEW_total` / `_mean` | `N_CLMOTHERS_NEW` | Other brands new/restart scripts |

**Derived claim ratios:**

| Column | Formula | Notes |
|--------|---------|-------|
| `comp_ntb_pressure` | `B2_NTB_total / B1_NTB_total`; `1.0` if both=0; `100.0` (cap) if B1=0 and B2>0 | Competitor dominance of new-patient acquisition. >1 = Brand2 winning more new patients than Brand1. **Fixed bug:** original code used unstable epsilon division (ε=1e-9) producing values up to 4,000,000,000 |
| `clm_brand1_share` | `N_CLMBRAND1_total / (all brand claims_total + ε)` | Brand1 share of total claims pool for this HCP |
| `clm_total_mean` | `all brand claims_total / 86` | Average weekly claims across all brands |

---

## Block G — Rep Engagement

`ε = 1e-6`. Source columns: `RTE`, `SAMPLES`, `COPAY`, `DIRECTMAIL`, `SPK`, `DETAILS`.

Each promo channel produces `_total` (sum), `_mean` (avg/week), and `_ever` (binary: 1 if any activity).

| Column | Raw Source | Description |
|--------|-----------|-------------|
| `RTE_total` / `_mean` / `_ever` | `RTE` | Rep-triggered emails sent to this HCP |
| `SAMPLES_total` / `_mean` / `_ever` | `SAMPLES` | Drug samples provided |
| `COPAY_total` / `_mean` / `_ever` | `COPAY` | Copay card / patient assistance activations |
| `DIRECTMAIL_total` / `_mean` / `_ever` | `DIRECTMAIL` | Direct mail pieces sent |
| `SPK_total` / `_mean` / `_ever` | `SPK` | Speaker program engagements |
| `DETAILS_total` / `_mean` / `_ever` | `DETAILS` | Rep detail calls (product discussion visits) |

**Derived engagement metrics:**

| Column | Formula | Notes |
|--------|---------|-------|
| `promo_channel_count` | `count(channels with _ever = 1)` | Breadth of commercial engagement: 0–6 |
| `details_per_trx` | `DETAILS_total / UC_TRX_total` if `UC_TRX_total > 0`, else `0.0` | Rep calls needed per UC prescription. **Lower = HCP prescribes with less rep effort (intrinsically motivated).** SEG_B: 0.44, SEG_A: 0.94. **Fixed bug:** original code used ε in denominator, inflating values to millions for HCPs with zero UC TRX |
| `details_trend_ratio` | `min(mean_details(T3) / mean_details(T1), 5.0)` with sentinel 2.0 | Is rep engagement increasing over time? |

---

## Derived Columns (Visualization Notebook)

These columns are computed from the already-aggregated block columns. They are included in the clean export so the visualization notebook can load them directly.

| Column | Formula | Raw Dependency | Notes |
|--------|---------|---------------|-------|
| `ADOPTION_STAGE` | `"Never tried"` if `BRAND1_TRX_total = 0`; `"Active"` if `BRAND1_TRX_recent8_mean > 0`; else `"Trialed — lapsed"` | `BRAND1_TRX_total`, `BRAND1_TRX_recent8_mean` | Three-stage adoption funnel. `"Active"` HCPs are prescribing Brand1 in the most recent 8 weeks |
| `established_therapy_loyalty` | `(IL23_TRX_total / UC_TRX_total).clip(0, 1)` with `ε = 1e-9` | `IL23_TRX_total`, `UC_TRX_total` | Fraction of UC prescriptions in IL-23 biologics. High = biologic-protocol-anchored HCP. Range: [0, 1] |
| `new_patient_orientation` | `(UC_NRX_total / UC_TRX_total).clip(0, 1)` with `ε = 1e-9` | `UC_NRX_total`, `UC_TRX_total` | Fraction of UC prescriptions for new patients. High = actively acquiring new patients |
| `oral_vs_biologic_ratio` | `(ORAL_TRX_total / IL23_TRX_total).clip(upper=10)` with `ε = 1e-9` | `ORAL_TRX_total`, `IL23_TRX_total` | Preference for oral over biologic therapy. >1 = oral-leaning. Capped at 10 |
| `proxy_oral_adopter` | `brand1_share_of_uc / (median(brand1_share_of_uc) + ε)` | `brand1_share_of_uc` | Normalized adoption score. >1 = above-median Brand1 adopter. Useful for ranking unlabeled HCPs |

---

## Data Quality Notes

| Issue | Columns Affected | Status |
|-------|-----------------|--------|
| **Bug fixed:** `details_per_trx` — ε-division when UC_TRX_total=0 inflated to millions | `details_per_trx` | Fixed in clean export. 1,037 HCPs affected |
| **Bug fixed:** `comp_ntb_pressure` — epsilon mismatch (1e-6 vs 1e-9) produced values up to 4,000,000,000 | `comp_ntb_pressure` | Fixed: proper zero-denominator handling with cap at 100 |
| **Bug fixed:** `*_trend_ratio` — no cap in notebook code (values to 2,445,873) | All `_trend_ratio` columns | Fixed: cap at 5.0 + sentinel 2.0 for new adopters |
| **False alarm (not a bug):** `brand1_share_trend` outside [0,1] flagged by notebook sanity check | `brand1_share_trend` | This is a delta, correct range is [−1, +1]. 79 negative values = legitimate share loss |
| `AGE_COHORT = "Unknown"` for 3,726 HCPs | `AGE_COHORT` | All age-flag columns are 0 for these HCPs in raw data — not a decode error |
| `ATSEG_LABEL` null for 9,032 HCPs (43%) | `ATSEG_LABEL`, `IS_LABELED` | Expected: unlabeled HCPs were never field-profiled. Labeled pool skews toward higher-TRX HCPs |

---

## Column Count Summary

| Block | Columns | Description |
|-------|---------|-------------|
| A | 6 | Identity & static attributes |
| B | 56 | Prescribing volume (14 metrics × 4 stats) |
| C | 12 | Activity & consistency (3 metrics × 4 stats) |
| D | 34 | Trend, trajectory, slope, recency |
| E | 29 | Market share, ratios, growth indices |
| F | 29 | Claims & patient flow |
| G | 20 | Rep engagement |
| Derived | 5 | Visualization-notebook on-the-fly columns |
| **Total** | **191** | |
