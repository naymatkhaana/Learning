// script.js

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SCROLL PROGRESS
  ========================================================= */

  const progress = document.querySelector(".progress");

  if (progress) {
    const updateProgress = () => {
      const max =
        document.documentElement.scrollHeight -
        window.innerHeight;

      progress.style.width =
        `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();
  }


  /* =========================================================
     REVEAL ANIMATIONS
  ========================================================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  if (revealElements.length) {

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.12 }
      );

    revealElements.forEach(
      element => observer.observe(element)
    );
  }


  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const sections =
    document.querySelectorAll("section[id]");

  const navLinks =
    document.querySelectorAll(".top-nav a");

  if (sections.length && navLinks.length) {

    const updateNavigation = () => {

      let current = "";

      sections.forEach(section => {
        if (
          window.scrollY >=
          section.offsetTop - 180
        ) {
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

    window.addEventListener(
      "scroll",
      updateNavigation
    );

    updateNavigation();
  }


  /* =========================================================
     RANDOM HYPERPLANE / SIMHASH
     
     IMPORTANT:
     
     The hyperplane is represented mathematically as:

         n.x * (x - cx) +
         n.y * (y - cy) = 0

     The EXACT SAME equation is used for:

       1. Drawing the line
       2. Determining which side a point is on
       3. Assigning 0 / 1
       4. Assigning red / blue

     Therefore a point cannot visually be on one side
     while receiving the color belonging to the other side.
  ========================================================= */

  const canvas =
    document.querySelector("#lshCanvas");

  if (canvas) {

    const ctx =
      canvas.getContext("2d");

    const points = [
      { x: 2.0, y: 2.5, name: "A" },
      { x: 2.6, y: 2.9, name: "B" },
      { x: 5.5, y: 4.8, name: "C" },
      { x: 6.5, y: 2.0, name: "D" },
      { x: 3.8, y: 6.0, name: "E" }
    ];

    let hyperplanes = [];


    /* ---------------------------------------------------------
       Canvas setup
    --------------------------------------------------------- */

    function resizeCanvas() {

      const rect =
        canvas.getBoundingClientRect();

      const dpr =
        window.devicePixelRatio || 1;

      canvas.width =
        Math.round(rect.width * dpr);

      canvas.height =
        Math.round(rect.height * dpr);

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      draw();
    }


    /* ---------------------------------------------------------
       Mathematical -> Canvas coordinates
    --------------------------------------------------------- */

    function toCanvas(x, y) {

      const padding = 45;

      const width =
        canvas.clientWidth -
        padding * 2;

      const height =
        canvas.clientHeight -
        padding * 2;

      return {
        x:
          padding +
          (x / 8) * width,

        y:
          canvas.clientHeight -
          padding -
          (y / 8) * height
      };
    }


    /* ---------------------------------------------------------
       Random unit normal vector
    --------------------------------------------------------- */

    function randomNormal() {

      const angle =
        Math.random() *
        Math.PI *
        2;

      return {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
    }


    /* ---------------------------------------------------------
       Create hyperplane
       
       The line always passes through the center of
       the coordinate system: (4,4).

       nx, ny = normal vector
       cx, cy = point on the line
    --------------------------------------------------------- */

    function createHyperplane() {

      const normal =
        randomNormal();

      return {
        nx: normal.x,
        ny: normal.y,

        cx: 4,
        cy: 4
      };
    }


    /* ---------------------------------------------------------
       SIGNED DISTANCE / SIDE TEST
       
       This is the ONLY function used to determine
       which side of the hyperplane a point occupies.

       Positive -> 1 / BLUE
       Negative -> 0 / RED
       Zero     -> 1 / BLUE
    --------------------------------------------------------- */

    function sideValue(point, plane) {

      return (
        plane.nx *
          (point.x - plane.cx)
        +
        plane.ny *
          (point.y - plane.cy)
      );
    }


    /* ---------------------------------------------------------
       Hash bit
    --------------------------------------------------------- */

    function getBit(point, plane) {

      return sideValue(
        point,
        plane
      ) >= 0
        ? 1
        : 0;
    }


    /* ---------------------------------------------------------
       Complete SimHash
    --------------------------------------------------------- */

    function getHash(point) {

      return hyperplanes
        .map(plane =>
          getBit(point, plane)
        )
        .join("");
    }


    /* =========================================================
       DRAW AXES
    ========================================================= */

    function drawAxes() {

      const padding = 45;

      const width =
        canvas.clientWidth;

      const height =
        canvas.clientHeight;

      ctx.save();

      ctx.strokeStyle =
        "rgba(148,163,184,.25)";

      ctx.lineWidth = 1;

      ctx.beginPath();

      // X axis
      ctx.moveTo(
        padding,
        height - padding
      );

      ctx.lineTo(
        width - padding,
        height - padding
      );

      // Y axis
      ctx.moveTo(
        padding,
        padding
      );

      ctx.lineTo(
        padding,
        height - padding
      );

      ctx.stroke();

      ctx.restore();
    }


    /* =========================================================
       DRAW HYPERPLANE
       
       The normal vector is:

           (nx, ny)

       A direction vector along the line is:

           (-ny, nx)

       Notice that the LINE itself is constructed using
       the SAME cx/cy/nx/ny values used by sideValue().
    ========================================================= */

    function drawHyperplane(
      plane,
      index
    ) {

      const center =
        toCanvas(
          plane.cx,
          plane.cy
        );


      /*
         Direction along mathematical line.
      */

      const lineX =
        -plane.ny;

      const lineY =
        plane.nx;


      /*
         Convert mathematical Y direction
         to canvas Y direction.
      */

      const canvasLineX =
        lineX;

      const canvasLineY =
        -lineY;


      const length =
        Math.max(
          canvas.clientWidth,
          canvas.clientHeight
        ) * 2;


      ctx.save();


      /*
         Hyperplane
      */

      ctx.strokeStyle =
        index === hyperplanes.length - 1
          ? "#ffb454"
          : "rgba(255,180,84,.35)";

      ctx.lineWidth =
        index === hyperplanes.length - 1
          ? 3
          : 1.5;


      ctx.beginPath();

      ctx.moveTo(
        center.x -
          canvasLineX * length,

        center.y -
          canvasLineY * length
      );

      ctx.lineTo(
        center.x +
          canvasLineX * length,

        center.y +
          canvasLineY * length
      );

      ctx.stroke();


      /*
         Normal vector.

         The normal points toward the BLUE / 1 side.
      */

      ctx.strokeStyle =
        "#9b7cff";

      ctx.lineWidth = 2.5;

      ctx.beginPath();

      ctx.moveTo(
        center.x,
        center.y
      );

      ctx.lineTo(
        center.x +
          plane.nx * 75,

        center.y -
          plane.ny * 75
      );

      ctx.stroke();


      ctx.fillStyle =
        "#c4b5fd";

      ctx.font =
        "12px Inter, sans-serif";

      ctx.fillText(
        "1 / blue",
        center.x +
          plane.nx * 82,

        center.y -
          plane.ny * 82
      );


      ctx.restore();
    }


    /* =========================================================
       DRAW POINT
    ========================================================= */

    function drawPoint(point) {

      const position =
        toCanvas(
          point.x,
          point.y
        );


      let bit = null;

      if (hyperplanes.length) {

        const currentPlane =
          hyperplanes[
            hyperplanes.length - 1
          ];

        bit =
          getBit(
            point,
            currentPlane
          );
      }


      /*
         Before the first hyperplane,
         points use neutral blue.
      */

      const isBlue =
        bit === null ||
        bit === 1;


      ctx.save();


      ctx.beginPath();

      ctx.arc(
        position.x,
        position.y,
        7,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        isBlue
          ? "#5da9ff"
          : "#ff5c75";

      ctx.shadowColor =
        isBlue
          ? "#39d9ff"
          : "#ff365b";

      ctx.shadowBlur = 15;

      ctx.fill();

      ctx.shadowBlur = 0;


      ctx.fillStyle =
        "#edf5ff";

      ctx.font =
        "bold 13px Inter, sans-serif";


      ctx.fillText(
        bit === null
          ? point.name
          : `${point.name} (${bit})`,
        position.x + 11,
        position.y - 9
      );


      ctx.restore();
    }


    /* =========================================================
       DRAW EVERYTHING
    ========================================================= */

    function draw() {

      if (
        !canvas.clientWidth ||
        !canvas.clientHeight
      ) {
        return;
      }


      ctx.clearRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
      );


      drawAxes();


      hyperplanes.forEach(
        (plane, index) => {
          drawHyperplane(
            plane,
            index
          );
        }
      );


      points.forEach(
        drawPoint
      );
    }


    /* =========================================================
       HASH PANEL
    ========================================================= */

    function updateHashPanel() {

      const panel =
        document.querySelector(
          "#hashValues"
        );

      if (!panel) {
        return;
      }


      if (!hyperplanes.length) {

        panel.innerHTML = `
          <div class="demo-step">
            Press <strong>Next Hyperplane</strong>
            to begin.
          </div>
        `;

        return;
      }


      panel.innerHTML =
        points
          .map(point => {

            const hash =
              getHash(point);


            const bits =
              hash
                .split("")
                .map(bit => `
                  <span class="
                    hash-bit
                    ${bit === "1"
                      ? "one"
                      : "zero"}
                  ">
                    ${bit}
                  </span>
                `)
                .join(" ");


            return `
              <div class="hash-row">

                <span>
                  Point ${point.name}
                </span>

                <span>
                  ${bits}
                </span>

                <strong>
                  ${hash}
                </strong>

              </div>
            `;
          })
          .join("");
    }


    /* =========================================================
       NEXT HYPERPLANE
    ========================================================= */

    const nextHyperplane =
      document.querySelector(
        "#nextHyperplane"
      );

    if (nextHyperplane) {

      nextHyperplane.addEventListener(
        "click",
        () => {

          hyperplanes.push(
            createHyperplane()
          );

          draw();
          updateHashPanel();
        }
      );
    }


    /* =========================================================
       RESET LSH
    ========================================================= */

    const resetLSH =
      document.querySelector(
        "#resetLSH"
      );

    if (resetLSH) {

      resetLSH.addEventListener(
        "click",
        () => {

          hyperplanes = [];

          draw();
          updateHashPanel();
        }
      );
    }


    window.addEventListener(
      "resize",
      resizeCanvas
    );

    resizeCanvas();
    updateHashPanel();
  }


  /* =========================================================
     RANDOM BIT SAMPLING / HAMMING LSH
     
     Every selected bit is APPENDED to the hash.
     
     Example:

       sample = 10110110

       bit 1 -> hash 1
       bit 2 -> hash 10
       bit 3 -> hash 101
       bit 4 -> hash 1011
  ========================================================= */

  const hammingNext =
    document.querySelector(
      "#nextHamming"
    );


  if (hammingNext) {

    const strings = [
      "10110110",
      "10100110",
      "10000110",
      "11100101"
    ];


    let selectedBit = -1;


    /*
       One accumulated hash per sample.
    */

    const hashes =
      strings.map(() => "");


    /* ---------------------------------------------------------
       Find existing hash elements
    --------------------------------------------------------- */

    function getHashElements() {

      const existing =
        Array.from(
          document.querySelectorAll(
            ".hamming-hash"
          )
        );


      if (
        existing.length >=
        strings.length
      ) {
        return existing.slice(
          0,
          strings.length
        );
      }


      /*
         If hash elements don't exist,
         add them to .hamming-row.
      */

      const rows =
        document.querySelectorAll(
          ".hamming-row"
        );


      rows.forEach(row => {

        if (
          !row.querySelector(
            ".hamming-hash"
          )
        ) {

          const hash =
            document.createElement(
              "span"
            );

          hash.className =
            "hamming-hash";

          hash.textContent =
            "-";

          row.appendChild(hash);
        }
      });


      return Array.from(
        document.querySelectorAll(
          ".hamming-hash"
        )
      ).slice(
        0,
        strings.length
      );
    }


    /* ---------------------------------------------------------
       Update random bit sampling
    --------------------------------------------------------- */

    function updateHamming() {

      if (
        selectedBit < 0
      ) {
        return;
      }


      /*
         Highlight selected position.
      */

      document
        .querySelectorAll(
          ".hamming-bit"
        )
        .forEach(
          (element, index) => {

            element.classList.toggle(
              "active",
              index === selectedBit
            );
          }
        );


      /*
         Append selected bit to every hash.
      */

      strings.forEach(
        (string, index) => {

          hashes[index] +=
            string[selectedBit];
        }
      );


      /*
         Display hashes.
      */

      const hashElements =
        getHashElements();


      hashes.forEach(
        (hash, index) => {

          const element =
            hashElements[index];

          if (!element) {
            return;
          }

          element.textContent =
            hash || "-";
        }
      );


      /*
         Explanation.
      */

      const explanation =
        document.querySelector(
          "#hammingExplanation"
        );


      if (explanation) {

        explanation.textContent =
          `Sampled bit ${
            selectedBit + 1
          }. The selected bit was appended ` +
          `to each sample's hash.`;
      }
    }


    /* ---------------------------------------------------------
       Next sampled bit
    --------------------------------------------------------- */

    hammingNext.addEventListener(
      "click",
      () => {

        selectedBit =
          (
            selectedBit + 1
          ) %
          strings[0].length;


        updateHamming();
      }
    );


    /* ---------------------------------------------------------
       Optional reset button
    --------------------------------------------------------- */

    const resetHamming =
      document.querySelector(
        "#resetHamming"
      );


    if (resetHamming) {

      resetHamming.addEventListener(
        "click",
        () => {

          selectedBit = -1;

          hashes.fill("");


          document
            .querySelectorAll(
              ".hamming-bit"
            )
            .forEach(element => {
              element.classList.remove(
                "active"
              );
            });


          document
            .querySelectorAll(
              ".hamming-hash"
            )
            .forEach(element => {
              element.textContent =
                "-";
            });


          const explanation =
            document.querySelector(
              "#hammingExplanation"
            );


          if (explanation) {
            explanation.textContent =
              "Press Next Bit to begin random bit sampling.";
          }
        }
      );
    }
  }

});
