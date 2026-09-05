/*
===============================================================
LINEAR ALGEBRA REFRESHER
Machine Learning & Data Mining

Interactive visualizations:
    - vectors
    - vector addition
    - scalar multiplication
    - dot product
    - angle
    - distance
    - matrix multiplication
    - transformations
    - eigenvectors
    - PCA
===============================================================
*/


/* =============================================================
   GENERAL FUNCTIONS
============================================================= */

function go(id) {

    const element =
        document.getElementById(id);

    if (element) {

        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


function fmt(x) {

    if (Math.abs(x) < 0.00001) {
        x = 0;
    }

    return Number(x).toFixed(2);

}


function showAnswer(id) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.style.display =
        element.style.display === "none"
            ? "block"
            : "none";

}


/* =============================================================
   CANVAS SETUP
============================================================= */

function canvasSetup(canvas) {

    const rect =
        canvas.getBoundingClientRect();

    const ratio =
        window.devicePixelRatio || 1;

    canvas.width =
        rect.width * ratio;

    canvas.height =
        rect.height * ratio;

    const ctx =
        canvas.getContext("2d");

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    return {
        ctx: ctx,
        width: rect.width,
        height: rect.height
    };

}


/* =============================================================
   GRID
============================================================= */

function drawGrid(
    ctx,
    width,
    height,
    scale = 45
) {

    ctx.fillStyle =
        "#020617";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    const cx =
        width / 2;

    const cy =
        height / 2;


    /* Grid */

    ctx.strokeStyle =
        "#1e293b";

    ctx.lineWidth =
        1;


    for (
        let x = cx;
        x <= width;
        x += scale
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            height
        );

        ctx.stroke();

    }


    for (
        let x = cx;
        x >= 0;
        x -= scale
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            height
        );

        ctx.stroke();

    }


    for (
        let y = cy;
        y <= height;
        y += scale
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }


    for (
        let y = cy;
        y >= 0;
        y -= scale
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }


    /* Axes */

    ctx.strokeStyle =
        "#64748b";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        0,
        cy
    );

    ctx.lineTo(
        width,
        cy
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        cx,
        0
    );

    ctx.lineTo(
        cx,
        height
    );

    ctx.stroke();


    /* Axis labels */

    ctx.fillStyle =
        "#94a3b8";

    ctx.font =
        "14px Arial";

    ctx.fillText(
        "x",
        width - 20,
        cy - 8
    );

    ctx.fillText(
        "y",
        cx + 8,
        18
    );


    return {
        cx: cx,
        cy: cy,
        scale: scale
    };

}


/* =============================================================
   ARROW
============================================================= */

function arrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color,
    width = 4
) {

    const head =
        12;

    const angle =
        Math.atan2(
            y2 - y1,
            x2 - x1
        );


    ctx.strokeStyle =
        color;

    ctx.fillStyle =
        color;

    ctx.lineWidth =
        width;


    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x2,
        y2
    );

    ctx.lineTo(
        x2 -
        head *
        Math.cos(
            angle -
            Math.PI / 6
        ),

        y2 -
        head *
        Math.sin(
            angle -
            Math.PI / 6
        )
    );


    ctx.lineTo(
        x2 -
        head *
        Math.cos(
            angle +
            Math.PI / 6
        ),

        y2 -
        head *
        Math.sin(
            angle +
            Math.PI / 6
        )
    );


    ctx.closePath();

    ctx.fill();

}


/* =============================================================
   VECTOR DRAWING
============================================================= */

function drawVector(
    ctx,
    origin,
    v,
    color,
    label,
    scale = 45
) {

    const x1 =
        origin.cx;

    const y1 =
        origin.cy;


    const x2 =
        origin.cx +
        v[0] * scale;

    const y2 =
        origin.cy -
        v[1] * scale;


    arrow(
        ctx,
        x1,
        y1,
        x2,
        y2,
        color,
        4
    );


    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.arc(
        x2,
        y2,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.font =
        "bold 15px Arial";


    ctx.fillText(
        label,
        x2 + 10,
        y2 - 10
    );

}


/* =============================================================
   BASIC VECTOR
============================================================= */

function drawBasicVector() {

    const canvas =
        document.getElementById(
            "vectorCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    drawVector(
        c.ctx,
        origin,
        [3, 4],
        "#f97316",
        "x = (3,4)"
    );


    c.ctx.fillStyle =
        "#94a3b8";

    c.ctx.font =
        "14px Arial";


    c.ctx.fillText(
        "Magnitude = 5",
        20,
        c.height - 25
    );

}


/* =============================================================
   VECTOR ADDITION
============================================================= */

function drawAddition() {

    const canvas =
        document.getElementById(
            "additionCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    const a =
        [1, 2];

    const b =
        [4, 1];

    const sum =
        [
            a[0] + b[0],
            a[1] + b[1]
        ];


    drawVector(
        c.ctx,
        origin,
        a,
        "#f97316",
        "a"
    );


    drawVector(
        c.ctx,
        origin,
        sum,
        "#22c55e",
        "a+b"
    );


    const ax =
        origin.cx +
        a[0] * origin.scale;

    const ay =
        origin.cy -
        a[1] * origin.scale;


    const sx =
        origin.cx +
        sum[0] * origin.scale;

    const sy =
        origin.cy -
        sum[1] * origin.scale;


    arrow(
        c.ctx,
        ax,
        ay,
        sx,
        sy,
        "#38bdf8",
        3
    );


    c.ctx.fillStyle =
        "#38bdf8";

    c.ctx.fillText(
        "b",
        (ax + sx) / 2,
        (ay + sy) / 2
    );

}


/* =============================================================
   SCALAR MULTIPLICATION
============================================================= */

function drawScalar() {

    const canvas =
        document.getElementById(
            "scalarCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    const x =
        [2, 3];


    const scaled =
        [6, 9];


    drawVector(
        c.ctx,
        origin,
        x,
        "#f97316",
        "x"
    );


    drawVector(
        c.ctx,
        origin,
        scaled,
        "#22c55e",
        "3x"
    );


    c.ctx.fillStyle =
        "#cbd5e1";

    c.ctx.font =
        "14px Arial";

    c.ctx.fillText(
        "Multiplication by 3 changes magnitude",
        20,
        c.height - 25
    );

}


/* =============================================================
   MATRIX MULTIPLICATION VISUAL
============================================================= */

function drawMatrixMultiplication() {

    const canvas =
        document.getElementById(
            "matrixMultiplicationCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    const x =
        [2, 1];


    const A =
        [
            [2, 0],
            [0, 3]
        ];


    const y =
        multiply(
            A,
            x
        );


    drawVector(
        c.ctx,
        origin,
        x,
        "#f97316",
        "x"
    );


    drawVector(
        c.ctx,
        origin,
        y,
        "#22c55e",
        "Ax"
    );


    c.ctx.fillStyle =
        "#cbd5e1";

    c.ctx.font =
        "14px Arial";


    c.ctx.fillText(
        "Matrix transforms the vector",
        20,
        c.height - 25
    );

}


/* =============================================================
   MATRIX × VECTOR
============================================================= */

function multiply(A, x) {

    return [
        A[0][0] * x[0] +
        A[0][1] * x[1],

        A[1][0] * x[0] +
        A[1][1] * x[1]
    ];

}


/* =============================================================
   DOT PRODUCT STATE
============================================================= */

let dot = {

    x1: 3,
    x2: 2,

    w1: 1,
    w2: 4

};


/* =============================================================
   DRAW DOT PRODUCT
============================================================= */

function drawDotProduct() {

    const canvas =
        document.getElementById(
            "dotCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    const x =
        [
            dot.x1,
            dot.x2
        ];


    const w =
        [
            dot.w1,
            dot.w2
        ];


    drawVector(
        c.ctx,
        origin,
        x,
        "#f97316",
        "x"
    );


    drawVector(
        c.ctx,
        origin,
        w,
        "#22c55e",
        "w"
    );


    const product =
        dot.x1 * dot.w1 +
        dot.x2 * dot.w2;


    const nx =
        Math.sqrt(
            dot.x1 ** 2 +
            dot.x2 ** 2
        );


    const nw =
        Math.sqrt(
            dot.w1 ** 2 +
            dot.w2 ** 2
        );


    let cosine =
        product /
        (nx * nw);


    cosine =
        Math.max(
            -1,
            Math.min(
                1,
                cosine
            )
        );


    const angle =
        Math.acos(
            cosine
        ) *
        180 /
        Math.PI;


    const result =
        document.getElementById(
            "dotResult"
        );


    if (result) {

        result.innerHTML = `

            \\[
            x^Tw
            =
            (${fmt(dot.x1)})(${fmt(dot.w1)})
            +
            (${fmt(dot.x2)})(${fmt(dot.w2)})
            =
            \\boxed{${fmt(product)}}
            \\]

            \\[
            \\theta
            =
            ${fmt(angle)}^\\circ
            \\]

        `;


        if (window.MathJax) {

            MathJax.typesetPromise([
                result
            ]);

        }

    }

}


/* =============================================================
   CONNECT DOT CONTROL
============================================================= */

function connectDot(
    rangeId,
    numberId,
    property
) {

    const range =
        document.getElementById(
            rangeId
        );

    const number =
        document.getElementById(
            numberId
        );


    if (!range || !number) {
        return;
    }


    range.addEventListener(
        "input",
        () => {

            dot[property] =
                parseFloat(
                    range.value
                );

            number.value =
                range.value;

            drawDotProduct();

        }
    );


    number.addEventListener(
        "input",
        () => {

            dot[property] =
                parseFloat(
                    number.value
                );

            range.value =
                number.value;

            drawDotProduct();

        }
    );

}


/* =============================================================
   ANGLE VISUALIZATION
============================================================= */

function drawAngle() {

    const canvas =
        document.getElementById(
            "angleCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    const x =
        [4, 2];

    const y =
        [2, 4];


    drawVector(
        c.ctx,
        origin,
        x,
        "#f97316",
        "x"
    );


    drawVector(
        c.ctx,
        origin,
        y,
        "#22c55e",
        "y"
    );


    /* Angle arc */

    const r =
        55;


    const angle1 =
        -Math.atan2(
            x[1],
            x[0]
        );


    const angle2 =
        -Math.atan2(
            y[1],
            y[0]
        );


    c.ctx.strokeStyle =
        "#a78bfa";

    c.ctx.lineWidth =
        3;


    c.ctx.beginPath();

    c.ctx.arc(
        origin.cx,
        origin.cy,
        r,
        angle1,
        angle2,
        false
    );

    c.ctx.stroke();

}


/* =============================================================
   DISTANCE
============================================================= */

function drawDistance() {

    const canvas =
        document.getElementById(
            "distanceCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    const x =
        [1, 2];

    const y =
        [4, 6];


    const px =
        origin.cx +
        x[0] * origin.scale;

    const py =
        origin.cy -
        x[1] * origin.scale;


    const qx =
        origin.cx +
        y[0] * origin.scale;

    const qy =
        origin.cy -
        y[1] * origin.scale;


    drawVector(
        c.ctx,
        origin,
        x,
        "#f97316",
        "x"
    );


    drawVector(
        c.ctx,
        origin,
        y,
        "#22c55e",
        "y"
    );


    /* Connecting line */

    c.ctx.strokeStyle =
        "#38bdf8";

    c.ctx.lineWidth =
        3;

    c.ctx.setLineDash([
        8,
        6
    ]);


    c.ctx.beginPath();

    c.ctx.moveTo(
        px,
        py
    );

    c.ctx.lineTo(
        qx,
        qy
    );

    c.ctx.stroke();


    c.ctx.setLineDash([]);


    const distance =
        Math.sqrt(
            (x[0] - y[0]) ** 2 +
            (x[1] - y[1]) ** 2
        );


    c.ctx.fillStyle =
        "#38bdf8";

    c.ctx.font =
        "bold 15px Arial";


    c.ctx.fillText(
        `distance = ${fmt(distance)}`,
        20,
        c.height - 25
    );

}


/* =============================================================
   TRANSFORMATION STATE
============================================================= */

let transformation = {

    a: 2,
    b: 0,
    c: 0,
    d: 2,

    x: 2,
    y: 3

};


/* =============================================================
   DRAW TRANSFORMATION
============================================================= */

function drawTransformation() {

    const canvas =
        document.getElementById(
            "transformCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    const x =
        [
            transformation.x,
            transformation.y
        ];


    const A =
        [
            [
                transformation.a,
                transformation.b
            ],

            [
                transformation.c,
                transformation.d
            ]
        ];


    const y =
        multiply(
            A,
            x
        );


    drawVector(
        c.ctx,
        origin,
        x,
        "#f97316",
        "x"
    );


    drawVector(
        c.ctx,
        origin,
        y,
        "#22c55e",
        "Ax"
    );


    const result =
        document.getElementById(
            "transformResult"
        );


    if (result) {

        result.innerHTML = `

            \\[
            A=
            \\begin{bmatrix}
            ${fmt(transformation.a)}
            &
            ${fmt(transformation.b)}
            \\\\
            ${fmt(transformation.c)}
            &
            ${fmt(transformation.d)}
            \\end{bmatrix}
            \\]

            \\[
            x=
            \\begin{bmatrix}
            ${fmt(transformation.x)}
            \\\\
            ${fmt(transformation.y)}
            \\end{bmatrix}
            \\]

            \\[
            Ax=
            \\begin{bmatrix}
            ${fmt(y[0])}
            \\\\
            ${fmt(y[1])}
            \\end{bmatrix}
            \\]

        `;


        if (window.MathJax) {

            MathJax.typesetPromise([
                result
            ]);

        }

    }

}


/* =============================================================
   TRANSFORMATION CONTROLS
============================================================= */

function connectTransformation(
    rangeId,
    numberId,
    property
) {

    const range =
        document.getElementById(
            rangeId
        );

    const number =
        document.getElementById(
            numberId
        );


    if (!range || !number) {
        return;
    }


    range.addEventListener(
        "input",
        () => {

            transformation[property] =
                parseFloat(
                    range.value
                );

            number.value =
                range.value;

            drawTransformation();

        }
    );


    number.addEventListener(
        "input",
        () => {

            transformation[property] =
                parseFloat(
                    number.value
                );

            range.value =
                number.value;

            drawTransformation();

        }
    );

}


/* =============================================================
   TRANSFORMATION PRESETS
============================================================= */

function presetTransform(type) {

    switch (type) {

        case "scale":

            transformation.a = 2;
            transformation.b = 0;
            transformation.c = 0;
            transformation.d = 2;

            break;


        case "rotate":

            const theta =
                45 *
                Math.PI /
                180;


            transformation.a =
                Math.cos(theta);

            transformation.b =
                -Math.sin(theta);

            transformation.c =
                Math.sin(theta);

            transformation.d =
                Math.cos(theta);

            break;


        case "reflect":

            transformation.a = 1;
            transformation.b = 0;
            transformation.c = 0;
            transformation.d = -1;

            break;


        case "project":

            transformation.a = 1;
            transformation.b = 0;
            transformation.c = 0;
            transformation.d = 0;

            break;


        case "shear":

            transformation.a = 1;
            transformation.b = 1;
            transformation.c = 0;
            transformation.d = 1;

            break;

    }


    updateTransformationControls();

    drawTransformation();

}


/* =============================================================
   UPDATE TRANSFORMATION CONTROLS
============================================================= */

function updateValue(
    rangeId,
    numberId,
    value
) {

    const range =
        document.getElementById(
            rangeId
        );

    const number =
        document.getElementById(
            numberId
        );


    if (range) {
        range.value = value;
    }

    if (number) {
        number.value = value;
    }

}


function updateTransformationControls() {

    updateValue(
        "ta",
        "tan",
        transformation.a
    );

    updateValue(
        "tb",
        "tbn",
        transformation.b
    );

    updateValue(
        "tc",
        "tcn",
        transformation.c
    );

    updateValue(
        "td",
        "tdn",
        transformation.d
    );

}


/* =============================================================
   EIGEN SYSTEM
============================================================= */

let eigen = {

    a: 2,
    b: 0,
    c: 0,
    d: 3

};


/* =============================================================
   EIGENVALUES 2×2
============================================================= */

function eigenValues(A) {

    const a =
        A[0][0];

    const b =
        A[0][1];

    const c =
        A[1][0];

    const d =
        A[1][1];


    const trace =
        a + d;


    const determinant =
        a * d -
        b * c;


    const discriminant =
        trace ** 2 -
        4 * determinant;


    if (discriminant < 0) {

        return null;

    }


    const sqrtD =
        Math.sqrt(
            discriminant
        );


    return [
        (trace + sqrtD) / 2,
        (trace - sqrtD) / 2
    ];

}


/* =============================================================
   EIGENVECTOR FOR 2×2
============================================================= */

function eigenvectorFor(
    A,
    lambda
) {

    const a =
        A[0][0];

    const b =
        A[0][1];

    const c =
        A[1][0];

    const d =
        A[1][1];


    let vx;
    let vy;


    /*
       Solve:

       (a-lambda)x + by = 0
    */


    if (
        Math.abs(b) >
        0.000001
    ) {

        vx = 1;

        vy =
            -(a - lambda) /
            b;

    }

    else if (
        Math.abs(c) >
        0.000001
    ) {

        vy = 1;

        vx =
            -(d - lambda) /
            c;

    }

    else {

        /*
          Diagonal matrix
        */

        if (
            Math.abs(
                a - lambda
            ) <
            Math.abs(
                d - lambda
            )
        ) {

            vx = 1;
            vy = 0;

        }
        else {

            vx = 0;
            vy = 1;

        }

    }


    const length =
        Math.sqrt(
            vx ** 2 +
            vy ** 2
        );


    return [
        vx / length,
        vy / length
    ];

}


/* =============================================================
   DRAW EIGEN
============================================================= */

function drawEigen() {

    const canvas =
        document.getElementById(
            "eigenCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    const A =
        [
            [
                eigen.a,
                eigen.b
            ],

            [
                eigen.c,
                eigen.d
            ]
        ];


    const values =
        eigenValues(A);


    if (!values) {

        c.ctx.fillStyle =
            "#fb7185";

        c.ctx.font =
            "bold 17px Arial";

        c.ctx.fillText(
            "No real eigenvalues",
            20,
            30
        );

        return;

    }


    const colors =
        [
            "#c084fc",
            "#38bdf8"
        ];


    values.forEach(
        (lambda, index) => {

            const v =
                eigenvectorFor(
                    A,
                    lambda
                );


            drawVector(
                c.ctx,
                origin,
                v,
                colors[index],
                `v${index + 1}`
            );


            const transformed =
                multiply(
                    A,
                    v
                );


            drawVector(
                c.ctx,
                origin,
                transformed,
                colors[index],
                `Av${index + 1}`
            );

        }
    );


    const result =
        document.getElementById(
            "eigenResult"
        );


    if (result) {

        let text =
            `\\[
            \\lambda_1=${fmt(values[0])},
            \\qquad
            \\lambda_2=${fmt(values[1])}
            \\]`;


        text += `
            \\[
            A\\mathbf{v}
            =
            \\lambda\\mathbf{v}
            \\]
        `;


        result.innerHTML =
            text;


        if (window.MathJax) {

            MathJax.typesetPromise([
                result
            ]);

        }

    }

}


/* =============================================================
   EIGEN CONTROLS
============================================================= */

function connectEigen(
    rangeId,
    numberId,
    property
) {

    const range =
        document.getElementById(
            rangeId
        );

    const number =
        document.getElementById(
            numberId
        );


    if (!range || !number) {
        return;
    }


    range.addEventListener(
        "input",
        () => {

            eigen[property] =
                parseFloat(
                    range.value
                );

            number.value =
                range.value;

            drawEigen();

        }
    );


    number.addEventListener(
        "input",
        () => {

            eigen[property] =
                parseFloat(
                    number.value
                );

            range.value =
                number.value;

            drawEigen();

        }
    );

}


/* =============================================================
   PCA VISUALIZATION
============================================================= */

function drawPCA() {

    const canvas =
        document.getElementById(
            "pcaCanvas"
        );

    if (!canvas) return;


    const c =
        canvasSetup(canvas);


    const origin =
        drawGrid(
            c.ctx,
            c.width,
            c.height
        );


    /*
       Artificial elongated dataset.
    */

    const points = [

        [-3, -2],
        [-2, -1.3],
        [-2, -1],
        [-1.5, -0.5],
        [-1, -0.2],
        [-0.5, 0.1],
        [0, 0.5],
        [0.5, 0.8],
        [1, 1.2],
        [1.5, 1.5],
        [2, 1.8],
        [2.5, 2.2],
        [3, 2.7]

    ];


    /* Data points */

    c.ctx.fillStyle =
        "#38bdf8";


    points.forEach(
        p => {

            const px =
                origin.cx +
                p[0] *
                origin.scale;

            const py =
                origin.cy -
                p[1] *
                origin.scale;


            c.ctx.beginPath();

            c.ctx.arc(
                px,
                py,
                5,
                0,
                Math.PI * 2
            );

            c.ctx.fill();

        }
    );


    /*
       Approximate principal direction.
    */

    const direction =
        [1, 0.82];


    const length =
        4.5;


    arrow(
        c.ctx,

        origin.cx -
        direction[0] *
        length *
        origin.scale,

        origin.cy +
        direction[1] *
        length *
        origin.scale,

        origin.cx +
        direction[0] *
        length *
        origin.scale,

        origin.cy -
        direction[1] *
        length *
        origin.scale,

        "#facc15",

        5
    );


    c.ctx.fillStyle =
        "#facc15";

    c.ctx.font =
        "bold 15px Arial";


    c.ctx.fillText(
        "PC1",
        origin.cx +
        130,
        origin.cy -
        110
    );


    c.ctx.fillStyle =
        "#cbd5e1";

    c.ctx.font =
        "14px Arial";


    c.ctx.fillText(
        "Data cloud",
        20,
        25
    );


    c.ctx.fillText(
        "Principal direction",
        20,
        47
    );

}


/* =============================================================
   MATHJAX TYPESet
============================================================= */

function typeset() {

    if (
        window.MathJax &&
        MathJax.typesetPromise
    ) {

        MathJax.typesetPromise();

    }

}


/* =============================================================
   INITIALIZATION
============================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* -----------------------------------------
           Basic visualizations
        ----------------------------------------- */

        drawBasicVector();

        drawAddition();

        drawScalar();

        drawMatrixMultiplication();

        drawAngle();

        drawDistance();

        drawTransformation();

        drawEigen();

        drawPCA();


        /* -----------------------------------------
           Dot product controls
        ----------------------------------------- */

        connectDot(
            "dotX1",
            "dotX1n",
            "x1"
        );

        connectDot(
            "dotX2",
            "dotX2n",
            "x2"
        );

        connectDot(
            "dotW1",
            "dotW1n",
            "w1"
        );

        connectDot(
            "dotW2",
            "dotW2n",
            "w2"
        );


        /* -----------------------------------------
           Transformation controls
        ----------------------------------------- */

        connectTransformation(
            "ta",
            "tan",
            "a"
        );

        connectTransformation(
            "tb",
            "tbn",
            "b"
        );

        connectTransformation(
            "tc",
            "tcn",
            "c"
        );

        connectTransformation(
            "td",
            "tdn",
            "d"
        );


        /* -----------------------------------------
           Eigen controls
        ----------------------------------------- */

        connectEigen(
            "ea",
            "ean",
            "a"
        );

        connectEigen(
            "eb",
            "ebn",
            "b"
        );

        connectEigen(
            "ec",
            "ecn",
            "c"
        );

        connectEigen(
            "ed",
            "edn",
            "d"
        );


        /* -----------------------------------------
           Initial dot calculation
        ----------------------------------------- */

        drawDotProduct();


        typeset();

    }
);


/* =============================================================
   RESIZE
============================================================= */

window.addEventListener(
    "resize",
    function () {

        drawBasicVector();

        drawAddition();

        drawScalar();

        drawMatrixMultiplication();

        drawDotProduct();

        drawAngle();

        drawDistance();

        drawTransformation();

        drawEigen();

        drawPCA();

    }
);
