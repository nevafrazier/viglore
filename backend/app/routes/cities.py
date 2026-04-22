from fastapi import APIRouter

router = APIRouter()

CITY_DATA = [
    {
        "name": "Austin, TX", "tech_score": 95, "growth_label": "Explosive",
        "total_tech_jobs": 8400, "ai_jobs": 1240, "finance_tech_jobs": 1100,
        "avg_salary": 132000, "startup_activity": "Very High",
        "top_industries": ["AI & Machine Learning", "Semiconductors", "Fintech", "Cloud Computing"],
        "summary": "Austin has emerged as the dominant alternative to Silicon Valley, drawing Tesla, Apple, and Google with its no-income-tax environment and lower cost of living. The city leads the nation in tech job growth rate and venture capital inflow relative to its size, with particular strength in semiconductor design and AI infrastructure companies.",
        "cost_of_living": {"index": 95, "note": "Slightly below US average. Rising fast due to migration from CA and NY.", "avg_rent_1br": 1650, "avg_home_price": 540000},
        "weather": {"description": "Hot summers, mild winters, sunny nearly year-round.", "avg_summer": "95°F (35°C)", "avg_winter": "52°F (11°C)", "sunny_days": 228},
        "colleges": ["University of Texas at Austin", "St. Edward's University", "Austin Community College"],
        "major_companies": ["Tesla", "Apple", "Google", "Meta", "Oracle", "Dell Technologies", "IBM", "Indeed"]
    },
    {
        "name": "Seattle, WA", "tech_score": 92, "growth_label": "Strong",
        "total_tech_jobs": 14200, "ai_jobs": 2800, "finance_tech_jobs": 1400,
        "avg_salary": 158000, "startup_activity": "Very High",
        "top_industries": ["Cloud Computing", "E-Commerce", "AI Research", "Aerospace Tech"],
        "summary": "Seattle remains one of the highest-paying tech markets in the country, anchored by Amazon and Microsoft headquarters. The city has a mature, deep talent pool with particularly strong cloud infrastructure, AI research, and enterprise software ecosystems. Amazon's AWS and Microsoft Azure both operate significant research divisions here.",
        "cost_of_living": {"index": 118, "note": "Above US average. High salaries offset higher costs but housing is competitive.", "avg_rent_1br": 2100, "avg_home_price": 720000},
        "weather": {"description": "Mild, rainy winters. Warm, dry summers. Overcast much of the year.", "avg_summer": "75°F (24°C)", "avg_winter": "40°F (4°C)", "sunny_days": 152},
        "colleges": ["University of Washington", "Seattle University", "Bellevue College"],
        "major_companies": ["Amazon (HQ)", "Microsoft (HQ)", "Boeing", "Expedia", "Zillow", "Redfin", "Convoy"]
    },
    {
        "name": "Dallas, TX", "tech_score": 91, "growth_label": "Strong",
        "total_tech_jobs": 9100, "ai_jobs": 1450, "finance_tech_jobs": 2200,
        "avg_salary": 118000, "startup_activity": "High",
        "top_industries": ["Fintech", "Telecom", "AI & Data", "Cybersecurity"],
        "summary": "Dallas is the largest fintech hub in the southern United States, benefiting from AT&T's global headquarters, Goldman Sachs and JPMorgan's expanding tech campuses, and a business-friendly regulatory environment. The city's financial services tech sector is outpacing national growth rates.",
        "cost_of_living": {"index": 101, "note": "Right at the US average. No state income tax.", "avg_rent_1br": 1520, "avg_home_price": 420000},
        "weather": {"description": "Very hot summers, mild winters. Occasional severe spring storms.", "avg_summer": "96°F (36°C)", "avg_winter": "45°F (7°C)", "sunny_days": 234},
        "colleges": ["SMU", "UT Dallas", "TCU", "University of North Texas"],
        "major_companies": ["AT&T", "Goldman Sachs", "JPMorgan Chase", "American Airlines", "Toyota North America", "Match Group"]
    },
    {
        "name": "Boston, MA", "tech_score": 90, "growth_label": "Strong",
        "total_tech_jobs": 11800, "ai_jobs": 2200, "finance_tech_jobs": 1900,
        "avg_salary": 148000, "startup_activity": "Very High",
        "top_industries": ["Biotech & Life Sciences", "AI Research", "Fintech", "Robotics"],
        "summary": "Boston is one of the world's premier biotech and life sciences hubs, driven by proximity to MIT, Harvard, and a dense concentration of research hospitals. The city also hosts a rapidly expanding AI research community, with major labs from Google, Microsoft, and numerous AI-native startups operating out of Kendall Square.",
        "cost_of_living": {"index": 122, "note": "Significantly above US average. One of the most expensive markets outside of NYC and SF.", "avg_rent_1br": 2800, "avg_home_price": 780000},
        "weather": {"description": "Cold snowy winters, warm summers, beautiful fall foliage.", "avg_summer": "82°F (28°C)", "avg_winter": "30°F (-1°C)", "sunny_days": 200},
        "colleges": ["MIT", "Harvard University", "Northeastern University", "Boston University", "Tufts"],
        "major_companies": ["Wayfair", "HubSpot", "Moderna", "Biogen", "Fidelity Investments", "State Street", "Toast"]
    },
    {
        "name": "Chicago, IL", "tech_score": 88, "growth_label": "Strong",
        "total_tech_jobs": 10400, "ai_jobs": 1600, "finance_tech_jobs": 3100,
        "avg_salary": 124000, "startup_activity": "High",
        "top_industries": ["Fintech", "Trading & Finance", "Enterprise SaaS", "Logistics Tech"],
        "summary": "Chicago is the financial trading capital of the United States and is rapidly becoming a major fintech hub, with the Chicago Mercantile Exchange, CBOE, and a growing number of algorithmic trading and blockchain companies headquartered there. The city's enterprise SaaS ecosystem is also maturing quickly.",
        "cost_of_living": {"index": 107, "note": "Slightly above US average. High property taxes but strong salary compensation.", "avg_rent_1br": 1900, "avg_home_price": 330000},
        "weather": {"description": "Very cold winters with heavy snow. Hot humid summers. Windy year-round.", "avg_summer": "84°F (29°C)", "avg_winter": "26°F (-3°C)", "sunny_days": 189},
        "colleges": ["University of Chicago", "Northwestern University", "Illinois Institute of Technology", "DePaul"],
        "major_companies": ["Morningstar", "Groupon", "Outcome Health", "Tempus", "Relativity", "SPINS", "Coyote Logistics"]
    },
    {
        "name": "Raleigh, NC", "tech_score": 87, "growth_label": "Strong",
        "total_tech_jobs": 6200, "ai_jobs": 980, "finance_tech_jobs": 870,
        "avg_salary": 112000, "startup_activity": "High",
        "top_industries": ["Cybersecurity", "Biotech", "Software Engineering", "AI Research"],
        "summary": "Raleigh anchors the Research Triangle — one of the most research-dense corridors in the US — benefiting from NC State, Duke, and UNC Chapel Hill as major talent pipelines. The region has the highest concentration of PhD-level engineers outside of Boston and the Bay Area, making it ideal for deep tech and cybersecurity.",
        "cost_of_living": {"index": 93, "note": "Below US average. Excellent value for tech salaries vs. living costs.", "avg_rent_1br": 1450, "avg_home_price": 390000},
        "weather": {"description": "Four distinct seasons. Mild summers, cool winters, occasional light snow.", "avg_summer": "88°F (31°C)", "avg_winter": "40°F (4°C)", "sunny_days": 213},
        "colleges": ["NC State University", "Duke University", "UNC Chapel Hill"],
        "major_companies": ["Red Hat (IBM)", "Cisco", "SAS Institute", "Lenovo", "Epic Games", "Bandwidth"]
    },
    {
        "name": "Miami, FL", "tech_score": 86, "growth_label": "Explosive",
        "total_tech_jobs": 5800, "ai_jobs": 920, "finance_tech_jobs": 1700,
        "avg_salary": 108000, "startup_activity": "Very High",
        "top_industries": ["Fintech", "Crypto & Web3", "Latin America Tech", "Real Estate Tech"],
        "summary": "Miami has undergone one of the fastest tech ecosystem transformations of any US city, driven by the mayor's active tech recruitment, no state income tax, and its position as the financial gateway to Latin America. The city has become a hub for crypto, Web3, and fintech companies, with significant hedge fund and VC relocation from New York.",
        "cost_of_living": {"index": 112, "note": "Above US average and rising. Luxury real estate has pushed costs up significantly.", "avg_rent_1br": 2200, "avg_home_price": 580000},
        "weather": {"description": "Tropical. Hot and humid year-round. Hurricane season June-November.", "avg_summer": "90°F (32°C)", "avg_winter": "68°F (20°C)", "sunny_days": 248},
        "colleges": ["University of Miami", "Florida International University", "Miami Dade College"],
        "major_companies": ["Citadel", "Founders Fund", "Blockchain.com", "Pipe", "Kaseya", "Magic Leap"]
    },
    {
        "name": "Denver, CO", "tech_score": 85, "growth_label": "Strong",
        "total_tech_jobs": 5700, "ai_jobs": 870, "finance_tech_jobs": 950,
        "avg_salary": 119000, "startup_activity": "High",
        "top_industries": ["Aerospace Tech", "Cybersecurity", "SaaS", "Clean Energy Tech"],
        "summary": "Denver's tech growth is fueled by a combination of aerospace and defense contracts, government cybersecurity work, and a rapidly growing SaaS startup community. The city consistently ranks highly for quality of life among tech workers, contributing to strong talent retention.",
        "cost_of_living": {"index": 103, "note": "Slightly above US average. Higher housing offset by strong salaries.", "avg_rent_1br": 1720, "avg_home_price": 560000},
        "weather": {"description": "Mild summers, cold snowy winters. Over 300 sunny days per year.", "avg_summer": "85°F (29°C)", "avg_winter": "32°F (0°C)", "sunny_days": 300},
        "colleges": ["University of Denver", "CU Denver", "Colorado State University"],
        "major_companies": ["Lockheed Martin", "DISH Network", "Arrow Electronics", "Palantir", "Ping Identity"]
    },
    {
        "name": "Atlanta, GA", "tech_score": 83, "growth_label": "Rising",
        "total_tech_jobs": 5900, "ai_jobs": 910, "finance_tech_jobs": 1400,
        "avg_salary": 108000, "startup_activity": "High",
        "top_industries": ["Fintech", "Media Tech", "Cybersecurity", "Cloud"],
        "summary": "Atlanta has established itself as the fintech capital of the Southeast, processing more payment transactions annually than any US city outside of New York. Georgia Tech provides a world-class engineering pipeline, and the city's HBCU network — including Morehouse and Spelman — is increasingly producing tech talent.",
        "cost_of_living": {"index": 96, "note": "Slightly below US average. Traffic adds hidden time costs.", "avg_rent_1br": 1580, "avg_home_price": 380000},
        "weather": {"description": "Hot humid summers, mild winters. Rarely snows significantly.", "avg_summer": "89°F (32°C)", "avg_winter": "44°F (7°C)", "sunny_days": 216},
        "colleges": ["Georgia Tech", "Emory University", "Georgia State", "Morehouse", "Spelman"],
        "major_companies": ["NCR Voyix", "Cardlytics", "Cox Enterprises", "Delta Tech", "Home Depot HQ", "Salesloft"]
    },
    {
        "name": "Salt Lake City, UT", "tech_score": 82, "growth_label": "Explosive",
        "total_tech_jobs": 4900, "ai_jobs": 780, "finance_tech_jobs": 820,
        "avg_salary": 110000, "startup_activity": "Very High",
        "top_industries": ["SaaS", "Cybersecurity", "Fintech", "Health Tech"],
        "summary": "Silicon Slopes — the tech corridor stretching from Salt Lake City to Provo — is one of the fastest-growing tech ecosystems in the country on a per-capita basis. The region benefits from a young, highly educated workforce, low taxes, and a strong community of bootstrapped and venture-backed SaaS companies.",
        "cost_of_living": {"index": 96, "note": "Slightly below US average. Rising fast but still strong value.", "avg_rent_1br": 1480, "avg_home_price": 460000},
        "weather": {"description": "Cold snowy winters (world-class skiing), warm dry summers.", "avg_summer": "92°F (33°C)", "avg_winter": "30°F (-1°C)", "sunny_days": 222},
        "colleges": ["University of Utah", "Brigham Young University", "Utah Valley University"],
        "major_companies": ["Adobe", "Qualtrics", "Domo", "Pluralsight", "Ancestry", "HealthEquity", "Vivint"]
    },
    {
        "name": "Charlotte, NC", "tech_score": 81, "growth_label": "Rising",
        "total_tech_jobs": 4800, "ai_jobs": 760, "finance_tech_jobs": 1800,
        "avg_salary": 104000, "startup_activity": "Medium",
        "top_industries": ["Banking Tech", "Fintech", "Data Analytics", "Cybersecurity"],
        "summary": "Charlotte is the second-largest US banking center after New York, hosting Bank of America and Wells Fargo headquarters. This concentration of financial infrastructure drives strong demand for financial technology, risk analytics, and banking software — making it a strategic market for anyone targeting the finance sector.",
        "cost_of_living": {"index": 94, "note": "Below US average. Great for finance-tech careers without NYC price tag.", "avg_rent_1br": 1480, "avg_home_price": 370000},
        "weather": {"description": "Hot summers, mild winters. Occasional ice storms.", "avg_summer": "90°F (32°C)", "avg_winter": "42°F (6°C)", "sunny_days": 218},
        "colleges": ["UNC Charlotte", "Davidson College", "Queens University"],
        "major_companies": ["Bank of America (HQ)", "Wells Fargo Tech Hub", "Truist Financial", "Duke Energy", "AvidXchange"]
    },
    {
        "name": "Phoenix, AZ", "tech_score": 80, "growth_label": "Explosive",
        "total_tech_jobs": 5200, "ai_jobs": 840, "finance_tech_jobs": 1100,
        "avg_salary": 105000, "startup_activity": "High",
        "top_industries": ["Semiconductor Manufacturing", "Fintech", "Healthcare Tech", "Logistics"],
        "summary": "Phoenix is experiencing one of the largest manufacturing and tech investment surges of any US city, driven by TSMC's $40B semiconductor fab investment and Intel's expanded manufacturing presence. The city is positioning itself as a key node in the US domestic semiconductor supply chain.",
        "cost_of_living": {"index": 98, "note": "Near US average. Housing rising fast due to migration but still competitive.", "avg_rent_1br": 1550, "avg_home_price": 400000},
        "weather": {"description": "Very hot summers (extreme heat alerts). Mild, sunny winters.", "avg_summer": "104°F (40°C)", "avg_winter": "56°F (13°C)", "sunny_days": 299},
        "colleges": ["Arizona State University", "University of Arizona", "Grand Canyon University"],
        "major_companies": ["TSMC (fab)", "Intel", "PayPal", "GoDaddy", "Microchip Technology", "ON Semiconductor"]
    },
    {
        "name": "Pittsburgh, PA", "tech_score": 79, "growth_label": "Rising",
        "total_tech_jobs": 4100, "ai_jobs": 890, "finance_tech_jobs": 620,
        "avg_salary": 107000, "startup_activity": "High",
        "top_industries": ["AI & Robotics", "Autonomous Vehicles", "Healthcare AI", "Advanced Manufacturing"],
        "summary": "Pittsburgh punches well above its size in artificial intelligence and robotics, anchored by Carnegie Mellon University — consistently ranked the top AI research university in the world. Uber ATG, Waymo, and Aurora have all established autonomous vehicle research centers here, drawn by CMU's deep talent pipeline.",
        "cost_of_living": {"index": 88, "note": "Well below US average. One of the best value markets for tech talent.", "avg_rent_1br": 1200, "avg_home_price": 240000},
        "weather": {"description": "Cold snowy winters, warm summers. Overcast frequently in winter.", "avg_summer": "83°F (28°C)", "avg_winter": "32°F (0°C)", "sunny_days": 161},
        "colleges": ["Carnegie Mellon University", "University of Pittsburgh", "Duquesne University"],
        "major_companies": ["Google (AI lab)", "Uber ATG", "Aurora Innovation", "Duolingo", "Argo AI", "RE/MAX"]
    },
    {
        "name": "Nashville, TN", "tech_score": 78, "growth_label": "Rising",
        "total_tech_jobs": 3200, "ai_jobs": 620, "finance_tech_jobs": 590,
        "avg_salary": 98000, "startup_activity": "Medium",
        "top_industries": ["Healthcare Tech", "SaaS", "Logistics Tech", "Music Tech"],
        "summary": "Nashville is the healthcare technology capital of the United States, home to more healthcare companies per capita than any other US city. HCA Healthcare, one of the largest hospital operators globally, is headquartered here, driving strong demand for health informatics, medical software, and health data analytics talent.",
        "cost_of_living": {"index": 91, "note": "Below US average. No state income tax. Strong growth value.", "avg_rent_1br": 1620, "avg_home_price": 420000},
        "weather": {"description": "Hot summers, mild winters. Occasional ice storms.", "avg_summer": "90°F (32°C)", "avg_winter": "38°F (3°C)", "sunny_days": 208},
        "colleges": ["Vanderbilt University", "Belmont University", "Tennessee State University"],
        "major_companies": ["Amazon (hub)", "HCA Healthcare (HQ)", "AllianceBernstein", "Dollar General Tech"]
    },
    {
        "name": "Minneapolis, MN", "tech_score": 77, "growth_label": "Rising",
        "total_tech_jobs": 4300, "ai_jobs": 680, "finance_tech_jobs": 1200,
        "avg_salary": 113000, "startup_activity": "Medium",
        "top_industries": ["Medical Devices", "Financial Services Tech", "Retail Tech", "AgTech"],
        "summary": "Minneapolis is a quietly underrated tech hub with particular strength in medical devices — Medtronic, one of the world's largest medical technology companies, is headquartered here. The city also hosts significant financial services technology activity driven by US Bancorp and a growing retail tech sector from Target's technology division.",
        "cost_of_living": {"index": 97, "note": "Near US average. Good value for the tech salaries available.", "avg_rent_1br": 1380, "avg_home_price": 310000},
        "weather": {"description": "Very cold winters with significant snowfall. Warm summers. Extreme seasonal variation.", "avg_summer": "83°F (28°C)", "avg_winter": "16°F (-9°C)", "sunny_days": 198},
        "colleges": ["University of Minnesota", "Macalester College", "Carleton College"],
        "major_companies": ["Medtronic (HQ)", "Target (tech div)", "US Bancorp", "Best Buy", "3M", "Cargill"]
    },
    {
        "name": "Tampa, FL", "tech_score": 76, "growth_label": "Rising",
        "total_tech_jobs": 3600, "ai_jobs": 580, "finance_tech_jobs": 920,
        "avg_salary": 96000, "startup_activity": "Medium",
        "top_industries": ["Cybersecurity", "Healthcare IT", "Fintech", "Defense Tech"],
        "summary": "Tampa has emerged as a growing cybersecurity hub, partly due to proximity to MacDill Air Force Base and US Central Command. The region hosts a significant defense technology contractor ecosystem and is increasingly attracting financial services firms relocating from higher-cost Northeast markets.",
        "cost_of_living": {"index": 96, "note": "Slightly below US average. Rising quickly due to migration from Northeast.", "avg_rent_1br": 1720, "avg_home_price": 370000},
        "weather": {"description": "Hot humid summers with frequent afternoon thunderstorms. Warm mild winters.", "avg_summer": "91°F (33°C)", "avg_winter": "58°F (14°C)", "sunny_days": 233},
        "colleges": ["University of South Florida", "University of Tampa", "Hillsborough Community College"],
        "major_companies": ["Jabil", "WellCare Health", "Raymond James", "Citigroup (tech hub)", "ConnectWise"]
    },
    {
        "name": "Columbus, OH", "tech_score": 75, "growth_label": "Rising",
        "total_tech_jobs": 3400, "ai_jobs": 540, "finance_tech_jobs": 980,
        "avg_salary": 97000, "startup_activity": "Medium",
        "top_industries": ["Fintech", "Insurance Tech", "E-Commerce Tech", "Data Centers"],
        "summary": "Columbus benefits from Ohio State University's large engineering output and a growing financial services technology sector anchored by Nationwide Insurance and JPMorgan's significant operations presence. The city is also becoming a major data center hub due to its central location, reliable power, and lower land costs.",
        "cost_of_living": {"index": 86, "note": "Well below US average. Excellent value market with growing salaries.", "avg_rent_1br": 1150, "avg_home_price": 275000},
        "weather": {"description": "Cold winters with moderate snow. Warm humid summers.", "avg_summer": "84°F (29°C)", "avg_winter": "30°F (-1°C)", "sunny_days": 177},
        "colleges": ["Ohio State University", "Columbus State Community College", "Capital University"],
        "major_companies": ["Nationwide (HQ)", "JPMorgan (major ops)", "AEP", "Limited Brands", "Root Insurance"]
    },
    {
        "name": "San Antonio, TX", "tech_score": 74, "growth_label": "Rising",
        "total_tech_jobs": 3100, "ai_jobs": 490, "finance_tech_jobs": 720,
        "avg_salary": 92000, "startup_activity": "Medium",
        "top_industries": ["Cybersecurity", "Military Tech", "Cloud Infrastructure", "Healthcare IT"],
        "summary": "San Antonio is the cybersecurity capital of the United States by some metrics, hosting the NSA's largest field office, US Army Cyber Command, and over 80 cybersecurity-focused companies. This military-driven demand has created a specialized talent pipeline and government contracting ecosystem unlike anywhere else.",
        "cost_of_living": {"index": 87, "note": "Below US average. No state income tax and affordable housing.", "avg_rent_1br": 1180, "avg_home_price": 280000},
        "weather": {"description": "Very hot summers, mild winters. Occasional brief freezes.", "avg_summer": "97°F (36°C)", "avg_winter": "50°F (10°C)", "sunny_days": 220},
        "colleges": ["UT San Antonio", "Trinity University", "St. Mary's University"],
        "major_companies": ["USAA (HQ)", "Rackspace (HQ)", "Valero Energy Tech", "H-E-B Digital", "iHeartMedia"]
    },
    {
        "name": "Indianapolis, IN", "tech_score": 73, "growth_label": "Emerging",
        "total_tech_jobs": 2900, "ai_jobs": 450, "finance_tech_jobs": 680,
        "avg_salary": 93000, "startup_activity": "Medium",
        "top_industries": ["Healthcare IT", "Logistics Tech", "Insurance Tech", "Life Sciences"],
        "summary": "Indianapolis is quietly becoming a significant healthcare IT hub, driven by Eli Lilly's global pharmaceutical headquarters and a dense network of hospital systems including IU Health. The city offers one of the best cost-to-compensation ratios in tech, making it attractive for companies looking to build engineering teams outside expensive coastal markets.",
        "cost_of_living": {"index": 84, "note": "Significantly below US average. Exceptional value for tech professionals.", "avg_rent_1br": 1050, "avg_home_price": 255000},
        "weather": {"description": "Cold snowy winters, warm humid summers. Significant seasonal variation.", "avg_summer": "84°F (29°C)", "avg_winter": "28°F (-2°C)", "sunny_days": 183},
        "colleges": ["Indiana University", "Purdue University (IUPUI)", "Butler University"],
        "major_companies": ["Eli Lilly (HQ)", "Salesforce (regional HQ)", "Angi", "Interactive Intelligence", "KSM"]
    },
    {
        "name": "Portland, OR", "tech_score": 72, "growth_label": "Emerging",
        "total_tech_jobs": 3200, "ai_jobs": 520, "finance_tech_jobs": 480,
        "avg_salary": 118000, "startup_activity": "Medium",
        "top_industries": ["Semiconductor Design", "Clean Tech", "SaaS", "Creative Tech"],
        "summary": "Portland hosts a significant but often overlooked semiconductor design cluster, anchored by Intel's largest global campus in Hillsboro. The city also has a growing clean technology sector, aligning with Oregon's progressive energy policy. The tech culture tends toward open-source and mission-driven startups.",
        "cost_of_living": {"index": 109, "note": "Above US average but lower than Seattle or SF.", "avg_rent_1br": 1750, "avg_home_price": 480000},
        "weather": {"description": "Mild and very rainy in winter. Warm, dry, and beautiful in summer.", "avg_summer": "80°F (27°C)", "avg_winter": "40°F (4°C)", "sunny_days": 144},
        "colleges": ["Oregon Health & Science University", "Portland State University", "Reed College"],
        "major_companies": ["Intel (largest campus)", "Nike (HQ)", "adidas North America", "Daimler Trucks", "Precision Castparts"]
    },
    {
        "name": "Kansas City, MO", "tech_score": 70, "growth_label": "Emerging",
        "total_tech_jobs": 2600, "ai_jobs": 400, "finance_tech_jobs": 620,
        "avg_salary": 90000, "startup_activity": "Medium",
        "top_industries": ["Logistics Tech", "AgTech", "Insurance Tech", "Smart City Infrastructure"],
        "summary": "Kansas City is positioning itself as a logistics and supply chain technology hub, leveraging its central US location and rail infrastructure. The city was one of the first in the nation to deploy citywide gigabit internet infrastructure and has attracted a growing number of smart city and IoT technology companies.",
        "cost_of_living": {"index": 83, "note": "Well below US average. One of the most affordable large metros in the US.", "avg_rent_1br": 1050, "avg_home_price": 250000},
        "weather": {"description": "Cold snowy winters, hot humid summers. Tornado risk in spring.", "avg_summer": "89°F (32°C)", "avg_winter": "29°F (-2°C)", "sunny_days": 193},
        "colleges": ["University of Missouri-Kansas City", "Kansas State University", "Rockhurst University"],
        "major_companies": ["Cerner (Oracle)", "Garmin (regional)", "Sprint (T-Mobile)", "H&R Block Tech", "VinSolutions"]
    },
    {
        "name": "Baltimore, MD", "tech_score": 69, "growth_label": "Emerging",
        "total_tech_jobs": 2800, "ai_jobs": 520, "finance_tech_jobs": 580,
        "avg_salary": 108000, "startup_activity": "Medium",
        "top_industries": ["Cybersecurity", "Government Tech", "Biotech", "Defense Tech"],
        "summary": "Baltimore benefits from its proximity to Washington DC and the NSA's Fort Meade campus, creating significant demand for cybersecurity and government technology contractors. Johns Hopkins University drives a strong biomedical research and health informatics ecosystem that is increasingly intersecting with AI and data science.",
        "cost_of_living": {"index": 98, "note": "Near US average. Good value given proximity to DC and strong federal salaries.", "avg_rent_1br": 1520, "avg_home_price": 310000},
        "weather": {"description": "Cold winters, hot humid summers. Mid-Atlantic climate with four seasons.", "avg_summer": "87°F (31°C)", "avg_winter": "34°F (1°C)", "sunny_days": 205},
        "colleges": ["Johns Hopkins University", "University of Maryland", "Towson University"],
        "major_companies": ["Leidos", "Northrop Grumman", "T. Rowe Price", "Under Armour Tech", "Medifast"]
    },
    {
        "name": "Detroit, MI", "tech_score": 68, "growth_label": "Emerging",
        "total_tech_jobs": 2500, "ai_jobs": 480, "finance_tech_jobs": 420,
        "avg_salary": 95000, "startup_activity": "Medium",
        "top_industries": ["Automotive Tech", "Autonomous Vehicles", "Manufacturing AI", "Mobility Tech"],
        "summary": "Detroit is undergoing a significant technology transformation driven by the automotive industry's shift toward electric vehicles and autonomous driving systems. Ford, GM, and Stellantis are all investing heavily in software engineering and AI talent, creating a new category of automotive-tech roles that combine traditional manufacturing expertise with modern software development.",
        "cost_of_living": {"index": 82, "note": "Below US average. City revitalization ongoing — housing very affordable.", "avg_rent_1br": 1050, "avg_home_price": 210000},
        "weather": {"description": "Very cold snowy winters, warm summers. Lake effect snow from Lake Erie.", "avg_summer": "82°F (28°C)", "avg_winter": "25°F (-4°C)", "sunny_days": 160},
        "colleges": ["University of Michigan", "Michigan State University", "Wayne State University"],
        "major_companies": ["Ford (tech div)", "GM (tech div)", "Stellantis", "Quicken Loans (Rocket)", "Lear Corporation"]
    },
    {
        "name": "Orlando, FL", "tech_score": 67, "growth_label": "Emerging",
        "total_tech_jobs": 2400, "ai_jobs": 420, "finance_tech_jobs": 380,
        "avg_salary": 89000, "startup_activity": "Medium",
        "top_industries": ["Simulation Tech", "Defense & Aerospace", "Hospitality Tech", "Gaming"],
        "summary": "Orlando hosts one of the world's most concentrated simulation and modeling technology clusters, driven by contracts with the US military's training and simulation programs based at the Army's Program Executive Office for Simulation, Training and Instrumentation. The gaming and esports sector is also growing significantly.",
        "cost_of_living": {"index": 94, "note": "Below US average. No state income tax. Rising due to migration.", "avg_rent_1br": 1650, "avg_home_price": 360000},
        "weather": {"description": "Hot and humid year-round. Afternoon thunderstorms common in summer. Hurricane risk.", "avg_summer": "91°F (33°C)", "avg_winter": "60°F (15°C)", "sunny_days": 233},
        "colleges": ["University of Central Florida (largest US enrollment)", "Full Sail University", "Valencia College"],
        "major_companies": ["Lockheed Martin (simulation)", "Northrop Grumman", "EA (studio)", "Electronic Arts", "CNL Financial"]
    },
    {
        "name": "Richmond, VA", "tech_score": 65, "growth_label": "Emerging",
        "total_tech_jobs": 1900, "ai_jobs": 310, "finance_tech_jobs": 480,
        "avg_salary": 92000, "startup_activity": "Low",
        "top_industries": ["Government Tech", "Cybersecurity", "Financial Services Tech", "Data Centers"],
        "summary": "Richmond is an emerging market benefiting from Virginia's dominant position in US data center infrastructure — Northern Virginia hosts more data center capacity than anywhere else on Earth, and Richmond is increasingly part of this corridor. The city also has growing government technology and financial services activity.",
        "cost_of_living": {"index": 91, "note": "Below US average. Good value with access to DC and Northern Virginia markets.", "avg_rent_1br": 1280, "avg_home_price": 330000},
        "weather": {"description": "Mild four seasons. Hot humid summers, cold winters with occasional snow.", "avg_summer": "88°F (31°C)", "avg_winter": "35°F (2°C)", "sunny_days": 205},
        "colleges": ["Virginia Commonwealth University", "University of Richmond", "Virginia Union University"],
        "major_companies": ["Capital One (nearby)", "Dominion Energy Tech", "CarMax Digital", "Markel", "Altria Group"]
    },
]


@router.get("/cities")
def get_cities():
    return sorted(CITY_DATA, key=lambda x: x["tech_score"], reverse=True)
