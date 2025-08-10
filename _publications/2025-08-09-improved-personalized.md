---
title: "Improved Personalized Headline Generation via Denoising Fake Interests from Implicit Feedback"
collection: publications
category: conferences
permalink: /publication/2025-08-09-improved-personalized
excerpt: 'Kejin Liu, **Junhong Lian**, Xiang Ao*, Ningtao Wang, Xing Fu, Yu Cheng, Weiqiang Wang and Xinyu Liu. (2025). &quot;Improved Personalized Headline Generation via Denoising Fake Interests from Implicit Feedback.&quot; <i>In Proceedings of the 34th ACM International Conference on Information and Knowledge Management (CIKM2025).</i> K. Liu and J. Lian are equally contributed.'
date: 2025-08-09
venue: 'The 34th ACM International Conference on Information and Knowledge Management (CIKM 2025)'
# slidesurl: 'http://t-atlas.github.io/files/CIKM2025_slides.pdf'
paperurl: 'http://t-atlas.github.io/files/CIKM2025_paper.pdf'
citation: 'Liu, Kejin, et al. "Improved Personalized Headline Generation via Denoising Fake Interests from Implicit Feedback." <i>Proceedings of the 34th ACM International Conference on Information and Knowledge Management (CIKM 2025).</i> 2025.'
---

`TL;DR` This paper proposes PHG-DIF, a personalized headline generator that denoises clickstream noise with dual filtering and models instant, evolving, and stable interests via dynamic aggregation. We also release DT-PENS with dwell-time logs. Experiments show state-of-the-art results.

`Abstract` Accurate personalized headline generation hinges on precisely capturing user interests from historical behaviors. However, existing methods neglect personalized-irrelevant click noise in entire historical clickstreams, which may lead to hallucinated headlines that deviate from genuine user preferences. In this paper, we reveal the detrimental impact of click noise on personalized generation quality through rigorous analysis in both user and news dimensions. Based on these insights, we propose a novel Personalized Headline Generation framework via Denoising Fake Interests from Implicit Feedback (PHG-DIF). PHG-DIF first employs dual-stage filtering to effectively remove clickstream noise, identified by short dwell times and abnormal click bursts, and then leverages multi-level temporal fusion to dynamically model users' evolving and multi-faceted interests for precise profiling. Moreover, we release DT-PENS, a new benchmark dataset comprising the click behavior of 1,000 carefully curated users and nearly 10,000 annotated personalized headlines with historical dwell time annotations. Extensive experiments demonstrate that PHG-DIF substantially mitigates the adverse effects of click noise and significantly improves headline quality, achieving state-of-the-art (SOTA) results on DT-PENS. Our framework implementation and dataset are available at https://github.com/liukejin-up/PHG-DIF.