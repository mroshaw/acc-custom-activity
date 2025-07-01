# acc-custom-activity
A simple framework for creating custom workflow activities in Adobe Campaign Classic v8.

# Introduction

This repository contains code and step-by-step instructions for adding brand new, custom workflow activities into the Adobe Campaign Classic v8 marketing platform.

# How to use

There are a number of manual steps required to deploy the code into your Adobe Campaign instance. All steps are performed in the Adobe Campaign Client application while connected to your desired instance.

## Deploy Images

1. Go to Administration > Configuration > Images.
2. Create a new record.
3. Use the name: "cus:customActivity16x16.png".
4. Click the "Import image" button and import the PNG file from the `src/Images` folder.
5. Repeat this process for "cus:customActivity48x48.png".

## Deploy JavaScript Code

1. Go to Administration > Configuration > JavaScript codes.
2. Create a new record.
3. Use the name and description: "cus:cusCustomActivity.js".
4. Copy and paste the code from the `src/JavaScript codes/custom_activity.js` file.
5. Save the record.

## Deploy Schemas

This solution works by extending the `xtk:workflow` schema. If you've already extended this schema, you should proceed to step 11.

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
11. Copy and paste the XML from the `src/Data schemas/workflow_schema.xml` file.
12. Save the record.

## Deploy Input Forms

This also involves manual steps.

1. Go to Administration > Configuration > Input forms.
2. Find the `xtk:workflow` entry and double click to open it.
3. Search for the container named "palette". (Search for this string: `<container name="palette">`).
4. Copy and paste the XML from `src/Input forms/workflow_palette_input_form.xml` as a direct child of this node.
5. Search for the container named "subforms". Search for this string: `<container name="subforms">`).
6. Copy and paste the XML from `src/Input forms/custom_activity_input_form.xml` as a direct child of this node.

## Final Steps and Testing

1. Go to "File > Clear the local cache..." and click "Yes".
2. Go to "File > Exit" then reconnect to your chosen instance.
3. Create a new workflow using the standard template.
4. You should see a new palette in the workflow UI with your new activity icon show.
5. Drag in a Start and End activity.
6. Drag this new activity into your workflow, connect up to the Start and End, then double click it.
7. You should see the input form for the new activity.
8. Enter some text in the "Message Text" parameter, and add several entries in the "Pairs" list.
9. Click Ok to save.
10. Run the workflow.
11. Right click the new activity and select "Display logs".
12. You'll see the values of the parameters entered listed in the logs.

# Attribution

Thank you to Icon8 for the amazing free icons!

<a target="_blank" href="https://icons8.com/icon/qFGm9HCcubJo/testing">testing</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
