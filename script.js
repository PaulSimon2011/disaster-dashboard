const analysisResult = {
  // --- Image Outputs ---
  imageOriginal: "assets/original_sample.png",
  imageEnhanced: "assets/enhanced_sample.png",
  imageMasked: "assets/masked_sample.png",

  // --- Metadata ---
  locationName: "Kandivali West, Mumbai",
  eventType: "Urban Flooding – Post-Monsoon",
  capturedAt: "2025-07-22 09:47 IST",

  // --- Severity Classification ---
  severityLabel: "High",          // High / Medium / Low
  severityScore: 0.91,            // 0 to 1

  // --- Detection Statistics ---
  damagePercent: 74,              // Segmentation output
  buildingsAffected: 412,
  roadsBlocked: 23,
  populationAtRisk: 5620,

  // --- Key Observations (Generated Insights) ---
  insights: [
    "Widespread water-logging detected in lower metropolitan blocks, with approximately 74% of the visible area affected.",
    "Multiple residential complexes show severe structural deterioration, likely due to prolonged water exposure.",
    "Road connectivity is heavily compromised, particularly in lanes connecting the Western Express Highway.",
    "Stagnant water bodies near densely populated clusters pose a high risk of secondary health outbreaks.",
    "Public utilities such as electrical distribution panels and drainage systems appear partially submerged.",
    "Emergency evacuation routes have reduced accessibility due to flooded junctions and blocked intersections.",
    "Commercial building rooftops show signs of mechanical damage, likely caused by strong winds accompanying the flood.",
    "Most affected structures are located alongside the river-adjacent region, indicating possible overflow or poor water management."
  ],

  // --- Severity Breakdown (Timeline Style) ---
  severityTimeline: [
    {
      label: "Flood Intensity Assessment",
      description: "Using ESRGAN-enhanced imagery, the system identified major zones submerged up to road level across multiple sectors."
    },
    {
      label: "Structural Damage Analysis",
      description: "Segmentation model highlighted severely damaged rooftops and compromised building edges across 400+ structures."
    },
    {
      label: "Infrastructure Impact",
      description: "23 major road segments are blocked due to a combination of debris accumulation, water overflow, and collapsed walls."
    },
    {
      label: "Human Risk Evaluation",
      description: "CNN-based estimation predicts over 5,600 individuals residing in high-risk flooded areas."
    },
    {
      label: "Urgency Level",
      description: "Overall severity classified as HIGH. Immediate evacuation and medical support recommended for Zones 3, 6, and 8."
    }
  ]
};


function formatNumber(num) {
  return num.toLocaleString("en-IN");
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Fill basic text fields ---
  document.getElementById("locationLabel").textContent =
    `${analysisResult.locationName} • ${analysisResult.eventType}`;

  document.getElementById("sevScore").textContent =
    analysisResult.severityScore.toFixed(2);
  document.getElementById("damagePercent").textContent =
    `${analysisResult.damagePercent}%`;

  document.getElementById("buildingsAffected").textContent =
    formatNumber(analysisResult.buildingsAffected);

  document.getElementById("populationAtRisk").textContent =
    formatNumber(analysisResult.populationAtRisk);

  document.getElementById("captureTime").textContent =
    `Captured: ${analysisResult.capturedAt}`;

  // --- Images ---
  document.getElementById("originalImage").src = analysisResult.imageOriginal;
  document.getElementById("maskedImage").src = analysisResult.imageMasked;

  // --- Severity badge ---
  const badge = document.getElementById("severityBadge");
  const label = analysisResult.severityLabel;

  badge.textContent = `Severity: ${label}`;
  badge.classList.remove("severity-high", "severity-medium", "severity-low");

  if (label === "High") {
    badge.classList.add("severity-high");
  } else if (label === "Medium") {
    badge.classList.add("severity-medium");
  } else {
    badge.classList.add("severity-low");
  }

  // --- Insights list ---
  const insightsList = document.getElementById("insightsList");
  insightsList.innerHTML = "";
  analysisResult.insights.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    insightsList.appendChild(li);
  });

  // --- Timeline ---
  const timeline = document.getElementById("severityTimeline");
  timeline.innerHTML = "";
  analysisResult.severityTimeline.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "timeline-item";

    const dot = document.createElement("div");
    dot.className = "timeline-dot";
    wrapper.appendChild(dot);

    const title = document.createElement("div");
    title.className = "fw-semibold mb-1";
    title.textContent = item.label;
    wrapper.appendChild(title);

    const desc = document.createElement("div");
    desc.className = "text-muted";
    desc.textContent = item.description;
    wrapper.appendChild(desc);

    timeline.appendChild(wrapper);
  });

  // --- Chart.js: Damage vs Undamaged Pie Chart ---
  const damageCtx = document.getElementById("damagePieChart");
  const damaged = analysisResult.damagePercent;
  const undamaged = 100 - damaged;

  new Chart(damageCtx, {
    type: "pie",
    data: {
      labels: ["Damaged Area", "Undamaged Area"],
      datasets: [
        {
          data: [damaged, undamaged]
          // Colors are automatic (default theme)
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}%`
          }
        }
      }
    }
  });

  // --- Chart.js: Bar graph for infrastructure impact ---
  const impactCtx = document.getElementById("impactBarChart");

  new Chart(impactCtx, {
    type: "bar",
    data: {
      labels: ["Buildings", "Road Segments", "Population (x100)"],
      datasets: [
        {
          label: "Impact",
          data: [
            analysisResult.buildingsAffected,
            analysisResult.roadsBlocked,
            Math.round(analysisResult.populationAtRisk / 100)
          ]
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
