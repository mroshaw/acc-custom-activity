# Adobe Campaign Classic Custom Activity (acc-custom-activity)
A basic framework for creating custom workflow activities in Adobe Campaign Classic v8.

# Introduction

This repository contains code and step-by-step instructions for adding completely new, custom workflow activities into the Adobe Campaign Classic v8 marketing platform. This repository represents a framework, and the resulting activity doesn't have any functionality as such. You can see some implementation examples in my other repositories:

- Message Center Delivery Activity (coming soon!)
- Message Center Quaratine Manager Activity (coming soon!)

If you have any ideas for additional use cases, would like to contribute to this repository, or have your own implementations that you'd like to share, please do get in touch.

![](https://github.com/mroshaw/acc-custom-activity/blob/main/Documentation/Images/WorkflowWithActivity.png?raw=true)

# Features

My initial plan for this repository is to have an update-to-date, accurate and complete framework publicly available for users of Adobe Campaign Classic v8 to expand their own platform implementations. This particular repo will remain a framework only, though I'll link from here any repos for public use case implementations that I share.

The framework demonstrates the following features:

- Create a new custom activity that can be dragged into any workflow from an existing or new workflow palette.
- Handle errors/exceptions via an "Error" transition that can be toggled via the UI.
- Provide debugging features that can be toggled via the UI.
- Example of accessing simple type parameters exposed in the UI.
- Example of accessing ENUM parameters exposed in the UI.
- Example of accessing "lists" of parameter pairs/tuples exposed in the UI.
- Shows how to access and iterate over the current temp table data context provided by preceding activities.

# Limitations

The framework currently has several limitations, and as of writing this I am not aware of any workarounds to these. If you know otherwise, please do [create/update an issue](https://github.com/mroshaw/acc-custom-activity/issues) on the repo and let me know!

- I don't know what the intended purpose is for both `call` and `recall()`, in particular where they are invoked in the process or what particular purpose each is intended to serve. In this framework, `call` is used as the trigger for activity execution, while `recall` remains a simple stub.
- I have yet to find any way of creating, updating or influencing the population/data context of activities connected to the custom activity. It would be incredibly powerful to be able to manipulate the underlying temp tables in "future" activities, in the same way the out-of-the-box "Query" and "Enrichment" activities do, for example.

# Solution Components

The solution involves creating new objects and updating existing, out of the box objects:

| Object                      | Type            | New or Updated | Comments                                                     |
| --------------------------- | --------------- | -------------- | ------------------------------------------------------------ |
| cus:customActivity16x16.png | Image           | New            | Used in the workflow editor palette to represent the new activity. |
| cus:customActivity48.48.png | Image           | New            | Used in the workflow editor itself for each new activity instance. |
| cus:customActivity.js       | JavaScript Code | New            | Code that underpins all of the core functionality of the new activity. |
| cus:workflow                | Workflow schema | New            | Extends the `xtk:workflow` schema with attributes, elements and methods required by the new activity. |
| cus:customActivity          | Input Form      | New            | Provides the UI form that exposes and manages the user interface for the activity, when it's being configured in the workflow editor. |
| xtk:workflow                | Input Form      | Updated        | Small change to add the new activity to the workflow palette, and provides a reference to the new activity UI form. |

# Implementation / Deployment Steps

There are a number of manual steps required to deploy the code into your Adobe Campaign instance. All steps are performed in the Adobe Campaign Client application while connected to your desired instance.

I have deliberately avoided using packages for these components. While it is possible to use packages, that does add a degree of risk in overwriting something in your implementation and, as a learning opportunity, manual deployment allows for a better understanding of the solution. There's also an annoying "feature" of the v8 package manager implementation that strips XML comments out of imported packages.

Note that the `cus` namespace is used in this repo for the purposes of providing a sample namespace. You can replace this with your own namespace to align with your existing configuration.

## Deploy Images

I've provided a sample PNG image that will be used when the new activity is dragged into the workflow editor. I recommend a 48x48 PNG icon with transparency, if you're creating your own image.

To deploy:

1. Go to Administration > Configuration > Images.
2. Create a new record.
3. Use the name: "cus:customActivity16x16.png".
4. Click the "Import image" button and import the PNG file from the `src/Images` folder.
5. Repeat this process for "cus:customActivity48x48.png".

## Deploy JavaScript Code

This JavaScript code underpins the functionality of the new activity. In your own implementation, you can of course name this something more appropriate, but be sure to update any references in dependent objects.

To deploy the framework sample:

1. Go to Administration > Configuration > JavaScript codes.
2. Create a new record.
3. Use the name and description: "cus:customActivity.js".
4. Copy and paste the code from the "src/JavaScript codes/cusCustomActivity.js" file.
5. Save the record.

## Deploy Schemas

This solution works by extending the `xtk:workflow` schema with a new schema instance called `cus:workflow`. If you've already extended this schema, you can either manually merge the new schema XML into your configuration or you can extend `xtk:workflow` again into a dedicated schema.

Steps to deploy the schema changes:

1. Go to Administration > Configuration > Data schemas
2. Click the "New" button.
3. Select "Extend the data in the table using an extension schema".
4. Click "Next".
5. Select the `xtk:workflow` schema.
6. Use the namespace: "cus".
7. Use name: "workflow".
8. Use label: "Workflow".
9. Use description: "Custom workflow extensions".
10. Click "Save".
11. Copy and paste the XML from the "src/Data schemas/cusWorkflow.xml" file.
12. Save the record.

## Deploy Input Forms

There are two parts to the User Interface changes:

1. A new Input Form that exposes attributes, elements, functions and features of your new activity. This sits in it's own new Input Form object.
2. A change to the out-of-the-box `xtk:workflow` Input Form, simply to expose the activity in the workflow palette.

You should be particularly careful when modifying `xtk:workflow` as any syntax errors that you might introduce in that XML could cause significant issues when you or other users log in to the application.

The steps to deploy the framework form changes are as follows:

### Deploy New Activity Form

1. Go to Administration > Configuration > Input forms.
2. Create a new entry named "cus:CustomActivity".
3. Copy and paste the XML from the "src/Data schemas/cusCustomActivity.xml" and save the record.

### Configure `xtk:workflow` Form

1. Find the `xtk:workflow` entry and double click to open it.
2. Search for the container named "palette". (Search for this string: `<container name="palette">`).
3. Copy and paste the appropriate XML from "src/Input forms/xtkWorkflow.xml" as a direct child of this node.
4. Search for the container named "subforms". Search for this string: `<container name="subforms">`).
5. Copy and paste the appropriate XML from "src/Input forms/xtkWorkflow.xml" as a direct child of this node.

## Final Steps and Testing

Once you've made all of the changes, I highly recommend that you go back and eye-ball all of the code and config that you've changed or added. In particular, double check the changes made to `xtk:workflow` to ensure there are no syntax or XML errors that may cause issues when you log out and log back in.

Once you're happy, you can finalise the deployment and test your new activity by following these steps:

1. Go to "File > Clear the local cache..." and click "Yes".
2. Go to "File > Exit" then reconnect to your chosen instance.
3. Create a new workflow using the standard template.
4. You should see a new palette in the workflow UI with your new activity icon show.
5. Drag in a Start and End activity.
6. Drag this new activity into your workflow, connect up to the Start and End, then double click it.
7. You should see the input form for the new activity:![](https://github.com/mroshaw/acc-custom-activity/blob/main/Documentation/Images/ExampleActivityUi.png?raw=true)
8. Set the parameters, and add several entries in the "Pairs" list.
9. If you want to test the data query context, connect up a "Query" activity and ensure it's adding additional data that includes an attribute aliased to the value you specify in "Query Attribute Alias":![](https://github.com/mroshaw/acc-custom-activity/blob/main/Documentation/Images/WorkflowWithActivity.png?raw=true)
10. Click Ok to save.
11. Run the workflow.
12. Right click the new activity and select "Display logs".
13. You'll see the values of the parameters entered listed in the logs, along with data queried from the outputs of the "Query" activity, if you added one.

# Attribution

Thank you to Icon8 for the amazing free icons!

<a target="_blank" href="https://icons8.com/icon/qFGm9HCcubJo/testing">testing</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
