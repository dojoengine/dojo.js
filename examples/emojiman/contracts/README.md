<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/mark-dark.svg">
  <img alt="Dojo logo" align="right" width="80" src=".github/mark-light.svg">
</picture>

![Turn based](https://img.shields.io/badge/Turn_based-8A2BE2)
![Rock paper scissors](https://img.shields.io/badge/Rock_Paper_Scissors-blue)
# Emojiman contracts

Player can be of type of rock/paper/scissors.
Players spawn on a 50 x 50 grid. Make 3 moves per turn. And try to kill as many as they can before getting killed. A kill happens when two players land on the same tile, regular RPS mechanics. Two players of same type can exist on the same tile.

## Data

* Player ID
* Position
* Energy
* Type
* ContractAddress

## Actions

* Spawn 
  - Assigns a player ID and spawns the contract address.
* Move
  - Submit 3 directions you want to move to.
* Tick
  - Runs the game turn processing all submitted moves.
  - Kills the players of different type on same tile.
