/* =========================================================
   HEALTHCHAIN 360
   SMART HEALTH • RESILIENT SUPPLY
   COMPLETE FINAL JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

/* =========================================================
   HEALTHCHAIN AI LIVE STATE
========================================================= */

const healthChainAIState = {

    crisisActive: false,

    crisisProgress: 0,

    affectedLocation: "Kolkata",

    affectedRoute: "Mumbai → Kolkata",

    alternateRoute: "Mumbai → Bengaluru",

    riskLevel: "NORMAL",

    inventoryRisk: "LOW",

    recommendedAction:
        "Continue monitoring the network."

};

const CONFIG = {

    earthRadius: 4.2,

    colors: {

        cyan: 0x00d9ff,
        blue: 0x248cff,
        green: 0x00f5a0,
        orange: 0xffa63d,
        red: 0xff3f5f,
        purple: 0x8c72ff,
        white: 0xffffff,
        darkBlue: 0x071522

    },

    autoRotateSpeed: 0.00065,

    cameraMinDistance: 7.2,

    cameraMaxDistance: 17,

    shipmentSpeed: 0.0015,

    nodePulseSpeed: 0.003,

    dragSensitivityX: 0.0055,

    dragSensitivityY: 0.0035

};


/* =========================================================
   MAIN GLOBE VARIABLES
========================================================= */

let scene = null;

let camera = null;

let renderer = null;

let globeGroup = null;

let earthMesh = null;

let cloudMesh = null;

let atmosphereMesh = null;

let nightMesh = null;

let starField = null;

let nodesGroup = null;

let routesGroup = null;

let shipmentsGroup = null;

let raycaster = null;

let mouse = null;

let globeTooltip = null;

let indiaHitMesh = null;

let indiaMarker = null;

let indiaGlow = null;

let emergencyRoute = null;

let healthcareNodes = [];

let routeObjects = [];

let shipmentObjects = [];

let hoveredObject = null;

let isDragging = false;

let pointerMoved = false;

let previousMouse = {

    x: 0,

    y: 0

};

let rotationVelocity = {

    x: 0,

    y: 0

};

let indiaMode = false;

let crisisRunning = false;

let animationStarted = false;

let autoRotateEnabled = true;

let routeAnimationEnabled = true;

let particleEnabled = true;

let glowEnabled = true;


/* =========================================================
   DIGITAL TWIN VARIABLES
========================================================= */

let twinScene = null;

let twinCamera = null;

let twinRenderer = null;

let twinContainer = null;

let twinGlobe = null;

let twinNetwork = null;

let twinParticles = null;

let twinDragging = false;

let twinPreviousX = 0;

let twinPreviousY = 0;

let twinRotationVelocity = 0;

let twinInitialized = false;


/* =========================================================
   NODE DATA
========================================================= */

const NODE_DATA = [

    {
        name: "Mumbai",
        country: "India",
        type: "Warehouse",
        lat: 19.0760,
        lon: 72.8777,
        risk: "LOW",
        inventory: "82%",
        routes: 7,
        icon: "◆"
    },

    {
        name: "Kolkata",
        country: "India",
        type: "Hospital",
        lat: 22.5726,
        lon: 88.3639,
        risk: "HIGH",
        inventory: "41%",
        routes: 9,
        icon: "+"
    },

    {
        name: "Delhi",
        country: "India",
        type: "Warehouse",
        lat: 28.6139,
        lon: 77.2090,
        risk: "LOW",
        inventory: "76%",
        routes: 11,
        icon: "◆"
    },

    {
        name: "Bengaluru",
        country: "India",
        type: "Hospital",
        lat: 12.9716,
        lon: 77.5946,
        risk: "LOW",
        inventory: "91%",
        routes: 6,
        icon: "+"
    },

    {
        name: "Hyderabad",
        country: "India",
        type: "Warehouse",
        lat: 17.3850,
        lon: 78.4867,
        risk: "MEDIUM",
        inventory: "63%",
        routes: 8,
        icon: "◆"
    },

    {
        name: "Chennai",
        country: "India",
        type: "Hospital",
        lat: 13.0827,
        lon: 80.2707,
        risk: "LOW",
        inventory: "88%",
        routes: 7,
        icon: "+"
    },

    {
        name: "Singapore",
        country: "Singapore",
        type: "Warehouse",
        lat: 1.3521,
        lon: 103.8198,
        risk: "LOW",
        inventory: "94%",
        routes: 14,
        icon: "◆"
    },

    {
        name: "Dubai",
        country: "UAE",
        type: "Warehouse",
        lat: 25.2048,
        lon: 55.2708,
        risk: "MEDIUM",
        inventory: "67%",
        routes: 12,
        icon: "◆"
    },

    {
        name: "London",
        country: "UK",
        type: "Hospital",
        lat: 51.5074,
        lon: -0.1278,
        risk: "LOW",
        inventory: "89%",
        routes: 15,
        icon: "+"
    },

    {
        name: "New York",
        country: "USA",
        type: "Hospital",
        lat: 40.7128,
        lon: -74.0060,
        risk: "LOW",
        inventory: "93%",
        routes: 18,
        icon: "+"
    },

    {
        name: "São Paulo",
        country: "Brazil",
        type: "Hospital",
        lat: -23.5505,
        lon: -46.6333,
        risk: "MEDIUM",
        inventory: "61%",
        routes: 8,
        icon: "+"
    },

    {
        name: "Johannesburg",
        country: "South Africa",
        type: "Warehouse",
        lat: -26.2041,
        lon: 28.0473,
        risk: "MEDIUM",
        inventory: "58%",
        routes: 7,
        icon: "◆"
    },

    {
        name: "Sydney",
        country: "Australia",
        type: "Hospital",
        lat: -33.8688,
        lon: 151.2093,
        risk: "LOW",
        inventory: "87%",
        routes: 10,
        icon: "+"
    },

    {
        name: "Tokyo",
        country: "Japan",
        type: "Hospital",
        lat: 35.6762,
        lon: 139.6503,
        risk: "LOW",
        inventory: "95%",
        routes: 16,
        icon: "+"
    }

];


/* =========================================================
   ROUTE DATA
========================================================= */

const ROUTE_DATA = [

    {
        from: "Mumbai",
        to: "Kolkata",
        cargo: "Vaccines",
        units: 420,
        eta: "06h 24m",
        risk: "LOW"
    },

    {
        from: "Delhi",
        to: "Bengaluru",
        cargo: "Respiratory Medicine",
        units: 280,
        eta: "08h 10m",
        risk: "LOW"
    },

    {
        from: "Hyderabad",
        to: "Chennai",
        cargo: "Emergency Supplies",
        units: 190,
        eta: "04h 42m",
        risk: "LOW"
    },

    {
        from: "Mumbai",
        to: "Delhi",
        cargo: "Medical Equipment",
        units: 394,
        eta: "05h 18m",
        risk: "MEDIUM"
    },

    {
        from: "Singapore",
        to: "Mumbai",
        cargo: "Vaccines",
        units: 310,
        eta: "11h 20m",
        risk: "LOW"
    },

    {
        from: "Dubai",
        to: "Delhi",
        cargo: "Medical Equipment",
        units: 230,
        eta: "09h 12m",
        risk: "MEDIUM"
    },

    {
        from: "London",
        to: "Mumbai",
        cargo: "Emergency Medicine",
        units: 170,
        eta: "13h 40m",
        risk: "LOW"
    },

    {
        from: "Tokyo",
        to: "Singapore",
        cargo: "Vaccines",
        units: 360,
        eta: "07h 45m",
        risk: "LOW"
    },

    {
        from: "New York",
        to: "London",
        cargo: "Medical Equipment",
        units: 290,
        eta: "08h 50m",
        risk: "LOW"
    }

];


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeLoader();

        initializeNavigation();

        initializeGlobe();

        initializeDigitalTwin();

        initializeButtons();

        initializeNetworkControls();

        initializeModal();

        initializeScrollAnimations();

        initializeCounters();

    }
);


/* =========================================================
   LOADER
========================================================= */

function initializeLoader() {

    const loader =
        document.getElementById(
            "loader"
        );

    const progress =
        document.getElementById(
            "loaderProgress"
        );


    if (
        !loader ||
        !progress
    ) {

        return;

    }


    let value = 0;


    const interval =
        setInterval(
            () => {

                value +=
                    Math.random() * 14 +
                    6;


                if (
                    value >= 100
                ) {

                    value =
                        100;

                    clearInterval(
                        interval
                    );


                    setTimeout(
                        () => {

                            loader.classList.add(
                                "hidden"
                            );

                        },
                        450
                    );

                }


                progress.style.width =
                    `${value}%`;

            },
            100
        );

}


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const navMenu =
        document.getElementById(
            "navMenu"
        );

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    if (
        navMenu &&
        mobileMenu
    ) {

        navMenu.addEventListener(
            "click",
            () => {

                mobileMenu.classList.toggle(
                    "open"
                );

            }
        );


        mobileMenu
            .querySelectorAll(
                "a"
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        () => {

                            mobileMenu.classList.remove(
                                "open"
                            );

                        }
                    );

                }
            );

    }


    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );


    window.addEventListener(
        "scroll",
        () => {

            let current =
                "top";


            sections.forEach(
                section => {

                    if (
                        window.scrollY >=
                        section.offsetTop -
                        180
                    ) {

                        current =
                            section.id;

                    }

                }
            );


            navLinks.forEach(
                link => {

                    link.classList.remove(
                        "active"
                    );


                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        href ===
                        `#${current}`
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   MAIN GLOBE INITIALIZATION
========================================================= */

function initializeGlobe() {

    const container =
        document.getElementById(
            "globe-container"
        );


    if (
        !container
    ) {

        console.warn(
            "globe-container not found."
        );

        return;

    }


    if (
        typeof THREE ===
        "undefined"
    ) {

        console.error(
            "Three.js is not loaded."
        );

        return;

    }


    scene =
        new THREE.Scene();


    camera =
        new THREE.PerspectiveCamera(

            38,

            Math.max(
                container.clientWidth,
                1
            ) /
            Math.max(
                container.clientHeight,
                1
            ),

            0.1,

            100

        );


    camera.position.set(
        0,
        0,
        15.8
    );


    renderer =
        new THREE.WebGLRenderer({

            antialias:
                true,

            alpha:
                true

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        Math.max(
            container.clientWidth,
            1
        ),
        Math.max(
            container.clientHeight,
            1
        )
    );


    if (
        "outputColorSpace"
        in renderer
    ) {

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;

    }


    renderer.setClearColor(
        0x000000,
        0
    );


    renderer.domElement.style.width =
        "100%";


    renderer.domElement.style.height =
        "100%";


    renderer.domElement.style.display =
        "block";


    renderer.domElement.style.cursor =
        "grab";


    container.appendChild(
        renderer.domElement
    );


    /* =====================================================
       LIGHTING
    ===================================================== */

    const ambient =
        new THREE.AmbientLight(
            0x294b63,
            0.42
        );


    scene.add(
        ambient
    );


    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            0.8
        );


    sun.position.set(
        -7,
        4,
        8
    );


    scene.add(
        sun
    );


    const blueLight =
        new THREE.PointLight(
            0x00aaff,
            0.45,
            30
        );


    blueLight.position.set(
        5,
        2,
        8
    );


    scene.add(
        blueLight
    );


    /* =====================================================
       GLOBE GROUP
    ===================================================== */

    globeGroup =
        new THREE.Group();


    globeGroup.rotation.x =
        0.08;


    globeGroup.rotation.y =
        -0.35;


    scene.add(
        globeGroup
    );


    createEarth();

    createClouds();

    createAtmosphere();

    createStars();


    nodesGroup =
        new THREE.Group();


    routesGroup =
        new THREE.Group();


    shipmentsGroup =
        new THREE.Group();


    globeGroup.add(
        routesGroup
    );


    globeGroup.add(
        shipmentsGroup
    );


    globeGroup.add(
        nodesGroup
    );


    createHealthcareNodes();

    createSupplyRoutes();

    createShipments();

    createIndiaHotspot();


    raycaster =
        new THREE.Raycaster();


    mouse =
        new THREE.Vector2();


    createTooltip();


    /* =====================================================
       EVENTS
    ===================================================== */

    renderer.domElement.addEventListener(
        "pointerdown",
        onPointerDown
    );


    renderer.domElement.addEventListener(
        "pointermove",
        onPointerMove
    );


    renderer.domElement.addEventListener(
        "pointerup",
        onPointerUp
    );


    renderer.domElement.addEventListener(
        "pointerleave",
        onPointerUp
    );


    renderer.domElement.addEventListener(
        "wheel",
        onWheel,
        {
            passive:
                false
        }
    );


    renderer.domElement.addEventListener(
        "click",
        onGlobeClick
    );


    window.addEventListener(
        "resize",
        resizeGlobe
    );


    if (
        !animationStarted
    ) {

        animationStarted =
            true;

        animate();

    }

}


/* =========================================================
   EARTH
========================================================= */

function createEarth() {

    const geometry =
        new THREE.SphereGeometry(
            CONFIG.earthRadius,
            96,
            96
        );


    const loader =
        new THREE.TextureLoader();


    loader.crossOrigin =
        "anonymous";


    const earthTexture =
        loader.load(
            "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
        );


    const normalTexture =
        loader.load(
            "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
        );


    const specularTexture =
        loader.load(
            "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
        );


    const material =
        new THREE.MeshPhongMaterial({

            map:
                earthTexture,

            normalMap:
                normalTexture,

            normalScale:
                new THREE.Vector2(
                    0.18,
                    0.18
                ),

            specularMap:
                specularTexture,

            specular:
                new THREE.Color(
                    0x16425c
                ),

            shininess:
                5,

            color:
                new THREE.Color(
                    0xb5d8e8
                )

        });


    earthMesh =
        new THREE.Mesh(
            geometry,
            material
        );


    globeGroup.add(
        earthMesh
    );


    /* =====================================================
       NIGHT LIGHTS
    ===================================================== */

    const nightGeometry =
        new THREE.SphereGeometry(
            CONFIG.earthRadius +
            0.018,
            96,
            96
        );


    const nightTexture =
        loader.load(
            "https://threejs.org/examples/textures/planets/earth_lights_2048.png"
        );


    const nightMaterial =
        new THREE.MeshBasicMaterial({

            map:
                nightTexture,

            transparent:
                true,

            opacity:
                0.23,

            blending:
                THREE.AdditiveBlending

        });


    nightMesh =
        new THREE.Mesh(
            nightGeometry,
            nightMaterial
        );


    globeGroup.add(
        nightMesh
    );

}


/* =========================================================
   CLOUDS
========================================================= */

function createClouds() {

    const loader =
        new THREE.TextureLoader();


    loader.crossOrigin =
        "anonymous";


    const texture =
        loader.load(
            "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
        );


    const geometry =
        new THREE.SphereGeometry(
            CONFIG.earthRadius +
            0.055,
            64,
            64
        );


    const material =
        new THREE.MeshPhongMaterial({

            map:
                texture,

            transparent:
                true,

            opacity:
                0.26,

            depthWrite:
                false

        });


    cloudMesh =
        new THREE.Mesh(
            geometry,
            material
        );


    globeGroup.add(
        cloudMesh
    );

}


/* =========================================================
   ATMOSPHERE
========================================================= */

function createAtmosphere() {

    const geometry =
        new THREE.SphereGeometry(
            CONFIG.earthRadius +
            0.18,
            64,
            64
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.colors.cyan,

            transparent:
                true,

            opacity:
                0.075,

            side:
                THREE.BackSide,

            blending:
                THREE.AdditiveBlending

        });


    atmosphereMesh =
        new THREE.Mesh(
            geometry,
            material
        );


    globeGroup.add(
        atmosphereMesh
    );

}


/* =========================================================
   STAR FIELD
========================================================= */

function createStars() {

    const geometry =
        new THREE.BufferGeometry();


    const positions = [];


    for (
        let i = 0;
        i < 1600;
        i++
    ) {

        const radius =
            22 +
            Math.random() *
            14;


        const theta =
            Math.random() *
            Math.PI *
            2;


        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
            );


        positions.push(

            radius *
            Math.sin(phi) *
            Math.cos(theta),

            radius *
            Math.sin(phi) *
            Math.sin(theta),

            radius *
            Math.cos(phi)

        );

    }


    geometry.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(
            positions,
            3
        )

    );


    const material =
        new THREE.PointsMaterial({

            color:
                0x7bdfff,

            size:
                0.035,

            transparent:
                true,

            opacity:
                0.7

        });


    starField =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        starField
    );

}


/* =========================================================
   LAT/LON CONVERSION
========================================================= */

function latLonToVector3(
    lat,
    lon,
    radius
) {

    const phi =
        (
            90 -
            lat
        ) *
        Math.PI /
        180;


    const theta =
        (
            lon +
            180
        ) *
        Math.PI /
        180;


    return new THREE.Vector3(

        -radius *
        Math.sin(phi) *
        Math.cos(theta),

        radius *
        Math.cos(phi),

        radius *
        Math.sin(phi) *
        Math.sin(theta)

    );

}


/* =========================================================
   NODE COLOR
========================================================= */

function getNodeColor(
    risk
) {

    if (
        risk ===
        "HIGH"
    ) {

        return CONFIG.colors.red;

    }


    if (
        risk ===
        "MEDIUM"
    ) {

        return CONFIG.colors.orange;

    }


    return CONFIG.colors.cyan;

}


/* =========================================================
   ROUTE COLOR
========================================================= */

function getRouteColor(
    risk
) {

    if (
        risk ===
        "HIGH"
    ) {

        return CONFIG.colors.red;

    }


    if (
        risk ===
        "MEDIUM"
    ) {

        return CONFIG.colors.orange;

    }


    return CONFIG.colors.cyan;

}


/* =========================================================
   HEALTHCARE NODES
========================================================= */

function createHealthcareNodes() {

    NODE_DATA.forEach(
        (data, index) => {

            const position =
                latLonToVector3(

                    data.lat,

                    data.lon,

                    CONFIG.earthRadius +
                    0.12

                );


            const group =
                new THREE.Group();


            group.position.copy(
                position
            );


            group.userData =
                data;


            const color =
                getNodeColor(
                    data.risk
                );


            /* =================================================
               CORE
            ================================================= */

            const coreGeometry =
                new THREE.SphereGeometry(
                    0.105,
                    20,
                    20
                );


            const coreMaterial =
                new THREE.MeshBasicMaterial({

                    color:
                        color

                });


            const core =
                new THREE.Mesh(
                    coreGeometry,
                    coreMaterial
                );


            group.add(
                core
            );


            /* =================================================
               RING
            ================================================= */

            const ringGeometry =
                new THREE.RingGeometry(
                    0.15,
                    0.19,
                    32
                );


            const ringMaterial =
                new THREE.MeshBasicMaterial({

                    color:
                        color,

                    transparent:
                        true,

                    opacity:
                        0.5,

                    side:
                        THREE.DoubleSide

                });


            const ring =
                new THREE.Mesh(
                    ringGeometry,
                    ringMaterial
                );


            ring.lookAt(
                new THREE.Vector3(
                    0,
                    0,
                    0
                )
            );


            group.add(
                ring
            );


            /* =================================================
               GLOW
            ================================================= */

            const glowGeometry =
                new THREE.SphereGeometry(
                    0.23,
                    20,
                    20
                );


            const glowMaterial =
                new THREE.MeshBasicMaterial({

                    color:
                        color,

                    transparent:
                        true,

                    opacity:
                        0.15,

                    blending:
                        THREE.AdditiveBlending

                });


            const glow =
                new THREE.Mesh(
                    glowGeometry,
                    glowMaterial
                );


            group.add(
                glow
            );


            /* =================================================
               SAVE NODE
            ================================================= */

            const node = {

                data:
                    data,

                group:
                    group,

                core:
                    core,

                ring:
                    ring,

                glow:
                    glow,

                index:
                    index

            };


            healthcareNodes.push(
                node
            );


            nodesGroup.add(
                group
            );

        }
    );

}


/* =========================================================
   SUPPLY ROUTES
========================================================= */

function createSupplyRoutes() {

    ROUTE_DATA.forEach(
        routeData => {

            const fromNode =
                NODE_DATA.find(
                    item =>
                        item.name ===
                        routeData.from
                );


            const toNode =
                NODE_DATA.find(
                    item =>
                        item.name ===
                        routeData.to
                );


            if (
                !fromNode ||
                !toNode
            ) {

                return;

            }


            const start =
                latLonToVector3(

                    fromNode.lat,

                    fromNode.lon,

                    CONFIG.earthRadius +
                    0.08

                );


            const end =
                latLonToVector3(

                    toNode.lat,

                    toNode.lon,

                    CONFIG.earthRadius +
                    0.08

                );


            const midpoint =
                start
                    .clone()
                    .add(end)
                    .normalize()
                    .multiplyScalar(
                        CONFIG.earthRadius +
                        0.9
                    );


            const curve =
                new THREE.QuadraticBezierCurve3(

                    start,

                    midpoint,

                    end

                );


            const points =
                curve.getPoints(
                    80
                );


            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(
                        points
                    );


            const material =
                new THREE.LineBasicMaterial({

                    color:
                        getRouteColor(
                            routeData.risk
                        ),

                    transparent:
                        true,

                    opacity:
                        routeData.risk ===
                        "MEDIUM"
                            ? 0.28
                            : 0.42

                });


            const line =
                new THREE.Line(
                    geometry,
                    material
                );


            line.userData = {

                data:
                    routeData,

                curve:
                    curve

            };


            routesGroup.add(
                line
            );


            routeObjects.push(
                line
            );

        }
    );

}


/* =========================================================
   SHIPMENT PARTICLES
========================================================= */

function createShipments() {

    ROUTE_DATA.forEach(
        (routeData, index) => {

            const route =
                routeObjects[index];


            if (
                !route
            ) {

                return;

            }


            const geometry =
                new THREE.SphereGeometry(
                    0.055,
                    12,
                    12
                );


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        CONFIG.colors.green

                });


            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );


            particle.userData = {

                curve:
                    route.userData.curve,

                progress:
                    Math.random(),

                index:
                    index

            };


            shipmentsGroup.add(
                particle
            );


            shipmentObjects.push(
                particle
            );

        }
    );

}


/* =========================================================
   INDIA INTERACTIVE HOTSPOT
========================================================= */

function createIndiaHotspot() {

    if (
        !nodesGroup
    ) {

        return;

    }


    const position =
        latLonToVector3(

            22.5,

            79.0,

            CONFIG.earthRadius +
            0.22

        );


    /* =====================================================
       INVISIBLE CLICK AREA
    ===================================================== */

    const hitGeometry =
        new THREE.SphereGeometry(
            0.68,
            32,
            32
        );


    const hitMaterial =
        new THREE.MeshBasicMaterial({

            transparent:
                true,

            opacity:
                0,

            depthWrite:
                false

        });


    indiaHitMesh =
        new THREE.Mesh(

            hitGeometry,

            hitMaterial

        );


    indiaHitMesh.position.copy(
        position
    );


    indiaHitMesh.userData = {

        type:
            "india"

    };


    nodesGroup.add(
        indiaHitMesh
    );


    /* =====================================================
       VISIBLE RING
    ===================================================== */

    const ringGeometry =
        new THREE.RingGeometry(
            0.16,
            0.23,
            32
        );


    const ringMaterial =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.colors.cyan,

            transparent:
                true,

            opacity:
                0.95,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending

        });


    indiaMarker =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );


    indiaMarker.position.copy(
        position
    );


    indiaMarker.lookAt(
        new THREE.Vector3(
            0,
            0,
            0
        )
    );


    nodesGroup.add(
        indiaMarker
    );


    /* =====================================================
       GLOW
    ===================================================== */

    const glowGeometry =
        new THREE.SphereGeometry(
            0.12,
            16,
            16
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color:
                CONFIG.colors.cyan,

            transparent:
                true,

            opacity:
                0.25,

            blending:
                THREE.AdditiveBlending

        });


    indiaGlow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    indiaGlow.position.copy(
        position
    );


    nodesGroup.add(
        indiaGlow
    );


    console.log(
        "India interactive hotspot ready."
    );

}


/* =========================================================
   TOOLTIP
========================================================= */

function createTooltip() {

    globeTooltip =
        document.createElement(
            "div"
        );


    globeTooltip.style.position =
        "fixed";


    globeTooltip.style.zIndex =
        "9999";


    globeTooltip.style.pointerEvents =
        "none";


    globeTooltip.style.display =
        "none";


    globeTooltip.style.minWidth =
        "180px";


    globeTooltip.style.padding =
        "12px 14px";


    globeTooltip.style.borderRadius =
        "12px";


    globeTooltip.style.background =
        "rgba(4,12,22,.95)";


    globeTooltip.style.border =
        "1px solid rgba(0,217,255,.25)";


    globeTooltip.style.boxShadow =
        "0 15px 45px rgba(0,0,0,.45)";


    globeTooltip.style.backdropFilter =
        "blur(12px)";


    document.body.appendChild(
        globeTooltip
    );

}


/* =========================================================
   POINTER DOWN
========================================================= */

function onPointerDown(
    event
) {

    isDragging =
        true;


    pointerMoved =
        false;


    previousMouse.x =
        event.clientX;


    previousMouse.y =
        event.clientY;


    rotationVelocity.x =
        0;


    rotationVelocity.y =
        0;


    renderer.domElement.style.cursor =
        "grabbing";

}


/* =========================================================
   POINTER MOVE
========================================================= */

function onPointerMove(
    event
) {

    if (
        !renderer
    ) {

        return;

    }


    const dx =
        event.clientX -
        previousMouse.x;


    const dy =
        event.clientY -
        previousMouse.y;


    if (
        Math.abs(dx) >
        2 ||
        Math.abs(dy) >
        2
    ) {

        pointerMoved =
            true;

    }


    if (
        isDragging &&
        globeGroup
    ) {

        globeGroup.rotation.y +=
            dx *
            CONFIG.dragSensitivityX;


        globeGroup.rotation.x +=
            dy *
            CONFIG.dragSensitivityY;


        globeGroup.rotation.x =
            THREE.MathUtils.clamp(

                globeGroup.rotation.x,

                -0.9,

                0.9

            );


        rotationVelocity.y =
            dx *
            CONFIG.dragSensitivityX;


        rotationVelocity.x =
            dy *
            CONFIG.dragSensitivityY;


        previousMouse.x =
            event.clientX;


        previousMouse.y =
            event.clientY;

    }


    checkHover(

        event.clientX,

        event.clientY

    );

}


/* =========================================================
   POINTER UP
========================================================= */

function onPointerUp() {

    isDragging =
        false;


    if (
        renderer
    ) {

        renderer.domElement.style.cursor =
            "grab";

    }

}


/* =========================================================
   ZOOM
========================================================= */

function onWheel(
    event
) {

    event.preventDefault();


    if (
        !camera
    ) {

        return;

    }


    camera.position.z +=
        event.deltaY *
        0.008;


    camera.position.z =
        THREE.MathUtils.clamp(

            camera.position.z,

            CONFIG.cameraMinDistance,

            CONFIG.cameraMaxDistance

        );

}


/* =========================================================
   HOVER DETECTION
========================================================= */

function checkHover(
    clientX,
    clientY
) {

    if (
        !renderer ||
        !camera ||
        !raycaster
    ) {

        return;

    }


    const rect =
        renderer.domElement
            .getBoundingClientRect();


    mouse.x =
        (
            clientX -
            rect.left
        ) /
        rect.width *
        2 -
        1;


    mouse.y =
        -(
            (
                clientY -
                rect.top
            ) /
            rect.height
        ) *
        2 +
        1;


    raycaster.setFromCamera(
        mouse,
        camera
    );


    /* =====================================================
       INDIA
    ===================================================== */

    if (
        indiaHitMesh
    ) {

        const indiaHits =
            raycaster.intersectObject(
                indiaHitMesh,
                false
            );


        if (
            indiaHits.length
        ) {

            renderer.domElement.style.cursor =
                "pointer";


            showIndiaTooltip(
                clientX,
                clientY
            );


            return;

        }

    }


    /* =====================================================
       NODES
    ===================================================== */

    const nodeObjects =
        healthcareNodes.map(
            node =>
                node.core
        );


    const nodeHits =
        raycaster.intersectObjects(
            nodeObjects,
            false
        );


    if (
        nodeHits.length
    ) {

        const selected =
            healthcareNodes.find(
                node =>
                    node.core ===
                    nodeHits[0].object
            );


        if (
            selected
        ) {

            renderer.domElement.style.cursor =
                "pointer";


            showNodeTooltip(

                selected.data,

                clientX,

                clientY

            );


            hoveredObject =
                selected;


            return;

        }

    }


    /* =====================================================
       ROUTES
    ===================================================== */

    const routeHits =
        raycaster.intersectObjects(
            routeObjects,
            false
        );


    if (
        routeHits.length
    ) {

        renderer.domElement.style.cursor =
            "pointer";


        showRouteTooltip(

            routeHits[0]
                .object
                .userData
                .data,

            clientX,

            clientY

        );


        return;

    }


    hideTooltip();


    renderer.domElement.style.cursor =
        isDragging
            ? "grabbing"
            : "grab";

}


/* =========================================================
   INDIA TOOLTIP
========================================================= */

function showIndiaTooltip(
    x,
    y
) {

    globeTooltip.innerHTML = `

        <div style="
            color:#00d9ff;
            font-size:9px;
            letter-spacing:1.8px;
            font-weight:800;
        ">
            REGIONAL NETWORK
        </div>

        <div style="
            color:white;
            font-size:17px;
            font-weight:800;
            margin-top:5px;
        ">
            🇮🇳 India
        </div>

        <div style="
            color:#8095a5;
            font-size:10px;
            margin-top:4px;
        ">
            Click to open regional view
        </div>

    `;


    globeTooltip.style.left =
        `${x + 16}px`;


    globeTooltip.style.top =
        `${y + 16}px`;


    globeTooltip.style.display =
        "block";

}


/* =========================================================
   NODE TOOLTIP
========================================================= */

function showNodeTooltip(
    data,
    x,
    y
) {

    globeTooltip.innerHTML = `

        <div style="
            color:#00d9ff;
            font-size:9px;
            letter-spacing:1.5px;
            font-weight:800;
        ">
            ${data.type}
        </div>

        <div style="
            color:white;
            font-size:17px;
            font-weight:800;
            margin-top:4px;
        ">
            ${data.icon}
            ${data.name}
        </div>

        <div style="
            color:#7e92a1;
            font-size:10px;
            margin-top:3px;
        ">
            ${data.country}
        </div>

        <div style="
            margin-top:8px;
            color:#00f5a0;
            font-size:10px;
        ">
            Inventory ${data.inventory}
        </div>

    `;


    globeTooltip.style.left =
        `${x + 16}px`;


    globeTooltip.style.top =
        `${y + 16}px`;


    globeTooltip.style.display =
        "block";

}


/* =========================================================
   ROUTE TOOLTIP
========================================================= */

function showRouteTooltip(
    data,
    x,
    y
) {

    globeTooltip.innerHTML = `

        <div style="
            color:#00d9ff;
            font-size:9px;
            letter-spacing:1.5px;
            font-weight:800;
        ">
            LIVE SUPPLY ROUTE
        </div>

        <div style="
            color:white;
            font-size:14px;
            font-weight:800;
            margin-top:5px;
        ">
            ${data.from}
            →
            ${data.to}
        </div>

        <div style="
            color:#8095a5;
            font-size:10px;
            margin-top:4px;
        ">
            ${data.cargo}
        </div>

        <div style="
            color:#00f5a0;
            font-size:10px;
            margin-top:7px;
        ">
            ETA ${data.eta}
        </div>

    `;


    globeTooltip.style.left =
        `${x + 16}px`;


    globeTooltip.style.top =
        `${y + 16}px`;


    globeTooltip.style.display =
        "block";

}


/* =========================================================
   HIDE TOOLTIP
========================================================= */

function hideTooltip() {

    if (
        globeTooltip
    ) {

        globeTooltip.style.display =
            "none";

    }

}


/* =========================================================
   GLOBE CLICK
========================================================= */

function onGlobeClick(
    event
) {

    if (
        pointerMoved
    ) {

        pointerMoved =
            false;

        return;

    }


    if (
        !renderer ||
        !camera ||
        !raycaster
    ) {

        return;

    }


    const rect =
        renderer.domElement
            .getBoundingClientRect();


    mouse.x =
        (
            event.clientX -
            rect.left
        ) /
        rect.width *
        2 -
        1;


    mouse.y =
        -(
            (
                event.clientY -
                rect.top
            ) /
            rect.height
        ) *
        2 +
        1;


    raycaster.setFromCamera(
        mouse,
        camera
    );


    /* =====================================================
       INDIA
    ===================================================== */

    if (
        indiaHitMesh
    ) {

        const hits =
            raycaster.intersectObject(
                indiaHitMesh,
                false
            );


        if (
            hits.length
        ) {

            focusIndia();

            showIndiaPanel();

            return;

        }

    }


    /* =====================================================
       NODE
    ===================================================== */

    const nodeHits =
        raycaster.intersectObjects(

            healthcareNodes.map(
                node =>
                    node.core
            ),

            false

        );


    if (
        nodeHits.length
    ) {

        const selected =
            healthcareNodes.find(
                node =>
                    node.core ===
                    nodeHits[0].object
            );


        if (
            selected
        ) {

            openNodeModal(
                selected.data
            );

            return;

        }

    }


    /* =====================================================
       ROUTE
    ===================================================== */

    const routeHits =
        raycaster.intersectObjects(
            routeObjects,
            false
        );


    if (
        routeHits.length
    ) {

        openRouteModal(
            routeHits[0]
                .object
                .userData
                .data
        );

    }

}


/* =========================================================
   INDIA FOCUS
========================================================= */

function focusIndia() {

    indiaMode = true;

    animateGlobeRotation(
        0.37,
        -3.14,
        1000
    );

    animateCamera(
        10.5,
        1000
    );

}


/* =========================================================
   GLOBAL FOCUS
========================================================= */

function rotateToGlobal() {

    indiaMode =
        false;


    animateGlobeRotation(

        0.08,

        -0.35,

        1000

    );


    animateCamera(

        15.8,

        1000

    );

}


/* =========================================================
   SMOOTH GLOBE ROTATION
========================================================= */

function animateGlobeRotation(
    targetX,
    targetY,
    duration
) {

    if (
        !globeGroup
    ) {

        return;

    }


    const startX =
        globeGroup.rotation.x;


    const startY =
        globeGroup.rotation.y;


    const start =
        performance.now();


    function update(
        time
    ) {

        const progress =
            Math.min(

                (
                    time -
                    start
                ) /
                duration,

                1

            );


        const eased =
            1 -
            Math.pow(
                1 -
                progress,
                3
            );


        globeGroup.rotation.x =
            startX +
            (
                targetX -
                startX
            ) *
            eased;


        globeGroup.rotation.y =
            startY +
            (
                targetY -
                startY
            ) *
            eased;


        if (
            progress <
            1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   SMOOTH CAMERA
========================================================= */

function animateCamera(
    targetZ,
    duration
) {

    if (
        !camera
    ) {

        return;

    }


    const startZ =
        camera.position.z;


    const start =
        performance.now();


    function update(
        time
    ) {

        const progress =
            Math.min(

                (
                    time -
                    start
                ) /
                duration,

                1

            );


        const eased =
            1 -
            Math.pow(
                1 -
                progress,
                3
            );


        camera.position.z =
            startZ +
            (
                targetZ -
                startZ
            ) *
            eased;


        if (
            progress <
            1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   INDIA INFORMATION PANEL
========================================================= */

function showIndiaPanel() {

    const existing =
        document.getElementById(
            "indiaNetworkPanel"
        );


    if (
        existing
    ) {

        existing.remove();

    }


    const panel =
        document.createElement(
            "div"
        );


    panel.id =
        "indiaNetworkPanel";


    panel.style.position =
        "fixed";


    panel.style.right =
        "28px";


    panel.style.bottom =
        "28px";


    panel.style.zIndex =
        "99999";


    panel.style.width =
        "320px";


    panel.style.maxWidth =
        "calc(100vw - 40px)";


    panel.style.padding =
        "22px";


    panel.style.borderRadius =
        "18px";


    panel.style.background =
        "rgba(5,14,25,.96)";


    panel.style.border =
        "1px solid rgba(0,217,255,.25)";


    panel.style.boxShadow =
        "0 25px 80px rgba(0,0,0,.65)";


    panel.style.backdropFilter =
        "blur(16px)";


    panel.style.color =
        "#fff";


    panel.innerHTML = `

        <div style="
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
        ">

            <div>

                <div style="
                    color:#00d9ff;
                    font-size:9px;
                    font-weight:800;
                    letter-spacing:2px;
                ">
                    REGIONAL NETWORK
                </div>

                <div style="
                    margin-top:5px;
                    font-size:25px;
                    font-weight:800;
                ">
                    🇮🇳 INDIA
                </div>

                <div style="
                    margin-top:3px;
                    color:#718797;
                    font-size:10px;
                ">
                    Healthcare Supply Intelligence
                </div>

            </div>

            <button
                id="closeIndiaPanel"
                style="
                    width:32px;
                    height:32px;
                    border-radius:50%;
                    border:1px solid rgba(255,255,255,.12);
                    background:rgba(255,255,255,.05);
                    color:white;
                    cursor:pointer;
                    font-size:18px;
                "
            >
                ×
            </button>

        </div>


        <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:9px;
            margin-top:20px;
        ">

            <div style="
                padding:14px;
                border-radius:12px;
                background:rgba(0,217,255,.06);
            ">

                <small style="
                    color:#718797;
                    font-size:8px;
                    letter-spacing:1px;
                ">
                    HOSPITALS
                </small>

                <strong style="
                    display:block;
                    font-size:23px;
                    margin-top:4px;
                ">
                    248
                </strong>

            </div>


            <div style="
                padding:14px;
                border-radius:12px;
                background:rgba(0,245,160,.06);
            ">

                <small style="
                    color:#718797;
                    font-size:8px;
                    letter-spacing:1px;
                ">
                    WAREHOUSES
                </small>

                <strong style="
                    display:block;
                    font-size:23px;
                    margin-top:4px;
                ">
                    36
                </strong>

            </div>


            <div style="
                padding:14px;
                border-radius:12px;
                background:rgba(255,166,61,.06);
            ">

                <small style="
                    color:#718797;
                    font-size:8px;
                    letter-spacing:1px;
                ">
                    ACTIVE ROUTES
                </small>

                <strong style="
                    display:block;
                    font-size:23px;
                    margin-top:4px;
                ">
                    142
                </strong>

            </div>


            <div style="
                padding:14px;
                border-radius:12px;
                background:rgba(0,245,160,.06);
            ">

                <small style="
                    color:#718797;
                    font-size:8px;
                    letter-spacing:1px;
                ">
                    RESILIENCE
                </small>

                <strong style="
                    display:block;
                    font-size:23px;
                    margin-top:4px;
                    color:#00f5a0;
                ">
                    94.7%
                </strong>

            </div>

        </div>


        <div style="
            margin-top:15px;
            padding:13px;
            border-radius:12px;
            background:rgba(255,255,255,.035);
            color:#8da2b2;
            font-size:10px;
            line-height:1.6;
        ">

            AI monitoring is tracking India's
            healthcare demand, inventory levels,
            critical routes and disruption risk.

        </div>

    `;


    document.body.appendChild(
        panel
    );


    document
        .getElementById(
            "closeIndiaPanel"
        )
        .addEventListener(
            "click",
            () => {

                panel.remove();

            }
        );

}


/* =========================================================
   NODE MODAL
========================================================= */

function openNodeModal(
    data
) {

    removeDynamicModal();


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "hc-dynamic-modal";


    modal.innerHTML = `

        <div class="hc-modal-card">

            <button
                class="hc-modal-close"
            >
                ×
            </button>

            <div class="hc-modal-tag">
                ${data.type}
            </div>

            <h3>
                ${data.icon}
                ${data.name}
            </h3>

            <p>
                ${data.country}
            </p>

            <div class="hc-modal-grid">

                <div>
                    <small>
                        INVENTORY
                    </small>

                    <strong>
                        ${data.inventory}
                    </strong>
                </div>

                <div>
                    <small>
                        ROUTES
                    </small>

                    <strong>
                        ${data.routes}
                    </strong>
                </div>

            </div>

            <div class="hc-modal-risk">
                NETWORK RISK

                <strong>
                    ${data.risk}
                </strong>
            </div>

        </div>

    `;


    addDynamicModalStyles();


    document.body.appendChild(
        modal
    );


    modal
        .querySelector(
            ".hc-modal-close"
        )
        .addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                modal.remove();

            }

        }
    );

}


/* =========================================================
   ROUTE MODAL
========================================================= */

function openRouteModal(
    data
) {

    removeDynamicModal();


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "hc-dynamic-modal";


    modal.innerHTML = `

        <div class="hc-modal-card">

            <button
                class="hc-modal-close"
            >
                ×
            </button>

            <div class="hc-modal-tag">
                LIVE SUPPLY ROUTE
            </div>

            <h3>
                ${data.from}
                →
                ${data.to}
            </h3>

            <p>
                ${data.cargo}
            </p>

            <div class="hc-modal-grid">

                <div>
                    <small>
                        CARGO
                    </small>

                    <strong>
                        ${data.units}
                    </strong>
                </div>

                <div>
                    <small>
                        ETA
                    </small>

                    <strong>
                        ${data.eta}
                    </strong>
                </div>

            </div>

            <div class="hc-modal-risk">
                ROUTE STATUS

                <strong>
                    ${data.risk}
                </strong>
            </div>

        </div>

    `;


    addDynamicModalStyles();


    document.body.appendChild(
        modal
    );


    modal
        .querySelector(
            ".hc-modal-close"
        )
        .addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                modal.remove();

            }

        }
    );

}


/* =========================================================
   MODAL STYLES
========================================================= */

function addDynamicModalStyles() {

    if (
        document.getElementById(
            "healthchainDynamicStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "healthchainDynamicStyles";


    style.textContent = `

        .hc-dynamic-modal {

            position:fixed;

            inset:0;

            z-index:999999;

            display:flex;

            align-items:center;

            justify-content:center;

            padding:20px;

            background:
                rgba(0,0,0,.72);

            backdrop-filter:
                blur(12px);

        }


        .hc-modal-card {

            position:relative;

            width:min(450px,100%);

            padding:30px;

            border-radius:22px;

            background:
                rgba(5,15,27,.98);

            border:
                1px solid
                rgba(0,217,255,.22);

            box-shadow:
                0 30px 100px
                rgba(0,0,0,.7);

            color:white;

        }


        .hc-modal-close {

            position:absolute;

            top:15px;

            right:15px;

            width:34px;

            height:34px;

            border-radius:50%;

            border:
                1px solid
                rgba(255,255,255,.12);

            background:
                rgba(255,255,255,.05);

            color:white;

            cursor:pointer;

            font-size:20px;

        }


        .hc-modal-tag {

            color:#00d9ff;

            font-size:9px;

            letter-spacing:2px;

            font-weight:800;

        }


        .hc-modal-card h3 {

            margin:
                8px 0 4px;

            font-size:27px;

        }


        .hc-modal-card p {

            margin:0;

            color:#8095a5;

        }


        .hc-modal-grid {

            display:grid;

            grid-template-columns:
                1fr 1fr;

            gap:10px;

            margin-top:22px;

        }


        .hc-modal-grid div {

            padding:16px;

            border-radius:14px;

            background:
                rgba(255,255,255,.04);

        }


        .hc-modal-grid small {

            display:block;

            color:#718797;

            font-size:8px;

            letter-spacing:1px;

        }


        .hc-modal-grid strong {

            display:block;

            margin-top:5px;

            font-size:23px;

        }


        .hc-modal-risk {

            display:flex;

            justify-content:space-between;

            margin-top:10px;

            padding:15px;

            border-radius:14px;

            background:
                rgba(255,255,255,.04);

            color:#718797;

            font-size:9px;

            letter-spacing:1px;

        }


        .hc-modal-risk strong {

            color:#00f5a0;

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   REMOVE DYNAMIC MODAL
========================================================= */

function removeDynamicModal() {

    const modal =
        document.querySelector(
            ".hc-dynamic-modal"
        );


    if (
        modal
    ) {

        modal.remove();

    }

}


/* =========================================================
   BUTTONS
========================================================= */
function initializeButtons() {

    /* =====================================================
       SIMULATE CRISIS — HERO BUTTON
    ===================================================== */

    const simulateCrisisBtn =
        document.getElementById(
            "simulateCrisisBtn"
        );

    if (simulateCrisisBtn) {

        simulateCrisisBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                runFullCrisisSimulation();

            }
        );

    }


    /* =====================================================
       CRISIS SIMULATION — SECTION BUTTON
    ===================================================== */

    const crisisButton =
        document.getElementById(
            "crisisButton"
        );

    if (crisisButton) {

        crisisButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                runFullCrisisSimulation();

            }
        );

    }


    /* =====================================================
       GLOBAL VIEW
    ===================================================== */

    const globalViewBtn =
        document.getElementById(
            "globalViewBtn"
        );

    if (globalViewBtn) {

        globalViewBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                indiaMode = false;

                setActiveGlobeButton(
                    globalViewBtn
                );

                rotateToGlobal();

            }
        );

    }


    /* =====================================================
       INDIA VIEW
    ===================================================== */

    const indiaViewBtn =
        document.getElementById(
            "indiaViewBtn"
        );

    if (indiaViewBtn) {

        indiaViewBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                indiaMode = true;

                setActiveGlobeButton(
                    indiaViewBtn
                );

                focusIndia();

            }
        );

    }


    /* =====================================================
       EXPLORE NETWORK
    ===================================================== */

    document
        .querySelectorAll(
            "a[href='#network']"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        setTimeout(
                            () => {

                                if (
                                    typeof resizeDigitalTwin ===
                                    "function"
                                ) {

                                    resizeDigitalTwin();

                                }

                            },
                            500
                        );

                    }
                );

            }
        );

}

function setActiveGlobeButton(
    activeButton
) {

    document
        .querySelectorAll(
            ".globe-control"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    activeButton.classList.add(
        "active"
    );

}


/* =========================================================
   NETWORK CONTROLS
========================================================= */

function initializeNetworkControls() {

    const autoRotate =
        document.getElementById(
            "autoRotateToggle"
        );


    const routeAnimation =
        document.getElementById(
            "routeAnimationToggle"
        );


    const particles =
        document.getElementById(
            "particleToggle"
        );


    const glow =
        document.getElementById(
            "glowToggle"
        );


    if (
        autoRotate
    ) {

        autoRotate.addEventListener(
            "change",
            () => {

                autoRotateEnabled =
                    autoRotate.checked;

            }
        );

    }


    if (
        routeAnimation
    ) {

        routeAnimation.addEventListener(
            "change",
            () => {

                routeAnimationEnabled =
                    routeAnimation.checked;

            }
        );

    }


    if (
        particles
    ) {

        particles.addEventListener(
            "change",
            () => {

                particleEnabled =
                    particles.checked;

            }
        );

    }


    if (
        glow
    ) {

        glow.addEventListener(
            "change",
            () => {

                glowEnabled =
                    glow.checked;

            }
        );

    }

}


/* =========================================================
   CRISIS SIMULATION
========================================================= */
async function runFullCrisisSimulation() {

    if (crisisRunning) {
        return;
    }

    healthChainAIState.crisisActive = true;

healthChainAIState.crisisProgress = 0;

healthChainAIState.affectedLocation = "Kolkata";

healthChainAIState.affectedRoute =
    "Mumbai → Kolkata";

healthChainAIState.alternateRoute =
    "Mumbai → Bengaluru";

healthChainAIState.riskLevel = "ELEVATED";

healthChainAIState.inventoryRisk = "RISING";

healthChainAIState.recommendedAction =
    "Monitor the Mumbai → Kolkata corridor and prepare alternate routing.";

    crisisRunning = true;

    healthChainAIState.crisisActive = true;

healthChainAIState.riskLevel =
    "ELEVATED";

healthChainAIState.inventoryRisk =
    "RISING";

    console.log("🚨 CRISIS SIMULATION STARTED");

    /* =====================================================
       GET UI ELEMENTS
    ===================================================== */

    const terminal =
        document.getElementById(
            "simulationTerminal"
        );

    const overlay =
        document.getElementById(
            "crisisOverlay"
        );

    const progressBar =
        document.getElementById(
            "crisisProgressBar"
        );

    const status =
        document.getElementById(
            "crisisStatus"
        );

    const message =
        document.getElementById(
            "crisisMessage"
        );


    /* =====================================================
       OPEN CRISIS OVERLAY
    ===================================================== */

    if (overlay) {
        overlay.classList.add("show");
    }


    /* =====================================================
       RESET TERMINAL
    ===================================================== */

    if (terminal) {
        terminal.innerHTML = "";
    }


    /* =====================================================
       RESET PROGRESS
    ===================================================== */

    if (progressBar) {
        progressBar.style.width = "0%";
    }


    /* =====================================================
       CRISIS STEPS
    ===================================================== */

    const steps = [

        {
            progress: 5,
            type: "SYSTEM",
            status: "NETWORK SCAN",
            message:
                "AI is scanning the global healthcare supply network...",
            terminal:
                "284 healthcare nodes online.",
            color: "green"
        },

        {
            progress: 18,
            type: "AI",
            status: "MONITORING",
            message:
                "Supply-chain conditions are being continuously evaluated.",
            terminal:
                "Demand, inventory and route telemetry analyzed.",
            color: "blue"
        },

        {
            progress: 32,
            type: "ALERT",
            status: "DISRUPTION DETECTED",
            message:
                "Critical disruption detected on Mumbai → Kolkata corridor.",
            terminal:
                "⚠ Mumbai → Kolkata route disruption detected.",
            color: "red"
        },

        {
            progress: 45,
            type: "AI",
            status: "IMPACT ANALYSIS",
            message:
                "Kolkata medical inventory is approaching critical threshold.",
            terminal:
                "Kolkata inventory risk increasing.",
            color: "orange"
        },

        {
            progress: 58,
            type: "PREDICTION",
            status: "SHORTAGE PREDICTED",
            message:
                "AI predicts a critical medical-supply shortage within 18 hours.",
            terminal:
                "Shortage probability exceeds safe threshold.",
            color: "orange"
        },

        {
            progress: 70,
            type: "ORCHESTRATOR",
            status: "OPTIMIZING",
            message:
                "AI is evaluating alternate supply corridors.",
            terminal:
                "Searching resilient alternate routes...",
            color: "blue"
        },

        {
            progress: 82,
            type: "AI",
            status: "REROUTING",
            message:
                "Emergency Mumbai → Bengaluru corridor selected.",
            terminal:
                "✓ Emergency route activated.",
            color: "green"
        },

        {
            progress: 92,
            type: "SYSTEM",
            status: "RESOURCE REALLOCATION",
            message:
                "Critical medical resources are being redirected.",
            terminal:
                "✓ Medical inventory reallocated.",
            color: "green"
        },

        {
            progress: 100,
            type: "RECOVERY",
            status: "CRISIS CONTAINED",
            message:
                "Healthcare continuity protected. Network resilience restored.",
            terminal:
                "✓ CRISIS CONTAINED — NETWORK RESILIENCE RESTORED.",
            color: "green"
        }

    ];


    /* =====================================================
       EXECUTE SIMULATION
    ===================================================== */

    for (
        let i = 0;
        i < steps.length;
        i++
    ) {

        const step =
            steps[i];

        healthChainAIState.crisisProgress =
            step.progress;

        updateAICommandCenter();

    /* =====================================================
   LIVE AI CRISIS INTELLIGENCE
===================================================== */

const aiStage =
    getAIStage(step.progress);

if (
    aiStage !== null &&
    aiStage !== lastAIStage
) {

    lastAIStage = aiStage;

    generateLiveAIInsight(
        aiStage
    );

}

    /* =====================================================
   AI LIVE STAGE TRIGGER
===================================================== */

const aiStages = [
    0,
    32,
    58,
    70,
    82,
    100
];

const currentAIStage =
    aiStages
        .filter(
            value =>
                step.progress >= value
        )
        .pop();

if (
    currentAIStage !== undefined &&
    currentAIStage !== lastAIBriefingStage
) {

    generateLiveAIBriefing(
        currentAIStage
    );

}

if (step.progress >= 32) {

    healthChainAIState.riskLevel =
        "HIGH";

    healthChainAIState.inventoryRisk =
        "CRITICAL";

    healthChainAIState.recommendedAction =
        "Activate alternate supply corridor.";

}

if (step.progress >= 70) {

    healthChainAIState.recommendedAction =
        "Redirect emergency inventory through Bengaluru.";

        requestAICommand();

}

            healthChainAIState.crisisProgress =
    step.progress;


        /* -----------------------------
           UPDATE STATUS
        ----------------------------- */

        if (status) {
            status.textContent =
                step.status;
        }


        /* -----------------------------
           UPDATE MESSAGE
        ----------------------------- */

        if (message) {
            message.textContent =
                step.message;
        }


        /* -----------------------------
           UPDATE PROGRESS
        ----------------------------- */

        if (progressBar) {

            progressBar.style.width =
                step.progress +
                "%";

        }


        /* -----------------------------
           TERMINAL
        ----------------------------- */

        addTerminalMessage(
            step.type,
            step.terminal,
            step.color
        );


        /* -----------------------------
           GLOBE CRISIS
        ----------------------------- */

        updateGlobeCrisisState(
            step.progress / 100
        );

        await wait(
            750
        );

    }



    /* =====================================================
       FINAL RECOVERY
    ===================================================== */

    updateRecoveryState();

    healthChainAIState.crisisActive = false;
    healthChainAIState.crisisProgress = 100;
    healthChainAIState.riskLevel = "RECOVERED";
    healthChainAIState.inventoryRisk = "STABLE";
    healthChainAIState.recommendedAction =
        "Continue monitoring the network.";

    addTerminalMessage(
        "RECOVERY",
        "Healthcare supply network stabilized.",
        "green"
    );


    if (status) {
        status.textContent =
            "CRISIS CONTAINED";
    }


    if (message) {
        message.textContent =
            "Healthcare continuity protected.";
    }


    if (progressBar) {
        progressBar.style.width =
            "100%";
    }


    await wait(
        2000
    );


    /* =====================================================
       CLOSE OVERLAY
    ===================================================== */

    if (overlay) {
        overlay.classList.remove(
            "show"
        );
    }


    crisisRunning =
        false;


    console.log(
        "✅ CRISIS SIMULATION COMPLETE"
    );
}

/* =========================================================
   TERMINAL MESSAGE
========================================================= */

function addTerminalMessage(
    type,
    message,
    color
) {

    const terminal =
        document.getElementById(
            "simulationTerminal"
        );


    if (
        !terminal
    ) {

        return;

    }


    const row =
        document.createElement(
            "div"
        );


    const time =
        new Date()
            .toLocaleTimeString(
                "en-GB"
            );


    row.innerHTML = `

        <span class="terminal-time">
            ${time}
        </span>

        <span
            class="terminal-${color}"
        >
            ${type}
        </span>

        ${message}

    `;


    terminal.appendChild(
        row
    );


    terminal.scrollTop =
        terminal.scrollHeight;

}


/* =========================================================
   CRISIS GLOBE STATE
========================================================= */

function updateGlobeCrisisState(
    progress
) {

    const kolkata =
        healthcareNodes.find(
            node =>
                node.data.name ===
                "Kolkata"
        );


    if (
        kolkata
    ) {

        kolkata.core.material.color.setHex(
            CONFIG.colors.red
        );


        kolkata.ring.material.color.setHex(
            CONFIG.colors.red
        );


        kolkata.glow.material.color.setHex(
            CONFIG.colors.red
        );


        if (
            glowEnabled
        ) {

            const scale =
                1 +
                progress *
                1.8;


            kolkata.glow.scale.set(
                scale,
                scale,
                scale
            );

        }

    }


    routeObjects.forEach(
        route => {

            const data =
                route.userData.data;


            if (
                data.from ===
                "Mumbai" &&
                data.to ===
                "Kolkata"
            ) {

                route.material.color.setHex(
                    CONFIG.colors.red
                );


                route.material.opacity =
                    0.95;

            }

        }
    );


    if (
        progress >
        0.35
    ) {

        createEmergencyRoute();

    }

}


/* =========================================================
   EMERGENCY ROUTE
========================================================= */

function createEmergencyRoute() {

    if (
        emergencyRoute
    ) {

        return;

    }


    const from =
        NODE_DATA.find(
            node =>
                node.name ===
                "Mumbai"
        );


    const to =
        NODE_DATA.find(
            node =>
                node.name ===
                "Bengaluru"
        );


    if (
        !from ||
        !to
    ) {

        return;

    }


    const start =
        latLonToVector3(

            from.lat,

            from.lon,

            CONFIG.earthRadius +
            0.13

        );


    const end =
        latLonToVector3(

            to.lat,

            to.lon,

            CONFIG.earthRadius +
            0.13

        );


    const midpoint =
        start
            .clone()
            .add(end)
            .normalize()
            .multiplyScalar(
                CONFIG.earthRadius +
                1.05
            );


    const curve =
        new THREE.QuadraticBezierCurve3(

            start,

            midpoint,

            end

        );


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                curve.getPoints(
                    100
                )
            );


    const material =
        new THREE.LineBasicMaterial({

            color:
                CONFIG.colors.green,

            transparent:
                true,

            opacity:
                0.95

        });


    emergencyRoute =
        new THREE.Line(
            geometry,
            material
        );


    routesGroup.add(
        emergencyRoute
    );

}


/* =========================================================
   RECOVERY
========================================================= */

function updateRecoveryState() {

    routeObjects.forEach(
        route => {

            const data =
                route.userData.data;


            route.material.color.setHex(
                getRouteColor(
                    data.risk
                )
            );


            route.material.opacity =
                data.risk ===
                "MEDIUM"
                    ? 0.30
                    : 0.42;

        }
    );


    if (
        emergencyRoute
    ) {

        emergencyRoute.material.color.setHex(
            CONFIG.colors.green
        );

        emergencyRoute.material.opacity =
            0.95;

    }


    const kolkata =
        healthcareNodes.find(
            node =>
                node.data.name ===
                "Kolkata"
        );


    if (
        kolkata
    ) {

        kolkata.core.material.color.setHex(
            CONFIG.colors.red
        );

        kolkata.ring.material.color.setHex(
            CONFIG.colors.red
        );

        kolkata.glow.material.color.setHex(
            CONFIG.colors.red
        );

    }

}


/* =========================================================
   WAIT
========================================================= */

function wait(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================================
   DIGITAL TWIN
========================================================= */

function initializeDigitalTwin() {

    twinContainer =
        document.getElementById(
            "network-globe"
        );


    if (
        !twinContainer
    ) {

        console.warn(
            "Digital Twin container not found."
        );

        return;

    }


    if (
        typeof THREE ===
        "undefined"
    ) {

        return;

    }


    if (
        twinInitialized
    ) {

        resizeDigitalTwin();

        return;

    }


    twinInitialized =
        true;


    const width =
        Math.max(
            twinContainer.clientWidth,
            400
        );


    const height =
        Math.max(
            twinContainer.clientHeight,
            420
        );


    twinScene =
        new THREE.Scene();


    twinCamera =
        new THREE.PerspectiveCamera(

            40,

            width /
            height,

            0.1,

            100

        );


    twinCamera.position.set(
        0,
        0,
        4.6
    );


    twinRenderer =
        new THREE.WebGLRenderer({

            antialias:
                true,

            alpha:
                true

        });


    twinRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    twinRenderer.setSize(
        width,
        height
    );


    if (
        "outputColorSpace"
        in twinRenderer
    ) {

        twinRenderer.outputColorSpace =
            THREE.SRGBColorSpace;

    }


    twinRenderer.setClearColor(
        0x000000,
        0
    );


    twinRenderer.domElement.style.width =
        "100%";


    twinRenderer.domElement.style.height =
        "100%";


    twinRenderer.domElement.style.display =
        "block";


    twinRenderer.domElement.style.cursor =
        "grab";


    twinContainer.appendChild(
        twinRenderer.domElement
    );


    const ambient =
        new THREE.AmbientLight(
            0x4a7895,
            0.7
        );


    twinScene.add(
        ambient
    );


    const light =
        new THREE.PointLight(
            0x00d9ff,
            2,
            20
        );


    light.position.set(
        3,
        3,
        5
    );


    twinScene.add(
        light
    );


    createTwinEarth();

    createTwinNetwork();

    createTwinParticles();


    twinRenderer.domElement.addEventListener(
        "pointerdown",
        onTwinPointerDown
    );


    twinRenderer.domElement.addEventListener(
        "pointermove",
        onTwinPointerMove
    );


    twinRenderer.domElement.addEventListener(
        "pointerup",
        onTwinPointerUp
    );


    twinRenderer.domElement.addEventListener(
        "pointerleave",
        onTwinPointerUp
    );


    twinRenderer.domElement.addEventListener(
        "wheel",
        onTwinWheel,
        {
            passive:
                false
        }
    );


    window.addEventListener(
        "resize",
        resizeDigitalTwin
    );


    animateDigitalTwin();

}


/* =========================================================
   DIGITAL TWIN EARTH
========================================================= */

function createTwinEarth() {

    const group =
        new THREE.Group();


    twinGlobe =
        group;


    const radius =
        1.42;


    const geometry =
        new THREE.SphereGeometry(
            radius,
            64,
            64
        );


    const loader =
        new THREE.TextureLoader();


    loader.crossOrigin =
        "anonymous";


    const texture =
        loader.load(
            "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
        );


    const material =
        new THREE.MeshPhongMaterial({

            map:
                texture,

            color:
                0x8bd9ff,

            shininess:
                10

        });


    const earth =
        new THREE.Mesh(
            geometry,
            material
        );


    group.add(
        earth
    );


    const atmosphere =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                radius +
                0.08,
                48,
                48
            ),

            new THREE.MeshBasicMaterial({

                color:
                    CONFIG.colors.cyan,

                transparent:
                    true,

                opacity:
                    0.09,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending

            })

        );


    group.add(
        atmosphere
    );


    twinScene.add(
        group
    );

}


/* =========================================================
   DIGITAL TWIN NETWORK
========================================================= */

function createTwinNetwork() {

    twinNetwork =
        new THREE.Group();


    twinGlobe.add(
        twinNetwork
    );


    const radius =
        1.48;


    NODE_DATA.forEach(
        data => {

            const position =
                latLonToVector3(

                    data.lat,

                    data.lon,

                    radius

                );


            const color =
                getNodeColor(
                    data.risk
                );


            const geometry =
                new THREE.SphereGeometry(
                    0.035,
                    12,
                    12
                );


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        color

                });


            const node =
                new THREE.Mesh(
                    geometry,
                    material
                );


            node.position.copy(
                position
            );


            twinNetwork.add(
                node
            );

        }
    );


    ROUTE_DATA.forEach(
        route => {

            const from =
                NODE_DATA.find(
                    node =>
                        node.name ===
                        route.from
                );


            const to =
                NODE_DATA.find(
                    node =>
                        node.name ===
                        route.to
                );


            if (
                !from ||
                !to
            ) {

                return;

            }


            const start =
                latLonToVector3(

                    from.lat,

                    from.lon,

                    radius

                );


            const end =
                latLonToVector3(

                    to.lat,

                    to.lon,

                    radius

                );


            const midpoint =
                start
                    .clone()
                    .add(end)
                    .normalize()
                    .multiplyScalar(
                        radius +
                        0.25
                    );


            const curve =
                new THREE.QuadraticBezierCurve3(

                    start,

                    midpoint,

                    end

                );


            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(
                        curve.getPoints(
                            40
                        )
                    );


            const material =
                new THREE.LineBasicMaterial({

                    color:
                        CONFIG.colors.cyan,

                    transparent:
                        true,

                    opacity:
                        0.45

                });


            const routeLine =
    new THREE.Line(
        geometry,
        material
    );

twinNetwork.add(
    routeLine
);

        }
    );

}


/* =========================================================
   DIGITAL TWIN PARTICLES
========================================================= */

function createTwinParticles() {

    twinParticles =
        new THREE.Group();


    twinGlobe.add(
        twinParticles
    );


    for (
        let i = 0;
        i < 80;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            1.6 +
            Math.random() *
            0.35;


        const y =
            (
                Math.random() -
                0.5
            ) *
            2.8;


        const x =
            Math.cos(angle) *
            radius;


        const z =
            Math.sin(angle) *
            radius;


        const particle =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.012,
                    8,
                    8
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        CONFIG.colors.cyan,

                    transparent:
                        true,

                    opacity:
                        0.55

                })

            );


        particle.position.set(
            x,
            y,
            z
        );


        twinParticles.add(
            particle
        );

    }

}


/* =========================================================
   DIGITAL TWIN POINTER DOWN
========================================================= */

function onTwinPointerDown(
    event
) {

    twinDragging =
        true;


    twinPreviousX =
        event.clientX;


    twinPreviousY =
        event.clientY;


    if (
        twinRenderer
    ) {

        twinRenderer.domElement.style.cursor =
            "grabbing";

    }

}


/* =========================================================
   DIGITAL TWIN POINTER MOVE
========================================================= */

function onTwinPointerMove(
    event
) {

    if (
        !twinDragging ||
        !twinGlobe
    ) {

        return;

    }


    const dx =
        event.clientX -
        twinPreviousX;


    const dy =
        event.clientY -
        twinPreviousY;


    twinGlobe.rotation.y +=
        dx *
        0.006;


    twinGlobe.rotation.x +=
        dy *
        0.004;


    twinGlobe.rotation.x =
        THREE.MathUtils.clamp(

            twinGlobe.rotation.x,

            -0.8,

            0.8

        );


    twinRotationVelocity =
        dx *
        0.002;


    twinPreviousX =
        event.clientX;


    twinPreviousY =
        event.clientY;

}


/* =========================================================
   DIGITAL TWIN POINTER UP
========================================================= */

function onTwinPointerUp() {

    twinDragging =
        false;


    if (
        twinRenderer
    ) {

        twinRenderer.domElement.style.cursor =
            "grab";

    }

}


/* =========================================================
   DIGITAL TWIN ZOOM
========================================================= */

function onTwinWheel(
    event
) {

    event.preventDefault();


    if (
        !twinCamera
    ) {

        return;

    }


    twinCamera.position.z +=
        event.deltaY *
        0.002;


    twinCamera.position.z =
        THREE.MathUtils.clamp(

            twinCamera.position.z,

            3.2,

            6.0

        );

}


/* =========================================================
   DIGITAL TWIN ANIMATION
========================================================= */

function animateDigitalTwin() {

    requestAnimationFrame(
        animateDigitalTwin
    );


    if (
        !twinRenderer ||
        !twinScene ||
        !twinCamera
    ) {

        return;

    }


    if (
        twinGlobe &&
        !twinDragging
    ) {

        twinGlobe.rotation.y +=
            0.001;


        twinGlobe.rotation.y +=
            twinRotationVelocity;


        twinRotationVelocity *=
            0.96;

    }


    if (
        twinParticles
    ) {

        twinParticles.rotation.y +=
            0.0007;

    }


    twinRenderer.render(

        twinScene,

        twinCamera

    );

}


/* =========================================================
   DIGITAL TWIN RESIZE
========================================================= */

function resizeDigitalTwin() {

    if (
        !twinContainer ||
        !twinRenderer ||
        !twinCamera
    ) {

        return;

    }


    const width =
        Math.max(
            twinContainer.clientWidth,
            1
        );


    const height =
        Math.max(
            twinContainer.clientHeight,
            1
        );


    twinCamera.aspect =
        width /
        height;


    twinCamera.updateProjectionMatrix();


    twinRenderer.setSize(
        width,
        height,
        false
    );

}


/* =========================================================
   MAIN ANIMATION
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    if (
        !renderer ||
        !scene ||
        !camera
    ) {

        return;

    }


    /* =====================================================
       NATURAL EARTH ROTATION
    ===================================================== */

    if (
        globeGroup &&
        autoRotateEnabled &&
        !isDragging
    ) {

        globeGroup.rotation.y +=
            CONFIG.autoRotateSpeed;

    }


    /* =====================================================
       DRAG INERTIA
    ===================================================== */

    if (
        globeGroup &&
        !isDragging
    ) {

        globeGroup.rotation.y +=
            rotationVelocity.y;


        globeGroup.rotation.x +=
            rotationVelocity.x;


        rotationVelocity.x *=
            0.94;


        rotationVelocity.y *=
            0.94;


        globeGroup.rotation.x =
            THREE.MathUtils.clamp(

                globeGroup.rotation.x,

                -0.9,

                0.9

            );

    }


    /* =====================================================
       CLOUDS
    ===================================================== */

    if (
        cloudMesh
    ) {

        cloudMesh.rotation.y +=
            0.00045;

    }


    /* =====================================================
       NIGHT LIGHTS
    ===================================================== */

    if (
        nightMesh
    ) {

        nightMesh.rotation.y +=
            0.0003;

    }


    /* =====================================================
       STARS
    ===================================================== */

    if (
        starField
    ) {

        starField.rotation.y +=
            0.00002;

    }


    /* =====================================================
       INDIA PULSE
    ===================================================== */

    if (
        indiaMarker &&
        indiaGlow
    ) {

        const pulse =
            (
                Math.sin(
                    Date.now() *
                    0.004
                ) +
                1
            ) /
            2;


        const markerScale =
            1 +
            pulse *
            0.5;


        indiaMarker.scale.set(
            markerScale,
            markerScale,
            markerScale
        );


        const glowScale =
            1 +
            pulse *
            0.9;


        indiaGlow.scale.set(
            glowScale,
            glowScale,
            glowScale
        );


        if (
            glowEnabled
        ) {

            indiaGlow.material.opacity =
                0.12 +
                pulse *
                0.25;

        }
        else {

            indiaGlow.material.opacity =
                0;

        }

    }


    /* =====================================================
       NODE PULSE
    ===================================================== */

    healthcareNodes.forEach(
        node => {

            const pulse =
                (
                    Math.sin(

                        Date.now() *
                        CONFIG.nodePulseSpeed +

                        node.index *
                        0.65

                    ) +
                    1
                ) /
                2;


            const ringScale =
                1 +
                pulse *
                0.45;


            node.ring.scale.set(
                ringScale,
                ringScale,
                ringScale
            );


            if (
                glowEnabled
            ) {

                node.glow.material.opacity =
                    0.10 +
                    pulse *
                    0.20;

            }
            else {

                node.glow.material.opacity =
                    0;

            }

        }
    );


    /* =====================================================
       ROUTE ANIMATION
    ===================================================== */

    if (
        routeAnimationEnabled
    ) {

        routeObjects.forEach(
            route => {

                if (
                    route.material
                ) {

                    const data =
                        route.userData.data;


                    const pulse =
                        (
                            Math.sin(
                                Date.now() *
                                0.002
                            ) +
                            1
                        ) /
                        2;


                    route.material.opacity =
                        (
                            data.risk ===
                            "MEDIUM"
                                ? 0.22
                                : 0.32
                        ) +
                        pulse *
                        0.12;

                }

            }
        );

    }


    /* =====================================================
       MOVING SHIPMENTS
    ===================================================== */

    shipmentObjects.forEach(
        shipment => {

            if (
                !particleEnabled
            ) {

                shipment.visible =
                    false;

                return;

            }


            shipment.visible =
                true;


            const curve =
                shipment.userData.curve;


            shipment.userData.progress +=
                CONFIG.shipmentSpeed;


            if (
                shipment.userData.progress >
                1
            ) {

                shipment.userData.progress =
                    0;

            }


            const position =
                curve.getPoint(
                    shipment.userData.progress
                );


            shipment.position.copy(
                position
            );

        }
    );


    /* =====================================================
       RENDER
    ===================================================== */

    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   RESIZE MAIN GLOBE
========================================================= */

function resizeGlobe() {

    const container =
        document.getElementById(
            "globe-container"
        );


    if (
        !container ||
        !renderer ||
        !camera
    ) {

        return;

    }


    const width =
        Math.max(
            container.clientWidth,
            1
        );


    const height =
        Math.max(
            container.clientHeight,
            1
        );


    camera.aspect =
        width /
        height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height,
        false
    );


    resizeDigitalTwin();

}


/* =========================================================
   MODAL INITIALIZATION
========================================================= */

function initializeModal() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                removeDynamicModal();


                const india =
                    document.getElementById(
                        "indiaNetworkPanel"
                    );


                if (
                    india
                ) {

                    india.remove();

                }

            }

        }
    );

}


/* =========================================================
   SCROLL ANIMATIONS
========================================================= */

function initializeScrollAnimations() {

    const elements =
        document.querySelectorAll(

            `
            .section-heading,
            .impact-card,
            .alert-row,
            .network-map-card,
            .network-side,
            .crisis-content,
            .crisis-terminal
            `

        );


    if (
        !elements.length
    ) {

        return;

    }


    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            entry.target.style.opacity =
                                "1";


                            entry.target.style.transform =
                                "translateY(0)";


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold:
                    0.12

            }

        );


    elements.forEach(
        element => {

            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(25px)";


            element.style.transition =
                "opacity .7s ease, transform .7s ease";


            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   COUNTERS
========================================================= */

function initializeCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    if (
        !counters.length
    ) {

        return;

    }


    counters.forEach(
        counter => {

            const target =
                parseFloat(
                    counter.dataset.counter
                );


            if (
                Number.isNaN(
                    target
                )
            ) {

                return;

            }


            counter.textContent =
                "0";


            animateCounter(
                counter,
                target
            );

        }
    );

}


/* =========================================================
   COUNTER ANIMATION
========================================================= */

function animateCounter(
    element,
    target
) {

    const startTime =
        performance.now();


    const duration =
        1500;


    function update(
        time
    ) {

        const progress =
            Math.min(

                (
                    time -
                    startTime
                ) /
                duration,

                1

            );


        const eased =
            1 -
            Math.pow(
                1 -
                progress,
                3
            );


        const value =
            target *
            eased;


        if (
            element.dataset.decimal ===
            "true"
        ) {

            element.textContent =
                value.toFixed(
                    1
                );

        }
        else {

            element.textContent =
                Math.round(
                    value
                ).toLocaleString();

        }


        if (
            progress <
            1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   GLOBAL SAFETY EVENTS
========================================================= */

window.addEventListener(
    "resize",
    () => {

        resizeGlobe();

        resizeDigitalTwin();

    }
);


/* =========================================================
   STARTUP LOG
========================================================= */

console.log(
    "%c HEALTHCHAIN 360 ",
    "background:#00d9ff;color:#001018;font-weight:900;padding:6px 10px;border-radius:6px;"
);


console.log(
    "%c Smart Health • Resilient Supply Chain ",
    "color:#00f5a0;font-weight:800;"
);


console.log(
    "3D Health Network initialized."
);

/* =========================================================
   HEALTHCHAIN AI CHAT ENGINE
========================================================= */

let hcConversationHistory = [];

function initializeHealthChainAI() {

    const launcher =
        document.getElementById("hcAiLauncher");

    const chat =
        document.getElementById("hcAiChat");

    const closeButton =
        document.getElementById("hcAiClose");

    const input =
        document.getElementById("hcAiInput");

    const sendButton =
        document.getElementById("hcAiSend");

    const messages =
        document.getElementById("hcAiMessages");


    if (
        !launcher ||
        !chat ||
        !input ||
        !sendButton ||
        !messages
    ) {
        console.warn(
            "HealthChain AI chat elements not found."
        );

        return;
    }


    /* OPEN */

    launcher.addEventListener(
        "click",
        () => {

            chat.classList.add("open");

            chat.setAttribute(
                "aria-hidden",
                "false"
            );

            setTimeout(
                () => input.focus(),
                200
            );

        }
    );


    /* CLOSE */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                chat.classList.remove(
                    "open"
                );

                chat.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }
        );

    }


    /* SEND */

    async function sendMessage() {

    const question =
        input.value.trim();


    if (!question) {
        return;
    }


    addHCUserMessage(
        question
    );


    input.value = "";


    showHCTyping();


    try {

        const response =
            await fetch(
                "/api/chat",
                {

                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            message:
                                question,

                            history:
                                hcConversationHistory,

                            systemState:
                                healthChainAIState

                        })

                }
            );


        const data =
            await response.json();


        removeHCTyping();


        if (
            !response.ok
        ) {

            throw new Error(
                data.error ||
                "AI request failed."
            );

        }


        addHCBotMessage(
            data.answer
        );


        /*
         * SAVE CONVERSATION
         */

        hcConversationHistory.push({

            role:
                "user",

            content:
                question

        });


        hcConversationHistory.push({

            role:
                "assistant",

            content:
                data.answer

        });


    } catch (error) {

        console.error(
            "HealthChain AI:",
            error
        );


        removeHCTyping();


        addHCBotMessage(

            "I'm temporarily unable to reach " +
            "the AI intelligence engine. " +
            "Please check that the HealthChain " +
            "AI server is running."

        );

    }

}


    sendButton.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* QUICK QUESTIONS */

    document
        .querySelectorAll(
            ".hc-quick-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        input.value =
                            button.dataset.question;

                        sendMessage();

                    }
                );

            }
        );

}


/* =========================================================
   USER MESSAGE
========================================================= */

function addHCUserMessage(text) {

    const messages =
        document.getElementById(
            "hcAiMessages"
        );

    if (!messages) {
        return;
    }


    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "hc-ai-message user";


    wrapper.innerHTML = `

        <div class="hc-message-avatar">
            <i class="fa-solid fa-user"></i>
        </div>

        <div class="hc-message-content">

            <span class="hc-message-name">
                You
            </span>

            <p></p>

        </div>

    `;


    wrapper
        .querySelector("p")
        .textContent =
        text;


    messages.appendChild(
        wrapper
    );

    scrollHCChat();

}


/* =========================================================
   BOT MESSAGE
========================================================= */

function addHCBotMessage(text) {

    const messages =
        document.getElementById(
            "hcAiMessages"
        );

    if (!messages) {
        return;
    }


    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "hc-ai-message bot";


    wrapper.innerHTML = `

        <div class="hc-message-avatar">
            <i class="fa-solid fa-brain"></i>
        </div>

        <div class="hc-message-content">

            <span class="hc-message-name">
                HealthChain AI
            </span>

            <p></p>

        </div>

    `;


    wrapper
        .querySelector("p")
        .textContent =
        text;


    messages.appendChild(
        wrapper
    );

    scrollHCChat();

}


/* =========================================================
   TYPING
========================================================= */

function showHCTyping() {

    const messages =
        document.getElementById(
            "hcAiMessages"
        );

    if (!messages) {
        return;
    }


    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.id =
        "hcTypingMessage";

    wrapper.className =
        "hc-ai-message bot";


    wrapper.innerHTML = `

        <div class="hc-message-avatar">
            <i class="fa-solid fa-brain"></i>
        </div>

        <div class="hc-message-content">

            <span class="hc-message-name">
                HealthChain AI
            </span>

            <div class="hc-typing">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    `;


    messages.appendChild(
        wrapper
    );

    scrollHCChat();

}


/* =========================================================
   REMOVE TYPING
========================================================= */

function removeHCTyping() {

    const typing =
        document.getElementById(
            "hcTypingMessage"
        );

    if (typing) {
        typing.remove();
    }

}


/* =========================================================
   SCROLL
========================================================= */

function scrollHCChat() {

    const messages =
        document.getElementById(
            "hcAiMessages"
        );

    if (!messages) {
        return;
    }


    messages.scrollTo({

        top:
            messages.scrollHeight,

        behavior:
            "smooth"

    });

}


/* =========================================================
   HEALTHCHAIN AI
========================================================= */

function generateHCAnswer(question) {

    const q =
        question
            .toLowerCase()
            .trim();


    /* KOLKATA */

    if (
        q.includes("kolkata") &&
        (
            q.includes("risk") ||
            q.includes("status") ||
            q.includes("happening")
        )
    ) {

        if (
            healthChainAIState.crisisActive
        ) {

            return (
                "⚠ LIVE CRISIS UPDATE\n\n" +

                "Kolkata is currently at " +
                healthChainAIState.riskLevel +
                " risk.\n\n" +

                "Affected corridor: " +
                healthChainAIState.affectedRoute +
                "\n\n" +

                "Inventory risk: " +
                healthChainAIState.inventoryRisk +
                "\n\n" +

                "Recommendation: " +
                healthChainAIState.recommendedAction
            );

        }


        return (
            "Kolkata is currently being monitored " +
            "as a high-priority healthcare node. " +
            "No active crisis is currently running."
        );

    }


    /* CRISIS */

    if (
        q.includes("crisis") ||
        q.includes("disruption") ||
        q.includes("emergency")
    ) {

        if (
            healthChainAIState.crisisActive
        ) {

            return (
                "⚠ A simulated supply-chain crisis " +
                "is currently active.\n\n" +

                "Affected route: " +
                healthChainAIState.affectedRoute +
                "\n\n" +

                "AI response: " +
                healthChainAIState.recommendedAction
            );

        }


        return (
            "No active crisis is running. " +
            "Click Simulate Crisis to demonstrate " +
            "AI disruption detection, prediction, " +
            "rerouting and recovery."
        );

    }


    /* RECOMMENDATION */

    if (
        q.includes("recommend") ||
        q.includes("what should") ||
        q.includes("what do")
    ) {

        return (
            "Current HealthChain recommendation:\n\n" +
            healthChainAIState.recommendedAction
        );

    }


    /* ALTERNATE ROUTE */

    if (
        q.includes("alternate") ||
        q.includes("alternative") ||
        q.includes("reroute")
    ) {

        return (
            "The recommended alternate corridor is " +
            healthChainAIState.alternateRoute +
            ". This route can be activated when " +
            "the primary corridor becomes unreliable."
        );

    }


    /* INVENTORY */

    if (
        q.includes("inventory") ||
        q.includes("stock")
    ) {

        return (
            "Current inventory risk status: " +
            healthChainAIState.inventoryRisk +
            ". HealthChain continuously compares " +
            "available medical inventory against " +
            "demand and safety thresholds."
        );

    }


    /* NETWORK */

    if (
        q.includes("network") ||
        q.includes("route")
    ) {

        return (
            "HealthChain connects hospitals, warehouses " +
            "and supply corridors. The 3D globe shows " +
            "these relationships while the AI evaluates " +
            "risk, inventory pressure and alternate routes."
        );

    }


    /* RESILIENCE */

    if (
        q.includes("resilience") ||
        q.includes("resilient")
    ) {

        return (
            "Supply-chain resilience means maintaining " +
            "healthcare continuity despite disruptions. " +
            "HealthChain achieves this through early " +
            "detection, prediction, alternate routing " +
            "and resource reallocation."
        );

    }


    /* INDIA */

    if (
        q.includes("india") ||
        q.includes("indian")
    ) {

        return (
            "India is a major healthcare network region " +
            "in HealthChain. The India view focuses the " +
            "3D visualization on Indian healthcare nodes " +
            "and supply corridors."
        );

    }


    /* GREETING */

    if (
        q.includes("hi") ||
        q.includes("hello") ||
        q.includes("hey")
    ) {

        return (
            "Hello! I'm HealthChain AI. " +
            "Ask me about Kolkata risk, inventory, " +
            "routes, crisis response or resilience."
        );

    }


    /* DEFAULT */

    return (
        "I can analyze the HealthChain network. " +
        "Try asking:\n\n" +

        "• What is happening in Kolkata?\n" +
        "• What is the current crisis?\n" +
        "• What should we do?\n" +
        "• Which alternate route should we use?\n" +
        "• What is the inventory risk?"
    );

}


/* =========================================================
   INITIALIZE CHAT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeHealthChainAI();

    }
);

/* =========================================================
   HEALTHCHAIN LIVE AI BRIEFING
========================================================= */

let lastAIBriefingStage = -1;
let aiBriefingRunning = false;

async function generateLiveAIBriefing(stage) {

    if (aiBriefingRunning) {
        return;
    }

    if (stage === lastAIBriefingStage) {
        return;
    }

    lastAIBriefingStage = stage;
    aiBriefingRunning = true;

    const stageNames = {
        0: "CRISIS DETECTED",
        32: "RISK ESCALATION",
        58: "SUPPLY PRESSURE",
        70: "REROUTING",
        82: "RECOVERY",
        100: "RECOVERY COMPLETE"
    };

    const stageName =
        stageNames[stage] ||
        "NETWORK UPDATE";

    try {

        const response = await fetch(
            "/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    message:
                        `Generate a short operational AI briefing for the current HealthChain stage.

Stage:
${stageName}

Progress:
${stage}%

Explain:
1. What is happening
2. Current risk
3. Recommended action

Keep it under 60 words and make it suitable for a live command-center dashboard.`,

                    history: [],

                    systemState:
                        healthChainAIState

                })
            }
        );

        const data =
            await response.json();

        if (data.answer) {

            showLiveAIBriefing(
                stageName,
                data.answer
            );

        }

    } catch (error) {

        console.error(
            "Live AI briefing error:",
            error
        );

    } finally {

        aiBriefingRunning = false;

    }
}
/* =========================================================
   DISPLAY LIVE AI BRIEFING
========================================================= */

function showLiveAIBriefing(
    stageName,
    answer
) {

    let panel =
        document.getElementById(
            "liveAIBriefing"
        );

    if (!panel) {

        panel =
            document.createElement(
                "div"
            );

        panel.id =
            "liveAIBriefing";

        panel.innerHTML = `

            <div class="ai-briefing-header">

                <div class="ai-briefing-icon">
                    <i class="fa-solid fa-brain"></i>
                </div>

                <div>

                    <span>
                        HEALTHCHAIN AI
                    </span>

                    <strong>
                        LIVE INTELLIGENCE
                    </strong>

                </div>

                <div class="ai-live-dot">
                    LIVE
                </div>

            </div>

            <div class="ai-briefing-stage">
                CRISIS DETECTED
            </div>

            <div
                class="ai-briefing-text"
                id="aiBriefingText"
            >
            </div>

        `;

        document.body.appendChild(
            panel
        );

    }


    panel
        .querySelector(
            ".ai-briefing-stage"
        )
        .textContent =
        stageName;


    panel
        .querySelector(
            "#aiBriefingText"
        )
        .textContent =
        answer;


    panel.classList.add(
        "visible"
    );


    clearTimeout(
        panel.aiHideTimer
    );


    panel.aiHideTimer =
        setTimeout(
            () => {

                panel.classList.remove(
                    "visible"
                );

            },
            12000
        );

}

/* =========================================================
   HEALTHCHAIN LIVE AI INTELLIGENCE
========================================================= */

let lastAIStage = -1;
let aiInsightBusy = false;


/* ---------------------------------------------------------
   DETERMINE AI STAGE
--------------------------------------------------------- */

function getAIStage(progress) {

    if (progress >= 100) {
        return 100;
    }

    if (progress >= 82) {
        return 82;
    }

    if (progress >= 70) {
        return 70;
    }

    if (progress >= 58) {
        return 58;
    }

    if (progress >= 32) {
        return 32;
    }

    return null;
}


/* ---------------------------------------------------------
   GENERATE AI INSIGHT
--------------------------------------------------------- */

async function generateLiveAIInsight(stage) {

    if (aiInsightBusy) {
        return;
    }

    aiInsightBusy = true;

    const stageNames = {

        32:
            "RISK ESCALATION",

        58:
            "CRITICAL SUPPLY PRESSURE",

        70:
            "EMERGENCY REROUTING",

        82:
            "NETWORK RECOVERY",

        100:
            "CRISIS RESOLVED"

    };


    const stageName =
        stageNames[stage] ||
        "NETWORK UPDATE";


    try {

        const response =
            await fetch(
                "/api/chat",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            message:
                                `Generate a live operational briefing for HealthChain.

Current crisis stage:
${stageName}

Crisis progress:
${healthChainAIState.crisisProgress}%

Affected location:
${healthChainAIState.affectedLocation}

Affected route:
${healthChainAIState.affectedRoute}

Alternate route:
${healthChainAIState.alternateRoute}

Risk:
${healthChainAIState.riskLevel}

Inventory risk:
${healthChainAIState.inventoryRisk}

Recommended action:
${healthChainAIState.recommendedAction}

Give a concise command-center briefing.

Maximum 55 words.

Explain:
1. What is happening
2. Current risk
3. Recommended action

Do not mention programming or APIs.`,

                            history: [],

                            systemState:
                                healthChainAIState

                        })

                }
            );


        const data =
            await response.json();


        if (
            response.ok &&
            data.answer
        ) {

            showLiveAIInsight(
                stageName,
                data.answer
            );

        }


    }
    catch (error) {

        console.error(
            "Live AI insight error:",
            error
        );

    }
    finally {

        aiInsightBusy =
            false;

    }

}

/* =========================================================
   SHOW LIVE AI INSIGHT
========================================================= */

function showLiveAIInsight(
    stage,
    message
) {

    let panel =
        document.getElementById(
            "hcLiveAIInsight"
        );


    if (!panel) {

        panel =
            document.createElement(
                "div"
            );

        panel.id =
            "hcLiveAIInsight";

        panel.innerHTML = `

            <div class="hc-ai-insight-top">

                <div class="hc-ai-brain">
                    🧠
                </div>

                <div>

                    <div class="hc-ai-title">
                        HEALTHCHAIN AI
                    </div>

                    <div class="hc-ai-subtitle">
                        LIVE INTELLIGENCE
                    </div>

                </div>

                <div class="hc-ai-live">
                    ● LIVE
                </div>

            </div>


            <div
                class="hc-ai-stage"
                id="hcAIStage"
            >
            </div>


            <div
                class="hc-ai-message"
                id="hcAIMessage"
            >
            </div>

        `;

        document.body.appendChild(
            panel
        );

    }


    document.getElementById(
        "hcAIStage"
    ).textContent =
        stage;


    document.getElementById(
        "hcAIMessage"
    ).textContent =
        message;


    panel.classList.add(
        "show"
    );


    clearTimeout(
        panel.hideTimer
    );


    panel.hideTimer =
        setTimeout(
            () => {

                panel.classList.remove(
                    "show"
                );

            },
            12000
        );

}

/* =========================================================
   AI DIGITAL TWIN COMMAND
========================================================= */

let aiRecommendedRoute = null;

let aiCommandActive = false;

async function requestAICommand() {

    if (aiCommandActive) {
        return;
    }

    aiCommandActive = true;

    try {

        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            message:
                                `Analyze the current HealthChain crisis.

Based on the current system state:

${JSON.stringify(
    healthChainAIState,
    null,
    2
)}

Give ONE recommended operational action.

If an alternate route should be activated,
return the answer using exactly this format:

ACTION: REROUTE
ROUTE: Mumbai → Bengaluru
REASON: short explanation

If rerouting is not necessary:

ACTION: MONITOR
REASON: short explanation

Do not give multiple options.`,

                            history: [],

                            systemState:
                                healthChainAIState

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(
                data.error ||
                "AI command failed."
            );
        }


        processAICommand(
            data.answer
        );


    }
    catch (error) {

        console.error(
            "AI command error:",
            error
        );

    }
    finally {

        aiCommandActive =
            false;

    }

}

function processAICommand(
    aiResponse
) {

    console.log(
        "AI COMMAND:",
        aiResponse
    );


    const text =
        aiResponse.toUpperCase();


    /* =====================================================
       REROUTE
    ===================================================== */

    if (
        text.includes(
            "ACTION: REROUTE"
        )
    ) {

        aiRecommendedRoute =
            "Mumbai → Bengaluru";


        healthChainAIState.alternateRoute =
            "Mumbai → Bengaluru";


        healthChainAIState.recommendedAction =
            "AI recommends rerouting critical shipments through Bengaluru.";


        activateAIReroute();


        return;

    }


    /* =====================================================
       MONITOR
    ===================================================== */

    healthChainAIState.recommendedAction =
        "AI recommends continued monitoring of the current network.";

}

function activateAIReroute() {

    console.log(
        "AI REROUTE ACTIVATED"
    );


    /*
     * Update system state
     */

    healthChainAIState.riskLevel =
        "MANAGED";


    healthChainAIState.inventoryRisk =
        "STABILIZING";


    /*
     * Try existing route animation
     */

    if (
        typeof updateNetworkVisualization ===
        "function"
    ) {

        updateNetworkVisualization();

    }


    /*
     * Highlight alternate route
     */

    highlightAIRoute();


    /*
     * Show visual notification
     */

    showAICommandNotification(
        "AI REROUTE ACTIVATED",
        "Critical shipments redirected through Bengaluru."
    );

}

function showAICommandNotification(
    title,
    message
) {

    let notification =
        document.getElementById(
            "aiCommandNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );

        notification.id =
            "aiCommandNotification";


        notification.innerHTML = `

            <div class="ai-command-icon">
                🧠
            </div>

            <div>

                <div
                    class="ai-command-title"
                >
                    AI COMMAND
                </div>

                <div
                    class="ai-command-heading"
                    id="aiCommandTitle"
                >
                </div>

                <div
                    class="ai-command-message"
                    id="aiCommandMessage"
                >
                </div>

            </div>

        `;


        document.body.appendChild(
            notification
        );

    }


    document.getElementById(
        "aiCommandTitle"
    ).textContent =
        title;


    document.getElementById(
        "aiCommandMessage"
    ).textContent =
        message;


    notification.classList.add(
        "active"
    );


    clearTimeout(
        notification.hideTimer
    );


    notification.hideTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "active"
                );

            },
            8000
        );

}

function highlightAIRoute() {

    const routes =
        document.querySelectorAll(
            ".route, .network-route, .connection"
        );


    routes.forEach(
        route => {

            route.classList.remove(
                "ai-selected-route"
            );

        }
    );


    /*
     * If your globe uses SVG routes,
     * highlight them.
     */

    routes.forEach(
        route => {

            const label =
                (
                    route.dataset.route ||
                    route.getAttribute(
                        "data-route"
                    ) ||
                    ""
                ).toLowerCase();


            if (
                label.includes(
                    "bengaluru"
                )
            ) {

                route.classList.add(
                    "ai-selected-route"
                );

            }

        }
    );

}

/* =========================================================
   AI COMMAND CENTER STATE
========================================================= */

function updateAICommandCenter() {

    const threat =
        document.getElementById(
            "aiThreatValue"
        );

    const threatDescription =
        document.getElementById(
            "aiThreatDescription"
        );

    const location =
        document.getElementById(
            "aiLocationValue"
        );

    const inventory =
        document.getElementById(
            "aiInventoryValue"
        );

    const route =
        document.getElementById(
            "aiRouteValue"
        );

    const recommendation =
        document.getElementById(
            "aiRecommendationText"
        );


    if (!threat) {
        return;
    }


    threat.textContent =
        healthChainAIState.riskLevel;


    location.textContent =
        healthChainAIState
            .affectedLocation;


    inventory.textContent =
        healthChainAIState
            .inventoryRisk;


    recommendation.textContent =
        healthChainAIState
            .recommendedAction;


    if (
        healthChainAIState.crisisActive
    ) {

        route.textContent =
            "REROUTING";

        threatDescription.textContent =
            `Crisis progress: ${healthChainAIState.crisisProgress}%`;

    }

    else {

        route.textContent =
            "MONITORING";

        threatDescription.textContent =
            "Network operating normally";

    }

}

const aiAnalyzeButton =
    document.getElementById(
        "aiAnalyzeButton"
    );


if (aiAnalyzeButton) {

    aiAnalyzeButton.addEventListener(
        "click",
        async () => {

            aiAnalyzeButton.disabled =
                true;

            aiAnalyzeButton.innerHTML =
                `
                <i class="fa-solid fa-spinner fa-spin"></i>
                ANALYZING...
                `;


            await requestAICommand();


            updateAICommandCenter();


            aiAnalyzeButton.disabled =
                false;

            aiAnalyzeButton.innerHTML =
                `
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                ANALYZE CRISIS
                `;

        }
    );

}

