# [![Cypress](https://cloud.githubusercontent.com/assets/1268976/20607953/d7ae489c-b24a-11e6-9cc4-91c6c74c5e88.png)](https://www.cypress.io)

## Hi there! This is my Cypress Automation Project. 

### **Scope of the Project and how it is structured**
If you are interested in knowing how the project was structured, you can check it [HERE](https://kendallvargas.notion.site/Automation-Kendall-df83d591e3514c6c8a23cf1646bd806c). 

### **Dependency used:**

- Mochawesome reporter: https://www.npmjs.com/package/cypress-mochawesome-reporter
- FakerJS: https://www.npmjs.com/package/@faker-js/faker/v/7.6.0
- RandExp: https://www.npmjs.com/package/randexp
- Cy-grep: https://www.npmjs.com/package/@cypress/grep

### **General requirements**
- Install [Node.js](https://nodejs.org/es/download/).
- Install a git client such as [git bash](https://git-scm.com/downloads).
- Have installed the latest version of Chrome.

### **Installing the test framework**
**Clone the repository:**
```bash
git clone https://github.com/kendallvargas/kendall-cypress.git
```
**Install the dependencies.**
Navigate to the project directory and run the following command to install the required dependencies:
```bash
cd kendall-cypress
npm install
```

### **Test Execution**
Once dependencies are installed, you can run the test cases using the following commands for each suite:

Run the UI regression test with Chrome browser:
```bash
npm run ui-regression
```
Run the API regression test with Electron browser:
```bash
npm run API-regression
```
Run the iteration regression test with Chrome Browser:
```bash
npm run iteration-regression
```
Run all suites at once:
```bash
npm run e2e-regression
```

### **Sites used:**
Example of the website that was used for the Web E2E: 
- [OrangeHR](https://www.orangehrm.com/), practice site used for this project: [DemoOrangeHR](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login).
- For the API testing: [DemoQABookstore](https://demoqa.com/swagger/) and [Reqres](https://reqres.in).
- For iteration: [CypressWeb](https://docs.cypress.io) 
### **Test execution with GitHub Action**
With every push made to the **master branch**, GitHub Action triggers a workflow to execute all Test Suites.
### **Integration with GitHub Actions, Slack, and Artifacts**
This project is integrated with GitHub Actions, in every push to master, it will run the automation test execution. Furthermore, a connection has been set up with Artifacts to save and retrieve test reports, and with Slack to get updates regarding the status of test executions.

### **Test Artifacts**
Mochawesome is the report tool integrated with GitHub Actions, these reports are stored as artifacts. The report can be downloaded directly on the GitHub Artifact section.
With this flow, it can be easier to detect any issue and find it on the artifact document, since it allows more visibility on what failed. 
![artifact](https://github.com/user-attachments/assets/9bfca110-1227-434f-a44e-edcd9296c370)

### **Slack notifications**
When the GitHub action is executed, a notification with the test results is sent through the Slack channel. 
Additionally, an email is received with a notification about the results in case the E2E fails. 
![cypress_channel](https://github.com/user-attachments/assets/820e1bb1-f365-4f90-9a80-ef31c348ac30)
![failure_email](https://github.com/user-attachments/assets/ca674cbf-df26-40f4-a419-9ebf07a5501c)


### **Preview of the Test Runs in headless mode**

https://github.com/user-attachments/assets/b69c125d-e0ff-4063-9ab4-04ec4ddca578

https://github.com/user-attachments/assets/cd4f2c74-9a2c-4662-8270-f15334425259

https://github.com/user-attachments/assets/2a2bda31-9a6a-470b-94eb-23197c494273

