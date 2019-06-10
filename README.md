# SnakeGen 🐍

Head to this [website](http://projects.victormeunier.com/snakegen/index.html) to test it live!

<p align="center">
    <img src="ressources/snakegen_demo_maxSpeed.gif" alt="snakegen demo gif"/>
</p>

## What is it ?

SnakeGen is an implementation of the basic genetic algorithm applied to neural networks. An **environment** is created and will evolve multiple **generations**. Each of them has a certain amounts of **agents**, that have their owns genes (a neural network) to play snake.

### Genetic algorithm

There are a lot of implementation of the idea of genetic algorithms. We went with something simple, that mimics what we can observe in nature. The algorithm is as follows:

1. Create an initial generation of agents with random genes (random weights in the neural net)
2. Let the agents play or train on the task you assigned and keep track of how they're doing (their **fitness**)
3. Judge the agents based on their **fitness** and class them in descending order
4. Select X% of the fittest agents
5. Use these selected agents to breed a new population (create offsprings)
6. *(Optional) Keep the selected agents untouched for the next generation (elitism)*
7. Randomly mutate X genes of Y amount of the newly bred agents 
8. Goes to 2 and repeat until goal is reached


## What are we trying to achieve ?

### Goal

With this project we are first trying to have a better understanding of genetic algorithms (GA) and how they can be used to find the optimal weights of a neural network on a given task. The task here is the game snake. The goal for the agent, is to maximize its score (number of fruit eaten).

The interesting about GA is the ability of letting agents evolve to find themselves the best way to resolve a problem. In our approach, we are trying to be "as real" as possible, by giving kind of a realistic vision of the snake's environment to the agent. We want to give the agent the most unbiased view possible, in hope that it's going to be able to create a good internal representation of its environment and objective. 

## How to use ?

### Quickstart

![Snakegen quickstart gif](ressources/snakegen_quickstart.gif)
