Try it here:

https://samblackmore.github.io/calculator/


# Approach

### 1. Parse string
Split the string into an array where numbers, including floats, are converted to the number type.

### 2. Solve brackets
While brackets are found, solve their contents - starting with the most nested brackets.

### 3. Solve contents
Solve each order of precedence in turn. Operators of the same precedence are solved in the order left to right.
