import matplotlib.pyplot as plt
import numpy as np
import math
import random as rand

def gaussian(x, mu, variance):
    sigma = math.sqrt(variance)
    return 1/(sigma*math.sqrt(2*math.pi)) * math.exp(-1/2*math.pow((x-mu)/sigma,2))

def gaussian_limit(variance):
    
    Y_limit = 0.01
    
    return abs(math.sqrt(-1 * variance * (2 * math.log(Y_limit) + 
        math.log(2 * math.pi * variance))))

def plot_gaussian(variance, fig, label):
    
    Y_limit = 0.01
    X_limit = math.sqrt(-1 * variance * (2 * math.log(Y_limit) + 
        math.log(2 * math.pi * variance)))

    print(label + str(X_limit))

    X = np.linspace(-abs(X_limit), abs(X_limit), 10000)

    Y = [gaussian(x, 0, variance) for x in X]

    fig.plot(X, Y, '-', label=label)

def ramp(x, a, b, limitX, limitY):

    value = a * x / limitX + b

    if value > limitY:
        return limitY
    elif value < 0.16:
        return 0.16
    else:
        return value

def sigmoid(x, limitX, limitY):

    value = limitY / (1 + math.exp(- (x - limitX / 2) * 30 / limitX / 2))

    if value < 0.16:
        return 0.16
    else:
        return value

def tanh(x, limitX, limitY):

    value = (limitY / 2 * math.tanh((x - limitX / 2) / 20)) + limitY / 2

    if value < 0.16:
        return 0.16
    else:
        return value

def atan(x, limitX, limitY):

    value = (limitY / (math.pi) * math.atan((x - limitX / 2) / 5)) + limitY / 2

    if value < 0.16:
        return 0.16
    else:
        return value

def plot_mutation(limit, limitMutation, method):

    X = range(0, limit)
    Y_addition = []
    Y_factor = []
    Y_ownFactor = []
    variance = []
    mutation = []
    mutationMax = []
    
    for i in X:

        if(method == "ramp"):
            variance.append(ramp(i, limit, 0.16, limit, limitMutation))
        elif(method == "sigmoid"):
            variance.append(sigmoid(i, limit, limitMutation))
        elif(method == "tanh"):
            variance.append(tanh(i, limit, limitMutation))
        elif(method == "atan"):
            variance.append(atan(i, limit, limitMutation))

        lim = gaussian_limit(variance[i])
        randValue = rand.uniform(-lim, lim)

        mutation.append(
            math.copysign(gaussian(randValue, 0, variance[i]), randValue))
        mutationMax.append(gaussian(0, 0, variance[i]))

        if i > 0:
            # Addition : W = W + m
            Y_addition.append(Y_addition[i-1] + mutation[i])
            # Own factor : W = W + W * m
            Y_ownFactor.append(Y_ownFactor[i-1] + Y_ownFactor[i-1] * 
                mutation[i])    
    
        else:
            Y_addition.append(mutation[i])
            Y_factor.append(mutation[i])
            Y_ownFactor.append(mutation[i])
        
    fig = plt.figure()
    plot = fig.add_subplot(111)
    plot.grid()
    
    #plot.plot(X,variance,'-', label='Variance')

    plot.plot(X,Y_addition,'-', label='Mutation : W + m')
    #plot.plot(X,Y_factor,'-', label='Mutation : W * m')
    #plot.plot(X,Y_ownFactor,'-', label='Mutation : W + W * m')

    plot.plot(X,mutation,'-', label='mutation intensity')
    plot.plot(X,mutationMax,'-', label='Maximum mutation intensity')
    
    plot.legend()  
    fig.suptitle("Mutation : " + str(method))


print(gaussian(0.07977830033089706, 0, 5))

fig = plt.figure()
plot = fig.add_subplot(111)
plot.grid()

plot_gaussian(0.16, plot, "0.16")
plot_gaussian(0.2, plot, "0.2")
plot_gaussian(1, plot, "1")
plot_gaussian(5, plot, "5")
plot_gaussian(10, plot, "10")
plot_gaussian(1000, plot, "1000")

plt.legend()

# fig2 = plt.figure()
# plot2 = fig2.add_subplot(111)
# plot2.grid()

# variance = 0.2
# sigma = math.sqrt(variance)
# X = np.linspace(-2.0, 2.0, 10000)
# Y = [gaussian(x, 0, sigma) for x in X]
# Y2 = [math.exp(
#         (-1/(2*variance)) * math.pow(x,2) +
#         math.log(1/(2*math.pi*variance))/2) for x in X]

# plot2.plot(X,Y,'-',label='gauss')
# plot2.plot(X,Y2,'-',label='quadra')

plt.legend()

plot_mutation(limit = 200, limitMutation = 200, method = "ramp")
plot_mutation(limit = 200, limitMutation = 200, method = "sigmoid")
plot_mutation(limit = 200, limitMutation = 200, method = "tanh")
plot_mutation(limit = 200, limitMutation = 200, method = "atan")

"""
fig = plt.figure()

X = np.linspace(abs(0), abs(100), 10000)

Y = [atan(x, 100, 100) for x in X]

plt.plot(X, Y, '-')
"""

plt.show()
    