import sympy as sp
import autograd.numpy as np
from autograd import grad
import matplotlib.pyplot as plt

# Get the function and point from the user
function = input("Enter a function: ")
point = float(input("Enter a point to compute the derivative: "))

# Define the function using the user's input
x = sp.symbols('x')
f = sp.sympify(function)

# Compute the derivative of the function at the specified point using Autograd
df = grad(f)
dydx = df(point)

# Compute the value of the function and its derivative at the specified point
y = f.subs(x, point)
dydx_algebraic = sp.diff(f, x).subs(x, point)

# Define the tangent line
tangent_line = lambda x: y + dydx * (x - point)

# Print the algebraic solution
print("The derivative of f(x) at x = {} is: {}".format(point, dydx_algebraic))

# Plot the function and tangent line
x = np.linspace(point - 2, point + 2, 100)
plt.plot(x, f.subs(x, x))
plt.plot(x, tangent_line(x))
plt.scatter(point, y, color='red')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Automatic Differentiation Example')
plt.legend(['Function', 'Tangent Line', 'Point of Interest'])
plt.show()
