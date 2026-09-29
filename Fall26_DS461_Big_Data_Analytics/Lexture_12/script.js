/* =========================================================
   LSH + MINHASH TUTORIAL — INTERACTIVE SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initRevealAnimations();
  initSmoothNavigation();
  initMinHashMatrix();
  initLSHSimulator();
  initSCurve();
  initSimilarityDemo();
});


/* =========================================================
   1. SCROLL REVEAL ANIMATIONS
   ========================================================= */

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}


/* =========================================================
   2. SMOOTH NAVIGATION
   ========================================================= */

function initSmoothNavigation() {
  document.querySelectorAll(".tutorial-nav a").forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || !targetId.startsWith("#")) return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}


/* =========================================================
   3. MINHASH SIGNATURE MATRIX
   ========================================================= */

function initMinHashMatrix() {
  const matrix = document.querySelector("#signatureMatrix");
  if (!matrix) return;

  /*
   * 12 MinHash rows × 4 documents
   *
   * D1 and D2 are deliberately similar.
   * D3 and D4 are different.
   */
  const signatures = [
    [12, 12, 37, 91],
    [41, 41, 18, 72],
    [7,  7,  65, 34],
    [83, 83, 22, 16],

    [29, 29, 74, 58],
    [14, 14, 36, 81],
    [65, 65, 11, 43],
    [33, 33, 89, 25],

    [51, 51, 27, 63],
    [6,  6, 44, 97],
    [72, 72, 15, 38],
    [18, 18, 56, 84]
  ];

  matrix.innerHTML = "";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const emptyHeader = document.createElement("th");
  emptyHeader.textContent = "Hash";
  headerRow.appendChild(emptyHeader);

  ["D1", "D2", "D3", "D4"].forEach(doc => {
    const th = document.createElement("th");
    th.textContent = doc;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  matrix.appendChild(thead);

  const tbody = document.createElement("tbody");

  signatures.forEach((row, index) => {
    const tr = document.createElement("tr");

    // 4 rows per band
    if (index < 4) tr.classList.add("band-1");
    else if (index < 8) tr.classList.add("band-2");
    else tr.classList.add("band-3");

    const label = document.createElement("td");
    label.textContent = `h${index + 1}`;
    label.className = "band-label";
    tr.appendChild(label);

    row.forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;

      td.addEventListener("mouseenter", () => {
        td.style.transform = "scale(1.08)";
      });

      td.addEventListener("mouseleave", () => {
        td.style.transform = "";
      });

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  matrix.appendChild(tbody);
}


/* =========================================================
   4. LSH BAND / BUCKET SIMULATOR
   ========================================================= */

function initLSHSimulator() {
  const container = document.querySelector("#bucketGrid");
  if (!container) return;

  const bInput = document.querySelector("#bands");
  const rInput = document.querySelector("#rowsPerBand");

  const bValue = document.querySelector("#bandsValue");
  const rValue = document.querySelector("#rowsValue");

  const runButton = document.querySelector("#runLSH");
  const resetButton = document.querySelector("#resetLSH");

  let bands = Number(bInput?.value || 3);
  let rowsPerBand = Number(rInput?.value || 4);

  if (bValue) bValue.textContent = bands;
  if (rValue) rValue.textContent = rowsPerBand;

  function pseudoHash(values, bandIndex) {
    /*
     * Deterministic hash.
     * This is only for visualization — it is not
     * intended to be a production LSH hash function.
     */
    let hash = 2166136261 ^ bandIndex;

    values.forEach(value => {
      hash ^= Number(value) + 31;
      hash = Math.imul(hash, 16777619);
    });

    return Math.abs(hash >>> 0);
  }

  //function getBucket(values, bandIndex) {
  //  return pseudoHash(values, bandIndex) % 7;
  //}

function getBucket(values) {
  return values.join("-");
}


function buildDemoSignatures(b, r) {
  const totalRows = b * r;

  const docs = {
    D1: [],
    D2: [],
    D3: [],
    D4: []
  };

  /*
   * D1 and D2 are intentionally identical.
   *
   * Therefore:
   *
   *   D1 band == D2 band
   *
   * for every band, so:
   *
   *   hash(D1_band) == hash(D2_band)
   *
   * and D1/D2 always land in the same bucket.
   */

  for (let i = 0; i < totalRows; i++) {

    const commonValue = 10 + (i * 17) % 90;

    docs.D1.push(commonValue);
    docs.D2.push(commonValue);

    /*
     * D3 and D4 are deliberately different.
     */
    docs.D3.push(
      100 + ((i * 29 + 11) % 97)
    );

    docs.D4.push(
      200 + ((i * 37 + 23) % 97)
    );
  }

  return docs;
}


function render() {
  bands = Number(bInput?.value || bands);
  rowsPerBand = Number(rInput?.value || rowsPerBand);

  if (bValue) bValue.textContent = bands;
  if (rValue) rValue.textContent = rowsPerBand;

  const signatures = buildDemoSignatures(
    bands,
    rowsPerBand
  );

  container.innerHTML = "";

  /*
   * Keep track of which documents collide
   * in which band.
   */
  const collisions = [];

  for (let b = 0; b < bands; b++) {

    const bucketMap = {};

    ["D1", "D2", "D3", "D4"].forEach(doc => {

      const start = b * rowsPerBand;
      const end = start + rowsPerBand;

      const bandSignature =
        signatures[doc].slice(start, end);

      const bucket =
        getBucket(bandSignature); //, b);

      if (!bucketMap[bucket]) {
        bucketMap[bucket] = [];
      }

      bucketMap[bucket].push(doc);
    });


    /*
     * Identify collisions.
     */
    Object.entries(bucketMap).forEach(
      ([bucket, docs]) => {

        if (docs.length > 1) {
          collisions.push({
            band: b + 1,
            bucket,
            docs
          });
        }
      }
    );


    /*
     * Create visual bucket cards.
     */
    Object.entries(bucketMap).forEach(
      ([bucket, docs]) => {

        const bucketElement =
          document.createElement("div");

        bucketElement.className = "bucket";


        const title =
          document.createElement("h4");

        title.textContent =
          `Band ${b + 1} · Bucket ${bucket}`;

        bucketElement.appendChild(title);


        const subtitle =
          document.createElement("div");

        subtitle.style.color =
          "var(--muted)";

        subtitle.style.fontSize =
          ".78rem";

        subtitle.style.marginBottom =
          "8px";

        subtitle.textContent =
          `${rowsPerBand} rows`;

        bucketElement.appendChild(subtitle);


        /*
         * Add documents to the bucket.
         */
        docs.forEach(doc => {

          const chip =
            document.createElement("span");

          chip.className =
            "doc-chip";

          chip.textContent =
            doc;


          /*
           * If multiple documents occupy
           * this bucket, highlight them.
           */
          if (docs.length > 1) {
            chip.classList.add("match");
          }


          bucketElement.appendChild(chip);
        });


        container.appendChild(
          bucketElement
        );
      }
    );
  }


  /*
   * Display a small explanation of the
   * candidate pairs, if the HTML contains
   * #candidateInfo.
   */
  const candidateInfo =
    document.querySelector("#candidateInfo");

  if (candidateInfo) {

    const d1d2Collisions =
      collisions.filter(c =>
        c.docs.includes("D1") &&
        c.docs.includes("D2")
      ).length;

    candidateInfo.innerHTML = `
      <strong>D1 ↔ D2</strong>
      collide in
      <strong>${d1d2Collisions}/${bands}</strong>
      bands.
    `;
  }


  /*
   * Animate the bucket assignments.
   */
  requestAnimationFrame(() => {

    container
      .querySelectorAll(".doc-chip")
      .forEach((chip, i) => {

        setTimeout(() => {

          chip.classList.add("flash");

          setTimeout(() => {
            chip.classList.remove("flash");
          }, 700);

        }, i * 45);

      });

  });
}


  bInput?.addEventListener("input", render);
  rInput?.addEventListener("input", render);

  runButton?.addEventListener("click", render);

  resetButton?.addEventListener("click", () => {
    if (bInput) bInput.value = 3;
    if (rInput) rInput.value = 4;

    render();
  });

  render();
}


/* =========================================================
   5. LSH S-CURVE
   ========================================================= */

function initSCurve() {
  const svg = document.querySelector("#sCurve");
  if (!svg) return;

  const bInput = document.querySelector("#curveBands");
  const rInput = document.querySelector("#curveRows");

  const bValue = document.querySelector("#curveBandsValue");
  const rValue = document.querySelector("#curveRowsValue");
  const thresholdValue = document.querySelector("#thresholdValue");

  const width = 800;
  const height = 380;

  const padding = {
    left: 65,
    right: 30,
    top: 30,
    bottom: 55
  };

  const chartWidth =
    width - padding.left - padding.right;

  const chartHeight =
    height - padding.top - padding.bottom;

  function probability(s, b, r) {
    return 1 - Math.pow(1 - Math.pow(s, r), b);
  }

  function threshold(b, r) {
    return Math.pow(1 / b, 1 / r);
  }

  function xScale(s) {
    return padding.left + s * chartWidth;
  }

  function yScale(p) {
    return (
      padding.top +
      (1 - p) * chartHeight
    );
  }

  function clearSVG() {
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  function svgElement(name, attributes = {}) {
    const element =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        name
      );

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    return element;
  }

  function render() {
    const b = Number(bInput?.value || 3);
    const r = Number(rInput?.value || 4);

    if (bValue) bValue.textContent = b;
    if (rValue) rValue.textContent = r;

    const t = threshold(b, r);

    if (thresholdValue) {
      thresholdValue.textContent =
        t.toFixed(3);
    }

    clearSVG();

    /*
     * Gradient for the S-curve.
     */
    const defs = svgElement("defs");

    const gradient = svgElement(
      "linearGradient",
      {
        id: "curveGradient",
        x1: "0%",
        x2: "100%",
        y1: "0%",
        y2: "0%"
      }
    );

    gradient.appendChild(
      svgElement("stop", {
        offset: "0%",
        "stop-color": "#6ea8ff"
      })
    );

    gradient.appendChild(
      svgElement("stop", {
        offset: "60%",
        "stop-color": "#43d9ff"
      })
    );

    gradient.appendChild(
      svgElement("stop", {
        offset: "100%",
        "stop-color": "#a78bfa"
      })
    );

    defs.appendChild(gradient);
    svg.appendChild(defs);

    /*
     * Grid.
     */
    for (let i = 0; i <= 5; i++) {
      const y = i / 5;

      svg.appendChild(
        svgElement("line", {
          x1: padding.left,
          x2: width - padding.right,
          y1: yScale(y),
          y2: yScale(y),
          class: "chart-grid"
        })
      );

      const label = svgElement("text", {
        x: padding.left - 12,
        y: yScale(y) + 4,
        "text-anchor": "end",
        fill: "#9aa6c0",
        "font-size": "12"
      });

      label.textContent =
        `${Math.round(y * 100)}%`;

      svg.appendChild(label);
    }

    for (let i = 0; i <= 10; i++) {
      const s = i / 10;
      const x = xScale(s);

      svg.appendChild(
        svgElement("line", {
          x1: x,
          x2: x,
          y1: padding.top,
          y2: height - padding.bottom,
          class: "chart-grid"
        })
      );

      const label = svgElement("text", {
        x,
        y: height - padding.bottom + 25,
        "text-anchor": "middle",
        fill: "#9aa6c0",
        "font-size": "12"
      });

      label.textContent = s.toFixed(1);
      svg.appendChild(label);
    }

    /*
     * Axes.
     */
    svg.appendChild(
      svgElement("line", {
        x1: padding.left,
        x2: padding.left,
        y1: padding.top,
        y2: height - padding.bottom,
        class: "chart-axis"
      })
    );

    svg.appendChild(
      svgElement("line", {
        x1: padding.left,
        x2: width - padding.right,
        y1: height - padding.bottom,
        y2: height - padding.bottom,
        class: "chart-axis"
      })
    );

    /*
     * Curve.
     */
    let path = "";

    const points = 220;

    for (let i = 0; i <= points; i++) {
      const s = i / points;
      const p = probability(s, b, r);

      const x = xScale(s);
      const y = yScale(p);

      path +=
        `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
    }

    const curve = svgElement("path", {
      d: path,
      class: "curve"
    });

    svg.appendChild(curve);

    /*
     * Approximate threshold line.
     */
    const thresholdX = xScale(t);

    svg.appendChild(
      svgElement("line", {
        x1: thresholdX,
        x2: thresholdX,
        y1: padding.top,
        y2: height - padding.bottom,
        class: "threshold-line"
      })
    );

    const thresholdText =
      svgElement("text", {
        x: Math.min(
          thresholdX + 8,
          width - padding.right - 90
        ),
        y: padding.top + 18,
        class: "threshold-label"
      });

    thresholdText.textContent =
      `threshold ≈ ${t.toFixed(3)}`;

    svg.appendChild(thresholdText);

    /*
     * Interactive point.
     */
    const point = svgElement("circle", {
      cx: thresholdX,
      cy: yScale(
        probability(t, b, r)
      ),
      r: 6,
      class: "chart-point"
    });

    svg.appendChild(point);
  }

  bInput?.addEventListener("input", render);
  rInput?.addEventListener("input", render);

  render();
}


/* =========================================================
   6. JACCARD / MINHASH SIMILARITY DEMO
   ========================================================= */

function initSimilarityDemo() {
  const setA = document.querySelector("#setA");
  const setB = document.querySelector("#setB");

  const output = document.querySelector("#jaccardValue");
  const minhashOutput =
    document.querySelector("#minhashValue");

  if (!setA || !setB) return;

  function parseSet(value) {
    return new Set(
      value
        .split(",")
        .map(x => x.trim())
        .filter(Boolean)
    );
  }

  function calculateJaccard(A, B) {
    const intersection =
      [...A].filter(x => B.has(x)).length;

    const union =
      new Set([...A, ...B]).size;

    return union === 0
      ? 0
      : intersection / union;
  }

  function update() {
    const A = parseSet(setA.value);
    const B = parseSet(setB.value);

    const similarity =
      calculateJaccard(A, B);

    if (output) {
      output.textContent =
        `${(similarity * 100).toFixed(1)}%`;
    }

    /*
     * For MinHash, the expected collision
     * probability equals Jaccard similarity.
     */
    if (minhashOutput) {
      minhashOutput.textContent =
        `${(similarity * 100).toFixed(1)}%`;
    }
  }

  setA.addEventListener("input", update);
  setB.addEventListener("input", update);

  update();
}


/* =========================================================
   7. GLOBAL BAND HIGHLIGHTING
   ========================================================= */

document.addEventListener("click", event => {
  const bandButton =
    event.target.closest("[data-band]");

  if (!bandButton) return;

  const band =
    Number(bandButton.dataset.band);

  document
    .querySelectorAll(
      ".signature-matrix tr"
    )
    .forEach(row => {
      row.classList.remove(
        "active-band"
      );
    });

  document
    .querySelectorAll(
      `.signature-matrix .band-${band}`
    )
    .forEach(row => {
      row.classList.add(
        "active-band"
      );
    });
});


/* =========================================================
   8. COPY CODE BUTTONS
   ========================================================= */

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const selector =
      button.dataset.copy;

    const target =
      document.querySelector(selector);

    if (!target) return;

    try {
      await navigator.clipboard.writeText(
        target.textContent
      );

      const original =
        button.textContent;

      button.textContent = "Copied!";

      setTimeout(() => {
        button.textContent = original;
      }, 1200);

    } catch {
      button.textContent = "Copy failed";

      setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    }
  });
});


/* =========================================================
   9. ACTIVE NAVIGATION SECTION
   ========================================================= */

const sections =
  document.querySelectorAll("section[id]");

const navLinks =
  document.querySelectorAll(
    ".tutorial-nav a"
  );

if (sections.length && navLinks.length) {
  const sectionObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") ===
              `#${entry.target.id}`
            );
          });
        });
      },
      {
        rootMargin:
          "-30% 0px -60% 0px"
      }
    );

  sections.forEach(section =>
    sectionObserver.observe(section)
  );
}


/* =========================================================
   10. KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;

  const active =
    document.activeElement;

  if (
    active &&
    active.matches(
      "button[data-action]"
    )
  ) {
    active.click();
  }
});
