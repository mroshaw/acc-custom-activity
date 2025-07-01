/**
 * Custom Activity
 * 
 * This JavaScript underpins the "customActivbity" custom workflow activity.
 * 
 * Simple demonstration of how to read parameters from a custom activity
 *
 **/

// Entry point when activating the activity
function customActivity_call() {
    logInfo("customActivity_call");

    // Use the activity object to retrieve parameters and log their values
    try {
        // Get basic attribute parameters
        var messageText = activity.messageText;
        logInfo("Message Text: " + messageText);

        // Iterate over element list parameters
        var pairs = activity.pairsList["pairs"];
        if (pairs) {
            for each(var pair in pairs) {
                logInfo("Pair Values: " + pair.paramLabel + ", " + pair.paramValue);
            }
        }

    } catch (e) {
        if (activity.transitions.error.enabled === true) {
            // If error transition is enabled, log the error but don't pause the workflow
            // Instead, go to the error transition
            logInfo("Error: " + e);
            task.postEvent(task.errorTransition()); //enable error transition
            task.setCompleted();
        } else {
            // Calling logError will pause the workflow and the activity
            // will move to an error state
            logError("Error: " + e);
            task.setCompleted();
        }
    }

    // Execution successful
    task.postEvent(task.doneTransition());
    task.setCompleted();
    return 0;
}

// Activity callback function
function customActivity_recall() {
    logInfo("customActivity_recall");
}