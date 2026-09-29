document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     SCROLL PROGRESS
  ===================================================== */

  const progress = document.querySelector(".progress");

  const updateProgress = () => {
    if (!progress) return;

    const total =
      document.documentElement.scrollHeight - window.innerHeight;

    progress.style.width =
      total > 0 ? `${(window.scrollY / total) * 100}%` : "0%";
  };

  window.addEventListener("scroll", updateProgress);
  updateProgress();


  /* =====================================================
     REVEAL ANIMATIONS
  ===================================================== */

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => {
    revealObserver.observe(el);
  });


  /* =====================================================
     ACTIVE NAVIGATION
  ===================================================== */

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".top-nav a");

  const updateNav = () => {
    let current = "";

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  };

  window.addEventListener("scroll", updateNav);
  updateNav();


  /* =====================================================
     ENTITY RESOLUTION QUESTION
  ===================================================== */

  const entityButtons =
    document.querySelectorAll("[data-entity-answer]");

  const entityFeedback =
    document.querySelector("#entityFeedback");

  entityButtons.forEach(button => {
    button.addEventListener("click", () => {
      const answer = button.dataset.entityAnswer;

      entityButtons.forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");

      if (!entityFeedback) return;

      if (answer === "yes") {
        entityFeedback.className = "answer";
        entityFeedback.innerHTML = `
          <strong>Possibly the same person.</strong><br>
          The names and other information may be similar, but
          we need more evidence before making a confident match.
        `;
      } else {
        entityFeedback.className = "answer wrong";
        entityFeedback.innerHTML = `
          <strong>We cannot conclude that yet.</strong><br>
          Small differences such as nicknames, spelling,
          addresses, or phone numbers can still belong to
          the same person.
        `;
      }
    });
  });


  /* =====================================================
     ENTITY RESOLUTION — REVEAL ANSWER
  ===================================================== */

  const entityReveal = document.querySelector("#revealEntity");

  if (entityReveal) {
    entityReveal.addEventListener("click", () => {
      const answer = document.querySelector("#entityAnswer");

      if (answer) {
        answer.hidden = false;
        answer.classList.add("visible");
      }

      entityReveal.textContent = "Answer Revealed";
      entityReveal.disabled = true;
    });
  }


  /* =====================================================
     ONE TRILLION PAIRS
  ===================================================== */

  const pairCounter = document.querySelector("#pairCounter");
  const pairButton = document.querySelector("#calculatePairs");

  if (pairButton && pairCounter) {
    pairButton.addEventListener("click", () => {
      pairCounter.textContent = "1,000,000 × 1,000,000";

      setTimeout(() => {
        pairCounter.textContent = "1,000,000,000,000";
        pairCounter.classList.add("glow");
      }, 700);
    });
  }


  /* =====================================================
     COMPANY A / B LSH DEMO
  ===================================================== */

  const hashSteps = [
    {
      name: "Name",
      description:
        "Records with identical names become candidate pairs."
    },
    {
      name: "Phone",
      description:
        "Records with identical phone numbers become candidate pairs."
    },
    {
      name: "Address",
      description:
        "Records with identical addresses become candidate pairs."
    }
  ];

  let hashStep = -1;

  const hashButton =
    document.querySelector("#nextHashStep");

  const hashTitle =
    document.querySelector("#hashStepTitle");

  const hashDescription =
    document.querySelector("#hashStepDescription");

  const hashProgress =
    document.querySelector("#hashProgress");

  const hashRows =
    document.querySelectorAll(".hash-step");

  function updateHashDemo() {
    if (hashStep < 0) {
      if (hashTitle) {
        hashTitle.textContent = "Ready";
      }

      if (hashDescription) {
        hashDescription.textContent =
          "Click Next Step to begin finding candidate pairs.";
      }

      if (hashProgress) {
        hashProgress.style.width = "0%";
      }

      return;
    }

    const step = hashSteps[hashStep];

    if (hashTitle) {
      hashTitle.textContent = `Hash by ${step.name}`;
    }

    if (hashDescription) {
      hashDescription.textContent = step.description;
    }

    if (hashProgress) {
      hashProgress.style.width =
        `${((hashStep + 1) / hashSteps.length) * 100}%`;
    }

    hashRows.forEach((row, index) => {
      row.classList.toggle(
        "active",
        index === hashStep
      );
    });
  }

  if (hashButton) {
    hashButton.addEventListener("click", () => {
      hashStep++;

      if (hashStep >= hashSteps.length) {
        hashStep = 0;
      }

      updateHashDemo();
    });
  }

  updateHashDemo();


  /* =====================================================
     HASH CANDIDATE RECORDS
  ===================================================== */

  const candidateRows =
    document.querySelectorAll(".candidate-row");

  const candidateButton =
    document.querySelector("#showCandidates");

  if (candidateButton) {
    candidateButton.addEventListener("click", () => {
      candidateRows.forEach((row, index) => {
        setTimeout(() => {
          row.classList.add("visible");
        }, index * 180);
      });
    });
  }


  /* =====================================================
     FINGERPRINT GRID
  ===================================================== */

  const fingerprint =
    document.querySelector("#fingerprint");

  if (fingerprint) {
    const size = Number(
      fingerprint.dataset.size || 8
    );

    const minutiae = [
      [1, 2],
      [2, 5],
      [3, 3],
      [4, 6],
      [5, 1],
      [6, 4],
      [7, 6]
    ];

    fingerprint.innerHTML = "";

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell =
          document.createElement("div");

        cell.className = "fingerprint-cell";

        const hasMinutia =
          minutiae.some(
            ([r, c]) =>
              r === row && c === col
          );

        if (hasMinutia) {
          cell.classList.add("has-minutia");

          const dot =
            document.createElement("span");

          dot.className = "minutia";

          cell.appendChild(dot);
        }

        cell.addEventListener("click", () => {
          cell.classList.toggle("has-minutia");

          const dot =
            cell.querySelector(".minutia");

          if (cell.classList.contains("has-minutia")) {
            if (!dot) {
              const newDot =
                document.createElement("span");

              newDot.className = "minutia";
              cell.appendChild(newDot);
            }
          } else if (dot) {
            dot.remove();
          }

          updateFingerprintSet();
        });

        fingerprint.appendChild(cell);
      }
    }
  }


  /* =====================================================
     FINGERPRINT SET
  ===================================================== */

  function getFingerprintSet() {
    const cells =
      document.querySelectorAll(
        "#fingerprint .fingerprint-cell"
      );

    const result = [];

    cells.forEach((cell, index) => {
      if (cell.classList.contains("has-minutia")) {
        result.push(index);
      }
    });

    return result;
  }

  function updateFingerprintSet() {
    const setOutput =
      document.querySelector("#fingerprintSet");

    if (!setOutput) return;

    const set = getFingerprintSet();

    setOutput.textContent =
      `{ ${set.join(", ")} }`;

    calculateFingerprintSimilarity();
  }


  /* =====================================================
     SECOND FINGERPRINT
  ===================================================== */

  const fingerprint2 =
    document.querySelector("#fingerprint2");

  if (fingerprint2) {
    const size = Number(
      fingerprint2.dataset.size || 8
    );

    const minutiae = [
      [1, 2],
      [2, 5],
      [3, 4],
      [4, 6],
      [5, 1],
      [6, 4],
      [7, 5]
    ];

    fingerprint2.innerHTML = "";

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell =
          document.createElement("div");

        cell.className = "fingerprint-cell";

        const hasMinutia =
          minutiae.some(
            ([r, c]) =>
              r === row && c === col
          );

        if (hasMinutia) {
          cell.classList.add("has-minutia");

          const dot =
            document.createElement("span");

          dot.className = "minutia";

          cell.appendChild(dot);
        }

        fingerprint2.appendChild(cell);
      }
    }
  }


  /* =====================================================
     JACCARD SIMILARITY
  ===================================================== */

  function getSetFromGrid(selector) {
    const cells =
      document.querySelectorAll(
        `${selector} .fingerprint-cell`
      );

    const result = new Set();

    cells.forEach((cell, index) => {
      if (cell.classList.contains("has-minutia")) {
        result.add(index);
      }
    });

    return result;
  }

  function calculateJaccard(setA, setB) {
    let intersection = 0;

    setA.forEach(value => {
      if (setB.has(value)) {
        intersection++;
      }
    });

    const union =
      new Set([...setA, ...setB]).size;

    return union === 0
      ? 0
      : intersection / union;
  }

  function calculateFingerprintSimilarity() {
    const setA =
      getSetFromGrid("#fingerprint");

    const setB =
      getSetFromGrid("#fingerprint2");

    const similarity =
      calculateJaccard(setA, setB);

    const output =
      document.querySelector("#jaccardValue");

    const bar =
      document.querySelector("#jaccardBar");

    if (output) {
      output.textContent =
        similarity.toFixed(2);
    }

    if (bar) {
      bar.style.width =
        `${similarity * 100}%`;
    }
  }

  calculateFingerprintSimilarity();


  /* =====================================================
     MINHASH / LSH FINGERPRINT DEMO
  ===================================================== */

  const minhashButton =
    document.querySelector("#nextMinhash");

  const minhashOutput =
    document.querySelector("#minhashOutput");

  const minhashExplanation =
    document.querySelector("#minhashExplanation");

  const minhashSteps = [
    {
      title: "Step 1 — Convert to sets",
      text:
        "Each fingerprint becomes a set of grid squares containing minutiae."
    },
    {
      title: "Step 2 — Apply hash functions",
      text:
        "Several hash functions are applied to the grid-square sets."
    },
    {
      title: "Step 3 — Build the signature",
      text:
        "The minimum hash value for each function forms the fingerprint signature."
    },
    {
      title: "Step 4 — Compare signatures",
      text:
        "Similar signatures suggest similar fingerprints."
    }
  ];

  let minhashStep = -1;

  if (minhashButton) {
    minhashButton.addEventListener("click", () => {
      minhashStep++;

      if (minhashStep >= minhashSteps.length) {
        minhashStep = 0;
      }

      const step =
        minhashSteps[minhashStep];

      if (minhashOutput) {
        minhashOutput.textContent =
          step.title;
      }

      if (minhashExplanation) {
        minhashExplanation.textContent =
          step.text;
      }
    });
  }


  /* =====================================================
     RESET BUTTONS
  ===================================================== */

  document
    .querySelectorAll("[data-reset]")
    .forEach(button => {
      button.addEventListener("click", () => {
        location.reload();
      });
    });


  /* =====================================================
     KEYBOARD ACCESSIBILITY
  ===================================================== */

  document
    .querySelectorAll(".btn")
    .forEach(button => {
      button.addEventListener("keydown", event => {
        if (event.key === "Enter" ||
            event.key === " ") {
          event.preventDefault();
          button.click();
        }
      });
    });

});
