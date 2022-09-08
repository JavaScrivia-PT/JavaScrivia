# Iteration on JavaScrivia
A trivia app for JavaScript

# Overview
With this iteration project we aimed to overhaul and refactor the pre-existing legacy code created by team Axolotl.

# Here's what we changed: 

For our team's MVP (minimum viable product) we aimed to enhance this product's authentication by utilizing bcrypt hashing. We also aimed to increase this site's scalability and user friendliness by saving each user's completed progress in our SQL database, and making use of TDD (test driven development) to assure the robustness of our project.

The first step for our team before getting started on the MVP  would involve getting situated with the legacy code and refactoring  to resolve some bugs. This included reconfiguring the webpack to correctly bundle the frontend, and backend portion of the code. In addition we altered their package.json to setup the development and production environment. We also increased efficiency by refactoring the code to only make a fetch call to the API once rather than everytime the client intiated the next question. We also had to create our own SQL database modeled after theirs with the addition of another column and one more table related to this main table to store favorites.


Once we successfully achieved our MVP goals we began integrating new features. This would include adding fucntionality that allowed users to return to the last question they left off at rather than beginning from the start as well as displaying the user's progress and accuracy in the form a tracker. The progress meter strictly checked how far the person has made it through the list of questions, while the accuracy meter strictly checks how accurate the user's performance currently is. In contrast to that, our leaderboard displays this accuracy information based off our database allowing for more stability. We also implemented a reset button which would reset the score, progress, correct answers, incorrect answers, leaderboard position, and send the client back to the first question. We also improved the legitimacy of our website by randomizing the order of the answers for the questions. This way users wouldn't be able to memorize answer orders. We then implemented a favorite button that would add user's favorite questions to our SQL database. This would be toggleable, and we created a display for the user to see their favorite questions. In addition to our encrpytion improving secuity, we also made the small change of hiding users passwords during formation and submition. With regards to TDD, we leveraged the power of tools like JEST, supertest, and puppeter to complete unit tests on the express middleware, end to end tests on log in and sign up, and route integration testing to check all endpoints in our server. Finally we updated the UI/UX with regards to styling. 

# Stretch Goals: 

Our group had a couple stretch goals that we would have liked to complete given more time. One such goal was to randomize the order of the questions as well, rather than having them travel linearly. We also considered some small changes like adding a timer, or a coding sandbox for the client to type code into. Our more extensive stretch goals would include returning questions that clients were weaker at, and implementing functionality that allowed users to create their own quiz packs with their own questions. 

# Technical Difficulities
***
* Rendering Browser router components in testing-library/react
* Asynchronicity issues with the unit testing
* Managing state in this complex frontend heavy project
* Using the pre-existing SQL database provided problems with encrypted password length
* As the scope of the application grew, tracking bugs became more and more difficult


**Model of our UI/UX idea**
![IMG_3885](https://user-images.githubusercontent.com/13509166/189236094-e90dcae7-d09e-4917-890a-b16f7e7db05f.jpg)
**SQL visualization (prior to adding favorites table)**
![4f4ae793aac51d1d07341d9e6b8bcd1b](https://user-images.githubusercontent.com/13509166/189236158-81d208e7-682a-4cc8-9d6c-1c452a2b6744.png)

**TDD visuals**

<img width="634" alt="Screen Shot 2022-09-08 at 5 35 46 PM" src="https://user-images.githubusercontent.com/13509166/189236318-e294b1d1-8c1b-4700-9298-694f7d56a325.png">
<img width="634" alt="Screen Shot 2022-09-08 at 5 42 04 PM" src="https://user-images.githubusercontent.com/13509166/189236345-cbdc7b61-5203-446d-a33a-ecc2245b200b.png">
<img width="645" alt="Screen Shot 2022-09-08 at 5 52 19 PM" src="https://user-images.githubusercontent.com/13509166/189236369-ca3692e4-085d-481f-b8e9-7e85eb578de5.png">

# Technologies
**SQL, Node, React, Express, JEST, Supertest, Puppeter**

# Group members 

**Adam Ethan Brian Serena Luke**


