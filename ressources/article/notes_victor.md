# Blogpost

## Victor's notes

### Keypoints

- Measuring fitness correctly is hard
- Evolution will always take advantage of the flaws of the game, or the scoring system
- Evolution is strongly dependant on randomness (especially at the beginning)
  - There are ways to counter that though

### Redacted

#### Goal

Our goal was to use genetic algorithm (selection, breedind and mutation) to evolve an agent's neural network to play snake.

#### Inputs / outputs

When you want an agent to play a human game, you have to think about what vision of the game your agent will have. Us human, see the entire grid of the game at once, with the position of our snake and the food. That could be a way for our agent to see the world, each cell of the grid or even every pixel could be an input.

In our case, we chose the second opton, which is to take the snake's perspective. This case is closer to what a robot would see. We wanted to give it a more realistic view and that's why we went with a combination of "lines of sight", "cones of sight" and a sens for fruit presence. That gives us a total of 11 inputs (3 lines of sight, 4 cones of sight, 4 cones of fruit presence).

Let us explain you what they are precisely.

##### Lines of sight

From the snake's head, 3 "beam" will travel to its left, its right and forward, giving him a sense of the distance between its head and an eventual obstacle. These lines of sight are basically infinite in our case, but they could easily be limited, to simulate a more real environment.

##### Cones of sight / Fruit presence

To give our agent a more "realistic view", we wanted to add some kind of "continous" vision of the world. We added what we call "cones of sight" which are basically 4 cones. The inputs are simply the area of each cones.

On the same principle, 4 more inputs will have the fruit presence in the 4 previously defined cones. By having 4 separate inputs for the fruit presence we give the agent the ability to prioritze what is important for him. The cones of sight could be used to determine the best path (where there are more space to move) while the fruit presence input give the agent a general direction towards the goal.

##### Outputs

The outputs are pretty straight forward, again we use the snake's perspective. The agent can go forward, left and right. Going backward is not possible for multiple reasons, but basically because it's not useful and would result in the snake dying instantly when its size is at least two.

#### Snake's performance

First of all, we tried for a long time to judge the snakes only at the end of their game. We would evaluate their score and the time they stay alive. The problem is that it's like trying to monitor the progress of someone with the eyes banded during their training.. It's not very effective, and that's quickly showing up in the snakes' behavior. They eventually start to go in circle forever. That assure them to stay alive. Because we also monitor the score, they will eventually start by eating a few fruits, but will go back to circles. 

To solve that, we need a way to monitor them continuously. We will still not interfer while they are playing, but we'll evaluate each of their move. At each step, we calculate the euclidean distance between the head and the fruit. If the snake moves away it looses distance points, and the opposite happens if it moves towards the fruit. By doing that, we no longer judge the snake only at the end, we have a vision of its bevahiour through the whole training. It makes it easier to select snakes that tend to go towards the fruit.

In general in reinforcement learning, how you choose to evaluate your agent is key. Keep in mind that your agents will evolve to be better at what you evaluate them.
