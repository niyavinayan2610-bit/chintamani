const situationInput = document.getElementById("situation");
const button = document.getElementById("overthinkButton");
const result = document.getElementById("result");


// ========================================
// SEND PROBLEM TO CHINDHAMANI AI
// ========================================

async function overthink() {

    const situation = situationInput.value.trim();

    // Check if problem is empty
    if (!situation) {
        alert("oru problem engilum ezhuthu bro 😭");
        return;
    }

    // Disable button
    button.disabled = true;
    button.innerText = "CHINTHAMANI IS THINKING...";


    // ========================================
    // API ADDRESS
    // ========================================

    // When testing on your computer:
    // http://localhost:3000/api/overthink

    // When deployed on Vercel:
    // /api/overthink

    const apiUrl =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
            ? "http://localhost:3000/api/overthink"
            : "/api/overthink";


    try {

        const response = await fetch(
            apiUrl,
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


        // ========================================
        // READ RESPONSE
        // ========================================

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (jsonError) {

            console.error("Server response:", text);

            throw new Error(
                "Server returned an invalid response."
            );
        }


        // ========================================
        // CHECK API ERROR
        // ========================================

        if (!response.ok) {

            throw new Error(
                data.error || "AI request failed."
            );
        }


        // ========================================
        // SAVE RESULT
        // ========================================

        sessionStorage.setItem(
            "chindhamaniResult",
            JSON.stringify(data)
        );


        // ========================================
        // GO TO RESULT PAGE
        // ========================================

        window.location.href = "result.html";


    } catch (error) {

        console.error("CHINDHAMANI ERROR:", error);


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

    // Not result page
    if (!result) {
        return;
    }


    // Get saved result
    const saved =
        sessionStorage.getItem("chindhamaniResult");


    // No result
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


    let data;

    try {

        data = JSON.parse(saved);

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="ai-response error">

                <h3>Ayyo bro 😭</h3>

                <p>
                    result load cheyyan pattiyilla.
                </p>

            </div>
        `;

        return;
    }


    // ========================================
    // DISPLAY AI RESULT
    // ========================================

    result.innerHTML = `

        <div class="ai-response">


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


            <!-- SATHYAVASTHA -->

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


        </div>

    `;
}



// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = String(text);

    return div.innerHTML;
}



// ========================================
// CTRL + ENTER
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
// LOAD RESULT
// ========================================

if (result) {

    loadResult();

}