import matplotlib.pyplot as plt
import math

def gaussian(x, mu, sigma):
    return 1/(sigma*math.sqrt(2*math.pi)) * math.exp(-1/2*math.pow((x-mu)/sigma,2))

print(gaussian(0.07977830033089706, 0, 5))

X = range(-30,31,1)
Y5 = [gaussian(x, 0, 5) for x in X]
Y100 = [gaussian(x, 0, 100) for x in X]
Y200 = [gaussian(x, 0, 200) for x in X]

fig = plt.figure()
plt.grid()
plt.plot(X,Y5,'+-', label="SSP5")
"""
fig = plt.figure()
plt.grid()
plt.plot(X,Y100,'+-', label="SSP100")
fig = plt.figure()
plt.grid()
plt.plot(X,Y200,'+-', label="SSP200")
"""
plt.legend()

SSP = 5
X = range(0,31,1)
mutationSSP = []
mutation = []

for i in range(0,31,1):
    if i == 0:
        mutationSSP.append(gaussian(0, 0, SSP))
        mutation.append(gaussian(0,0,mutationSSP[0]))
    else:
        mutationSSP.append(gaussian(mutationSSP[i-1], 0, SSP))
        mutation.append(mutation[i-1]  + 
            gaussian(mutation[i-1], 0, mutationSSP[i]))

print(mutation)

fig1 = plt.figure()
plt.plot(X,mutationSSP,'+-', label="muatationSSP")
plt.plot(X,mutation,'+-', label="mutation")
plt.grid()
plt.legend()
plt.show()
