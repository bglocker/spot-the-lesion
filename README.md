# About this repository 

The main challenge of illustrating and promoting research into AI for medical imaging is introducing technical concepts while sparking the interest of the proportion of the public that is passionate about science and research. Novel techniques such as a complex lesion-recognition model can be tedious to present to general audiences due to their lack of technical knowledge, as well as the fact that the average person is unfamiliar with the way in which lesions are detected.

One way of enabling the average person to understand and appreciate the improvement brought by an advanced lesion-detection AI is seeing the AI in action in an interactive and engaging scenario. One effective way of doing this, which is the starting point of this project, is through a game, in which users can compete against the AI in a contest.

The application presented in this report, Spot-the-Lesion, is a complete redesign and extension of an existing online game with the same name, which has at its centre an AI for lesion spotting. The result is a fully-fledged scalable application that is easy to deploy and extend, enabling a broad audience to interact and learn more about how an AI manages to detect lesions by directly competing against it. The game is played in a set number of rounds. Each round, the player is given a CT medical scan containing a lesion, which they have to correctly identify by clicking (or tapping, if using a mobile device) on the area where the lesion is.

The final game, found at https://cb3618.pages.doc.ic.ac.uk/spot-the-lesion/, introduces the user to different game modes, challenges and the possibility to compete with others through leaderboards or directly through game-sharing. This application also tracks various user interactions within the game, such as the click history on each round in the form of heatmaps or user / AI win ratio, to recognize how the average human performs against a specialised lesion-recognition AI.

The overall goal of all these features is to attract and retain users, increasing the replayability potential of the game. The users are encouraged to compete with one another, stimulating them to explore the application in order to learn how to spot lesions better and, consequently, making them more interested in understanding how the AI actually works. However, if interpersonal competition is uninteresting for some of them, then perhaps they might enjoy competing with themselves, in order to uncover a number of hidden achievements and badges. Spot-the-Lesion is ultimately an innovative education tool which enables large groups of people to directly engage in the difficult medical challenge of identifying lesions and see how AI can be used to tackle such a task automatically.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
