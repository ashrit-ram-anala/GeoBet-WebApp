[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/8ftu5XFr)
  # Change++ Fall 2024 Coding Challenge
Due 9/20 at 11:59 PM!

## Before You Begin

The next step in our process is completing the following coding project. We expect this to take at least 5 hours depending on experience level and technical skills. You will have approximately one week to complete the challenge. We recognize that you are all busy, but as a member of a Change++ team it is expected that you will dedicate 4-6 hours every week working on your project; therefore, we believe this is a reasonable timeframe.

**IMPORTANT INFORMATION:** In addition to this README.md, you have been given a csv with 50 geography related questions/answers inside of this git repository! You may use either this or an API to retrieve information for this challenge. More information on this is given below.

**Please read this document CAREFULLY and to its ENTIRETY! I know it's long but it contains all important information that will help!**

## What we are looking for

At Change++, our project teams are made up of members ranging from those in their first-year at Vanderbilt to those in graduate programs. We know that you all have varying degrees of technical skills and experience, all of which we will take into account when reviewing your code. Working on a Change++ team, you may often use a new technology that you are not familiar with and have not learned in CS courses at Vanderbilt, but we’re looking to see that you demonstrate the initiative and resourcefulness necessary to learn new skills and complete your work in a timely manner. You should be able to complete this challenge with a combination of basic programming skills (AP CS, 1101, 2201 etc.) and online resources.

As far as your code goes, here are a few high-level things we are looking for:
### Functionality
As always, the most important criteria is whether or not your code works according to the requirements. You should not only work to meet the requirements given, but also do your best to deliver a quality product, which may mean more than just completing the specification as stated.
### Good style and Readability
As this is an untimed challenge, we expect a certain level of quality. Be sure to comment and format your code as you might while working on an application for one of our non-profits. Keep in mind we will be reading and trying to understand your code. It is in your best interest to include intentional comments and meaningful commit messages.
### Organization and Extensibility
This goes along with good style. We want to see your ability to develop maintainable code. Although we will not actually build further upon this challenge, you should organize your work in an intuitive manner which would make it easy to build upon in the future. 
### Creativity
Change++ members are people who use creativity and initiative to get things done. There will likely be plenty of applicants who attempt this challenge, so it will benefit you to make your program stand out.

# The Challenge

*From Kyle Burgess, 2023-2024 Change++ President*: Every day in NYC, I would spend my subway rides playing Stack The Countries. It’s a geography trivia game released in 2011 that 9-year-old Kyle played religiously and that I’ve returned to due to a need for internet-free entertainment. The premise is simple: You are asked a multiple-choice trivia question where the answer is a country. If you get it right, you get to stack the country! Otherwise, you don’t. Easy. Sadly, this game has a limited number of questions it can ask you about each country and I’ve become pretty much a pro. **I need more spice**.

That’s where you come in. 

**Your goal is to build a geography trivia game web app that I will enjoy playing on my subway rides.**

To do this we are going to be requiring you to build two different services, a frontend and a backend, which together complete the project.

## The Frontend
The frontend serves as the way that a user would interact with your program and play the game. You have a lot of flexibility in terms of how you choose to build it ranging from a simple executable (ran from the terminal) to a website, app, or any (reasonable) technology you can think of. Feel free to get creative with styling components!

## The Backend
The backend consists of a RESTful API that can be accessed by the frontend and should do the following:
1. Retrieve questions related to geography
2. Validate the user's answer
3. Store the accuracy/score with a variable

Once again, there is a good amount of flexibility. If you choose to add bonus element such as hints or question categories, you can store/integrate them with the backend!

**Note:** There is more info about REST APIs below under the Tips, Tricks, and Helpful Resources section but here are some helpful links: 
1. [What is a REST API?](https://www.redhat.com/en/topics/api/what-is-a-rest-api)
2. [How to build a REST API with Node](https://www.toptal.com/nodejs/secure-rest-api-in-nodejs). 

## Game Loop

An example of a **basic** game loop is below.

<ol>
  <li>Before the game begins, manually start the backend server. This will probably look something like running a command ("python3 backend.py", "node server.js", "go run server.go", etc.)
  </li>
  <li>The user starts the game. </li>
  <li>The user is presented with a geography trivia question where the solution is a country.</li>
  <li>The user inputs their guess.</li>
  <li>The guess is graded and the user is informed whether they were correct or incorrect.</li>
  <li>Repeat steps 2-4 five times and present the user with their score.</li>
</ol>

NOTE: **This is an example of a very simple game loop.** To earn more points, please create your own game style. 

# Scoring

Frontend Framework: up to 5 points
<ul>
<li>
Necessary - Gameplay works
</li>
<li>
1 Point: No framework used (raw HTML/CSS)
</li>
<li>
3 Points Possible: React, Vue or Angular used
</li>
<li>
  4 Point Possible: React, Vue or Angular used with Typescript OR a component library
</li>
<li>
5 Points Possible: React, Vue or Angular used with Typescript AND a component library
</li>
</ul>
Frontend Coding Style: up to 3 points
Backend Framework: up to 3 points
<ul>
  <li>
Necessary - Gameplay works
</li>
<li>
2 Points Possible: Django, Springboot (any non-JS backend framework)
</li>
<li>
3 Points Possible: Node.js or Next
</li>
</ul>
Backend Coding Style: up to 3 points

Game Loop: up to 5 points
<ul>
<li>
1 Point: Basic question/answer game style
</li>
<li>
? Points Possible: Additional points added for a unique game style!
</li>
</ul>
Trivia Questions: up to 5 points
<ul>
  <li>1 Point: Uses provided CSV for questions</li>
  <li>3 Points Possible: Uses an API to generate geography questions</li>
  <li>5 Points Possible: EITHER uses an API to generate multi-medium geography questions (ex. images and sound as clues) OR uses web scraping to generate questions</li>
</ul>
Hints: up to 2 points
<ul><li>Allow the user to ask for a hint if they're stuck</li></ul>
Aesthetics: up to 3 points
<ul><li>Make your game pop! Spend some time on the styling of the website to gain points here</li></ul>
Creativity: up to 5 points
<ul><li>This is sort of our “extra credit” section. Any features you want to add that aren’t in the rubric can earn you extra points here. (for example: database for storing scores, a leaderboard, a game style we haven’t seen before (ex: Zi’s Tetris coding challenge from two years ago), authentication, custom assets if you feel they were not credited enough in the Aesthetics category, any points you feel were not awarded enough by other categories)
</li></ul>
README 
<ul>
<li>1 Point Possible - Well written README with full name, email, and a clear explanation on how to run program including packages to install eg npm install
</li>
</ul>

## Deliverables

Aside from adding, committing, and pushing your files to the repo, include a `README.txt`. **INCLUDE YOUR FULL NAME AND VANDERBILT EMAIL IN THE README.** A README is helpful because:
<ul> 
  <li>We may need additional information about reading or running your program</li>
  <li>We want to you to include a brief (under 100 words) reflection about the code you wrote</li>
  <li>We are interested in any feedback you provide about the project and a reflection on the code you wrote</li>
  <li>If you did  finish the exercise but would like to provide some ination about what you may have gotten done with more time or experience, and which steps you struggled with.</li>
  <li>Feel free to share anything else you want to tell us! This does include funny little jokes. I can neither confirm nor deny that funny little jokes can count toward bonus points (they unfortunately do not).</li>
</ul>

**IMPORTANT: When you have finished the project, you must fill out this this [form](https://docs.google.com/forms/d/e/1FAIpQLScgaXJXJOJbwVkisy7sdikDKJWnViI2jG9uLDJxoHWpn_wyWg/viewform?usp=sf_link) to let us know you are submitting the project in addition to including a README.txt. If you do not fill this out your submission will NOT be reviewed.** 


## Tips, Tricks, and Helpful Resources

**We will be holding workshops and office hours to help you out. The following are the dates for these workshops (location TBD):**
1. **Workshop (project overview, Git, and backend) & Office Hours:** September 9th, time and room TBD
     - [Slides](https://drive.google.com/file/d/1jfu3B5BnAJpa8Un-JW4o8PT2b6eV560z/view?usp=sharing)
2. **Office Hours:** September 12th, September 18th, dates and room are tentative

**If you have any general questions or want advice on how to get started/learn something, please email both Isa Dominguez & Carol He at isa.a.dominguez@vanderbilt.edu & carol.he@vanderbilt.edu (in one email) **


<ul>
  <li>Please look at Stack the Countries, Wordle, Geoguessr, and Typeracer for examples of “creative” game loops.</li>
  <li>DO NOT TRY TO USE C++ FOR THIS PROJECT! We will be impressed if you manage to pull it off but it would also be really hard. Python or JavaScript are probably the easiest language to use to meet the base requirements and is not that hard to learn for someone who knows C++. Java is also doable, but might be slightly harder.</li>
  <li>We are trying to simulate "real world development" in this project so Google is definitely your friend. Be resourceful!! (Specifically, if you don't know where to start, you can google how to make an API in Python/JavaScript/etc)</li>
  <li>RESTful API
    <ul>
      <li>If you have never made an API before, it might seem fairly tricky. It is supposed to be a bit challenging, but definitely achievable and should not require a massive amount of code. There is a working solution of the backend written in less than 50 lines of code (note that it is totally ok if your solution is longer and a shorter solution is not necessarily a better solution, aim for clarity in your code).</li>
      <li>If you want to write an API, my first suggestion would be to google "how to write an API in {language of choice}". Follow a tutorial and copy paste some code and work with it until you generally understand what it is doing, then try to modify it to work for this project</li>
      <li>For a general explanation of what RESTful APIs are and how they work, check out this link: https://searchapparchitecture.techtarget.com/definition/RESTful-API</li>
    </ul>
  </li>
  <li>Git
    <ul>
      <li>If you have never used git before it might seem a little daunting but it is actually, for this project at least, fairly straightforward. If you have any specific issues with it, try google and if you still can't figure it out, email isa.a.dominguez@vanderbilt.edu for help</li>
      <li>If you want a basic tutorial on Git, check out this link: https://hackernoon.com/understanding-git-fcffd87c15a3</li>
      <li>To get you on the right track, the only commands you should need to use for this are `git clone {repo}`, `git add .`, `git commit -m "message"`, and `git push`</li>
    </ul>
  </li>
  <li> Here's a list of some great geography APIs:
    <ul>
     <li> https://opentdb.com/ </li> 
     <li> https://restcountries.com/
      </li>
    </ul>
  </li>
  <li>Good luck!</li>
</ul>


## Stuck?
All good, this is expected! You've got plenty of options. First, check our workshop schedule - if your issue is with one of the topics, feel free to pop by and learn with us. Second, check our office hour (both workshop and office hours schedule are listed above). We would be happy to help you out with any errors you are encountering. Third, email Isa & Carol (isa.a.dominguez@vanderbilt.edu & carol.he@vanderbilt.edu) - if you can't attend office hours but still need help, send me an email and we can help you out.

### You got this! We believe that you can navigate the code and chart out a course to success. Start early so you don't have to Russia and there's Norway you will fail. You Can-ada do it!

## TLDR
1. Complete a coding challenge by 9/20, 11:59 PM
2. Objective: Build a game where players answer geography questions. The challenge comprises of developing both a frontend (user interface) and a backend (RESTful API for word retrieval).
3. Scoring Criteria: Projects are evaluated based on functionality, code quality, organization, creativity, and technology choices. Additional bonus points are available for features like using React or React Native for the frontend, integrating a timer, providing hints, and more.
5. Deliverables: Commit the code to a repository and include a README file with the applicant's full name, Vanderbilt email, a brief reflection on the code, and other relevant details. Additionally, fill out this [form](https://docs.google.com/forms/d/e/1FAIpQLScgaXJXJOJbwVkisy7sdikDKJWnViI2jG9uLDJxoHWpn_wyWg/viewform?usp=sf_link) to let us know you are submitting the project. 
6. Support & Resources: If stuck, applicants can attend workshops or office hours, or email Isa Dominguez & Carol He at isa.a.dominguez@vanderbilt.edu & carol.he@vanderbilt.edu.
