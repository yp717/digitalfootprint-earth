var generateBadge =
  generateBadge ||
  (function () {
    let style = "";
    let html = "";
    let color = "";
    let text = "";
    let id = "";
    return {
      init: function (pText, pColor) {
        color = pColor || "#FFFFFF";
        text = pText || "#000000";
        style = `
            <style>
            .digital-footprint-a {
              all: unset;
              cursor:pointer !important;
              text-decoration: none !important;
              color: ${text} !important;
            }
            .digital-footprint-hero {
              display: flex !important;
              justify-content: space-between !important;
        
            }
                .badge {
                    width: 300px !important;
                    background: ${color} !important;
                    border: 4px solid ${text} !important;
                    box-sizing: border-box !important;
                    border-radius: 15px !important;
                    padding-top: 10px !important;
                    padding-bottom: 10px !important;
                    padding-left: 10px !important;
                    padding-right: 10px !important;
                   
                }

                .digital-footprint-badge-site-url {
                    font-family: Roboto, sans-serif !important;
                    font-style: normal !important;
                    font-weight: bold !important;
                    font-size: 20px !important;
                    line-height: 20px !important;
                    color: ${text} !important;
                    margin-bottom: 0px !important;
                    margin-top: 5px !important;
                    margin-right: 10px !important;
                }

                .digital-footprint-badge-description {
                    font-family: Roboto, sans-serif !important;
                    font-style: normal !important;
                    font-weight: bold !important;
                    font-size: 15px !important;
                    line-height: 18px !important;
                    color: ${text} !important;
                }

                .digital-footprint-badge-score {
                    font-family: Roboto, sans-serif !important;
                    font-style: normal !important;
                    font-weight: bold !important;
                    font-size: 30px !important;
                    line-height: 10px !important;
                    color: ${text} !important;
                    margin-bottom: 0px !important;
                    margin-top: 0px !important;
                }

                .digital-footprint-badge-point-score {
                    font-family: Roboto, sans-serif !important;
                    font-style: normal !important;
                    font-weight: bold !important;
                    font-size: 15px !important;
                    line-height: 18px !important;
                    color: ${text} !important;
                    margin-bottom: 0px !important;
                    margin-top: 0px !important;
                }

                .digital-footprint-score-container {
                  display:flex !important;
                  align-items:center  !important;
                }

                .digital-footprint-badge-powered-by {
                  font-family: Roboto, sans-serif !important;
                  font-size: 10px !important;
                  margin-bottom: 0px !important;
                  margin-top: 5px !important;
                  color: ${text} !important;
                }
            </style>
        `;

        // todo: verify this is the optimal way to request the google font - using Roboto for now
        html =
          "<link rel='preconnect' href='https://fonts.googleapis.com'><link rel='preconnect' href='https://fonts.gstatic.com' crossorigin><link href='https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap' rel='stylesheet'>";
        html += `
        <a class="digital-footprint-a" href="https://digitalfootprint.earth">
        <div class="badge">
          <div class="digital-footprint-hero">
            <div>
                <h3 class="digital-footprint-badge-site-url">[URL]</h3>
                <p class="digital-footprint-badge-powered-by">[DATE]</p>
            </div>
            <div class="digital-footprint-score-container">
                <p class="digital-footprint-badge-score">
                  [SCORE]/9  
                </p>
                <svg
                style="height:20px; width:20px; flex: 0 1 auto; fill: ${text};"
                viewBox="0 0 450 512"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                >
                <g
                  id="Artboard"
                  transform="translate(-97.000000, -85.000000)"
                  fillRule="nonzero"
                  >
                  <path
                      d="M329.691,313.126 C331.454809,314.170683 379.534952,360.067175 408.860643,392.675541 C447.237348,376.018837 487.922158,364.765123 529.756,359.49 C533.887,358.962 538.003,360.178 541.182,362.815 C544.376,365.437 546.339,369.275 546.602,373.406 C551.993,458.762 502.197,535.607 426.432,572.847 C411.064358,578.910181 409.834947,579.395235 409.77552,579.4288 L409.773338,579.431039 L409.778031,579.430685 L409.783204,579.430267 C409.757191,579.450164 409.385179,579.608615 406.324744,580.833383 L405.154388,581.301353 C402.7273,582.271116 399.03536,583.74241 393.424,585.974 C371.367167,592.891481 347.873081,596.852577 323.388003,596.996912 L322.001,597.001 L321.684428,597.001 C296.699428,597.001 272.734428,593.022 250.261428,585.974 C244.319988,583.61114 240.530423,582.100654 238.115727,581.135372 L237.360684,580.833383 C234.18254,579.561508 233.903597,579.439553 233.901456,579.430824 C233.912396,579.431358 233.916895,579.431964 233.90424,579.425918 L233.879754,579.41505 C233.629989,579.308242 231.618832,578.514756 217.253428,572.847 C216.391636,572.506987 215.602198,572.061622 214.883081,571.517873 C140.603351,533.785579 92.0737366,457.720856 97.399,373.406 C97.663,369.275 99.626,365.437 102.819,362.815 C105.998,360.178 110.187,358.962 114.245,359.49 C154.051867,364.508536 192.81088,374.938831 229.531484,390.283128 C260.449655,357.873427 312.589799,314.146263 314.31,313.126 C319.056,310.284 324.945,310.284 329.691,313.126 Z M458.5,448 C448.835017,448 441,455.835017 441,465.5 C441,475.164983 448.835017,483 458.5,483 C468.164983,483 476,475.164983 476,465.5 C476,455.835017 468.164983,448 458.5,448 Z M406.5,448 C396.835017,448 389,455.835017 389,465.5 C389,475.164983 396.835017,483 406.5,483 C416.164983,483 424,475.164983 424,465.5 C424,455.835017 416.164983,448 406.5,448 Z M367,448 L194,448 L194,483 L367,483 L367,448 Z M512.633,262.9 C513.27254,264.54439 523.623891,292.387833 527.087177,328.479798 L527.19,329.576 L526.007,329.724 C490.353,334.219 455.399,342.9 421.797,355.232 C407.386,336.84 391.133,321.666 377.012,310.275 C423.297,265.534 492.835,254.031 496.329,253.48 C503.287,252.44 510.084,256.322 512.633,262.9 Z M147.672,253.479 C151.167,254.03 220.714,265.535 266.998,310.273 C252.87,321.668 236.62,336.841 222.211,355.228 C189.230643,343.121125 154.956751,334.536986 120.017437,329.982431 L118.111,329.738 L116.807,329.612 C120.16,292.972 130.722,264.562 131.368,262.899 C133.917,256.322 140.743,252.44 147.672,253.479 Z M330.365,208.555 C332.083,209.707 362.618,230.518 388.902,263.013 C376.214,271.08 363.861,280.744 352.626,292.227 C342.42,285.494 335.27,281.004 322.001,281.005 C308.688,281.005 301.642,285.458 291.388,292.224 C280.153,280.743 267.799,271.079 255.104,263.011 C281.387,230.515 311.918,209.707 313.636,208.555 L313.941943,208.355198 C318.96807,205.158359 325.39836,205.22496 330.365,208.555 Z M221.22,147.5 C223.233,148.188 259.163,160.713 293.438,186.071 C283.219,193.294 253.982,215.424 228.497,248.291 C199.923,234.653 173.493,228.003 160.139,225.293 C177.118,184.224 203.589,153.532 205.078,151.836 C209.106,147.251 215.551,145.567 221.22,147.5 Z M438.951,151.821 C440.44,153.527 466.91,184.209 483.888,225.277 C470.675,227.954 444.189,234.586 415.495,248.29 C390.035,215.448 360.821,193.321 350.58,186.083 C384.86,160.715 420.797,148.188 422.809,147.5 C428.493,145.523 434.923,147.237 438.951,151.821 Z M329.691,87.132 C331.244,88.056 358.32,105.538 383.481,131.554 C365.948,139.988 343.314,153.071 322.017,170.673 C300.709,153.065 278.067,139.982 260.529,131.546 C285.685,105.537 312.757,88.056 314.31,87.131 C319.056,84.29 324.945,84.29 329.691,87.132 Z"
                      id="Combined-Shape"
                      ></path>
                </g>
            </svg>
            </div>
          </div>
          <div>
          </div>
          </a>`;
      },
      getHTML: function () {
        var rtn =
          style +
          html
            .replace("[color]", color)
            .replace("[text]", text)
            .replace("[id]", id);
        return rtn;
      },
      draw: function (id) {
        console.log("drawing");
        document.getElementById(id).innerHTML =
          style +
          html
            .replace("[color]", color)
            .replace("[text]", text)
            .replace("[id]", id);
      },
    };
  })();
