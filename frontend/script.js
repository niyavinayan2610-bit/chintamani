const situationInput = document.getElementById("situation");
const button = document.getElementById("overthinkButton");
const result = document.getElementById("result");


// ========================================
// SEND PROBLEM TO CHINDHAMANI AI
// ========================================

async function overthink() {

    const situation = situationInput.value.trim();

    // Check if user entered a problem
    if (!situation) {
        alert("oru problem engilum ezhuthu bro 😭");
        return;
    }

    // Disable button while AI is working
    button.disabled = true;
    button.innerText = "CHINTHAMANI IS THINKING...";

    try {

        // Connect to Vercel API
        const response = await fetch(
            "/api/overthink",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    situation: situation
                })
            }
        );


        // Convert response to JSON
        const data = await response.json();


        // Check for API errors
        if (!response.ok) {
            throw new Error(
                data.error || "AI request failed"
            );
        }


        // Save AI result temporarily
        sessionStorage.setItem(
            "chindhamaniResult",
            JSON.stringify(data)
        );


        // Go to result page
        window.location.href = "result.html";


    } catch (error) {

        console.error("ERROR:", error);


        alert(
            "Chindhamani AI connect aayilla 😭\n\n" +
            error.message
        );


        // Enable button again
        button.disabled = false;
        button.innerText = "ചിന്തിക്കാം";
    }
}



// ========================================
// LOAD RESULT PAGE
// ========================================

function loadResult() {

    // If this isn't the result page, stop
    if (!result) {
        return;
    }


    // Get saved AI result
    const saved =
        sessionStorage.getItem("chindhamaniResult");


    // No result found
    if (!saved) {

        result.innerHTML = `
            <div class="ai-response error">

                <h3>Ayyo bro 😭</h3>

                <p>
                    result kittiyilla.
                    back poyi oru problem kodukku.
                </p>

            </div>
        `;

        return;
    }


    // Convert saved result back to object
    const data = JSON.parse(saved);


    // Display result
    result.innerHTML = `

        <!-- STAGE 1 -->

        <section class="stage stage-one">

            <h3>
                🤔 Onnum illa bro
            </h3>

            <p>
                ${escapeHTML(data.stage1)}
            </p>

        </section>


        <!-- STAGE 2 -->

        <section class="stage stage-two">

            <h3>
                🧐 Endo undu
            </h3>

            <p>
                ${escapeHTML(data.stage2)}
            </p>

        </section>


        <!-- STAGE 3 -->

        <section class="stage stage-three">

            <h3>
                😵 Seen ayi
            </h3>

            <p>
                ${escapeHTML(data.stage3)}
            </p>

        </section>


        <!-- STAGE 4 -->

        <section class="stage stage-four">

            <h3>
                💀 Pani paali
            </h3>

            <p>
                ${escapeHTML(data.stage4)}
            </p>

        </section>


        <hr>


        <!-- REALITY CHECK -->

        <section class="reality">

            <h3>
                🛟 Sathyaavastha
            </h3>


            <p>
                <strong>WHAT WE KNOW:</strong>
            </p>

            <p>
                ${escapeHTML(data.known)}
            </p>


            <p>
                <strong>WHAT WE ARE ASSUMING:</strong>
            </p>

            <p>
                ${escapeHTML(data.assumptions)}
            </p>

        </section>


        <!-- SCORE -->

        <section class="score">

            <h3>
                📊 OVERTHINKING SCORE
            </h3>


            <p class="score-number">
                ${data.score}/100
            </p>


            <p>
                ${escapeHTML(data.scoreExplanation)}
            </p>

        </section>


        <!-- ENDING -->

        <p class="complete">

            ${escapeHTML(data.ending)}

        </p>

    `;
}



// ========================================
// SECURITY FUNCTION
// Prevent AI text from being treated as HTML
// ========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = String(text);

    return div.innerHTML;
}



// ========================================
// CTRL + ENTER SHORTCUT
// ========================================

if (situationInput) {

    situationInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                overthink();
            }
        }
    );
}



// ========================================
// LOAD RESULT WHEN RESULT PAGE OPENS
// ========================================

if (result) {

    loadResult();
}