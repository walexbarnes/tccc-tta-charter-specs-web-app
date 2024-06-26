document.addEventListener('DOMContentLoaded', () => {
    // Show the form when 'Add Data Layer Push' is clicked
    document.getElementById('add-data-layer-push').addEventListener('click', () => {
        document.getElementById('data-layer-form').style.display = 'block';
    });

    // Toggle details display based on event type selection
    document.getElementById('event-type').addEventListener('change', function() {
        toggleDetails(this.value);
    });

    // Handle form submission
    document.getElementById('data-layer-form').addEventListener('submit', function(event) {
        event.preventDefault();
        generateSpecification();
        displayImagePreview();
        document.getElementById('data-layer-form').style.display = 'none';
        setTimeout(clearFormInputs,1000);
    });
});

function toggleDetails(eventType) {
    // Display interaction or progression details based on selection
    document.getElementById('interaction-details').style.display = eventType === 'interaction' ? 'block' : 'none';
    document.getElementById('progression-details').style.display = eventType === 'progression' ? 'block' : 'none';
}

function generateSpecification() {
    // Determine if the application is for a third-party experience
    const isThirdParty = document.getElementById('third-party').checked;
    const eventType = document.getElementById('event-type').value;
    let specification = {};

    if (eventType === 'interaction') {
        specification = {
            event: "charter_event",
            routing_instructions: isThirdParty ? "iframe_message" : undefined, 
            user_action: eventType,
            user_action_detail: document.getElementById('interaction-type').value,
            ux_element: document.getElementById('ux-element').value,
            child_ux_element: document.getElementById('element-detail').value,
            child_ux_element_link: document.getElementById('element-link').value || 'not_a_link',
        };
    } else if (eventType === 'progression') {
        const userActionDetail = document.getElementById('page-view').value;
        specification = {
            event: "charter_event",
            routing_instructions: isThirdParty ? "iframe_message" : undefined, 
            user_action: "virtual_page_view",
            user_action_detail: userActionDetail,
            ux_element: "virtual_page_view",
            child_ux_element: "virtual_page_view",
            child_ux_element_link: "virtual_page_view",
        };
    }

    // Remove undefined properties for cleaner output
    Object.keys(specification).forEach(key => specification[key] === undefined && delete specification[key]);

    displaySpecification(isThirdParty, specification);
}

function displayImagePreview() {
    const fileInput = document.getElementById('image-upload');
    const outputContainer = document.getElementById('child-output-image');
    
    // Clear previous output
    outputContainer.innerHTML = '';

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // Create an image element and set its source to the uploaded file
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px'; // Set a max width for the image preview
            img.style.marginRight = '20px'; // Add some spacing between the image and the code

            // Append the image to the output container
            outputContainer.appendChild(img);
        };

        // Read the file as a Data URL to trigger the onload event
        reader.readAsDataURL(fileInput.files[0]);
    }
}


function displaySpecification(isThirdParty, specification) {
    const outputContainer = document.getElementById('child-output-json');
    const jsonPayload = JSON.stringify(specification, null, 2)
    const preWrap = isThirdParty ? "window.parent.postMessage(" : "dataLayer.push(" 
    outputContainer.textContent = preWrap + jsonPayload + ")"
    console.log(jsonPayload);
}

function clearFormInputs() {
    // Reset text inputs and select elements to their default values
    const textInputs = document.querySelectorAll('#data-layer-form input[type="text"], #data-layer-form select');
    textInputs.forEach(input => {
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            input.value = '';
        }
    });

    // Special handling for file input to ensure it's cleared
    const fileInput = document.getElementById('image-upload');
    fileInput.value = '';

    // Hide additional detail sections that may have been shown based on previous interactions
    document.getElementById('interaction-details').style.display = 'none';
    document.getElementById('progression-details').style.display = 'none';

    // Optionally, uncheck any checkboxes (like the third-party checkbox)
    const checkboxes = document.querySelectorAll('#data-layer-form input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset the select element 
    var selectOption = document.getElementById("event-type").options[0];
    selectOption.selected = true
}
