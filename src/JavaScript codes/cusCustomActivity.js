/**
 * customActivity.js
 *
 * This JavaScript underpins the "customActivity" custom workflow activity.
 *
 * Simple demonstration of how to read parameters and context data from a custom activity
 *
 **/

/**
 * Entry point when the activity is executed by the running workflow.
 * Must call task.setCompleted() to register completion with the executing workflow.
 * *
 * Parameters:
 *
 * None
 *
 * Returns:
 *
 * Integer - resultCode - 0 for success, anything otherwise for failure
 **/
function customActivity_call() {
    logInfo("customActivity_call");

    // Use the activity object to retrieve parameters and log their values
    try {

        // Determine if debugging is enabled
        var debugEnabled = activity.enableDebugging;
        logInfo("Debug Enabled: " + debugEnabled);
        if(debugEnabled) {
            showDebugInfo();
        }

        // Example of how to get basic attribute parameters from the activity schema/UI
        var messageText = activity.messageText;
        var messageTextLength = activity.messageTextLength;
        var activityAction = activity.activityAction;

        // This will be used to query the context data
        var queryAttributeAlias = activity.queryAttributeAlias;

        // Validate parameters before running the query
        if(queryAttributeAlias=="") {
            logInfo("No query attribute alias set.");
        } else {

            // Calls the example method to query the current data context
            var resultsArray = getCurrentDataContext(queryAttributeAlias);

            if(resultsArray.length > 0) {

                // Log the results
                logInfo("Query data context for attribute: " + queryAttributeAlias);
                for each(resultValue in resultsArray) {
                    logInfo("Attribute value: " + resultValue);
                }
            }
        }

    } catch (e) {
        // Demonstrates how to handle exceptions and use the toggleable "error" transition, if enabled in the UI
        // You must always call "task.setCompleted" to end the activity execution cleanly.
        if (activity.transitions.error.enabled === true) {
            // If error transition is enabled, log the error but don't pause the workflow
            // Instead, go to the error transition
            logInfo("Error: " + e);
            task.postEvent(task.errorTransition()); //enable error transition
            task.setCompleted();
            return 0;
        } else {
            // Calling logError will pause the workflow and the activity
            // will move to an error state
            logError("Error: " + e);
            task.setCompleted();
            return 0;
        }
    }

    // Execution successful
    task.postEvent(task.doneTransition());
    task.setCompleted();
    return 0;
}

/**
 * Activity callback function.
 * TODO - don't know yet when/why this function is used
 * *
 * Parameters:
 *
 * None
 *
 * Returns:
 *
 * Integer - resultCode - 0 for success, anything otherwise for failure
 **/
function customActivity_recall() {
    logInfo("customActivity_recall");
}

/**
 * This is an example of how to query the temp table/data context that's "passed in" from the preceding
 * activity.
 * *
 * Parameters:
 *
 * attribName - string - must match the alias of an attribute in the current query context
 *
 * Returns:
 *
 * resultArray - string array - an array of strings containing the "email address" attributes of all rows in the data context
 **/
function getCurrentDataContext(attribName) {

    // Check if there is a data context
    if(!vars.targetSchema) {
        logInfo("No data context found.");
        return [];
    }

    // Set up the XML for the query
    // "vars.targetSchema" will get the temp table schema for the current activity
    var queryDefXML = new XML(<queryDef schema={vars.targetSchema} operation="select">
        <select>
            <node expr={"[" + attribName + "]"} />
        </select>
    </queryDef>);

    try {
        var queryResult = xtk.queryDef.create(queryDefXML).ExecuteQuery();
    } catch(e) {
        // Throw this up to the calling method to handle
        throw new Error("An error has occurred while querying the context data: " + e);
    }

    var resultArray = [];

    // Iterate over the results and populate the return array
    // If the result set is empty, an empty array will be returned
    for each(var resultRow in queryResult) {
        var resultAttribValue = resultRow[attribName];
        resultArray.push(resultAttribValue);
    }

    return resultArray;
}

/**
 * Logs all activity parameters using logInfo
 *
 * Parameters:
 *
 * None
 *
 * Returns:
 *
 * Nothing
 **/
function showDebugInfo(){
    logInfo("***** Debugging enabled. Listing activity parameters: *****");
    logInfo("Message Text: " + activity.messageText);
    logInfo("Message Text Length: " + activity.messageTextLength);
    logInfo("Activity Action: " + activity.activityAction);
    logInfo("Query Attribute Alias: " + activity.queryAttributeAlias);

    // Example of iterating over a list of "pairs" exposed in the schema and UI
    var pairs = activity.pairsList["pairs"];
    if (pairs) {
        for each(var pair in pairs) {
            logInfo("Pair Values: " + pair.paramLabel + ", " + pair.paramValue);
        }
    }
    logInfo("***** End of Debug *****");
}