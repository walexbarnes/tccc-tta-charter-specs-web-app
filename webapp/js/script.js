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
            event: isThirdParty ? "sendFirebaseEvent" : "charter_event",
            name: isThirdParty ? "local_event" : undefined,
            user_action: eventType,
            user_action_detail: document.getElementById('interaction-type').value,
            ux_element: document.getElementById('ux-element').value,
            child_ux_element: document.getElementById('element-detail').value,
            child_ux_element_link: document.getElementById('element-link').value || 'not_a_link',
        };
    } else if (eventType === 'progression') {
        const userActionDetail = document.getElementById('page-view').value;
        specification = {
            event: isThirdParty ? "sendFirebaseEvent" : "charter_event",
            name: isThirdParty ? "local_event" : undefined,
            user_action: "virtual_page_view",
            user_action_detail: userActionDetail,
            ux_element: "virtual_page_view",
            child_ux_element: "virtual_page_view",
            child_ux_element_link: "virtual_page_view",
        };
    }

    // Remove undefined properties for cleaner output
    Object.keys(specification).forEach(key => specification[key] === undefined && delete specification[key]);

    displaySpecification(specification);
}

function displaySpecification(specification) {
    const outputContainer = document.getElementById('output-container');
    outputContainer.textContent = JSON.stringify(specification, null, 2);
}
