document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the 'Add Data Layer Push' button
    document.getElementById('add-data-layer-push').addEventListener('click', () => {
        document.getElementById('data-layer-form').style.display = 'block';
    });

    // Event listener for changes in the 'Event Type' dropdown
    document.getElementById('event-type').addEventListener('change', function() {
        toggleDetails(this.value);
    });

    // Form submission event listener
    document.getElementById('data-layer-form').addEventListener('submit', function(event) {
        event.preventDefault();
        generateSpecification();
    });
});

function toggleDetails(eventType) {
    const interactionDetails = document.getElementById('interaction-details');
    const progressionDetails = document.getElementById('progression-details');

    // Show/Hide details based on event type
    if (eventType === 'interaction') {
        interactionDetails.style.display = 'block';
        progressionDetails.style.display = 'none';
    } else if (eventType === 'progression') {
        interactionDetails.style.display = 'none';
        progressionDetails.style.display = 'block';
    } else {
        interactionDetails.style.display = 'none';
        progressionDetails.style.display = 'none';
    }
}

function generateSpecification() {
    const eventType = document.getElementById('event-type').value;
    const specification = {
        event: "charter_event", // Assuming a default for simplicity
    };

    // Add common and type-specific properties
    if (eventType === 'interaction') {
        Object.assign(specification, {
            user_action: eventType,
            user_action_detail: document.getElementById('interaction-type').value,
            ux_element: document.getElementById('ux-element').value,
            child_ux_element: document.getElementById('element-detail').value,
            child_ux_element_link: document.getElementById('element-link').value || 'not_a_link',
        });
    } else if (eventType === 'progression') {
        Object.assign(specification, {
            user_action: eventType,
            user_action_detail: document.getElementById('page-view').value,
            ux_element: eventType, // Simplified handling
            child_ux_element: eventType,
            child_ux_element_link: eventType,
        });
    }

    // Display the specification
    displaySpecification(specification);
}

function displaySpecification(specification) {
    const outputContainer = document.getElementById('output-container');
    outputContainer.textContent = JSON.stringify(specification, null, 2);
}
