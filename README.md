# Corporate AI Adoption Dataset — EDA Report

**Dataset:** corporate_ai_adoption_dataset.csv  
**Project:** AI Adoption Analysis — Revenue Prediction & Risk Classification  
**Team Role:** Data Engineer / ML Pipeline

---

## 1. Dataset Overview

| Property | Value |
|---|---|
| Total Rows | 200,000 |
| Total Columns | 13 |
| Missing Values | 0 |
| Duplicate Rows | 0 |
| Industries | 10 |
| Countries | 15 |
| Year Range | 2015 – 2035 |

### Columns

| Column | Type | Description |
|---|---|---|
| company_id | String | Unique company identifier (dropped in ML) |
| industry | String | Industry sector |
| country | String | Country of operation |
| year | Integer | Year of data record |
| ai_adoption_level | Float | AI adoption score (0 to 1) |
| ai_investment_usd | Integer | Total AI investment in USD |
| automation_rate | Float | Automation rate (0 to 1) |
| cost_savings | Integer | Cost savings from AI in USD |
| revenue_impact | Integer | Revenue generated due to AI in USD |
| productivity_gain | Float | Productivity improvement (0 to 1) |
| employee_ai_training_hours | Float | Training hours per employee |
| ai_maturity_score | Float | AI maturity score (1 to 10) |
| deployment_count | Integer | Number of AI deployments |

---

## 2. Descriptive Statistics

| Column | Min | Mean | Median | Max |
|---|---|---|---|---|
| ai_adoption_level | 0.01 | 0.53 | 0.53 | 1.00 |
| ai_investment_usd | $47,888 | $4,870,558 | $3,991,639 | $54,170,345 |
| automation_rate | 0.00 | 0.44 | 0.43 | 0.95 |
| cost_savings | $4,649 | $2,128,917 | $1,354,826 | $44,331,244 |
| revenue_impact | -$14,376,756 | $2,591,989 | $1,408,779 | $129,478,705 |
| productivity_gain | -0.05 | 0.40 | 0.39 | 0.94 |
| employee_ai_training_hours | 1.0 | 76.76 | 75.40 | 197.90 |
| ai_maturity_score | 1.00 | 6.27 | 6.28 | 10.00 |
| deployment_count | 3 | 26 | 25 | 58 |

### Key Observations
- Revenue impact ranges from **-$14.3M to $129.4M** — some companies are losing money from AI
- Average AI investment is **$4.87M** but median is $3.99M — right skewed (few companies invest very heavily)
- AI adoption level average is **0.53** — companies are roughly halfway in their AI journey
- Average maturity score is **6.27 out of 10** — moderate maturity across the dataset

---

## 3. Distribution Analysis (Chart 01)

- **ai_adoption_level** — roughly normal distribution centered around 0.53
- **ai_investment_usd** — right skewed, most companies invest under $5M but a few invest $20M+
- **automation_rate** — bell-shaped, most companies have 30–60% automation
- **revenue_impact** — right skewed with a long tail, few companies earn very high revenue
- **cost_savings** — similar right skew to revenue_impact
- **ai_maturity_score** — nearly normal distribution centered around 6.27
- **employee_ai_training_hours** — uniform-like spread from 1 to 198 hours
- **deployment_count** — normally distributed around 26 deployments
- **productivity_gain** — normally distributed around 0.40

---

## 4. Correlation Analysis (Chart 02)

| Feature | Correlation with Revenue Impact |
|---|---|
| cost_savings | 0.703 (Strong) |
| ai_investment_usd | 0.674 (Strong) |
| employee_ai_training_hours | 0.439 (Moderate) |
| ai_adoption_level | 0.434 (Moderate) |
| ai_maturity_score | 0.417 (Moderate) |
| productivity_gain | 0.414 (Moderate) |
| automation_rate | 0.401 (Moderate) |
| deployment_count | 0.400 (Moderate) |

### Key Observations
- **Cost savings and AI investment** are the strongest predictors of revenue impact
- All features have **positive correlation** with revenue — more AI investment always trends toward more revenue
- No feature has very high correlation (>0.8) with another — no multicollinearity issue
- All 8 numeric features are useful for ML — none can be dropped due to near-zero correlation

---

## 5. Industry Analysis (Chart 03)

### Average AI Investment by Industry

| Rank | Industry | Avg Investment (USD) |
|---|---|---|
| 1 | Financial Services | $8,206,724 |
| 2 | Technology | $6,488,823 |
| 3 | Energy | $5,783,329 |
| 4 | Healthcare | $4,921,771 |
| 5 | Telecom | $4,875,045 |
| 6 | Manufacturing | $4,075,209 |
| 7 | Logistics | $3,270,042 |
| 8 | Retail | $2,451,390 |
| 9 | Agriculture | $1,315,642 |
| 10 | Education | $806,923 |

### Average Revenue Impact by Industry

| Rank | Industry | Avg Revenue (USD) |
|---|---|---|
| 1 | Technology | $5,527,864 |
| 2 | Financial Services | $3,863,966 |
| 3 | Energy | $2,267,110 |
| 4 | Telecom | $2,264,975 |
| 5 | Healthcare | $2,059,374 |
| 6 | Manufacturing | $1,476,649 |
| 7 | Logistics | $1,358,749 |
| 8 | Retail | $1,285,910 |
| 9 | Agriculture | $445,679 |
| 10 | Education | $253,324 |

### Key Observations
- **Financial Services** invests the most in AI ($8.2M avg) but **Technology** earns the most revenue ($5.5M avg)
- **Education** invests the least ($806K) and earns the least revenue ($253K)
- **Technology** gets the best return on investment — high revenue despite not being the top investor
- **Agriculture and Education** consistently underperform in both investment and revenue

---

## 6. Yearly Trends (Chart 04)

| Year | Avg Adoption Level |
|---|---|
| 2015 | 0.191 |
| 2018 | 0.288 |
| 2020 | 0.354 |
| 2023 | 0.456 |
| 2025 | 0.530 |
| 2028 | 0.631 |
| 2030 | 0.701 |
| 2033 | 0.802 |
| 2035 | 0.858 |

### Key Observations
- AI adoption has been **steadily increasing** every year from 0.19 in 2015 to 0.86 in 2035
- Growth is **nearly linear** — consistent year-on-year improvement
- By 2030, average adoption crosses 0.70 — most companies will have strong AI adoption
- AI investment and revenue impact also increase in parallel with adoption

---

## 7. Country Analysis (Chart 05)

### Companies by Country (Top 5)

| Country | Count |
|---|---|
| United States | 50,080 |
| China | 35,906 |
| Germany | 16,040 |
| Japan | 14,125 |
| United Kingdom | 13,989 |

### Average ROI by Country (Top 10)

| Country | Avg ROI |
|---|---|
| United States | -16.91% |
| United Kingdom | -17.67% |
| China | -18.61% |
| Canada | -18.98% |
| South Korea | -19.43% |
| France | -19.98% |
| Germany | -20.12% |
| Japan | -20.46% |
| India | -20.62% |
| Brazil | -23.66% |

### Key Observations
- **United States** has the most companies (50,080) and the best ROI (-16.91%)
- **Brazil** has the lowest ROI (-23.66%) among top countries
- All countries show **negative average ROI** — meaning most companies are not yet recovering their full AI investment
- This is expected for a dataset spanning 2015–2035 as early AI investments take time to generate returns

---

## 8. Outlier Detection (Chart 06)

| Column | Outlier Count | Outlier % |
|---|---|---|
| revenue_impact | 15,869 | 7.9% |
| ai_investment_usd | ~14,000 | ~7% |
| cost_savings | ~13,000 | ~6.5% |

### Key Observations
- **Revenue impact** has the most outliers (7.9%) — a few companies earn extremely high revenue
- Max revenue is **$129.4M** while median is only $1.4M — massive spread
- Min revenue is **-$14.3M** — some companies are losing significantly from AI
- Outliers were removed using the **IQR method** before ML training — removed ~28,560 rows (14.3%)

---

## 9. Key Relationships (Chart 07)

### Investment vs Revenue
- Positive relationship — higher AI investment generally leads to higher revenue
- But not perfectly linear — some companies with moderate investment earn very high revenue (Technology sector)
- Scatter is wide — investment alone doesn't guarantee revenue

### Maturity vs Adoption
- Strong positive relationship — companies with higher AI maturity score also have higher adoption level
- Makes business sense — as companies get better at AI, they adopt more of it

### Automation vs Productivity
- Positive relationship — more automation leads to more productivity gain
- Fairly consistent pattern — automation is a reliable driver of productivity

---

## 10. Industry Heatmap (Chart 08)

### Key Observations
- **Energy** has the highest AI adoption level (0.532) despite not being a top investor
- **Education** has the lowest scores across almost all metrics
- **AI maturity scores** are fairly similar across industries (5.5–6.5 range) — no single industry dominates
- **Deployment count** is highest in Technology and Financial Services
- All industries show moderate automation rates (0.40–0.50 range)

---

## 11. ROI Analysis (Chart 09)

### ROI Formula
```
ROI (%) = ((revenue_impact + cost_savings - ai_investment_usd) / ai_investment_usd) × 100
```

### ROI by Industry

| Industry | Avg ROI |
|---|---|
| Technology | +31.25% ✅ |
| Retail | -16.82% |
| Financial Services | -21.46% |
| Telecom | -23.35% |
| Logistics | -27.90% |
| Energy | -32.49% |
| Healthcare | -34.26% |
| Manufacturing | -35.93% |
| Agriculture | -42.29% |
| Education | -52.46% |

### Key Observations
- **Technology is the only industry with positive ROI (+31.25%)** — it successfully recovers and exceeds AI investment
- **Education has the worst ROI (-52.46%)** — spending heavily relative to returns
- Most industries have **negative ROI** — AI investments are still maturing and will take more years to recover
- Overall mean ROI is **-30.77%** — the dataset reflects the real world where AI ROI takes 3–5 years to break even

---

## 12. Summary of Key EDA Findings

1. **No missing values or duplicates** — dataset is clean and ready for ML
2. **All features positively correlate** with revenue — all are useful for prediction
3. **Technology sector** gets the best ROI; **Education** gets the worst
4. **Financial Services** invests the most in AI; **Education** invests the least
5. **AI adoption is growing steadily** year over year from 19% in 2015 to 86% in 2035
6. **United States** leads in both company count and ROI performance
7. **7.9% of revenue data are outliers** — removed before ML training
8. **Negative ROI is common** — most companies haven't recovered AI investment yet
9. **Cost savings and AI investment** are the strongest predictors of revenue impact
10. **Automation drives productivity** — consistent positive relationship across all industries

---


*EDA performed using Python (pandas, matplotlib, seaborn)*  
*Charts: eda_01 to eda_09 PNG files*
